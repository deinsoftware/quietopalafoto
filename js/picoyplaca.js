var db = firebase.database();
var ref = db.ref('pyp');
ref.child('schedule').once('value', function(snapshot) {
    // This callback will be triggered exactly two times, unless there are
    // fewer than two dinosaurs stored in the Database. It will also get fired
    // for every new, heavier dinosaur that gets added to the data set.
    snapshot.forEach(function(data) {
        console.log("Key: " + data.key);
        console.log("Value:" + JSON.stringify(data.val()));
    });
});