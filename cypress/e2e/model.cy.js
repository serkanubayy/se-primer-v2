describe('ONNX diferansiyel parite', () => {
  it('5 Python Oracle olasılığıyla 1e-4 toleransta eşleşir', () => {
    cy.visit('/parity.html');
    cy.get('[data-cy^="case-"]', { timeout: 20000 }).should('have.length', 5).each(($row) => {
      const actual = Number($row.attr('data-p'));
      const expected = Number($row.attr('data-expected'));
      expect(Math.abs(actual - expected)).to.be.lessThan(1e-4);
    });
  });
});
