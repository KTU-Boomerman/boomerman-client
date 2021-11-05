import Toastify from "toastify-js";

export const showNotification = (title: string, message: string) => {
  Toastify({
    text: `<b>${title}</b><br/>${message}`,
    duration: 3000,
    escapeMarkup: false,
  } as Toastify.Options).showToast();
};
