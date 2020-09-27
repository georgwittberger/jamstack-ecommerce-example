describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays the project title and description', () => {
    cy.get('h1').should('have.text', 'JAMStack E-Commerce')
    cy.contains('Showcase of an e-commerce website built with the JAMStack')
  })

  it('contains a button that navigates to products overview', () => {
    cy.contains('Browse All Products').click()
    cy.location('pathname').should('eq', '/products')
  })
})
