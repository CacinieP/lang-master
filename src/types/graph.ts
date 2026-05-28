export type EdgeType = 'prerequisite' | 'related' | 'contrast' | 'compose';

export interface GraphEdge {
  from: string;
  to: string;
  type: EdgeType;
  strength: number;
}

export interface ConceptGraph {
  edges: GraphEdge[];
}
