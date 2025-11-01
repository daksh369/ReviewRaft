import React, { useState, useEffect } from 'react';
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
} from '@vis.gl/react-google-maps';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useDebounce } from '../hooks/useDebounce';

const PlaceAutocomplete = ({ onPlaceSelect, apiKey }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const debouncedInput = useDebounce(inputValue, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedInput.length < 3) {
        setSuggestions([]);
        return;
      }
      
      const requestBody = {
        "textQuery": debouncedInput,
        "includedTypes": ["establishment"]
      };

      try {
        const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.displayName,places.id,places.formattedAddress,places.location'
          },
          body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            console.error('Failed to fetch autocomplete suggestions:', response.statusText);
            setSuggestions([]);
            return;
        }

        const data = await response.json();
        setSuggestions(data.places || []);
      } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedInput, apiKey]);

  const handleSelect = (place) => {
    setInputValue(place.displayName.text);
    setSuggestions([]);
    onPlaceSelect(place);
  };

  return (
    <div>
      <TextField
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        fullWidth
        placeholder="Search for your business"
      />
      {suggestions.length > 0 && (
        <List component="div" sx={{ position: 'relative' }}>
          <Paper sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1200, mt: 1 }}>
            {suggestions.map((place) => (
              <ListItem
                button
                key={place.id}
                onClick={() => handleSelect(place)}
              >
                <ListItemText primary={place.displayName.text} />
              </ListItem>
            ))}
          </Paper>
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
                businessName: place.displayName.text,
                address: place.formattedAddress,
                location: {
                    lat: place.location.latitude,
                    lng: place.location.longitude,
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
        <APIProvider apiKey={googleMapsApiKey}>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Link Your Google Business Profile
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Find your business on Google to generate a direct review link and QR code. This ensures your customers can leave a review with a single scan.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Paper sx={{ p: 3, mt: 2 }}>
                    <PlaceAutocomplete onPlaceSelect={setPlace} apiKey={googleMapsApiKey} />
                    
                    {place && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6">Confirm your business location</Typography>
                            <Paper variant="outlined" sx={{ p: 2, mt: 1, backgroundColor: '#f5f5f5' }}>
                                <Typography variant="h6">{place.displayName.text}</Typography>
                                <Typography color="text.secondary">{place.formattedAddress}</Typography>
                            </Paper>
                            <Box sx={{ height: '300px', mt: 2, borderRadius: 1, overflow: 'hidden' }}>
                                <Map
                                    defaultCenter={{lat: place.location.latitude, lng: place.location.longitude}}
                                    defaultZoom={17}
                                    gestureHandling={'greedy'}
                                    disableDefaultUI={true}
                                >
                                    <Marker position={{lat: place.location.latitude, lng: place.location.longitude}} />
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