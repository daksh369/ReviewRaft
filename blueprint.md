# Google Reviews QR Code Automation

## Overview

This project aims to simplify the process of leaving Google reviews for businesses, especially in regions where English is not the primary language. The application allows customers to scan a QR code, which directs them to a web page where an AI-powered system generates a review. The user can then tweak the generated review and easily copy it to their clipboard, ready to be pasted into the Google review interface.

## Features

*   **QR Code Scanning:** Businesses can generate a QR code that links to their review page.
*   **AI-Generated Reviews:** The application will use a generative AI model to create reviews based on user input.
*   **Review Customization:** Users can modify the AI-generated review to their liking.
*   **One-Click Copy:** A simple "Copy and Add Review" button will copy the final review to the clipboard and redirect the user to the business's Google review page.
*   **Mobile-First Design:** The application will be designed with a mobile-first approach, ensuring a seamless experience for users on smartphones.

## Plan

1.  **Project Setup:**
    *   Create a standard React project structure with `src/components` and `src/pages` directories.
    *   Install necessary dependencies: `react-router-dom`, `qrcode.react`.
2.  **Component Development:**
    *   `HomePage.jsx`: The main page of the application. It will contain the UI for generating and customizing reviews.
    *   `QRCode.jsx`: A component to display the QR code.
    *   `ReviewForm.jsx`: A form for users to input keywords or phrases to guide the AI in generating the review.
    .
3.  **Routing:**
    *   Implement routing using `react-router-dom` to handle different pages of the application. For now, we will only have the home page.
4.  **AI Integration:**
    *   Integrate a generative AI model to generate reviews. For the initial version, a placeholder function will be used to simulate AI-generated text.
5.  **UI/UX Design:**
    *   Design a clean, intuitive, and mobile-friendly user interface.
    *   Use a modern and visually appealing design with clear instructions for the user.
    *   The user interface will guide the user through the process of generating, customizing, and submitting their review.
