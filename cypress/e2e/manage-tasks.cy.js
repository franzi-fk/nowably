function testCreateEditDeleteTask() {
  const uniqueTask = `Buy groceries ${Date.now()}`;

  // add new task
  cy.createTask(uniqueTask); // custom command from commands.js

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
}

function testDuplicateTaskError() {
  const taskDesc = "Buy groceries";

  // create first task
  cy.createTask(taskDesc);

  // create second task with same description
  cy.ensureTaskInputVisible();
  cy.get('[data-cy="inp-new-task"]').type(taskDesc);
  cy.get('[data-cy="btn-add-task"]').click();

  // confirm task wasnt created
  cy.get('[data-cy="task-list-body"]').within(() => {
    cy.contains(taskDesc).should("have.length", 1);
  });

  // show snackbar
  cy.get('[data-cy="snackbar"]')
    .should("be.visible")
    .within(() => {
      cy.contains("already exists");
    });
}

function testEmptyTaskNotSaved() {
  const emptyTaskDesc = "    ";

  // create task with empty description
  cy.ensureTaskInputVisible();
  cy.get('[data-cy="inp-new-task"]').type(emptyTaskDesc);
  cy.get('[data-cy="btn-add-task"]').click();

  // confirm task wasnt created
  cy.get('[data-cy="task-row-container"]').should("not.exist");
  cy.get('[data-cy="open-tasks-empty-state"]').should("be.visible");
}

function testOpenTasksCard() {
  cy.get('[data-cy="sct-open-tasks"]').should("exist");

  // wait for loading to finish
  cy.get('[data-cy="loading"]').should("not.exist");

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
}

describe("Task management", () => {
  beforeEach(() => {
    cy.task("resetTestUser");
    cy.loginWithToken();
  });

  context('on "Home" page', () => {
    beforeEach(() => {
      cy.visit("http://localhost:8888/");
    });

    it("adds, edits and deletes a task", () => {
      testCreateEditDeleteTask();
    });

    it("rejects duplicate task descriptions and shows error snackbar", () => {
      testDuplicateTaskError();
    });

    it("does not save task with empty description", () => {
      testEmptyTaskNotSaved();
    });

    it("views open tasks card with task list or empty state", () => {
      testOpenTasksCard();
    });
  });

  context('on "All tasks" page', () => {
    beforeEach(() => {
      cy.visit("http://localhost:8888/all-tasks");
    });

    it("adds, edits and deletes a task", () => {
      testCreateEditDeleteTask();
    });

    it("rejects duplicate task descriptions and shows error snackbar", () => {
      testDuplicateTaskError();
    });

    it("does not save task with empty description", () => {
      testEmptyTaskNotSaved();
    });

    it("views open tasks card with task list or empty state", () => {
      testOpenTasksCard();
    });

    it("views completed tasks card with task list or empty state", () => {
      cy.get('[data-cy="sct-completed-tasks"]').should("exist");

      // wait for loading to finish
      cy.get('[data-cy="loading"]').should("not.exist");

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

    it("deletes a completed task", () => {
      const taskName = `CC-${Date.now()}`;
      cy.createAndCompleteTask(taskName);
      cy.visit("http://localhost:8888/all-tasks");

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

    it("clears all completed tasks", () => {
      const taskName = `Task-${Date.now()}`;
      cy.createAndCompleteTask(taskName);
      cy.visit("http://localhost:8888/all-tasks");

      // clear all completed tasks
      cy.get('[data-cy="btn-clear-completed-tasks"]').click();
      cy.get('[data-cy="modal-btn-primary"]').click(); // confirm deletion

      // Verify list is empty
      cy.contains(taskName).should("not.exist");
      cy.get('[data-cy="completed-tasks-empty-state"]').should("exist");
    });
  });
});
