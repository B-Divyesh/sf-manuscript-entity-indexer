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

  it('deduplicates overlapping Han name and place matches at one source position', () => {
    const project = indexDocuments('CJK evidence', structuredClone(sampleDocuments));
    const whiteHarbor = project.entities.find(entity => entity.name === '白港');
    const redBridge = project.entities.find(entity => entity.name === '赤橋');
    expect(whiteHarbor?.mentionIds).toHaveLength(3);
    expect(redBridge?.mentionIds).toHaveLength(1);
    expect(new Set(project.mentions.map(mention => mention.id)).size).toBe(project.mentions.length);
    expect(project.mentions.filter(mention => mention.entityId === whiteHarbor?.id).map(mention => mention.position)).toHaveLength(3);
  });

  it('finds Kana and Hangul names when they are followed by their local particles', () => {
    const document = {
      id: 'cjk', title: 'CJK', path: 'cjk.md',
      text: 'ユキは白港へ向かった。민서가 강변역에 도착했다。'
    };
    const candidates = extractCandidates(document).map(candidate => candidate.name);
    expect(candidates).toContain('ユキ');
    expect(candidates).toContain('민서');
    const project = indexDocuments('CJK', [document]);
    expect(project.entities.find(entity => entity.name === 'ユキ')?.kind).toBe('person');
    expect(project.entities.find(entity => entity.name === '민서')?.kind).toBe('person');
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
