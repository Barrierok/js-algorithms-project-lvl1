import { test, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import buildSearchEngine from '..';

let docs;

const resolvePath = (name) => path.resolve('__fixtures__', name);

beforeAll(() => {
  const doc1 = { id: 'garbage_patch_NG', text: fs.readFileSync(resolvePath('garbage_patch_NG'), 'utf8') };
  const doc2 = { id: 'garbage_patch_ocean_clean', text: fs.readFileSync(resolvePath('garbage_patch_ocean_clean'), 'utf8') };
  const doc3 = { id: 'garbage_patch_wiki', text: fs.readFileSync(resolvePath('garbage_patch_wiki'), 'utf8') };

  docs = [doc1, doc2, doc3];
});

test('simple search', () => {
  const searchEngine = buildSearchEngine(docs);
  const expected = ['garbage_patch_NG', 'garbage_patch_ocean_clean', 'garbage_patch_wiki'];
  expect(searchEngine.search('trash island')).toEqual(expected);
});
