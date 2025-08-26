const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const levelButtons = document.querySelectorAll('.level-selector button');
const statusText = document.getElementById('status-text');
const progressBar = document.getElementById('progress-bar');
const achievementList = document.getElementById('achievement-list');
const streakDisplay = document.getElementById('streak-display');

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
let sessionDuration = timeRemaining;

// streak & achievements
let streak = 0;
let achievements = [];

// Update tampilan waktu
function updateDisplay(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  minutesDisplay.textContent = String(minutes).padStart(2, '0');
  secondsDisplay.textContent = String(seconds).padStart(2, '0');
}

// Update progress bar
function updateProgress() {
  const progress = ((sessionDuration - timeRemaining) / sessionDuration) * 100;
  progressBar.style.width = progress + '%';
}

// Mulai timer
function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startBtn.textContent = 'Jeda';
  sessionDuration = isStudying ? levels[currentLevel].study * 60 : levels[currentLevel].break * 60;

  timer = setInterval(() => {
    timeRemaining--;
    updateDisplay(timeRemaining);
    updateProgress();

    if (timeRemaining <= 0) {
      clearInterval(timer);
      handleSessionEnd();
    }
  }, 1000);
}

// Pause timer
function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
  startBtn.textContent = 'Lanjutkan';
}

// Ganti sesi belajar/istirahat
function handleSessionEnd() {
  if (isStudying) {
    streak++;
    updateAchievements();
    notify("Istirahat dulu ya! 😌");
  } else {
    notify("Waktunya Belajar lagi! ⏰");
  }
  toggleSession();
}

// Ganti sesi
function toggleSession() {
  isStudying = !isStudying;
  if (isStudying) {
    timeRemaining = levels[currentLevel].study * 60;
    statusText.textContent = 'Waktunya Belajar!';
  } else {
    timeRemaining = levels[currentLevel].break * 60;
    statusText.textContent = 'Istirahat dulu ya! 😌';
  }
  updateDisplay(timeRemaining);
  progressBar.style.width = '0%';
  startBtn.textContent = 'Mulai';
  isRunning = false;
}

// Reset timer
function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  isStudying = true;
  timeRemaining = levels[currentLevel].study * 60;
  updateDisplay(timeRemaining);
  progressBar.style.width = '0%';
  statusText.textContent = 'Waktunya Belajar!';
  startBtn.textContent = 'Mulai';
}

// Update pencapaian
function updateAchievements() {
  achievements = [];
  if (streak >= 1) achievements.push("Selesai 1 sesi belajar 🎉");
  if (streak >= 3) achievements.push("Mantap! 3 sesi berturut-turut 💪");
  if (streak >= 5) achievements.push("🔥 Fokus Luar Biasa! 5 sesi!");
  if (streak >= 10) achievements.push("🏆 Master Fokus! 10 sesi belajar");

  achievementList.innerHTML = achievements.map(a => `<li>${a}</li>`).join('') || 
                              "<li>Belum ada pencapaian, ayo mulai belajar! 💪</li>";

  streakDisplay.textContent = `🔥 Streak: ${streak} hari`;
}

// Event listener timer
startBtn.addEventListener('click', () => {
  if (isRunning) pauseTimer(); else startTimer();
});
resetBtn.addEventListener('click', resetTimer);

levelButtons.forEach(btn => {
  btn.addEventListener('click', e => {
    levelButtons.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentLevel = e.target.id;
    resetTimer();
  });
});

// Inisialisasi
updateDisplay(timeRemaining);

// Fungsi notifikasi browser
function notify(message) {
  if (!("Notification" in window)) {
    alert(message); // fallback kalau browser tidak support
    return;
  }
  if (Notification.permission === "granted") {
    new Notification(message);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") new Notification(message);
    });
  }
}
