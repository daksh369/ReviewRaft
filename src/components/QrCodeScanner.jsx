import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

function QrCodeScanner() {
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const qrCodeScanner = new Html5QrcodeScanner(
      "qr-reader", 
      { fps: 10, qrbox: 250 }, 
      false
    );

    function onScanSuccess(decodedText, decodedResult) {
      // Handle the scanned code here.
      console.log(`Code matched = ${decodedText}`, decodedResult);
      // Assuming the QR code contains the business name
      const businessName = decodedText;
      // Redirect to the home page with the business name as a query parameter
      navigate(`/?businessName=${encodeURIComponent(businessName)}`);
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

    return () => {
      qrCodeScanner.clear().catch(error => {
        console.error("Failed to clear scanner.", error);
      });
    };
  }, [navigate]);

  return (
    <div>
      <h1>Scan QR Code</h1>
      <div id="qr-reader" ref={scannerRef}></div>
    </div>
  );
}

export default QrCodeScanner;