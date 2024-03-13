const formatDate = (date, _options) => {
  const options = _options || { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}

export {
  formatDate,
}

