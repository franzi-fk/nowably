import { defineConfig } from "cypress";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load env variables from .env file
dotenv.config();

// firebase admin sdk
// load service account key from JSON file
// Reconstruct the service account from environment variable in CI
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT.replace(/\\n/g, "\n"))
  : JSON.parse(
      readFileSync(
        resolve("./cypress/nowably-firebase-service-account.json"),
        "utf-8"
      )
    );

// initialize admin with full privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // merge env variables into cypress config env
      config.env = {
        ...config.env,
        VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY,
        VITE_FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN,
        VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID,
        VITE_FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET,
        VITE_FIREBASE_MESSAGING_SENDER_ID:
          process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        VITE_FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID,

        TEST_USER_EMAIL: process.env.CYPRESS_TEST_USER_EMAIL,
        TEST_USER_PASSWORD: process.env.CYPRESS_TEST_USER_PASSWORD,
      };

      // register custom cypress task
      on("task", {
        async resetTestUser() {
          // get UID from env
          const testUserUid = process.env.CYPRESS_TEST_USER_UID;

          if (!testUserUid) {
            throw new Error(
              "CYPRESS_TEST_USER_UID is not set in environment variables"
            );
          }

          // reset the user document
          await admin
            .firestore()
            .collection("users")
            .doc(testUserUid)
            .set({
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              dailyMeboCreation: {},
              currentDay: new Date().toISOString().slice(0, 10),
              meboCount: 0,
              lastMeboReceived: null,
              totalSuccessCount: 0,
            });

          // clear subcollections
          const subCollections = [
            "tasks",
            "deletedCompletedTasks",
            "receivedMebos",
          ];
          for (const col of subCollections) {
            const snapshot = await admin
              .firestore()
              .collection("users")
              .doc(testUserUid)
              .collection(col)
              .get();

            // batch delete all docs in that subcollection
            const batch = admin.firestore().batch();
            snapshot.forEach((doc) => batch.delete(doc.ref));
            await batch.commit();
          }

          // return null for success (cypress tasks must return something)
          return null;
        },
      });

      // return updated config object
      return config;
    },
  },
});
