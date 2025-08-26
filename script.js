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

const levels = {
  level1:{study:25,break:5},
  level2:{study:45,break:15},
  level3:{study:50,break:10}
};
let currentLevel='level1', timer, isStudying=true, timeRemaining=levels[currentLevel].study*60;
let sessionDuration=timeRemaining, isRunning=false, sessionsCompleted=0, streak=0;

function updateDisplay(t){
  const m=String(Math.floor(t/60)).padStart(2,'0'), s=String(t%60).padStart(2,'0');
  minutesDisplay.textContent=m; secondsDisplay.textContent=s;
}

function updateProgress(){
  const pct=((sessionDuration-timeRemaining)/sessionDuration)*100;
  progressBar.style.width=pct+'%';
}

function startTimer(){
  if(isRunning) return;
  isRunning=true;
  startBtn.textContent='Jeda';
  sessionDuration=isStudying?levels[currentLevel].study*60:levels[currentLevel].break*60;
  bgMusic.play().catch(_=>{});
  timer=setInterval(()=>{
    timeRemaining--;
    updateDisplay(timeRemaining);
    updateProgress();
    if(timeRemaining<=0){
      clearInterval(timer);
      toggleSession();
    }
  },1000);
}

function pauseTimer(){
  clearInterval(timer);
  isRunning=false;
  startBtn.textContent='Lanjutkan';
  bgMusic.pause();
}

function resetTimer(){
  clearInterval(timer);
  isRunning=false; isStudying=true;
  timeRemaining=levels[currentLevel].study*60; sessionDuration=timeRemaining;
  updateDisplay(timeRemaining);
  progressBar.style.width='0%';
  statusText.textContent='Waktunya Belajar!';
  startBtn.textContent='Mulai';
  bgMusic.pause(); bgMusic.currentTime=0;
}

function toggleSession(){
  isStudying=!isStudying;
  if(isStudying){
    timeRemaining=levels[currentLevel].study*60;
    statusText.textContent='Waktunya Belajar!';
    startBtn.textContent='Mulai';
    sessionsCompleted++;
    if(sessionsCompleted===1) addAchievement('🎉 Sesi pertama!');
    if(sessionsCompleted===5) addAchievement('⭐ 5 sesi konsisten!');
    if(sessionsCompleted===10) addAchievement('🏆 10 sesi capai!');
    streak++; saveStreak(); updateStreakDisplay();
  } else {
    timeRemaining=levels[currentLevel].break*60;
    statusText.textContent='Istirahat ya 😌';
    startBtn.textContent='Mulai';
  }
  updateDisplay(timeRemaining);
  isRunning=false; progressBar.style.width='0%';
}

function addAchievement(text){
  if(achievementList.firstElementChild?.textContent.includes('Belum')) achievementList.innerHTML='';
  const li=document.createElement('li'); li.textContent=text; achievementList.appendChild(li);
}

function loadStreak(){
  const sd=localStorage.getItem('lastStudyDate'), ss=localStorage.getItem('streak');
  if(sd && ss){
    const today=(new Date()).toDateString(), yesterday=(new Date(Date.now()-864e5)).toDateString();
    if(sd===today) streak=parseInt(ss);
    else if(sd===yesterday) streak=parseInt(ss)+1;
    else streak=0;
  }
  updateStreakDisplay();
}

function saveStreak(){
  localStorage.setItem('lastStudyDate',(new Date()).toDateString());
  localStorage.setItem('streak',streak);
}

function updateStreakDisplay(){
  streakDisplay.textContent=`🔥 Streak: ${streak} hari`;
}

startBtn.addEventListener('click',()=> isRunning?pauseTimer():startTimer());
resetBtn.addEventListener('click',resetTimer);
levelButtons.forEach(btn=>{
  btn.addEventListener('click',e=>{
    levelButtons.forEach(b=>b.classList.remove('active'));
    e.target.classList.add('active');
    currentLevel=e.target.id; resetTimer();
  });
});

updateDisplay(timeRemaining); loadStreak();
