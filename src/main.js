import { evaluateEnding } from './domain.js';
import { predictSupport, recordDecision, downloadCollectedCsv, collectedCount } from './adaptive.js';

const profile = { level: '', role: '', goal: '' };
const decisions = [];
let sceneOpenedAt = Date.now();
let wrongCount = 0;
let hintCount = 0;

const questions = [
  {
    key: 'architecture',
    label: 'KARAR 1 · MİMARİ',
    title: 'Sistemi nasıl ayağa kaldıracaksın?',
    body: 'Dün geceki sürümden sonra randevu sistemi açılmıyor. Veritabanı değişikliği olup olmadığını henüz bilmiyorsun.',
    options: [
      { id: 'rollback', text: 'Eski sürüme geri dön', consequence: 'Geri dönüş hızlı olabilir; ancak şema uyumluluğunu doğrulamadan veri kaybı riski doğar.' },
      { id: 'hotfix', text: 'Canlıda yama yap', consequence: 'Yama hedefe yönelik olabilir; fakat baskı altında yapılan değişiklik yeni hata üretme riski taşır.' }
    ]
  },
  {
    key: 'testing',
    label: 'KARAR 2 · TEST',
    title: 'Değişikliği nasıl yayımlayacaksın?',
    body: 'Hazırladığın çözüm çalışıyor gibi görünüyor. Bekleyen 300 hasta var ve zaman daralıyor.',
    options: [
      { id: 'smoke', text: 'Önce kısa test koş', consequence: 'Kısa bir smoke test kritik akışları doğrular ve hatalı yayının etkisini azaltır.' },
      { id: 'immediate', text: 'Hemen yayına al', consequence: 'Dakika kazanırsın; ancak doğrulanmamış davranışı tüm kullanıcılara açarsın.' }
    ]
  },
  {
    key: 'privacy',
    label: 'KARAR 3 · KVKK',
    title: 'Tanı loglarını nasıl paylaşacaksın?',
    body: 'Hatayı bulmak için gereken loglarda hasta adları ve randevu bilgileri bulunuyor.',
    options: [
      { id: 'mask', text: 'Kişisel verileri maskele', consequence: 'Ekip teknik sinyalleri görürken kişisel veriler korunur ve ihlal riski azaltılır.' },
      { id: 'raw', text: 'Logu olduğu gibi ekibe at', consequence: 'Analiz hemen başlayabilir; fakat gereksiz kişisel veri paylaşımı KVKK ihlali oluşturur.' }
    ]
  }
];

function shell(content, step = 0) {
  const progress = step ? `<div class="progress" aria-label="İlerleme"><span style="width:${step * 25}%"></span></div>` : '';
  return `<div class="ambient"></div><section class="phone">${progress}${content}</section>`;
}

function onboarding() {
  document.querySelector('#app').innerHTML = shell(`
    <header class="hero">
      <p class="eyebrow">YZM301 · İNTERAKTİF ÖĞRENME</p>
      <div class="book-mark">SE</div>
      <h1>SE Primer</h1>
      <p class="lead">Yazılım mühendisliği,<br><strong>oynanan bir kitap.</strong></p>
    </header>
    <form id="profile-form" class="card form-card">
      <fieldset><legend>Deneyim seviyen</legend><div class="choices">
        <label><input type="radio" name="level" value="beginner" required><span>Yeni başladım</span></label>
        <label><input type="radio" name="level" value="experienced"><span>Deneyimliyim</span></label>
      </div></fieldset>
      <fieldset><legend>Rolün</legend><select name="role" required><option value="">Rol seç</option><option>Backend</option><option>Frontend</option><option>Test</option><option>DevOps</option></select></fieldset>
      <fieldset><legend>Bugünkü hedefin</legend><select name="goal" required><option value="">Hedef seç</option><option value="architecture">Mimari kararlar</option><option value="testing">Test stratejisi</option><option value="security">Güvenlik ve KVKK</option></select></fieldset>
      <button class="primary" type="submit">Vakayı başlat <span>→</span></button>
      <button class="option" id="collection-mode" type="button"><b>V2</b><span>Veri Toplama Modu</span><em>→</em></button>
    </form>
  `);
  document.querySelector('#profile-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    profile.level = data.get('level'); profile.role = data.get('role'); profile.goal = data.get('goal');
    intro();
  });
  document.querySelector('#collection-mode').onclick = () => {
    localStorage.setItem('primer_collection_mode', '1');
    alert('Veri Toplama Modu açık. Oyunu tamamlayın; kararlar kişisel veri olmadan bu tarayıcıda tutulacak.');
  };
}

function intro() {
  document.querySelector('#app').innerHTML = shell(`
    <div class="scene crisis">
      <p class="eyebrow">VAKA 01 · SAĞLIK SİSTEMLERİ</p>
      <div class="time">08:00</div>
      <h2>Randevu sistemi çöktü.</h2>
      <p>Dün gece yeni sürüm çıktı. Şu anda <strong>300 hasta</strong> bekliyor ve nöbetçi mühendis sensin.</p>
      <div class="status"><i></i> Kritik servis yanıt vermiyor</div>
    </div>
    <aside class="tutor"><div class="avatar">AI</div><div><b>Primer Tutor</b><p>${profile.level === 'beginner' ? 'Her karar öncesinde sana kısa bir düşünme ipucu vereceğim.' : 'Kararlarını üretim baskısını ve teknik riski birlikte tartarak ver.'}</p></div></aside>
    <button id="continue" class="primary">İlk karara geç <span>→</span></button>
  `, 1);
  document.querySelector('#continue').onclick = () => renderQuestion(0);
}

function hintFor(index) {
  const hints = [
    profile.role === 'DevOps' ? 'Dağıtım geçmişinde hangi değişiklik, güvenli geri dönüş kararını doğrular?' : 'Geri dönüşten önce uygulama ile veritabanı şemasının uyumunu nasıl doğrularsın?',
    profile.goal === 'testing' ? 'En kısa sürede en yüksek riski sınayan üç kritik akış hangileri?' : 'Hız ile güven arasında ölçülebilir bir eşik belirleyebilir misin?',
    profile.goal === 'security' ? 'Sorunu çözmek için logdaki hangi alanlara gerçekten ihtiyaç var?' : 'Ekipteki herkesin hasta kimliğini görmesi teknik analiz için gerekli mi?'
  ];
  return hints[index];
}

function renderQuestion(index) {
  const q = questions[index];
  sceneOpenedAt = Date.now();
  document.querySelector('#app').innerHTML = shell(`
    <div class="topline"><span>08:${String(index * 8 + 4).padStart(2, '0')}</span><span>${profile.role} · ${profile.level === 'beginner' ? 'Başlangıç' : 'Deneyimli'}</span></div>
    <article class="card decision">
      <p class="eyebrow orange">${q.label}</p><h2>${q.title}</h2><p>${q.body}</p>
      <div class="option-list">${q.options.map((o, i) => `<button class="option" data-choice="${o.id}" data-index="${i}"><b>${String.fromCharCode(65 + i)}</b><span>${o.text}</span><em>→</em></button>`).join('')}</div>
    </article>
    <aside class="tutor"><div class="avatar">AI</div><div><b>Primer Tutor · İpucu</b><p>${hintFor(index)}</p></div></aside>
  `, index + 2);
  document.querySelectorAll('.option').forEach(button => button.onclick = () => choose(index, Number(button.dataset.index)));
}

async function choose(questionIndex, optionIndex) {
  const q = questions[questionIndex]; const option = q.options[optionIndex];
  decisions.push({ question: q.key, choice: option.id });
  const risky = ['hotfix', 'immediate', 'raw'].includes(option.id);
  const input = {
    seviye: profile.level === 'experienced' ? 1 : 0,
    karar_suresi_sn: Math.max(1, (Date.now() - sceneOpenedAt) / 1000),
    karar_degistirme_sayisi: 0,
    onceki_yanlis_sayisi: wrongCount,
    ipucu_sayisi: hintCount,
    sahne_no: questionIndex + 1,
  };
  const model = await predictSupport(input);
  if (localStorage.getItem('primer_collection_mode') === '1') {
    const humanLabel = confirm('Bu sahnede ek açıklama veya yönlendirme faydalı olur muydu?\n\nTamam = Evet, İptal = Hayır');
    recordDecision(input, humanLabel ? 1 : 0, 'gercek');
  }
  if (risky) wrongCount += 1;
  if (model.support) hintCount += 1;
  document.querySelector('#app').innerHTML = shell(`
    <article class="card consequence"><div class="result-icon">${model.support ? 'AI' : '✓'}</div><p class="eyebrow orange">KARARININ TEKNİK SONUCU</p><h2>${option.text}</h2><p>${option.consequence}</p>
      <div class="why"><b>Model kararı · p=${model.p.toFixed(3)}</b><p>${model.support ? 'Destek modu açıldı: süre baskısı kaldırıldı ve ayrıntılı açıklama gösteriliyor.' : 'Standart akış sürdürüldü; kısa açıklama yeterli görüldü.'}</p></div>
      <div class="why"><b>Neden?</b><p>${whyText(q.key, option.id)}</p></div>
    </article>
    <button id="next" class="primary">${questionIndex === questions.length - 1 ? 'Sonucu gör' : 'Sonraki karar'} <span>→</span></button>
  `, questionIndex + 2);
  document.querySelector('#next').onclick = () => questionIndex === questions.length - 1 ? ending() : renderQuestion(questionIndex + 1);
}

function whyText(key, id) {
  const map = {
    'architecture:rollback': 'Rollback, daha önce doğrulanmış uygulama koduna döndürür; veri şeması ileri yönlü değiştiyse tek başına yeterli değildir.',
    'architecture:hotfix': 'Küçük ve izole bir yama sorunu azaltabilir; inceleme ve geri alma planı olmadan operasyonel riski büyütür.',
    'testing:smoke': 'Smoke test giriş, randevu arama ve kayıt gibi hayati yolların tamamen kırık olmadığını hızla gösterir.',
    'testing:immediate': 'Test edilmemiş bir değişiklik belirsizliği kullanıcıların üzerine taşır ve olayın etki alanını genişletebilir.',
    'privacy:mask': 'Veri minimizasyonu, yalnızca hata analizi için gerekli teknik alanların paylaşılmasını sağlar.',
    'privacy:raw': 'Hasta adı hata çözümü için gerekli değildir; amaç dışı paylaşım mahremiyet ve mevzuat riski yaratır.'
  };
  return map[`${key}:${id}`];
}

function ending() {
  const privacySafe = decisions.find(d => d.question === 'privacy')?.choice === 'mask';
  const tested = decisions.find(d => d.question === 'testing')?.choice === 'smoke';
  const result = evaluateEnding(decisions);
  const good = result.key === 'safe';
  document.querySelector('#app').innerHTML = shell(`
    <div class="ending ${good ? 'good' : 'bad'}">
      <p class="eyebrow">VAKA TAMAMLANDI</p><div class="end-symbol">${good ? '✓' : '!'}</div>
      <h1>${result.title}</h1>
      <p>${good ? '08:25 — Kritik akış doğrulandı ve kişisel veriler maskelendi.' : privacySafe ? 'Kişisel veri korundu; test edilmeyen yayın operasyonel riski artırdı.' : 'Hasta bilgileri gereksiz yere paylaşıldı. Teknik başarı, güvenlik başarısı değildir.'}</p>
      <div class="score"><span>Karar özeti</span><b>${decisions.filter(d => d.choice === 'smoke' || d.choice === 'mask').length}/2 güvenli pratik</b></div>
      <button id="restart" class="primary">Yeniden oyna <span>↻</span></button>
      ${localStorage.getItem('primer_collection_mode') === '1' ? `<button id="export-data" class="option"><b>CSV</b><span>${collectedCount()} karar satırını indir</span><em>↓</em></button>` : ''}
    </div>
  `, 4);
  document.querySelector('#restart').onclick = () => { decisions.length = 0; onboarding(); };
  document.querySelector('#export-data')?.addEventListener('click', downloadCollectedCsv);
}

function openPreview() {
  const view = new URLSearchParams(location.search).get('preview');
  if (!view) return false;
  Object.assign(profile, { level: 'beginner', role: 'Backend', goal: 'testing' });
  if (view === 'intro') intro();
  else if (view === 'question-1') renderQuestion(0);
  else if (view === 'question-2') renderQuestion(1);
  else if (view === 'question-3') renderQuestion(2);
  else if (view === 'consequence') choose(1, 0);
  else if (view === 'good-ending') {
    decisions.push({ question: 'architecture', choice: 'rollback' }, { question: 'testing', choice: 'smoke' }, { question: 'privacy', choice: 'mask' });
    ending();
  } else if (view === 'bad-ending') {
    decisions.push({ question: 'architecture', choice: 'hotfix' }, { question: 'testing', choice: 'immediate' }, { question: 'privacy', choice: 'raw' });
    ending();
  } else onboarding();
  return true;
}

if (!openPreview()) onboarding();
