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

// custom command for logout
Cypress.Commands.add("logout", () => {
  cy.visit("http://localhost:8888/");
  cy.wait(3000);

  // wait for URL to settle
  cy.url({ timeout: 6000 }).then((url) => {
    if (!url.includes("/login")) {
      cy.log("User is logged in, logging out...");
      // User is logged in
      cy.get('[data-cy="btn-user-menu"]').click(); // Open user menu
      cy.get('[data-cy="menu-user"]').should("be.visible"); // Menu visible
      cy.get('[data-cy="btn-signout"]').click(); // Click logout button

      cy.url({ timeout: 5000 }).should("include", "/login"); // Confirm logout by checking URL includes /login
    }
    // User is logged out, nothing to do
    cy.log("User is logged out");
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
  cy.get('[data-cy="nav-sidebar"]').contains("All tasks").click();
  cy.contains(uniqueTaskName).should("exist");

  // back to home
  cy.get('[data-cy="nav-sidebar"]').contains("Home").click();
  // return the task name
  return cy.wrap(uniqueTaskName);
});
