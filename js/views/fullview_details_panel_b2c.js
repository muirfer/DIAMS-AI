/**
 * Change Nutriscore
 * @param {string} nutriId - Nutriscore ID
 */
function changeNutriscore(nutriId) {
    // Remove existing highlight classes
    $('#nutri-score-' + nutriId + ' label').removeClass('selected-score');

    // Add highlight class to selected label
    var selectedValue = $('input[name="nutri-' + nutriId + '"]:checked').val();
    $('#nutri-score-' + nutriId + ' label:has(input[value="' + selectedValue + '"])').addClass('selected-score');
}

function showOrHideNutrientInput(elem, nId) {
    if ($(elem).is(':checked')) {
        $("." + nId).show()
        $(".l" + nId).css("opacity", "1")
    } else {
        $("." + nId).hide()
        $(".l" + nId).css("opacity", "0.6")
    }
}