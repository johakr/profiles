const timeUtils = require('./timeUtils');

// this is so the days are the right ones on the front end
const daysOrdered = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function joinContiguousTimes(keySessions) {
  const fixedKeySessions = keySessions.reduce((o, session) => {
    /* eslint-disable no-param-reassign */
    if (o.prev && session.opens === o.prev.closes) {
      o.prev.closes = session.closes;
    } else {
      o.list.push(session);
      o.prev = session;
    }
    /* eslint-enable no-param-reassign */
    return o;
  }, { list: [], prev: undefined });

  return fixedKeySessions.list;
}

function addTimePadding(parsedTimes) {
  const counts = parsedTimes.map(time => time.sessions.length);
  const max = Math.max(...counts);

  parsedTimes.forEach((time) => {
    if (time.sessions.length < max) {
      // eslint-disable-next-line no-param-reassign
      time.padding = (max - time.sessions.length);
    }
  });

  return parsedTimes;
}

function dayDiff(secondDate, firstDate) {
  return Math.trunc((secondDate - firstDate) / (1000 * 60 * 60 * 24));
}

function isDateInWindow(dateString, currentDate, noDays) {
  const exceptionalDate = timeUtils.getDateFromDateString(dateString);
  if ((dayDiff(exceptionalDate, currentDate) <= noDays) &&
    (dayDiff(exceptionalDate, currentDate) >= 0)) {
    return true;
  }
  return false;
}

function toReadableDate(dateString) {
  const exceptionalDate = timeUtils.getDateFromDateString(dateString);
  return `${daysOrdered[exceptionalDate.getUTCDay()]} ${exceptionalDate.getUTCDate()} ${months[exceptionalDate.getUTCMonth()]}`;
}

function mapKey(keySessions) {
  // empty day field doesn't occur in the source data, added default in case
  // it changes in future
  if (keySessions === undefined) {
    return ['No information available'];
  }

  // eslint-disable-next-line arrow-body-style
  const sessions = joinContiguousTimes(keySessions).map((session) => {
    return `${timeUtils.toAmPm(session.opens)} to ${timeUtils.toAmPm(session.closes)}`;
  });

  if (sessions.length === 0) {
    sessions.push('Closed');
  }
  return sessions;
}

module.exports = {
  isDateInWindow,
  toReadableDate,
  addTimePadding,
  mapKey,
};
