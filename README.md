# Live Location Tracker

## Overview

The **Live Location** is a full-stack web application that enables users to share and access real-time geographical locations securely. Built with React.js for the frontend and Node.js with Express for the backend, the application incorporates a MySQL database to store user data and real-time locations. Interactive map rendering is powered by the Leaflet library, providing a seamless and visually engaging user experience.

---

## Features

- **Real-Time Location Updates**: Users can view their current location on a map, which updates dynamically as they move.
- **Secure Token-Based Access**: A unique token is generated for each user session, enabling secure sharing of real-time location data.
- **Access Location Visualization**: Custom markers on the map display accessed locations, helping users track shared location data visually.
- **Clipboard Integration**: Easily copy tokens to the clipboard for convenient sharing.
- **Error Handling**: Robust mechanisms to manage geolocation issues, API errors, and database connection failures.
- **Responsive Design**: Optimized for a smooth user experience across devices.

---

## Technologies Used

### Frontend

- **React.js**: Core framework for the frontend.
- **Leaflet**: Library for interactive maps.
- **Axios**: HTTP client for API communication.
- **CSS**: For responsive and user-friendly design.

### Backend

- **Node.js & Express.js**: Server-side framework for building RESTful APIs.
- **WebSocket**: For real-time updates when sharing location data.
- **MySQL**: Relational database for storing user information and location data.

### Deployment

- **Frontend**: Hosted on Render.
- **Backend**: Hosted on Render with integrated MySQL database.

---

## Installation and Setup

### Frontend

1. Clone the **frontend repository**:
   ```
   git clone https://github.com/kashyapanjali/LocationAccess
   ```
2. Navigate to the frontend directory:
   ```
   cd locationaccess
   ```
3. Install dependencies:
   ```
    npm install
   ```
4. Create a .env file in the root of your project and set the API URL:
   ```
    REACT_APP_API_URL=http://localhost:5000/api
   ```

### Backend

1. Clone the backend repository:
   ```
    git clone https://github.com/kashyapanjali/EmergencyLocation
   ```
2. Navigate to the backend directory:
   ```
    cd emergencylocation
   ```
3. Install dependencies:
   ```
    npm install
   ```
4. Set up a .env file with the following variables:
   ```
   PORT=5000
   DB_HOST=<your-database-host>
   DB_USER=<your-database-username>
   DB_PASSWORD=<your-database-password>
   DB_NAME=<your-database-name>
   ```
5. Start the backend server:
   ```
   npm start
   ```

## Contact

- Maintainer: Anjali Kashyap
- Email: anjalikashyap9608@Gmail.com
