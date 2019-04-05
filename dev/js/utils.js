function convertISOtoDate(value, format) {
  if (!value) {
    return '';
  }

  var date = new Date(value);
  var result = '';
  switch (format) {
    case 'short':
      result =
        date.getDate() +
        ' ' +
        getMonthName(date.getMonth(), shortMonthsName);
      break;
    case 'long':
      result =
        date.getDate() +
        ' ' +
        getMonthName(date.getMonth(), longMonthsName);
      break;

    default:
      result = date.toISOString().substr(0, 10);
      break;
  }
  return result;
}

var shortMonthsName = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

var longMonthsName = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

function getMonthName(month, nameList) {
  if (!month) {
    return '';
  }

  return nameList[month];
}

function convertISOtoYear(value) {
  if (!value) {
    return '';
  }

  var date = new Date(value);
  return date.getFullYear();
}

function convertMilitarToStandardTime(military) {
  if (!military) {
    return '';
  }

  var hour = military.substring(2, 0);
  var mins = military.substring(2);
  return (hour > 12 ? hour - 12 : hour * 1) + ':' + mins;
}

function getMeridian(military) {
  if (!military) {
    return '';
  }

  var hour = military.substring(2, 0);
  return hour < 12 ? 'AM' : 'PM';
}

function getTimeRange(time) {
  if (!time) {
    return '';
  }

  var range =
    convertMilitarToStandardTime(time.start) +
    (time.start && time.end ? '-' : '') +
    convertMilitarToStandardTime(time.end) +
    ' ' +
    getMeridian(time.end || time.start);
  return range;
}

function getWeekDay(day) {
  var date = new Date();
  var weekDay = new Date(date.setDate(date.getDate() - date.getDay() + day));
  return weekDay;
}

function isDateOnRange(range) {
  var dateStart = new Date(range.date.start);
  var dateEnd = new Date(range.date.end);
  return (
    dateStart < Date.now() &&
    (!range.date.end || Date.now() <= dateEnd.setDate(dateEnd.getDate() + 1))
  );
}
