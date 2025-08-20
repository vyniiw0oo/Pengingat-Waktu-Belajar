const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const levelButtons = document.querySelectorAll('.level-selector button');
const statusText = document.getElementById('status-text');
const audioPlayer = document.getElementById('audio-player');

// Konfigurasi level dalam menit
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

// Fungsi untuk memperbarui tampilan waktu
function updateDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

// Fungsi untuk memulai dan menghentikan timer
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

// Fungsi untuk menjeda timer
function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = 'Lanjutkan';
}

// Fungsi untuk beralih antara sesi belajar dan istirahat
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

// Fungsi untuk mengulang timer dari awal
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isStudying = true;
    timeRemaining = levels[currentLevel].study * 60;
    updateDisplay(timeRemaining);
    statusText.textContent = 'Waktunya Belajar!';
    startBtn.textContent = 'Mulai';
}

// Fungsi untuk memainkan suara alarm
function playAlarm() {
    audioPlayer.play();
}

// Event Listeners
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
        // Hapus kelas 'active' dari semua tombol
        levelButtons.forEach(btn => btn.classList.remove('active'));
        
        // Tambahkan kelas 'active' ke tombol yang diklik
        e.target.classList.add('active');
        
        currentLevel = e.target.id;
        resetTimer();
    });
});

// Inisialisasi tampilan awal
updateDisplay(timeRemaining);