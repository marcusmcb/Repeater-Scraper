# immport dependencies
from bs4 import BeautifulSoup
import pandas as pd
import requests
import pymongo
from pymongo import MongoClient

# MongoDB connection
conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)

# creates repeater db if it doesn't already exist
# drops stations table to avoid duplicate entries
db = client.repeater_db
db.stations.drop()

# url to scrape & soup setup
url = 'https://www.repeaterbook.com/repeaters/Display_SS.php?state_id=06&band=4&loc=%&call=%&use=%'

response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# scrapes url & pushes data to stations table in db
table_rows = soup.find_all('tr')[4:18]
for item in table_rows:
    freq = item.find('a').text
    call_sign = item.find_all('td', attrs={'class': None})[3].text
    county = item.find_all('td', attrs={'class': None})[2].text
    location = item.find(class_="w3-left-align").text
    usage = item.find('font').text
    db.stations.insert_one(
        {'location': location,
         'frequency': freq,
         'call sign': call_sign,
         'county': county,
         'usage': usage})
                    
    print(location, freq, call_sign, county, usage)

# pushes mongo db table to pandas dataframe
stations = db.stations
df = pd.DataFrame(list(stations.find()))
df = df[['call sign', 'location', 'frequency', 'county', 'usage']]
df.head(10)




