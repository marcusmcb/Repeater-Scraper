# python dependencies
from bs4 import BeautifulSoup
import pymongo
from pymongo import MongoClient
import requests
from flask import Flask, render_template, jsonify
import geocoder

# create flask app
app = Flask(__name__)


# mongo connection
conn = 'mongodb://localhost:27017'

# connection to pymongo
client = pymongo.MongoClient(conn)

# database connection
db = client.repeater_db
print("Before Drop")

# drops stations tables to avoid duplicates
db.stations.drop()

#db.stations.drop()
print("After Drop")
# url to scrape & soup setup
url = 'https://www.repeaterbook.com/repeaters/Display_SS.php?state_id=06&band=4&loc=%&call=%&use=%'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# initialize variable to concat to location for use w/geocoder
california = ', CA'

# scrapes url & pushes data to stations table in db
table_rows = soup.find_all('tr')[4:1185]

# for loop to pull out data from each result
for item in table_rows:

     # scrapes call-sign
     callsign = item.find_all('td', attrs={'class': None})[3].text

     # if/else statement to check for blank call-sign
     if callsign != "": 

          # scrapes repeater location's county                      
          county = item.find_all('td', attrs={'class': None})[2].text

          # if/else statement to narrow list down to just LA & OC repeaters
          if county == "Orange" or county == "Los Angeles" or county == "Riverside" or county == "San Diego" or county == "San Bernardino" or county == "Ventura":

               # scrapes remaining values
               usage = item.find('font').text.strip()
               freq = item.find('a').text               
               county = item.find_all('td', attrs={'class': None})[2].text
               location = item.find(class_="w3-left-align").text.split(",")[0].strip()               

               # pulls location coordinates from geocoder
               lat = geocoder.osm(location + california).lat
               lng = geocoder.osm(location + california).lng
               print('Data Added')
                    
               # push result to mongodb
               db.stations.insert_one(
                    {'location': location,
                    'latitude': lat,
                    'longitude': lng,
                    'frequency': freq,
                    'call_sign': callsign,
                    'county': county,
                    'usage': usage})
               
          else:
               pass
     else:
          pass

# set home route
@app.route('/')
def index():
     stationlist = list(db.stations.find({},{'_id':0}))     
     return render_template('index.html', stationlist=stationlist)

# set data route from scrape to manipulate w/javascript
@app.route("/api/repeaters")
def repeaters():
     results = list(db.stations.find({},{'_id':0}))
     return jsonify(results)

if __name__ == "__main__":
     app.run(debug=True, use_reloader=False)