function replaceAt(string, index, replace) {
    return string.substring(0, index) + replace + string.substring(index + 1);
}

function rightPad(string, strLength, padChar) {
    var newString = string;
    for (var i = string.length; i < strLength; i++) {
        newString += padChar;
    }
    return newString;
}

function save(questId, entryId) {
    var checkbox = document.getElementById(questId + ":" + entryId);

    var storageData = localStorage.getItem("quest-"+questId);

    if (!storageData) {
        storageData = "";
    }

    storageData = rightPad(storageData, entryId, '0');
    storageData = replaceAt(storageData, entryId - 1, checkbox.checked ? 1 : 0);
    localStorage.setItem("quest-"+questId, storageData);

}


var xmlhttp = new XMLHttpRequest();
var url = "https://cdn.rawgit.com/mainstringargs/quest-conqueror/master/json/quests/starWarsSaga.json";

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        var topTitle = myObj.title;
        var topDesc = myObj.description;
        var topImgUrl = myObj.imageUrl;
        var topLinkUrl = myObj.linkURL;
        var questId = myObj.id;

        document.getElementById("topDiv").innerHTML = topDesc;

        var txt = "";
        txt += "<table align='center' border='0' cellpadding='2'>"
        for (x in myObj.questEntries) {
            var entryId = myObj.questEntries[x].id;
            var title = myObj.questEntries[x].title;
            var description = myObj.questEntries[x].description;
            var releaseDate = myObj.questEntries[x].releaseDate;
            var imageUrl = myObj.questEntries[x].imageURL;
            var amplification = myObj.questEntries[x].amplification;
            var linkURL = myObj.questEntries[x].linkURL;

            var fullTextDescription = "<b>" + title + "</b><br/><i>" + releaseDate + "</i><br/>" + description + "<br/><i>" + amplification + "</i>";

            if (imageUrl) {
                txt += "<tr><td><input class='largerSize' type='checkbox' id='" + questId + ":" + entryId + "' onclick='save(" + questId + "," + entryId + ")' /></td><td><label for='" + questId + ":" + entryId + "'>" + fullTextDescription + "</label></td><td align='center' style='min-width:50px'><a target='_blank' href='" + linkURL + "'><img src='" + imageUrl + "'></a></td></tr>";
            }
        }
        txt += "</table>"
        document.getElementById("tableDiv").innerHTML = txt;
        var questStorage = localStorage.getItem("quest-"+questId);

        if (questStorage) {
            for (var i = 0; i < questStorage.length; i++) {
                var charVal = questStorage.charAt(i);
                if (charVal == '1') {
                    var cbId = questId + ":" + (i + 1);
                    var checkbox = document.getElementById(cbId);
                    checkbox.checked = true;
                    //console.log(cbId + " " + checkbox);
                }
            }
        }
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();
