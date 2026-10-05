function createDomElement(tagName, className, textContent) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (textContent !== undefined && textContent !== null) {
    element.textContent = textContent;
  }
  return element;
}

function shuffleCards(cardList) {
  const shuffledList = cardList.slice();
  for (let currentIndex = shuffledList.length - 1; currentIndex > 0; currentIndex--) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    const temporaryCard = shuffledList[currentIndex];
    shuffledList[currentIndex] = shuffledList[randomIndex];
    shuffledList[randomIndex] = temporaryCard;
  }
  return shuffledList;
}

function formatScoreDate(dateValue) {
  const day = dateValue.getDate().toString().padStart(2, '0');
  const month = (dateValue.getMonth() + 1).toString().padStart(2, '0');
  const year = dateValue.getFullYear();
  return day + '.' + month + '.' + year;
}
