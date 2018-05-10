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

function getItemsChecked(string) {
	var count = 0;
	for (var i = 0; i < string.length; i++) {
		var character = string.charAt(i);
		if (character == '1') {
			count++;
		}
	}

	return count;
};

function loadQuests() {
	var xmlhttp = new XMLHttpRequest();
	var url = "https://cdn.rawgit.com/mainstringargs/quest-slayer/"
			+ gitCdnHash + "/json/quests/questList.json";

	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myObj = JSON.parse(this.responseText);

			// sort entries alphabetically
			myObj = myObj.sort(function(a, b) {
				var nameA = a.title.toLowerCase(), nameB = b.title
						.toLowerCase();
				var catA = a.category.toLowerCase(), catB = b.category
						.toLowerCase();

				if (catA == catB) {

					if (nameA < nameB) // sort string ascending
						return -1;
					if (nameA > nameB)
						return 1;
					return 0; // default return value (no sorting)
				}
				if (catA < catB) // sort string ascending
					return -1;
				if (catA > catB)
					return 1;

				return 0;
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
					txt += "<h3>" + orderedByCategory[catEntry].category
							+ "</h3>";
					txt += "<ul>";
					for (x in orderedByCategory[catEntry].entries) {
						var entryId = orderedByCategory[catEntry].entries[x].id;
						var title = orderedByCategory[catEntry].entries[x].title;
						var linkURL = orderedByCategory[catEntry].entries[x].linkURL;
						var itemCount = orderedByCategory[catEntry].entries[x].itemCount;
						var questStorage = localStorage.getItem("quest-"
								+ entryId);

						if (questStorage) {

							var checkedCount = getItemsChecked(questStorage);
							
							if(checkCount > itemCount){
								checkCount = itemCount;
							}

							if (checkedCount > 0) {
								txt += "<li><a href='" + linkURL + "'/>"
										+ title + "</a> (" + Number((checkedCount/itemCount)*100).toFixed(2)
										+ "% complete)</li>";
							} else {
								txt += "<li><a href='" + linkURL + "'/>"
										+ title + "</a></li>";
							}
						} else {
							txt += "<li><a href='" + linkURL + "'/>" + title
									+ "</a></li>";
						}

					}
					txt += "</ul>"
				}
			}

			document.getElementById("questListDiv").innerHTML = txt;

			var data = localStorage;
			var json = JSON.stringify(data);
			var blob = new Blob([ json ], {
				type : 'text/plain;charset=utf-8'
			});
			var url = URL.createObjectURL(blob);

			var a = document.createElement('a');
			var stamp = (new Date().toLocaleString()).toString().replace(/\//g,
					'_').replace(/\:/g, '_').replace(/\,/g, '').replace(/\ /g,
					'_');
			a.download = "questSlayerData-" + (stamp) + ".json";
			a.href = url;
			a.textContent = "Export";

			document.getElementById('questListDiv').appendChild(
					document.createElement('br'));
			document.getElementById('questListDiv').appendChild(a);
			document.getElementById('questListDiv').appendChild(
					document.createTextNode('\u00A0\/\u00A0'));

			a = document.createElement('a');
			a.href = '#';
			a.onclick = function() {
				var input = document.createElement('input');
				input.type = 'file';
				input.click();

				input.onchange = function() {

					var r = confirm("Note: This will overwrite your existing Quests.");
					if (r) {
						var files = input.files;
						console.log(files);
						if (files.length <= 0) {
							return false;
						}

						var fr = new FileReader();

						fr.onload = function(e) {
							console.log(e);
							var result = JSON.parse(e.target.result);
							console.log("Setting JSON to localStorage "
									+ JSON.stringify(result));
							localStorage.clear();

							for ( var data in result) {
								if (result.hasOwnProperty(data)) {
									localStorage.setItem(data, result[data]);
								}
							}

							
							loadQuests();

						}

						fr.readAsText(files.item(0));
					}
				}

				return false;
			};
			a.textContent = "Import";

			document.getElementById('questListDiv').appendChild(a);

		}
		var adDivData = '<div id="amzn-assoc-ad-39580e4c-818e-48d7-82cd-2422456ed385"></div>'
		document.getElementById("adDiv").innerHTML = adDivData;
		loadJS(
				'//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=39580e4c-818e-48d7-82cd-2422456ed385',
				document.body);
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();

}


loadQuests();