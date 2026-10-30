---
language: tr
license: mit
library_name: onnx
tags: [tabular-classification, education, onnx, se-primer]
---

# SE Primer Destek Riski v2 — Model Kartı

## Amaç

Oyuncunun karar davranışından o sahnede ek öğrenme desteğine ihtiyaç duyup duymadığını tahmin eder. Pozitif sonuçta süre baskısı kaldırılır, daha derin Sokratik ipucu ve ayrıntılı teknik açıklama gösterilir.

## Model ve veri

Standartlaştırılmış altı tabular özellik üzerinde lojistik regresyon kullanılır. Geliştirme verisi sabit `30107` tohumu ve README'de açıklanan kural ile üretilir. Yayın sürümü en az 15 gerçek, anonim oturum olmadan uygun sayılmaz.

## Değerlendirme

Birincil metrik F1; yayın kapısı eğitimden önce `F1 >= 0.82` olarak belirlenmiştir. Güncel sayılar `config.json` içindedir. Sklearn–ONNX maksimum mutlak olasılık farkı `1e-4` altında olmalıdır.

## Sınırlar

- Küçük ve ders bağlamına özgü veri genellenebilir değildir.
- Tahmin pedagojik destek önerisidir; öğrenci yeteneği veya zekâ ölçümü değildir.
- Düşük örneklem nedeniyle alt gruplar için adalet iddiası yoktur.

## Kullanılmaması gereken durumlar

Not verme, öğrenci sıralama, disiplin, sağlık/psikoloji çıkarımı, kimlik tespiti veya başka derslere otomatik genelleme için kullanılmamalıdır.
