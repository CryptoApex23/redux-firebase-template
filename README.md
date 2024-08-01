

# Redux Firebase Template

This project is a template sandbox for React + Redux + Firebase authentication and profile editing. It provides a starting point for building applications with user authentication and profile management.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- User Authentication with Firebase
- Profile Editing (Username, Bio, Profile Picture)
- Redux for State Management
- Material UI for Styling
- File Upload with Firebase Storage
- Smooth Transitions with Material UI

## Demo

![Demo Image](/screenshot/screenshot_1.png)

## Installation

To get started with this project, follow these steps:

1. **Clone the repository:**

```bash
git clone https://github.com/CryptoApex23/redux-firebase-template.git
cd redux-firebase-template
```

2. **Install dependencies:**

```bash
npm install
```

## Setup

1. **Firebase Configuration:**

Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/).

2. **Firebase Authentication:**

Enable Email/Password authentication in the Firebase Console.

3. **Firebase Firestore:**

Create a Firestore database in the Firebase Console.

4. **Firebase Storage:**

Enable Firebase Storage in the Firebase Console.

5. **Environment Variables:**

Create a `.env` file in the root directory of the project and add your Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Usage

To run the project locally, use the following command:

```bash
npm start
```

This will start the development server and open the project in your default web browser.

## Folder Structure

Here's an overview of the folder structure of the project:

```
redux-firebase-template/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── Profile/
│   │   │   ├── Profile.js
│   │   │   ├── ProfilePage.css
│   │   │   └── ...
│   │   ├── ProfilePicture/
│   │   │   ├── ProfilePicture.js
│   │   │   └── ...
│   │   └── ...
│   ├── redux/
│   │   ├── actions/
│   │   │   ├── authActions.js
│   │   │   └── ...
│   │   ├── reducers/
│   │   │   ├── authReducer.js
│   │   │   └── ...
│   │   └── store.js
│   ├── services/
│   │   ├── firebase.js
│   │   └── ...
│   ├── App.js
│   ├── index.js
│   └── ...
├── .env
├── package.json
└── README.md
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or create a pull request.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Open a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


