"""Ödev 7 için tekrarlanabilir sentetik geliştirme verisi üretir.

Gerçek oturum eklemez. Gerçek katılımcı verileri uygulamanın Veri Toplama
Modu'ndan dışa aktarılmalı ve kaynak=gercek olarak bu CSV'ye eklenmelidir.
"""
from pathlib import Path
import uuid
import numpy as np
import pandas as pd

SEED = 30107
ROWS = 300
OUT = Path(__file__).parent / "data" / "oturumlar.csv"


def main() -> None:
    rng = np.random.default_rng(SEED)
    rows = []
    for i in range(ROWS):
        seviye = int(rng.integers(0, 2))
        sahne_no = int(rng.integers(1, 4))
        karar_suresi_sn = round(float(np.clip(rng.normal(13 if seviye else 23, 7), 2, 55)), 2)
        karar_degistirme = int(np.clip(rng.poisson(0.5 if seviye else 1.1), 0, 4))
        onceki_yanlis = int(np.clip(rng.poisson(0.35 if seviye else 0.8), 0, 3))
        ipucu_sayisi = int(np.clip(rng.poisson(0.35 if seviye else 0.9), 0, 3))
        risk = (
            0.10
            + 0.035 * karar_suresi_sn
            + 0.48 * karar_degistirme
            + 0.65 * onceki_yanlis
            + 0.32 * ipucu_sayisi
            - 0.65 * seviye
            + 0.12 * sahne_no
            + rng.normal(0, 0.35)
        )
        destek_gerekli = int(risk >= 1.65)
        rows.append({
            "oturum_id": str(uuid.UUID(int=i + 1)),
            "seviye": seviye,
            "karar_suresi_sn": karar_suresi_sn,
            "karar_degistirme_sayisi": karar_degistirme,
            "onceki_yanlis_sayisi": onceki_yanlis,
            "ipucu_sayisi": ipucu_sayisi,
            "sahne_no": sahne_no,
            "destek_gerekli": destek_gerekli,
            "kaynak": "sentetik",
        })
    OUT.parent.mkdir(parents=True, exist_ok=True)
    pd.DataFrame(rows).to_csv(OUT, index=False)
    print(f"{ROWS} sentetik satır yazıldı: {OUT} (seed={SEED})")


if __name__ == "__main__":
    main()
