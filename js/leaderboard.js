const STORAGE_KEY = 'memoryGameLeaderboard';
const TOP_SCORES_LIMIT = 10;

function loadSavedScores() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return [];
    const parsedScores = JSON.parse(rawData);
    if (!Array.isArray(parsedScores)) return [];
    return parsedScores;
  } catch (error) {
    return [];
  }
}

function saveScoresToStorage(scoreList) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scoreList));
}

function saveGameScore(movesCount) {
  const scoreList = loadSavedScores();
  const newScore = {
    moves: movesCount,
    date: formatScoreDate(new Date()),
    timestamp: Date.now(),
  };

  scoreList.push(newScore);

  scoreList.sort(function (firstScore, secondScore) {
    if (firstScore.moves !== secondScore.moves) {
      return firstScore.moves - secondScore.moves;
    }
    return firstScore.timestamp - secondScore.timestamp;
  });

  const topScores = scoreList.slice(0, TOP_SCORES_LIMIT);
  saveScoresToStorage(topScores);
  return topScores;
}

function buildLeaderboardModal(onCloseClick) {
  const contentNodes = [];

  const titleElement = createDomElement('h2', 'modal-title', 'Leaderboard');
  contentNodes.push(titleElement);

  const savedScores = loadSavedScores();

  if (savedScores.length === 0) {
    const emptyMessage = createDomElement('p', 'modal-empty', 'No results yet');
    contentNodes.push(emptyMessage);
  } else {
    const scoresTable = createDomElement('table', 'leaderboard-table');
    const tableHead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const columnTitles = ['#', 'Moves', 'Date'];
    columnTitles.forEach(function (titleText) {
      const headerCell = createDomElement('th', null, titleText);
      headerRow.appendChild(headerCell);
    });
    tableHead.appendChild(headerRow);
    scoresTable.appendChild(tableHead);

    const tableBody = document.createElement('tbody');
    savedScores.forEach(function (scoreItem, scoreIndex) {
      const scoreRow = document.createElement('tr');

      const placeCell = createDomElement('td', null, String(scoreIndex + 1));
      const movesCell = createDomElement('td', null, String(scoreItem.moves));
      const dateCell = createDomElement('td', null, scoreItem.date);

      scoreRow.appendChild(placeCell);
      scoreRow.appendChild(movesCell);
      scoreRow.appendChild(dateCell);
      tableBody.appendChild(scoreRow);
    });
    scoresTable.appendChild(tableBody);
    contentNodes.push(scoresTable);
  }

  const actionsRow = createDomElement('div', 'modal-actions');
  const closeButton = createDomElement('button', 'btn btn-secondary btn-modal', 'Close');
  closeButton.type = 'button';
  closeButton.addEventListener('click', onCloseClick);
  actionsRow.appendChild(closeButton);
  contentNodes.push(actionsRow);

  return contentNodes;
}
