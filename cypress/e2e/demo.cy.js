function enterDemoMode() {
  cy.get('[data-cy="btn-enter-demo"]').click();
}

function checkDemoData() {
  cy.get('[data-cy="sct-open-tasks"]').within(() => {
    cy.contains("Update CV").should("be.visible");
    cy.contains("Learn Python").should("be.visible");
  });
}

describe("Demo", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8888/");
    cy.logout();
  });

  // it enters demo mode
  it("enters demo mode", () => {
    cy.get('[data-cy="btn-enter-demo"]')
      .should("be.visible")
      .should("be.enabled");
    enterDemoMode();
    cy.wait(3000);
    cy.url().should("not.include", "/login");
    cy.contains("Welcome");
  });

  // it loads demo data
  it("loads demo data", () => {
    enterDemoMode();
    checkDemoData();
  });

  // it resets demo data
  it("resets demo data", () => {
    enterDemoMode();

    // create a new task (to check if it gets removed later)
    const taskName = `DemoTask-${Date.now()}`;
    cy.createAndCompleteTask(taskName);

    // delete demo data task
    cy.contains("Learn Python")
      .closest('[data-cy="task-row-container"]')
      .within(() => {
        cy.get('[data-cy="btn-initiate-task-deletion"]').click();
      });
    cy.get('[data-cy="modal-btn-primary"]').click(); // confirm deletion
    cy.contains("Learn Python").should("not.exist");

    // edit demo data task
    cy.contains('[data-cy="task-row-container"]', "Update CV")
      .should("exist")
      .within(() => {
        cy.get('[data-cy="btn-initiate-task-editing"]').click();
        cy.get('[data-cy="inp-edit-task"]')
          .find("input")
          .clear()
          .type("Demo Task edited");
        cy.get('[data-cy="btn-save-edited-task"]').click();
      });
    cy.contains("Demo Task edited").should("exist");

    // leave demo mode

    cy.get('[data-cy="btn-leave-demo"]').click();
    // enter demo mode
    enterDemoMode();
    // check for demo data
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
  });

  // it rejects to receive mebo in "help" > "i feel demotivated"
  it("rejects to receive a mebo", () => {
    enterDemoMode();
    // create task
    const taskName = `DemoTask-${Date.now()}`;
    cy.get('[data-cy="btn-initiate-task-creation"]').click();
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
    cy.get('[data-cy="art-receive-mebo"]').should("not.exist"); // receiving a mebo should not be possible
    cy.get('[data-cy="art-motivation-alt"]').should("be.visible"); // alternative motivational techniques should show up
  });

  // it leaves demo mode
  it("leaves demo mode", () => {
    // enter demo mode
    enterDemoMode();
    cy.wait(3000);
    // leave demo mode
    cy.get('[data-cy="btn-leave-demo"]').click();
    cy.wait(3000);
    // confirm login page is shown after leaving demo mode
    cy.url().should("include", "/login");
    cy.get('[data-cy="btn-enter-demo"]').should("be.visible");
  });
});
