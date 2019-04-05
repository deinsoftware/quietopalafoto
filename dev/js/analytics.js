$('a[href*="top"]').click(function() {
  registerTag('Menu', 'click', 'Top');
});

$('a[href*="pyp"]').click(function() {
  registerTag('Menu', 'click', 'Restrictions');
});

$('a[href*="map"]').click(function() {
  registerTag('Menu', 'click', 'Mapa');
});

$('a[href*="gps"]').click(function() {
  registerTag('Menu', 'click', 'GPS');
});

$('a[href*="news"]').click(function() {
  registerTag('Menu', 'click', 'News');
});

$('#fbk_btn').click(function() {
  registerTag('Social', 'click', 'Facebook');
});

$('#twt_btn').click(function() {
  registerTag('Social', 'click', 'Twitter');
});

$('#ytb_btn').click(function() {
  registerTag('Social', 'click', 'YouTube');
});

$('#gpsigo').click(function() {
  registerTag('GPS', 'click', 'iGO');
});

$('#gpsgrm').click(function() {
  registerTag('GPS', 'click', 'Garmin');
});
