function createModalWindow() {
  const backdropElement = createDomElement('div', 'modal-overlay');
  const modalBox = createDomElement('div', 'modal');
  const modalBody = createDomElement('div', 'modal-content');

  modalBox.appendChild(modalBody);
  backdropElement.appendChild(modalBox);

  let modalIsVisible = false;
  let afterCloseCallback = null;

  backdropElement.addEventListener('click', function (event) {
    if (event.target === backdropElement) {
      closeModal();
    }
  });

  function openModal(onClose) {
    afterCloseCallback = onClose || null;
    backdropElement.classList.add('is-open');
    document.body.classList.add('modal-open');
    modalIsVisible = true;
  }

  function closeModal() {
    if (!modalIsVisible) return;
    backdropElement.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    modalIsVisible = false;
    if (afterCloseCallback) {
      afterCloseCallback();
      afterCloseCallback = null;
    }
  }

  function replaceModalContent(contentNodes) {
    while (modalBody.firstChild) {
      modalBody.removeChild(modalBody.firstChild);
    }
    if (Array.isArray(contentNodes)) {
      contentNodes.forEach(function (node) {
        modalBody.appendChild(node);
      });
    } else if (contentNodes) {
      modalBody.appendChild(contentNodes);
    }
  }

  function checkIfModalOpen() {
    return modalIsVisible;
  }

  return {
    element: backdropElement,
    open: openModal,
    close: closeModal,
    setContent: replaceModalContent,
    isOpen: checkIfModalOpen,
  };
}

function closeModalsOnEscape(modalList) {
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      for (let index = 0; index < modalList.length; index++) {
        if (modalList[index].isOpen()) {
          modalList[index].close();
          break;
        }
      }
    }
  });
}
