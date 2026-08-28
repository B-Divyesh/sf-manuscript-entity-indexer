export type EntityKind = 'person' | 'place' | 'other';

export interface ManuscriptDocument {
  id: string;
  title: string;
  path: string;
  text: string;
}

export interface Mention {
  id: string;
  documentId: string;
  documentTitle: string;
  entityId: string;
  matchedText: string;
  excerpt: string;
  position: number;
}

export interface Entity {
  id: string;
  name: string;
  kind: EntityKind;
  aliases: string[];
  mentionIds: string[];
}

export interface AliasSuggestion {
  id: string;
  sourceId: string;
  targetId: string;
  reason: string;
}

export interface TimelineEntry {
  id: string;
  documentId: string;
  documentTitle: string;
  entityIds: string[];
  marker: string;
  note: string;
  manual: boolean;
}

export interface Project {
  id: string;
  name: string;
  documents: ManuscriptDocument[];
  entities: Entity[];
  mentions: Mention[];
  suggestions: AliasSuggestion[];
  timeline: TimelineEntry[];
  updatedAt: string;
}
