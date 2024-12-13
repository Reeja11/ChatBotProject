import { Component } from '@angular/core';
import { ChatbotService } from '../services/chatbot.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatbotComponent {
  userMessage: string = '';
  messages: { text: string; isUser: boolean }[] = [];
  selectedFile?: File;

  constructor(private chatbotService: ChatbotService) {}

  // Handle sending messages
  sendMessage() {
    if (this.userMessage.trim() || this.selectedFile) {
      this.chatbotService
        .sendMessage(this.userMessage, this.selectedFile)
        .subscribe({
          next: (response: any) => {
            this.messages.push({ text: this.userMessage, isUser: true });
            this.messages.push({ text: response.response, isUser: false });
            this.userMessage = '';
            this.selectedFile = undefined;
          },
          error: (error: Error) => {
            console.error('Error sending message:', error);
          }
        });
    }
  }

  // Handle file uploads
  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }
}



