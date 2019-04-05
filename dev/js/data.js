var restrictions = {};

var filterData = function(data) {
  data = data.pyp.schedule;
  data = data.filter(isDateOnRange);
  return data;
};

var currentData = function(data) {
  data.forEach((element) => {
    $.extend(true, restrictions, element);
  });
};

$.ajax({
  url: '../data/restrictions.json',
  dataType: 'json',
  cache: false,
  success: function(data, status) {
    data = filterData(data);
    currentData(data);
  },
  error: function(xhr, textStatus, err) {
    console.log(
      'readyState: ' + xhr.readyState + '\n xhrStatus: ' + xhr.status,
    );
    console.log('responseText: ' + xhr.responseText);
  },
});
