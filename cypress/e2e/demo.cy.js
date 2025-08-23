function enterDemoMode() {
  cy.get('[data-cy="btn-enter-demo"]').should("exist").click();
}

function leaveDemoMode() {
  cy.get("body").then(($body) => {
    if ($body.find('[data-cy="btn-leave-demo"]').length) {
      cy.get('[data-cy="btn-leave-demo"]').should("exist").click();
    }
  });
}

function checkDemoData() {
  cy.get('[data-cy="sct-open-tasks"]').within(() => {
    cy.contains("Update CV").should("be.visible");
    cy.contains("Learn Python").should("be.visible");
  });
}

describe("Demo", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8888/login");
  });

  afterEach(() => {
    leaveDemoMode(); // clean up firebase & firestore (clicking leave demo deletes demo user)
  });

  // it enters and leaves demo mode
  it("enters demo mode", () => {
    cy.get('[data-cy="btn-enter-demo"]')
      .should("be.visible")
      .should("be.enabled");
    enterDemoMode();
    cy.url().should("not.include", "/login");
    cy.contains("Welcome");
  });

  // it loads demo data
  it("loads demo data", () => {
    enterDemoMode();
    checkDemoData();
  });

  // it creates and completes a task
  it("creates and completes a task", () => {
    enterDemoMode();
    const taskName = `DemoTask-${Date.now()}`;
    cy.createAndCompleteTask(taskName);
  });

  // it rejects to send mebo
  it("rejects to send mebo", () => {
    enterDemoMode();
    // create and complete a task to get a mebo token
    const taskName = `DemoTask-${Date.now()}`;
    cy.createAndCompleteTask(taskName);

    // go to send mebo page
    cy.get('[data-cy="nav-sidebar"]')
      .contains("Send Message in a Bottle")
      .click();

    // fill form and agree to guidelines
    cy.get('[data-cy="inp-write-mebo"]').find("textarea").clear().type(
      // type message with 200+ characters
      "Cypress E2E Test. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebu"
    );
    cy.get('[data-cy="check-mebo-compliance"]').click(); // tick the box to agree to guidelines
    cy.get('[data-cy="btn-initiate-sending-mebo"]')
      .should("be.enabled")
      .click(); // try to send mebo

    // reject sending mebo
    cy.contains("Not available in Demo");
    cy.get('[data-cy="btn-close-modal"]').click(); // close modal so afterEach can run successfully
  });

  // it rejects to receive mebo in "help" > "i feel demotivated"
  it("rejects to receive a mebo", () => {
    enterDemoMode();
    // create task
    const taskName = `DemoTask-${Date.now()}`;
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="inp-new-task"]').is(":visible")) {
        // input is visible, do nothing
      } else {
        // input is not visible, click to reveal
        cy.get('[data-cy="btn-initiate-task-creation"]').click();
      }
    });
    cy.get('[data-cy="inp-new-task"]').type(taskName);
    cy.get('[data-cy="btn-add-task"]').click();
    cy.contains(taskName).should("exist");

    // start & click "i need help" > "i feel demotivated"
    cy.contains(taskName)
      .closest('[data-cy="task-row-container"]')
      .within(() => {
        cy.get('[data-cy="btn-start-task"]').click();
      });
    cy.get('[data-cy="btn-need-help"]').click(); // in CountdownView
    cy.get('[data-cy="btn-demotivated"]').click(); // in NeedHelpView

    // check what is shown
    cy.get("body").then(($body) => {
      const meboExists = $body.find('[data-cy="art-receive-mebo"]').length > 0;
      const altExists = $body.find('[data-cy="art-motivation-alt"]').length > 0;

      if (altExists) {
        // Option 1: alternative motivational techniques are visible
        cy.get('[data-cy="art-motivation-alt"]').should("be.visible");
        // leave task progression view so afterEach can run successfully
        cy.get('[data-cy="initiate-stopping-task"]').click(); // stop task
        cy.get('[data-cy="modal-btn-primary"]').click(); // confirm stopping task
      } else if (meboExists) {
        // Option 2: potential mebos found, open mebo view is visible
        cy.get('[data-cy="art-receive-mebo"]').should("be.visible");
        // it should have the open mebo button
        cy.get('[data-cy="btn-open-mebo"]')
          .should("exist")
          .and("be.enabled")
          .click();
        // after clicking button, message should appear
        cy.contains("Not available in Demo").should("be.visible");
        cy.get('[data-cy="btn-close-modal"]').click(); // close modal so afterEach can run successfully
      } else {
        throw new Error(
          'Neither [data-cy="art-motivation-alt"] nor [data-cy="art-receive-mebo"] found.'
        );
      }
    });
  });

  // it leaves demo mode
  it("leaves demo mode", () => {
    // enter demo mode
    enterDemoMode();
    // leave demo mode
    leaveDemoMode();
    // confirm login page is shown after leaving demo mode
    cy.url().should("include", "/login");
    cy.get('[data-cy="btn-enter-demo"]').should("be.visible");
  });
});
