/*Twitter*/
const twId = "273507274666942464";

var showTwitter = function(){
    $('#gmap').attr('class', 'col-md-8');
    $('#tweet').attr('class', 'col-md-4');
    $('#tweet').show();
};

var hideTwitter = function() {
    $('#gmap').attr('class', 'col-md-12');
    $('#tweet').hide();
};

var loadHeigth = function() {
    var diference = $("#twitter-widget-0").height() + ($('#maps').height() - $("#twitter-widget-0").height()); 
    $('#tweets').height($('#maps').height());
    $("#twitter-widget-0").css({ height: diference + 'px' });
};

var loadTwitter = function() {
    try {
        twttr.ready(
            function(twttr) {
                twttr.widgets.createTimeline(
                        twId,
                        document.getElementById("timeline"), {
                            chrome: "noheader nofooter noborders transparent"
                        }
                    )
                    .then(function() {
                        showTwitter();
                        loadHeigth();
                    });
            }
        );
    } catch (error) {
        hideTwitter();
    }
};

/*Facebook*/
const fbURL = 'https://www.facebook.com/';
const fbPage = 'quietopalafoto';
const fbAPI = 'https://graph.facebook.com/' + 'v2.7/';
const fbToken = '&access_token=763465203723077|2a943f653712fcce25de89d9247e2654';

var loadFacebook = function() {
    var urlPage = fbURL + fbPage;
    $('[id^=fan]').attr("href", urlPage);

    var urlFan = fbPage + '/?fields=fan_count';
    $.getJSON(fbAPI + urlFan + fbToken + '&callback=?', function(json) {
        if (json.fan_count) {
            $('#news span.badge').text(json.fan_count);
        } else {
            $('#fbk-fan').hide();
        }
    });

    var urlPost = fbPage + '/feed/?limit=12';
    $.getJSON(fbAPI + urlPost + fbToken + '&callback=?', function(json) {
        var html = '';
        $.each(json.data, function(i, fb) {
            html += '<div class="col-sm-6 col-md-4">';
            html += '    <div id="' + fb.id + '" class="well well-sm">';
            /* attach will be here */
            html += '    </div>';
            html += '</div>';

            var urlDetail = fb.id + '/?fields=attachments,likes.summary(true),shares,comments.summary(true)';
            $.getJSON(fbAPI + urlDetail + fbToken + '&callback=?', function(json) {
                var attach = '';
                attach += '<a href="' + fbURL + fb.id + '">';
                if (json.attachments.data[0].type === 'album')
                {
                    attach += '    <div class="image-full" style="background-image: url(\'' + json.attachments.data[0].subattachments.data[0].media.image.src + '\');">';
                } else 
                {
                    attach += '    <div class="image-full" style="background-image: url(\'' + json.attachments.data[0].media.image.src + '\');">';
                }
                attach += '    </div>';
                attach += '    <div class="item-content">';
                attach += '        <div class="item-text">';
                attach += '            ' + (fb.message ? fb.message : json.attachments.data[0].title ? json.attachments.data[0].title.cleanSource() : '') + '';
                attach += '        </div>';
                attach += '    </div>';
                attach += '</a>';
                $(attach).appendTo('#' + fb.id);
            });

            if ((i + 1) % 2 === 0) {
                html += '<div class="clearfix visible-sm-block"></div>';
            }
            if ((i + 1) % 3 === 0) {
                html += '<div class="clearfix visible-md-block visible-lg-block"></div>';
            }
        });

        $(html).appendTo('#feed');
    });
};

String.prototype.cleanSource = function ()
{
    var titleValue = this;
    var jsonFilter = [
        " | Minuto30.com", 
        " - Teleantioquia", 
        " - El Colombiano.com",
        " • ENTER.CO", 
        " - La FM",
        " - NeoTeo",
        " - tuexperto.com",
        "VIDEO:", 
        "Vídeo. ", 
        "Reportaje:", 
        " |"
    ];
    $.each(jsonFilter, function(i, filter) {
        titleValue = titleValue.replace(filter, '');
    });
    return titleValue;
};