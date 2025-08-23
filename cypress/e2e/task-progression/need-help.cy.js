function receiveMeboAndGoHome() {
  cy.get('[data-cy="btn-demotivated"]').click();
  cy.get('[data-cy="btn-open-mebo"]').click();
  cy.get('[data-cy="initiate-stopping-task"]').click();
  cy.get('[data-cy="modal-btn-primary"]').click();
}

function checkAndClickContinueBtn() {
  cy.get('[data-cy="btn-continue"]')
    .should("be.visible")
    .and("be.enabled")
    .click();
}

function checkAfterHelpView() {
  cy.get('[data-cy="sct-after-help-view"]').should("be.visible");
}

describe("Task progress: Need help", () => {
  beforeEach(() => {
    cy.task("resetTestUser"); // reset test user so they can receive a mebo
    cy.loginWithToken();
    cy.visit("http://localhost:8888/");
    cy.createAndStartTask();
    cy.get('[data-cy="btn-need-help"]').click();
  });

  it("views 'i need help' overview with 3 help options", () => {
    cy.get('[data-cy="btn-demotivated"]')
      .should("be.visible")
      .and("be.enabled");
    cy.get('[data-cy="btn-overwhelmed"]')
      .should("be.visible")
      .and("be.enabled");
    cy.get('[data-cy="btn-anxious"]').should("be.visible").and("be.enabled");
  });

  it("user clicks 'demotivated' > views mebo if receiving mebo is possible", () => {
    cy.get('[data-cy="btn-demotivated"]').click();
    // check content and click 'open message'
    cy.get('[data-cy="art-receive-mebo"]').should("be.visible");
    cy.get('[data-cy="btn-open-mebo"]')
      .should("be.visible")
      .and("be.enabled")
      .click();
    cy.get('[data-cy="mebo-text"]').should("be.visible"); // check for mebo message
    checkAndClickContinueBtn(); // click continue
    checkAfterHelpView(); // check continuation question)
  });

  it("user clicks 'demotivated' > views alternative motivational actions if receiving mebo is not possible", () => {
    receiveMeboAndGoHome(); // receive a mebo, so user cannot receive another one today
    // start task, click 'i need help' and 'i feel demotivated'
    cy.createAndStartTask();
    cy.get('[data-cy="btn-need-help"]').click();
    cy.get('[data-cy="btn-demotivated"]').click();
    // check content
    cy.get('[data-cy="sct-motivation-alt"]').should("be.visible");
    // check cycle through actions
    cy.get('[data-cy="action-title"]')
      .first()
      .invoke("text")
      .then((actionTitle1) => {
        cy.get('[data-cy="btn-show-another-action"]')
          .should("be.visible")
          .click();
        cy.get('[data-cy="action-title"]')
          .first()
          .invoke("text")
          .then((actionTitle2) => {
            expect(actionTitle2.trim()).not.to.equal(actionTitle1.trim());
          });
      });
    checkAndClickContinueBtn(); // click continue
    checkAfterHelpView(); // check continuation question
  });

  it("user clicks 'overwhelmed' > views and performs task splitting", () => {
    cy.get('[data-cy="btn-overwhelmed"]').click();
    // views splitting form
    cy.get('[data-cy="art-split-task"]').should("be.visible");
    cy.get('[data-cy="form-split-task"]').should("be.visible");
    // views 2 inputs initially
    cy.get('[data-cy="form-split-task"] input:visible').should(
      "have.length",
      2
    );
    // fill inputs, so the next empty input appears
    for (let i = 0; i < 5; i++) {
      cy.get('[data-cy="form-split-task"] input:visible') // input:visible because they use v-show
        .eq(i)
        .type(`Task ${i + 1}`);
    }
    // views up to 5 inputs
    cy.get('[data-cy="form-split-task"] input:visible').should(
      "have.length",
      5
    );
    // views save and continue btn + click it
    checkAndClickContinueBtn();
    // confirm splitting
    cy.get('[data-cy="modal-btn-primary"]').click();
    checkAfterHelpView(); // check continuation question

    // preselects first split task in continuation form
    cy.get('[data-cy="input-select"] option:selected').should(
      "have.text",
      "Task 1"
    );
    cy.get('[data-cy="current-task-title"]').should("have.text", "Task 1");
    // choose not to continue with task
    cy.get('[data-cy="radio-dont-continue"]').click();
    checkAndClickContinueBtn();
    cy.contains("Welcome"); // ensure we are on 'home' page
    // newly created tasks are visible
    for (let i = 1; i <= 5; i++) {
      cy.contains(`Task ${i}`);
    }
  });

  it("user clicks 'anxious' > views relaxation exercise", () => {
    // click anxious
    cy.get('[data-cy="btn-anxious"]').click();
    // check content
    cy.get('[data-cy="art-relaxation-exercise"]').should("be.visible");
    cy.get('[data-cy="sct-exercise-instructions"]').should("be.visible");
    // check and click start button to start exercise
    cy.get('[data-cy="btn-start-exercise"]')
      .should("be.visible")
      .and("be.enabled")
      .click();
    // check for humming animation
    cy.get('[data-cy="anim-humming"]').should("be.visible");
    // check for countdown animation
    cy.get('[data-cy="anim-countdown"]').should("be.visible");
    cy.contains("1:58");
    // click skip
    cy.get('[data-cy="btn-skip"]').click();
    // check for continuation question
    checkAfterHelpView();
  });

  it("lets user continue task progression after receiving help", () => {
    // open any help option and skip
    cy.get('[data-cy="btn-overwhelmed"]').click();
    cy.get('[data-cy="btn-skip"]').click();

    // check content
    checkAfterHelpView();

    // wait for pre-selected radio to be active
    cy.get("#continue-with-task").should("be.checked");

    // wait for dropdown to have a valid selection
    cy.get('[data-cy="input-select"]').should(($select) => {
      const val = $select.val();
      expect(val).to.not.be.oneOf([null, "", "Select a task"]);
    });

    // select and continue
    cy.get('[data-cy="radio-continue"]').click();
    checkAndClickContinueBtn();

    // check for countdown
    cy.get('[data-cy="anim-task-countdown"]').should("be.visible");
  });

  it("lets user stop task progression after receiving help", () => {
    // open any help option and skip
    cy.get('[data-cy="btn-anxious"]').click();
    cy.get('[data-cy="btn-skip"]').click();

    // choose to not continue with task
    checkAfterHelpView();
    cy.get('[data-cy="radio-dont-continue"]').click();
    checkAndClickContinueBtn();

    // check for home
    cy.contains("Welcome");
  });
});
