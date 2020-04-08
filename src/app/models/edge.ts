export class Edge {
  data: {foreignKeyRefs: {id: number, name: string, from: string, to: string}[]};
  label: string;
  source: number;
  target: number;
  id: string;
}
