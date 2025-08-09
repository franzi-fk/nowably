// Import commands.js using ES2015 syntax:
import "./commands";

// Silence all Firebase Auth & Firestore requests in Cypress logs
beforeEach(() => {
  cy.intercept("**/identitytoolkit.googleapis.com/**", { log: false });
  cy.intercept("**/firestore.googleapis.com/**", { log: false });
});
