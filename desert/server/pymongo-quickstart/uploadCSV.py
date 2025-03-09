import pandas as pd
from pymongo import MongoClient

uri = "mongodb+srv://connectDbUser:CMudZGSrCAKg9hhq@cluster0.zir54.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(uri)
database = client['map_data']
collection = database['places']

def csv_to_json(filename, header=None):
    data = pd.read_csv(filename, header=header)
    return data.to_dict('records')

collection.insert_many(csv_to_json('basicPovertyList.csv'))
