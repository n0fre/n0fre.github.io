/**
 * Master function to create the infocards
 */
 window.onload = function icard_createInfocards() {
    // Customisable variables

    // Regular expression to find the correct code. Several structures:
    // {text}[text]  = /\{(.*?)\}\[([\s\S]*?)\]/g
    // {!text}[text] = /\{\!(.*?)\}\[([\s\S]*?)\]/g
    // [text](text)  = /\[(.*?)\]\(([\s\S]*?)\)/g
    // [!text](text) = /\[\!(.*?)\]\(([\s\S]*?)\)/g
    // {!text}[!text] = /\{\!(.*?)\}\[([\s\S]*?)\]/g -- This is advised if your site uses markdown
    var regex = /\{\!(.*?)\}\[([\s\S]*?)\]/g;

    // Colours and size for the arrow button
    var arrow_style = {'size':16, 'background':'#E6DDDE', 'foreground':'#443235'};

    // Div name you want to have scanned for this code. Leave empty for whole document
    var divnames = ["essay"];

    // Other code
    var icard_elems = [];
    for(var k = 0; k < divnames.length; k++) {
        icard_elems.push(document.getElementsByClassName(divnames[k]));
    }
    var icard_counter = 0;

    for(var i = 0; i < icard_elems.length; i++) {
        for (var p = 0; p < icard_elems[i].length; p++) {
            var divtext = icard_elems[i][p].innerHTML;                  // Extract inner html from the div
            var icards_raw = divtext.match(regex);                      // Get raw infocard with regex
            var icards_text = icard_extractString(icards_raw);          // Extract all strings to array

            for(var j = 0; j < icards_text.length; j++) {
                var icard_html = icard_createHTML(icards_text[j], icard_counter, arrow_style);      // Generate HTML for infocards
                icard_counter++;
                //console.log(icard_html);
                divtext = divtext.replace(icards_raw[j], icard_html);   // Replace infocard text with HTML
            }
            icard_elems[i][p].innerHTML = divtext;                         // Replace text in div
        }
    }
};

/**
 * Then extracts the string from that.
 */
function icard_extractString(rawArray) {
    // Check for the following non-greedy pattern: {!text}[text]
    var textarray = [];
    if (rawArray != null) {
        for (var i = 0; i < rawArray.length; i++) {
            var str = rawArray[i];
            var infotext = str.substring(2, str.indexOf('}'));
            var cardtext = str.substring(str.indexOf('[')+1, str.length - 1);
            textarray.push({'infotext':infotext, 'cardtext':cardtext});
        }
    }
    return textarray;
}

/**
 * Generates the HTML code for the infocard
 */
function icard_createHTML(cardstring, icard_counter, arrow_style) {
    var icard_id = "icard_" + icard_counter;
    var toggle_arrow = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="' + arrow_style['size'] + '" ' +
        'height="' + arrow_style['size'] + '" id="' + icard_id + '_arrow" style="margin-bottom: -2px;">' +
        '<circle style="fill:' + arrow_style['background'] + ';" cx="8" cy="8" r="8"/>' +
        '<polygon style="fill:' + arrow_style['foreground'] + ';" points="8 12.1 8 12.1 4 5.1 12 5.1 "/></svg>';

    cardstring['cardtext'] = cardstring['cardtext'].replace(/\<.?p\>/g, "<br/>");
    console.log(cardstring['cardtext']);
    return "<span class='icard'>"
        + "<span class='icard_toggle' onclick='icard_click(`" + icard_id + "`)'>" + cardstring['infotext'] + " " + toggle_arrow + "</span>"
        + "<span class='icard_content' id='" + icard_id + "'>" + cardstring['cardtext'] + "</span></span>";
}

/**
 * Onclick function for infocards
 */
function icard_click(icard_id) {
    var icard = document.getElementById(icard_id);
    var arrow = document.getElementById(icard_id + "_arrow");
    if(icard.style.display == "block") {
        icard.style.display = "none";
        arrow.style.webkitTransform = 'rotate(0deg)';
    } else {
        icard.style.display = "block";
        arrow.style.webkitTransform = 'rotate(180deg)';
    }
}