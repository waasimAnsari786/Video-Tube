function openCloseModal(id, mode = "open") {
  const modal = document.getElementById(id);

  if (modal) {
    mode === "open"
      ? modal.showModal()
      : mode === "close"
      ? modal.close()
      : console.warn(`Provided mode ${mode} isn't valid`);
  } else {
    console.warn(`Modal with ID "${id}" not found.`);
  }
}

export default openCloseModal;
