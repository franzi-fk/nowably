import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Firebase config from Cypress env variables (see cypress.config.js)
const firebaseConfig = {
  apiKey: Cypress.env("VITE_FIREBASE_API_KEY"),
  authDomain: Cypress.env("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: Cypress.env("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: Cypress.env("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: Cypress.env("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: Cypress.env("VITE_FIREBASE_APP_ID"),
};

// Initialize firebase
let firebaseApp;
if (!firebaseApp) {
  firebaseApp = initializeApp(firebaseConfig);
}
const auth = getAuth(firebaseApp);

// Custom login command
Cypress.Commands.add("loginWithFirebase", () => {
  const email = Cypress.env("TEST_USER_EMAIL");
  const password = Cypress.env("TEST_USER_PASSWORD");

  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => userCredential.user.getIdToken())
    .then((idToken) => {
      // Set the token in localStorage so your app considers the user logged in
      window.localStorage.setItem("authToken", idToken);
    });
});

// Custom command for creating and completing a task
Cypress.Commands.add("createAndCompleteTask", (taskName) => {
  const uniqueTaskName = taskName || `CreatedCompleted ${Date.now()}`;

  // Create task
  cy.get('[data-cy="btn-initiate-task-creation"]').click();
  cy.get('[data-cy="inp-new-task"]').type(uniqueTaskName);
  cy.get('[data-cy="btn-add-task"]').click();
  cy.contains(uniqueTaskName).should("exist");

  // Start & complete task
  cy.contains(uniqueTaskName)
    .closest('[data-cy="task-row-container"]')
    .within(() => {
      cy.get('[data-cy="btn-start-task"]').click(); // in open tasks card
    });
  cy.get('[data-cy="btn-task-started"]').click(); // in CountdownView
  cy.get('[data-cy="btn-stop-task"]').click(); // in TaskInProgressView
  cy.get('[data-cy="radio-task-completed"]').click(); // in TaskInProgressView
  cy.get('[data-cy="btn-save-continue"]').click(); // in TaskInProgressView
  cy.get('[data-cy="btn-back-home"]').click(); // in TaskSuccessView

  // confirm task is completed
  cy.visit("http://localhost:8888/all-tasks");
  cy.contains(uniqueTaskName).should("exist");

  // back to home
  cy.visit("http://localhost:8888/");
  // return the task name
  return cy.wrap(uniqueTaskName);
});
