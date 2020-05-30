/* eslint-disable sonarjs/no-duplicate-string */
export const TEST_USER_USERNAME = "ben";
export const TEST_USER_EMAIL = "foo@bar.com";
export const TEST_USER_PASSWORD = "foobar";

describe("The register form", () => {
  it("Logs the user in when a registration is successful", () => {
    cy.visit("/app/register");
    cy.get("#username").type(TEST_USER_USERNAME);
    cy.get("#email").type(TEST_USER_EMAIL);
    cy.get("#password").type(TEST_USER_PASSWORD);
    cy.get("#verifyPassword").type(TEST_USER_PASSWORD);
    cy.get('button[type="submit"]').click();
    cy.get("header.appBar").should("contain", "Logout");
    cy.get("header.appBar").should("not.contain", "Login");
  });

  it("Redirects the user away from the register from when successful", () => {
    cy.visit("/app/register");
    cy.get("#username").type("ben2");
    cy.get("#email").type("foo2@bar.com");
    cy.get("#password").type("foobar");
    cy.get('button[type="submit"]').click();
    cy.location("pathname").should("not.eq", "/app/register");
  });
});

describe("The login form", () => {
  it("Should result in a successful login", () => {
    cy.visit("/app/login");
    cy.get("#username").type(TEST_USER_USERNAME);
    cy.get("#password").type(TEST_USER_PASSWORD);
    cy.get('button[type="submit"]').click();
    cy.get("header.appBar").should("contain", "Logout");
    cy.get("header.appBar").should("not.contain", "Login");
  });

  it("Displays an alert when not successful", () => {
    cy.visit("/app/login");
    cy.get("#username").type("definitelynotuser");
    cy.get("#password").type("foobar");
    cy.get('button[type="submit"]').click();
    cy.get(".alert").should("contain", "Login Failed");
  });
});

describe("The logout link", () => {
  it("Should result in the user being logged out", () => {
    cy.visit("/app/register");
    cy.get("#username").type(TEST_USER_USERNAME);
    cy.get("#email").type(TEST_USER_EMAIL);
    cy.get("#password").type(TEST_USER_PASSWORD);
    cy.get('button[type="submit"]').click();
    cy.get("header.appBar").contains("Logout").click();
    cy.get("header.appBar").should("not.contain", "Logout");
    cy.get("header.appBar").should("contain", "Login");
  });
});
