const gameArea = document.getElementById('game-area');
const basket = document.getElementById('basket');
const scoreDisplay = document.getElementById('score');
const rottenDisplay = document.getElementById('rotten-count');
const gameOverScreen = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let rottenCount = 0;
let gameInterval;
let spawnInterval;
let basketPosition = gameArea.offsetWidth / 2 - 40;
const basketSpeed = 20;

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') {
    basketPosition = Math.max(0, basketPosition - basketSpeed);
  } else if (e.key === 'ArrowRight') {
    basketPosition = Math.min(gameArea.offsetWidth - basket.offsetWidth, basketPosition + basketSpeed);
  }
  basket.style.left = basketPosition + 'px';
});

gameArea.addEventListener('touchmove', e => {
  const touchX = e.touches[0].clientX - gameArea.getBoundingClientRect().left;
  basketPosition = Math.max(0, Math.min(touchX - basket.offsetWidth / 2, gameArea.offsetWidth - basket.offsetWidth));
  basket.style.left = basketPosition + 'px';
});

function createItem() {
  const item = document.createElement('div');
  item.classList.add('item');

  const types = [
    { type: 'cake', img: 'cake.png' },
    { type: 'gift', img: 'gift.png' },
    { type: 'rotten', img: 'rotten.png' }
  ];

  const random = types[Math.floor(Math.random() * types.length)];
  item.dataset.type = random.type;
  item.style.backgroundImage = `url(${random.img})`;

  const maxX = gameArea.offsetWidth - 50;
  item.style.left = Math.floor(Math.random() * maxX) + 'px';
  item.style.top = '0px';

  gameArea.appendChild(item);

  const fallSpeed = 2 + Math.random() * 3;

  function fall() {
    const currentTop = parseFloat(item.style.top);
    if (currentTop < gameArea.offsetHeight - basket.offsetHeight - 20) {
      item.style.top = currentTop + fallSpeed + 'px';
      requestAnimationFrame(fall);
    } else {
      checkCatch(item);
      gameArea.removeChild(item);
    }
  }
  fall();
}

function checkCatch(item) {
  const basketRect = basket.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();

  const overlap =
    itemRect.bottom >= basketRect.top &&
    itemRect.left < basketRect.right &&
    itemRect.right > basketRect.left;

  if (overlap) {
    if (item.dataset.type === 'rotten') {
      rottenCount++;
      rottenDisplay.textContent = rottenCount;
      if (rottenCount >= 3) {
        endGame();
      }
    } else {
      score++;
      scoreDisplay.textContent = score;
    }
  }
}

function startGame() {
  score = 0;
  rottenCount = 0;
  scoreDisplay.textContent = score;
  rottenDisplay.textContent = rottenCount;
  gameOverScreen.classList.add('hidden');
  basketPosition = gameArea.offsetWidth / 2 - 40;
  basket.style.left = basketPosition + 'px';

  spawnInterval = setInterval(createItem, 1000);
}

function endGame() {
  clearInterval(spawnInterval);
  gameOverScreen.classList.remove('hidden');
}

restartBtn.addEventListener('click', startGame);

// Start the game initially
startGame();
