import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

const API = 'http://95.179.132.112/api/v1/pcap';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  loading = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(API);
  }

  post(data) {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('pcap', data.pcap);
    return this.http.post(API, formData);
  }

  getIps(id) {
    return this.http.get(`${API}/${id}/summary`);
  }

  getPacketDetail(fileId, id) {
    return this.http.get(`${API}/${fileId}/packet/${id}`);
  }
}
