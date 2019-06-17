import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  loading = new BehaviorSubject(false);
  apiUrl = environment.api;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(this.apiUrl);
  }

  post(data) {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('pcap', data.pcap);
    return this.http.post(this.apiUrl, formData);
  }

  getIps(id) {
    return this.http.get(`${this.apiUrl}/${id}/summary`);
  }

  getPacketDetail(fileId, id) {
    return this.http.get(`${this.apiUrl}/${fileId}/packet/${id}`);
  }

  getCalls(id) {
    return this.http.get(`${this.apiUrl}/${id}/calls`);
  }
  getCallDetail(fileId, id) {
    return this.http.get(`${this.apiUrl}/${fileId}/call/${id}`);
  }
}
