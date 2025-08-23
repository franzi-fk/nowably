describe("Send Message in a Bottle", () => {
  beforeEach(() => {
    cy.loginWithToken();
    cy.visit("http://localhost:8888/");
  });

  // it gives user a mebo token when a task is completed
  it("gives user a mebo token when a task is completed", () => {
    const taskName = `TaskForMebo-${Date.now()}`;
    cy.createAndCompleteTask(taskName);

    cy.get('[data-cy="home-mebo-banner"]').should("exist"); // views mebo banner on home page

    cy.visit("http://localhost:8888/send-message-in-bottle");
    cy.get('[data-cy="sct-send-mebo-form"]').should("exist"); // views form on send mebo page
  });

  // it gives maximum 3 mebo tokens per user per day
  it("gives maximum 3 mebo tokens per user per day", () => {
    const taskName = `TaskForMebo-${Date.now()}`;
    cy.createAndCompleteTask(`${taskName}1`);
    cy.createAndCompleteTask(`${taskName}2`);
    cy.createAndCompleteTask(`${taskName}3`);
    cy.createAndCompleteTask(`${taskName}4`);

    cy.get('[data-cy="home-mebo-banner"]').should("exist"); // views mebo banner on home page
    cy.contains(/You can send (\d+) Message/) // find text that contains mebo count
      .invoke("text")
      .then((text) => {
        const count = parseInt(text.match(/You can send (\d+) Message/)[1]);
        expect(count).to.be.at.most(3); // mebo count should be at most 3
      });

    cy.visit("http://localhost:8888/send-message-in-bottle");
    cy.get('[data-cy="sct-send-mebo-form"]').should("exist"); // views form on send mebo page
    cy.contains(/You can send (\d+) Message/) // find text that contains mebo count
      .invoke("text")
      .then((text) => {
        const count = parseInt(text.match(/You can send (\d+) Message/)[1]);
        expect(count).to.be.at.most(3); // mebo count should be at most 3
      });
  });

  // it sends mebo and shows success screen
  it("sends mebo and shows success screen", () => {
    cy.visit("http://localhost:8888/send-message-in-bottle");
    cy.get('[data-cy="inp-write-mebo"]').find("textarea").clear().type(
      // type message with 200+ characters
      "Cypress E2E Test. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebu"
    );
    cy.get('[data-cy="check-mebo-compliance"]').click(); // tick the box to agree to guidelines
    cy.get('[data-cy="btn-initiate-sending-mebo"]')
      .should("be.enabled")
      .click();
    cy.get('[data-cy="modal-btn-primary"]').click(); // confirm sending mebo
    cy.contains("has been sent").should("be.visible"); // shows feedback message in headline
    cy.get('[data-cy="mebo-sent-container"]').should("be.visible"); // shows feedback container
  });

  // it does not allow to send mebo with invalid conditions
  it("does not allow sending mebo with less than 200 characters", () => {
    cy.visit("http://localhost:8888/send-message-in-bottle");
    cy.get('[data-cy="inp-write-mebo"]').find("textarea").clear().type(
      // type message with less than 200 characters
      "Cypress E2E Test. At vero eos et accusam et justo duo dolores et ea rebu."
    );
    cy.get('[data-cy="check-mebo-compliance"]').click(); // tick the box to agree to guidelines
    cy.get('[data-cy="btn-initiate-sending-mebo"]').should("be.disabled"); // submit button is disabled
    cy.get('[data-cy="tooltip-mebo"]')
      .trigger("mouseover")
      .should("be.visible"); // tooltip visible on button hover
  });

  it("does not allow sending mebo without agreeing to mebo guidelines", () => {
    cy.visit("http://localhost:8888/send-message-in-bottle");
    cy.get('[data-cy="inp-write-mebo"]').find("textarea").clear().type(
      // type message with valid amount of characters
      "Cypress E2E Test. At vero eos et accusam et justo duo dolores et ea rebu. At vero eos et accusam et justo duo dolores et ea rebu. At vero eos et accusam et justo duo dolores et ea rebu. At vero eos et accusam et justo duo dolores et ea rebu. At vero eos et accusam et justo duo dolores et ea rebu. "
    );
    cy.get('[data-cy="check-mebo-compliance"]').should("not.be.checked"); // checkbox is unchecked
    cy.get('[data-cy="btn-initiate-sending-mebo"]').should("be.disabled"); // submit button is disabled
    cy.get('[data-cy="tooltip-mebo"]')
      .trigger("mouseover")
      .should("be.visible"); // tooltip visible on button hover
  });
});
