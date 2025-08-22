const BASE_URL = "http://localhost:8888";

function openUserMenu() {
  cy.get('[data-cy="btn-user-menu"]').should("be.visible").click();
  cy.get('[data-cy="user-menu"]').should("be.visible");
}

describe("User menu", () => {
  beforeEach(() => {
    cy.loginWithFirebase();
    cy.visit(`${BASE_URL}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem("cookieAccepted", "true");
      },
    });
  });

  it("opens and closes when clicking on user profile image", () => {
    // open menu
    openUserMenu();
    // close menu by clicking profile image
    cy.get('[data-cy="btn-user-menu"]').should("be.visible").click();
    cy.get('[data-cy="user-menu"]').should("not.exist");
  });

  it("closes when clicking outside of menu", () => {
    // open menu
    openUserMenu();
    // close menu by clicking outside of menu box
    cy.get("body").click(300, 25);
    cy.get('[data-cy="user-menu"]').should("not.exist");
  });

  const userMenuMainItems = [
    { index: 0, path: "/account", title: "Account" },
    { index: 1, path: "/login", title: null }, // sign out
  ];

  userMenuMainItems.forEach(({ index, path, title }) => {
    it(`navigates to ${title || "Login"} when clicking respective menu item`, () => {
      openUserMenu();
      cy.get('[data-cy="user-menu-main-items"] li').eq(index).click();
      cy.url().should("include", path);
      if (title) cy.contains(title).should("be.visible");
    });
  });

  const userMenuLegalItems = [
    { index: 0, path: "/terms-of-use", title: "Terms of Use" },
    { index: 1, path: "/privacy", title: "Privacy Policy" },
    { index: 2, path: "/legal-notice", title: "Legal Notice" },
  ];

  userMenuLegalItems.forEach(({ index, path, title }) => {
    it(`navigates to ${title} when clicking respective menu item`, () => {
      openUserMenu();
      cy.get('[data-cy="user-menu-legal-items"] li').eq(index).click();
      cy.url().should("include", path);
      cy.contains(title).should("be.visible");
    });
  });
});
