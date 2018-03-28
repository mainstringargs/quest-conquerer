
var xmlhttp = new XMLHttpRequest();
var url = "https://cdn.rawgit.com/mainstringargs/quest-conqueror/master/json/quests/questList.json";

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
       var adDivData =     '<div id="amzn-assoc-ad-39580e4c-818e-48d7-82cd-2422456ed385"></div><script async src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=39580e4c-818e-48d7-82cd-2422456ed385"></script>'
       document.getElementById("adDiv").innerHTML = adDivData;
};
xmlhttp.open("GET", url, true);
xmlhttp.send();
