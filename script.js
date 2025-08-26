const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const levelButtons = document.querySelectorAll('.level-selector button');
const statusText = document.getElementById('status-text');
const progressBar = document.getElementById('progress-bar');
const bgMusic = document.getElementById('bg-music');
const achievementList = document.getElementById('achievement-list');
const streakDisplay = document.getElementById('streak-display');

// Level konfigurasi (menit)
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
let sessionDuration = timeRemaining;

let sessionsCompleted = 0;
let streak = 0;

// Fungsi display waktu
function updateDisplay(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  minutesDisplay.textContent = String(minutes).padStart(2, '0');
  secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

// Progress bar
function updateProgress() {
  const percent = ((sessionDuration - timeRemaining) / sessionDuration) * 100;
  progressBar.style.width = percent + "%";
}

// Mulai timer
function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startBtn.textContent = 'Jeda';

  sessionDuration = isStudying ? levels[currentLevel].study * 60 : levels[currentLevel].break * 60;

  // Putar musik saat mulai belajar
  if (bgMusic.paused) {
    bgMusic.play().catch(err => console.log("Autoplay dicegah:", err));
  }

  timer = setInterval(() => {
    timeRemaining--;
    updateDisplay(timeRemaining);
    updateProgress();

    if (timeRemaining <= 0) {
      clearInterval(timer);
      toggleSession();
    }
  }, 1000);
}

// Pause timer
function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
  startBtn.textContent = 'Lanjutkan';
  bgMusic.pause();
}

// Ganti sesi belajar / istirahat
function toggleSession() {
  isStudying = !isStudying;
  if (isStudying) {
    timeRemaining = levels[currentLevel].study * 60;
    statusText.textContent = 'Waktunya Belajar!';
    startBtn.textContent = 'Mulai';

    // ✅ pencapaian
    sessionsCompleted++;
    if (sessionsCompleted === 1) addAchievement("🎉 Sesi pertama berhasil!");
    if (sessionsCompleted === 5) addAchievement("⭐ Hebat! 5 sesi belajar.");
    if (sessionsCompleted === 10) addAchievement("🏆 Master! 10 sesi belajar.");

    // ✅ streak update
    streak++;
    saveStreak();
    updateStreakDisplay();

  } else {
    timeRemaining = levels[currentLevel].break * 60;
    statusText.textContent = 'Istirahat dulu ya 😌';
    startBtn.textContent = 'Mulai';
  }
  updateDisplay(timeRemaining);
  isRunning = false;
  progressBar.style.width = "0%";
}

// Reset timer
function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  isStudying = true;
  timeRemaining = levels[currentLevel].study * 60;
  sessionDuration = timeRemaining;
  updateDisplay(timeRemaining);
  progressBar.style.width = "0%";
  statusText.textContent = 'Waktunya Belajar!';
  startBtn.textContent = 'Mulai';
  bgMusic.pause();
  bgMusic.currentTime = 0;
}

// Tambah pencapaian
function addAchievement(text) {
  if (achievementList.firstElementChild && achievementList.firstElementChild.textContent.includes("Belum ada")) {
    achievementList.innerHTML = ""; // hapus default
  }
  const li = document.createElement('li');
  li.textContent = text;
  achievementList.appendChild(li);
}

// Streak
function loadStreak() {
  const savedDate = localStorage.getItem("lastStudyDate");
  const savedStreak = localStorage.getItem("streak");

  if (savedDate && savedStreak) {
    const today = new Date().toDateString();
    if (savedDate === today) {
      streak = parseInt(savedStreak);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (savedDate === yesterday.toDateString()) {
        streak = parseInt(savedStreak) + 1;
      } else {
        streak = 0;
      }
    }
  }
  updateStreakDisplay();
}

function saveStreak() {
  const today = new Date().toDateString();
  localStorage.setItem("lastStudyDate", today);
  localStorage.setItem("streak", streak);
}

function updateStreakDisplay() {
  streakDisplay.textContent = `🔥 Streak: ${streak} hari`;
}

// Event listeners
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

// Init
updateDisplay(timeRemaining);
loadStreak();
