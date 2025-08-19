describe("Task progress: Work on task", () => {
  beforeEach(() => {
    cy.loginWithFirebase();
    cy.visit("http://localhost:8888/");
    cy.createAndStartTask();
    cy.get('[data-cy="btn-task-started"]').click();
  });

  // it views "task in progress" view when user started working on task
  it("views 'task in progress view'", () => {
    cy.get('[data-cy="art-working-on-task"]')
      .should("be.visible")
      .within(() => {
        cy.get('[data-cy="gif-you-got-this"]').should("be.visible");
        cy.contains("Keep going");
        cy.get('[data-cy="btn-stop-task"]')
          .should("be.visible")
          .and("be.enabled");
      });
  });

  // it stops and asks for progress documentation when user clicks "stop" button
  it("stops and views progress documentation when user clicks 'stop' button", () => {
    cy.get('[data-cy="btn-stop-task"]').click();
    cy.get('[data-cy="art-document-task-status"]')
      .should("be.visible")
      .within(() => {
        cy.contains("Document your progress");
        cy.get('[data-cy="radio-task-completed"]').should("be.visible").click();
        cy.get('[data-cy="radio-task-not-completed"]')
          .should("be.visible")
          .click();
        cy.get('[data-cy="btn-save-continue"]')
          .should("be.visible")
          .and("be.enabled");
      });
  });

  it("views success screen when user has finished working on a task", () => {
    // no matter if task is complete or not
    cy.get('[data-cy="btn-stop-task"]').click();
    cy.get('[data-cy="btn-save-continue"]').click();
    cy.get('[data-cy="task-success"]')
      .should("be.visible")
      .within(() => {
        cy.contains("Great job");
        cy.get('[data-cy="btn-back-home"]')
          .should("be.visible")
          .and("be.enabled");
      });
  });

  it("completes task when user documents task as 'completed'", () => {
    // get current task title
    cy.get('[data-cy="current-task-title"]')
      .first()
      .invoke("text")
      .then((taskTitle) => {
        // save task title in variable
        const completedTaskTitle = taskTitle.trim();

        // complete task and go to home
        cy.get('[data-cy="btn-stop-task"]').click(); // stop task
        cy.get('[data-cy="radio-task-completed"]').click(); // document as completed
        cy.get('[data-cy="btn-save-continue"]').click(); // save and continue
        cy.get('[data-cy="btn-back-home"]').click(); // go back to home

        // check for task title on home (should not appear)
        cy.wait(2000);
        cy.contains(completedTaskTitle).should("not.exist");

        // check for task on completed tasks (should appear)
        cy.get('[data-cy="nav-sidebar"]').contains("All tasks").click();
        cy.wait(2000);
        cy.get('[data-cy="sct-completed-tasks"]').within(() => {
          cy.contains(completedTaskTitle).should("exist");
        });
      });
  });

  it("keeps task open when user documents task as 'not completed yet'", () => {
    // get current task title
    cy.get('[data-cy="current-task-title"]')
      .first()
      .invoke("text")
      .then((taskTitle) => {
        // save task title in variable
        const incompleteTaskTitle = taskTitle.trim();

        // complete task and go to home
        cy.get('[data-cy="btn-stop-task"]').click(); // stop task
        cy.get('[data-cy="radio-task-not-completed"]').click(); // document as completed
        cy.get('[data-cy="btn-save-continue"]').click(); // save and continue
        cy.get('[data-cy="btn-back-home"]').click(); // go back to home

        // check for task title on home (should not appear)
        cy.wait(2000);
        cy.contains(incompleteTaskTitle).should("exist");

        // check for task on completed tasks (should appear)
        cy.get('[data-cy="nav-sidebar"]').contains("All tasks").click();
        cy.wait(2000);
        cy.get('[data-cy="sct-completed-tasks"]').within(() => {
          cy.contains(incompleteTaskTitle).should("not.exist");
        });
      });
  });
});
