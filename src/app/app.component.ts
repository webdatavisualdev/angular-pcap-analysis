import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading;

  constructor(private api: ApiService) {
  }

  ngOnInit() {
    this.api.loading.subscribe(res => {
      this.loading = res;
    });
  }
}
