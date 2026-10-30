"""SE Primer v2 küçük modelini eğitir, ölçer ve ONNX artefaktını paketler."""
from __future__ import annotations
import argparse
import json
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
import onnxruntime as ort

ROOT = Path(__file__).parent
DATA = ROOT / "data" / "oturumlar.csv"
MODEL_DIR = ROOT / "model"
FEATURES = [
    "seviye", "karar_suresi_sn", "karar_degistirme_sayisi",
    "onceki_yanlis_sayisi", "ipucu_sayisi", "sahne_no",
]
TARGET = "destek_gerekli"
RANDOM_STATE = 30107
F1_GATE = 0.82
PARITY_TOLERANCE = 1e-4


def positive_probability(output: list, n: int) -> np.ndarray:
    for value in output:
        if isinstance(value, np.ndarray) and value.ndim == 2 and value.shape == (n, 2):
            return value[:, 1].astype(float)
        if isinstance(value, list) and value and isinstance(value[0], dict):
            return np.array([row.get(1, row.get("1")) for row in value], dtype=float)
    raise RuntimeError("ONNX olasılık çıktısı bulunamadı")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--release", action="store_true", help="15 gerçek oturum yoksa yayını durdur")
    args = parser.parse_args()
    df = pd.read_csv(DATA)
    missing = set(FEATURES + [TARGET, "kaynak", "oturum_id"]) - set(df.columns)
    if missing:
        raise SystemExit(f"Eksik sütunlar: {sorted(missing)}")
    real_sessions = df.loc[df.kaynak.eq("gercek"), "oturum_id"].nunique()
    if args.release and real_sessions < 15:
        raise SystemExit(f"YAYIN DURDU: en az 15 gerçek oturum gerekli, bulunan={real_sessions}")

    X = df[FEATURES].astype(np.float32)
    y = df[TARGET].astype(int)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=RANDOM_STATE, stratify=y
    )
    model = Pipeline([
        ("scale", StandardScaler()),
        ("classifier", LogisticRegression(random_state=RANDOM_STATE, max_iter=1000)),
    ])
    model.fit(X_train, y_train)
    pred = model.predict(X_test)
    proba = model.predict_proba(X_test)[:, 1]
    metrics = {
        "accuracy": round(float(accuracy_score(y_test, pred)), 6),
        "precision": round(float(precision_score(y_test, pred)), 6),
        "recall": round(float(recall_score(y_test, pred)), 6),
        "f1": round(float(f1_score(y_test, pred)), 6),
        "roc_auc": round(float(roc_auc_score(y_test, proba)), 6),
    }
    if metrics["f1"] < F1_GATE:
        raise SystemExit(f"EVAL KAPISI BAŞARISIZ: f1={metrics['f1']} < {F1_GATE}; artefakt yayınlanmadı")

    MODEL_DIR.mkdir(exist_ok=True)
    onnx_model = convert_sklearn(
        model,
        initial_types=[("float_input", FloatTensorType([None, len(FEATURES)]))],
        options={id(model.named_steps["classifier"]): {"zipmap": False}},
        target_opset=17,
    )
    model_path = MODEL_DIR / "model.onnx"
    model_path.write_bytes(onnx_model.SerializeToString())
    session = ort.InferenceSession(str(model_path), providers=["CPUExecutionProvider"])
    outputs = session.run(None, {session.get_inputs()[0].name: X_test.to_numpy(np.float32)})
    onnx_p = positive_probability(outputs, len(X_test))
    max_diff = float(np.max(np.abs(proba - onnx_p)))
    if max_diff >= PARITY_TOLERANCE:
        model_path.unlink(missing_ok=True)
        raise SystemExit(f"PARİTE BAŞARISIZ: max fark={max_diff} >= {PARITY_TOLERANCE}")

    config = {
        "model_name": "se-primer-destek-riski-v2",
        "version": "2.0.0",
        "features": FEATURES,
        "feature_schema": {name: {"type": "number"} for name in FEATURES},
        "labels": {"0": "standart_akis", "1": "destek_modu"},
        "decision_threshold": 0.5,
        "eval_gate": {"metric": "f1", "minimum": F1_GATE, "written_before_training": True},
        "metrics": metrics,
        "parity": {"max_abs_diff": max_diff, "tolerance": PARITY_TOLERANCE},
        "random_state": RANDOM_STATE,
        "rows": int(len(df)),
        "real_sessions": int(real_sessions),
        "release_eligible": bool(real_sessions >= 15),
    }
    (MODEL_DIR / "config.json").write_text(json.dumps(config, ensure_ascii=False, indent=2), encoding="utf-8")

    refs = X_test.head(5).reset_index(drop=True)
    refs_p = model.predict_proba(refs)[:, 1]
    parity = [{"input": {k: float(v) for k, v in row.items()}, "p": float(p)} for (_, row), p in zip(refs.iterrows(), refs_p)]
    (ROOT / "tests" / "parite.json").write_text(json.dumps(parity, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(config, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
