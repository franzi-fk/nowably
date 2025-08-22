const BASE_URL = "http://localhost:8888";

describe("App main navigation (Sidebar)", () => {
  const navItems = [
    { index: 0, path: "/", title: "Welcome" }, // Home
    { index: 1, path: "/all-tasks", title: "All Tasks" },
    { index: 2, path: "/completion-cards", title: "Completion Cards" },
    {
      index: 3,
      path: "/send-message-in-bottle",
      title: "Send a Message in a Bottle",
    },
    {
      index: 4,
      path: "/received-messages",
      title: "Received Messages in a Bottle",
    },
  ];

  function clickAndVerifyNavItem({ index, path, title }) {
    cy.get('[data-cy="nav-sidebar"]').within(() => {
      cy.get("ul li").eq(index).click();
    });
    cy.url().should("include", path);
    cy.contains(title).should("be.visible");
  }

  function collapseSidebar() {
    cy.get('[data-cy="nav-sidebar"]').within(() => {
      cy.get('[data-cy="btn-menu-toggle"]').click();
      cy.get('[data-cy="ul-expanded-menu"]').should("not.exist");
      cy.get('[data-cy="ul-collapsed-menu"]').should("be.visible");
    });
  }

  function expandSidebar() {
    cy.get('[data-cy="nav-sidebar"]').within(() => {
      cy.get('[data-cy="btn-menu-toggle"]').click();
      cy.get('[data-cy="ul-expanded-menu"]').should("be.visible");
      cy.get('[data-cy="ul-collapsed-menu"]').should("not.exist");
    });
  }

  beforeEach(() => {
    cy.clearAllSessionStorage(); // reset sidebar
    cy.loginWithFirebase();
    cy.visit(`${BASE_URL}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem("cookieAccepted", "true");
      },
    });
  });

  it("expands and collapses when clicking toggle menu icon", () => {
    collapseSidebar();
    expandSidebar();
  });

  it("persists menu toggle state on page reload", () => {
    collapseSidebar();
    cy.reload();
    // check state after reload
    cy.get('[data-cy="nav-sidebar"]').within(() => {
      cy.get('[data-cy="ul-expanded-menu"]').should("not.exist");
      cy.get('[data-cy="ul-collapsed-menu"]').should("be.visible");
    });
  });

  context("Expanded sidebar", () => {
    it("navigates home when clicking logo", () => {
      cy.visit(`${BASE_URL}/all-tasks`);
      cy.get('[data-cy="nowably-logo"]').click();
      cy.url().should("include", "/");
      cy.contains("Welcome").should("be.visible");
    });

    navItems.forEach((item) => {
      it(`navigates to '${item.title}' when clicking respective menu item`, () => {
        clickAndVerifyNavItem(item);
      });
    });
  });

  context("Collapsed sidebar", () => {
    beforeEach(() => {
      collapseSidebar();
    });

    navItems.forEach((item) => {
      it(`navigates to '${item.title}' when clicking respective menu item`, () => {
        clickAndVerifyNavItem(item);
      });
    });
  });
});
