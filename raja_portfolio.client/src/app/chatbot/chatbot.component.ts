import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {
  isOpen = false;
  chatSound = new Audio('/sounds/chat-pop.mp3');
  @ViewChild('lastMsg') lastMsg!: ElementRef;

  messages: any[] = [
    { text: "Hi 👋 I'm Raja's assistant. Ask me anything!", type: 'bot' }
  ];

  toggleChat() {
    this.isOpen = !this.isOpen;
  }
  ngOnInit() {
    this.chatSound.volume = 0.25;
  }
  handleOption(option: string) {
    // User message
    this.messages.push({ text: option, type: 'user' });
    this.scrollToBottom();
    let response = '';

    switch(option) {
      case 'skills':
        response = 'Raja is a Full-Stack .NET developer with expertise in Angular, .NET Core, Web APIs, SQL, React, and modern UI development, along with foundational knowledge of Azure.';
        break;
      case 'projects':
        response = 'He has developed an eCommerce application, a dynamic portfolio website, and data-driven dashboards using Angular and .NET APIs.';
        break;

      case 'experience':
        response = 'He has 2+ years experience as a Full Stack .Net Developer.';
        break;

      case 'contact':
        response = 'You can use the contact form or email him directly.';
        break;
    }

    // Bot reply
    setTimeout(() => {
      this.playChatSound();
      this.scrollToBottom();
      this.messages.push({ text: response, type: 'bot' });
    }, 500);
  }
  playChatSound() {
    try {
      this.chatSound.currentTime = 0; // restart sound
      this.chatSound.play();
    } catch { }
  }
  scrollToBottom() {
    setTimeout(() => {
      this.lastMsg?.nativeElement.scrollIntoView({
        behavior: 'smooth'
      });
    }, 0);
  }
}
