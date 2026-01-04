// Helpers
const $ = (sel, root=document) => root.querySelector(sel);

function openModal(id){ const m = $(id); if(m){ m.classList.add('open'); } }
function closeModal(id){ const m = $(id); if(m){ m.classList.remove('open'); } }

// --- Fase I: hotspot + modal
(function initPhase1(){
  const hotspot = $('#hotspot');
  if(!hotspot) return;

  hotspot.addEventListener('click', () => openModal('#modal-forbidden'));
  $('#closeModal')?.addEventListener('click', () => closeModal('#modal-forbidden'));

  $('#btnForbidden')?.addEventListener('click', () => {
    closeModal('#modal-forbidden');
    const out = $('#sigillo1');
    if(out){
      out.innerHTML = `
        <div class="block">
          <div><strong>SIGILLO I — GENESI</strong></div>
          <div class="small muted">PROSSIMO VARCO: YouTube</div>
          <hr class="sep" />
          <div class="hint">“La GENESI è stata censurata. Cercala dove la censura sembra intrattenimento.”</div>
          <div style="margin-top:12px">
            <a class="btn" href="./p2.html">Procedi → Pagina 2</a>
          </div>
        </div>
      `;
      out.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
})();

// --- Fase III: keypad
(function initPhase3(){
  const pad = $('#keypad');
  if(!pad) return;

  const display = $('#codeDisplay');
  const status = $('#codeStatus');
  const secret = (pad.getAttribute('data-secret') || '739104').trim(); // cambia quando vuoi
  const maxLen = secret.length;
  let value = '';
  let attempts = 0;
  const maxAttempts = 5;

  function render(){
    display.textContent = value.padEnd(maxLen, '•');
  }

  function fail(msg){
    attempts++;
    status.textContent = msg + ` (tentativo ${attempts}/${maxAttempts})`;
    if(attempts >= maxAttempts){
      status.textContent = "TROPPI TENTATIVI. PAUSA FORZATA (30s).";
      Array.from(pad.querySelectorAll('button')).forEach(b=>b.disabled=true);
      setTimeout(() => {
        attempts = 0;
        value = '';
        render();
        status.textContent = "SISTEMA RIPRISTINATO. RIPROVA.";
        Array.from(pad.querySelectorAll('button')).forEach(b=>b.disabled=false);
      }, 30000);
    }
  }

  function success(){
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
    $('#sigillo3').scrollIntoView({behavior:'smooth', block:'start'});
  }

  pad.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if(!btn) return;
    const k = btn.getAttribute('data-key');

    if(k === 'CLR'){ value=''; status.textContent=""; render(); return; }
    if(k === 'DEL'){ value=value.slice(0,-1); render(); return; }

    if(value.length >= maxLen) return;
    value += k;
    render();

    if(value.length === maxLen){
      if(value === secret) success();
      else {
        value='';
        render();
        fail("CHIAVE ERRATA.");
      }
    }
  });

  render();
})();
