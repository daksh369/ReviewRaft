# Project Blueprint

## Overview

This application is a powerful tool designed to help businesses gather customer reviews more efficiently.

### Core Features:

*   **Intelligent QR Code Generation:** Businesses can find their official Google Business Profile using a Google Places-powered search and generate a unique QR code that directs their customers to a dedicated review page.
*   **AI-Powered Review Generation:** Customers provide feedback through a series of intuitive sliders, and the app uses a generative AI model to write a review based on this structured input.
*   **Dynamic Keywords:** The selection of keywords is dynamically generated and tailored to each specific business based on its profile description.
*   **Seamless Publishing:** A "Copy & Add Review" button allows the customer to copy the final text to their clipboard with a single click and be redirected to the business's Google review page.

### Design and User Experience:

The application is built with a **mobile-first** and user-centric approach, focusing on:
*   An intuitive and beautiful interface that is easy to navigate.
*   A responsive design that works perfectly on both mobile devices and the web.
*   A modern aesthetic that uses vibrant colors, expressive typography, and icons to enhance usability.

## Analytics Framework

### Introduction

The analytics framework provides business owners with clear, actionable insights into customer satisfaction based on the feedback collected during the AI-powered review generation process.

### Data Collection

The foundation of our analytics is the structured data captured for each review in the `reviews` collection in Firestore:

*   **`businessId`**: A reference to the specific business.
*   **`overallExperience`**: A numerical score (0-100) of the customer's overall satisfaction.
*   **`keywordRatings`**: An object containing specific keywords (e.g., "Service", "Food") and their individual numerical ratings (0-100).
*   **`language`**: The language in which the review was generated.
*   **`createdAt`**: A timestamp for chronological analysis.

### Core Principles

The framework is built on the **"Single Source of Truth"** principle. The analytics dashboard will always dynamically reflect the business owner's current priorities as defined in their business profile.

*   **Dynamic Keyword Management:** The business owner's currently saved list of keywords (`highlightTabs`) is considered the definitive list of "Core Metrics."
*   **Robustness:** The analytics will not break or lose data if the owner adds or removes keywords from their profile. The dashboard will re-filter the historical data to match the owner's current view.

### Dashboard Structure

The analytics page will be divided into two main sections:

*   **Core Metrics:** This section will display analytics exclusively for the keywords the business owner has defined in their profile. It provides a consistent view of performance against their key performance indicators (KPIs).

*   **Emerging Trends:** This section analyzes all custom keywords entered by customers that are *not* part of the owner's Core Metrics. To avoid clutter, only keywords that appear with a specified frequency will be displayed. This acts as a powerful feedback loop for new insights.

### Key Questions Answered for Business Owners

This framework will empower business owners to answer critical questions such as:

*   What is my overall customer satisfaction, and is it trending up or down?
*   What are my business's biggest strengths and weaknesses?
*   How did my recent operational changes impact customer ratings?
*   What are customers talking about that I may not be formally tracking?
*   What languages are my customers speaking?

***
