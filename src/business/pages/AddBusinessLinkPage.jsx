import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton
} from '@mui/material';
import { Storefront } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useDebounce } from '../hooks/useDebounce'; 

function PlaceAutocomplete({ onPlaceSelect }) {
    const [predictions, setPredictions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const debouncedSearchText = useDebounce(inputValue, 500);

    const handleSearch = useCallback(async (text) => {
        if (!text) {
            setPredictions([]);
            return;
        }

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        const url = 'https://places.googleapis.com/v1/places:searchText';

        const headers = {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress'
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify({ textQuery: text }),
            });

            if (!response.ok) {
                console.error("Failed to fetch places:", response.statusText);
                setPredictions([]);
                return;
            }

            const data = await response.json();
            setPredictions(data.places || []);
        } catch (error) {
            console.error("Error searching for places:", error);
            setPredictions([]);
        }
    }, []);

    useEffect(() => {
        handleSearch(debouncedSearchText);
    }, [debouncedSearchText, handleSearch]);

    const handleSuggestionClick = (place) => {
        onPlaceSelect(place);
        setInputValue(place.displayName.text);
        setPredictions([]);
    };

    return (
        <Box>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search for your business name or address"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            {predictions.length > 0 && (
                <Paper elevation={3} sx={{ mt: 1 }}>
                    <List>
                        {predictions.map((place) => (
                            <ListItem key={place.id} disablePadding>
                                <ListItemButton onClick={() => handleSuggestionClick(place)}>
                                    <ListItemIcon>
                                        <Storefront />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={place.displayName.text} 
                                        secondary={place.formattedAddress} 
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
}

function AddBusinessLinkPage() {
    const navigate = useNavigate();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [existingLink, setExistingLink] = useState(null);

    useEffect(() => {
        const checkExistingLink = async () => {
            const user = auth.currentUser;
            if (user) {
                const q = query(collection(db, "business_links"), where("userId", "==", user.uid));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    setExistingLink({ id: doc.id, ...doc.data() });
                }
            }
        };
        checkExistingLink();
    }, []);

    const handleSaveLink = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        const user = auth.currentUser;
        if (user && place) {
            const reviewUrl = `https://search.google.com/local/writereview?placeid=${place.id}`;
            try {
                const docRef = await addDoc(collection(db, "business_links"), {
                    userId: user.uid,
                    placeId: place.id,
                    businessName: place.displayName.text,
                    address: place.formattedAddress,
                    url: reviewUrl,
                    createdAt: new Date(),
                });
                setSuccess("Business link saved successfully!");
                navigate(`/business/your-qr-code/${docRef.id}`);
            } catch (err) {
                setError(err.message);
            }
        }
        setLoading(false);
    };

    return (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Find your business
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Search for your business name or address to automatically link your review page.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                {existingLink && (
                    <Alert severity="info" action={
                        <Button color="inherit" size="small" onClick={() => navigate(`/business/your-qr-code/${existingLink.id}`)}>
                            View QR Code
                        </Button>
                    }>
                        You already have a QR code linked to: {existingLink.businessName}
                    </Alert>
                )}

                <Paper sx={{ p: 3, mt: 2 }}>
                    <PlaceAutocomplete onPlaceSelect={setPlace} />
                    {place && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6">Confirm your business location</Typography>
                            <Paper variant="outlined" sx={{ p: 2, mt: 1, backgroundColor: '#f5f5f5' }}>
                                <Typography variant="h6">{place.displayName.text}</Typography>
                                <Typography color="text.secondary">{place.formattedAddress}</Typography>
                            </Paper>
                            <Box sx={{ height: '300px', mt: 2, borderRadius: 1, overflow: 'hidden' }}>
                                <Map
                                    defaultCenter={{ lat: 22.5726, lng: 88.3639 }} // This should be updated based on place location
                                    defaultZoom={15}
                                    gestureHandling={'greedy'}
                                    disableDefaultUI={true}
                                >
                                </Map>
                            </Box>
                        </Box>
                    )}
                </Paper>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveLink}
                    disabled={!place || loading || existingLink}
                    fullWidth
                    sx={{ mt: 4, py: 1.5 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Confirm & Next'}
                </Button>
            </Container>
        </APIProvider>
    );
}

export default AddBusinessLinkPage;
