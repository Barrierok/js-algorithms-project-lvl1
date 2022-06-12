const normalizeText = (text) => text.match(/\w+/g) || [];

const createIndex = (docs) => docs.reduce((acc, doc) => ({ ...acc, [doc.id]: doc }), {});

const createInvertedIndex = (docs) => docs.reduce((acc, { id, terms }) => {
  terms.forEach((term) => {
    if (!acc[term]) {
      acc[term] = [{ docId: id, occurrences: 1 }];
      return;
    }

    const currentDoc = acc[term].find(({ docId }) => docId === id);
    if (currentDoc) {
      currentDoc.occurrences += 1;
    } else {
      acc[term].push({ docId: id, occurrences: 1 });
    }
  });

  return acc;
}, {});

const createTfIdf = (docs, mappingDocumentsById, invertedIndex) => {
  const newInvertedIndex = invertedIndex;

  Object.entries(invertedIndex).forEach(([word, docsInfo]) => {
    (docsInfo || []).forEach(({ docId, occurrences }, i) => {
      const doc = mappingDocumentsById[docId];
      const tf = occurrences / doc.terms.length;
      const idf = Math.log10(docs.length / docsInfo.length);

      newInvertedIndex[word][i].metric = tf * idf;
    });
  });
};

export default (docs) => {
  const normalizedDocs = docs.map(({ id, text }) => ({ id, terms: normalizeText(text) }));

  const mappingDocumentsById = createIndex(normalizedDocs);
  const invertedIndex = createInvertedIndex(normalizedDocs);

  createTfIdf(docs, mappingDocumentsById, invertedIndex);

  const search = (value) => {
    const words = normalizeText(value);

    const relevantDocuments = words.reduce((acc, word) => {
      const documentsWithWord = invertedIndex[word] || [];

      return documentsWithWord.reduce((outerAcc, { docId, metric }) => (
        { ...outerAcc, [docId]: (outerAcc[docId] ?? 0) + metric }
      ), acc);
    }, {});

    return Object
      .entries(relevantDocuments)
      .sort(([, metric1], [, metric2]) => metric2 - metric1)
      .map(([id]) => id);
  };

  return ({ search });
};
