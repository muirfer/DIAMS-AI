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