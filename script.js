// PERSONALISE THESE LINES whenever you want to add names or custom messages.
const BIRTHDAY_AT = new Date('2026-11-02T00:00:00+05:30');// midnight, India Standard Time
const captions = [
  'A moment worth keeping ♡',
  'A little memory, a lot of love ✧',
  'Some days stay with us forever',
  'A smile that deserves its own celebration',
  'Here is to all the lovely chapters ahead',
  'And many more beautiful memories to come ♡'
];

const $ = (id) => document.getElementById(id);
const lockScreen = $('lockScreen'), welcomeScreen = $('welcomeScreen'), birthdayScreen = $('birthdayScreen');
const audio = $('birthdayAudio');
let audioStarted = false, slideshowTimer = null, currentSlide = 0, candleCount = 0;

function unlockIfReady() {
  const remaining = BIRTHDAY_AT.getTime() - Date.now();
  if (remaining <= 0) {
    lockScreen.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
    ['days','hours','minutes','seconds'].forEach(id => $(id).textContent = '00');
    $('lockStatus').textContent = 'Your surprise is ready ♡';
    return;
  }
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  $('days').textContent = String(days).padStart(2,'0');
  $('hours').textContent = String(hours).padStart(2,'0');
  $('minutes').textContent = String(minutes).padStart(2,'0');
  $('seconds').textContent = String(seconds).padStart(2,'0');
}
unlockIfReady();
setInterval(unlockIfReady, 1000);

function setMusicUI(playing, message='') {
  $('musicIcon').textContent = playing ? 'Ⅱ' : '♫';
  $('musicLabel').textContent = playing ? 'Pause music' : (message || 'Play music');
  $('musicToggle').setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
}
async function playMusic() {
  try {
    if (audio.readyState < 2) await new Promise((resolve,reject) => {
      const done = () => { cleanup(); resolve(); };
      const fail = () => { cleanup(); reject(new Error('Audio could not be loaded.')); };
      const cleanup = () => { audio.removeEventListener('canplay',done); audio.removeEventListener('error',fail); };
      audio.addEventListener('canplay',done,{once:true}); audio.addEventListener('error',fail,{once:true}); audio.load();
    });
    await audio.play(); audioStarted = true; setMusicUI(true);
  } catch (err) { setMusicUI(false,'Tap to retry'); console.warn('Music playback:',err); }
}
$('musicToggle').addEventListener('click', async () => { if (audio.paused) await playMusic(); else { audio.pause(); setMusicUI(false); } });
audio.addEventListener('pause', () => { if (audioStarted) setMusicUI(false,'Play music'); });
audio.addEventListener('playing', () => setMusicUI(true));
$('startButton').addEventListener('click', async () => {
  welcomeScreen.classList.add('hidden'); birthdayScreen.classList.remove('hidden');
  window.scrollTo({top:0,behavior:'smooth'}); await playMusic(); startSlideshow(); burstConfetti(100);
});

$('envelope').addEventListener('click', () => { $('envelope').classList.toggle('open'); $('envelopeHint').textContent = $('envelope').classList.contains('open') ? 'A little love, just for you ♡' : 'Tap the envelope to open your letter'; });
$('envelope').addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){e.preventDefault();$('envelope').click();} });

document.querySelectorAll('.candle').forEach(candle => candle.addEventListener('click', () => {
  if (candle.classList.contains('out')) return;
  candle.classList.add('out'); candleCount++;
  $('wishMessage').textContent = candleCount < 3 ? `${3-candleCount} little ${3-candleCount===1?'flame':'flames'} left. Keep wishing ♡` : 'Wish sent into the universe. May it find its way to you ✨';
  if (candleCount === 3) burstConfetti(65);
}));
document.querySelectorAll('.secret-note').forEach(note => note.addEventListener('click', () => note.classList.toggle('revealed')));

const photos = ['assets/photo1.jpg','assets/photo2.jpg','assets/photo3.jpg','assets/photo4.jpg','assets/photo5.jpg','assets/photo6.jpg'];
function showSlide(index) {
  const img = $('slideImage'); img.classList.add('fade');
  setTimeout(() => { img.src = photos[index]; img.onload = () => img.classList.remove('fade'); img.onerror = () => img.classList.remove('fade'); }, 450);
  $('slideCount').textContent = `${String(index+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;
  $('slideCaption').textContent = captions[index];
  const bar = $('slideProgress').firstElementChild; bar.style.transition='none';bar.style.width='0%';requestAnimationFrame(()=>{bar.style.transition='width 5s linear';bar.style.width='100%';});
}
function startSlideshow(){ if(slideshowTimer) clearInterval(slideshowTimer); showSlide(currentSlide); slideshowTimer=setInterval(()=>{currentSlide=(currentSlide+1)%photos.length;showSlide(currentSlide);},5000); }
$('fullscreenPhoto').addEventListener('click',()=>{$('modalImage').src=photos[currentSlide];$('photoModal').classList.remove('hidden');});
$('closePhoto').addEventListener('click',()=>$('photoModal').classList.add('hidden'));
$('photoModal').addEventListener('click',e=>{if(e.target===$('photoModal'))$('photoModal').classList.add('hidden');});

function burstConfetti(amount=70){const layer=$('confettiLayer');const colors=['#e9b8c8','#d9b879','#f8eee8','#bd7895','#a96b83'];for(let i=0;i<amount;i++){const piece=document.createElement('i');piece.className='confetti';piece.style.left=Math.random()*100+'%';piece.style.background=colors[Math.floor(Math.random()*colors.length)];piece.style.animationDelay=Math.random()*1.3+'s';piece.style.animationDuration=(2.5+Math.random()*2)+'s';piece.style.transform=`rotate(${Math.random()*180}deg)`;layer.appendChild(piece);setTimeout(()=>piece.remove(),5500);}}
$('celebrateButton').addEventListener('click',()=>burstConfetti(110));
$('giftBox').addEventListener('click',()=>{if($('giftBox').classList.contains('open'))return;$('giftBox').classList.add('open');$('giftHint').textContent='A wish, wrapped up just for you ♡';setTimeout(()=>$('finalMessage').classList.remove('hidden'),650);burstConfetti(90);});

// Soft floating petals, kept lightweight for phones.
for(let i=0;i<14;i++){const p=document.createElement('span');p.className='petal';p.textContent=['✧','·','✦','❀'][i%4];p.style.left=Math.random()*100+'%';p.style.animationDuration=(14+Math.random()*18)+'s';p.style.animationDelay=(-Math.random()*20)+'s';p.style.fontSize=(9+Math.random()*12)+'px';$('petalLayer').appendChild(p);}
