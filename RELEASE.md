# SE Primer v2 — Yayın ve Geri Alma Planı

## v2.0 değişiklikleri

Sabit kurallı tutor yerine karar süresi, karar değiştirme, önceki riskli kararlar, ipucu kullanımı, seviye ve sahne numarasını kullanan küçük ONNX modeli eklendi. Model kararı destek modunu, süre baskısını ve açıklama derinliğini değiştirir.

Hugging Face model deposu: <https://huggingface.co/serkan12324/se-primer-v2>

Yayın commit'i: `175fe658baee8c8fddb596451218de6db2c8399b`

Uygulama ve yeniden üretim kanıtlarında değişken `main` dalı yerine şu sabit artefakt kullanılır:

`https://huggingface.co/serkan12324/se-primer-v2/resolve/175fe658baee8c8fddb596451218de6db2c8399b/model.onnx`

## Güvenli devreye alma

1. **Shadow:** Model tüm oturumlarda sessiz çalışır; eski kuralın kararı, model olasılığı ve gecikme kaydedilir. Kullanıcı deneyimi değişmez.
2. **Canary %5:** Parite, hata oranı ve destek gösterim oranı kabul aralığındaysa rastgele oturumların %5'inde model kararı uygulanır.
3. **Progressive rollout:** 24 saatlik gözlem pencereleriyle %25 → %50 → %100 ilerlenir.
4. **Rollback:** Parite `1e-4` toleransını aşarsa, hata oranı yükselirse veya destek oranı eğitim dağılımından 15 puan saparsa önceki commit URL'sine dönülür; önbellek sürüm anahtarı değiştirilir.

## Mimari ödünleşim matrisi

| Seçenek | Ağ/gecikme | Veri cihazdan çıkar mı? | Model gizliliği | Karar |
|---|---|---|---|---|
| Tarayıcı `onnxruntime-web` | İlk indirme gecikmesi; sonra yerel ve hızlı | Hayır | Model istemciye iner, açıktır | **Seçildi:** ücretsiz, Pages ile kolay ve KVKK açısından güçlü. |
| React Native gömülü | İnternetsiz ve düşük gecikme | Hayır | APK'dan çıkarılabilir | Mobil ürün olursa güçlü seçenek; bu haftanın web kapsamına alınmadı. |
| Kendi sunucumuz | Her istekte ağ gecikmesi ve kesinti riski | Evet | Dosya gizli; istek-cevapla model çıkarımı riski sürer | Ücretsiz kapsam ve veri minimizasyonu nedeniyle seçilmedi. |

Temel feragat: istemci tarafı çıkarım gizliliği ve gecikmeyi iyileştirirken model dosyasını kullanıcıya açar.
