from pymongo import MongoClient

uri = "mongodb+srv://connectDbUser:CMudZGSrCAKg9hhq@cluster0.zir54.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri)

try:
	database = client.get_database("map_data")
	places = database.get_collection("places")
	
	query = { "name": "Merced" }
	place = places.find_one(query)
	
	print(place)
	
	client.close()
	
except Exception as e:
    raise Exception("Unable to find the document due to the following error: ", e)
