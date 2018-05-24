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

function replaceAt(stringParam, index, replace) {
	return stringParam.substring(0, index) + replace
			+ stringParam.substring(index + 1);
}

function rightPad(stringParam, newStrLength, padChar) {
	var newString = stringParam;
	for (var i = stringParam.length; i < newStrLength; i++) {
		newString += padChar;
	}
	return newString;
}

function save(questId, entryId) {
	var checkbox = document.getElementById(questId + ":" + entryId);

	var storageData = localStorage.getItem("quest-" + questId);

	if (!storageData) {
		storageData = "";
	}

	storageData = rightPad(storageData, entryId, '0');
	storageData = replaceAt(storageData, entryId - 1, checkbox.checked ? 1 : 0);
	localStorage.setItem("quest-" + questId, storageData);

	var tr = document.getElementById(questId + ":" + entryId + "-row");
	if (checkbox.checked) {
		tr.style.backgroundColor = '#575757';

		questCounts["questEntry-" + questId + "-numStepsCompleted"]++;
	} else {
		tr.style.backgroundColor = '';
		questCounts["questEntry-" + questId + "-numStepsCompleted"]--;
	}

	updateQuestCount(questId);
}

function getItemsChecked(string) {
    var count = 0;
    for (var i=0; i<string.length;i++) {
        var character = string.charAt(i);
        if(character=='1'){
        	count++;
        }
    }

    return count;
};

function selectCheckBox(questId, entryId) {
	var checkbox = document.getElementById(questId + ":" + entryId);

	checkbox.checked = !checkbox.checked;

	save(questId, entryId);
}

var questCounts = {};

function updateQuestCount(questId) {

	var totalSteps = questCounts["questEntry-" + questId + "-totalSteps"];
	var numStepsCompleted = questCounts["questEntry-" + questId
			+ "-numStepsCompleted"];

	var divStatement = "";

	if ((totalSteps - numStepsCompleted) == 1) {
		divStatement = "<i>" + (totalSteps - numStepsCompleted)
				+ " item left. Almost there! Keep Slaying!</i>";
	} else if ((totalSteps - numStepsCompleted) > 0) {
		divStatement = "<i>" + (totalSteps - numStepsCompleted)
				+ " items left in this Quest. Keep Slaying!</i>";
	} else {
		divStatement = "<b>Amazing! You've Slayed this Quest!</b>";
	}
	document.getElementById("questEntryScoreDiv-" + questId + "-top").innerHTML = divStatement;
	document.getElementById("questEntryScoreDiv-" + questId + "-bottom").innerHTML = divStatement;
}

function loadQuestEntry(entryId) {

	var queryListJsonRequest = new XMLHttpRequest();
	var queryListUrl = "https://cdn.rawgit.com/mainstringargs/quest-slayer/"
			+ gitCdnHash + "/json/quests/questList.json";

	queryListJsonRequest.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var queryListItem = JSON.parse(this.responseText);

			var queryItem = queryListItem.filter(function(obj) {
				return obj.id == entryId;
			});

			var url = "https://cdn.rawgit.com/mainstringargs/quest-slayer/"
					+ gitCdnHash + queryItem[0].jsonURL;

			var xmlhttp = new XMLHttpRequest()

			xmlhttp.onreadystatechange = function() {

				if (this.readyState == 4 && this.status == 200) {
					var myObj = JSON.parse(this.responseText);
					var topTitle = myObj.title;
					var topDesc = myObj.description;
					var topImgUrl = myObj.imageURL;
					var topLinkUrl = myObj.linkURL;
					var questId = myObj.id;

					var affiliateInfo = "<div style='text-align: right;'>Note: Links are through the Amazon Affiliate program.<br/>Help support Quest Slayer by using them!</div>";
					
					topDesc = "<table border='0' cellpadding='2'><tr><td align='center' style='min-width:50px'><a target='_blank' href='"
							+ topLinkUrl
							+ "'><img src='"
							+ topImgUrl
							+ "'></a></td><td>"
							+ topDesc + "<br />"+ affiliateInfo
							+ "</td></tr></table>"
							

							
					var entryHtml = topDesc 
							+ "<br /><div style='text-align: right;' id='questEntryScoreDiv-"
							+ questId + "-top'></div><br />";

					document.getElementById("questEntryDiv-" + questId).innerHTML = entryHtml;

					var totalSteps = 0;

					var txt = "";
					txt += "<table align='center' order=2 frame=hsides rules=rows cellpadding='2'>"
					for (x in myObj.questEntries) {
						var entryId = myObj.questEntries[x].id;
						var title = myObj.questEntries[x].title;
						var description = myObj.questEntries[x].description;
						var releaseDate = myObj.questEntries[x].releaseDate;
						if(!releaseDate){
							releaseDate = myObj.questEntries[x].openDate;
						}
						
						var imageUrl = myObj.questEntries[x].imageURL;
						var amplification = myObj.questEntries[x].amplification;
						var linkURL = myObj.questEntries[x].linkURL;

						var fullTextDescription = "<b><a target='_blank' href='"
								+ linkURL
								+ "' onclick='event.stopImmediatePropagation();'>"
								+ title
								+ "</a></b><br/><i>"
								+ releaseDate
								+ "</i><br/>"
								+ description
								+ "<br/><i>"
								+ amplification + "</i>";

						if (imageUrl) {
							txt += "<tr id='"
									+ questId
									+ ":"
									+ entryId
									+ "-row'><td><input class='largerSize' type='checkbox' id='"
									+ questId
									+ ":"
									+ entryId
									+ "' onclick='save("
									+ questId
									+ ","
									+ entryId
									+ ")' /></td><td onclick='selectCheckBox("
									+ questId
									+ ","
									+ entryId
									+ ")'>"
									+ fullTextDescription
									+ "</td><td align='center' style='min-width:50px'><a target='_blank' href='"
									+ linkURL + "'><img width='140' src='" + imageUrl
									+ "'></a></td></tr>";
							totalSteps++;
						}
					}

					questCounts["questEntry-" + questId + "-totalSteps"] = totalSteps

					txt += "</table>"
					entryHtml += txt;
					entryHtml += "<br /><br /><div style='text-align: right;' id='questEntryScoreDiv-"
							+ questId + "-bottom'></div><br />";

					document.getElementById("questEntryDiv-" + questId).innerHTML = entryHtml;

					var adDivData = '<div id="amzn-assoc-ad-39580e4c-818e-48d7-82cd-2422456ed385"></div>'
					entryHtml += adDivData;

					document.getElementById("questEntryDiv-" + questId).innerHTML = entryHtml;
					loadJS(
							'//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=39580e4c-818e-48d7-82cd-2422456ed385',
							document.body);

					var numStepsCompleted = 0;
					var questStorage = localStorage.getItem("quest-" + questId);

					if (questStorage) {
						for (var i = 0; i < questStorage.length; i++) {
							var charVal = questStorage.charAt(i);
							if (charVal == '1') {
								var cbId = questId + ":" + (i + 1);
								var checkbox = document.getElementById(cbId);
								if (checkbox) {
									checkbox.checked = true;

									var tr = document.getElementById(cbId
											+ "-row");
									tr.style.backgroundColor = '#575757';
									numStepsCompleted++;
								}
							}
						}
					}

					questCounts["questEntry-" + questId + "-numStepsCompleted"] = numStepsCompleted

					updateQuestCount(questId);

				}

			};
			xmlhttp.open("GET", url, true);
			xmlhttp.send();

		}
	};

	queryListJsonRequest.open("GET", queryListUrl, true);
	queryListJsonRequest.send();

}
