const PAIR_IMAGES = [
  { id: 'alien', emoji: '👽' },
  { id: 'rocket', emoji: '🚀' },
  { id: 'star', emoji: '⭐' },
  { id: 'crystal', emoji: '💎' },
  { id: 'orb', emoji: '🔮' },
  { id: 'invader', emoji: '👾' },
  { id: 'bolt', emoji: '⚡' },
  { id: 'moon', emoji: '🌙' },
];

const MISMATCH_HIDE_DELAY = 1000;
const PAIRS_TO_WIN = 8;

function createMemoryGame(gameOptions) {
  const gameBoard = gameOptions.boardEl;
  const movesCounterElement = gameOptions.movesEl;
  const pairsCounterElement = gameOptions.pairsEl;
  const handleGameWon = gameOptions.onWin;

  let cardDeck = [];
  let openedFirstCard = null;
  let openedSecondCard = null;
  let boardIsLocked = false;
  let movesCount = 0;
  let matchedPairsCount = 0;
  let gameIsFinished = false;
  let mismatchTimerId = null;
  let winTimerId = null;
  let cardButtons = [];

  function refreshCounters() {
    movesCounterElement.textContent = String(movesCount);
    pairsCounterElement.textContent = matchedPairsCount + ' / ' + PAIRS_TO_WIN;
  }

  function createShuffledDeck() {
    const deck = [];
    PAIR_IMAGES.forEach(function (imagePair) {
      deck.push({ typeId: imagePair.id, emoji: imagePair.emoji });
      deck.push({ typeId: imagePair.id, emoji: imagePair.emoji });
    });
    return shuffleCards(deck);
  }

  function buildCardButton(cardData, cardIndex) {
    const cardButton = createDomElement('button', 'card');
    cardButton.type = 'button';
    cardButton.setAttribute('aria-label', 'Card ' + (cardIndex + 1));
    cardButton.dataset.index = String(cardIndex);
    cardButton.dataset.type = cardData.typeId;

    const cardInner = createDomElement('div', 'card-inner');
    const cardBack = createDomElement('div', 'card-face card-back');
    const cardFront = createDomElement('div', 'card-face card-front');
    const emojiLabel = createDomElement('span', 'card-emoji', cardData.emoji);

    cardFront.appendChild(emojiLabel);
    cardInner.appendChild(cardBack);
    cardInner.appendChild(cardFront);
    cardButton.appendChild(cardInner);

    cardButton.addEventListener('click', function () {
      handleCardClick(cardButton, cardData);
    });

    return cardButton;
  }

  function drawGameBoard() {
    while (gameBoard.firstChild) {
      gameBoard.removeChild(gameBoard.firstChild);
    }
    cardButtons = [];

    cardDeck.forEach(function (cardData, cardIndex) {
      const cardButton = buildCardButton(cardData, cardIndex);
      cardButtons.push(cardButton);
      gameBoard.appendChild(cardButton);
    });
  }

  function showCardFace(cardButton) {
    cardButton.classList.add('is-flipped');
  }

  function hideCardFace(cardButton) {
    cardButton.classList.remove('is-flipped');
  }

  function handleCardClick(cardButton, cardData) {
    if (gameIsFinished) return;
    if (boardIsLocked) return;
    if (cardButton.classList.contains('is-flipped')) return;
    if (cardButton.classList.contains('is-matched')) return;

    showCardFace(cardButton);

    if (!openedFirstCard) {
      openedFirstCard = { el: cardButton, data: cardData };
      return;
    }

    openedSecondCard = { el: cardButton, data: cardData };
    movesCount = movesCount + 1;
    refreshCounters();
    boardIsLocked = true;

    compareOpenedCards();
  }

  function compareOpenedCards() {
    const cardsMatch = openedFirstCard.data.typeId === openedSecondCard.data.typeId;

    if (cardsMatch) {
      openedFirstCard.el.classList.add('is-matched');
      openedSecondCard.el.classList.add('is-matched');
      matchedPairsCount = matchedPairsCount + 1;
      refreshCounters();

      openedFirstCard = null;
      openedSecondCard = null;
      boardIsLocked = false;

      if (matchedPairsCount === PAIRS_TO_WIN) {
        gameIsFinished = true;
        const finalMoves = movesCount;
        winTimerId = setTimeout(function () {
          winTimerId = null;
          if (handleGameWon) {
            handleGameWon(finalMoves);
          }
        }, 400);
      }
    } else {
      mismatchTimerId = setTimeout(function () {
        hideCardFace(openedFirstCard.el);
        hideCardFace(openedSecondCard.el);
        openedFirstCard = null;
        openedSecondCard = null;
        boardIsLocked = false;
        mismatchTimerId = null;
      }, MISMATCH_HIDE_DELAY);
    }
  }

  function resetGame() {
    if (mismatchTimerId) {
      clearTimeout(mismatchTimerId);
      mismatchTimerId = null;
    }

    if (winTimerId) {
      clearTimeout(winTimerId);
      winTimerId = null;
    }

    openedFirstCard = null;
    openedSecondCard = null;
    boardIsLocked = false;
    movesCount = 0;
    matchedPairsCount = 0;
    gameIsFinished = false;

    cardDeck = createShuffledDeck();
    drawGameBoard();
    refreshCounters();
  }

  function getMovesCount() {
    return movesCount;
  }

  function checkGameFinished() {
    return gameIsFinished;
  }

  return {
    startNewGame: resetGame,
    getMoves: getMovesCount,
    isGameOver: checkGameFinished,
  };
}
