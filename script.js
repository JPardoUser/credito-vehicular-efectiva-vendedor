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

function simularCuotasBantotal(financed, term, teaPercent) {
  const tem = Math.pow(1 + teaPercent / 100, 1 / 12) - 1;
  const payment = financed * (tem * Math.pow(1 + tem, term)) / (Math.pow(1 + tem, term) - 1);
  return payment;
}

// Database of preapproved clients (mockClientes)
const mockClientes = {
  "70569533": {
    nombres: "Augusto Chavez Altamirano",
    documento: "70569533",
    estadoCivil: "SOLTERO",
    conyuge: null,
    montoPreaprobado: 380000,
    cuotaInicialMinima: 10,
    plazoMaximo: 60,
    carretera: "Express",
    TEA: 12.90,
    resultado: "CALIFICA",
    documentosRequeridos: ["COPIA DE DNI (ambas caras)"]
  },
  "71406119": {
    nombres: "Carlos Mendoza Ruiz",
    documento: "71406119",
    estadoCivil: "CASADO",
    conyuge: { tipoDoc: "DNI", numDoc: "32984112", nombres: "Ana Gomez Suarez" },
    montoPreaprobado: 250000,
    cuotaInicialMinima: 20,
    plazoMaximo: 48,
    carretera: "Preferente",
    TEA: 14.50,
    resultado: "AUMENTAR INICIAL",
    documentosRequeridos: ["COPIA DE DNI (ambas caras)", "Copia de recibo de servicios (luz o agua)", "Constancia de trabajo simple"]
  },
  "80569877": {
    nombres: "Juan Pedro Pérez García",
    documento: "80569877",
    estadoCivil: "SOLTERO",
    conyuge: null,
    montoPreaprobado: 180000,
    cuotaInicialMinima: 15,
    plazoMaximo: 36,
    carretera: "Verificado",
    TEA: 16.00,
    resultado: "REQUIERE SUSTENTO",
    documentosRequeridos: ["COPIA DE DNI (ambas caras)", "Sustento de ingresos (últimas 3 boletas de pago)", "Estado de cuenta bancario"]
  }
};

// Add cuotasPreliminares dynamically to each client in mockClientes
for (let key in mockClientes) {
  const c = mockClientes[key];
  const baseFinancedSoles = c.montoPreaprobado * (1 - c.cuotaInicialMinima / 100);
  c.cuotasPreliminares = [12, 24, 36, 48, 60].map(term => {
    const cuotaSoles = simularCuotasBantotal(baseFinancedSoles, term, c.TEA);
    return {
      plazo: term,
      cuota: `S/ ${cuotaSoles.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    };
  });
}

// OTP logic variables
let otpValidated = false;
let otpAttempts = 0;
let otpBlocked = false;
let otpTimer = null;
let otpTimeRemaining = 0;

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

function getDocsMarkupForRoad(road) {
  switch (road) {
    case 'Express':
      return `
        <ul class="docs-list">
          <li>COPIA DE DNI (ambas caras)</li>
        </ul>
      `;
    case 'Preferente':
      return `
        <ul class="docs-list">
          <li>COPIA DE DNI (ambas caras)</li>
          <li>Copia de recibo de servicios (luz o agua)</li>
          <li>Constancia de trabajo simple</li>
        </ul>
      `;
    case 'Verificado':
      return `
        <ul class="docs-list">
          <li>COPIA DE DNI (ambas caras)</li>
          <li>Sustento de ingresos (últimas 3 boletas de pago)</li>
          <li>Estado de cuenta bancario</li>
        </ul>
      `;
    case 'Full':
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
  if(road === 'Express') return ['COPIA DE DNI (ambas caras)'];
  if(road === 'Preferente') return ['COPIA DE DNI (ambas caras)', 'Copia de recibo de servicios', 'Constancia de trabajo simple'];
  if(road === 'Verificado') return ['COPIA DE DNI (ambas caras)', 'Sustento de ingresos (3 boletas)', 'Estado de cuenta bancario'];
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
  { solicitud: 'EFE001', documento: '70569533', fecha: '20-06-2026 10:15:30', estado: 'PENDIENTE ENVÍO', selectedTerm: 48, hasSpouse: false, vehicleCost: 25000, initialAmount: 3000, sucursal: 'Lima Centro', carretera: 'Express' },
  { solicitud: 'SOL00001', documento: '71406119', fecha: '20-06-2026 11:30:00', estado: 'ENVIADO', selectedTerm: 36, hasSpouse: true, vehicleCost: 30000, initialAmount: 9000, sucursal: 'Lima Norte', carretera: 'Preferente' },
  { solicitud: 'SOL00002', documento: '80569877', fecha: '20-06-2026 12:45:15', estado: 'EN ATENCIÓN', selectedTerm: 60, hasSpouse: false, vehicleCost: 15000, initialAmount: 2250, sucursal: 'Arequipa', carretera: 'Verificado' },
  { solicitud: 'SOL00003', documento: '70569533', fecha: '20-06-2026 14:00:22', estado: 'APROBADO', selectedTerm: 24, hasSpouse: false, vehicleCost: 18000, initialAmount: 1800, sucursal: 'Trujillo', carretera: 'Express' },
  { solicitud: 'SOL00004', documento: '80569877', fecha: '20-06-2026 15:20:10', estado: 'ACTIVADO', selectedTerm: 48, hasSpouse: false, vehicleCost: 20000, initialAmount: 3000, sucursal: 'Lima Sur', carretera: 'Verificado' }
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


function formatOtpTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function startOtpTimer() {
  otpTimeRemaining = 300; // 5 minutes
  if (otpTimer) clearInterval(otpTimer);
  
  const timerEl = $('otpTimerText');
  if (timerEl) {
    timerEl.textContent = `Tiempo restante: ${formatOtpTime(otpTimeRemaining)}`;
  }

  otpTimer = setInterval(() => {
    otpTimeRemaining--;
    if (otpTimeRemaining <= 0) {
      clearInterval(otpTimer);
      otpBlocked = true;
      if (timerEl) timerEl.textContent = "Código expirado.";
      smsVerificationModal.classList.add('hidden');
      showLoginAlert("El código OTP ha expirado. Por seguridad se bloqueó el servicio.", "Bloqueado");
    } else {
      if (timerEl) timerEl.textContent = `Tiempo restante: ${formatOtpTime(otpTimeRemaining)}`;
    }
  }, 1000);
}

function generateQuotaRowsDynamic({ financed, client, outcome, selectedTerm = null }) {
  const terms = [12, 24, 36, 48, 60];
  quotaBody.innerHTML = '';

  terms.forEach((term) => {
    const financedInSoles = financed * 3.8;
    const quotaSoles = simularCuotasBantotal(financedInSoles, term, client.TEA);
    
    let capacity = 'CALIFICA';
    if (outcome === 'REQUIERE SUSTENTO' || outcome === 'AUMENTAR INICIAL') {
      capacity = 'SUSTENTAR INGRESO';
    }
    
    const checked = term === selectedTerm ? 'checked' : '';
    const isLocked = activeBandejaItem && activeBandejaItem.estado !== 'PENDIENTE ENVÍO';
    const disabledAttr = isLocked ? 'disabled' : '';

    const tr = document.createElement('tr');
    tr.dataset.capacity = capacity;
    tr.dataset.term = term;
    tr.innerHTML = `
      <td data-label="Plazo">${term} meses</td>
      <td data-label="Cuota">S/ ${quotaSoles.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td data-label="TEA">${client.TEA.toFixed(2)}%</td>
      <td data-label="Capacidad"><span class="${capacity === 'CALIFICA' ? 'ok' : 'warn'}">${capacity}</span></td>
      <td data-label="Selección"><input type="checkbox" class="quota-check" aria-label="Seleccionar plazo ${term} meses" ${checked} ${disabledAttr}></td>
    `;
    quotaBody.appendChild(tr);
  });

  const isLocked = activeBandejaItem && activeBandejaItem.estado !== 'PENDIENTE ENVÍO';
  if (!isLocked) {
    document.querySelectorAll('.quota-check').forEach(check => {
      check.addEventListener('change', (event) => {
        if (event.target.checked) {
          document.querySelectorAll('.quota-check').forEach(other => {
            if (other !== event.target) other.checked = false;
          });
        }
        
        const selected = document.querySelector('.quota-check:checked');
        const termVal = selected ? Number(selected.closest('tr').dataset.term) : null;
        
        if (activeBandejaItem) {
          activeBandejaItem.selectedTerm = termVal;
        }
        
        sendExecutiveBtn.disabled = !termVal;
        updateSendPdfBtnState();
        updateDownloadApprovalBtnState();
      });
    });
  }

  const selected = document.querySelector('.quota-check:checked');
  sendExecutiveBtn.disabled = !selected;
  
  updateSendPdfBtnState();
  updateDownloadApprovalBtnState();
}

function recalculateSimulation(client, cost, initial) {
  let outcome = client.resultado;
  const financedUSD = Math.max(cost - initial, 0);
  
  const minInitialPercent = client.cuotaInicialMinima;
  const minInitialUSDByPercent = cost * (minInitialPercent / 100);
  const minInitialUSDByCap = cost - (client.montoPreaprobado / 3.8);
  const minInitialRequiredUSD = Math.max(minInitialUSDByPercent, minInitialUSDByCap);
  
  if (client.resultado === 'AUMENTAR INICIAL') {
    if (initial >= minInitialRequiredUSD) {
      outcome = 'CALIFICA';
    } else {
      outcome = 'AUMENTAR INICIAL';
    }
  }
  
  const successBox = $('resultSuccessBox');
  const resultIcon = $('resultIcon');
  const resultTitle = $('resultStatusText');
  const resultMessage = $('resultMessageText');
  
  if (successBox) {
    successBox.className = 'success-box';
    if (outcome === 'CALIFICA') {
      successBox.classList.add('califica');
      if (resultIcon) resultIcon.textContent = '✓';
      if (resultTitle) resultTitle.textContent = 'CALIFICA';
      if (resultMessage) {
        resultMessage.style.display = 'none';
        resultMessage.textContent = '';
      }
    } else if (outcome === 'AUMENTAR INICIAL') {
      successBox.classList.add('aumentar-inicial');
      if (resultIcon) resultIcon.textContent = '⚠';
      if (resultTitle) resultTitle.textContent = 'AUMENTAR INICIAL';
      if (resultMessage) {
        resultMessage.style.display = 'block';
        resultMessage.innerHTML = `Se requiere incrementar la cuota inicial. Inicial mínima requerida: <strong>$ ${money(minInitialRequiredUSD)}</strong> (cubre cuota inicial del ${minInitialPercent}% y exceso de línea preaprobada).`;
      }
    } else if (outcome === 'REQUIERE SUSTENTO') {
      successBox.classList.add('requiere-sustento');
      if (resultIcon) resultIcon.textContent = '⚠';
      if (resultTitle) resultTitle.textContent = 'REQUIERE SUSTENTO';
      if (resultMessage) {
        resultMessage.style.display = 'block';
        resultMessage.textContent = 'Su solicitud requiere de una evaluación especializada. Por favor, presente los documentos de sustento requeridos.';
      }
    }
  }
  
  const road = client.carretera;
  if (roadBadge) {
    roadBadge.textContent = `Cartera ${road}`;
    roadBadge.className = `road-badge ${road.toLowerCase()}`;
  }
  if (roadDocs) {
    roadDocs.textContent = `Carretera: ${road}`;
    roadDocs.className = `road-docs ${road.toLowerCase()}`;
  }
  if (requiredDocs) {
    requiredDocs.innerHTML = getDocsMarkupForRoad(road);
  }
  
  // En REQUIERE SUSTENTO no ocultamos ni preaprobado ni cuotas, se ven normales
  const preapprovedDetails = document.querySelector('.preapproved-box .preapproved-details');
  if (preapprovedDetails) {
    preapprovedDetails.style.display = 'flex';
  }
  
  generateQuotaRowsDynamic({
    financed: financedUSD,
    client: client,
    outcome: outcome,
    selectedTerm: activeBandejaItem ? activeBandejaItem.selectedTerm : null
  });
}

function downloadSimulationPlan() {
  const typeDoc = document.getElementById('rTipoDoc').value || 'DNI';
  const numDoc = document.getElementById('rNumDoc').value || '';
  const name = document.getElementById('rName').value || '';
  const phone = document.getElementById('rPhone').value || '';
  const priceVal = toNumber(document.getElementById('rCost').value);
  const initialVal = toNumber(document.getElementById('rInitial').value);

  const client = mockClientes[numDoc];
  if (!client) return;

  const checkedQuota = document.querySelector('.quota-check:checked');
  let plazo = '48 meses';
  let cuota = 'S/ 0.00';
  if (checkedQuota) {
    const row = checkedQuota.closest('tr');
    plazo = row.querySelector('td:nth-child(1)').textContent.trim();
    cuota = row.querySelector('td:nth-child(2)').textContent.trim();
  }

  // Get recalculated outcome
  const minInitialPercent = client.cuotaInicialMinima;
  const minInitialUSDByPercent = priceVal * (minInitialPercent / 100);
  const minInitialUSDByCap = priceVal - (client.montoPreaprobado / 3.8);
  const minInitialRequiredUSD = Math.max(minInitialUSDByPercent, minInitialUSDByCap);
  
  let outcome = client.resultado;
  if (client.resultado === 'AUMENTAR INICIAL' && initialVal >= minInitialRequiredUSD) {
    outcome = 'CALIFICA';
  }

  const road = client.carretera;
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
    {label:'Tasa de Interes (TEA)', value: `${client.TEA.toFixed(2)}%`},
    {label:'Plazo de Financiamiento', value: plazo},
    {label:'Cuota Mensual Estimada', value: cuota},
    {label:'Modalidad de Evaluacion', value: `Carretera ${road}`},
    {label:'Resultado de la Evaluacion', value: outcome}
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

  const client = mockClientes[numDoc];
  if (!client) return;

  const checkedQuota = document.querySelector('.quota-check:checked');
  let plazo = '48 meses';
  let cuota = 'S/ 0.00';
  if (checkedQuota) {
    const row = checkedQuota.closest('tr');
    plazo = row.querySelector('td:nth-child(1)').textContent.trim();
    cuota = row.querySelector('td:nth-child(2)').textContent.trim();
  }

  const road = client.carretera;
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
    {label:'Tasa de Interes (TEA)', value: `${client.TEA.toFixed(2)}%`},
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
  
  const numDocVal = document.getElementById('rNumDoc').value;
  const client = mockClientes[numDocVal];
  
  if (!client) {
    if (downloadApprovalBtn) {
      downloadApprovalBtn.disabled = true;
      downloadApprovalBtn.classList.add('hidden');
    }
    return;
  }
  
  const cost = toNumber(document.getElementById('rCost').value);
  const initial = toNumber(document.getElementById('rInitial').value);
  const minInitialPercent = client.cuotaInicialMinima;
  const minInitialUSDByPercent = cost * (minInitialPercent / 100);
  const minInitialUSDByCap = cost - (client.montoPreaprobado / 3.8);
  const minInitialRequiredUSD = Math.max(minInitialUSDByPercent, minInitialUSDByCap);
  
  let currentOutcome = client.resultado;
  if (client.resultado === 'AUMENTAR INICIAL' && initial >= minInitialRequiredUSD) {
    currentOutcome = 'CALIFICA';
  }
  
  const isExpress = client.carretera === 'Express';
  const isCalifica = currentOutcome === 'CALIFICA';
  const hasPhone = phoneVal.length === 9;
  
  if (downloadApprovalBtn) {
    const showBtn = isChecked && isExpress && isCalifica;
    downloadApprovalBtn.classList.toggle('hidden', !showBtn);
    downloadApprovalBtn.disabled = !(showBtn && hasPhone);
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
  
  const client = mockClientes[item.documento] || mockClientes["80569877"];
  
  document.getElementById('rTipoDoc').value = 'DNI';
  document.getElementById('rNumDoc').value = item?.documento;
  document.getElementById('rName').value = client.nombres;
  resultPhone.value = item?.phone || '987654321';
  resultPhone.required = true;
  resultPhone.classList.remove('attention');

  const cost = item?.vehicleCost !== undefined ? item.vehicleCost : 25000;
  const initial = item?.initialAmount !== undefined ? item.initialAmount : 0;
  document.getElementById('rCost').value = formatMoney(cost);
  document.getElementById('rInitial').value = initial ? formatMoney(initial) : '0.00';

  const spouseGrid = document.getElementById('rSpouseGridContainer');
  if (item?.hasSpouse && client.conyuge) {
    spouseGrid.classList.remove('hidden');
    document.getElementById('rSpouseTipoDoc').value = client.conyuge.tipoDoc;
    document.getElementById('rSpouseNumDoc').value = client.conyuge.numDoc;
    document.getElementById('rSpouseName').value = client.conyuge.nombres;
  } else {
    spouseGrid.classList.add('hidden');
  }

  const rPreApprovedAmount = document.getElementById('rPreApprovedAmount');
  const rMinInitial = document.getElementById('rMinInitial');
  const rPreApprovedTerm = document.getElementById('rPreApprovedTerm');
  
  if (rPreApprovedAmount) rPreApprovedAmount.textContent = `S/ ${money(client.montoPreaprobado)}`;
  if (rMinInitial) rMinInitial.textContent = `${client.cuotaInicialMinima}%`;
  if (rPreApprovedTerm) rPreApprovedTerm.textContent = `${client.plazoMaximo || 60} meses`;

  const preapprovedDetails = document.querySelector('.preapproved-box .preapproved-details');
  if (preapprovedDetails) {
    preapprovedDetails.style.display = 'flex';
  }

  recalculateSimulation(client, cost, initial);

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
  setResultHeaderStatus(item?.estado || 'ENVIADO');
  
  const client = mockClientes[item.documento] || mockClientes["80569877"];
  
  document.getElementById('rTipoDoc').value = 'DNI';
  document.getElementById('rNumDoc').value = item?.documento;
  document.getElementById('rName').value = client.nombres;
  resultPhone.value = item?.phone || '987654321';
  resultPhone.required = true;
  resultPhone.classList.remove('attention');

  const cost = item?.vehicleCost !== undefined ? item.vehicleCost : 25000;
  const initial = item?.initialAmount !== undefined ? item.initialAmount : 0;
  document.getElementById('rCost').value = formatMoney(cost);
  document.getElementById('rInitial').value = initial ? formatMoney(initial) : '0.00';

  const spouseGrid = document.getElementById('rSpouseGridContainer');
  if (item?.hasSpouse && client.conyuge) {
    spouseGrid.classList.remove('hidden');
    document.getElementById('rSpouseTipoDoc').value = client.conyuge.tipoDoc;
    document.getElementById('rSpouseNumDoc').value = client.conyuge.numDoc;
    document.getElementById('rSpouseName').value = client.conyuge.nombres;
  } else {
    spouseGrid.classList.add('hidden');
  }

  const rPreApprovedAmount = document.getElementById('rPreApprovedAmount');
  const rMinInitial = document.getElementById('rMinInitial');
  const rPreApprovedTerm = document.getElementById('rPreApprovedTerm');
  
  if (rPreApprovedAmount) rPreApprovedAmount.textContent = `S/ ${money(client.montoPreaprobado)}`;
  if (rMinInitial) rMinInitial.textContent = `${client.cuotaInicialMinima}%`;
  if (rPreApprovedTerm) rPreApprovedTerm.textContent = `${client.plazoMaximo || 60} meses`;

  const preapprovedDetails = document.querySelector('.preapproved-box .preapproved-details');
  if (preapprovedDetails) {
    preapprovedDetails.style.display = 'flex';
  }

  recalculateSimulation(client, cost, initial);

  const rSucursalText = document.getElementById('rSucursalText');
  if (rSucursalText) rSucursalText.textContent = item?.sucursal || 'Lima Centro';
  updateResultViewLockState(item?.estado || 'ENVIADO');

  formView.classList.add('hidden');
  bandejaView.classList.add('hidden');
  resultView.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showResult() {
  activeBandejaItem = null;
  currentResultContext = 'simulation';
  setResultHeaderStatus('PENDIENTE ENVÍO');
  
  const numDocVal = document.getElementById('numDoc').value;
  const client = mockClientes[numDocVal];
  
  if (!client) {
    showLoginAlert("El documento ingresado no se encuentra pre-aprobado. Use uno de los DNIs de prueba: 70569533 (CALIFICA), 71406119 (AUMENTAR INICIAL), 80569877 (REQUIERE SUSTENTO).", "Documento no encontrado");
    return;
  }
  
  document.getElementById('rTipoDoc').value = document.getElementById('tipoDoc').value;
  document.getElementById('rNumDoc').value = numDocVal;
  document.getElementById('rName').value = client.nombres;
  resultPhone.value = phone.value || '';
  resultPhone.required = true;
  resultPhone.classList.remove('attention');

  const spouseGrid = document.getElementById('rSpouseGridContainer');
  if (spouseToggle.checked && client.conyuge) {
    spouseGrid.classList.remove('hidden');
    document.getElementById('rSpouseTipoDoc').value = client.conyuge.tipoDoc;
    document.getElementById('rSpouseNumDoc').value = client.conyuge.numDoc;
    document.getElementById('rSpouseName').value = client.conyuge.nombres;
  } else {
    spouseGrid.classList.add('hidden');
  }

  const rPreApprovedAmount = document.getElementById('rPreApprovedAmount');
  const rMinInitial = document.getElementById('rMinInitial');
  const rPreApprovedTerm = document.getElementById('rPreApprovedTerm');
  
  if (rPreApprovedAmount) rPreApprovedAmount.textContent = `S/ ${money(client.montoPreaprobado)}`;
  if (rMinInitial) rMinInitial.textContent = `${client.cuotaInicialMinima}%`;
  if (rPreApprovedTerm) rPreApprovedTerm.textContent = `${client.plazoMaximo || 60} meses`;

  const preapprovedDetails = document.querySelector('.preapproved-box .preapproved-details');
  if (preapprovedDetails) {
    preapprovedDetails.style.display = 'flex';
  }

  const cost = toNumber(vehicleCost.value);
  const initial = toNumber(initialAmount.value);
  document.getElementById('rCost').value = formatMoney(cost);
  document.getElementById('rInitial').value = initial ? formatMoney(initial) : '0.00';

  recalculateSimulation(client, cost, initial);

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
  
  const verOption = `<button type="button" class="dropdown-item ver-row" data-solicitud="${item.solicitud}">Ver</button>`;
  const editarOption = `<button type="button" class="dropdown-item editar-row" data-solicitud="${item.solicitud}">Editar</button>`;
  const enviarOption = `<button type="button" class="dropdown-item enviar-row" data-solicitud="${item.solicitud}">Enviar</button>`;
  const trackingOption = `<button type="button" class="dropdown-item tracking-row" data-solicitud="${item.solicitud}">Tracking</button>`;
  
  let menuHtml = '';
  if (isPendiente) {
    menuHtml = `${verOption}${editarOption}${enviarOption}`;
  } else {
    menuHtml = `${verOption}${trackingOption}`;
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

function showTracking(item) {
  trackingSolicitud.textContent = item.solicitud;
  
  const steps = [
    { name: 'Simulación creada', state: 'PENDIENTE ENVÍO' },
    { name: 'Enviada al ejecutivo', state: 'ENVIADO' },
    { name: 'En atención', state: 'EN ATENCIÓN' },
    { name: 'Aprobada', state: 'APROBADO' },
    { name: 'Activada', state: 'ACTIVADO' }
  ];
  
  const stateOrder = ['PENDIENTE ENVÍO', 'ENVIADO', 'EN ATENCIÓN', 'APROBADO', 'ACTIVADO'];
  const currentStateIndex = stateOrder.indexOf(item.estado);
  
  const trackingLine = $('trackingLine');
  if (trackingLine) {
    trackingLine.innerHTML = steps.map((step, idx) => {
      const isDone = idx <= currentStateIndex;
      const doneClass = isDone ? 'done' : '';
      const dateText = isDone ? (idx === 0 ? item.fecha : (item.fechaEnvio || item.fecha || '20-06-2026 15:03:30')) : 'Pendiente';
      return `
        <div class="tracking-step ${doneClass}">
          <span></span>
          <strong>${step.name}</strong>
          <small>${dateText}</small>
        </div>
      `;
    }).join('');
  }
  
  trackingModal.classList.remove('hidden');
}

function renderBandeja(data = bandejaData) {
  bandejaBody.innerHTML = data.map(item => {
    const displayedSolicitud = item.estado === 'PENDIENTE ENVÍO' ? '-' : item.solicitud;
    const sucursal = item.sucursal || 'Lima Centro';
    
    // Look up client details from mockClientes
    const client = mockClientes[item.documento] || {
      nombres: 'Juan Pedro Pérez García',
      resultado: 'CALIFICA',
      carretera: 'Express'
    };
    
    const clientName = client.nombres;
    const resultado = client.resultado;
    const carretera = client.carretera;
    const carreteraClass = carretera.toLowerCase().replace(' ', '-');
    
    return `
    <tr>
      <td data-label="Solicitud">${displayedSolicitud}</td>
      <td data-label="Documento">${item.documento}</td>
      <td data-label="Cliente">${clientName}</td>
      <td data-label="Fecha">${item.fecha}</td>
      <td data-label="Resultado"><span class="resultado-badge estado-${resultado.toLowerCase().replace(/\s+/g, '-')}">${resultado}</span></td>
      <td data-label="Carretera"><span class="carretera-badge ${carreteraClass}">${carretera}</span></td>
      <td data-label="Estado"><span class="estado estado-${item.estado.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}">${item.estado}</span></td>
      <td data-label="Sucursal">${sucursal}</td>
      <td data-label="Acciones"><div class="row-actions">${actionButtons(item)}</div></td>
    </tr>
  `;
  }).join('');

  bandejaSummary.innerHTML = ['PENDIENTE ENVÍO', 'ENVIADO', 'EN ATENCIÓN', 'APROBADO', 'ACTIVADO']
    .map(state => {
      const count = data.filter(item => item.estado === state).length;
      const cls = state.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
      return `<span><i class="dot dot-${cls}"></i>${state} <strong>${count}</strong></span>`;
    }).join('');

  document.querySelectorAll('.ver-row').forEach(btn => {
    btn.addEventListener('click', () => {
      const rowDoc = btn.closest('tr').querySelector('td:nth-child(2)').textContent.trim();
      const itemToView = bandejaData.find(x => x.solicitud === btn.dataset.solicitud) || bandejaData.find(x => x.documento === rowDoc && x.estado === 'PENDIENTE ENVÍO');
      if (itemToView) showLockedApprovedResult(itemToView);
    });
  });

  document.querySelectorAll('.editar-row').forEach(btn => {
    btn.addEventListener('click', () => {
      const rowDoc = btn.closest('tr').querySelector('td:nth-child(2)').textContent.trim();
      const itemToEdit = bandejaData.find(x => x.solicitud === btn.dataset.solicitud) || bandejaData.find(x => x.documento === rowDoc && x.estado === 'PENDIENTE ENVÍO');
      if (itemToEdit) showPendingEnvioResult(itemToEdit);
    });
  });

  document.querySelectorAll('.enviar-row').forEach(btn => {
    btn.addEventListener('click', () => {
      const rowDoc = btn.closest('tr').querySelector('td:nth-child(2)').textContent.trim();
      const itemToSend = bandejaData.find(x => x.solicitud === btn.dataset.solicitud) || bandejaData.find(x => x.documento === rowDoc && x.estado === 'PENDIENTE ENVÍO');
      if (itemToSend) {
        const generatedNum = 'SOL' + Math.floor(10000 + Math.random() * 90000);
        itemToSend.solicitud = generatedNum;
        itemToSend.estado = 'ENVIADO';
        itemToSend.fechaEnvio = getCurrentDateTimeString();
        
        renderBandeja();
        
        const successP = successModal.querySelector('.success-modal-card p');
        if (successP) {
          successP.innerHTML = `Solicitud n° <strong>${generatedNum}</strong> enviada a ejecutivo`;
        }
        openSuccessModal();
      }
    });
  });

  document.querySelectorAll('.tracking-row').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = bandejaData.find(x => x.solicitud === btn.dataset.solicitud);
      if (item) showTracking(item);
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
  if (currentResultContext === 'bandeja-result') {
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

  if (otpBlocked) {
    showLoginAlert("El servicio de verificación OTP se encuentra bloqueado por exceder el límite de intentos o expirar el tiempo.", "Bloqueado");
    return;
  }

  // Reset SMS inputs
  smsInputs.forEach(input => input.value = '');
  if (btnAcceptSmsVerification) btnAcceptSmsVerification.disabled = true;

  // Update phone number in pop-up message
  if (smsVerificationMessage) {
    smsVerificationMessage.innerHTML = `Se envió un código de 4 dígitos al número <strong>${phoneVal}</strong>. Ingresar dígitos:`;
  }

  // Start timer
  startOtpTimer();

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
  if (otpTimer) clearInterval(otpTimer);
  smsVerificationModal.classList.add('hidden');
});

btnAcceptSmsVerification?.addEventListener('click', () => {
  const code = smsInputs.map(input => input.value).join('');
  if (code === '1234') {
    clearInterval(otpTimer);
    otpValidated = true;
    smsVerificationModal.classList.add('hidden');
    showToast("Código OTP verificado con éxito.");
    downloadApprovalLetter();
  } else {
    otpAttempts++;
    if (otpAttempts >= 3) {
      otpBlocked = true;
      clearInterval(otpTimer);
      smsVerificationModal.classList.add('hidden');
      showLoginAlert("Ha superado los 3 intentos permitidos. El servicio ha sido bloqueado.", "Bloqueado");
    } else {
      showLoginAlert(`Código incorrecto. Intento ${otpAttempts} de 3.`, "Error");
      smsInputs.forEach(input => input.value = '');
      smsInputs[0].focus();
      if (btnAcceptSmsVerification) btnAcceptSmsVerification.disabled = true;
    }
  }
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

  // Find current client
  const numDocVal = document.getElementById('rNumDoc').value;
  const client = mockClientes[numDocVal];
  
  if (!client) return;

  if (activeBandejaItem) {
    activeBandejaItem.vehicleCost = cost;
    activeBandejaItem.initialAmount = initial;
  }

  vehicleCost.value = formatMoney(cost);
  initialAmount.value = initial ? formatMoney(initial) : '';
  updatePercent();
  validateForm();

  recalculateSimulation(client, cost, initial);
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
