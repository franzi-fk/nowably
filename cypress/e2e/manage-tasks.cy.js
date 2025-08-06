function runCreateEditDeleteTests() {
  it("adds, edits and deletes a task", () => {
    const uniqueTask = `Buy groceries ${Date.now()}`;

    // add new task
    cy.get('[data-cy="btn-initiate-task-creation"]').click();
    cy.get('[data-cy="inp-new-task"]').type(uniqueTask);
    cy.get('[data-cy="btn-add-task"]').click();
    cy.contains(uniqueTask).should("exist");

    // edit task
    cy.contains('[data-cy="task-row-container"]', uniqueTask)
      .should("exist")
      .within(() => {
        cy.get('[data-cy="btn-initiate-task-editing"]').click();
        cy.get('[data-cy="inp-edit-task"]')
          .find("input")
          .clear()
          .type(`${uniqueTask} edited`);
        cy.get('[data-cy="btn-save-edited-task"]').click();
      });
    cy.contains(`${uniqueTask} edited`).should("exist");

    // delete task
    cy.contains(`${uniqueTask} edited`)
      .closest('[data-cy="task-row-container"]')
      .within(() => {
        cy.get('[data-cy="btn-initiate-task-deletion"]').click();
      });
    cy.get('[data-cy="modal-btn-primary"]').click();
    cy.contains(uniqueTask).should("not.exist");
  });
}

function runOpenTasksCardTest() {
  it("views open tasks card with task list or empty state", () => {
    cy.get('[data-cy="sct-open-tasks"]').should("exist");

    // wait for loading to finish
    cy.get(".loader-space").should("not.exist");

    // check whether tasks exist or empty state is shown
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="task-row-container"]').length > 0) {
        // if its 0 > no tasks, if its more than 0 > tasks exist
        // tasks exist
        cy.get('[data-cy="task-row-container"]').should("exist");
      } else {
        // no tasks, empty state should be shown
        cy.get('[data-cy="open-tasks-empty-state"]').should("exist");
      }
    });
  });
}

describe('Task management on "Home" page', () => {
  beforeEach(() => {
    cy.loginWithFirebase();
    cy.visit("http://localhost:8888/");
  });

  // create, edit, delete task
  runCreateEditDeleteTests();

  // view open tasks card
  runOpenTasksCardTest();
});

describe('Task management on "All tasks" page', () => {
  beforeEach(() => {
    cy.loginWithFirebase();
    cy.visit("http://localhost:8888/all-tasks");
  });

  // create, edit, delete task
  runCreateEditDeleteTests();

  // view open tasks card
  runOpenTasksCardTest();

  // view completed tasks card
  it("views completed tasks card with task list or empty state", () => {
    cy.get('[data-cy="sct-completed-tasks"]').should("exist");

    // wait for loading to finish
    cy.get(".loader-space").should("not.exist");

    // check whether tasks exist or empty state is shown
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="task-row-container"]').length > 0) {
        // if its 0 > no tasks, if its more than 0 > tasks exist
        // tasks exist
        cy.get('[data-cy="task-row-container"]').should("exist");
      } else {
        // no tasks, empty state should be shown
        cy.get('[data-cy="completed-tasks-empty-state"]').should("exist");
      }
    });
  });

  // delete a single completed task
  it("deletes a completed task", () => {
    const taskName = `CC-${Date.now()}`;
    cy.createAndCompleteTask(taskName);

    // delete task
    cy.contains(taskName)
      .closest('[data-cy="task-row-container"]')
      .within(() => {
        cy.get('[data-cy="btn-initiate-task-deletion"]').click();
      });
    cy.get('[data-cy="modal-btn-primary"]').click(); // confirm deletion

    // Verify deletion
    cy.contains(taskName).should("not.exist");
  });

  // clear all completed tasks
  it("clears all completed tasks", () => {
    const taskName = `Task-${Date.now()}`;
    cy.createAndCompleteTask(taskName);

    // clear all completed tasks
    cy.get('[data-cy="btn-clear-completed-tasks"]').click();
    cy.get('[data-cy="modal-btn-primary"]').click(); // confirm deletion

    // Verify list is empty
    cy.contains(taskName).should("not.exist");
    cy.get('[data-cy="completed-tasks-empty-state"]').should("exist");
  });
});
