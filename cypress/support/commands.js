import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";

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

// _____ CUSTOM COMMANDS _____ //
// _______ LOGIN & LOGOUT _______ //

// Custom login command
Cypress.Commands.add("loginWithToken", () => {
  cy.task("createCustomToken").then((token) => {
    return signInWithCustomToken(auth, token);
  });
});

// Custom logout command
Cypress.Commands.add("logout", () => {
  cy.visit("http://localhost:8888/");
  cy.wait(500);

  // wait for URL to settle
  cy.url().then((url) => {
    if (!url.includes("/login")) {
      cy.log("User is logged in, logging out...");
      // User is logged in
      cy.get('[data-cy="btn-user-menu"]').click(); // Open user menu
      cy.get('[data-cy="user-menu"]').should("be.visible"); // Menu visible
      cy.get('[data-cy="btn-signout"]').click(); // Click logout button

      cy.url().should("include", "/login"); // Confirm logout by checking URL includes /login
    }
    // User is logged out, nothing to do
    cy.log("User is logged out");
  });
});

// _______ CREATE AND PROCESS TASKS _______ //

// Helper to ensure the input is visible
function ensureTaskInputVisible() {
  cy.get("body").then(($body) => {
    if (!$body.find('[data-cy="inp-new-task"]').is(":visible")) {
      cy.get('[data-cy="btn-initiate-task-creation"]').click();
    }
  });
}

// Create task
Cypress.Commands.add("createTask", (taskName) => {
  const uniqueTaskName = taskName || `Task ${Date.now()}`;
  ensureTaskInputVisible();
  cy.get('[data-cy="inp-new-task"]').type(uniqueTaskName);
  cy.get('[data-cy="btn-add-task"]').click();
  cy.contains(uniqueTaskName).should("exist");
  return cy.wrap(uniqueTaskName); // allows chaining
});

// Create and start task
Cypress.Commands.add("createAndStartTask", (taskName) => {
  return cy.createTask(taskName).then((uniqueTaskName) => {
    cy.contains(uniqueTaskName)
      .closest('[data-cy="task-row-container"]')
      .within(() => {
        cy.get('[data-cy="btn-start-task"]').click();
      });
    return cy.wrap(uniqueTaskName);
  });
});

// Create, start and complete task
Cypress.Commands.add("createAndCompleteTask", (taskName) => {
  return cy.createAndStartTask(taskName).then((uniqueTaskName) => {
    cy.get('[data-cy="btn-task-started"]').click();
    cy.get('[data-cy="btn-stop-task"]').click();
    cy.get('[data-cy="radio-task-completed"]').click();
    cy.get('[data-cy="btn-save-continue"]').click();
    cy.get('[data-cy="btn-back-home"]').click();

    // Confirm task is completed
    cy.get('[data-cy="nav-sidebar"]').contains("All tasks").click();
    cy.get('[data-cy="sct-completed-tasks"]').within(() => {
      cy.contains(uniqueTaskName).should("exist");
    });

    // Back home
    cy.get('[data-cy="nav-sidebar"]').contains("Home").click();
  });
});

// _______ MEBOS _______ //

// Receive a mebo
Cypress.Commands.add("receiveMebo", () => {
  cy.createAndStartTask();
  cy.get('[data-cy="btn-need-help"]').click();
  cy.get('[data-cy="btn-demotivated"]').click();
  cy.get('[data-cy="btn-open-mebo"]').click();
  cy.wait(1000);
  cy.get('[data-cy="initiate-stopping-task"]').click();
  cy.get('[data-cy="modal-btn-primary"]').click();
});
