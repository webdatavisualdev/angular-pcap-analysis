import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-packet-detail',
  templateUrl: './packet-detail.component.html',
  styleUrls: ['./packet-detail.component.scss']
})
export class PacketDetailComponent implements OnInit {
  fileId = '';
  id = '';
  detail;

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
    this.detail = await this.api.getPacketDetail(this.fileId, this.id).toPromise();
    console.log(this.detail);
    this.api.loading.next(false);
  }

}
