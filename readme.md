# nowably

A productivity app designed to help users defeat procrastination, start to their tasks and stay motivated with positive reinforcement. Inspired by behavioral psychology principles for sustainable productivity. Created by Franziska Kiel.

## Features

- Task management
- Mood-based support to overcome hurdles and start working on a task
- Success tracking and gamified milestone cards as rewards
- Celebrating and sharing moments of success with other users by sending / receiving "Messages in a Bottle"
- Moderation of Messages in a Bottle (manually, by admin)

## Info

### Tech

- Frontend: Vue 3 (Vite)
- Routing: Vue Router
- State Management: Pinia
- Database: Firestore
- Authentication: Firebase
- Testing: E2E with Cypress

### Design

- UX & UI Design: Franziska Kiel
- Icons: [lucide.dev](https://lucide.dev/)
- Completion Card Illustrations: [cocomaterial.com](https://cocomaterial.com/)
- App Illustrations: Franziska Kiel

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License.

- You are free to share the project, copy it, and redistribute it for non-commercial purposes only.
- You cannot modify or build upon this project for distribution.
- You must give appropriate credit when using the project.
  For more details, please refer to the [full license text](https://creativecommons.org/licenses/by-nc-nd/4.0/).

## Dev Container & Setup Guide

This section provides instructions for setting up the Nowably project with the VS Code dev container, environment variables, Firebase and Cypress E2E testing.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [VS Code](https://code.visualstudio.com/) with the **Dev Containers** extension by Microsoft installed

### Setup

**1 - Clone the repository:**

```bash
git clone https://github.com/franzi-fk/nowably.git
cd nowably
```

**2 - Environment Variables**

Create a `.env` file in the project root with your Firebase credentials and Cypress test user:

```env
# Firebase configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Cypress E2E test user
CYPRESS_TEST_USER_UID=your_test_user_uid
CYPRESS_TEST_USER_EMAIL=your_test_user_email
CYPRESS_TEST_USER_PASSWORD=your_test_user_password
```

> Fill in the values with your own Firebase project credentials and the manually created test user for Cypress.  
> Keep this file secret and **do not commit it** to Git.

**3 - Firebase Service Account (for Cypress E2E tests)**

To run the Cypress tests with Firebase Admin SDK:

1. Obtain the service account JSON from your Firebase project.
2. Place it in `cypress/` and name it:

```
cypress/nowably-firebase-service-account.json
```

3. Add the file to .gitignore to make sure to **not commit it** to Git.

**4 - Open the project in VS Code.**

**5 - Reopen in a container.**

- VS Code will prompt you to reopen the folder in a container.
- Alternatively, use the command line and enter: `Dev Containers: Reopen in Container`.

> This will automatically build and start the dev container with all dependencies installed and environment variables available.

## Development

Inside the dev container, you can run the following commands:

**Install dependencies:**

```bash
npm install
```

**Start the development server:**

```bash
npm run dev
```

Vite runs on [http://localhost:8888](http://localhost:8888) by default.

**Run Cypress E2E tests:**

```bash
npm run test:e2e
```

> Ensure `cypress/nowably-firebase-service-account.json` and the Cypress test user environment variables are correctly set.

## Admin mode

The nowably app includes an **Admin mode** which allows the admin to moderate Messages in a Bottle (publish or delete).

To enable Admin mode for a user:

1. Go to your Firestore database.
2. In the `users` collection, locate and open the document for the user account you want to be handled as admin.
3. Set the "role: user" to "role: admin" by editing the field
4. Log in with that user in the app. The admin features will now be available.

## Notes

- If you change the Dockerfile or `devcontainer.json`, rebuild the container.

- Ports exposed:

  - Vite dev server: `8888`
  - Cypress GUI: see Cypress configuration

- Keep your `.env` file and `cypress/nowably-firebase-service-account.json` secret — do **not** commit them to Git.

### Firebase & Firestore

- `.env` must contain valid Firebase keys.
- Firestore handles database operations, Firebase manages authentication.
- Cypress tests require a test user (created via Firebase) and Firebase Admin SDK credentials.

## Maintenance / Cleanup

The app's demo mode creates anonymous users in Firebase. To prevent clutter, these users are periodically cleaned up by using a cleanup script.

- Separate repository containing `cleanup.js` script.
- Deletes all **anonymous users** (users with no providerData) and their subcollections in Firestore (`tasks`, `deletedCompletedTasks`, `receivedMebos`).
- Uses the Firebase Admin SDK with a service account (`nowably-firebase-service-account.json`).
- In production, the script is scheduled to run daily (via Windows Task Scheduler), but it can also be run manually if needed.
- Safe for development – normal (non-anonymous) users are never deleted.
