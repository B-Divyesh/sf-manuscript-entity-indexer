import { describe, expect, it } from 'vitest';
import { extractCandidates, indexDocuments, mergeEntities } from '../src/indexer';
import { sampleDocuments } from '../src/sample';

describe('lightweight manuscript indexer', () => {
  it('finds recurring Latin and CJK candidates', () => {
    const project = indexDocuments('Sample', structuredClone(sampleDocuments));
    expect(project.entities.find(entity => entity.name === 'Mara Venn')?.mentionIds.length).toBeGreaterThanOrEqual(3);
    expect(project.entities.some(entity => entity.name === '林梅')).toBe(true);
    expect(project.entities.some(entity => entity.name === '白港' && entity.kind === 'place')).toBe(true);
  });

  it('normalizes Unicode without changing source text', () => {
    const document = { id: 'u', title: 'Unicode', path: 'u.md', text: 'Ａｎａ Vale met Ana Vale at River Station.' };
    const source = document.text;
    const candidates = extractCandidates(document);
    expect(candidates.some(candidate => candidate.name === 'Ana Vale')).toBe(true);
    indexDocuments('Unicode', [document]);
    expect(document.text).toBe(source);
  });

  it('merges aliases and reassigns their mentions', () => {
    const project = indexDocuments('Sample', structuredClone(sampleDocuments));
    const mara = project.entities.find(entity => entity.name === 'Mara Venn')!;
    const captain = project.entities.find(entity => entity.name === 'Captain Venn')!;
    const merged = mergeEntities(project, mara.id, captain.id);
    expect(merged.entities.some(entity => entity.id === captain.id)).toBe(false);
    expect(mara.aliases).toContain('Captain Venn');
    expect(merged.mentions.every(mention => mention.entityId !== captain.id)).toBe(true);
  });
});
