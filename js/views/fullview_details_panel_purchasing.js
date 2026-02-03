
/**
 * Updates the reappro values based on the index.
 * @param {number} index - The index to update.
 */
function updateReappro(index) {
    var newTotal = 0;
    var startingNum = 1;

    //update starting point if needed
    if (index === 2) {
        startingNum = 5;
    } else if (index === 3) {
        startingNum = 9;
    }
    var endNum = startingNum + 3;

    for (var i = startingNum; i <= endNum; i++) {
        newTotal += +$('#num' + i).val();
    }

    $("#rpTotal" + index).text(newTotal + "%");
}