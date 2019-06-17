import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-call-detail',
  templateUrl: './call-detail.component.html',
  styleUrls: ['./call-detail.component.scss']
})
export class CallDetailComponent implements OnInit {
  fileId = '';
  id = '';
  detail;
  showDiameter = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(res => {
      this.fileId = res.fileId;
      this.id = res.id;
    });
  }

  async ngOnInit() {
    this.api.loading.next(true);
    this.detail = await this.api.getCallDetail(this.fileId, this.id).toPromise();
    this.api.loading.next(false);
  }
}
