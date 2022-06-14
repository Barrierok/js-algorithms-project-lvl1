import _ from 'lodash';

const normalizeText = (text) => (text.match(/\w+/g) || []).map((term) => term.toLowerCase());

const createInvertedIndexWithMetrics = (rawDocs) => {
  const termDocs = rawDocs.map(({ id, text }) => ({ id, terms: normalizeText(text) }));
  const mappingDocumentsById = termDocs.reduce((acc, doc) => ({ ...acc, [doc.id]: doc }), {});

  const invertedIndex = termDocs.reduce((acc, doc) => {
    const occurrences = _.countBy(doc.terms);

    return _.mergeWith(acc, occurrences, (objValue, srcValue) => (
      (objValue || []).concat({ docId: doc.id, occurrences: srcValue })
    ));
  }, {});

  return _.mapValues(invertedIndex, (docsInfo) => docsInfo.map(({ docId, occurrences }) => {
    const doc = mappingDocumentsById[docId];
    const tf = occurrences / doc.terms.length;
    const idf = Math.log(1 + termDocs.length / docsInfo.length);

    return { docId, tfIdf: tf * idf };
  }));
};

export default (docs) => {
  const invertedIndexWithMetrics = createInvertedIndexWithMetrics(docs);

  const search = (value) => {
    const words = normalizeText(value);

    const relevantDocuments = words.reduce((acc, word) => (
      (invertedIndexWithMetrics[word] || []).reduce((outerAcc, { docId, tfIdf }) => (
        { ...outerAcc, [docId]: (outerAcc[docId] ?? 0) + tfIdf }
      ), acc)
    ), {});

    return Object
      .entries(relevantDocuments)
      .sort(([, tfIdf1], [, tfIdf2]) => tfIdf2 - tfIdf1)
      .map(([id]) => id);
  };

  return ({ search });
};
