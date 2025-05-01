
describe('Poll Voting Flow', () => {
  beforeEach(() => {
    // Visit the homepage and login
    cy.visit('/');
    cy.get('a').contains('Login').click();
    
    // Use test account credentials - these would be specific to your setup
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button').contains('Sign In').click();
  });

  it('should allow a user to create a poll and vote on it', () => {
    // Navigate to the dashboard
    cy.url().should('include', '/dashboard');
    
    // Create a new poll
    cy.get('button').contains('Create New Poll').click();
    cy.get('input#title').type('What is your favorite programming language?');
    cy.get('input[placeholder="Option 1"]').type('JavaScript');
    cy.get('input[placeholder="Option 2"]').type('TypeScript');
    cy.get('button').contains('Add Option').click();
    cy.get('input[placeholder="Option 3"]').type('Python');
    cy.get('button').contains('Create Poll').click();
    
    // Verify we are redirected to the poll detail page
    cy.url().should('include', '/poll/');
    
    // Vote on the poll
    cy.get('label').contains('TypeScript').click();
    cy.get('button').contains('Submit Vote').click();
    
    // Verify the results are displayed
    cy.contains('Poll Results').should('be.visible');
    cy.get('svg').should('exist'); // Check that the chart is rendered
  });
});
