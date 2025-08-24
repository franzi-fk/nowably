import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken, signOut } from "firebase/auth";

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

  // Wait until Firebase reports a user
  cy.then(() => {
    return new Cypress.Promise((resolve) => {
      const unsub = auth.onAuthStateChanged((user) => {
        if (user) {
          unsub();
          resolve();
        }
      });
    });
  });
});

// Custom logout command (SDK-based)
Cypress.Commands.add("logout", () => {
  cy.then(() => signOut(auth)); // sign out via Firebase SDK
  // wait for logout to propagate
  cy.then(() => {
    return new Cypress.Promise((resolve) => {
      const unsub = auth.onAuthStateChanged((user) => {
        if (!user) {
          unsub();
          resolve();
        }
      });
    });
  });
  // go to login page
  cy.visit("http://localhost:8888/login");
  cy.get('[data-cy="btn-enter-demo"]').should("be.visible");
});

// _______ CREATE AND PROCESS TASKS _______ //

// Ensure the input is visible
Cypress.Commands.add("ensureTaskInputVisible", (taskName) => {
  cy.get("body").then(($body) => {
    if (!$body.find('[data-cy="inp-new-task"]').is(":visible")) {
      cy.get('[data-cy="btn-initiate-task-creation"]').click();
    }
  });
});

// Create task
Cypress.Commands.add("createTask", (taskName) => {
  const uniqueTaskName = taskName || `Task ${Date.now()}`;
  cy.ensureTaskInputVisible();
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
  cy.get('[data-cy="initiate-stopping-task"]').click();
  cy.get('[data-cy="modal-btn-primary"]').click();
});
