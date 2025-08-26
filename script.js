const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const levelButtons = document.querySelectorAll('.level-selector button');
const statusText = document.getElementById('status-text');
const audioPlayer = document.getElementById('audio-player');

// Musik controls
const playMusicBtn = document.getElementById('play-music');
const pauseMusicBtn = document.getElementById('pause-music');
const muteMusicBtn = document.getElementById('mute-music');
const volumeControl = document.getElementById('volume-control');

// Konfigurasi level (menit)
const levels = {
    level1: { study: 25, break: 5 },
    level2: { study: 45, break: 15 },
    level3: { study: 50, break: 10 }
};

let currentLevel = 'level1';
let timer;
let isStudying = true;
let timeRemaining = levels[currentLevel].study * 60;
let isRunning = false;

// Update tampilan waktu
function updateDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

// Timer mulai
function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startBtn.textContent = 'Jeda';

    timer = setInterval(() => {
        timeRemaining--;
        updateDisplay(timeRemaining);

        if (timeRemaining <= 0) {
            clearInterval(timer);
            playAlarm();
            toggleSession();
        }
    }, 1000);
}

// Jeda timer
function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = 'Lanjutkan';
}

// Ganti sesi belajar / istirahat
function toggleSession() {
    isStudying = !isStudying;
    if (isStudying) {
        timeRemaining = levels[currentLevel].study * 60;
        statusText.textContent = 'Waktunya Belajar!';
        startBtn.textContent = 'Mulai';
    } else {
        timeRemaining = levels[currentLevel].break * 60;
        statusText.textContent = 'Istirahat dulu ya! 😌';
        startBtn.textContent = 'Mulai';
    }
    updateDisplay(timeRemaining);
    isRunning = false;
}

// Reset timer
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isStudying = true;
    timeRemaining = levels[currentLevel].study * 60;
    updateDisplay(timeRemaining);
    statusText.textContent = 'Waktunya Belajar!';
    startBtn.textContent = 'Mulai';
}

// Bunyi alarm
function playAlarm() {
    audioPlayer.play();
}

// Event listener tombol
startBtn.addEventListener('click', () => {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener('click', resetTimer);

levelButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        levelButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentLevel = e.target.id;
        resetTimer();
    });
});

// Musik controls
playMusicBtn.addEventListener('click', () => {
    audioPlayer.play();
});

pauseMusicBtn.addEventListener('click', () => {
    audioPlayer.pause();
});

muteMusicBtn.addEventListener('click', () => {
    audioPlayer.muted = !audioPlayer.muted;
    muteMusicBtn.textContent = audioPlayer.muted ? "Unmute" : "Mute";
});

volumeControl.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value;
});

// Inisialisasi
updateDisplay(timeRemaining);
