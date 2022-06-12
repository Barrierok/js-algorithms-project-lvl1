const normalizeText = ({ id, text }) => ({ id, terms: text.match(/\w+/g) });

const calculateOccurrences = (terms, term) => terms
  .reduce((acc, value) => (value === term ? acc + 1 : acc), 0);

export default (docs) => ({
  search: (value) => docs
    .map(normalizeText)
    .map(({ id, terms }) => ({ id, terms, occurrences: calculateOccurrences(terms, value) }))
    .filter((d) => d.occurrences)
    .sort((a, b) => b.occurrences - a.occurrences)
    .map((d) => d.id),
});
