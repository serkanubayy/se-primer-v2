describe('SE Primer v2 60–90 saniyelik teslim demosu', () => {
  it('oyun akışını ve aynı sahnede iki farklı model kararını gösterir', () => {
    cy.viewport(390, 844);
    cy.visit('/');
    cy.wait(5000);
    cy.contains('Yeni başladım').click();
    cy.get('select[name="role"]').select('Backend');
    cy.get('select[name="goal"]').select('Test stratejisi');
    cy.contains('Vakayı başlat').click();
    cy.wait(5000);
    cy.contains('İlk karara geç').click();
    cy.wait(7000);
    cy.contains('Eski sürüme geri dön').click();
    cy.wait(7000);
    cy.contains('Sonraki karar').click();
    cy.contains('Önce kısa test koş').click();
    cy.wait(7000);
    cy.contains('Sonraki karar').click();
    cy.contains('Kişisel verileri maskele').click();
    cy.wait(7000);
    cy.contains('Sonucu gör').click();
    cy.wait(7000);

    cy.viewport(1100, 900);
    cy.visit('/demo.html');
    cy.contains('Çıkarım: onnx', { timeout: 20000 }).should('be.visible');
    cy.wait(20000);
  });
});
