import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Alert,
  TextField,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { 
  APIProvider, 
  Map, 
  Marker,
  useAutocomplete,
} from '@vis.gl/react-google-maps';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";

const PlaceAutocomplete = ({ onPlaceSelect }) => {
  const [inputValue, setInputValue] = useState("");
  const { ref, suggestions, onInput, onSelect } = useAutocomplete({
    onPlaceSelect: (place) => {
      onPlaceSelect(place);
      setInputValue(place.displayName);
    },
    options: {
        types: ['establishment']
    }
  });

  return (
    <div>
      <TextField
        ref={ref}
        value={inputValue}
        onChange={onInput}
        fullWidth
        placeholder="Search for your business"
      />
      {suggestions.length > 0 && (
        <List>
          {suggestions.map((suggestion) => (
            <ListItem
              button
              key={suggestion.placeId}
              onClick={() => onSelect(suggestion)}
            >
              <ListItemText primary={suggestion.text} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

const AddBusinessLinkPage = () => {
    const navigate = useNavigate();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [businessDocId, setBusinessDocId] = useState(null);
    
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    useEffect(() => {
        const fetchBusinessDoc = async () => {
            const user = auth.currentUser;
            if (user) {
                const businessQuery = query(collection(db, "business_links"), where("userId", "==", user.uid));
                const businessSnapshot = await getDocs(businessQuery);
                if (!businessSnapshot.empty) {
                    setBusinessDocId(businessSnapshot.docs[0].id);
                } else {
                    setError("Could not find your business record. Please go back to the dashboard and try again.");
                }
            }
        }
        fetchBusinessDoc();
    }, []);

    const handleConfirm = async () => {
        if (!place || !businessDocId) {
            setError("No business selected or business record not found.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            const reviewUrl = `https://search.google.com/local/writereview?placeid=${place.id}`;
            const businessDocRef = doc(db, "business_links", businessDocId);
            
            await updateDoc(businessDocRef, {
                url: reviewUrl,
                placeId: place.id,
                businessName: place.displayName,
                address: place.formattedAddress,
                location: {
                    lat: place.location.lat,
                    lng: place.location.lng,
                }
            });
            
            navigate(`/business/your-qr-code/${businessDocId}`);
        } catch (err) {
            console.error("Failed to save business link: ", err);
            setError("Could not save your business information. Please try again.");
        }
        setLoading(false);
    };

    return (
        <APIProvider apiKey={googleMapsApiKey} libraries={['places']}>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Link Your Google Business Profile
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Find your business on Google to generate a direct review link and QR code. This ensures your customers can leave a review with a single scan.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Paper sx={{ p: 3, mt: 2 }}>
                    <PlaceAutocomplete onPlaceSelect={setPlace} />
                    
                    {place && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6">Confirm your business location</Typography>
                            <Paper variant="outlined" sx={{ p: 2, mt: 1, backgroundColor: '#f5f5f5' }}>
                                <Typography variant="h6">{place.displayName}</Typography>
                                <Typography color="text.secondary">{place.formattedAddress}</Typography>
                            </Paper>
                            <Box sx={{ height: '300px', mt: 2, borderRadius: 1, overflow: 'hidden' }}>
                                <Map
                                    defaultCenter={place.location}
                                    defaultZoom={17}
                                    gestureHandling={'greedy'}
                                    disableDefaultUI={true}
                                >
                                    <Marker position={place.location} />
                                </Map>
                            </Box>
                        </Box>
                    )}
                </Paper>

                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={loading || !place}
                    fullWidth
                    sx={{ mt: 3, py: 1.5 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Confirm and Next'}
                </Button>
            </Container>
        </APIProvider>
    );
};

export default AddBusinessLinkPage;