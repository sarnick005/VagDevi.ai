from app import mongo
from bson import ObjectId
from datetime import datetime


# USER MODEL
class User:
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

    def save_user(self):
        mongo.db.users.insert_one(
            {
                "username": self.username,
                "email": self.email,
                "password": self.password,
            }
        )

    @staticmethod
    def find():
        return mongo.db.users.find()

    @staticmethod
    def find_one_by_email(email):
        return mongo.db.users.find_one({"email": email})

    @staticmethod
    def find_one_by_id(_id):
        return mongo.db.users.find_one({"_id": ObjectId(_id)})


# CHAT MODEL
class Chat:

    def __init__(self, email, prompt, responseData, timestamp=datetime.now()):
        self.email = email
        self.prompt = prompt
        self.responseData = responseData
        self.timestamp = timestamp 

    def save_chat(self):
        chat = {
            "email": self.email,
            "prompt": self.prompt,
            "responseData": self.responseData,
            "timestamp": self.timestamp,
        }
        mongo.db.chats.insert_one(chat)

    @staticmethod
    def find_chat(email):
        return mongo.db.chats.find({"email": email})
