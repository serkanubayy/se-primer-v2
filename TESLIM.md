# SE Primer — Teslim Özeti

## Hazır teslim öğeleri

- Çalışan mobil web uygulaması (`src/`)
- Ürün spesifikasyonu, kapsam ve 5 kabul örneği (`spec.md`)
- Mermaid akış şeması (`spec.md`)
- Tasarım sistemi ve Stitch üretim istemi (`DESIGN.md`)
- 20 öğrenci cevabı içeren tutor değerlendirmesi (`eval/tutor-eval.md`)
- Tüm temel kullanıcı yolları için Cypress E2E senaryoları (`cypress/e2e/game.cy.js`)
- 60 saniyelik görsel demo (`docs/se-primer-demo-60s.gif`)
- Giriş, kriz, üç karar, teknik sonuç, iyi ve kötü son ekran kanıtları (`docs/`)
- Yapılmayan üç özellik ve gerekçeleri (`README.md`)

## Doğrulama sonucu

`npm test` komutu sekiz olası karar birleşimini doğrular. Son başarılı koşu:

```text
PASS: 8 karar yolu ve teslim belgeleri doğrulandı.
```

Uygulamanın ilk ekranı ayrıca Playwright ile gerçek tarayıcıda açılmış ve `docs/home.png` olarak kaydedilmiştir.

## Classroom'a eklenecek üç bağlantı

1. GitHub repo bağlantısı
2. Google AI Studio'da yayınlanmış uygulama bağlantısı
3. Demo dosyasının Drive/YouTube bağlantısı

Yerel teslim paketi bu bağlantılar dışındaki tüm içeriği taşır. Dış bağlantılar ilgili hesaplarda oturum açılarak üretildikten sonra bu bölüme yazılmalıdır.
