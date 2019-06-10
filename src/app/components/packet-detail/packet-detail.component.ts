import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { isObject } from 'util';

@Component({
  selector: 'app-packet-detail',
  templateUrl: './packet-detail.component.html',
  styleUrls: ['./packet-detail.component.scss']
})
export class PacketDetailComponent implements OnInit {
  fileId = '';
  id = '';
  detail;
  diameter: any = [];
  dst: any = [];
  src: any = [];
  sip: any = [];

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

    Object.keys(this.detail.dst).forEach(element => {
      const obj = {};
      obj['key'] = element;
      obj['value'] = this.detail.dst[element];
      this.dst.push(obj);
    });

    Object.keys(this.detail.src).forEach(element => {
      const obj = {};
      obj['key'] = element;
      obj['value'] = this.detail.src[element];
      this.src.push(obj);
    });

    this.api.loading.next(false);
  }

  getFormattedPayload(text) {
    return `<strong class="mr-2">${text.substring(0, text.indexOf(':') + 1)}</strong>${text.substring(text.indexOf(':') + 1, text.length)}`;
  }
}
