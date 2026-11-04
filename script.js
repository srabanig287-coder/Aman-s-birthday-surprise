
/* =========================================
   A LITTLE BIRTHDAY UNIVERSE
   Birthday: 29 November 2026
   ========================================= */

// TEST MODE: true = unlock immediately for preview.
// Before sharing the website, change this to false.
const TEST_MODE = true;

const TEST_UNLOCK_AT = new Date('2026-11-04T00:00:00+05:30');
const REAL_BIRTHDAY_AT = new Date('2026-11-29T00:00:00+05:30');

const $ = (id) => document.getElementById(id);

const lockScreen = $('lockScreen');
const welcomeScreen = $('welcomeScreen');
const birthdayScreen = $('birthdayScreen');
const birthdayAudio = $('birthdayAudio');

let countdownTimer = null;
let slideshowTimer = null;
let currentSlide = 0;
let candlesBlown = 0;
let musicPlaying = false;
let giftOpened = false;
let envelopeOpened = false;

const photos = [
  'assets/photo1.jpg',
  'assets/photo2.jpg',
  'assets/photo3.jpg',
  'assets/photo4.jpg',
  'assets/photo5.jpg',
  'assets/photo6.jpg'
];

const captions = [
  'A moment worth keeping ♡',
  'A little memory, a lot of meaning.',
  'Some moments stay forever.',
  'A chapter full of possibilities.',
  'Here is to all the beautiful days.',
  'And many more memories to come ♡'
];

/* =========================================
   COUNTDOWN AND UNLOCK
   ========================================= */

function updateCountdown() {
  const now = new Date();
  const difference = REAL_BIRTHDAY_AT - now;

  if (difference <= 0) {
    showWelcome();
    return;
  }

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference % 86400000) / 3600000);
  const minutes = Math.floor((difference % 3600000) / 60000);
  const seconds = Math.floor((difference % 60000) / 1000);

  $('days').textContent = String(days).padStart(2, '0');
  $('hours').textContent = String(hours).padStart(2, '0');
  $('minutes').textContent = String(minutes).padStart(2, '0');
  $('seconds').textContent = String(seconds).padStart(2, '0');
}

function showWelcome() {
  clearInterval(countdownTimer);

  lockScreen.classList.add('hidden');
  welcomeScreen.classList.remove('hidden');
  birthdayScreen.classList.add('hidden');
}

function showBirthday() {
  welcomeScreen.classList.add('hidden');
  lockScreen.classList.add('hidden');
  birthdayScreen.classList.remove('hidden');

  startPetals();
  startSlideshow();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initializeWebsite() {
  if (TEST_MODE || new Date() >= REAL_BIRTHDAY_AT) {
    showWelcome();
    return;
  }

  lockScreen.classList.remove('hidden');
  welcomeScreen.classList.add('hidden');
  birthdayScreen.classList.add('hidden');

  updateCountdown();
  countdownTimer = setInterval(updateCountdown, 1000);
}

initializeWebsite();

/* =========================================
   OPEN THE SURPRISE
   ========================================= */

$('startButton').addEventListener('click', async () => {
  showBirthday();

  // Browsers allow audio playback after a user gesture.
  try {
    await birthdayAudio.play();
    musicPlaying = true;
    updateMusicButton();
  } catch (error) {
    musicPlaying = false;
    updateMusicButton();
  }

  launchConfetti();
});

/* =========================================
   MUSIC PLAY / PAUSE
   ========================================= */

function updateMusicButton() {
  $('musicIcon').textContent = musicPlaying ? 'Ⅱ' : '♪';
  $('musicLabel').textContent = musicPlaying ? 'Pause music' : 'Play music';
  $('musicToggle').setAttribute(
    'aria-label',
    musicPlaying ? 'Pause music' : 'Play music'
  );
}

$('musicToggle').addEventListener('click', async () => {
  if (musicPlaying) {
    birthdayAudio.pause();
    musicPlaying = false;
  } else {
    try {
      await birthdayAudio.play();
      musicPlaying = true;
    } catch (error) {
      musicPlaying = false;
    }
  }

  updateMusicButton();
});

birthdayAudio.addEventListener('pause', () => {
  musicPlaying = false;
  updateMusicButton();
});

birthdayAudio.addEventListener('play', () => {
  musicPlaying = true;
  updateMusicButton();
});

/* =========================================
   INTERACTIVE LETTER
   ========================================= */

$('envelope').addEventListener('click', () => {
  const envelope = $('envelope');

  if (envelopeOpened) return;

  envelopeOpened = true;
  envelope.classList.add('open');
  envelope.setAttribute('aria-expanded', 'true');

  $('envelopeHint').textContent =
    'A little note, written with love ♡';

  launchConfetti(18);
});

/* =========================================
   BLOW OUT THE CANDLES
   ========================================= */

document.querySelectorAll('.candle').forEach((candle) => {
  candle.addEventListener('click', () => {
    if (candle.classList.contains('blown')) return;

    candle.classList.add('blown');
    candlesBlown++;

    const messages = [
      'One wish has been set free. ✨',
      'Two wishes are on their way. ♡',
      'All three candles are out. Make your biggest wish! ✨'
    ];

    $('wishMessage').textContent = messages[candlesBlown - 1];

    if (candlesBlown === 3) {
      launchConfetti(45);
    }
  });
});

/* =========================================
   SECRET NOTES
   ========================================= */

document.querySelectorAll('.secret-note').forEach((note) => {
  note.addEventListener('click', () => {
    note.classList.toggle('revealed');

    const strong = note.querySelector('strong');

    if (note.classList.contains('revealed')) {
      note.dataset.originalText = strong.textContent;
      note.querySelector('small').textContent = 'A LITTLE REMINDER FOR YOU ♡';
      launchConfetti(8);
    } else {
      note.querySelector('small').textContent = [
        'OPEN WHEN YOU NEED A SMILE',
        'OPEN WHEN YOU DOUBT YOURSELF',
        'OPEN BEFORE YOU SLEEP'
      ][Array.from(note.parentElement.children).indexOf(note)];
    }
  });
});

/* =========================================
   PHOTO SLIDESHOW
   ========================================= */

function showSlide(index) {
  currentSlide = (index + photos.length) % photos.length;

  const image = $('slideImage');
  image.style.opacity = '0';

  setTimeout(() => {
    image.src = photos[currentSlide];

    image.onload = () => {
      image.style.opacity = '1';
    };

    image.onerror = () => {
      image.style.opacity = '1';
      image.alt = 'Photo unavailable. Check the assets folder.';
    };

    $('slideCount').textContent =
      String(currentSlide + 1).padStart(2, '0') +
      ' / ' +
      String(photos.length).padStart(2, '0');

    $('slideCaption').textContent = captions[currentSlide];
    $('slideProgress').style.width =
      ((currentSlide + 1) / photos.length) * 100 + '%';
  }, 250);
}

function startSlideshow() {
  clearInterval(slideshowTimer);

  showSlide(currentSlide);

  slideshowTimer = setInterval(() => {
    showSlide(currentSlide + 1);
  }, 4500);
}

/* =========================================
   ENLARGED PHOTO
   ========================================= */

$('expandPhoto').addEventListener('click', () => {
  const image = $('slideImage');

  $('modalImage').src = image.src;
  $('photoModal').classList.remove('hidden');
});

function closePhotoModal() {
  $('photoModal').classList.add('hidden');
}

$('closePhoto').addEventListener('click', closePhotoModal);

$('photoModal').addEventListener('click', (event) => {
  if (event.target === $('photoModal')) {
    closePhotoModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closePhotoModal();
  }
});

/* =========================================
   GIFT BOX
   ========================================= */

$('giftBox').addEventListener('click', () => {
  if (giftOpened) return;

  giftOpened = true;

  $('giftBox').classList.add('open');

  $('giftHint').textContent = 'A little something, just for you ♡';

  setTimeout(() => {
    $('finalMessage').classList.remove('hidden');
    launchConfetti(65);
  }, 700);
});

/* =========================================
   CELEBRATION BUTTON
   ========================================= */

$('celebrateButton').addEventListener('click', () => {
  launchConfetti(65);
  startPetals();
});

/* =========================================
   CONFETTI EFFECT
   ========================================= */

function launchConfetti(amount = 35) {
  const layer = $('confettiLayer');

  for (let i = 0; i < amount; i++) {
    const piece = document.createElement('span');

    piece.className = 'confetti';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.animationDuration = (3 + Math.random() * 3) + 's';
    piece.style.animationDelay = Math.random() * 0.8 + 's';
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;

    layer.appendChild(piece);

    setTimeout(() => piece.remove(), 7000);
  }
}

/* =========================================
   FLOATING PETALS
   ========================================= */

let petalInterval = null;

function startPetals() {
  if (petalInterval) return;

  const layer = $('petalLayer');
  const symbols = ['✿', '❀', '✧', '♡'];

  petalInterval = setInterval(() => {
    const petal = document.createElement('span');

    petal.className = 'petal';
    petal.textContent = symbols[
      Math.floor(Math.random() * symbols.length)
    ];

    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.fontSize = (12 + Math.random() * 13) + 'px';
    petal.style.animationDuration = (7 + Math.random() * 7) + 's';

    layer.appendChild(petal);

    setTimeout(() => petal.remove(), 15000);
  }, 700);
}

/* =========================================
   REPLAY
   ========================================= */

$('replayButton').addEventListener('click', () => {
  // Reset interactive elements.
  envelopeOpened = false;
  candlesBlown = 0;
  giftOpened = false;
  currentSlide = 0;

  $('envelope').classList.remove('open');
  $('envelope').setAttribute('aria-expanded', 'false');
  $('envelopeHint').textContent = 'Tap the envelope to open your letter';

  document.querySelectorAll('.candle').forEach((candle) => {
    candle.classList.remove('blown');
  });

  $('wishMessage').textContent =
    'Three chances to wish for something beautiful.';

  $('giftBox').classList.remove('open');
  $('giftHint').textContent = 'Tap to open your gift';
  $('finalMessage').classList.add('hidden');

  document.querySelectorAll('.secret-note').forEach((note, index) => {
    note.classList.remove('revealed');

    note.querySelector('small').textContent = [
      'OPEN WHEN YOU NEED A SMILE',
      'OPEN WHEN YOU DOUBT YOURSELF',
      'OPEN BEFORE YOU SLEEP'
    ][index];
  });

  showSlide(0);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  launchConfetti(55);
});

/* =========================================
   INITIAL BUTTON STATE
   ========================================= */

updateMusicButton();
