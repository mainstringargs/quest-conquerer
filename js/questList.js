
var xmlhttp = new XMLHttpRequest();
var url = "https://raw.githubusercontent.com/mainstringargs/quest-conqueror/master/json/quests/questList.json";

xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var myObj = JSON.parse(this.responseText);

    	//sort entries alphabetically
		myObj.sort(function(a, b) {
			var nameA = a.title.toLowerCase(),
				nameB = b.title.toLowerCase();
			if (nameA < nameB) //sort string ascending
				return -1;
			if (nameA > nameB)
				return 1;
			return 0; //default return value (no sorting)
		});

		var txt = "";
		txt += "<ul>";
		for (x in myObj) {
			var entryId = myObj[x].id;
			var title = myObj[x].title;
			var linkURL = myObj[x].linkURL;

			txt += "<li><a href='" + linkURL + "'/>" + title + "</a></li>";

		}
		txt += "</ul>"
		document.getElementById("questListDiv").innerHTML = txt;


	}
};
xmlhttp.open("GET", url, true);
xmlhttp.send();
