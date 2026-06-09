const $ = id => document.getElementById(id);

// --- Lógica del Splash Screen ---
(function() {
  const splash = $('splashScreen');
  const p1 = $('splashPhase1');
  const p2 = $('splashPhase2');
  
  if (p1 && p2) {
    // Fase 1 a Fase 2 a los 1000ms
    setTimeout(() => {
      p1.style.opacity = '0';
      setTimeout(() => {
        p1.style.display = 'none';
        p2.style.display = 'flex';
        p2.offsetHeight; // force reflow
        p2.style.opacity = '1';
      }, 300);
    }, 1000);
  }
  
  // Ocultar splash screen a los 2000ms y mostrar login
  setTimeout(() => {
    if (splash) {
      splash.style.opacity = '0';
      setTimeout(() => {
        splash.remove();
        const loginView = $('loginView');
        if (loginView) loginView.classList.remove('hidden');
      }, 500);
    }
  }, 2000);
})();

// --- Lógica de Login ---
let loginAttempts = 0;
const MAX_ATTEMPTS = 3;

function showLoginAlert(message, title = "Error") {
  const modal = $('loginAlertModal');
  const msgEl = $('loginAlertMessage');
  const titleEl = $('loginAlertTitle');
  const iconEl = $('loginAlertIcon');
  if (modal && msgEl && titleEl) {
    titleEl.textContent = title;
    msgEl.textContent = message;
    if (iconEl) {
      if (title === "Error" || title === "Bloqueado") {
        iconEl.style.background = "#fee2e2";
        iconEl.style.color = "#ef4444";
        iconEl.textContent = "⚠";
      } else {
        iconEl.style.background = "#e0f2fe";
        iconEl.style.color = "#0284c7";
        iconEl.textContent = "ℹ";
      }
    }
    modal.classList.remove('hidden');
  } else {
    alert(message);
  }
}

function closeLoginAlert() {
  const modal = $('loginAlertModal');
  if (modal) modal.classList.add('hidden');
}

function handleLogin() {
  const userEl = $('loginUser');
  const passEl = $('loginPass');
  if (!userEl || !passEl) return;

  const username = userEl.value.trim();
  const password = passEl.value;

  if (loginAttempts >= MAX_ATTEMPTS + 1) {
    showLoginAlert("El usuario ha sido bloqueado, comunicarse con soporte", "Bloqueado");
    return;
  }

  if (username.toUpperCase() === 'AUGCHA' && password === '123456') {
    // Éxito
    const loginView = $('loginView');
    if (loginView) loginView.classList.add('hidden');
    
    // Actualizar saludo del usuario
    const greetingEl = document.querySelector('.hello');
    if (greetingEl) {
      greetingEl.textContent = `Hola ${username.toUpperCase()}!`;
    }
    
    // Mostrar la aplicación principal
    document.querySelectorAll('.topbar, .layout').forEach(el => {
      el.classList.remove('hidden');
    });
    
    // Cargar módulo inicial (Simulación)
    showModule('simulacion');
  } else {
    loginAttempts++;
    if (loginAttempts >= 4) {
      showLoginAlert("El usuario ha sido bloqueado, comunicarse con soporte", "Bloqueado");
    } else {
      showLoginAlert("Usuario o contraseña mal ingresados o no existen", "Error");
    }
  }
}

function clearLogin() {
  const userEl = $('loginUser');
  const passEl = $('loginPass');
  if (userEl) userEl.value = '';
  if (passEl) passEl.value = '';
}

// Event Listeners para Login
$('btnLoginSubmit')?.addEventListener('click', handleLogin);
$('btnLoginClear')?.addEventListener('click', clearLogin);
$('closeLoginAlertModal')?.addEventListener('click', closeLoginAlert);
$('loginAlertModal')?.addEventListener('click', e => { if (e.target.id === 'loginAlertModal') closeLoginAlert(); });
$('forgotPasswordBtn')?.addEventListener('click', e => {
  e.preventDefault();
  showLoginAlert("Por favor, comuníquese con soporte para restablecer su contraseña.", "Información");
});
$('loginUser')?.addEventListener('keypress', e => { if (e.key === 'Enter') handleLogin(); });
$('loginPass')?.addEventListener('keypress', e => { if (e.key === 'Enter') handleLogin(); });

const form = $('simulationForm');
const requiredFields = [...document.querySelectorAll('.required-field')];
const spouseToggle = $('hasSpouse');
const spouseSection = $('spouseSection');
const spouseFields = [...document.querySelectorAll('.spouse-required')];
const simulateBtn = $('simulateBtn');
const clearBtn = $('clearBtn');
const vehicleCost = $('vehicleCost');
const initialAmount = $('initialAmount');
const initialPercent = $('initialPercent');
const switchNo = $('switchNo');
const switchSi = $('switchSi');
const toast = $('toast');
const formView = $('formView');
const resultView = $('resultView');
const bandejaView = $('bandejaView');
const quotaBody = $('quotaBody');
const sendExecutiveBtn = $('sendExecutiveBtn');
const backBtn = $('backBtn');
const sendPdfBtn = $('sendPdfBtn');
const phone = $('phone');
const phoneModal = $('phoneModal');
const closePhoneModal = $('closePhoneModal');
const resultPhone = $('rPhone');
const menuItems = [...document.querySelectorAll('.menu-item')];
const bandejaBody = $('bandejaBody');
const bandejaSummary = $('bandejaSummary');
const cleanSearchBtn = $('cleanSearchBtn');
const trackingModal = $('trackingModal');
const closeTrackingModal = $('closeTrackingModal');
const trackingSolicitud = $('trackingSolicitud');
const requiredDocs = $('requiredDocs');
const roadBadge = $('roadBadge');
const roadDocs = $('roadDocs');
const successModal = $('successModal');
const acceptSuccessModal = $('acceptSuccessModal');
const downloadApprovalBtn = $('downloadApprovalBtn');
const smsVerificationModal = $('smsVerificationModal');
const smsVerificationMessage = $('smsVerificationMessage');
const btnCancelSmsVerification = $('btnCancelSmsVerification');
const btnAcceptSmsVerification = $('btnAcceptSmsVerification');
const smsInputs = [...document.querySelectorAll('.sms-digit-input')];
const sedeSelect = $('sedeSelect');
const sedeConfirmModal = $('sedeConfirmModal');
const sedeConfirmMessage = $('sedeConfirmMessage');
const btnCancelSede = $('btnCancelSede');
const btnAcceptSede = $('btnAcceptSede');
let currentResultContext = 'simulation';
let activeBandejaItem = null;

// Valores fijos del cuadro Línea Preaprobada.
// Regla: estos datos no deben cambiar bajo ninguna circunstancia.
const LINEA_PREAPROBADA_FIJA = {
  monto: 'S/ 380,000.00',
  cuotaInicialMinima: '10%',
  plazo: '60 meses'
};

function aplicarLineaPreaprobadaFija() {
  const amountEl = document.getElementById('rPreApprovedAmount');
  const minInitialEl = document.getElementById('rMinInitial');
  const termEl = document.getElementById('rPreApprovedTerm');

  if (amountEl) amountEl.textContent = LINEA_PREAPROBADA_FIJA.monto;
  if (minInitialEl) minInitialEl.textContent = LINEA_PREAPROBADA_FIJA.cuotaInicialMinima;
  if (termEl) termEl.textContent = LINEA_PREAPROBADA_FIJA.plazo;
}

const onlyDigits = (value) => value.replace(/[^0-9]/g, '');
const toNumber = (value) => Number(String(value).replace(/,/g, '').replace(/[^0-9.]/g, '')) || 0;
const money = (value) => toNumber(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatMoney = (value) => {
  const number = toNumber(value);
  return number ? number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
};

function getCurrentDateTimeString() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

function getSelectedTerm() {
  const selected = document.querySelector('.quota-check:checked');
  if (!selected) return null;
  const tr = selected.closest('tr');
  if (!tr) return null;
  if (tr.dataset.term) {
    return Number(tr.dataset.term);
  }
  const firstCell = tr.querySelector('td');
  return firstCell ? (parseInt(firstCell.textContent) || null) : null;
}

function pdfEscape(value){
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

const roadByCapacity = capacidad => capacidad === 'SUSTENTAR INGRESO' ? 'FULL' : 'EXPRESS';

function determineRoad(capacity, term) {
  if (capacity === 'SUSTENTAR INGRESO') {
    return (term === 12 || term === 24) ? 'FULL' : 'SEMI FULL';
  } else {
    if (term === 60) return 'EXPRESS';
    if (term === 24) return 'SEMI FULL';
    return 'ESCRITORIO'; // 48 y 36 cuotas
  }
}

function getDocsMarkupForRoad(road) {
  switch (road) {
    case 'EXPRESS':
      return `
        <ul class="docs-list">
          <li>COPIA DE DNI (ambas caras)</li>
        </ul>
      `;
    case 'ESCRITORIO':
      return `
        <ul class="docs-list">
          <li>COPIA DE DNI (ambas caras)</li>
          <li>Copia de recibo de servicios (luz o agua)</li>
          <li>Constancia de trabajo simple</li>
        </ul>
      `;
    case 'SEMI FULL':
      return `
        <ul class="docs-list">
          <li>COPIA DE DNI (ambas caras)</li>
          <li>Sustento de ingresos (últimas 3 boletas de pago)</li>
          <li>Estado de cuenta bancario</li>
        </ul>
      `;
    case 'FULL':
    default:
      return `
        <ul class="docs-list">
          <li>COPIA DE DNI (ambas caras)</li>
          <li>Sustento de ingresos completo (PDT/Boletas)</li>
          <li>Estados de cuenta de los últimos 6 meses</li>
          <li>Verificación domiciliaria y laboral presencial</li>
        </ul>
      `;
  }
}

function docsByRoad(road){
  if(road === 'EXPRESS') return ['COPIA DE DNI (ambas caras)'];
  if(road === 'ESCRITORIO') return ['COPIA DE DNI (ambas caras)', 'Copia de recibo de servicios', 'Constancia de trabajo simple'];
  if(road === 'SEMI FULL') return ['COPIA DE DNI (ambas caras)', 'Sustento de ingresos (3 boletas)', 'Estado de cuenta bancario'];
  return ['COPIA DE DNI (ambas caras)','Sustento de ingresos completo (PDT/Boletas)','Estados de cuenta de 6 meses','Verificacion domiciliaria/laboral presencial'];
}

function buildPdfDocument(lines){
  const objects = [];
  const addObject = value => { objects.push(value); return objects.length; };
  const pageWidth = 595;
  const pageHeight = 842;
  const font = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const fontBold = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  const content = [];
  const text = (x, y, size, value, bold = false) => {
    content.push(`BT /F${bold ? 'B' : '1'} ${size} Tf ${x} ${y} Td (${pdfEscape(value)}) Tj ET`);
  };
  const rect = (x, y, w, h, color) => {
    content.push(`${color} rg ${x} ${y} ${w} ${h} re f`);
  };

  // Dibujar cabecera celeste corporativo
  rect(0, 750, pageWidth, 92, '0.21 0.43 0.96');

  // Dibujar el icono E estilizado en color blanco
  content.push(`1.0 1.0 1.0 rg`);
  content.push(`42 818 m 56 818 l 48 810 l 56 802 l 42 802 l 42 818 l f`);

  // Escribir el texto de marca (Fase 2 de logo: fecti en blanco, bank en azul oscuro)
  text(58, 802, 22, 'fecti', true);
  content.push(`0.04 0.1 0.2 rg`); // color de bank en azul oscuro
  text(102, 802, 22, 'bank', true);
  content.push(`1.0 1.0 1.0 rg`); // reset color a blanco
  text(58, 790, 10, 'Tu banco vehicular', true);

  // Título de la carta en blanco a la derecha
  text(260, 802, 20, 'CARTA DE APROBACION', true);
  text(260, 790, 11, 'CREDITO VEHICULAR EFECTIBANK', true);

  // Barra de título interna
  rect(42, 706, 510, 26, '0.93 0.96 1');
  content.push(`0.0 0.24 0.65 rg`);
  text(58, 714, 11, 'Aprobacion de Financiamiento Vehicular Pre-calificado', true);

  let y = 672;
  lines.forEach(line => {
    if(line.type === 'section'){
      rect(42, y - 5, 510, 22, '0.91 0.93 0.97');
      content.push(`0.0 0.24 0.65 rg`);
      text(54, y + 2, 11, line.text, true);
      y -= 32;
    } else if(line.type === 'message'){
      content.push(`0.27 0.35 0.47 rg`);
      const parts = String(line.text).match(/.{1,88}(\s|$)/g) || [line.text];
      parts.forEach(part => { text(54, y, 10, part.trim()); y -= 15; });
      y -= 10;
    } else if(line.type === 'bullet'){
      content.push(`0.21 0.43 0.96 rg`);
      text(60, y, 10, '•', true);
      content.push(`0.12 0.16 0.22 rg`);
      text(76, y, 10, line.text);
      y -= 16;
    } else if(line.type === 'signatures'){
      y -= 25;
      // Firma del cliente
      rect(54, y, 180, 1, '0.6 0.6 0.6');
      content.push(`0.12 0.16 0.22 rg`);
      text(54, y - 12, 9, 'Firma del Cliente / Titular', true);
      text(54, y - 22, 8, `DNI: ${line.dni}`);

      // Firma de la financiera
      rect(340, y, 180, 1, '0.6 0.6 0.6');
      content.push(`0.12 0.16 0.22 rg`);
      text(340, y - 12, 9, 'Efectibank S.A.', true);
      text(340, y - 22, 8, 'Representante Autorizado');
      y -= 40;
    } else {
      content.push(`0.4 0.45 0.55 rg`);
      text(60, y, 10, `${line.label}:`, true);
      content.push(`0.12 0.16 0.22 rg`);
      text(200, y, 10, line.value);
      y -= 18;
    }
  });

  // Pie de página
  rect(0, 0, pageWidth, 42, '0.21 0.43 0.96');
  content.push(`1.0 1.0 1.0 rg`);
  text(46, 22, 9, `Fecha de emision: ${new Date().toLocaleDateString('es-PE')}`, true);
  text(315, 22, 9, 'Efectibank - Documento referencial de credito', true);

  const contentStream = content.join('\n');
  const contentId = addObject(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`);
  const pageId = addObject(`<< /Type /Page /Parent 0 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${font} 0 R /FB ${fontBold} 0 R >> >> /Contents ${contentId} 0 R >>`);
  const pagesId = addObject(`<< /Type /Pages /Kids [${pageId} 0 R] /Count 1 >>`);
  objects[pageId - 1] = objects[pageId - 1].replace('/Parent 0 0 R', `/Parent ${pagesId} 0 R`);
  const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((obj, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach(offset => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return pdf;
}

const bandejaData = [
  { solicitud: 'EFE001', documento: '80569877', fecha: '20-05-2025 15:03:30', estado: 'PENDIENTE ENVÍO', selectedTerm: 48, hasSpouse: true, vehicleCost: 450000, initialAmount: 0, sucursal: 'Lima Centro', carretera: 'EXPRESS' },
  { solicitud: 'EFE002', documento: '80569877', fecha: '20-05-2025 15:03:30', estado: 'ENVIADO', selectedTerm: 48, hasSpouse: true, vehicleCost: 450000, initialAmount: 0, sucursal: 'Lima Norte', carretera: 'EXPRESS' },
  { solicitud: 'EFE003', documento: '80569877', fecha: '20-05-2025 15:03:30', estado: 'NO CALIFICA', selectedTerm: 36, hasSpouse: false, vehicleCost: 450000, initialAmount: 0, sucursal: 'Lima Sur', carretera: 'FULL' },
  { solicitud: 'POP001', documento: '80569877', fecha: '20-05-2025 15:03:30', estado: 'EN ATENCIÓN', selectedTerm: 60, hasSpouse: false, vehicleCost: 450000, initialAmount: 0, sucursal: 'Arequipa', carretera: 'SEMI FULL' },
  { solicitud: 'POP002', documento: '780598744', fecha: '20-05-2025 15:03:30', estado: 'APROBADO', selectedTerm: 24, hasSpouse: true, vehicleCost: 450000, initialAmount: 0, sucursal: 'Trujillo', carretera: 'ESCRITORIO' },
  { solicitud: 'POP003', documento: '80569877', fecha: '20-05-2025 15:03:30', estado: 'ACTIVADO', selectedTerm: 12, hasSpouse: false, vehicleCost: 450000, initialAmount: 0, sucursal: 'Lima Centro', carretera: 'FULL' },
  { solicitud: 'POP004', documento: '80569877', fecha: '20-05-2025 15:03:30', estado: 'PENDIENTE ENVÍO', selectedTerm: null, hasSpouse: false, vehicleCost: 450000, initialAmount: 0, sucursal: 'Lima Norte', carretera: 'EXPRESS' },
  { solicitud: 'POP005', documento: '80569877', fecha: '20-05-2025 15:03:30', estado: 'ENVIADO', selectedTerm: 36, hasSpouse: false, vehicleCost: 450000, initialAmount: 0, sucursal: 'Lima Sur', carretera: 'ESCRITORIO' },
  { solicitud: 'POP006', documento: '80569877', fecha: '20-05-2025 15:03:30', estado: 'NO CALIFICA', selectedTerm: 48, hasSpouse: false, vehicleCost: 450000, initialAmount: 0, sucursal: 'Arequipa', carretera: 'FULL' }
];

function markResultPhoneRequired() {
  resultPhone.required = true;
  resultPhone.classList.add('attention');
  resultPhone.focus();
  resultPhone.reportValidity();
}

function isPhoneValid() {
  return resultPhone.value.trim().length === 9;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

function openSuccessModal() {
  successModal.classList.remove('hidden');
  setTimeout(() => acceptSuccessModal.focus(), 80);
}

function closeSuccessModalAndGoBandeja() {
  successModal.classList.add('hidden');
  showModule('bandeja');
}

function setResultHeaderStatus(status = 'PENDIENTE ENVÍO') {
  const resultStatusPill = document.querySelector('#resultView .status-pill');
  if (resultStatusPill) resultStatusPill.textContent = status;
}

function showModule(module) {
  menuItems.forEach(item => item.classList.toggle('active', item.dataset.module === module));
  formView.classList.toggle('hidden', module !== 'simulacion');
  resultView.classList.add('hidden');
  bandejaView.classList.toggle('hidden', module !== 'bandeja');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateDocumentLength(selectEl, inputEl) {
  const type = selectEl.value;
  const value = inputEl.value.trim();
  if (!value) return false;
  if (type === 'DNI') return value.length === 8;
  if (type === 'CE') return value.length >= 9 && value.length <= 12;
  return false;
}

function spouseEnabled() { return spouseToggle.checked; }

function updateSpouseSection() {
  const enabled = spouseEnabled();
  spouseSection.classList.toggle('hidden', !enabled);
  spouseSection.classList.toggle('disabled', !enabled);
  spouseSection.setAttribute('aria-disabled', String(!enabled));
  switchNo.classList.toggle('active', !enabled);
  switchSi.classList.toggle('active', enabled);

  spouseFields.forEach(field => {
    field.disabled = !enabled;
    field.required = enabled;
    if (!enabled) {
      field.value = '';
      field.closest('.field')?.classList.remove('invalid');
    }
  });
  validateForm();
}

function updatePercent() {
  const cost = toNumber(vehicleCost.value);
  const initial = toNumber(initialAmount.value);
  const percent = cost > 0 && initial > 0 ? Math.round((initial / cost) * 100) : 0;
  initialPercent.textContent = `${percent}%`;
}

function validateForm() {
  const tipoDoc = document.getElementById('tipoDoc');
  const numDoc = document.getElementById('numDoc');
  const clientDocOk = validateDocumentLength(tipoDoc, numDoc);
  const vehicleCostOk = toNumber(vehicleCost.value) > 0;
  const baseOk = tipoDoc.value && clientDocOk && vehicleCostOk;

  let spouseOk = true;
  if (spouseEnabled()) {
    spouseOk = document.getElementById('spouseTipoDoc').value &&
      validateDocumentLength(document.getElementById('spouseTipoDoc'), document.getElementById('spouseNumDoc'));
  }

  simulateBtn.disabled = !(baseOk && spouseOk);
}

function generateQuotaRows({ financed, selectedTerm = null, disabled = false, alwaysSustentar = false, item = null }) {
  const terms = [60, 48, 36, 24, 12];
  quotaBody.innerHTML = '';

  terms.forEach((term, index) => {
    const quota = Math.max((financed / term) * 1.22, 0);
    const quotaSoles = quota * 3.8;
    const capacity = (alwaysSustentar || term === 12) ? 'SUSTENTAR INGRESO' : 'CALIFICA';
    const checked = term === selectedTerm ? 'checked' : '';
    const disabledAttr = disabled ? 'disabled' : '';

    const tr = document.createElement('tr');
    tr.dataset.capacity = capacity;
    tr.dataset.term = term;
    tr.innerHTML = `
      <td data-label="Plazo">${term} cuotas</td>
      <td data-label="Cuota - Sin seguro">S/ ${quotaSoles.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td data-label="Tasa">12.90%</td>
      <td data-label="Capacidad"><span class="${capacity === 'CALIFICA' ? 'ok' : 'warn'}">${capacity}</span></td>
      <td data-label="Selección"><input type="checkbox" class="quota-check" aria-label="Seleccionar plazo ${term} cuotas" ${checked} ${disabledAttr}></td>
    `;
    quotaBody.appendChild(tr);
  });
  aplicarLineaPreaprobadaFija();

  if (!disabled) {
    document.querySelectorAll('.quota-check').forEach(check => {
      check.addEventListener('change', (event) => {
        if (event.target.checked) {
          document.querySelectorAll('.quota-check').forEach(other => {
            if (other !== event.target) other.checked = false;
          });
        }

        const selected = document.querySelector('.quota-check:checked');
        const termVal = selected ? Number(selected.closest('tr').dataset.term) : null;

        if (item) {
          item.selectedTerm = termVal;
        }
        sendExecutiveBtn.disabled = !termVal;
        aplicarLineaPreaprobadaFija();
        updateRoadBySelectedCapacity();
      });
    });

    const selected = document.querySelector('.quota-check:checked');
    sendExecutiveBtn.disabled = !selected;
    updateRoadBySelectedCapacity();
  } else {
    updateRoadBySelectedCapacity();
  }
}

function getSelectedCapacity() {
  const selected = document.querySelector('.quota-check:checked');
  const selectedRow = selected ? selected.closest('tr') : null;
  return selectedRow ? selectedRow.dataset.capacity : 'CALIFICA';
}

function calculateCapacity(price, initial) {
  const financed = Math.max(price - initial, 0);
  const initialPercent = price > 0 ? initial / price : 0;
  return initialPercent >= 0.20 || financed <= 160000 ? 'CALIFICA' : 'SUSTENTAR INGRESO';
}

function calculateScore(price, initial, capacity) {
  const initialPercent = price > 0 ? initial / price : 0;
  const base = capacity === 'CALIFICA' ? 780 : 610;
  const bonus = Math.min(140, Math.round(initialPercent * 300));
  const penalty = price > 300000 ? 45 : price > 200000 ? 20 : 0;
  return Math.max(350, Math.min(980, base + bonus - penalty));
}

function scoreSegment(score) {
  if (score >= 930) return { segment: 'AAA', description: 'Cliente Excelente', range: '930 - 999', level: 'excellent' };
  if (score >= 850) return { segment: 'AA', description: 'Cliente Bueno', range: '850 - 929', level: 'good' };
  if (score >= 700) return { segment: 'A', description: 'Cliente Regular', range: '700 - 849', level: 'regular' };
  if (score >= 400) return { segment: 'B', description: 'Cliente Bajo', range: '400 - 699', level: 'low' };
  return { segment: 'C', description: 'Cliente Malo', range: 'Menor a 400', level: 'bad' };
}

function updateScoreDisplay(cost, initial, capacity, item = null) {
  let scoreVal = 750;
  if (item && item.score !== undefined) {
    scoreVal = item.score;
  } else {
    scoreVal = calculateScore(cost, initial, capacity);
  }
  if (item) {
    item.score = scoreVal;
  }

  const scoreData = scoreSegment(scoreVal);
  const scoreValueEl = $('scoreValue');
  const scoreSegmentEl = $('scoreSegment');
  const scoreDescriptionEl = $('scoreDescription');
  const scoreRangeEl = $('scoreRange');
  const scoreDotEl = $('scoreDot');
  const scoreProgressEl = $('scoreProgress');

  if (scoreValueEl) scoreValueEl.textContent = scoreVal;
  if (scoreSegmentEl) scoreSegmentEl.textContent = `${scoreData.segment} - ${scoreData.description}`;
  if (scoreDescriptionEl) scoreDescriptionEl.textContent = `Segmentación ${scoreData.segment}: ${scoreData.description}`;
  if (scoreRangeEl) scoreRangeEl.textContent = `Rango: ${scoreData.range}`;
  
  if (scoreDotEl) {
    scoreDotEl.className = `score-dot ${scoreData.level}`;
  }
  
  if (scoreProgressEl) {
    scoreProgressEl.style.width = `${Math.min(100, Math.max(0, scoreVal / 999 * 100))}%`;
    scoreProgressEl.className = scoreData.level;
  }
}

function updateRoadBySelectedCapacity() {
  const selectedCapacity = getSelectedCapacity();
  const term = getSelectedTerm() || 48; // Default a 48
  const road = determineRoad(selectedCapacity, term);

  if (roadBadge) {
    roadBadge.textContent = `Cartera ${road}`;
  }
  roadDocs.textContent = `Cartera: ${road}`;
  requiredDocs.innerHTML = getDocsMarkupForRoad(road);

  const roadClass = road.toLowerCase().replace(' ', '-');
  if (roadBadge) {
    roadBadge.className = `road-badge ${roadClass}`;
  }
  roadDocs.className = `road-docs ${roadClass}`;

  updateSendPdfBtnState();
  updateDownloadApprovalBtnState();
}

function setResultStatus(type) {
  const resultBox = document.querySelector('.success-box');
  const resultIcon = document.querySelector('.check-icon');
  const resultTitle = document.getElementById('resultStatusText') || document.querySelector('.success-box strong');
  const resultMessage = document.querySelector('.success-box p');

  const isLowProbability = type === 'low-probability';
  resultBox.classList.toggle('low-probability', isLowProbability);
  if (resultIcon) {
    resultIcon.textContent = isLowProbability ? '!' : '✓';
    resultIcon.setAttribute('aria-hidden', 'true');
  }
  if (resultTitle) {
    resultTitle.textContent = isLowProbability ? 'NO APLICA' : 'APLICA';
  }
  if (resultMessage) {
    resultMessage.textContent = '';
    resultMessage.style.display = 'none';
  }
}

function setFullEvaluationDocuments() {
  if (roadBadge) {
    roadBadge.textContent = 'Cartera FULL';
    roadBadge.className = 'road-badge full';
  }
  roadDocs.textContent = 'Cartera: FULL';
  roadDocs.className = 'road-docs full';
  requiredDocs.innerHTML = getDocsMarkupForRoad('FULL');
}

function updatePreApprovedBox(cost, initial, selectedTerm) {
  // La Línea Preaprobada está en duro y no depende del precio, cuota inicial, plazo ni selección de cuota.
  aplicarLineaPreaprobadaFija();
}

function downloadSimulationPlan() {
  const typeDoc = document.getElementById('rTipoDoc').value || 'DNI';
  const numDoc = document.getElementById('rNumDoc').value || '';
  const name = document.getElementById('rName').value || '';
  const phone = document.getElementById('rPhone').value || '';
  const priceVal = toNumber(document.getElementById('rCost').value);
  const initialVal = toNumber(document.getElementById('rInitial').value);

  const checkedQuota = document.querySelector('.quota-check:checked');
  let plazo = '48 cuotas';
  let cuota = 'S/ 0.00';
  let capacity = 'CALIFICA';
  if (checkedQuota) {
    const row = checkedQuota.closest('tr');
    plazo = row.querySelector('td:nth-child(1)').textContent.trim();
    cuota = row.querySelector('td:nth-child(2)').textContent.trim();
    capacity = row.dataset.capacity || 'CALIFICA';
  }

  const road = roadByCapacity(capacity);
  const hasSpouse = !document.getElementById('rSpouseGridContainer').classList.contains('hidden');
  const spouseNombre = document.getElementById('rSpouseName').value || '';
  const spouseTipoDoc = document.getElementById('rSpouseTipoDoc').value || 'DNI';
  const spouseDocumento = document.getElementById('rSpouseNumDoc').value || '';

  const lines = [
    {type:'section', text:'Datos del Cliente'},
    {label:'Nombre completo', value: name},
    {label:'Documento de identidad', value: `${typeDoc} ${numDoc}`},
    {label:'Telefono celular', value: phone}
  ];

  if (hasSpouse) {
    lines.push(
      {type:'section', text:'Datos del Conyuge'},
      {label:'Nombre completo', value: spouseNombre || 'No especificado'},
      {label:'Documento del conyuge', value: `${spouseTipoDoc} ${spouseDocumento}`},
      {label:'Telefono celular', value: '-'}
    );
  }

  const financedVal = Math.max(priceVal - initialVal, 0);

  lines.push(
    {type:'section', text:'Condiciones de la Simulacion Seleccionada'},
    {label:'Tipo de Credito', value: 'Simulacion Vehicular Efectibank'},
    {label:'Precio del Vehiculo', value: priceVal > 0 ? `$ ${formatMoney(priceVal)}` : '$ 0.00'},
    {label:'Monto de Cuota Inicial', value: initialVal > 0 ? `$ ${formatMoney(initialVal)}` : 'Sin inicial'},
    {label:'Monto a Financiar', value: `$ ${formatMoney(financedVal)}`},
    {label:'Tasa de Interes (TEA)', value: '12.90%'},
    {label:'Plazo de Financiamiento', value: plazo},
    {label:'Cuota Mensual Estimada', value: cuota},
    {label:'Modalidad de Evaluacion', value: `Carretera ${road}`}
  );

  lines.push({type:'section', text:'Requisitos Obligatorios'});
  const reqDocs = docsByRoad(road);
  reqDocs.forEach(doc => {
    lines.push({type:'bullet', text: doc});
  });
  if (hasSpouse) {
    lines.push({type:'bullet', text: 'Documento de Identidad (DNI) del conyuge'});
  }

  lines.push(
    {type:'section', text:'Clausula de Simulacion'},
    {type:'message', text:'Este documento constituye una simulacion informativa del plan de financiamiento vehicular seleccionado. Las condiciones comerciales y de credito finales estan sujetas a evaluacion de riesgos, validacion de documentos de sustento y politicas vigentes de la Financiera.'}
  );

  const pdf = buildPdfDocument(lines);
  const blob = new Blob([pdf], {type:'application/pdf'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Resumen_Simulacion_Vehicular_${plazo.replace(/\s+/g, '_')}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadApprovalLetter() {
  const typeDoc = document.getElementById('rTipoDoc').value || 'DNI';
  const numDoc = document.getElementById('rNumDoc').value || '';
  const name = document.getElementById('rName').value || '';
  const phone = document.getElementById('rPhone').value || '';
  const priceVal = toNumber(document.getElementById('rCost').value);
  const initialVal = toNumber(document.getElementById('rInitial').value);

  const checkedQuota = document.querySelector('.quota-check:checked');
  let plazo = '48 cuotas';
  let cuota = 'S/ 0.00';
  let capacity = 'CALIFICA';
  if (checkedQuota) {
    const row = checkedQuota.closest('tr');
    plazo = row.querySelector('td:nth-child(1)').textContent.trim();
    cuota = row.querySelector('td:nth-child(2)').textContent.trim();
    capacity = row.dataset.capacity || 'CALIFICA';
  }

  const road = roadByCapacity(capacity);
  const hasSpouse = !document.getElementById('rSpouseGridContainer').classList.contains('hidden');
  const spouseNombre = document.getElementById('rSpouseName').value || '';
  const spouseTipoDoc = document.getElementById('rSpouseTipoDoc').value || 'DNI';
  const spouseDocumento = document.getElementById('rSpouseNumDoc').value || '';

  const lines = [
    {type:'section', text:'Datos del Solicitante / Titular'},
    {label:'Nombre completo', value: name},
    {label:'Documento de identidad', value: `${typeDoc} ${numDoc}`},
    {label:'Telefono celular', value: phone}
  ];

  if (hasSpouse) {
    lines.push(
      {type:'section', text:'Datos del Conyuge'},
      {label:'Nombre completo', value: spouseNombre || 'No especificado'},
      {label:'Documento del conyuge', value: `${spouseTipoDoc} ${spouseDocumento}`},
      {label:'Telefono celular', value: '-'}
    );
  }

  const financedVal = Math.max(priceVal - initialVal, 0);

  lines.push(
    {type:'section', text:'Condiciones del Credito Vehicular pre-aprobado'},
    {label:'Tipo de Credito', value: 'Credito Vehicular pre-aprobado (Vendedor)'},
    {label:'Precio del Vehiculo', value: priceVal > 0 ? `$ ${formatMoney(priceVal)}` : '$ 0.00'},
    {label:'Monto de Cuota Inicial', value: initialVal > 0 ? `$ ${formatMoney(initialVal)}` : 'Sin inicial'},
    {label:'Monto a Financiar', value: `$ ${formatMoney(financedVal)}`},
    {label:'Tasa de Interes (TEA)', value: '12.90%'},
    {label:'Plazo de Financiamiento', value: plazo},
    {label:'Cuota Mensual Estimada', value: cuota},
    {label:'Modalidad de Evaluacion', value: `Carretera ${road}`}
  );

  lines.push({type:'section', text:'Documentos Requeridos para Desembolso'});
  const reqDocs = docsByRoad(road);
  reqDocs.forEach(doc => {
    lines.push({type:'bullet', text: doc});
  });
  if (hasSpouse) {
    lines.push({type:'bullet', text: 'Documento de Identidad (DNI) del conyuge'});
  }

  lines.push(
    {type:'section', text:'Clausula de Aprobacion'},
    {type:'message', text:'Nos complace informarle que su solicitud de financiamiento vehicular ha sido pre-aprobada conforme a las condiciones comerciales detalladas en este documento. Esta carta de aprobacion tiene una vigencia de 30 dias calendario y queda sujeta a la validacion fisica de su expediente documental y politicas crediticias vigentes.'},
    {type:'signatures', dni: numDoc}
  );

  const pdf = buildPdfDocument(lines);
  const blob = new Blob([pdf], {type:'application/pdf'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Carta_Aprobacion_Vehicular_Simulacion.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function updateSendPdfBtnState() {
  const hasQuotaSelected = document.querySelector('.quota-check:checked') !== null;
  if (sendPdfBtn) {
    sendPdfBtn.disabled = !hasQuotaSelected;
  }
}

function updateDownloadApprovalBtnState() {
  const selectedCheck = document.querySelector('.quota-check:checked');
  const isChecked = (selectedCheck !== null);
  const phoneVal = resultPhone.value.trim();
  
  let road = 'EXPRESS';
  if (selectedCheck) {
    const row = selectedCheck.closest('tr');
    const capacity = row.dataset.capacity || 'CALIFICA';
    const term = Number(row.dataset.term) || 48;
    road = determineRoad(capacity, term);
  } else {
    const isFull = (currentResultContext === 'no-califica') || (roadDocs.textContent.includes('FULL'));
    road = isFull ? 'FULL' : 'EXPRESS';
  }

  if (downloadApprovalBtn) {
    const showBtn = isChecked && (road === 'EXPRESS') && (phoneVal.length === 9);
    downloadApprovalBtn.disabled = !showBtn;
    downloadApprovalBtn.classList.toggle('hidden', !showBtn);
  }
}

function updateResultViewLockState(status) {
  const isPendiente = (status === 'PENDIENTE ENVÍO');
  
  const rCost = document.getElementById('rCost');
  const rInitial = document.getElementById('rInitial');
  const rPhone = document.getElementById('rPhone');
  const rSimulateBtn = document.getElementById('rSimulateBtn');
  
  if (rCost) rCost.disabled = !isPendiente;
  if (rInitial) rInitial.disabled = !isPendiente;
  if (rPhone) rPhone.disabled = !isPendiente;
  
  if (rSimulateBtn) {
    if (isPendiente) {
      rSimulateBtn.classList.remove('hidden');
    } else {
      rSimulateBtn.classList.add('hidden');
    }
  }
  
  const quotaChecks = document.querySelectorAll('.quota-check');
  quotaChecks.forEach(check => {
    check.disabled = !isPendiente;
  });
}

function showPendingEnvioResult(item) {
  activeBandejaItem = item;
  currentResultContext = 'bandeja-result';
  setResultHeaderStatus(item?.estado || 'PENDIENTE ENVÍO');
  document.getElementById('rTipoDoc').value = 'DNI';
  document.getElementById('rNumDoc').value = item?.documento || '80569877';
  document.getElementById('rName').value = 'Juan Pedro Pérez García';
  resultPhone.value = '987654321';
  resultPhone.required = true;
  resultPhone.classList.remove('attention');

  const cost = item?.vehicleCost !== undefined ? item.vehicleCost : 450000;
  const initial = item?.initialAmount !== undefined ? item.initialAmount : 0;
  document.getElementById('rCost').value = formatMoney(cost);
  document.getElementById('rInitial').value = initial ? formatMoney(initial) : '0.00';

  const financed = Math.max(cost - initial, 0);
  updatePreApprovedBox(cost, initial, item?.selectedTerm);

  const spouseGrid = document.getElementById('rSpouseGridContainer');
  if (item?.hasSpouse) {
    spouseGrid.classList.remove('hidden');
    document.getElementById('rSpouseTipoDoc').value = 'DNI';
    document.getElementById('rSpouseNumDoc').value = '45781299';
  } else {
    spouseGrid.classList.add('hidden');
  }

  setResultStatus('approved');
  requiredDocs.innerHTML = `
    <ul class="docs-list">
      <li>DNI ambas caras</li>
    </ul>
  `;
  generateQuotaRows({ financed: financed, selectedTerm: item?.selectedTerm, disabled: false, item: item });

  const rSucursalText = document.getElementById('rSucursalText');
  if (rSucursalText) rSucursalText.textContent = item?.sucursal || 'Lima Centro';
  updateResultViewLockState('PENDIENTE ENVÍO');

  formView.classList.add('hidden');
  bandejaView.classList.add('hidden');
  resultView.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showLockedApprovedResult(item) {
  activeBandejaItem = item;
  currentResultContext = 'bandeja-result';
  setResultHeaderStatus(item?.estado || 'PENDIENTE ENVÍO');
  document.getElementById('rTipoDoc').value = 'DNI';
  document.getElementById('rNumDoc').value = item?.documento || '80569877';
  document.getElementById('rName').value = 'Juan Pedro Pérez García';
  resultPhone.value = '987654321';
  resultPhone.required = true;
  resultPhone.classList.remove('attention');

  const cost = item?.vehicleCost !== undefined ? item.vehicleCost : 450000;
  const initial = item?.initialAmount !== undefined ? item.initialAmount : 0;
  document.getElementById('rCost').value = formatMoney(cost);
  document.getElementById('rInitial').value = initial ? formatMoney(initial) : '0.00';

  const financed = Math.max(cost - initial, 0);
  updatePreApprovedBox(cost, initial, item?.selectedTerm);

  const spouseGrid = document.getElementById('rSpouseGridContainer');
  if (item?.hasSpouse) {
    spouseGrid.classList.remove('hidden');
    document.getElementById('rSpouseTipoDoc').value = 'DNI';
    document.getElementById('rSpouseNumDoc').value = '45781299';
  } else {
    spouseGrid.classList.add('hidden');
  }

  setResultStatus('approved');
  requiredDocs.innerHTML = `
    <ul class="docs-list">
      <li>DNI ambas caras</li>
    </ul>
  `;
  generateQuotaRows({ financed: financed, selectedTerm: item?.selectedTerm, disabled: true, item: item });
  sendExecutiveBtn.disabled = true;

  const rSucursalText = document.getElementById('rSucursalText');
  if (rSucursalText) rSucursalText.textContent = item?.sucursal || 'Lima Centro';
  updateResultViewLockState(item?.estado || 'ENVIADO');

  formView.classList.add('hidden');
  bandejaView.classList.add('hidden');
  resultView.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showNoCalificaResult(item) {
  activeBandejaItem = item;
  currentResultContext = 'no-califica';
  setResultHeaderStatus(item?.estado || 'NO CALIFICA');
  document.getElementById('rTipoDoc').value = 'DNI';
  document.getElementById('rNumDoc').value = '70589133';
  document.getElementById('rName').value = 'Juan Pedro Pérez García';
  resultPhone.value = '987654321';
  resultPhone.required = true;
  resultPhone.classList.remove('attention');

  const cost = item?.vehicleCost !== undefined ? item.vehicleCost : 450000;
  const initial = item?.initialAmount !== undefined ? item.initialAmount : 0;
  document.getElementById('rCost').value = formatMoney(cost);
  document.getElementById('rInitial').value = initial ? formatMoney(initial) : '0.00';

  const financed = Math.max(cost - initial, 0);
  updatePreApprovedBox(cost, initial, item?.selectedTerm);

  const spouseGrid = document.getElementById('rSpouseGridContainer');
  if (item?.hasSpouse) {
    spouseGrid.classList.remove('hidden');
    document.getElementById('rSpouseTipoDoc').value = 'DNI';
    document.getElementById('rSpouseNumDoc').value = '45781299';
  } else {
    spouseGrid.classList.add('hidden');
  }

  setResultStatus('low-probability');
  setFullEvaluationDocuments();
  generateQuotaRows({ financed: financed, selectedTerm: item?.selectedTerm, disabled: true, alwaysSustentar: true, item: item });
  sendExecutiveBtn.disabled = true;

  const rSucursalText = document.getElementById('rSucursalText');
  if (rSucursalText) rSucursalText.textContent = item?.sucursal || 'Lima Centro';
  updateResultViewLockState(item?.estado || 'NO CALIFICA');

  formView.classList.add('hidden');
  bandejaView.classList.add('hidden');
  resultView.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showResult() {
  activeBandejaItem = null;
  currentResultContext = 'simulation';
  setResultHeaderStatus('PENDIENTE ENVÍO');
  document.getElementById('rTipoDoc').value = document.getElementById('tipoDoc').value;
  document.getElementById('rNumDoc').value = document.getElementById('numDoc').value;
  document.getElementById('rName').value = 'Juan Pedro Pérez García';
  resultPhone.value = phone.value || '';
  resultPhone.required = true;
  resultPhone.classList.remove('attention');

  const cost = toNumber(vehicleCost.value);
  const initial = toNumber(initialAmount.value);
  document.getElementById('rCost').value = formatMoney(cost);
  document.getElementById('rInitial').value = initial ? formatMoney(initial) : '0.00';

  const financed = Math.max(cost - initial, 0);
  updatePreApprovedBox(cost, initial, null);

  const spouseGrid = document.getElementById('rSpouseGridContainer');
  if (spouseToggle.checked) {
    spouseGrid.classList.remove('hidden');
    document.getElementById('rSpouseTipoDoc').value = document.getElementById('spouseTipoDoc').value;
    document.getElementById('rSpouseNumDoc').value = document.getElementById('spouseNumDoc').value;
  } else {
    spouseGrid.classList.add('hidden');
  }

  setResultStatus('approved');
  generateQuotaRows({ financed: financed, selectedTerm: null, disabled: false });
  sendExecutiveBtn.disabled = true;

  // Set branch and dealership text
  const selectSede = document.getElementById('sedeSelect');
  const sucursalVal = selectSede ? selectSede.options[selectSede.selectedIndex].text : 'Lima Centro';
  const rSucursalText = document.getElementById('rSucursalText');
  if (rSucursalText) rSucursalText.textContent = sucursalVal;

  updateResultViewLockState('PENDIENTE ENVÍO');

  formView.classList.add('hidden');
  bandejaView.classList.add('hidden');
  resultView.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function actionButtons(item) {
  const isPendiente = item.estado === 'PENDIENTE ENVÍO';
  const isNoCalifica = item.estado === 'NO CALIFICA';
  
  const simOption = `<button type="button" class="dropdown-item sim-row" data-estado="${item.estado}" data-solicitud="${item.solicitud}">Simulación</button>`;
  const sendOption = `<button type="button" class="dropdown-item send-row" data-solicitud="${item.solicitud}">Enviar</button>`;
  const viewOption = `<button type="button" class="dropdown-item view-row" data-solicitud="${item.solicitud}">Vista</button>`;
  
  let menuHtml = '';
  if (isPendiente) {
    menuHtml = `${simOption}${sendOption}`;
  } else if (isNoCalifica) {
    menuHtml = `${simOption}`;
  } else {
    menuHtml = `${viewOption}${simOption}`;
  }
  
  return `
    <div class="action-dropdown-container">
      <button type="button" class="action-trigger-btn" aria-label="Acciones">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div class="action-dropdown-menu hidden">
        ${menuHtml}
      </div>
    </div>
  `;
}

function renderBandeja(data = bandejaData) {
  bandejaBody.innerHTML = data.map(item => {
    const displayedSolicitud = item.estado === 'PENDIENTE ENVÍO' ? '-' : item.solicitud;
    const sucursal = item.sucursal || 'Lima Centro';
    const carretera = item.carretera || 'EXPRESS';
    const carreteraClass = carretera.toLowerCase().replace(' ', '-');
    return `
    <tr>
      <td data-label="N° Solicitud">${displayedSolicitud}</td>
      <td data-label="N° Documento">${item.documento}</td>
      <td data-label="Sucursal">${sucursal}</td>
      <td data-label="Carretera"><span class="carretera-badge ${carreteraClass}">${carretera}</span></td>
      <td data-label="Fecha">${item.fecha}</td>
      <td data-label="Estado"><span class="estado estado-${item.estado.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}">${item.estado}</span></td>
      <td data-label="Acciones"><div class="row-actions">${actionButtons(item)}</div></td>
    </tr>
  `;
  }).join('');

  bandejaSummary.innerHTML = ['PENDIENTE ENVÍO', 'ENVIADO', 'NO CALIFICA', 'EN ATENCIÓN', 'APROBADO', 'ACTIVADO']
    .map(state => {
      const count = data.filter(item => item.estado === state).length;
      const cls = state.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
      return `<span><i class="dot dot-${cls}"></i>${state} <strong>${count}</strong></span>`;
    }).join('');

  document.querySelectorAll('.view-row').forEach(btn => {
    btn.addEventListener('click', () => {
      trackingSolicitud.textContent = btn.dataset.solicitud;
      trackingModal.classList.remove('hidden');
    });
  });

  document.querySelectorAll('.sim-row').forEach(btn => {
    btn.addEventListener('click', () => {
      const bandejaItem = bandejaData.find(item => item.solicitud === btn.dataset.solicitud);

      if (btn.dataset.estado === 'NO CALIFICA') {
        showNoCalificaResult(bandejaItem);
        return;
      }

      if (btn.dataset.estado === 'PENDIENTE ENVÍO') {
        showPendingEnvioResult(bandejaItem);
        return;
      }

      const lockedResultStates = ['ENVIADO', 'EN ATENCIÓN', 'APROBADO', 'ACTIVADO'];
      if (lockedResultStates.includes(btn.dataset.estado)) {
        showLockedApprovedResult(bandejaItem);
        return;
      }

      showModule('simulacion');
    });
  });

  document.querySelectorAll('.send-row').forEach(btn => {
    btn.addEventListener('click', () => {
      const solId = btn.dataset.solicitud;
      const item = bandejaData.find(x => x.solicitud === solId);
      if (item) {
        const generatedNum = 'SOL' + Math.floor(10000 + Math.random() * 90000);
        item.solicitud = generatedNum;
        item.estado = 'ENVIADO';
        item.fecha = getCurrentDateTimeString();
        if (!item.sucursal) item.sucursal = 'Lima Centro';
        if (!item.carretera) item.carretera = 'EXPRESS';
        
        renderBandeja();
        
        const successP = successModal.querySelector('.success-modal-card p');
        if (successP) {
          successP.innerHTML = `Solicitud n° <strong>${generatedNum}</strong> enviada a ejecutivo`;
        }
        openSuccessModal();
      }
    });
  });

  // Bind dropdown toggle
  document.querySelectorAll('.action-trigger-btn').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentMenu = trigger.nextElementSibling;
      // Close all other dropdowns
      document.querySelectorAll('.action-dropdown-menu').forEach(menu => {
        if (menu !== currentMenu) {
          menu.classList.add('hidden');
        }
      });
      currentMenu.classList.toggle('hidden');
    });
  });
}

function parseBandejaDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split(' ');
  const dateParts = parts[0].split('-');
  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const year = parseInt(dateParts[2], 10);
  
  let hours = 0, minutes = 0, seconds = 0;
  if (parts[1]) {
    const timeParts = parts[1].split(':');
    hours = parseInt(timeParts[0], 10);
    minutes = parseInt(timeParts[1], 10);
    seconds = parseInt(timeParts[2], 10);
  }
  return new Date(year, month, day, hours, minutes, seconds);
}

function applyBandejaFilters() {
  const solicitud = document.getElementById('filterSolicitud').value.trim().toUpperCase();
  const documento = document.getElementById('filterDocumento').value.trim();
  const sucursal = document.getElementById('filterSucursal').value;
  const carretera = document.getElementById('filterCarretera').value;
  const estado = document.getElementById('filterEstado').value;
  const fechaDesdeVal = document.getElementById('filterFechaDesde').value;
  const fechaHastaVal = document.getElementById('filterFechaHasta').value;
  
  const fromDate = fechaDesdeVal ? new Date(fechaDesdeVal + 'T00:00:00') : null;
  const toDate = fechaHastaVal ? new Date(fechaHastaVal + 'T23:59:59') : null;

  const filtered = bandejaData.filter(item => {
    const itemDate = parseBandejaDate(item.fecha);
    
    const matchesSolicitud = !solicitud || item.solicitud.includes(solicitud);
    const matchesDocumento = !documento || item.documento.includes(documento);
    const matchesSucursal = !sucursal || item.sucursal === sucursal;
    const matchesCarretera = !carretera || item.carretera === carretera;
    const matchesEstado = !estado || item.estado === estado;
    
    let matchesDesde = true;
    if (fromDate && itemDate) {
      matchesDesde = itemDate >= fromDate;
    }
    
    let matchesHasta = true;
    if (toDate && itemDate) {
      matchesHasta = itemDate <= toDate;
    }
    
    return matchesSolicitud && matchesDocumento && matchesSucursal && matchesCarretera && matchesEstado && matchesDesde && matchesHasta;
  });
  renderBandeja(filtered);
}

['numDoc', 'spouseNumDoc', 'phone', 'rPhone', 'filterDocumento'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', (e) => {
    e.target.value = onlyDigits(e.target.value);
    if ((id === 'phone' || id === 'rPhone') && e.target.value.trim().length === 9) e.target.classList.remove('attention');
    validateForm();
    if (id === 'rPhone') {
      updateSendPdfBtnState();
      updateDownloadApprovalBtnState();
    }
  });
});

['filterSolicitud', 'filterDocumento', 'filterSucursal', 'filterCarretera', 'filterFechaDesde', 'filterFechaHasta', 'filterEstado'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', applyBandejaFilters);
    el.addEventListener('change', applyBandejaFilters);
  }
});

[vehicleCost, initialAmount].forEach(input => {
  input.addEventListener('input', () => { updatePercent(); validateForm(); });
  input.addEventListener('blur', () => {
    input.value = formatMoney(input.value);
    updatePercent();
    validateForm();
  });
});

[...requiredFields, ...spouseFields].forEach(field => {
  field.addEventListener('change', validateForm);
  field.addEventListener('input', validateForm);
});

menuItems.forEach(item => {
  item.addEventListener('click', () => showModule(item.dataset.module));
});

spouseToggle.addEventListener('change', updateSpouseSection);

clearBtn.addEventListener('click', () => {
  form.reset();
  phone.classList.remove('attention');
  initialPercent.textContent = '0%';
  document.querySelectorAll('.field.invalid').forEach(el => el.classList.remove('invalid'));
  updateSpouseSection();
  validateForm();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  validateForm();
  if (simulateBtn.disabled) return;

  if (sedeSelect && sedeConfirmModal && sedeConfirmMessage) {
    const selectedSede = sedeSelect.options[sedeSelect.selectedIndex].text;
    sedeConfirmMessage.innerHTML = `¿Está seguro de registrar la simulación en la sede <strong>${selectedSede}</strong>?`;
    sedeConfirmModal.classList.remove('hidden');
  } else {
    showResult();
    showToast('Resultado de simulación generado.');
  }
});

backBtn.addEventListener('click', () => {
  if (currentResultContext === 'no-califica' || currentResultContext === 'bandeja-result') {
    showModule('bandeja');
    return;
  }
  resultView.classList.add('hidden');
  formView.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

sendPdfBtn.addEventListener('click', () => {
  const phoneVal = resultPhone.value.trim();
  if (phoneVal.length !== 9) {
    resultPhone.required = true;
    resultPhone.classList.add('attention');
    resultPhone.focus();
    resultPhone.reportValidity();
    return;
  }
  downloadSimulationPlan();
});

downloadApprovalBtn.addEventListener('click', () => {
  const phoneVal = resultPhone.value.trim();
  if (phoneVal.length !== 9) {
    resultPhone.required = true;
    resultPhone.classList.add('attention');
    resultPhone.focus();
    resultPhone.reportValidity();
    return;
  }

  // Reset SMS inputs
  smsInputs.forEach(input => input.value = '');
  if (btnAcceptSmsVerification) btnAcceptSmsVerification.disabled = true;

  // Update phone number in pop-up message
  if (smsVerificationMessage) {
    smsVerificationMessage.innerHTML = `Se envió un código de 4 dígitos al número <strong>${phoneVal}</strong>. Ingresar dígitos:`;
  }

  // Show SMS verification modal
  if (smsVerificationModal) {
    smsVerificationModal.classList.remove('hidden');
    // Auto-focus first input
    setTimeout(() => smsInputs[0]?.focus(), 100);
  }
});

smsInputs.forEach((input, index) => {
  input.addEventListener('input', (e) => {
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value.length === 1 && index < 3) {
      smsInputs[index + 1].focus();
    }
    checkSmsInputs();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
      smsInputs[index - 1].focus();
    }
  });
});

function checkSmsInputs() {
  let allFilled = true;
  smsInputs.forEach(input => {
    if (input.value.trim().length !== 1) allFilled = false;
  });
  if (btnAcceptSmsVerification) btnAcceptSmsVerification.disabled = !allFilled;
}

btnCancelSmsVerification?.addEventListener('click', () => {
  smsVerificationModal.classList.add('hidden');
});

btnAcceptSmsVerification?.addEventListener('click', () => {
  smsVerificationModal.classList.add('hidden');
  downloadApprovalLetter();
});

if (closePhoneModal) closePhoneModal.addEventListener('click', () => {});
if (phoneModal) phoneModal.addEventListener('click', () => {});
closeTrackingModal.addEventListener('click', () => trackingModal.classList.add('hidden'));
trackingModal.addEventListener('click', (e) => {
  if (e.target === trackingModal) trackingModal.classList.add('hidden');
});

// Event listeners para Pop-up de Confirmación de Sede
btnCancelSede?.addEventListener('click', () => {
  if (sedeConfirmModal) sedeConfirmModal.classList.add('hidden');
  if (sedeSelect) {
    sedeSelect.focus();
    sedeSelect.classList.add('highlight-attention');
  }
});

btnAcceptSede?.addEventListener('click', () => {
  if (sedeConfirmModal) sedeConfirmModal.classList.add('hidden');
  showResult();
  showToast('Resultado de simulación generado.');
});

sedeSelect?.addEventListener('change', () => {
  sedeSelect.classList.remove('highlight-attention');
});
sedeSelect?.addEventListener('click', () => {
  sedeSelect.classList.remove('highlight-attention');
});
sedeSelect?.addEventListener('blur', () => {
  sedeSelect.classList.remove('highlight-attention');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (phoneModal && !phoneModal.classList.contains('hidden')) phoneModal.classList.add('hidden');
    if (!trackingModal.classList.contains('hidden')) trackingModal.classList.add('hidden');
    if (!successModal.classList.contains('hidden')) closeSuccessModalAndGoBandeja();
    if (smsVerificationModal && !smsVerificationModal.classList.contains('hidden')) smsVerificationModal.classList.add('hidden');
    if (sedeConfirmModal && !sedeConfirmModal.classList.contains('hidden')) sedeConfirmModal.classList.add('hidden');
  }
});

sendExecutiveBtn.addEventListener('click', () => {
  if (!isPhoneValid()) {
    markResultPhoneRequired();
    return;
  }
  
  const generatedNum = 'SOL' + Math.floor(10000 + Math.random() * 90000);
  const sucursalVal = sedeSelect ? sedeSelect.value : 'Lima Centro';
  const roadText = roadDocs.textContent.replace('Carretera: ', '').trim();
  
  if (activeBandejaItem) {
    activeBandejaItem.solicitud = generatedNum;
    activeBandejaItem.estado = 'ENVIADO';
    activeBandejaItem.fecha = getCurrentDateTimeString();
    activeBandejaItem.selectedTerm = getSelectedTerm();
    activeBandejaItem.sucursal = sucursalVal;
    activeBandejaItem.carretera = roadText;
  } else {
    // New simulation
    const newItem = {
      solicitud: generatedNum,
      documento: document.getElementById('rNumDoc').value || '',
      fecha: getCurrentDateTimeString(),
      estado: 'ENVIADO',
      selectedTerm: getSelectedTerm(),
      sucursal: sucursalVal,
      carretera: roadText,
      vehicleCost: toNumber(document.getElementById('rCost').value),
      initialAmount: toNumber(document.getElementById('rInitial').value),
      hasSpouse: spouseToggle.checked
    };
    bandejaData.unshift(newItem);
  }
  
  renderBandeja();

  // Bloquear campos inmediatamente tras envío exitoso
  setResultHeaderStatus('ENVIADO');
  updateResultViewLockState('ENVIADO');
  
  const successP = successModal.querySelector('.success-modal-card p');
  if (successP) {
    successP.innerHTML = `Solicitud n° <strong>${generatedNum}</strong> enviada a ejecutivo`;
  }
  openSuccessModal();
});

acceptSuccessModal.addEventListener('click', closeSuccessModalAndGoBandeja);
successModal.addEventListener('click', (e) => {
  if (e.target === successModal) closeSuccessModalAndGoBandeja();
});

cleanSearchBtn.addEventListener('click', () => {
  ['filterSolicitud', 'filterDocumento', 'filterSucursal', 'filterCarretera', 'filterFechaDesde', 'filterFechaHasta', 'filterEstado'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  renderBandeja();
});

['rCost', 'rInitial'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', (e) => {
    e.target.value = onlyDigits(e.target.value);
  });
  el.addEventListener('blur', (e) => {
    e.target.value = formatMoney(e.target.value);
  });
});

document.getElementById('rSimulateBtn')?.addEventListener('click', () => {
  const cost = toNumber(document.getElementById('rCost').value);
  const initial = toNumber(document.getElementById('rInitial').value);
  const financed = Math.max(cost - initial, 0);

  const termVal = activeBandejaItem ? activeBandejaItem.selectedTerm : null;
  updatePreApprovedBox(cost, initial, termVal);

  vehicleCost.value = formatMoney(cost);
  initialAmount.value = initial ? formatMoney(initial) : '';
  updatePercent();
  validateForm();

  if (activeBandejaItem) {
    activeBandejaItem.vehicleCost = cost;
    activeBandejaItem.initialAmount = initial;
  }

  const isNoCalifica = currentResultContext === 'no-califica';
  const isDisabled = isNoCalifica || (activeBandejaItem && activeBandejaItem.estado !== 'PENDIENTE ENVÍO');
  
  generateQuotaRows({
    financed: financed,
    selectedTerm: termVal,
    disabled: isDisabled,
    alwaysSustentar: isNoCalifica,
    item: activeBandejaItem
  });
  
  aplicarLineaPreaprobadaFija();
  showToast('Re-simulación completada.');
});

updateSpouseSection();
validateForm();
renderBandeja();

// Global click listener to close all dropdowns when clicking outside
document.addEventListener('click', () => {
  document.querySelectorAll('.action-dropdown-menu').forEach(menu => {
    menu.classList.add('hidden');
  });
});
