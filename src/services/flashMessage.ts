const FLASH_MESSAGE_KEY = "@boiaaqui:mensagem";

export function setFlashMessage(message: string) {
  sessionStorage.setItem(FLASH_MESSAGE_KEY, message);
}

export function consumeFlashMessage() {
  const message = sessionStorage.getItem(FLASH_MESSAGE_KEY);
  sessionStorage.removeItem(FLASH_MESSAGE_KEY);
  return message;
}
