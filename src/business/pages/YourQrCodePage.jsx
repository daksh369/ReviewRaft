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
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { QRCodeCanvas } from 'qrcode.react';

function YourQrCodePage() {
    const { docId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [qrCodeValue, setQrCodeValue] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [businessData, setBusinessData] = useState(null); // State for business data
    const qrCodeRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const triggerQRCodeGeneration = useCallback(() => {
        const uniqueQrCodeValue = `${window.location.origin}/review?business_id=${docId}&t=${Date.now()}`;
        setQrCodeValue(uniqueQrCodeValue);
        setIsGenerating(true);
    }, [docId]);

    useEffect(() => {
        const fetchQrCode = async () => {
            if (!docId) {
                setLoading(false);
                setError("No business ID provided.");
                return;
            }
            setLoading(true);
            setError('');
            try {
                const docRef = doc(db, "business_links", docId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setBusinessData(data); // Save business data
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
        if (qrCodeUrl) {
            const link = document.createElement('a');
            link.href = qrCodeUrl;
            link.download = 'business-qr-code.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (qrCodeRef.current) {
            const canvas = qrCodeRef.current.querySelector('canvas');
            if (canvas) {
                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'business-qr-code.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(qrCodeValue);
    };

    const handleEdit = async () => {
        if (!window.confirm("Are you sure you want to edit your business link? This will delete your current QR code and you'll have to create a new one.")) {
            return;
        }
        try {
            const docRef = doc(db, "business_links", docId);
            await deleteDoc(docRef);
            navigate('/business/add-business-link', { replace: true });
        } catch (err) {
            console.error("Failed to delete business link:", err);
            setError("Could not delete the business link. Please try again.");
        }
    };

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
                ) : qrCodeValue ? (
                    <Box ref={qrCodeRef} >
                        <QRCodeCanvas value={qrCodeValue} size={256} />
                    </Box>
                ) : (
                    <Box sx={{ width: 256, height: 256, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="caption">QR Code not available</Typography>
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
                <Button variant="contained" startIcon={<Download />} onClick={handleDownload} disabled={!qrCodeValue || loading}>
                    Download
                </Button>
                <Button variant="outlined" startIcon={<ContentCopy />} onClick={handleCopyToClipboard} disabled={!qrCodeValue || loading}>
                    Copy Link
                </Button>
                <IconButton onClick={() => {
                    setQrCodeUrl('');
                    triggerQRCodeGeneration();
                }} disabled={loading || isGenerating}>
                    <Refresh />
                </IconButton>
                <IconButton onClick={handleEdit} disabled={loading}>
                    <Edit />
                </IconButton>
            </Box>
            {isGenerating && <Typography sx={{ mt: 2 }} variant="caption">Generating QR Code...</Typography>}
        </Container>
    );
}

export default YourQrCodePage;
