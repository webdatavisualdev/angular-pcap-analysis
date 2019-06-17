import { Component, OnInit, AfterViewInit, Input, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  @Input() data;
  @Input() fileId;
  @Input() id;
  @Input() type;

  ips = [];
  packetH = 40;
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

  constructor(private router: Router) { }

  ngAfterViewInit() {
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
  }

  ngOnDestroy() {
    d3.selectAll(`#${this.id} #chart svg`).remove();
  }

  initSvg() {
    d3.selectAll(`#${this.id} #chart svg`).remove();
    this.width = d3.select(`#${this.id} .chart`).node().getBoundingClientRect().width - this.margin.left - this.margin.right;
    this.width = this.width > (this.ips.length - 1) * 200 ? this.width : (this.ips.length - 1) * 200;
    this.height = this.packetH * this.data.length;
    this.svg = d3.selectAll(`#${this.id} .chart`).append('svg')
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
      .append('text')
      .text(ip)
      .style('font-size', 14);
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
            this.ips.indexOf(d.src.ip) * this.width / (this.ips.length - 1) > 0 ||
            (typeof d.errorOccurred === 'boolean' && !d.errorOccurred)) {
            if (d.type === 'request') {
              return '#0000ff';
            }
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
        .text(this.type === 'packet' ? d.comment :
          this.type === 'call-sip' && d.type === 'request' ? d.cSeq + ' - Packet ' + d.packetId :
          this.type === 'call-sip' && d.type === 'response' ?
          d.response.status.code + ' ' + d.response.status.title + ' - Packet ' + d.packetId :
          d.resultCode.code !== -1 ? d.resultCode.code + ' ' + d.resultCode.name + ' - Packet ' + d.packetId
          : d.commandCode + ' - Packet ' + d.packetId)
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
