# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Give your project a name (e.g., "todo-tracker-app")
4. Follow the setup steps

## Step 2: Enable Authentication

1. In Firebase Console, go to "Authentication" 
2. Click "Get started"
3. In the "Sign-in method" tab, enable "Anonymous" authentication
4. Save the settings

## Step 3: Set Up Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Create"

## Step 4: Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Under "Your apps", click the web icon (</>)
3. Register your app with a nickname
4. Copy the firebaseConfig object
5. Replace the placeholder values in `firebase-config.js`

## Step 5: Update firebase-config.js

Replace the placeholder values in `firebase-config.js` with your actual Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

## Step 6: Security Rules (Optional but Recommended)

For production, update Firestore security rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own todos
    match /users/{userId}/todos/{todoId} {
      allow read, write, delete: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Features Enabled

- **Anonymous Authentication**: Users get a unique ID without signing up
- **Real-time Sync**: Changes sync across devices in real-time
- **Offline Support**: App works offline and syncs when online
- **Data Persistence**: Data is stored in Firebase, not localStorage

## Testing

1. Open the app in multiple browser tabs
2. Add/edit/delete todos in one tab
3. Changes should appear in other tabs automatically
4. Refresh the page - data should persist

## Troubleshooting

- **"Failed to initialize app"**: Check Firebase configuration values
- **"Permission denied"**: Ensure Authentication is enabled and rules allow access
- **Data not syncing**: Check network connection and Firebase console for errors
