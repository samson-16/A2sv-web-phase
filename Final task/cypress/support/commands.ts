export {};

/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

// Custom command to log in by API and set NextAuth session
Cypress.Commands.add("loginByApi", (email, password) => {
  cy.request("GET", `${Cypress.env("NEXT_PUBLIC_BASE_URL")}api/auth/csrf`).then(
    (csrfRes) => {
      const csrfToken = csrfRes.body.csrfToken;
      if (!csrfToken) {
        throw new Error(
          `Could not fetch csrfToken. Response: ${JSON.stringify(csrfRes.body)}`
        );
      }
      cy.request({
        method: "POST",
        url: `${Cypress.env(
          "NEXT_PUBLIC_BASE_URL"
        )}api/auth/callback/credentials`,
        form: true,
        body: {
          email,
          password,
          csrfToken,
        },
        followRedirect: false,
      }).then((response) => {
        cy.log(
          "NextAuth credentials callback response:",
          JSON.stringify(response.body)
        );
        // NextAuth will set a session cookie (next-auth.session-token) on success
        // We need to extract it from the response headers and set it for Cypress
        const cookies =
          response.headers["set-cookie"] || response.headers["Set-Cookie"];
        if (!cookies) {
          throw new Error(
            `No set-cookie header found in response: ${JSON.stringify(
              response.headers
            )}`
          );
        }
        // Find the session token cookie
        const sessionCookie = (
          Array.isArray(cookies) ? cookies : [cookies]
        ).find((cookie) => cookie.startsWith("next-auth.session-token"));
        if (!sessionCookie) {
          throw new Error(
            `No next-auth.session-token cookie found. Cookies: ${JSON.stringify(
              cookies
            )}`
          );
        }
        const token = sessionCookie.split(";")[0].split("=")[1];
        cy.setCookie("next-auth.session-token", token);
      });
    }
  );
});
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in by API and set NextAuth session.
       * @example cy.loginByApi('email', 'password')
       */
      loginByApi(email: string, password: string): Chainable<void>;
      // You can uncomment or add other custom commands here as needed
      // login(email: string, password: string): Chainable<void>
      // drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      // dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      // visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
}
