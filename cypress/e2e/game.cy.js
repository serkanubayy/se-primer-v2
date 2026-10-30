function start(level = 'Yeni başladım', role = 'Backend', goal = 'Test stratejisi') {
  cy.visit('/');
  cy.contains(level).click();
  cy.get('select[name="role"]').select(role);
  cy.get('select[name="goal"]').select(goal);
  cy.contains('Vakayı başlat').click();
  cy.contains('İlk karara geç').click();
}

function decide(architecture, testing, privacy) {
  cy.contains(architecture).click(); cy.contains('Sonraki karar').click();
  cy.contains(testing).click(); cy.contains('Sonraki karar').click();
  cy.contains(privacy).click(); cy.contains('Sonucu gör').click();
}

describe('SE Primer', () => {
  it('girişte üç kişiselleştirme alanını zorunlu tutar', () => {
    cy.visit('/'); cy.contains('Vakayı başlat').click(); cy.contains('SE Primer').should('be.visible');
  });
  it('güvenli yoldan iyi sona ulaşır', () => {
    start(); decide('Eski sürüme geri dön', 'Önce kısa test koş', 'Kişisel verileri maskele');
    cy.contains('Sistem ayakta, veri güvende.').should('be.visible');
  });
  it('ham log paylaşımında KVKK ihlalini gösterir', () => {
    start('Deneyimliyim', 'DevOps', 'Güvenlik ve KVKK'); decide('Canlıda yama yap', 'Önce kısa test koş', 'Logu olduğu gibi ekibe at');
    cy.contains('KVKK ihlali var').should('be.visible');
  });
  it('testsiz yayının operasyonel riskini gösterir', () => {
    start(); decide('Canlıda yama yap', 'Hemen yayına al', 'Kişisel verileri maskele');
    cy.contains('risk devam ediyor').should('be.visible');
  });
  it('oyunu yeniden başlatır', () => {
    start(); decide('Eski sürüme geri dön', 'Önce kısa test koş', 'Kişisel verileri maskele');
    cy.contains('Yeniden oyna').click(); cy.contains('Deneyim seviyen').should('be.visible');
  });
});
