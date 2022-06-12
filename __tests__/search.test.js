import { test, expect } from '@jest/globals';
import buildSearchEngine from '..';

let docs;

beforeAll(() => {
  const doc1 = { id: 'doc1', text: "I can't shoot shoot straight unless I've had a pint!" };
  const doc2 = { id: 'doc2', text: "Don't shoot that thing at me." };
  const doc3 = { id: 'doc3', text: "I'm your shooter." };

  docs = [doc1, doc2, doc3];
});

test('clear search', () => {
  const searchEngine = buildSearchEngine(docs);
  expect(searchEngine.search('shoot')).toEqual(expect.arrayContaining(['doc1', 'doc2']));
  expect(searchEngine.search('hobbit')).toHaveLength(0);

  const searchEngine2 = buildSearchEngine([]);
  expect(searchEngine2.search('')).toHaveLength(0);
});

test('relevancy', () => {
  const searchEngine = buildSearchEngine(docs);
  const result = searchEngine.search('shoot');

  expect(result[0]).toBe('doc1');
  expect(result[1]).toBe('doc2');
});

test('fuzzy search', () => {
  const searchEngine = buildSearchEngine(docs);
  const result = searchEngine.search('shoot at me');

  expect(result[0]).toBe('doc2');
  expect(result[1]).toBe('doc1');
});
