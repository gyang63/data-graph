import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { DataService } from '../../services/data.service';
import Networkgraph from 'highcharts/modules/networkgraph';

Networkgraph(Highcharts);

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

  private _networkGraphOptions: any = {
    chart: {
      type: "networkgraph",
      height: "800px",
    },
    title: {
      text: "Node Graph",
    },
    credits: { enabled: false },
    plotOptions: {
      networkgraph: {
        keys: ["from", "to"],
        layoutAlgorithm: {
          integration: "verlet",
        },
        link: {

        },
      },
    },
    series: [
      {
        id: "graph-demo",
        marker: {
          radius: 10,
        }, enableMouseTracking: false,
        dataLabels: {
          enabled: true,
          linkFormatter(link) {
            if (this.point.fromNode.plotX > this.point.toNode.plotX) {
              return "\u2190";
            }
            return "\u2192";
          },
          allowOverlap: true,
        },
      }, 
    ],
  };

  constructor(private dataService: DataService) { }

  public get networkGraphOptions() {
    return this._networkGraphOptions;
  }

  updateNetworkGraphData(data) {
    this._networkGraphOptions.series[0].data = data;
    this._networkGraphOptions = { ...this._networkGraphOptions };
  }

  ngOnInit(): void {
    this.dataService.getDataLinks().subscribe((data) => {
      this.updateNetworkGraphData(data);
    });
  }

  searchNodeByLabel(e) {
    if (e.keyCode === 13) {
      if (!e.target.value) {
        this.dataService.getDataLinks().subscribe((data) => {
          this.updateNetworkGraphData(data);
        });
      } else {
        this.dataService
          .getDataLinksByLabel(e.target.value)
          .subscribe((data) => {
            this.updateNetworkGraphData(data);
          });
      }
    }
  }

}
