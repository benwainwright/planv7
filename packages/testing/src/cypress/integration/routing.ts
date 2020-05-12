describe("The root path", () => {
  it("Redirects to /app when visited", () => {
    cy.visit("/");
    cy.location("pathname").should("eq", "/app");
  });
});

describe("The app path", () => {
  it("Loads a page containing the react application", () => {
    cy.visit("/app");
    cy.get("#root").should("exist");
  });
});

describe("The register path", () => {
  it("Loads a page containing the react application", () => {
    cy.visit("/app/register");
    cy.get("#root").should("exist");
  });
});
