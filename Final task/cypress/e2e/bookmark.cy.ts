// filepath: c:\a2sv-web-track\Final task\cypress\e2e\bookmark.cy.ts
describe("Bookmark Feature", () => {
  // Test suite for users who are not logged in
  context("when logged out", () => {
    it("should show a toast message to login when trying to bookmark", () => {
      // Intercept bookmarks API to debug session/auth issues
      cy.intercept("GET", "**/bookmarks*", (req) => {
        req.continue((res) => {
          cy.log("Bookmarks API status:", res.statusCode);
          cy.log("Bookmarks API body:", JSON.stringify(res.body));
        });
      });
      cy.visit("/jobs");
      cy.get('button[aria-label="bookmark"]', { timeout: 10000 }).should(
        "exist"
      );
      cy.get('button[aria-label="bookmark"]').first().click();
      cy.contains("Please sign in to bookmark jobs").should("be.visible");
    });
  });

  context("when logged in", () => {
    beforeEach(() => {
      // Intercept POST /bookmarks/:id to log all request headers (use console.log to avoid Cypress command queue errors)
      cy.intercept("POST", "**/bookmarks/*", (req) => {
        console.log(
          "[CYPRESS DEBUG] POST /bookmarks/:id headers:",
          req.headers
        );
        req.continue((res) => {
          console.log(
            "[CYPRESS DEBUG] POST /bookmarks/:id response status:",
            res.statusCode
          );
          console.log(
            "[CYPRESS DEBUG] POST /bookmarks/:id response body:",
            res.body
          );
        });
      });
      // UI-based login for NextAuth credentials provider
      cy.visit("/login");
      cy.get("input#email").type("samayalews683@gmail.com");
      cy.get("input#password").type("12345678");
      cy.get('button[type="submit"]').click();
      // Wait for redirect to jobs page
      cy.url({ timeout: 10000 }).should("include", "/jobs");
      // Force reload to ensure session is hydrated for Cypress
      cy.reload();
      // Wait for session to hydrate and accessToken to be present (robust against NextAuth hydration)
      // @ts-ignore
      interface Session {
        accessToken?: string;
        [key: string]: unknown;
      }

      interface CustomWindow extends Window {
        session?: Session;
      }

      // Wait for the accessToken to appear in localStorage after login and reload.
      cy.window({ timeout: 20000 })
        .its("localStorage")
        .invoke("getItem", "accessToken")
        .should("exist")
        .and("not.be.empty");
    });

    it("should allow a user to bookmark and unbookmark a job", () => {
      cy.visit("/jobs");

      // Wait for at least one job card to exist (up to 10s)
      cy.get('[data-cy="job-card"]', { timeout: 10000 }).should("exist");
      cy.get('[data-cy="job-card"]')
        .first()
        .then(($card) => {
          const jobId = $card.attr("data-job-id");

          // Intercept the bookmark request for this job BEFORE clicking
          cy.intercept("POST", `**/bookmarks/${jobId}`).as("bookmarkJob");
          // Bookmark the first job
          cy.get(
            `[data-job-id='${jobId}'] button[aria-label="bookmark"]`
          ).click();

          // Wait for the bookmark request to finish
          cy.wait("@bookmarkJob");

          // Go to bookmarks page and verify job is present
          cy.visit("/bookmarks");
          cy.get(`[data-job-id='${jobId}']`, { timeout: 10000 }).should(
            "exist"
          );

          // Unbookmark from bookmarks page
          cy.get(
            `[data-job-id='${jobId}'] button[aria-label="bookmark"]`
          ).click();
          cy.wait(1000);

          // Verify the job is gone from bookmarks
          cy.get(`[data-job-id='${jobId}']`).should("not.exist");
        });
    });
  });
});
function context(arg0: string, arg1: () => void) {
  throw new Error("Function not implemented.");
}

