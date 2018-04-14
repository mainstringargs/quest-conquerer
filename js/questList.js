var loadJS = function(url, location) {
	// url is URL of external file, implementationCode is the code
	// to be called from the file, location is the location to
	// insert the <script> element

	var scriptTag = document.createElement('script');
	scriptTag.src = url;
	scriptTag.async = true;

	// scriptTag.onload = implementationCode;
	// scriptTag.onreadystatechange = implementationCode;

	location.appendChild(scriptTag);
};

var xmlhttp = new XMLHttpRequest();
var url = "https://cdn.rawgit.com/mainstringargs/quest-slayer/" + gitCdnHash
		+ "/json/quests/questList.json";

xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var myObj = JSON.parse(this.responseText);

		// sort entries alphabetically
		myObj.sort(function(a, b) {
			var nameA = a.title.toLowerCase(), nameB = b.title.toLowerCase();
			if (nameA < nameB) // sort string ascending
				return -1;
			if (nameA > nameB)
				return 1;
			return 0; // default return value (no sorting)
		});

		// sort entries by category alphabetically
		myObj.sort(function(a, b) {
			var nameA = a.category.toLowerCase(), nameB = b.category
					.toLowerCase();
			if (nameA < nameB) // sort string ascending
				return -1;
			if (nameA > nameB)
				return 1;
			return 0; // default return value (no sorting)
		});

		var orderedByCategory = {};

		for (x in myObj) {
			var category = myObj[x].category;

			if (!orderedByCategory[category]) {
				orderedByCategory[category] = {};
				orderedByCategory[category].entries = new Array();
				orderedByCategory[category].category = category;
			}
			orderedByCategory[category].entries.push(myObj[x]);
		}

		var txt = "";
		for (catEntry in orderedByCategory) {
			if (orderedByCategory[catEntry].category) {
				txt += "<h3>" + orderedByCategory[catEntry].category + "</h3>";
				txt += "<ul>";
				for (x in orderedByCategory[catEntry].entries) {
					var entryId = orderedByCategory[catEntry].entries[x].id;
					var title = orderedByCategory[catEntry].entries[x].title;
					var linkURL = orderedByCategory[catEntry].entries[x].linkURL;

					txt += "<li><a href='" + linkURL + "'/>" + title
							+ "</a></li>";

				}
				txt += "</ul>"
			}
		}

		document.getElementById("questListDiv").innerHTML = txt;

	}
	var adDivData = '<div id="amzn-assoc-ad-39580e4c-818e-48d7-82cd-2422456ed385"></div>'
	document.getElementById("adDiv").innerHTML = adDivData;
	loadJS(
			'//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=39580e4c-818e-48d7-82cd-2422456ed385',
			document.body);
};
xmlhttp.open("GET", url, true);
xmlhttp.send();
