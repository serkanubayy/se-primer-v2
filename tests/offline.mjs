import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { evaluateEnding } from '../src/domain.js';

const architectures = ['rollback', 'hotfix'];
const tests = ['smoke', 'immediate'];
const privacy = ['mask', 'raw'];
let paths = 0;

for (const architecture of architectures) {
  for (const testing of tests) {
    for (const privacyChoice of privacy) {
      const result = evaluateEnding([
        { question: 'architecture', choice: architecture },
        { question: 'testing', choice: testing },
        { question: 'privacy', choice: privacyChoice }
      ]);
      const expected = privacyChoice === 'raw' ? 'privacy-breach' : testing === 'immediate' ? 'operational-risk' : 'safe';
      assert.equal(result.key, expected);
      paths += 1;
    }
  }
}

const spec = await readFile(new URL('../spec.md', import.meta.url), 'utf8');
const evaluation = await readFile(new URL('../eval/tutor-eval.md', import.meta.url), 'utf8');
const release = await readFile(new URL('../RELEASE.md', import.meta.url), 'utf8');
const exam = await readFile(new URL('../SINAV_TASARIMI.md', import.meta.url), 'utf8');
assert.match(spec, /## Kabul örnekleri/);
assert.match(spec, /```mermaid/);
assert.match(spec, /F1 >= 0\.82/);
assert.match(spec, /< 1e-4/);
assert.match(release, /Shadow/);
assert.match(release, /Canary %5/);
assert.match(exam, /Uyumlanan/);
assert.equal((evaluation.match(/^\| \d+ \|/gm) || []).length, 20);
console.log(`PASS: ${paths} karar yolu, model kapısı ve v2 teslim belgeleri doğrulandı.`);
