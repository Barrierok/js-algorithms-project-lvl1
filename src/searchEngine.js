export default (docs) => ({
  search: (value) => docs
    .filter((d) => d.text.includes(value))
    .map((d) => d.id),
});
