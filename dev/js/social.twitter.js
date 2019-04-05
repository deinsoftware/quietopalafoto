var loadHeight = function() {};

var loadTwitter = function() {
  var difference =
    $('#twitter-widget-0').height() +
    ($('#maps').height() - $('#twitter-widget-0').height()) -
    5;
  $('#tweets').height($('#maps').height());
  $('#twitter-widget-0').css({ height: difference + 'px' });
};
