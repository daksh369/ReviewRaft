# Project Blueprint

## Overview

This application is a powerful tool designed to help businesses gather customer reviews more efficiently.

### Core Features:

*   **Intelligent QR Code Generation:** Businesses can find their official Google Business Profile using a Google Places-powered search and generate a unique QR code that directs their customers to a dedicated review page.
*   **AI-Powered Review Generation:** Customers provide feedback through a series of intuitive sliders, and the app uses a generative AI model to write a review based on this structured input.
*   **Dynamic Keywords:** The selection of keywords is dynamically generated and tailored to each specific business based on its profile description.
*   **Seamless Publishing with Pre-filled Stars:** A "Copy & Add Review" button allows the customer to copy the final text to their clipboard with a single click and be redirected to the business's Google review page, with the star rating pre-filled based on their feedback.

### Design and User Experience:

The application is built with a **mobile-first** and user-centric approach, focusing on:
*   An intuitive and beautiful interface that is easy to navigate.
*   A responsive design that works perfectly on both mobile devices and the web.
*   A modern aesthetic that uses vibrant colors, expressive typography, and icons to enhance usability.

## Current Task: Implement Google Places API for QR Code Generation

### Plan:

1.  **Install Google Maps Libraries:** Add the necessary npm packages to integrate the Google Places API.
2.  **Refactor Business Link Page:**
    *   Replace the manual URL input field in `AddBusinessLinkPage.jsx` with a Google Places Autocomplete search box.
    *   Allow users to search for and select their business from the official Google Places database.
3.  **Generate Google Review URL:**
    *   Once a business is selected, use its `place_id` to programmatically construct the direct Google review URL.
    *   Save this URL to the database.
4.  **Implement Dynamic Star Rating:**
    *   In `ReviewGeneratorPage.jsx`, update the `handleCopyAndAddReview` function.
    *   Dynamically calculate the star rating (1-5) based on the "Overall Experience" slider.
    *   Append this star rating to the Google review URL before redirecting the user.
