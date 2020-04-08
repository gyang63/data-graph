import { Injectable } from '@angular/core';
import { mockData } from '../data/mockData';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataResponse } from '../interfaces/dataApi.interface';
import { Edge } from '../models/edge';
import { Link } from '../models/link';
import { NodeMap } from '../models/node-map';
import { Node } from '../models/node';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  dataMapNodes: NodeMap;
  filteredNodes = [];

  constructor() {}

  getDataLinks() {
    return new Observable((subscriber) => {
      subscriber.next(mockData);
    }).pipe(
      map((res: DataResponse) => {
        this.dataMapNodes = this.convertNodesToMap(mockData.nodes);
        return res.edges.map((edge) => {
          return this.edgeToLink(edge, this.dataMapNodes);
        })
      })
    )
  }

  getDataLinksByLabel(label) {
    return new Observable((subscriber) => {
      subscriber.next(mockData);
    }).pipe(
      map((res: DataResponse) => {
        this.dataMapNodes = this.dataMapNodes
          ? this.dataMapNodes
          : this.convertNodesToMap(res.nodes);
        return this.searchDataLinksByLabel(label, res.edges, this.dataMapNodes).map(
          (edge) => {
            return this.edgeToLink(edge, this.dataMapNodes);
          }
        );
      })
    );
  }

  searchDataLinksByLabel(label: string, edges: Edge[], nodeMap: NodeMap) {
    const res = [];
    const edgesCopy = [...edges];
    const id = nodeMap[label];

    findNextSourceNodes(res, [id], edges);
    findNextTargetNodes(res, [id], edges);

    function findNextTargetNodes(
      res: Edge[],
      curSourceIdArray: number[],
      edges: Edge[]
    ) {
      curSourceIdArray.forEach((curSourceId) => {
        const nextSourceIdArray = edges.reduce((acc, cur) => {
          if (cur.source === curSourceId) {
            res.push(cur);
            acc.push(cur.target);
          }
          return acc;
        }, []);
        console.log("nextTarget", nextSourceIdArray);
        findNextSourceNodes(res, nextSourceIdArray, edges);
      });
    }

    function findNextSourceNodes(
      res: Edge[],
      curTargetIdArray: number[],
      edges: Edge[]
    ) {
      curTargetIdArray.forEach((curTargetId) => {
        const nextTargetIdArray = edges.reduce((acc, cur) => {
          if (cur.target === curTargetId) {
            res.push(cur);
            acc.push(cur.source);
          }
          return acc;
        }, []);
        console.log("nextTarget", nextTargetIdArray);
        findNextSourceNodes(res, nextTargetIdArray, edges);
      });
    }
    return res;
  }

  convertNodesToMap(nodes: Node[]) {
    return nodes.reduce((acc, cur) => {
      acc[cur.id] = cur.label;
      acc[cur.label] = cur.id;
      return acc;
    }, {});
  }

  edgeToLink(edge: Edge, nodeMap: NodeMap): Link {
    const from = nodeMap[edge.source];
    const to = nodeMap[edge.target];
    return new Link(from, to);
  }
}
