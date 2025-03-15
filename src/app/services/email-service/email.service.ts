import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiUrl = 'http://localhost:3000/send-email';

  constructor(private http: HttpClient) {}

  sendConfirmationEmail(
    email: string,
    subject: string,
    message: string
  ): Observable<any> {
    const emailData = { email, subject, message };
    return this.http.post(this.apiUrl, emailData);
  }
}
