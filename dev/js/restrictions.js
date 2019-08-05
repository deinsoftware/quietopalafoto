var types = ['vehicle', 'bike'];
var weekDays = ['mo', 'tu', 'we', 'th', 'fr'];

function loadRestrictions() {
  if (restrictions && restrictions.level) {
    var level = '';
    var hash = '';
    var free = '';
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
      $('#level').removeClass('hidden-lg');
      $('#level-number').text(restrictions.level);
      $('#level-restrictions').text(free);
      $('#level')
        .removeClass('panel-info')
        .addClass('panel-' + level);
      $('#level .alert-info')
        .removeClass('alert-info')
        .addClass('alert-' + level);

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
        $('#restrictions-free').text(
          '#' + free.replace(/\s/g, '') + 'ViasExentas',
        );
        $('#restrictions-free').removeClass('hidden-xs');
      }

      var bike = [];
      restrictions.type.bike.class['2T'].apply && bike.push('2T');
      restrictions.type.bike.class['4T'].apply && bike.push('4T');
      $('#bike-title span').text(bike.join('/'));

      var start = convertISOtoDate(restrictions.date.start, 'long');
      var end = convertISOtoDate(restrictions.date.end, 'long');
      $('#schedule-models strong span')
        .eq(0)
        .text('Desde ' + start);
      $('#schedule-models strong span')
        .eq(1)
        .text(end && ' a ' + end);

      var day = restrictions.type.day;
      if (day.sa) {
        $('#weekend').removeClass('hidden-xs hidden-sm hidden-md hidden-lg');

        var even = day.sa.even.map((date) => convertISOtoDate(date + 'T00:00:00.000-05:00', 'short'));
        $('#all-sa-even').text(even.join(', '));
        var odd = day.sa.odd.map((date) => convertISOtoDate(date + 'T00:00:00.000-05:00', 'short'));
        $('#all-sa-odd').text(odd.join(', '));
      }
    }

    $('#schedule-models').removeClass(
      'hidden-xs hidden-sm hidden-md hidden-lg',
    );
    var models = restrictions.type.model;
    for (var key in models) {
      if (models.hasOwnProperty(key)) {
        var morning = models[key][0];
        var night = models[key][1];
        var range = '';
        range += getTimeRange(morning);
        range += ' | ';
        range += getTimeRange(night);

        if ((key | 0) === convertISOtoYear(Date.now())) {
          $('#schedule').text(range);
        } else {
          var html = '';
          html += '<div>';
          html += $('<span/>', { class: 'visible-xs' })
            .text(' ' + key + ': ' + range)
            .prop('outerHTML');
          html += $('<span/>', { class: 'hidden-xs' })
            .text('Modelos ' + key + ' o inferiores ' + range)
            .prop('outerHTML');
          html += '</div>';
          $('#schedule-models > div').append(html);
        }
      }
    }

    var abbr = $('<abbr/>', { title: 'Modelos igual o inferiores' })
      .text('≤')
      .prop('outerHTML');
    $('#schedule-models > div span:first-child').prepend(abbr);
  }
}

function weekRestriction(type, day) {
  var numbers = restrictions.type[type].day[day];
  $('#' + type + '-' + day).text(numbers.join('-'));
}
