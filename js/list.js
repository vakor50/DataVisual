var entries= [];
var numItems = 0;

// ******************************************************** //
// 		JS Function to fix Name    							//
// 		 - Eliminates white space							//
//		 - Capiltalizes name								//
// ******************************************************** //
function toName(s) {
	// remove characters that aren't a-zA-Z
	s = s.replace( /[\s\n\r]+/g, ' ' );
	// separate all the words into an array
	var words = s.split(" ");

	var final = "";
	for (var i = 0; i < words.length; i++) {
		// set first letter of a word to uppercase
		final += words[i].charAt(0).toUpperCase() 
		if(words[i].length > 1)
			// set rest of the letters of each word to lowercase
			final += words[i].substring(1, words[i].length).toLowerCase();
		final += " ";
	}
	return final;
}

// ******************************************************** //
// 		JS Function to determine if HTML 					//
// 		 - Returns true if string contains html tags		//
// ******************************************************** //
function isHTML(str) {
	var a = document.createElement('div');
	a.innerHTML = str;
	for (var c = a.childNodes, i = c.length; i--; ) {
		if (c[i].nodeType == 1) 
			return true; 
	}
	return false;
}

// ******************************************************** //
// 		JS Function to change stylings when li clicked		//
// 		 - Checked off and change color						//
// ******************************************************** //
function complete(id) {
	var elem = $('#person' + id);

	if(elem.val() == 1) {
		elem.css("background-color", "#eee");
		$('#para' + id).css("display", "none");
		elem.val(0);
		elem.append('<i class="fa fa-check-square fa-2x fa-fw" aria-hidden="true" id="check'+id+'"></i>');
	} else {
		elem.css("background-color", "white");
		$('#para' + id).css("display", "block");
		elem.val(1);
		$('#check' + id).remove();
	}



}

// ******************************************************** //
//		JQuery Function to enable "enter" 					//
//		 - When enter hit, "add person" button clicked		//
// ******************************************************** //
$("#myText").keyup(function(event){
	// when enter key pressed
 	if(event.keyCode == 13) {
 		// click the addItemButton
     	$("#addItemButton").click();
 	}
});
// ******************************************************** //
//		JQuery Function to enable "enter" 					//
//		 - When enter hit, "add person" button clicked		//
// ******************************************************** //
$("#myComment").keyup(function(event){
	// when enter key pressed
 	if(event.keyCode == 13) {
 		// click the addItemButton
     	$("#addItemButton").click();
 	}
});

// ******************************************************** //
//		JQuery Function for Add Item Button 				//
//		 - When element with id="AddItemButton" clicked,	//
//			add person 										//
// ******************************************************** //
$('#addItemButton').click(function() {

	// make sure there is text in the item field
	if($('#myText').val() == "") {
		alert("Please enter an item");
	}
	else {

		// Remove any html or white space on input, capitalize the words
		var item = $('#myText').val().trim();
		if(isHTML(item)) {
			item = $(item)[0].textContent;
		}
		item = toName(item).trim();

		// Append the new person to the element with id="myList"
		// $('#myList').append('<a href="#" class="list-group-item" id="person' + numItems + '" value="1" onClick="complete('+numItems+')">');
		
		$('#myList').append('<li onClick="complete('+numItems+')" class="list-group-item" id="person' + numItems + '" value="1">');
			// + (numItems + 1) + ') ' + item + "  ");

		$('#person' + numItems).append('<h4 class="list-group-item-heading">' + (numItems + 1) + ') ' + item + '</h4>');
		// if there isn't content in text area don't add anything extra
		if($('#myComment').val() == "") {
			$('#myList').append('</li>');
		} else {
			// Remove any html or white space on input
			var comment = $('#myComment').val().trim();
			if(isHTML(comment)) {
				comment = $(comment)[0].textContent;
			}
			comment = comment.trim();

			// append the information from the text area to the li
			$('#person' + numItems).append('<p class="list-group-item-text" id="para'+numItems+'">' + comment + '</p></li>');

		}

		// add item to list of entries
		entries.push(item);
		console.log(entries);
		// increment number of items
		numItems = numItems + 1;

		// Reset input boxes
		$('#myText').val('');
		$('#myComment').val('');
	}
});