const markFilter = (filter, text) => {
  // Find the first index of textFilter within text. 
  // If found, split, wrap the text filter with highlight span, and append the rest.
  let lowerCasedText = text ? text.toLowerCase() : "";
  let lowerCasedTextFilter = filter ? filter.toLowerCase() : "";
  if( lowerCasedText && lowerCasedTextFilter ) {
    // Find text in a lowercased version of the lowerCasedText
    let index = lowerCasedText.indexOf(lowerCasedTextFilter);

    if( index >= 0 ) {
      let highlight = text.slice(index, index + lowerCasedTextFilter.length);

      let firstSlice = text.slice(0, index);
      let lastSlice = text.slice(index + lowerCasedTextFilter.length, lowerCasedText.length);
      return <span>{firstSlice}<mark className="p-0">{highlight}</mark>{lastSlice}</span>;
    } else {
      return text;
    }
  } else {
    return text;
  }
}

const pluralize = (count, word, inclusive = false) => {
  if (count === 1) {
    return inclusive ? `1 ${word}` : word;
  } else {
    return `${count} ${word}s`;
  }
}

export { pluralize, markFilter };