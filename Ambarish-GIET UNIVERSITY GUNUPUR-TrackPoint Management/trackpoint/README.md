# TrackPoint

**TrackPoint** is a real-time location tracking application that allows authorized users to share and view live GPS coordinates. It provides a simple dashboard for managing devices, generating tracking links, and viewing device locations on a map.

The system is designed for **seminars, educational projects, demonstrations, and ethical security testing**, with user consent required before displaying device information.

## Features

* 📍 Real-time GPS location tracking
* 🗺️ Location visualization using maps
* 📱 Device list and device information
* 🔗 Generate and share tracking links
* 👤 User account registration and login
* 🔐 User permission and consent before accessing device information
* 👨‍💼 Admin dashboard for device and user management
* 🌐 Public access through a tracking link

## Prerequisites

Make sure you have the following installed:

* **Node.js** v16 or higher
* **npm**
* A modern web browser
* Internet connection for map and public tunnel services

## Installation

### 1. Clone the repository

```bash
cd trackpoint
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the application

```bash
npm start
```

The application will start on the configured local port.

## Login Credentials

For the default administrator account:

```js
username: admin
password: admin
```

> **Note:** Change the default administrator password before using the application in a real environment.

## Tracking Flow

```text
User Login / Registration
          ↓
      Dashboard
          ↓
   Generate Tracking Link
          ↓
      Send to Target
          ↓
    Target Opens Link
          ↓
   User Consent / Permission
       ↙         ↘
    Denied       Allowed
      ↓             ↓
 Send Link      Show Device
 to Another      Information
 User               ↓
               Show Location
               on Map
```

## Map

TrackPoint displays the device's location using its **latitude and longitude coordinates** on the configured map service.

Example:

```text
Latitude  : 20.2961
Longitude : 85.8245
```

Location information should only be displayed when the target user has provided the required permission.

## Disclaimer

TrackPoint should only be used for **authorized tracking, educational demonstrations, testing, and ethical security research**. Do not use the application to track a person or device without their knowledge and consent.
`
