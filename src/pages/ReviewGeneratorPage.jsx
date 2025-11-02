import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  Chip,
  Button,
  Box,
  CircularProgress,
  Paper,
  Grid,
  Alert,
  Menu,
  MenuItem,
  Rating
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleGenerativeAI } from "@google/generative-ai";
import QrCode2Icon from '@mui/icons-material/QrCode2';

const allLanguages = [
    { code: 'en', name: 'English' }, { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }, { code: 'de', name: 'Deutsch' },
    { code: 'hi', name: 'हिन्दी' }, { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' }, { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' }, { code: 'bn', name: 'বাংলা' },
    { code: 'te', name: 'తెలుగు' }, { code: 'mr', name: 'मराठी' },
    { code: 'ta', name: 'தமிழ்' }, { code: 'gu', name: 'ગુજરાતી' },
    { code: 'kn', name: 'ಕನ್ನಡ' }, { code: 'ml', name: 'മലയാളം' },
    { code: 'it', name: 'Italiano' },
];

const experienceLevels = [
  { value: 1, label: 'Terrible' }, { value: 2, label: 'Bad' },
  { value: 3, label: 'Okay' }, { value: 4, label: 'Good' },
  { value: 5, label: 'Excellent' },
];

const ReviewGeneratorPage = () => {
  const [experience, setExperience] = useState(4); // Default to 4 stars
  const [keywords, setKeywords] = useState([]);
  const [customKeyword, setCustomKeyword] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [keywordRatings, setKeywordRatings] = useState({});
  const [language, setLanguage] = useState((navigator.language || navigator.userLanguage).split('-')[0]);
  const [detectedLanguages, setDetectedLanguages] = useState([]);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessLink, setBusinessLink] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const businessId = queryParams.get('business_id');

  const handleGenerateReview = useCallback(async () => {
    setLoading(true);
    setError('');
    
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: import.meta.env.VITE_GEMINI_MODEL_NAME });

    const experienceDescription = experienceLevels.find(e => e.value === experience)?.label || 'a';
        
    const keywordDetails = Object.entries(keywordRatings)
        .map(([keyword, rating]) => `- ${keyword}: ${experienceLevels.find(e => e.value === rating)?.label || 'average'}`)
        .join('\n');

    const prompt = `Generate a casual, friendly customer review in ${language} for a business named "${businessName}".

Please adhere to the following:
- The review must be based on the customer's feedback provided below, on a scale of 1 to 5 stars.
- NEVER use placeholders like "[Business Name]". The review must be ready to publish.

Customer's Feedback:
- Overall experience: ${experienceDescription} (${experience} stars)
- Specific feedback:
${keywordDetails}

Review:`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/^"|"$/g, '').replace(/\*/g, '');
        setReview(text);
    } catch (err) {
      setError('Failed to generate review. Please try again.');
      console.error('Error generating review:', err);
    } finally {
      setLoading(false);
    }
  }, [experience, keywordRatings, language, businessName]);

  useEffect(() => {
    const fetchBusinessData = async () => {
      if (businessId) {
        setLoading(true);
        setError('');
        try {
            const linkDocRef = doc(db, 'business_links', businessId);
            const linkDocSnap = await getDoc(linkDocRef);

            if (linkDocSnap.exists()) {
              const linkData = linkDocSnap.data();
              setBusinessLink(linkData.url);
              setBusinessName(linkData.businessName || '');

              if (linkData.highlightTabs && linkData.highlightTabs.length > 0) {
                setKeywords(linkData.highlightTabs);
                const preSelected = linkData.highlightTabs.slice(0, 3);
                setSelectedKeywords(preSelected);
                const initialRatings = {};
                preSelected.forEach(kw => {
                  initialRatings[kw] = 4; // Default to 4 stars
                });
                setKeywordRatings(initialRatings);
              }
            }
        } catch (err) {
            setError('Failed to load business data. Please try again.');
            console.error('Error fetching business data:', err);
        } finally {
            setLoading(false);
        }
      }
    };
    fetchBusinessData();
  }, [businessId]);
  
  // Language detection useEffect... (omitted for brevity, no changes needed)

  const handleAddKeyword = () => {
    if (customKeyword && !keywords.includes(customKeyword)) {
      setKeywords([...keywords, customKeyword]);
      setSelectedKeywords([...selectedKeywords, customKeyword]);
      setKeywordRatings({ ...keywordRatings, [customKeyword]: 3 }); // Default to 3 stars
      setCustomKeyword('');
    }
  };

  const handleKeywordClick = (keyword) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter((k) => k !== keyword));
      const newRatings = { ...keywordRatings };
      delete newRatings[keyword];
      setKeywordRatings(newRatings);
    } else {
      setSelectedKeywords([...selectedKeywords, keyword]);
      setKeywordRatings({ ...keywordRatings, [keyword]: 4 }); // Default to 4 stars
    }
  };

  const handleCopyAndAddReview = () => {
    if (!review || !businessLink) return;
    window.open(businessLink, '_blank');
    navigator.clipboard.writeText(review);
    setIsSaving(true);
    
    addDoc(collection(db, "reviews"), {
        businessId: businessId,
        reviewText: review,
        language: language,
        overallExperience: experience,
        keywordRatings: keywordRatings,
        createdAt: serverTimestamp()
    }).catch(error => {
        console.error("Error saving review: ", error);
    }).finally(() => {
        setIsSaving(false);
    });
  };
  
  const handleOtherClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleMenuSelect = (langCode) => {
    setLanguage(langCode);
    handleMenuClose();
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f5f5f5', minHeight: '100vh', pb: 10 }}>
      <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }} elevation={1}>
        <Toolbar>
          <QrCode2Icon sx={{ fontSize: 28, mr: 1, color: '#1A73E8' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {businessName || 'Leave a Review'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Review Language</Typography>
          {/* Language selection UI... */}
        </Paper>

        <Paper sx={{ p: 2, mb: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>How was your experience?</Typography>
          <Rating 
            name="experience-rating"
            value={experience}
            onChange={(event, newValue) => {
              if (newValue !== null) setExperience(newValue);
            }}
            size="large"
          />
        </Paper>

        <Paper sx={{ p: 2, mb: 2, minHeight: '150px' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Select highlights of your experience</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {keywords.map((keyword) => (
                <Chip
                    key={keyword}
                    label={keyword}
                    clickable
                    onClick={() => handleKeywordClick(keyword)}
                    color={selectedKeywords.includes(keyword) ? 'primary' : 'default'}
                />
                ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="Add custom highlight..."
                    value={customKeyword}
                    onChange={(e) => setCustomKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                />
                <IconButton onClick={handleAddKeyword}>
                    <Add />
                </IconButton>
            </Box>
        </Paper>

        {selectedKeywords.map(keyword => (
          <Paper key={keyword} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{keyword}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, px: 1 }}>
                <Rating
                  name={`rating-${keyword}`}
                  value={keywordRatings[keyword] ?? 3}
                  onChange={(event, newValue) => {
                    if (newValue !== null) setKeywordRatings({ ...keywordRatings, [keyword]: newValue });
                  }}
                />
            </Box>
          </Paper>
        ))}

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>AI Generated Review</Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={handleGenerateReview}
            disabled={loading || selectedKeywords.length === 0}
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate'}
          </Button>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </Paper>
        
      </Box>

      <Box sx={{ p: 2, position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', boxShadow: '0 -2px 5px rgba(0,0,0,0.1)' }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleCopyAndAddReview}
          disabled={!review || isSaving}
        >
          {isSaving ? <CircularProgress size={24} /> : 'Copy & Add Review'}
        </Button>
      </Box>
    </Box>
  );
};

export default ReviewGeneratorPage;
