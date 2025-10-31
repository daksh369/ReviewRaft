import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

function QrCodeScanner() {
    const navigate = useNavigate();

    useEffect(() => {
        const qrCodeScanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: 250 },
            false
        );

        function onScanSuccess(decodedText, decodedResult) {
            console.log(`Code matched = ${decodedText}`, decodedResult);
            
            // The QR code contains the direct URL, so just navigate to it.
            // No need to fetch from Firestore here.
            try {
                const url = new URL(decodedText);
                navigate(url.pathname + url.search);
            } catch (error) {
                console.error("Invalid URL scanned:", error);
            }

            // Stop scanning after a successful scan
            qrCodeScanner.clear().catch(error => {
                console.error("Failed to clear scanner.", error);
            });
        }

        function onScanFailure(error) {
            // handle scan failure, usually better to ignore and keep scanning.
            // console.warn(`Code scan error = ${error}`);
        }

        qrCodeScanner.render(onScanSuccess, onScanFailure);

        // Cleanup function to clear the scanner when the component unmounts
        return () => {
            qrCodeScanner.clear().catch(error => {
                console.error("Failed to clear scanner on unmount.", error);
            });
        };
    }, [navigate]);

    return <div id="qr-reader" style={{ width: '100%' }}></div>;
}

export default QrCodeScanner;