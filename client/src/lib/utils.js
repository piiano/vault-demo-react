import moment from 'moment';

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

const isoDateStrFromEpoch = (epochTime, defaultValue = 'None') => {
  if (isNaN(epochTime) || epochTime === -1) {
    return defaultValue;
  } else {
    return moment.unix(epochTime).toISOString(true).slice(0, 16);
  }
}

const formatEpoch = (epochTime, defaultValue = 'None') => {
  if (isNaN(epochTime) || epochTime === -1 || epochTime === null) {
    return defaultValue;
  } else {
    const date = moment.unix(epochTime)
    if (isNaN(date)) {
      return defaultValue;
    } else {
      return date.format('MMM Do, YYYY [at] HH:mm:ss z');
    }
  }
}

const epochFromIsoDateTimeStr = (isoDateTimeStr, defaultValue = 'None') => {
  // Convert the date to a iso string
  const epochTime = moment(isoDateTimeStr).unix();
  if (isNaN(epochTime)) {
    return defaultValue;
  } else {
    return epochTime;
  }
}

const isoDateStrFromCurrentTime = () => {
  return isoDateStrFromEpoch(moment().unix());
}

export { pluralize, markFilter, formatEpoch, isoDateStrFromEpoch, epochFromIsoDateTimeStr, isoDateStrFromCurrentTime };