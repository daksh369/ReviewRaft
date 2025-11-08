import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Alert,
  IconButton
} from '@mui/material';
import { Download, Refresh, ContentCopy, Edit, LocationOn } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../../firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { QRCodeCanvas } from 'qrcode.react';

function YourQrCodePage() {
    const { docId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [qrCodeValue, setQrCodeValue] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [businessData, setBusinessData] = useState(null);
    const qrCodeRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const triggerQRCodeGeneration = useCallback(() => {
        const uniqueQrCodeValue = `${window.location.origin}/review?business_id=${docId}&t=${Date.now()}`;
        setQrCodeValue(uniqueQrCodeValue);
        setIsGenerating(true);
    }, [docId]);

    // This effect runs after a new QR code value is set and isGenerating is true
    useEffect(() => {
        if (isGenerating && qrCodeRef.current) {
            const canvas = qrCodeRef.current.querySelector('canvas');
            if (canvas) {
                const dataUrl = canvas.toDataURL('image/png');
                const storageRef = ref(storage, `qrcodes/${docId}.png`);
                
                uploadString(storageRef, dataUrl, 'data_url').then(async () => {
                    const downloadURL = await getDownloadURL(storageRef);
                    setQrCodeUrl(downloadURL);
                    await updateDoc(doc(db, "business_links", docId), {
                        qrCodeUrl: downloadURL,
                        qrCodeValue: qrCodeValue,
                    });
                }).catch(err => {
                    console.error("Error uploading QR code:", err);
                    setError("Failed to save the new QR code.");
                }).finally(() => {
                    setIsGenerating(false); // This is crucial to stop the loading state
                });
            } else {
                // If canvas is not found, stop generating to prevent infinite loop
                setIsGenerating(false);
            }
        }
    }, [isGenerating, docId, qrCodeValue]);

    useEffect(() => {
        const fetchQrCode = async () => {
            if (!docId) {
                setError("No business ID provided.");
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const docRef = doc(db, "business_links", docId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setBusinessData(data);
                    if (data.qrCodeUrl && data.qrCodeValue) {
                        setQrCodeValue(data.qrCodeValue);
                        setQrCodeUrl(data.qrCodeUrl);
                    } else {
                        triggerQRCodeGeneration();
                    }
                } else {
                    setError("Business link not found.");
                }
            } catch (err) {
                console.error("Error fetching QR Code:", err);
                setError("Failed to load QR code data.");
            } finally {
                setLoading(false);
            }
        };
        fetchQrCode();
    }, [docId, triggerQRCodeGeneration]);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = `${businessData?.businessName?.replace(/\s+/g, '-') || 'business'}-qr-code.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(qrCodeValue);
    };
    
    const handleEdit = () => {
        navigate('/business/add-business-link');
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Your QR Code
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Print this QR code and display it at your business location for customers to scan.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper sx={{ p: 4, display: 'inline-block' }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Box sx={{ position: 'relative', width: 256, height: 256 }}>
                        {/* Always render the canvas if qrCodeValue exists, so we can reference it */}
                        {qrCodeValue && (
                            <Box ref={qrCodeRef} sx={{ display: 'none' }}>
                                <QRCodeCanvas value={qrCodeValue} size={256} />
                            </Box>
                        )}
                        
                        {/* Show loader or final image */}
                        {isGenerating ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                <CircularProgress />
                            </Box>
                        ) : qrCodeUrl ? (
                            <img src={qrCodeUrl} alt="QR Code" width={256} height={256} />
                        ) : (
                             <Typography variant="caption">QR Code not available. Try refreshing.</Typography>
                        )}
                    </Box>
                )}
            </Paper>

            {businessData && (
                <Box sx={{ mt: 2, color: 'text.secondary' }}>
                    <Typography variant="subtitle1" component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LocationOn sx={{ mr: 1, fontSize: '1.2rem' }} /> {businessData.businessName}
                    </Typography>
                    <Typography variant="caption">{businessData.address}</Typography>
                </Box>
            )}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button variant="contained" startIcon={<Download />} onClick={handleDownload} disabled={!qrCodeUrl || loading || isGenerating}>
                    Download
                </Button>
                <Button variant="outlined" startIcon={<ContentCopy />} onClick={handleCopyToClipboard} disabled={!qrCodeValue || loading || isGenerating}>
                    Copy Link
                </Button>
                <IconButton onClick={triggerQRCodeGeneration} disabled={loading || isGenerating}>
                    <Refresh />
                </IconButton>
                <IconButton onClick={handleEdit} disabled={loading || isGenerating}>
                    <Edit />
                </IconButton>
            </Box>
            {isGenerating && <Typography sx={{ mt: 2 }} variant="caption">Generating new QR Code...</Typography>}
        </Container>
    );
}

export default YourQrCodePage;
