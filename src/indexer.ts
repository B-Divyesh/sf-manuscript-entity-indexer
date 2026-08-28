import type { AliasSuggestion, Entity, EntityKind, ManuscriptDocument, Mention, Project, TimelineEntry } from './types';

const STOPWORDS = new Set([
  'At', 'The', 'A', 'An', 'On', 'In', 'Before', 'After', 'Three', 'Chapter', 'Use',
  'Next', 'North', 'Red', 'Blue', 'Markdown', 'DOCX', 'English'
]);
const TITLES = new Set(['captain', 'doctor', 'dr', 'professor', 'mr', 'mrs', 'ms', 'sir', 'lady']);
// Common Japanese nouns that can otherwise look like Han names before a particle.
// This is deliberately a conservative precision guard, not a language classifier.
const CJK_COMMON_NOUNS = new Set(['地図', '帳面', '時計', '鍵', '港', '文庫', '記録', '手紙', '本', '道']);
const PLACE_WORDS = /(?:Harbor|Archive|Bridge|Street|Station|Island|Mountain|River|Palace|港|駅|市|街|島|山|河|橋|文庫)$/u;
const TIME_MARKERS = /\b(?:at dusk|before dawn|next morning|after sunrise|three nights later|before midnight|that night)\b|(?:翌朝|夜明け|真夜中|三日後)/giu;

function stableId(prefix: string, value: string): string {
  let hash = 2166136261;
  for (const char of value) hash = Math.imul(hash ^ char.codePointAt(0)!, 16777619);
  return `${prefix}-${(hash >>> 0).toString(36)}`;
}

function excerptAt(text: string, position: number, length: number): string {
  const start = Math.max(0, text.lastIndexOf('\n', position - 90) + 1);
  let end = text.indexOf('\n', position + length + 110);
  if (end < 0) end = Math.min(text.length, position + length + 140);
  return text.slice(start, end).replace(/^#+\s*/gm, '').replace(/\s+/g, ' ').trim();
}

function candidateKind(name: string): EntityKind {
  if (PLACE_WORDS.test(name)) return 'place';
  if (/^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]{2,8}$/u.test(name)) return /(?:港|駅|市|街|島|山|河|橋|文庫)$/u.test(name) ? 'place' : 'person';
  if (name.split(/\s+/).length > 1 || /^(?:Captain|Doctor|Dr|Professor)\s/.test(name)) return 'person';
  return 'other';
}

export function extractCandidates(document: ManuscriptDocument): Array<{ name: string; position: number }> {
  const found = new Map<string, Set<number>>();
  const add = (name: string, position: number) => {
    const clean = name.replace(/[“”"'。、，,.!?;:]+$/u, '').trim();
    if (clean.length < 2 || STOPWORDS.has(clean) || CJK_COMMON_NOUNS.has(clean)) return;
    const positions = found.get(clean) ?? new Set<number>();
    positions.add(position);
    found.set(clean, positions);
  };

  const latin = /\b(?:Captain|Doctor|Dr|Professor|Mr|Mrs|Ms|Sir|Lady)?\s*[A-Z][\p{L}'’-]+(?:\s+[A-Z][\p{L}'’-]+){0,2}\b/gu;
  for (const match of document.text.matchAll(latin)) add(match[0], match.index ?? 0);

  const cjkNamed = /[\p{Script=Han}]{2,4}(?=(?:は|が|を|に|へ|の|と|さん|氏|先生|隊長|姐|姉))/gu;
  for (const match of document.text.matchAll(cjkNamed)) add(match[0], match.index ?? 0);
  const cjkPlaces = /[\p{Script=Han}]{1,3}(?:港|駅|市|街|島|山|河|橋|文庫)/gu;
  for (const match of document.text.matchAll(cjkPlaces)) add(match[0], match.index ?? 0);
  const kanaNamed = /[\p{Script=Hiragana}\p{Script=Katakana}ー]{2,8}(?=(?:は|が|を|に|へ|の|と|さん|氏|先生|隊長))/gu;
  for (const match of document.text.matchAll(kanaNamed)) add(match[0], match.index ?? 0);
  const hangulNamed = /[\p{Script=Hangul}]{2,6}(?=(?:이|가|은|는|을|를|에|에게|의|와|과))/gu;
  for (const match of document.text.matchAll(hangulNamed)) add(match[0], match.index ?? 0);

  return [...found.entries()].flatMap(([name, positions]) => [...positions].map(position => ({ name, position })));
}

function comparableTokens(name: string): Set<string> {
  const tokens = name.toLocaleLowerCase().split(/[\s·・]+/u).filter(token => token.length > 1 && !TITLES.has(token));
  return new Set(tokens);
}

function displayToken(name: string, normalizedToken: string): string {
  return name.split(/[\s·・]+/u).find(token => token.toLocaleLowerCase() === normalizedToken) ?? normalizedToken;
}

function suggestAliases(entities: Entity[]): AliasSuggestion[] {
  const suggestions: AliasSuggestion[] = [];
  for (let i = 0; i < entities.length; i += 1) {
    for (let j = i + 1; j < entities.length; j += 1) {
      const left = entities[i];
      const right = entities[j];
      if (left.kind === 'place' || right.kind === 'place') continue;
      const common = [...comparableTokens(left.name)].find(token => comparableTokens(right.name).has(token));
      const cjkOverlap = /^[\p{Script=Han}]+$/u.test(left.name + right.name)
        && [...left.name].some(char => right.name.includes(char));
      if (common || cjkOverlap) {
        suggestions.push({
          id: stableId('suggestion', `${left.id}:${right.id}`),
          sourceId: left.id,
          targetId: right.id,
          reason: common ? `Both names include “${displayToken(left.name, common)}”.` : 'The names share a CJK character.'
        });
      }
    }
  }
  return suggestions.slice(0, 20);
}

function timelineFromDocuments(documents: ManuscriptDocument[], mentions: Mention[]): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  for (const document of documents) {
    for (const markerMatch of document.text.matchAll(TIME_MARKERS)) {
      const position = markerMatch.index ?? 0;
      const excerpt = excerptAt(document.text, position, markerMatch[0].length);
      const related = mentions.filter(mention => mention.documentId === document.id && excerpt.includes(mention.matchedText));
      entries.push({
        id: stableId('time', `${document.id}:${position}`),
        documentId: document.id,
        documentTitle: document.title,
        entityIds: [...new Set(related.map(mention => mention.entityId))],
        marker: markerMatch[0],
        note: excerpt,
        manual: false
      });
    }
  }
  return entries;
}

export function indexDocuments(name: string, documents: ManuscriptDocument[]): Project {
  const entitiesByName = new Map<string, Entity>();
  const mentions: Mention[] = [];

  for (const document of documents) {
    for (const candidate of extractCandidates(document)) {
      const key = candidate.name.normalize('NFKC').toLocaleLowerCase();
      let entity = entitiesByName.get(key);
      if (!entity) {
        entity = {
          id: stableId('entity', key),
          name: candidate.name.normalize('NFKC'),
          kind: candidateKind(candidate.name),
          aliases: [],
          mentionIds: []
        };
        entitiesByName.set(key, entity);
      }
      const id = stableId('mention', `${document.id}:${candidate.position}:${candidate.name}`);
      entity.mentionIds.push(id);
      mentions.push({
        id,
        documentId: document.id,
        documentTitle: document.title,
        entityId: entity.id,
        matchedText: candidate.name,
        excerpt: excerptAt(document.text, candidate.position, candidate.name.length),
        position: candidate.position
      });
    }
  }

  const entities = [...entitiesByName.values()].sort((a, b) => b.mentionIds.length - a.mentionIds.length || a.name.localeCompare(b.name));
  return {
    id: stableId('project', `${name}:${documents.map(doc => doc.path).join('|')}`),
    name,
    documents,
    entities,
    mentions,
    suggestions: suggestAliases(entities),
    timeline: timelineFromDocuments(documents, mentions),
    updatedAt: new Date().toISOString()
  };
}

export function mergeEntities(project: Project, keepId: string, mergeId: string): Project {
  if (keepId === mergeId) return project;
  const keep = project.entities.find(entity => entity.id === keepId);
  const merged = project.entities.find(entity => entity.id === mergeId);
  if (!keep || !merged) return project;
  keep.aliases = [...new Set([...keep.aliases, merged.name, ...merged.aliases])];
  keep.mentionIds = [...keep.mentionIds, ...merged.mentionIds];
  project.mentions.forEach(mention => { if (mention.entityId === mergeId) mention.entityId = keepId; });
  project.timeline.forEach(entry => {
    if (entry.entityIds.includes(mergeId)) entry.entityIds = [...new Set(entry.entityIds.map(id => id === mergeId ? keepId : id))];
  });
  project.entities = project.entities.filter(entity => entity.id !== mergeId);
  project.suggestions = project.suggestions.filter(suggestion => ![keepId, mergeId].includes(suggestion.sourceId) || ![keepId, mergeId].includes(suggestion.targetId));
  project.updatedAt = new Date().toISOString();
  return project;
}

export function ignoreEntity(project: Project, entityId: string): Project {
  project.entities = project.entities.filter(entity => entity.id !== entityId);
  project.mentions = project.mentions.filter(mention => mention.entityId !== entityId);
  project.suggestions = project.suggestions.filter(suggestion => suggestion.sourceId !== entityId && suggestion.targetId !== entityId);
  project.timeline = project.timeline.map(entry => ({ ...entry, entityIds: entry.entityIds.filter(id => id !== entityId) }));
  project.updatedAt = new Date().toISOString();
  return project;
}
