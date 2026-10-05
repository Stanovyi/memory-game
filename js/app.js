(function () {
  const appRoot = createDomElement('div', 'app');

  const pageHeader = createDomElement('header', 'header');
  const gameTitle = createDomElement('h1', 'logo', 'Memory Game');
  const headerButtons = createDomElement('div', 'header-buttons');

  const newGameButton = createDomElement('button', 'btn btn-primary', 'New Game');
  newGameButton.type = 'button';
  newGameButton.setAttribute('aria-label', 'New Game');

  const leaderboardButton = createDomElement('button', 'btn btn-secondary', 'Leaderboard');
  leaderboardButton.type = 'button';
  leaderboardButton.setAttribute('aria-label', 'Leaderboard');

  headerButtons.appendChild(newGameButton);
  headerButtons.appendChild(leaderboardButton);
  pageHeader.appendChild(gameTitle);
  pageHeader.appendChild(headerButtons);

  const statsPanel = createDomElement('div', 'stats');

  const movesStatBlock = createDomElement('div', 'stat');
  const movesLabel = createDomElement('div', 'stat-label', 'Moves');
  const movesValue = createDomElement('div', 'stat-value', '0');
  movesStatBlock.appendChild(movesLabel);
  movesStatBlock.appendChild(movesValue);

  const pairsStatBlock = createDomElement('div', 'stat');
  const pairsLabel = createDomElement('div', 'stat-label', 'Pairs');
  const pairsValue = createDomElement('div', 'stat-value', '0 / 8');
  pairsStatBlock.appendChild(pairsLabel);
  pairsStatBlock.appendChild(pairsValue);

  statsPanel.appendChild(movesStatBlock);
  statsPanel.appendChild(pairsStatBlock);

  const gameBoard = createDomElement('div', 'board');

  appRoot.appendChild(pageHeader);
  appRoot.appendChild(statsPanel);
  appRoot.appendChild(gameBoard);
  document.body.appendChild(appRoot);

  const winModal = createModalWindow();
  const leaderboardModal = createModalWindow();
  document.body.appendChild(winModal.element);
  document.body.appendChild(leaderboardModal.element);
  closeModalsOnEscape([winModal, leaderboardModal]);

  let scoreAlreadySaved = false;

  function showWinModal(finalMoves) {
    if (leaderboardModal.isOpen()) {
      leaderboardModal.close();
    }

    if (!scoreAlreadySaved) {
      saveGameScore(finalMoves);
      scoreAlreadySaved = true;
    }

    const titleElement = createDomElement('h2', 'modal-title', 'You won!');
    const messageElement = createDomElement('p', 'modal-text', 'Nice job finding all the pairs.');
    const movesElement = createDomElement('p', 'modal-moves', 'Moves: ' + finalMoves);

    const actionsRow = createDomElement('div', 'modal-actions');

    const playAgainButton = createDomElement('button', 'btn btn-primary btn-modal', 'New Game');
    playAgainButton.type = 'button';
    playAgainButton.addEventListener('click', function () {
      winModal.close();
      startFreshGame();
    });

    const closeButton = createDomElement('button', 'btn btn-secondary btn-modal', 'Close');
    closeButton.type = 'button';
    closeButton.addEventListener('click', function () {
      winModal.close();
    });

    actionsRow.appendChild(playAgainButton);
    actionsRow.appendChild(closeButton);

    winModal.setContent([titleElement, messageElement, movesElement, actionsRow]);
    winModal.open();
  }

  function showLeaderboardModal() {
    const modalContent = buildLeaderboardModal(function () {
      leaderboardModal.close();
    });
    leaderboardModal.setContent(modalContent);
    leaderboardModal.open();
  }

  const memoryGame = createMemoryGame({
    boardEl: gameBoard,
    movesEl: movesValue,
    pairsEl: pairsValue,
    onWin: showWinModal,
  });

  function startFreshGame() {
    scoreAlreadySaved = false;
    if (winModal.isOpen()) {
      winModal.close();
    }
    memoryGame.startNewGame();
  }

  newGameButton.addEventListener('click', function () {
    startFreshGame();
  });

  leaderboardButton.addEventListener('click', function () {
    showLeaderboardModal();
  });

  memoryGame.startNewGame();
})();
