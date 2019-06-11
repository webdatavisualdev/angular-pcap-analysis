import { Component, OnInit, Input, OnChanges, AfterViewInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';


export interface PeriodicElement {
  timeStart: string;
  timeStop: string;
  initiator: string;
  from: string;
  to: string;
  packetNumbers:string;
  errorOccurred:string;
  comment:string;

}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
//   {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
//   {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
//   {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
//   {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
//   {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
//   {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
//   {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
//   {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
//   {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
//   {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
// ];

@Component({
  selector: 'app-packet-chart',
  templateUrl: './packet-chart.component.html',
  styleUrls: ['./packet-chart.component.scss']
})


export class PacketChartComponent implements AfterViewInit {
  displayedColumns: string[] = ['timeStart', 'timeStop', 'initiator', 'from', 'to', 'packetNumbers', 'errorOccurred', 'comment'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);

  // @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  svg;
  g;
  width;
  height;
  margin = {
    left: 200,
    top: 80,
    right: 100,
    bottom: 10
  };
  data;
  ips = [];
  packetH = 40;
  message = '';

  form: FormGroup;
  fileId = '';
  calls: any = [];

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
  ngOnInit() {
        // this.dataSource.paginator = this.paginator;

  }

  async ngAfterViewInit() {
    if (this.fileId) {
      this.api.loading.next(true);
      this.data = await this.api.getIps(this.fileId).toPromise();
      this.ips = [];
      this.data.forEach(d => {
        if (d.src.ip && this.ips.indexOf(d.src.ip) < 0) {
          this.ips.push(d.src.ip);
        }
        if (d.dst.ip && this.ips.indexOf(d.dst.ip) < 0) {
          this.ips.push(d.dst.ip);
        }
      });
      this.initSvg();
      this.drawIps();
      this.drawChart();
      this.calls = await this.api.getCalls(this.fileId).toPromise();
      console.log('--=-=-=-=-=-=-=-=-=-=-=-')
      console.log(this.calls);
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.calls);
      this.api.loading.next(false);
    }
  }

  async submit() {
    if (this.form.invalid) {
      return;
    }
    this.api.loading.next(true);
    this.fileId = (await this.api.post(this.form.value).toPromise())['fileId'];
    this.data = await this.api.getIps(this.fileId).toPromise();
    this.ips = [];
    this.data.forEach(d => {
      if (d.src.ip && this.ips.indexOf(d.src.ip) < 0) {
        this.ips.push(d.src.ip);
      }
      if (d.dst.ip && this.ips.indexOf(d.dst.ip) < 0) {
        this.ips.push(d.dst.ip);
      }
    });

    this.initSvg();
    this.drawIps();
    this.drawChart();
    this.form.patchValue({title: '', pcap: null});
    this.calls = await this.api.getCalls(this.fileId).toPromise();
    this.api.loading.next(false);
  }

  onChangeFile(event) {
    if (event.target.files.length > 0) {
      this.form.get('pcap').setValue(event.target.files[0]);
    }
  }

  getCallDetails(cid){
    console.log('cid')
    console.log('cid.type')
    console.log(cid.type)
    console.log(cid)


    if(cid.type == 'click'){
      console.log('you are click on row')
      this.router.navigate(['/calls/' + this.fileId, cid.row.id]);
    }

  }

  initSvg() {
    d3.selectAll('#chart svg').remove();
    this.width = d3.select('#chart').node().getBoundingClientRect().width - this.margin.left - this.margin.right;
    this.width = this.width > (this.ips.length - 1) * 200 ? this.width : (this.ips.length - 1) * 200;
    this.height = this.packetH * this.data.length;
    this.svg = d3.selectAll('#chart').append('svg')
    .attr('width', this.width + this.margin.left + this.margin.right)
    .attr('height', this.height + this.margin.top + this.margin.bottom);
    this.g = this.svg.append('g')
    .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    this.g.append('svg:defs').append('svg:marker')
    .attr('id', 'triangle')
    .attr('refX', 1.5)
    .attr('refY', 1.5)
    .attr('markerWidth', 7.5)
    .attr('markerHeight', 7.5)
    .attr('orient', 'auto')
    .append('path')
    // .attr('d', 'M 0 0 10 6 0 12 3 6')
    .attr('d', 'M 0 0 2.5 1.5 0 3 0.75 1.5')
    .style('fill', '#333');
  }

  drawIps() {
    this.ips.forEach((ip, index) => {
      this.g.append('line')
      .attr('x1', index * this.width / (this.ips.length - 1))
      .attr('x2', index * this.width / (this.ips.length - 1))
      .attr('y1', 0)
      .attr('y2', this.height)
      .attr('stroke-width', 3)
      .attr('stroke', '#444');
      this.g.append('g')
      .attr('transform', `translate(${index * this.width / (this.ips.length - 1) - 40}, ${-20})`)
      // .attr('transform', `translate(${index * this.width / (this.ips.length - 1) - 30}, ${-5})`)
      .append('text')
      .text(ip)
      .style('font-size', 14);
      // .attr('transform', 'rotate(310)');
    });
  }

  drawChart() {
    this.data.forEach((d, index) => {
      if (d.src.ip && d.dst.ip) {
        this.g.append('line')
        .attr('x1', () => {
          return this.ips.indexOf(d.src.ip) * this.width / (this.ips.length - 1);
        })
        .attr('x2', () => {
          const delta = (this.ips.indexOf(d.dst.ip) * this.width / (this.ips.length - 1)
            - this.ips.indexOf(d.src.ip) * this.width / (this.ips.length - 1)) > 0 ? -7 : 7;
          return this.ips.indexOf(d.dst.ip) * this.width / (this.ips.length - 1) + delta;
        })
        .attr('y1', (index * this.packetH) + 15)
        .attr('y2', (index * this.packetH) + 15)
        .attr('stroke-width', 7)
        .attr('stroke', () => {
          if (this.ips.indexOf(d.dst.ip) * this.width / (this.ips.length - 1) -
          this.ips.indexOf(d.src.ip) * this.width / (this.ips.length - 1) > 0) {
            return '#00ff00';
          } else {
            return '#ff0000';
          }
        })
        .attr('marker-end', 'url(#triangle)')
        .style('cursor', 'pointer')
        .on('click', () => {
          this.router.navigate([this.fileId, d.packetId]);
        });
        this.g.append('text')
        .text(d.comment)
        .attr('x', () => {
          const src = this.ips.indexOf(d.src.ip) * this.width / (this.ips.length - 1);
          const dst = this.ips.indexOf(d.dst.ip) * this.width / (this.ips.length - 1);
          return src > dst ? dst + 5 : src + 5;
        })
        .attr('y', (index * this.packetH) + 5)
        .attr('stroke', '#3f51b5')
        .style('cursor', 'pointer')
        .on('click', () => {
          this.router.navigate([this.fileId, d.packetId]);
        });
      }
      this.g.append('text')
      .text(`${new Date(d.time).toISOString()}`)
      .attr('x', -this.margin.left + 10)
      .attr('y', (index * this.packetH) + 20);
    });
  }
}
