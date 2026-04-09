import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PortfolioService {

  private apiUrl = '/api/portfolio';

  constructor(private http: HttpClient) {}

  sendContact(data: any) {
    return this.http.post(`${this.apiUrl}/contact`, data);
  }
  // This calls your doPost function
  logActivity(type: string) {
    // This calls your C# backend, which then calls Google Apps Script
    return this.http.post(`${this.apiUrl}/${type}`, {});
  }
  getStats() {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}
