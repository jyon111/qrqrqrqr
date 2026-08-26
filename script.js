qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];

const textInput = document.getElementById('text-input');
const sizeInput = document.getElementById('size-input');
const eccInput = document.getElementById('ecc-input');
const fgInput = document.getElementById('fg-input');
const bgInput = document.getElementById('bg-input');
const canvas = document.getElementById('qr-canvas');
const errorMsg = document.getElementById('error-msg');
const downloadBtn = document.getElementById('download-btn');

let debounceTimer = null;

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.hidden = !message;
  canvas.style.visibility = message ? 'hidden' : 'visible';
  downloadBtn.disabled = Boolean(message);
}

function drawQR(qr, size) {
  const moduleCount = qr.getModuleCount();
  const cellSize = size / moduleCount;

  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bgInput.value;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = fgInput.value;

  for (let row = 0; row < moduleCount; row += 1) {
    for (let col = 0; col < moduleCount; col += 1) {
      if (qr.isDark(row, col)) {
        const x = Math.floor(col * cellSize);
        const y = Math.floor(row * cellSize);
        const w = Math.ceil((col + 1) * cellSize) - x;
        const h = Math.ceil((row + 1) * cellSize) - y;
        ctx.fillRect(x, y, w, h);
      }
    }
  }
}

function generateQR() {
  const text = textInput.value.trim();

  if (!text) {
    showError('텍스트나 URL을 입력해 주세요.');
    return;
  }

  const size = Number(sizeInput.value);
  const ecc = eccInput.value;

  try {
    const qr = qrcode(0, ecc);
    qr.addData(text);
    qr.make();
    drawQR(qr, size);
    showError('');
  } catch (err) {
    showError('입력한 내용이 너무 길어요. 텍스트를 줄이거나 오류 정정 레벨을 낮춰보세요.');
  }
}

function scheduleGenerate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(generateQR, 200);
}

function downloadQR() {
  const link = document.createElement('a');
  link.download = 'qrcode.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

[textInput, sizeInput, eccInput, fgInput, bgInput].forEach((el) => {
  el.addEventListener('input', scheduleGenerate);
});

downloadBtn.addEventListener('click', downloadQR);

generateQR();
