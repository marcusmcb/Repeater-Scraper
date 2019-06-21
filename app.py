# python dependencies
from bs4 import BeautifulSoup
import pymongo
from pymongo import MongoClient
import requests
from flask import Flask, render_template

# create flask app
app = Flask(__name__)

# mongo connection
conn = 'mongodb://localhost:27017'

# connection to pymongo
client = pymongo.MongoClient(conn)

# database connection
db = client.repeater_db

# drops stations tables to avoid duplicates
db.stations.drop()

# url to scrape & soup setup
url = 'https://www.repeaterbook.com/repeaters/Display_SS.php?state_id=06&band=4&loc=%&call=%&use=%'

response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# scrapes url & pushes data to stations table in db
table_rows = soup.find_all('tr')[4:18]

for item in table_rows:
    freq = item.find('a').text
    callsign = item.find_all('td', attrs={'class': None})[3].text
    county = item.find_all('td', attrs={'class': None})[2].text
    location = item.find(class_="w3-left-align").text
    usage = item.find('font').text.strip()
    db.stations.insert_one(
        {'location': location,
         'frequency': freq,
         'call_sign': callsign,
         'county': county,
         'usage': usage})

# set route
@app.route('/')
def index():
     stationlist = list(db.stations.find())
     print(stationlist)
     return render_template('index.html', stationlist=stationlist)

if __name__ == "__main__":
     app.run(debug=True)

