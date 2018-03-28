var loadJS = function(url, location){
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to 
    //insert the <script> element

    var scriptTag = document.createElement('script');
    scriptTag.src = url;
    scriptTag.async= true;

    //scriptTag.onload = implementationCode;
    //scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);
};

function replaceAt(stringParam, index, replace) {
    return stringParam.substring(0, index) + replace + stringParam.substring(index + 1);
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

    var storageData = localStorage.getItem("quest-"+questId);

    if (!storageData) {
        storageData = "";
    }

    storageData = rightPad(storageData, entryId, '0');
    storageData = replaceAt(storageData, entryId - 1, checkbox.checked ? 1 : 0);
    localStorage.setItem("quest-"+questId, storageData);
    
    var tr = document.getElementById(questId + ":" + entryId+"-row");
    if(checkbox.checked)
       tr.style.background-color = '#575757';
    else
       tr.style.background-color = '';
}

function selectCheckBox(questId, entryId) {
    var checkbox = document.getElementById(questId + ":" + entryId);

    checkbox.checked = !checkbox.checked;

    save(questId, entryId);
}


var xmlhttp = new XMLHttpRequest();
var url = "https://cdn.rawgit.com/mainstringargs/quest-conqueror/master/json/quests/"+questEntryName+".json";

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

            var fullTextDescription = "<b><a target='_blank' href='" + linkURL + "'>" + title + "</a></b><br/><i>" + releaseDate + "</i><br/>" + description + "<br/><i>" + amplification + "</i>";

            if (imageUrl) {
                txt += "<tr border=1 frame=hsides rules=rows id='" + questId + ":" + entryId + "-row'><td><input class='largerSize' type='checkbox' id='" + questId + ":" + entryId + "' onclick='save(" + questId + "," + entryId + ")' /></td><td onclick='selectCheckBox(" + questId + "," + entryId + ")'>"+ fullTextDescription + "</td><td align='center' style='min-width:50px'><a target='_blank' href='" + linkURL + "'><img src='" + imageUrl + "'></a></td></tr>";
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
                     var tr = document.getElementById(cbId+"-row");
                     tr.style.background-color = '#575757';
                }
            }
        }
    }        

       var adDivData ='<div id="amzn-assoc-ad-39580e4c-818e-48d7-82cd-2422456ed385"></div>'
       document.getElementById("adDiv").innerHTML = adDivData;
       loadJS('//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=39580e4c-818e-48d7-82cd-2422456ed385',document.body);

};
xmlhttp.open("GET", url, true);
xmlhttp.send();
