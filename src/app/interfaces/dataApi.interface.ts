import { Edge } from '../models/edge';
import { Node } from '../models/node';

export interface DataResponse {
  edges: Edge[];
  nodes: Node[];
}