# Sizinle Uyumlanan Vize — Tek Sayfalık Tasarım

## Senaryo

Bir ekip, öğrencinin cevap süresi ve önceki hatalarından “ek ipucu gerekli” tahmini yapan küçük bir modeli web ve Python ortamlarında çalıştırmaktadır. Yeni model, doğruluğu artırmış görünmesine rağmen 300 referans girdinin 7'sinde web olasılığı Python'dan `0.00018` farklıdır. Üretimde destek gösterim oranı %22'den %61'e çıkmıştır; ekip modeli doğrudan %100 trafiğe vermek istemektedir.

## Soru

Bir yayın sorumlusu olarak aşağıdaki kararları gerekçeleriyle tek bir test/yayın planında birleştirin:

1. `1e-4` toleransına göre sürüm yayınlanabilir mi? Bu kontrol doğrulama mı, geçerleme mi?
2. 300 girdi hangi test kahiniyle ve hangi diferansiyel test düzeniyle karşılaştırılmalıdır?
3. Eski davranışın korunması için karakterizasyon ve regresyon testleri nasıl ayrılır?
4. %22→%61 değişimin hata mı yoksa gerçek veri kayması mı olduğunu nasıl araştırırsınız?
5. Shadow, Canary ve rollback adımlarını; gözleyeceğiniz iki metrik ve sürümleme stratejisiyle yazın.

## Beklenen kavramlar

Test kahini/oracle, diferansiyel test, hata toleransı, doğrulama–geçerleme ayrımı, karakterizasyon testi, regresyon, veri/konsept kayması, shadow/canary, commit'e sabit artefakt ve rollback.

## Çeldiriciler

Yalnızca accuracy değerine bakmak; ortalama fark toleransın altındaysa maksimum farkı yok saymak; “web çalışıyor” demeyi geçerleme kabul etmek; modeli `main` dalından indirmek; canary gözlemi olmadan %100 trafiğe çıkmak.

Bu soru ezber tanımı değil, aynı belirtileri farklı mühendislik kavramlarıyla ayırma ve kanıta dayalı yayın kararı verme becerisini ölçer.
