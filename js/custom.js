/* Add here all your JS customizations */
// Helper to load content (replaces old navigateTo logic)
function loadPageContent(path) {
    // Cleanup Magnific Popup and orphaned modals
    if ($.magnificPopup) {
        $.magnificPopup.close();
    }
    $('.zoom-anim-dialog, .modal-block').remove();

    $("#mainSection").load(path, function () {
        if (window.theme && window.theme.init) {
            window.theme.init();
        }
    });
}

// Global navigation function -> Forces reload to clear JS context
function navigateTo(path) {
    var currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('page', path);
    window.location.href = currentUrl.toString();
}

// On Page Load: Check for 'page' param and load content
$(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var page = urlParams.get('page');
    if (page) {
        loadPageContent(page);
    }
});

// Maintain Scroll Position
if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem('sidebar-left-position') !== null) {
        var initialPosition = localStorage.getItem('sidebar-left-position'),
            sidebarLeft = document.querySelector('#sidebar-left .nano-content');

        sidebarLeft.scrollTop = initialPosition;
    }
}