import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import * as Highcharts from "highcharts";

import Networkgraph from "highcharts/modules/networkgraph";
Networkgraph(Highcharts);

@Component({
  selector: "app-network-graph",
  templateUrl: "./network-graph.component.html",
  styleUrls: ["./network-graph.component.scss"],
})
export class NetworkGraphComponent implements OnChanges {
  idSelector = "network-graph-container";
  chart: any;
  @Input() options: any;
  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes.options && changes.options.firstChange) {
      this.renderChart(this.idSelector, changes.options.currentValue);
    } else if (changes.options) {
      this.redrawChart(this.chart, changes.options.currentValue);
    }
  }

  renderChart(idSelector, options) {
    this.chart = Highcharts.chart(idSelector, options);
  }

  redrawChart(chart, options) {
    console.log("redraw");
    chart.series[0].setData(options.series[0].data);
    chart.redraw();
  }
}