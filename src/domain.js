export function evaluateEnding(decisions) {
  const privacySafe = decisions.find((item) => item.question === 'privacy')?.choice === 'mask';
  const tested = decisions.find((item) => item.question === 'testing')?.choice === 'smoke';
  if (!privacySafe) return { key: 'privacy-breach', title: 'Sistem ayakta ama KVKK ihlali var.' };
  if (!tested) return { key: 'operational-risk', title: 'Sistem ayakta; risk devam ediyor.' };
  return { key: 'safe', title: 'Sistem ayakta, veri güvende.' };
}
