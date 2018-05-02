if (window.matchMedia('(display-mode: standalone)').matches) {
    $('a').not('page-scroll').on('click', function () {
        $(this).attr("target", "_blank");
    });
}