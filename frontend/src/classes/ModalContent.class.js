class ModalContent {
  constructor({
    id = "custom_modal",
    title = "Default Title",
    body = "Default body",
    cancelText = "Cancel",
    confirmText = "Confirm",
    onCancel = () => {},
    onConfirm = () => {},
  } = {}) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.cancelText = cancelText;
    this.confirmText = confirmText;
    this.onCancel = onCancel;
    this.onConfirm = onConfirm;
  }
}

export { ModalContent };
