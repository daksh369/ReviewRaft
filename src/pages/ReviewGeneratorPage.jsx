import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  Slider,
  Chip,
  Button,
  Box,
  CircularProgress,
  Paper,
  Grid,
  Alert,
  Menu,
  MenuItem
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

const nationalLanguageMap = {
    'IN': 'hi',
};

const regionNameToCodeMap = {
    'Gujarat': 'GJ', 'Maharashtra': 'MH', 'Andhra Pradesh': 'AP',
    'Telangana': 'TS', 'West Bengal': 'WB', 'Tamil Nadu': 'TN',
    'Karnataka': 'KA', 'Kerala': 'KL',
};

const regionLanguageMap = {
    'IN': {
        'default': ['en', 'hi'],
        'AP': ['te', 'en'], 'TS': ['te', 'en'], 'WB': ['bn', 'en'],
        'MH': ['mr', 'en', 'hi'], 'TN': ['ta', 'en'], 'KA': ['kn', 'en'],
        'GJ': ['gu', 'en', 'hi'], 'KL': ['ml', 'en'],
    },
    'US': { 'default': ['en', 'es', 'zh'] }, 'GB': { 'default': ['en'] },
    'CA': { 'default': ['en', 'fr'] }, 'AU': { 'default': ['en'] },
    'DE': { 'default': ['de'] }, 'FR': { 'default': ['fr'] },
    'ES': { 'default': ['es'] }, 'MX': { 'default': ['es'] },
    'BR': { 'default': ['pt'] },
};

const experienceLevels = [
  { value: 0, emoji: '😠', label: 'Terrible' }, { value: 25, emoji: '😞', label: 'Bad' },
  { value: 50, emoji: '😐', label: 'Okay' }, { value: 75, emoji: '😊', label: 'Good' },
  { value: 100, emoji: '😍', label: 'Excellent' },
];

const ReviewGeneratorPage = () => {
  const [experience, setExperience] = useState(75);
  const [keywords, setKeywords] = useState([]);
  const [customKeyword, setCustomKeyword] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [keywordRatings, setKeywordRatings] = useState({});
  const [language, setLanguage] = useState( (navigator.language || navigator.userLanguage).split('-')[0]);
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

    const experienceDescription =
        experience > 75 ? 'an excellent' :
        experience > 50 ? 'a good' :
        experience > 25 ? 'an average' : 'a poor';
        
    const keywordDetails = Object.entries(keywordRatings)
        .map(([keyword, rating]) => `- ${keyword}: ${rating > 75 ? 'great' : rating > 50 ? 'good' : rating > 25 ? 'okay' : 'bad'}`)
        .join('\n');

    const prompt = `Generate a casual, friendly customer review in ${language} for a business named "${businessName}".

Please adhere to the following:
- The review must be based on the customer's feedback provided below.
- NEVER use placeholders like "[Business Name]". The review must be ready to publish.

Customer's Feedback:
- Overall experience: ${experienceDescription}
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
                  initialRatings[kw] = 75;
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
  
  useEffect(() => {
    const fetchLanguages = async () => {
        try {
            const response = await fetch('https://ipinfo.io/json');
            const data = await response.json();
            const countryCode = data.country;
            const regionName = data.region;
            const regionCode = regionNameToCodeMap[regionName];

            const browserLangCode = (navigator.language || navigator.userLanguage).split('-')[0];
            let stateLangCode = null;
            if (regionLanguageMap[countryCode] && regionCode && regionLanguageMap[countryCode][regionCode]) {
                stateLangCode = regionLanguageMap[countryCode][regionCode][0];
            }
            const nationalLangCode = nationalLanguageMap[countryCode] || (regionLanguageMap[countryCode] ? regionLanguageMap[countryCode].default[1] : null);

            const priorityCodes = [...new Set([browserLangCode, stateLangCode, nationalLangCode].filter(Boolean))];
            
            const finalLanguages = priorityCodes
                .map(code => allLanguages.find(lang => lang.code === code))
                .filter(Boolean);
            
            setDetectedLanguages(finalLanguages);
            setLanguage(browserLangCode);

        } catch (error) {
            console.error('Failed to fetch regional languages:', error);
            const browserLang = allLanguages.find(l => l.code === (navigator.language || navigator.userLanguage).split('-')[0]) || allLanguages[0];
            setDetectedLanguages([browserLang].filter(Boolean));
            setLanguage(browserLang.code);
        }
    };
    fetchLanguages();
  }, []);

  const handleAddKeyword = () => {
    if (customKeyword && !keywords.includes(customKeyword)) {
      setKeywords([...keywords, customKeyword]);
      setSelectedKeywords([...selectedKeywords, customKeyword]);
      setKeywordRatings({ ...keywordRatings, [customKeyword]: 50 });
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
      setKeywordRatings({ ...keywordRatings, [keyword]: 75 });
    }
  };

  const handleCopyAndAddReview = () => {
    if (!review || !businessLink) {
      return;
    }

    // Immediately open the new tab as a direct result of the user's click
    window.open(businessLink, '_blank');

    // Then, perform the background tasks
    navigator.clipboard.writeText(review);
    setIsSaving(true);
    
    // Fire and forget the database write operation
    addDoc(collection(db, "reviews"), {
        businessId: businessId,
        reviewText: review,
        language: language,
        overallExperience: experience,
        keywordRatings: keywordRatings,
        createdAt: serverTimestamp()
    }).then(() => {
        // Optional: handle success, e.g., show a temporary "Saved!" message
    }).catch(error => {
        // Handle the error, e.g., by logging it to an error reporting service
        console.error("Error saving review: ", error);
        // Optionally, inform the user that the save failed, though they have already been redirected.
    }).finally(() => {
        setIsSaving(false);
    });
  };
  
  const currentExperience = experienceLevels.find(e => e.value === experience);

  const handleOtherClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleMenuSelect = (langCode) => {
    setLanguage(langCode);
    if (!detectedLanguages.find(lang => lang.code === langCode)) {
      const newLang = allLanguages.find(lang => lang.code === langCode);
      if (newLang) {
        setDetectedLanguages([...detectedLanguages, newLang]);
      }
    }
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
          <Grid container spacing={1}>
            {detectedLanguages.map(lang => (
              <Grid item key={lang.code}>
                <Chip
                  label={lang.name}
                  clickable
                  onClick={() => setLanguage(lang.code)}
                  color={language === lang.code ? 'primary' : 'default'}
                />
              </Grid>
            ))}
            <Grid item>
              <Chip label="Other..." onClick={handleOtherClick} />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {allLanguages.map((lang) => (
                  <MenuItem key={lang.code} onClick={() => handleMenuSelect(lang.code)}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 2, mb: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>How was your experience?</Typography>
          <Typography variant="h2" sx={{ mb: 1 }}>{currentExperience.emoji}</Typography>
          <Slider
            value={experience}
            onChange={(e, newValue) => setExperience(newValue)}
            step={25}
            marks
            sx={{
              '& .MuiSlider-rail': { height: 8 },
              '& .MuiSlider-track': { height: 8 },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption">Negative</Typography>
            <Typography variant="caption">Positive</Typography>
          </Box>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 1 }}>
                <Typography variant="h5">😞</Typography>
                <Slider
                  value={keywordRatings[keyword] ?? 50}
                  onChange={(e, newValue) => setKeywordRatings({ ...keywordRatings, [keyword]: newValue })}
                  step={25}
                  marks
                  min={0}
                  max={100}
                />
                <Typography variant="h5">😍</Typography>
            </Box>
          </Paper>
        ))}

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>AI Generated Review</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Based on your feedback, here's a draft. Feel free to edit it.</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
            placeholder={!review && !loading ? "Click 'Generate' to create a review." : ""}
          />
        </Paper>
        
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'grey.600', mt: 2 }}>
            Powered by ReviewRaft
        </Typography>
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
