# SE Primer v2 — Davranıştan Öğrenen Tutor

SE Primer v2, oyuncunun karar süresi ve önceki davranışlarından ek açıklamaya ihtiyaç duyup duymadığını tahmin eden, ONNX tabanlı uyarlanabilir bir yazılım mühendisliği eğitim oyunudur.

## Üç komutla çalıştırma

```bash
npm install
python generate_data.py
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini açın. Model henüz üretilmediyse uygulama belirtilen deterministik yedek kuralla çalışır; doğrulanmış `model/model.onnx` üretildikten sonra tarayıcıda `onnxruntime-web` kullanılır.

## Model hedefi ve yayın kapısı

- Hedef: Kullanıcının o sahnede ek tutor desteğine ihtiyaç duyup duymadığını (`destek_gerekli`) tahmin etmek.
- Girdiler: seviye, karar süresi, karar değiştirme sayısı, önceki yanlış sayısı, ipucu sayısı ve sahne numarası.
- Önceden belirlenen metrik: pozitif sınıf F1.
- Yayın eşiği: `F1 >= 0.82` ve Python–ONNX maksimum olasılık farkı `< 1e-4`.
- Eşik geçilmezse `train.py` hata koduyla durur ve model artefaktı yayımlanmaz.

## Veri

`python generate_data.py`, sabit `30107` tohumu ile 300 sentetik ve kişisel veri içermeyen başlangıç satırı üretir. Sütunların anlamı [`data/SOZLUK.md`](data/SOZLUK.md) içindedir.

Gerçek yayın için en az 15 benzersiz gerçek oturum zorunludur. Ana ekrandaki **Veri Toplama Modu** seçilir; her karardan sonra katılımcı ek desteğin faydalı olup olmayacağını kendisi etiketler. Oyun sonunda indirilen CSV'ler kişisel bilgi içermez ve `data/oturumlar.csv` ile birleştirilir. `python train.py --release`, 15 gerçek oturum yoksa özellikle başarısız olur.

## Eğitim, doğrulama ve test

```bash
pip install -r requirements.txt
python train.py
python tests/parite.py
npm test
```

`train.py`, `random_state=30107` ile lojistik regresyon eğitir; metrikleri, özellik sırasını, etiketleri ve şema sürümünü `model/config.json` dosyasına yazar. Aynı beş girdinin referans olasılıkları `tests/parite.json` içinde tutulur. Cypress, tarayıcıdaki ONNX olasılıklarını Python oracle ile diferansiyel olarak karşılaştırır ve farkın `< 1e-4` olduğunu doğrular.

## Teslim artefaktları

- Ürün/model şartnamesi ve kabul örnekleri: [`spec.md`](spec.md)
- Veri ve sözlük: [`data/`](data/)
- Tekrarlanabilir eğitim: [`train.py`](train.py)
- ONNX model kartı: [`model/README.md`](model/README.md)
- Parite oracle ve regresyon: [`tests/`](tests/), [`cypress/e2e/model.cy.js`](cypress/e2e/model.cy.js)
- Sürüm, rollback ve rollout planı: [`RELEASE.md`](RELEASE.md)
- Uyarlanabilir sınav tasarımı: [`SINAV_TASARIMI.md`](SINAV_TASARIMI.md)

## Mimari karar

Tarayıcı içi ONNX, kullanıcı davranışını sunucuya göndermeden düşük gecikmeli çıkarım sağladığı için seçildi. Browser/mobile/server seçeneklerinin maliyet, gecikme, mahremiyet ve operasyon karşılaştırması [`RELEASE.md`](RELEASE.md) içindedir.

## Yapay zekâ/kodlama ajanı beyanı

Kodlama ajanı; dosya iskeleti, sentetik veri üreticisi, eğitim hattı, ONNX parite testi, tarayıcı entegrasyonu ve belge taslaklarında kullanıldı. İnsan tarafından özellikle düzeltilen kararlar: modelin kendi tahminini gerçek etiket olarak kullanmamak, gerçek etiketi katılımcıdan almak, 15 gerçek oturum olmadan release'i engellemek ve kişisel veri toplamamak.
