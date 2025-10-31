import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { generateHighlightTabs } from '../../ai/generative';

function ProfileSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State to hold data from both user and business documents
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    description: '',
    highlightTabs: [],
  });

  // State to hold the document IDs for updating
  const [userDocRef, setUserDocRef] = useState(null);
  const [businessDocRef, setBusinessDocRef] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        try {
          // 1. Fetch user data (fullName)
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          let userData = {};
          if (userSnap.exists()) {
            setUserDocRef(userRef);
            userData = userSnap.data();
          }

          // 2. Fetch business data (businessName, description, tabs)
          const businessQuery = query(collection(db, "business_links"), where("userId", "==", user.uid));
          const businessSnapshot = await getDocs(businessQuery);
          let businessData = {};
          if (!businessSnapshot.empty) {
            const businessDoc = businessSnapshot.docs[0];
            setBusinessDocRef(businessDoc.ref);
            businessData = businessDoc.data();
          }
          
          // 3. Combine data into a single state object for the form
          setFormData({
            fullName: userData.fullName || '',
            businessName: businessData.businessName || '',
            description: businessData.description || '',
            highlightTabs: businessData.highlightTabs || [],
          });

        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch profile data.");
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Update user document if it exists
      if (userDocRef) {
        await updateDoc(userDocRef, {
          fullName: formData.fullName,
        });
      }
      // Update business document if it exists
      if (businessDocRef) {
        await updateDoc(businessDocRef, {
          businessName: formData.businessName,
          description: formData.description,
          highlightTabs: formData.highlightTabs,
        });
      }
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleRegenerateTabs = async () => {
    setLoading(true);
    setError('');
    try {
      const newTabs = await generateHighlightTabs(formData.description);
      setFormData({ ...formData, highlightTabs: newTabs });
    } catch (e) {
      console.error("Error generating highlight tabs:", e);
      setError("Failed to regenerate highlight tabs.");
    }
    setLoading(false);
  };

  const handleDeleteTab = (tabToDelete) => {
    const updatedTabs = formData.highlightTabs.filter(tab => tab !== tabToDelete);
    setFormData({ ...formData, highlightTabs: updatedTabs });
  };

  const handleAddTab = () => {
    if (newTab && !formData.highlightTabs.includes(newTab)) {
      const updatedTabs = [...formData.highlightTabs, newTab];
      setFormData({ ...formData, highlightTabs: updatedTabs });
      setNewTab('');
    }
  };
  const [newTab, setNewTab] = useState('');

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile Settings
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Your Information
        </Typography>
        <TextField
          label="Your Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Business Name"
          name="businessName"
          value={formData.businessName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Business Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
      </Paper>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Review Highlight Tabs
          </Typography>
          <IconButton onClick={handleRegenerateTabs} disabled={loading || !formData.description}>
            <RefreshIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          These tabs will be shown to customers to help them write their review.
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {formData.highlightTabs && formData.highlightTabs.map((tab, index) => (
            <Chip key={index} label={tab} onDelete={() => handleDeleteTab(tab)} />
          ))}
        </Box>
        <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
          <TextField
            label="Add new tab"
            value={newTab}
            onChange={(e) => setNewTab(e.target.value)}
            size="small"
          />
          <Button onClick={handleAddTab} variant="outlined" startIcon={<AddIcon />}>
            Add
          </Button>
        </Box>
      </Paper>

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdateProfile}
        disabled={loading}
        sx={{ mt: 4, py: 1.5 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Save Changes'}
      </Button>
    </Container>
  );
}

export default ProfileSettingsPage;
