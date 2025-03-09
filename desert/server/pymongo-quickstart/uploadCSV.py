import csv
from pymongo import MongoClient

uri = "mongodb+srv://connectDbUser:CMudZGSrCAKg9hhq@cluster0.zir54.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

def csv_to_mongodb(csv_file_path, mongodb_uri, database_name, collection_name):
    """
    Reads a CSV file and uploads it into a MongoDB collection.

    Args:
        csv_file_path (str): The path to the CSV file.
        mongodb_uri (str): The MongoDB connection URI.
        database_name (str): The name of the MongoDB database.
        collection_name (str): The name of the MongoDB collection.
    """
    try:
        # Connect to MongoDB
        client = MongoClient(mongodb_uri)
        db = client[database_name]
        collection = db[collection_name]

        # Read the CSV file and insert data into MongoDB
        with open(csv_file_path, 'r', newline='', encoding='utf-8-sig') as csvfile:
            reader = csv.DictReader(csvfile)
            data = list(reader)  # Read all rows into a list of dictionaries.
            if data: #only insert if there is data.
                collection.insert_many(data)
                print(f"Successfully uploaded {len(data)} documents to {database_name}.{collection_name}")
            else:
                print("CSV file is empty.")

    except FileNotFoundError:
        print(f"Error: CSV file not found at {csv_file_path}")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if 'client' in locals() and client:
            client.close() #close the connection, even if an exception occured.

# Example usage:
if __name__ == "__main__":
    csv_file = "data.csv"  # Replace with your CSV file path
    mongo_uri = "mongodb://localhost:27017/"  # Replace with your MongoDB URI
    db_name = "mydatabase"  # Replace with your database name
    col_name = "mycollection"  # Replace with your collection name

    csv_to_mongodb("basicPovertyList.csv", uri, "map_data", "places")
