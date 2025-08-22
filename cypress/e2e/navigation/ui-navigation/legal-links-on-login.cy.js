const BASE_URL = "http://localhost:8888";

describe("Legal links on login page", () => {
  const legalLinks = [
    {
      selector: '[data-cy="link-terms-of-use"]',
      path: "/terms-of-use",
      title: "Terms of Use",
    },
    {
      selector: '[data-cy="link-privacy-policy"]',
      path: "/privacy",
      title: "Privacy Policy",
    },
    {
      selector: '[data-cy="link-legal-notice"]',
      path: "/legal-notice",
      title: "Legal Notice",
    },
  ];

  beforeEach(() => {
    cy.visit(`${BASE_URL}/login`);
  });

  legalLinks.forEach(({ selector, path, title }) => {
    it(`navigates to ${title} page and back`, () => {
      cy.get(selector).click();
      cy.url().should("include", path);
      cy.get("h1").should("contain", title);

      // go back
      cy.get('[data-cy="btn-back"]').click();
      cy.url().should("include", "/login");
    });
  });
});
