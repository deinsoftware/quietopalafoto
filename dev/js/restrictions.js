let level = '';
let hash = '';
let free = '';

const types = ['vehicle', 'bike'];
const weekDays = ['mo', 'tu', 'we', 'th', 'fr'];

function weekRestriction(type, day) {
  var numbers = restrictions.type[type].day[day];
  $('#' + type + '-' + day).text(numbers.join('-'));
}

function setLevel() {
  if (restrictions.type.day) {
    $('#level').removeClass('hidden-lg');
    $('#level-number').text(restrictions.level);
    $('#level-restrictions').text(free);
    $('#level')
      .removeClass('panel-info')
      .addClass('panel-' + level);
    $('#level .alert-info')
      .removeClass('alert-info')
      .addClass('alert-' + level);
  }
}

function setRestrictions() {
  $('#restrictions')
    .removeClass('panel-info')
    .addClass('panel-' + level);
  $('#restrictions .alert-info')
    .removeClass('alert-info')
    .addClass('alert-' + level);
  $('#restrictions .text-info')
    .removeClass('text-info')
    .addClass('text-' + level);
  $('#restrictions-title strong').removeClass(
    'hidden-xs hidden-sm hidden-md hidden-lg',
  );
  $('#restrictions-hash').text(hash);
  if (restrictions.level === 3) {
    $('#restrictions-free').text('#' + free.replace(/\s/g, '') + 'ViasExentas');
    $('#restrictions-free').removeClass('hidden-xs');
  }
}

function setBike() {
  var bike = [];
  restrictions.type.bike.class['2T'].apply && bike.push('2T');
  restrictions.type.bike.class['4T'].apply && bike.push('4T');
  $('#bike-title span').text(bike.join('/'));
}

function setDates() {
  var start = convertISOtoDate(restrictions.date.start, 'long');
  var end = convertISOtoDate(restrictions.date.end, 'long');
  $('#schedule-models strong span')
    .eq(0)
    .text('Desde ' + start);
  $('#schedule-models strong span')
    .eq(1)
    .text(end && ' a ' + end);
  var day = restrictions.type.day;
  if (day && day.weekdays) {
    $('#weekend').removeClass('hidden-xs hidden-sm hidden-md hidden-lg');
    let weekendTitle =
      {
        sa: 'Sábado',
        su: 'Domingo',
      }[day.weekdays] || 'Sábado y Domingo';
    $('#weekend h4').text(weekendTitle);
    if (day.date.even) {
      var even = day.date.even.map((date) =>
        convertISOtoDate(date + 'T00:00:00.000-05:00', 'short'),
      );
      $('#all-even').text(even.join(', '));
      $('#vehicle-even, #bike-even').removeClass(
        'hidden-xs hidden-sm hidden-md hidden-lg',
      );
    }
    if (day.date.odd) {
      var odd = day.date.odd.map((date) =>
        convertISOtoDate(date + 'T00:00:00.000-05:00', 'short'),
      );
      $('#all-odd').text(odd.join(', '));
      $('#vehicle-odd, #bike-odd').removeClass(
        'hidden-xs hidden-sm hidden-md hidden-lg',
      );
    }
  }
}

function setHours() {

  let models = restrictions.type.model;
  let morning = '';
  let night = '';

  for (let key in models) {
    if (models.hasOwnProperty(key)) {
      morning = models[key][0];
      night = models[key][1];

      let range = '';
      range += getTimeRange(morning);
      range += ' | ';
      range += getTimeRange(night);

      if ((key | 0) === convertISOtoYear(Date.now())) {
        $('#schedule').text(range);
      } else {
        let html = '';
        html += '<div>';
        html += $('<span/>', { class: 'visible-xs' })
          .text(' ' + key + ': ' + range)
          .prop('outerHTML');
        if (morning === '0000' && night === '2359') {
          html += $('<span/>', { class: 'hidden-xs' })
            .text('Modelos ' + key + ' o inferiores ' + range)
            .prop('outerHTML');
        }
        html += '</div>';
        $('#schedule-models > div').append(html);
      }
    }
  }

  $('#schedule-models').removeClass('hidden-xs hidden-sm hidden-md hidden-lg');

  var abbr = $('<abbr/>', { title: 'Modelos igual o inferiores' })
    .text('≤')
    .prop('outerHTML');
  $('#schedule-models > div span:first-child').prepend(abbr);
}

function loadRestrictions() {
  if (restrictions && restrictions.level) {
    switch (restrictions.level) {
      case 2:
        level = 'warning';
        hash = '#AlertaNaranja';
        free = 'Aplican';
        break;
      case 3:
        level = 'danger';
        hash = '#AlertaRoja';
        free = 'No Aplican';
        break;
      default:
        level = 'info';
        break;
    }

    types.map((type) => weekDays.map((day) => weekRestriction(type, day)));

    if (restrictions.level > 1) {
      setLevel();
      setRestrictions();
      setBike();
      setDates();
    }
    setHours();
  }
}
