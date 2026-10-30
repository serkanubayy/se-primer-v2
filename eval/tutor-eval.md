# AI Tutor Değerlendirmesi

## Ölçütler

- **Cevabı ele verme:** Tutor doğru seçeneği açıkça adlandırıyor mu?
- **Yönlendirme:** Kararı öğrencinin vermesini sağlayan yararlı soru var mı?
- **Seviye uyumu:** Dil, öğrencinin seviyesine uygun mu?
- **Kısalık:** En fazla iki cümle mi?

## 20 öğrenci cevabı ve elle etiketleme

| # | Öğrenci cevabı | Tutor yanıtı | Ele verdi mi? | Uygun mu? | Hata türü |
|---|---|---|---|---|---|
| 1 | Direkt rollback yaparım. | Geri dönüşten önce uygulama ve veri şemasının uyumunu nasıl doğrularsın? | Hayır | Evet | — |
| 2 | Canlıda hızlıca düzeltirim. | Yamanın etkisini küçük bir kullanıcı grubunda gözlemleyebileceğin bir yöntem var mı? | Hayır | Evet | — |
| 3 | Ne yapacağımı bilmiyorum. | Önce hangi değişikliğin arızayla aynı zamanda gerçekleştiğini kontrol edebilirsin? | Hayır | Evet | — |
| 4 | Eski sürüm kesin çalışır. | Uygulama kodu geri alınsa bile veritabanında hangi değişiklik kalmış olabilir? | Hayır | Evet | — |
| 5 | Teste zaman yok. | Bir dakikada en büyük riski sınayacak tek kullanıcı akışı hangisi olurdu? | Hayır | Evet | — |
| 6 | Tüm testleri çalıştırırım. | Bekleyen hastaları düşününce hangi küçük test kümesi en kritik güvenceyi sağlar? | Hayır | Evet | — |
| 7 | Hemen production'a basarım. | Başarısız olursa etki alanını ve geri dönüş süresini nasıl sınırlarsın? | Hayır | Evet | — |
| 8 | Smoke test nedir bilmiyorum. | Kullanıcının sisteme girmesi, randevu araması ve kaydetmesi gibi temel yolları kısa bir kontrol listesine çevirebilir misin? | Hayır | Evet | — |
| 9 | Logları Slack'e atarım. | Sorunu çözmek için ekipteki herkesin hasta kimliğini görmesi gerekli mi? | Hayır | Evet | — |
| 10 | Hasta adlarını silerim. | Ad dışında kişiyi belirleyebilecek hangi alanlar logda kalmış olabilir? | Hayır | Evet | — |
| 11 | KVKK'yı sonra düşünürüz. | Teknik aciliyet, gereksiz kişisel veri paylaşımının etkisini ortadan kaldırır mı? | Hayır | Evet | — |
| 12 | Sadece ilgili geliştiriciye yollarım. | Erişimi sınırlamak iyi bir adım; veriyi ayrıca en aza indirmek için ne yapabilirsin? | Hayır | Evet | — |
| 13 | Rollback mi hotfix mi? | Hangisinin başarısızlık durumunda daha hızlı ve güvenli geri alınabildiğini hangi kanıtla karşılaştırırsın? | Hayır | Evet | — |
| 14 | Veritabanı migration'ı var. | Migration geri alınabilir mi ve eski uygulama şemayla uyumlu mu; bunu nereden doğrularsın? | Hayır | Evet | — |
| 15 | Canary deploy yaparım. | Canary grubunda devam veya geri dönüş kararını hangi iki metrik belirler? | Hayır | Evet | — |
| 16 | Önce unit test. | Bu olayda birim testten çok gerçek kullanıcı akışını doğrulayan en küçük test hangisi olabilir? | Hayır | Evet | — |
| 17 | İsimleri yıldızlarım. | Maskelemenin geri döndürülemez ve tüm kişisel alanları kapsadığını nasıl test edersin? | Hayır | Evet | — |
| 18 | Ekran görüntüsü gönderirim. | Görüntüde hasta kimliği dışında hangi hassas bilgiler bulunabilir? | Hayır | Evet | — |
| 19 | Önce sistemi ayağa kaldırmak önemli. | Kullanılabilirlik ile mahremiyeti aynı anda koruyan en küçük güvenli adım ne olabilir? | Hayır | Evet | — |
| 20 | Kararı ekip lideri versin. | Liderden karar isterken seçeneklerin risklerini ve geri dönüş planlarını nasıl özetlersin? | Hayır | Evet | — |

## Sonuç

- Değerlendirilen yanıt: **20**
- Cevabı açıkça ele veren: **0**
- Yararlı ve seviyeye uygun: **20**
- Başarı oranı: **20/20 = %100**
- Gözlenen hata türü: **Yok**

Bu ilk kontrollü değerlendirme, deterministik tutor metinlerinin cevap vermeden yönlendirme koşulunu karşıladığını gösterir. Üretken model bağlandığında aynı tablo tekrar çalıştırılmalı; “doğrudan cevap”, “iki cümleden uzun”, “seviyeye uymama” ve “konu dışı” hata türleri ayrıca izlenmelidir.
