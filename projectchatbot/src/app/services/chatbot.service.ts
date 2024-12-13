import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private apiUrl = 'http://localhost:3000/api/chat'; // Backend API endpoint

  constructor(private http: HttpClient) {}

  // Send a message to the backend
  sendMessage(message: string, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('message', message);

    if (file) {
      formData.append('file', file);
    }

    return this.http.post(this.apiUrl, formData);
  }
}

