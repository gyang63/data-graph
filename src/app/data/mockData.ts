import { DataResponse } from '../interfaces/dataApi.interface';
import * as data from '../data/table2_pm.json';

export const mockData: DataResponse = {
  nodes: data.nodes,
  edges: data.edges
}