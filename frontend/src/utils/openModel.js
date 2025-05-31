function openCloseModal(id, mode = "open") {
  const modal = document.getElementById(id);

  if (modal && mode === "open") {
    modal.showModal();
  } else if (modal && mode === "close") {
    modal.close();
  } else {
    console.warn(`Modal with ID "${id}" not found.`);
  }
}

export default openCloseModal;
