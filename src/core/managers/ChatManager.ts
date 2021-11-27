import { inject, singleton } from 'tsyringe';
import Server from '../Server';

type Message = {
  name: string;
  message: string;
};

@singleton()
export class ChatManager {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  messages = document.querySelector('.messages')!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  messageInput = document.querySelector('#message')! as HTMLInputElement;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  messageForm = document.querySelector('#message-form')! as HTMLFormElement;

  constructor(@inject('Server') private server: Server) {
    if (this.messages == null) {
      throw new Error('Messages not found');
    }
    if (this.messageInput == null) {
      throw new Error('Message input not found');
    }
    if (this.messageForm == null) {
      throw new Error('Send button not found');
    }

    this.messageForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const message = this.messageInput.value;
      if (message == null || message === '') return;
      this.server.invoke('SendMessage', message);
      this.messageInput.value = '';
    });
  }

  onMessage(message: Message) {
    this.render(message);
  }

  render(message: Message) {
    if (this.messages == null) return;

    const newMessage = document.createElement('div');
    newMessage.innerHTML = `
			<div class="message">
				<div class="message-user">${message.name}</div>
				<div class="message-text">${message.message}</div>
			</div>
		`;
    this.messages.appendChild(newMessage);
    this.messages.scrollTop = this.messages.scrollHeight;
  }
}
