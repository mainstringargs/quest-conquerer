import os
import json
import requests
from requests import get  # to make GET request


def download(url, file_name):
    # open in binary mode
    with open(file_name, "wb") as file:
        # get request
        response = get(url)
        # write to file
        file.write(response.content)

rootURL = "https://cdn.jsdelivr.net/gh/mainstringargs/quest-slayer@master/images/"

for file in os.listdir("."):
    if file.endswith(".json"):
        with open(file) as json_file:
            data = json.load(json_file)
            if('imageURL' in data and data['imageURL']!='imageURL'):
                #print(data['title'] +" " + " "+data['imageURL'])
                imgFileName = data['title'].replace("–","_").replace(" ","_").replace("(","_").replace(")","_").replace(",","_").replace(":","_").replace("?","_")+".jpg";
                download(data['imageURL'],"../../images/"+imgFileName)
                data['imageURL'] = rootURL + imgFileName;

                r = requests.head(data['linkURL'], allow_redirects=True)
                data['linkURL'] = (r.url.replace('questconquerer-20','mainstringarg-20'))

                for questItem in data['questEntries']:
                    if('imageURL' in questItem and questItem['imageURL']!='imageURL' and questItem['imageURL']!=''):
                        #print(questItem['title'] + " "+ questItem['imageURL'])
                        imgFileName = questItem['title'].replace("–","_").replace(" ","_").replace("(","_").replace(")","_").replace(",","_").replace(":","_").replace("?","_")+".jpg";
                        download(questItem['imageURL'],"../../images/"+imgFileName)
                        questItem['imageURL'] = rootURL + imgFileName;

                        r = requests.head(questItem['linkURL'], allow_redirects=True)
                        questItem['linkURL'] = (r.url.replace('questconquerer-20','mainstringarg-20'))

            with open(file, 'w') as outfile:
                json.dump(data, outfile,  indent=4)
