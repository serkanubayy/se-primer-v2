# SE Primer v2 — Teslim Özeti

## Doğrulanmış teknik sonuçlar

- GitHub: <https://github.com/serkanubayy/se-primer-v2>
- Canlı uygulama: <https://serkanubayy.github.io/se-primer-v2/>
- Model: lojistik regresyon, ONNX, deterministik `random_state=30107`
- Test F1: `0.84058` (yayın kapısı `>= 0.82`)
- ROC-AUC: `0.947293`
- Python–ONNX maksimum mutlak fark: `9.947e-8` (tolerans `< 1e-4`)
- Tarayıcı karşılaştırma sayfası: <https://serkanubayy.github.io/se-primer-v2/demo.html>

## Artefaktlar

- Şartname ve üç v2 kabul örneği: `spec.md`
- Anonim veri ve sözlük: `data/oturumlar.csv`, `data/SOZLUK.md`
- Tekrarlanabilir eğitim/eval kapısı: `train.py`
- ONNX ve config: `model/model.onnx`, `model/config.json`
- Model kartı: `model/README.md`
- Python oracle ve beş referans: `tests/parite.py`, `tests/parite.json`
- Cypress diferansiyel/regresyon: `cypress/e2e/model.cy.js`, `cypress/e2e/game.cy.js`
- Release/rollback/rollout ve mimari matris: `RELEASE.md`
- Uyarlanabilir sınav sorusu: `SINAV_TASARIMI.md`
- Kodlama ajanı beyanı: `README.md`

## Teslimden önce kapanması gerekenler

- En az 15 benzersiz gerçek oturumu ekleyip `python train.py --release` kapısını geçirmek.
- Modeli açık Hugging Face deposuna yüklemek ve commit'e sabit `resolve/<commit>/model.onnx` bağlantısını buraya yazmak.
- 60–90 saniyelik demo videosunun herkese açık bağlantısını eklemek.
- Dört bağlantıyı ödevin Google Form'una göndermek.

Gerçek veri ve harici hesap bağlantıları tamamlanmadan çalışma “tamamlandı” olarak işaretlenmez.
