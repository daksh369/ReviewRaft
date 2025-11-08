// src/business/components/Poster.jsx
import React from 'react';
import { Typography, CircularProgress, Box } from '@mui/material';
import './Poster.css';

const Poster = React.forwardRef(({ qrCodeUrl, businessName, businessAddress }, ref) => (
    <div ref={ref} className="poster-container-final">
        <div className="poster-header-bg">
            <div className="poster-brand-header">
                <Typography variant="h6" className="poster-brand-name-header">
                    {businessName}
                </Typography>
            </div>
        </div>
        <div className="poster-content">
            <Typography variant="h4" className="poster-title">
                Share your experience in only <span className="poster-highlight">30secs</span>
            </Typography>
            <Typography variant="h6" className="poster-subtitle">
                Quick Google Review
            </Typography>
            <Box className="poster-qr-code" sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                {qrCodeUrl ? (
                    <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        className="poster-qr-image"
                        crossOrigin="anonymous"
                    />
                ) : (
                    <CircularProgress />
                )}
            </Box>
            <div className="poster-location">
                <Typography variant="body1" className="poster-business-name">{businessName}</Typography>
                <Typography variant="body2">{businessAddress}</Typography>
            </div>
            <div className="poster-powered-by-container">
                <Typography variant="caption" className="poster-powered-by">
                    Powered by <span className="poster-powered-by-brand">ReviewRaft</span>
                </Typography>
            </div>
        </div>
        <div className="poster-footer-bg">
            <span className="material-icons poster-sparkles">
                sparkles
            </span>
        </div>
    </div>
));

export default Poster;
