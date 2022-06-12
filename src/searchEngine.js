const normalizeText = (text) => text.match(/\w+/g);

const calculateOccurrences = (terms, term) => terms
  .reduce((acc, value) => (value === term ? acc + 1 : acc), 0);

const search = (docs, words) => docs
  .map(({ id, text }) => ({ id, terms: normalizeText(text) }))
  .map(({ id, terms }) => {
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
  .sort((a, b) => {
    if (a.countWords > b.countWords) {
      return -1;
    }

    if (a.countWords < b.countWords) {
      return 1;
    }

    return b.occurrences - a.occurrences;
  })
  .map((d) => d.id);

export default (docs) => ({
  search: (value) => search(docs, normalizeText(value)),
});
