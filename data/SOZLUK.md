# Veri Sözlüğü

| Sütun | Tür/Birim | Açıklama |
|---|---|---|
| `oturum_id` | UUID | Kişiyi tanımlamayan rastgele oturum kimliği. |
| `seviye` | 0/1 | 0: yeni başlayan, 1: deneyimli. |
| `karar_suresi_sn` | saniye | Karar ekranının açılması ile seçimin yapılması arasındaki süre. |
| `karar_degistirme_sayisi` | adet | Oyuncunun son onaydan önce farklı seçeneğe geçme sayısı. |
| `onceki_yanlis_sayisi` | adet | Bu oturumda önceki riskli/yanlış kararların sayısı. |
| `ipucu_sayisi` | adet | Bu oturumda o ana kadar gösterilen tutor ipucu sayısı. |
| `sahne_no` | 1–3 | Mimari, test veya KVKK karar sırası. |
| `destek_gerekli` | 0/1 | İnsan etiketi; 1 ise süre baskısı kaldırılıp derin ipucu gösterilir. |
| `kaynak` | kategori | `gercek` veya `sentetik`. |

Ad, e-posta, IP, cihaz kimliği, konum veya hassas kişisel veri toplanmaz.
