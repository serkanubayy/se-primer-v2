# Google AI Studio üretim istemi

Aşağıdaki metni Google AI Studio **New app** alanına tek parça halinde verin:

```text
Build a complete mobile-first Turkish web app named “SE Primer — Yazılım Mühendisliği, Oynanan Bir Kitap”. It is an interactive software-engineering learning game.

Visual language: dark navy (#06142c), warm orange (#efa03b), editorial serif headings, modern sans-serif body, illustrated storybook atmosphere, accessible high-contrast controls. On desktop show a centered 390–430 px phone-like experience; on mobile use the full viewport.

Onboarding must ask exactly three required questions:
1. Experience: “Yeni başladım” or “Deneyimliyim”
2. Role: Backend, Frontend, Test, DevOps
3. Goal: Mimari kararlar, Test stratejisi, Güvenlik ve KVKK

Scenario: At 08:00 a hospital appointment system is down after last night's release and 300 patients are waiting. The player is the on-call engineer.

Decision 1 — Architecture:
A) Eski sürüme geri dön
B) Canlıda yama yap

Decision 2 — Testing:
A) Önce kısa test koş
B) Hemen yayına al

Decision 3 — KVKK:
A) Kişisel verileri maskele
B) Logu olduğu gibi ekibe at

After every decision, show both “ne oldu?” and “neden oldu?” as a technical consequence before allowing the player to continue. Include an AI tutor panel at each decision. The tutor must never reveal or name the correct option; it must ask one short Socratic question, adapted to level, role and learning goal. Beginner players receive more context; experienced players see time pressure. DevOps emphasizes rollback/deployment, Test emphasizes smoke tests, and Security emphasizes data minimization.

Ending rules:
- If raw logs are shared: “Sistem ayakta ama KVKK ihlali var.”
- If data is masked but the change was released without a smoke test: “Sistem ayakta; risk devam ediyor.”
- If a smoke test was run and data was masked: “Sistem ayakta, veri güvende.”

Include progress feedback, responsive layout, keyboard accessibility, restart action and no account/login. Do not use real patient data. Keep all UI text in Turkish. Generate the complete runnable application, not a static mockup.
```

## Yayın kontrolü

Uygulama üretildikten sonra üç yolu elle oynayın; ardından **Share/Publish** üzerinden herkese açık görüntüleme bağlantısını kopyalayın.
