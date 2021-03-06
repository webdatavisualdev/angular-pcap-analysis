import { Component, OnInit, Input, OnChanges, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';


export interface PeriodicElement {
  timeStart: string;
  timeStop: string;
  initiator: string;
  from: string;
  to: string;
  packetNumbers: string;
  errorOccurred: string;
  comment: string;

}

@Component({
  selector: 'app-packet-chart',
  templateUrl: './packet-chart.component.html',
  styleUrls: ['./packet-chart.component.scss']
})


export class PacketChartComponent implements AfterViewInit {
  displayedColumns: string[] = ['timeStart', 'timeStop', 'initiator', 'from', 'to', 'packetNumbers', 'errorOccurred', 'comment'];
  data;
  form: FormGroup;
  fileId = '';
  file: any;
  calls: any = [];
  diametersSummary: any;

  constructor(
    private router: Router,
    private api: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute) {
    this.form = fb.group({
      title: ['', Validators.required],
      pcap: [null, Validators.required]
    });
    this.route.params.subscribe(res => {
      this.fileId = res.fileId;
    });
  }

  async ngAfterViewInit() {
    if (this.fileId) {
      if (localStorage.getItem('file')) {
        this.file = JSON.parse(localStorage.getItem('file'));
      }
      this.api.loading.next(true);
      this.calls = await this.api.getCalls(this.fileId).toPromise();
      this.data = await this.api.getIps(this.fileId).toPromise();
      this.api.loading.next(false);
    }
  }

  async submit() {
    if (this.form.invalid) {
      return;
    }
    this.data = [];
    this.calls = {};
    this.api.loading.next(true);
    this.file = await this.api.post(this.form.value).toPromise();
    localStorage.setItem('file', JSON.stringify(this.file));
    this.fileId = this.file.fileId;
    this.calls = await this.api.getCalls(this.fileId).toPromise();
    this.data = await this.api.getIps(this.fileId).toPromise();
    this.form.patchValue({title: '', pcap: null});
    this.api.loading.next(false);
  }

  onChangeFile(event) {
    if (event.target.files.length > 0) {
      this.form.get('pcap').setValue(event.target.files[0]);
    }
  }

  getCallDetails(cid) {
    if (cid.type === 'click') {
      this.router.navigate(['/calls/' + this.fileId, cid.row.id]);
    }
  }
}
