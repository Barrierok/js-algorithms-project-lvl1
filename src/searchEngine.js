const normalizeText = (text) => text.match(/\w+/g);

const calculateOccurrences = (terms, term) => terms
  .reduce((acc, value) => (value === term ? acc + 1 : acc), 0);

const createIndex = (docs) => docs.reduce((acc, doc) => ({ ...acc, [doc.id]: doc }), {});

const createInvertedIndex = (docs) => docs.reduce((acc, { id, terms }) => {
  terms.forEach((term) => {
    if (acc[term] && !acc[term].includes(id)) {
      acc[term].push(id);
    } else {
      acc[term] = [id];
    }
  });

  return acc;
}, {});

const searchDocs = (docs, words) => {
  const normalizedDocs = docs.map(({ id, text }) => ({ id, terms: normalizeText(text) }));

  const index = createIndex(normalizedDocs);
  const invertedIndex = createInvertedIndex(normalizedDocs);

  return words.flatMap((word) => (invertedIndex[word] || [])
    .map((docId) => {
      const { id, terms } = index[docId];

      const countWords = words.reduce((acc, w) => (terms.includes(w) ? acc + 1 : acc), 0);
      const occurrences = words.reduce((acc, w) => acc + calculateOccurrences(terms, w), 0);
      return {
        id,
        terms,
        countWords,
        occurrences,
      };
    })
    .filter((d) => d.occurrences)
    .sort((doc1, doc2) => {
      if (doc1.countWords > doc2.countWords) {
        return -1;
      }

      if (doc1.countWords < doc2.countWords) {
        return 1;
      }

      return doc2.occurrences - doc1.occurrences;
    })
    .map((d) => d.id));
};

export default (docs) => ({
  search: (value) => {
    const words = normalizeText(value);

    if (words === null) {
      return docs.map((d) => d.id);
    }

    return searchDocs(docs, words);
  },
});
