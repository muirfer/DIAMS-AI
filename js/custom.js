/* Add here all your JS customizations */
function navigateTo(path) {
    $("#mainSection").load(path, function () {
        if (window.theme && window.theme.init) {
            window.theme.init();
        }
    });
}

// Maintain Scroll Position
if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem('sidebar-left-position') !== null) {
        var initialPosition = localStorage.getItem('sidebar-left-position'),
            sidebarLeft = document.querySelector('#sidebar-left .nano-content');

        sidebarLeft.scrollTop = initialPosition;
    }
}