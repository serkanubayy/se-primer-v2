"""Python Oracle: ONNX modelini 5 sabit referansta çalıştırır ve parite.json ile kıyaslar."""
import json
from pathlib import Path
import numpy as np
import onnxruntime as ort

ROOT = Path(__file__).resolve().parents[1]
TOL = 1e-4
refs = json.loads((ROOT / "tests" / "parite.json").read_text(encoding="utf-8"))
config = json.loads((ROOT / "model" / "config.json").read_text(encoding="utf-8"))
X = np.array([[item["input"][name] for name in config["features"]] for item in refs], dtype=np.float32)
session = ort.InferenceSession(str(ROOT / "model" / "model.onnx"), providers=["CPUExecutionProvider"])
outputs = session.run(None, {session.get_inputs()[0].name: X})
probs = next(value[:, 1] for value in outputs if isinstance(value, np.ndarray) and value.ndim == 2 and value.shape[1] == 2)
for i, (actual, expected) in enumerate(zip(probs, [x["p"] for x in refs]), 1):
    diff = abs(float(actual) - expected)
    assert diff < TOL, f"referans {i}: fark={diff}"
    print(f"referans {i}: p={actual:.8f}, fark={diff:.2e} PASS")
