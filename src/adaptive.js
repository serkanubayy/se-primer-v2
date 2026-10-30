const FEATURES = ['seviye', 'karar_suresi_sn', 'karar_degistirme_sayisi', 'onceki_yanlis_sayisi', 'ipucu_sayisi', 'sahne_no'];
let sessionPromise;
const sessionId = crypto.randomUUID();

async function getSession() {
  if (!sessionPromise) {
    sessionPromise = (async () => {
      if (!window.ort) throw new Error('onnxruntime-web yüklenemedi');
      window.ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/';
      return window.ort.InferenceSession.create('./model/model.onnx', { executionProviders: ['wasm'] });
    })();
  }
  return sessionPromise;
}

export async function predictSupport(input) {
  try {
    const session = await getSession();
    const values = Float32Array.from(FEATURES.map(name => Number(input[name])));
    const feeds = { [session.inputNames[0]]: new window.ort.Tensor('float32', values, [1, FEATURES.length]) };
    const out = await session.run(feeds);
    const candidate = Object.values(out).find(value => value.dims?.length === 2 && value.dims[1] === 2);
    const p = Number(candidate.data[1]);
    return { p, support: p >= 0.5, source: 'onnx' };
  } catch (error) {
    const score = -2.4 + 0.055 * input.karar_suresi_sn + 0.75 * input.karar_degistirme_sayisi + 0.9 * input.onceki_yanlis_sayisi + 0.4 * input.ipucu_sayisi - 0.7 * input.seviye + 0.12 * input.sahne_no;
    const p = 1 / (1 + Math.exp(-score));
    return { p, support: p >= 0.5, source: 'fallback' };
  }
}

export function recordDecision(input, label, source) {
  if (source !== 'gercek') return;
  const rows = JSON.parse(localStorage.getItem('primer_rows') || '[]');
  rows.push({ oturum_id: sessionId, ...input, destek_gerekli: label, kaynak: 'gercek' });
  localStorage.setItem('primer_rows', JSON.stringify(rows));
}

export function collectedCount() {
  return JSON.parse(localStorage.getItem('primer_rows') || '[]').length;
}

export function downloadCollectedCsv() {
  const rows = JSON.parse(localStorage.getItem('primer_rows') || '[]');
  if (!rows.length) return;
  const columns = ['oturum_id', ...FEATURES, 'destek_gerekli', 'kaynak'];
  const csv = [columns.join(','), ...rows.map(row => columns.map(c => row[c]).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = `primer-gercek-${sessionId}.csv`; a.click();
  URL.revokeObjectURL(url);
}
