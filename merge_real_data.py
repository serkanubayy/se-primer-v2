"""İndirilen anonim gerçek oturum CSV'lerini ana veri kümesine güvenle ekler."""
from __future__ import annotations

import argparse
from pathlib import Path
import pandas as pd

ROOT = Path(__file__).parent
DATA = ROOT / "data" / "oturumlar.csv"
COLUMNS = [
    "oturum_id", "seviye", "karar_suresi_sn", "karar_degistirme_sayisi",
    "onceki_yanlis_sayisi", "ipucu_sayisi", "sahne_no",
    "destek_gerekli", "kaynak",
]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("files", nargs="+", type=Path)
    args = parser.parse_args()
    base = pd.read_csv(DATA)
    incoming = []
    for path in args.files:
        frame = pd.read_csv(path)
        if list(frame.columns) != COLUMNS:
            raise SystemExit(f"Şema uyuşmuyor: {path}")
        if not frame["kaynak"].eq("gercek").all():
            raise SystemExit(f"Yalnızca kaynak=gercek kabul edilir: {path}")
        if frame[COLUMNS].isna().any().any():
            raise SystemExit(f"Boş değer bulundu: {path}")
        incoming.append(frame)
    merged = pd.concat([base, *incoming], ignore_index=True)
    merged = merged.drop_duplicates(subset=COLUMNS, keep="first")
    merged.to_csv(DATA, index=False)
    real = merged.loc[merged.kaynak.eq("gercek"), "oturum_id"].nunique()
    print(f"Toplam satır={len(merged)}, benzersiz gerçek oturum={real}/15")


if __name__ == "__main__":
    main()
