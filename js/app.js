// Helpers
const $ = (sel, root = document) => root.querySelector(sel);

function openModal(id) {
  const m = $(id);
  if (m) m.classList.add('open');
}
function closeModal(id) {
  const m = $(id);
  if (m) m.classList.remove('open');
}

// --- Fase I: hotspot + modal
(function initPhase1() {
  const hotspot = $('#hotspot');
  if (!hotspot) return;

  hotspot.addEventListener('click', () => openModal('#modal-forbidden'));
  $('#closeModal')?.addEventListener('click', () => closeModal('#modal-forbidden'));

  $('#btnForbidden')?.addEventListener('click', () => {
    closeModal('#modal-forbidden');

    const out = $('#sigillo1');
    if (!out) return;

    // ✅ Sostituito link diretto a p2.html con:
    // - link YouTube
    // - campo trascrizione + verifica
    // - link p2 disabilitato finché la trascrizione non è corretta
    out.innerHTML = `
      <div class="block">
        <div><strong>SIGILLO I — GENESI</strong></div>
        <div class="small muted">PROSSIMO VARCO: YouTube</div>
        <hr class="sep" />
        <div class="hint">“La GENESI è stata oscurata. Cercala dove l'oscuro sembra intrattenimento.”</div>

        <div style="margin-top:14px">
          <a class="btn" href="https://www.youtube.com/" target="_blank" rel="noopener">
            Apri il video su YouTube
          </a>
          <div class="small muted" style="margin-top:6px">
            (Recupera la trascrizione dal video)
          </div>
        </div>

        <div style="margin-top:14px">
          <div class="small muted">TRASCRIZIONE</div>
          <input id="yt_tr" class="field mono" type="text"
            placeholder="Incolla la trascrizione…"
            autocomplete="off" spellcheck="false">
          <div style="margin-top:10px">
            <button id="yt_btn" class="btn" type="button">Verifica</button>
          </div>
          <div id="yt_msg" class="small muted" style="margin-top:8px"></div>
        </div>

        <div style="margin-top:14px">
          <a id="to_p2" class="btn"
             href="./p2.html"
             style="opacity:.35; pointer-events:none">
            Sblocca → Pagina 2
          </a>
        </div>
      </div>
    `;

    // --- Verifica trascrizione (Sigillo I → II)
    (function () {
      // ⚠️ Sostituisci con la TRASCRIZIONE ESATTA del tuo video YouTube
      const CANON = "CHI CONTROLLA IL TESTO CONTROLLA LA REALTA";

      const input = $('#yt_tr');
      const btn = $('#yt_btn');
      const msg = $('#yt_msg');
      const link = $('#to_p2');

      if (!input || !btn || !msg || !link) return;

      const norm = (s) =>
        (s || "")
          .trim()
          .replace(/[^\w\s]/g, '') // rimuove punteggiatura
          .replace(/\s+/g, ' ')    // normalizza spazi
          .toUpperCase();

      function lock(text) {
        link.style.opacity = '.35';
        link.style.pointerEvents = 'none';
        msg.className = 'small bad';
        msg.textContent = text;
      }

      function unlock() {
        link.style.opacity = '1';
        link.style.pointerEvents = 'auto';
        msg.className = 'small ok';
        msg.textContent = 'Trascrizione verificata.';
      }

      function check() {
        if (!input.value) return lock('Incolla la trascrizione.');
        if (norm(input.value) !== norm(CANON)) return lock('Verifica fallita.');
        unlock();
      }

      btn.addEventListener('click', check);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') check();
      });
    })();

    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

// --- Fase III: keypad
(function initPhase3() {
  const pad = $('#keypad');
  if (!pad) return;

  const display = $('#codeDisplay');
  const status = $('#codeStatus');
  const secret = (pad.getAttribute('data-secret') || '739104').trim(); // cambia quando vuoi
  const maxLen = secret.length;
  let value = '';
  let attempts = 0;
  const maxAttempts = 5;

  function render() {
    display.textContent = value.padEnd(maxLen, '•');
  }

  function fail(msg) {
    attempts++;
    status.textContent = msg + ` (tentativo ${attempts}/${maxAttempts})`;
    if (attempts >= maxAttempts) {
      status.textContent = "TROPPI TENTATIVI. PAUSA FORZATA (30s).";
      Array.from(pad.querySelectorAll('button')).forEach(b => b.disabled = true);
      setTimeout(() => {
        attempts = 0;
        value = '';
        render();
        status.textContent = "SISTEMA RIPRISTINATO. RIPROVA.";
        Array.from(pad.querySelectorAll('button')).forEach(b => b.disabled = false);
      }, 30000);
    }
  }

  function success() {
    status.textContent = "ACCESSO CONSENTITO.";
    $('#sigillo3').innerHTML = `
      <div class="block">
        <div><strong>SIGILLO III — RITMO</strong></div>
        <div class="small muted">ID: R3-7K2</div>
        <div class="small muted">PROSSIMO VARCO: X (Twitter)</div>
        <hr class="sep" />
        <div class="hint">“Il leak non vive nei video. Vive nei documenti.”</div>
      </div>
    `;
    $('#sigillo3').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  pad.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const k = btn.getAttribute('data-key');

    if (k === 'CLR') { value = ''; status.textContent = ""; render(); return; }
    if (k === 'DEL') { value = value.slice(0, -1); render(); return; }

    if (value.length >= maxLen) return;
    value += k;
    render();

    if (value.length === maxLen) {
      if (value === secret) success();
      else {
        value = '';
        render();
        fail("CHIAVE ERRATA.");
      }
    }
  });

  render();
})();
