/* ============================================================
   HARDCORE MEME GENERATOR 💀
   Web Audio API + Canvas visualizer + MediaRecorder export
   ============================================================ */

'use strict';

/* ── Dutch gabber/hardcore meme phrases ────────────────────── */
const PHRASES = [
  'HAKKUH!',
  'GABBER NOOIT KAPOT',
  'HARD BASS MAFKEES',
  'THUNDERDOME',
  'UPTEMPO OF DOOD',
  'ROTTERDAM TERROR',
  'FREESTYLE MASSACRE',
  'EEN ECHTE GABBER',
  'LINKSOM RECHTSOM',
  'HAKKE TOT JE NEKKE',
  'NEVER SURRENDER',
  'GABBA GABBA HEY',
  '175 BPM MINIMUM',
  'TERROR TERROR TERROR',
  'HARDE KICK ZACHTE ZIEL',
  'WAT ZEG JIJ TEGEN MIJ',
  'GALOP OP DE DANSVLOER',
  'DE WERELD DRAAIT DOOR',
  'VETTE KICKS',
  'NONSTOP MASSACRE',
];

/* ── Neon palette for canvas ───────────────────────────────── */
const NEONS = ['#ff0000', '#ffff00', '#00ff41', '#ff00ff', '#00ffff', '#ff6600'];

/* ── State ─────────────────────────────────────────────────── */
let audioCtx        = null;
let audioBuffer     = null;
let sourceNode      = null;
let analyserNode    = null;
let distortionNode  = null;
let bassNode        = null;
let gainNode        = null;
let isPlaying       = false;
let loopEnabled     = true;
let animFrameId     = null;

// Microphone recording state
let micStream       = null;
let micRecorder     = null;
let micChunks       = [];

/* ── DOM refs ──────────────────────────────────────────────── */
const dropZone          = document.getElementById('drop-zone');
const fileInput         = document.getElementById('file-input');
const uploadBtn         = document.getElementById('upload-btn');
const micBtn            = document.getElementById('mic-btn');
const stopBtn           = document.getElementById('stop-btn');
const recordingIndicator = document.getElementById('recording-indicator');
const controlsPanel     = document.getElementById('controls-panel');
const generateBtn       = document.getElementById('generate-btn');
const memeDisplay       = document.getElementById('meme-display');
const canvas            = document.getElementById('meme-canvas');
const ctx2d             = canvas.getContext('2d');
const playBtn           = document.getElementById('play-btn');
const loopBtn           = document.getElementById('loop-btn');
const downloadBtn       = document.getElementById('download-btn');
const resetBtn          = document.getElementById('reset-btn');
const playbackBar       = document.getElementById('playback-bar');
const progressWrap      = document.getElementById('progress-wrap');
const progressBar       = document.getElementById('progress-bar');
const progressText      = document.getElementById('progress-text');
const bpmNum            = document.getElementById('bpm-num');
const speedSlider       = document.getElementById('speed-slider');
const distSlider        = document.getElementById('dist-slider');
const bassSlider        = document.getElementById('bass-slider');
const textSpeedSlider   = document.getElementById('text-speed-slider');
const speedVal          = document.getElementById('speed-val');
const distVal           = document.getElementById('dist-val');
const bassVal           = document.getElementById('bass-val');
const textSpeedVal      = document.getElementById('text-speed-val');
const customText        = document.getElementById('custom-text');
const dlStatus          = document.getElementById('dl-status');
const dlProgressBar     = document.getElementById('dl-progress-bar');
const dlStatusText      = document.getElementById('dl-status-text');

/* ── Slider live updates ───────────────────────────────────── */
speedSlider.addEventListener('input', () => {
  const v = parseFloat(speedSlider.value);
  speedVal.textContent = v.toFixed(1) + '×';
  refreshBPM();
  if (sourceNode) sourceNode.playbackRate.value = v;
});

distSlider.addEventListener('input', () => {
  distVal.textContent = distSlider.value + '%';
  if (distortionNode) distortionNode.curve = makeDistCurve(parseInt(distSlider.value) * 4);
});

bassSlider.addEventListener('input', () => {
  const v = parseInt(bassSlider.value);
  bassVal.textContent = (v >= 0 ? '+' : '') + v + ' dB';
  if (bassNode) bassNode.gain.value = v;
});

textSpeedSlider.addEventListener('input', () => {
  textSpeedVal.textContent = parseFloat(textSpeedSlider.value).toFixed(1) + '×';
});

function refreshBPM() {
  const bpm = Math.round(175 * parseFloat(speedSlider.value));
  bpmNum.textContent = bpm;
}
refreshBPM();

/* ── Drag & Drop ───────────────────────────────────────────── */
dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('audio/')) loadFile(file);
});

uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) loadFile(fileInput.files[0]);
});

/* ── Microphone recording ──────────────────────────────────── */
micBtn.addEventListener('click', async () => {
  try {
    micStream  = await navigator.mediaDevices.getUserMedia({ audio: true });
    micChunks  = [];
    micRecorder = new MediaRecorder(micStream);

    micRecorder.ondataavailable = e => {
      if (e.data.size > 0) micChunks.push(e.data);
    };

    micRecorder.onstop = () => {
      const blob = new Blob(micChunks, { type: 'audio/webm' });
      micStream.getTracks().forEach(t => t.stop());
      loadBlob(blob);
    };

    micRecorder.start();
    recordingIndicator.classList.add('visible');
    micBtn.disabled = true;
    uploadBtn.disabled = true;
  } catch {
    alert('Microfoon toegang geweigerd! Geen mic = geen hardcore.');
  }
});

stopBtn.addEventListener('click', () => {
  if (micRecorder && micRecorder.state !== 'inactive') {
    micRecorder.stop();
    recordingIndicator.classList.remove('visible');
    micBtn.disabled  = false;
    uploadBtn.disabled = false;
  }
});

/* ── Audio loading ─────────────────────────────────────────── */
async function loadFile(file) {
  showProgress('BESTAND LADEN...');
  const buf = await file.arrayBuffer();
  decodeAudio(buf);
}

async function loadBlob(blob) {
  showProgress('OPNAME VERWERKEN...');
  const buf = await blob.arrayBuffer();
  decodeAudio(buf);
}

function decodeAudio(arrayBuffer) {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  audioCtx.decodeAudioData(
    arrayBuffer,
    decoded => {
      audioBuffer = decoded;
      hideProgress();
      dropZone.hidden  = true;
      controlsPanel.hidden = false;
    },
    () => {
      hideProgress();
      alert('Kon het audiobestand niet laden. Probeer mp3, wav of ogg.');
    }
  );
}

/* ── Distortion curve generator ────────────────────────────── */
function makeDistCurve(amount) {
  const n = 256;
  const curve = new Float32Array(n);
  const k = typeof amount === 'number' ? amount : 50;
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((3 + k) * x * 20 * (Math.PI / 180)) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

/* ── Audio graph setup ─────────────────────────────────────── */
function buildAudioGraph() {
  // Distortion (WaveShaper)
  distortionNode = audioCtx.createWaveShaper();
  distortionNode.curve = makeDistCurve(parseInt(distSlider.value) * 4);
  distortionNode.oversample = '4x';

  // Bass boost (low-shelf filter)
  bassNode = audioCtx.createBiquadFilter();
  bassNode.type = 'lowshelf';
  bassNode.frequency.value = 220;
  bassNode.gain.value = parseInt(bassSlider.value);

  // Presence boost (high-mid)
  const presenceNode = audioCtx.createBiquadFilter();
  presenceNode.type = 'peaking';
  presenceNode.frequency.value = 3500;
  presenceNode.Q.value = 1.5;
  presenceNode.gain.value = 6;

  // Master gain
  gainNode = audioCtx.createGain();
  gainNode.gain.value = 1.4;

  // Analyser for visualisation
  analyserNode = audioCtx.createAnalyser();
  analyserNode.fftSize = 2048;
  analyserNode.smoothingTimeConstant = 0.75;

  // Chain: distortion → bass → presence → gain → analyser → speakers
  distortionNode.connect(bassNode);
  bassNode.connect(presenceNode);
  presenceNode.connect(gainNode);
  gainNode.connect(analyserNode);
  analyserNode.connect(audioCtx.destination);
}

/* ── Playback ──────────────────────────────────────────────── */
function startSource() {
  if (sourceNode) {
    try { sourceNode.stop(); } catch { /* already stopped */ }
    sourceNode.disconnect();
  }

  sourceNode = audioCtx.createBufferSource();
  sourceNode.buffer       = audioBuffer;
  sourceNode.playbackRate.value = parseFloat(speedSlider.value);
  sourceNode.loop         = loopEnabled;
  sourceNode.connect(distortionNode);
  sourceNode.start();

  isPlaying = true;
  playBtn.textContent = '⏸ PAUSE';

  sourceNode.onended = () => {
    if (!loopEnabled) {
      isPlaying = false;
      playBtn.textContent = '▶ PLAY';
    }
  };
}

/* ── Generate button ───────────────────────────────────────── */
generateBtn.addEventListener('click', () => {
  if (!audioBuffer || !audioCtx) return;

  controlsPanel.hidden = true;
  memeDisplay.hidden   = false;
  playbackBar.hidden   = false;

  buildAudioGraph();
  startSource();
  startAnimation();
});

/* ── Play / Pause ──────────────────────────────────────────── */
playBtn.addEventListener('click', () => {
  if (!audioCtx) return;
  if (isPlaying) {
    audioCtx.suspend().then(() => {
      isPlaying = false;
      playBtn.textContent = '▶ PLAY';
    });
  } else {
    audioCtx.resume().then(() => {
      // If source ended (non-loop), restart it
      if (!sourceNode || sourceNode.playbackState === 3 /* FINISHED_STATE */) {
        startSource();
      }
      isPlaying = true;
      playBtn.textContent = '⏸ PAUSE';
    });
  }
});

/* ── Loop toggle ───────────────────────────────────────────── */
loopBtn.addEventListener('click', () => {
  loopEnabled = !loopEnabled;
  if (sourceNode) sourceNode.loop = loopEnabled;
  loopBtn.textContent = loopEnabled ? '🔁 LOOP: AAN' : '🔁 LOOP: UIT';
  loopBtn.classList.toggle('off', !loopEnabled);
});

/* ── Reset ─────────────────────────────────────────────────── */
resetBtn.addEventListener('click', () => {
  if (sourceNode) {
    try { sourceNode.stop(); } catch { /* ok */ }
    sourceNode = null;
  }
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  audioBuffer  = null;
  isPlaying    = false;

  memeDisplay.hidden  = true;
  playbackBar.hidden  = true;
  dlStatus.hidden     = true;
  controlsPanel.hidden = true;
  dropZone.hidden      = false;

  // Reset file input so same file can be re-selected
  fileInput.value = '';
  ctx2d.clearRect(0, 0, canvas.width, canvas.height);
});

/* ── Download as WebM video (canvas + audio, 10 seconds) ──── */
downloadBtn.addEventListener('click', () => {
  if (!canvas || !analyserNode) return;

  const chunks = [];

  // Canvas video stream
  const canvasStream = canvas.captureStream(30);

  // Audio stream from the analyser output
  const audioDestNode = audioCtx.createMediaStreamDestination();
  analyserNode.connect(audioDestNode);

  // Combine
  const combined = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...audioDestNode.stream.getAudioTracks(),
  ]);

  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
    ? 'video/webm;codecs=vp9,opus'
    : 'video/webm';

  const recorder = new MediaRecorder(combined, { mimeType });

  recorder.ondataavailable = e => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  recorder.onstop = () => {
    analyserNode.disconnect(audioDestNode);
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'hardcore-meme.webm';
    a.click();
    URL.revokeObjectURL(url);

    downloadBtn.disabled = false;
    downloadBtn.textContent = '⬇ DOWNLOAD MEME (10s)';
    dlStatus.hidden = true;
    dlProgressBar.style.width = '0%';
  };

  // Start recording
  downloadBtn.disabled = true;
  dlStatus.hidden = false;
  recorder.start(100);

  const duration = 10000; // 10 seconds
  const start    = performance.now();

  const tick = () => {
    const elapsed = performance.now() - start;
    const pct = Math.min((elapsed / duration) * 100, 100);
    dlProgressBar.style.width = pct + '%';
    dlStatusText.textContent  = `OPNEMEN... ${Math.floor(elapsed / 1000)}s / 10s`;
    if (elapsed < duration) {
      requestAnimationFrame(tick);
    } else {
      recorder.stop();
    }
  };
  requestAnimationFrame(tick);
});

/* ── Canvas animation ──────────────────────────────────────── */
function startAnimation() {
  const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
  const freqArray = new Uint8Array(analyserNode.frequencyBinCount);

  let frame        = 0;
  let phraseIdx    = 0;
  let colorIdx     = 0;
  let flashFrames  = 0;
  let currentPhrase = pickPhrase(phraseIdx);

  function draw() {
    animFrameId = requestAnimationFrame(draw);
    frame++;

    analyserNode.getByteTimeDomainData(dataArray);
    analyserNode.getByteFrequencyData(freqArray);

    const W = canvas.width;
    const H = canvas.height;
    const speedMult = parseFloat(textSpeedSlider.value);

    // Phrase change cadence: every ~90 / speedMult frames
    const phraseEvery = Math.max(20, Math.round(90 / speedMult));
    if (frame % phraseEvery === 0) {
      phraseIdx++;
      colorIdx++;
      currentPhrase = pickPhrase(phraseIdx);
    }

    // Random strobe flash
    if (frame % 20 === 0 && Math.random() < 0.25) {
      flashFrames = 2 + Math.floor(Math.random() * 3);
    }

    const neon = NEONS[colorIdx % NEONS.length];
    const neon2 = NEONS[(colorIdx + 2) % NEONS.length];

    /* ── Draw background ─────────────────────────────────── */
    if (flashFrames > 0) {
      ctx2d.fillStyle = '#ffffff';
      ctx2d.fillRect(0, 0, W, H);
      flashFrames--;
    } else {
      // Dark trail effect
      ctx2d.fillStyle = 'rgba(0,0,0,0.82)';
      ctx2d.fillRect(0, 0, W, H);
    }

    /* ── Frequency bars (background bars) ────────────────── */
    if (flashFrames === 0) {
      const barCount = 64;
      const barW = W / barCount;
      ctx2d.globalAlpha = 0.35;
      for (let i = 0; i < barCount; i++) {
        const freqVal = freqArray[Math.floor(i * freqArray.length / barCount)] / 255;
        const barH = freqVal * H * 0.9;
        const hue  = (i / barCount) * 120; // green → red
        ctx2d.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx2d.fillRect(i * barW, H - barH, barW - 1, barH);
      }
      ctx2d.globalAlpha = 1;
    }

    /* ── Waveform ─────────────────────────────────────────── */
    if (flashFrames === 0) {
      ctx2d.strokeStyle  = neon;
      ctx2d.lineWidth    = 3;
      ctx2d.shadowColor  = neon;
      ctx2d.shadowBlur   = 18;
      ctx2d.beginPath();

      const sliceW = W / dataArray.length;
      let x = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * H) / 2;
        i === 0 ? ctx2d.moveTo(x, y) : ctx2d.lineTo(x, y);
        x += sliceW;
      }
      ctx2d.lineTo(W, H / 2);
      ctx2d.stroke();
      ctx2d.shadowBlur = 0;
    }

    /* ── Scanline overlay ─────────────────────────────────── */
    ctx2d.fillStyle = 'rgba(0,0,0,0.08)';
    for (let sy = 0; sy < H; sy += 4) {
      ctx2d.fillRect(0, sy, W, 2);
    }

    /* ── Meme text ────────────────────────────────────────── */
    if (flashFrames === 0) {
      drawMemeText(currentPhrase, neon, frame);
    }

    /* ── Neon border ──────────────────────────────────────── */
    ctx2d.strokeStyle = neon2;
    ctx2d.lineWidth   = 5;
    ctx2d.shadowColor = neon2;
    ctx2d.shadowBlur  = 22;
    ctx2d.strokeRect(3, 3, W - 6, H - 6);
    ctx2d.shadowBlur  = 0;

    /* ── Update BPM badge in DOM ──────────────────────────── */
    refreshBPM();
  }

  draw();
}

/* ── Draw meme text on canvas ──────────────────────────────── */
function drawMemeText(phrase, color, frame) {
  const W = canvas.width;
  const H = canvas.height;

  // Glitch offset: random jitter 10% of the time
  const glitchX = Math.random() < 0.08 ? (Math.random() - 0.5) * 24 : 0;
  const glitchY = Math.random() < 0.08 ? (Math.random() - 0.5) * 12 : 0;

  // ── Top phrase ──────────────────────────────────────────
  const fontSize = Math.min(60, Math.max(28, Math.floor(W / (phrase.length * 0.55))));
  ctx2d.font      = `bold ${fontSize}px Impact, "Arial Black", sans-serif`;
  ctx2d.textAlign = 'center';

  // Black stroke (outline, meme style)
  ctx2d.strokeStyle = '#000000';
  ctx2d.lineWidth   = 10;
  ctx2d.lineJoin    = 'round';
  ctx2d.strokeText(phrase, W / 2 + glitchX, fontSize + 20 + glitchY);

  // Neon fill
  ctx2d.fillStyle  = color;
  ctx2d.shadowColor = color;
  ctx2d.shadowBlur  = 22;
  ctx2d.fillText(phrase, W / 2 + glitchX, fontSize + 20 + glitchY);
  ctx2d.shadowBlur  = 0;

  // ── Bottom BPM line ─────────────────────────────────────
  const bpm = Math.round(175 * parseFloat(speedSlider.value));
  const btmText = `${bpm} BPM 💀 HARDCORE`;

  ctx2d.font = 'bold 30px Impact, "Arial Black", sans-serif';
  ctx2d.strokeStyle = '#000000';
  ctx2d.lineWidth   = 8;
  ctx2d.strokeText(btmText, W / 2, H - 20);

  ctx2d.fillStyle   = '#ffff00';
  ctx2d.shadowColor = '#ffff00';
  ctx2d.shadowBlur  = 16;
  ctx2d.fillText(btmText, W / 2, H - 20);
  ctx2d.shadowBlur  = 0;

  // ── Side label (left) ────────────────────────────────────
  ctx2d.font = 'bold 14px Rajdhani, Impact, sans-serif';
  ctx2d.fillStyle = 'rgba(255,255,255,0.4)';
  ctx2d.textAlign = 'left';
  ctx2d.fillText('HARDCORE MEME GENERATOR v1.0', 10, H - 8);
  ctx2d.textAlign = 'center';
}

/* ── Pick next meme phrase ─────────────────────────────────── */
function pickPhrase(idx) {
  const custom = customText.value.trim().toUpperCase();
  // Mix in custom text 40% of the time when provided
  if (custom && Math.random() < 0.4) return custom;
  return PHRASES[idx % PHRASES.length];
}

/* ── Progress helpers ──────────────────────────────────────── */
function showProgress(msg) {
  progressWrap.hidden  = false;
  progressText.textContent = msg;
  progressBar.style.width  = '0%';

  // Animate to 90% while waiting
  let pct = 0;
  const iv = setInterval(() => {
    pct = Math.min(pct + 1.5, 90);
    progressBar.style.width = pct + '%';
    if (pct >= 90) clearInterval(iv);
  }, 50);
}

function hideProgress() {
  progressBar.style.width = '100%';
  setTimeout(() => {
    progressWrap.hidden = true;
    progressBar.style.width = '0%';
  }, 300);
}
