function runViewCompletionCardsTest() {
  it("views completion cards", () => {
    cy.get('[data-cy="completion-card"]').should("be.visible");
  });
}

function runCompletionCardCounterTest() {
  it("shows how many tasks to finish to open the next completion card", () => {
    cy.contains(/Complete (\d+) more tasks to unlock this card/)
      .invoke("text")
      .then((text) => {
        const match = text.match(
          /Complete (\d+) more tasks to unlock this card/
        );
        expect(match).to.not.be.null; // make sure regex found something
        const number = Number(match[1]);
        expect(number).to.be.a("number");
        expect(Number.isNaN(number)).to.be.false; // makre sure its not NaN
      });
  });
}

describe('Completion Cards are viewed on "Home" page', () => {
  beforeEach(() => {
    cy.task("resetTestUser");
    cy.loginWithFirebase();
    cy.visit("http://localhost:8888/");
  });

  // views completion cards
  runViewCompletionCardsTest();

  // views completion card counter
  runCompletionCardCounterTest();

  // views how many tasks the user completed in total
  it("views how many tasks the user completed in total", () => {
    // create and complete a task
    const taskName = `CC-${Date.now()}`;
    cy.createAndCompleteTask(taskName);

    // check if completed task is counted
    cy.contains(/you have completed (\d+) tasks in total/)
      .invoke("text")
      .then((text) => {
        const match = text.match(/you have completed (\d+) tasks in total/);
        expect(match).to.not.be.null; // make sure regex found something
        const number = Number(match[1]);
        expect(number).to.be.a("number");
        expect(Number.isNaN(number)).to.be.false; // makre sure its not NaN
      });
  });
});

describe('Completion Cards are viewed on "Completion Cards" page', () => {
  beforeEach(() => {
    cy.task("resetTestUser");
    cy.loginWithFirebase();
    cy.visit("http://localhost:8888/completion-cards");
  });

  // views completion cards
  runViewCompletionCardsTest();

  // views completion card counter
  runCompletionCardCounterTest();
});

describe("Completion Card is opened when user reaches a milestone", () => {
  beforeEach(() => {
    cy.loginWithFirebase();
    cy.visit("http://localhost:8888");
  });

  it("opens card and views it on 'Home' page", () => {
    cy.task("resetTestUser");
    cy.createAndCompleteTask("task-1");
    cy.createAndCompleteTask("task-2");
    cy.createAndCompleteTask("task-3");
    cy.createAndCompleteTask("task-4");
    cy.createAndCompleteTask("task-5");
    cy.get('[data-cy="opened-completion-card"]').should("exist");
  });

  it("views open card on 'Completion Cards' page", () => {
    cy.visit("http://localhost:8888/completion-cards");
    cy.get('[data-cy="opened-completion-card"]').should("exist");
  });
});
