import base64
from app import app, mongo
from flask import (
    request,
    jsonify,
    make_response,
    send_from_directory,
    send_file,
)
from werkzeug.security import generate_password_hash, check_password_hash
from models import *
from ai_models.text_text import text_text
from ai_models.image_to_text import imageToText
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity  # type: ignore
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
from bson import ObjectId
import os
from trasnlate.googletrans_text import translate_text
import google.generativeai as genai
from PIL import Image
from datetime import datetime, timedelta
from models import Image,Chat,User
from ai_models.speechRec import audio_recognizer
import re
from pymongo import DESCENDING

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend/uploads")
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
genai.configure(api_key="AIzaSyCoAT805oVBf-ToA_9H3MjI99nD7HuXoBk")
jwt = JWTManager(app)


@app.route("/", methods=["POST", "GET"])
def home():
    return jsonify({"Massage": "This is home"})


# # SIGNUP ROUTE - INTEGRATION DONE


@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.json
        if not data:
            return make_response(jsonify({"error": "No data received"}), 400)

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not (username and email and password):
            return make_response(
                jsonify({"error": "Missing username, email, or password"}), 400
            )

        existing_user = User.find_one_by_email(email)
        if existing_user:
            return make_response(
                jsonify(
                    {
                        "error": "User already exists. Please try another email or password."
                    }
                ),
                202,
            )
        else:
            user = User(
                username=username,
                email=email,
                password=generate_password_hash(password),
            )
            user.save_user()
            return jsonify({"message": "Successfully registered."}), 201
    except KeyError as e:
        return make_response(jsonify({"error": f"Missing field: {str(e)}"}), 400)
    except Exception as e:
        return make_response(jsonify({"error": str(e)}), 500)


@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


# # LOGIN ROUTE - INTEGRATION DONE


@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        print("Login Credentials")
        print(data)

        if not data or not data.get("email") or not data.get("password"):
            return make_response("Could not verify", 401)

        user = User.find_one_by_email(data.get("email"))

        if not user:
            return make_response("Could not verify", 401)

        if check_password_hash(user["password"], data.get("password")):
            access_token = create_access_token(
                identity=user["email"], expires_delta=timedelta(minutes=3000)
            )
            resp = jsonify(
                {
                    "message": "Login successful!",
                    "access_token": access_token,
                    "userId": str(user["_id"]),
                }
            )
            resp.set_cookie("access_token", access_token, max_age=86400)
            return resp, 200
        else:
            return make_response("Could not verify", 403)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# LOGOUT ROUTE - INTEGRATION DONE


@app.route("/logout", methods=["POST"])
def logout():
    try:
        resp = make_response(jsonify({"message": "Logout successful!"}), 200)
        resp.set_cookie("access_token", "", expires=0)
        return resp
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# # POST PROMPT ROUTE - INTEGRATION NOT DONE


@app.route("/chats/<string:_id>", methods=["POST"])
@jwt_required()
def create_chat(_id):
    try:
        id = ObjectId(_id)
        user_data = User.find_one_by_id(id)
        if not user_data:
            return jsonify({"error": "User not found"}), 404

        user = User(user_data["username"], user_data["email"], user_data["password"])
        current_user_email = user.email

        data = request.json
        prompt = data.get("prompt")
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        responseData = text_text(prompt)

        # Save chat with timestamp
        timestamp = datetime.now()
        new_chat = Chat(
            email=current_user_email,
            prompt=prompt,
            responseData=responseData,
            timestamp=timestamp,
        )
        new_chat.save_chat()

        return (
            jsonify(
                {
                    "message": "Chat created successfully!",
                    "chat": {
                        "email": current_user_email,
                        "prompt": new_chat.prompt,
                        "responseData": new_chat.responseData,
                        "timestamp": str(timestamp),  # Convert timestamp to string
                    },
                }
            ),
            201,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# # GET RESPONSE ROUTE - INTEGRATION NOT DONE
# GET  DATES


from flask import jsonify
from bson import ObjectId
from datetime import datetime  # Import datetime library


@app.route("/chats/dates/<string:user_id>", methods=["GET"])
@jwt_required()
def get_user_chat_dates(user_id):
    try:
        user_object_id = ObjectId(user_id)

        user_data = User.find_one_by_id(user_object_id)
        if not user_data:
            return jsonify({"error": "User not found"}), 404
        user_email = user_data["email"]

        distinct_dates = mongo.db.chats.distinct("timestamp", {"email": user_email})
        formatted_dates = set()
        timestamp_format = "%A, %d/%m/%y, %H:%M:%S" 
        for date_str in distinct_dates:
            timestamp = datetime.strptime(date_str, timestamp_format)
            formatted_date_str = timestamp.strftime("%Y-%m-%d")
            formatted_dates.add(formatted_date_str)

        sorted_dates = sorted(list(formatted_dates), reverse=True)

        return jsonify({"dates": sorted_dates}), 200

    except Exception as e:
        print("Error in fetching user chat dates:", e)
        return jsonify({"error": "Internal server error"}), 500


from datetime import datetime, timedelta


@app.route("/chats/<string:user_id>/<string:date>", methods=["GET"])
@jwt_required()
def get_user_chats_by_date(user_id, date):
    try:
        user_object_id = ObjectId(user_id)
        user_data = User.find_one_by_id(user_object_id)
        if not user_data:
            return jsonify({"error": "User not found"}), 404
        user_email = user_data["email"]

        # Corrected the date format here
        date_object = datetime.strptime(date, "%Y-%m-%d")

        formatted_date = date_object.strftime("%d-%m-%y")

        # Get today's date
        today_date = datetime.now().date()

        chats = list(
            mongo.db.chats.find(
                {"email": user_email, "timestamp": {"$regex": f".*{formatted_date}.*"}}
            )
        )
        chats_list = [
            {
                "_id": str(chat["_id"]),
                "date": chat["timestamp"].split(", ")[1].strip(),
                "prompt": chat["prompt"],
                "responseData": chat["responseData"],
            }
            for chat in chats
            if datetime.strptime(
                chat["timestamp"].split(", ")[1].strip(), "%d-%m-%y"
            ).date()
            != today_date
        ]

        print("DATE FETCHED CHATS")
        print(chats_list)

        return jsonify({"chats": chats_list}), 200

    except Exception as e:
        print("Error in fetching user chats by date:", e)
        return jsonify({"error": "Internal server error"}), 500


# # PROFILE ROUTE - INTEGRATION DONE


@app.route("/profile/<string:_id>", methods=["GET"])
@jwt_required()
def get_profile(_id):
    try:
        user_id = ObjectId(_id)
        user_details = mongo.db.users.find_one({"_id": user_id})

        if not user_details:
            return jsonify({"error": "User not found"}), 404

        user_email = user_details.get("email")
        current_user_email = get_jwt_identity()

        if current_user_email != user_email:
            return jsonify({"error": "Unauthorized access"}), 403

        profile_data = {
            "username": user_details["username"],
            "email": user_email,
        }

        chat_details = list(mongo.db.chats.find({"email": current_user_email}))

        chats = []
        for chat in chat_details:
            chat_data = {
                "_id": str(chat["_id"]),
                "email": chat["email"],
                "prompt": chat["prompt"],
                "responseData": chat["responseData"],
                "timestamp": chat["timestamp"],
            }
            chats.append(chat_data)

        # print("Profile Data:", profile_data)
        # print("Chat Data:", chats)

        return jsonify({"profile_data": profile_data, "chats": chats}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/chats/translate/<string:_id>", methods=["POST"])
@jwt_required()
def translate_chat(_id):
    chat = mongo.db.chats.find_one({"_id": ObjectId(_id)})

    if not chat:
        return {"message": "Chat not found"}, 404

    response_data = chat.get("responseData")

    target_language = request.json.get("targetLanguage")
    if not target_language:
        return {"message": "Target language not provided"}, 400

    translated_text = translate_text(response_data, target_language)
    mongo.db.chats.update_one(
        {"_id": ObjectId(_id)}, {"$set": {"responseData": translated_text}}
    )

    return {"translated_text": translated_text}


# IMAGE TO TEXT


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# # CHAT - IMAGE

# NOT WORKING FOR IMAGE
@app.route("/chats/image/<string:userId>", methods=["POST"])
@jwt_required()
def upload_image(userId):
    try:
        user_id = ObjectId(userId)
        user_details_cursor = mongo.db.users.find({"_id": user_id})
        user_details = list(user_details_cursor)  # Convert cursor to list of documents

        if not user_details:
            return jsonify({"status": "failed", "error": "User not found"}), 404

        user_email = user_details[0].get("email")  # Assuming user details are unique

        data = request.json

        if not data or "img" not in data or "prompt" not in data:
            return (
                jsonify({"status": "failed", "error": "No image or prompt provided"}),
                400,
            )

        prompt = data["prompt"]
        img_data = data["img"]

        if not img_data:
            return jsonify({"status": "failed", "error": "No image data provided"}), 400

        if allowed_file(img_data["filename"]):
            filename = secure_filename(img_data["filename"])
            filename, file_extension = os.path.splitext(filename)
            current_datetime = datetime.now().strftime("%Y%m%d%H%M%S")
            unique_filename = f"image-{current_datetime}img{file_extension}"
            image_path = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)

            with open(image_path, "wb") as f:
                f.write(base64.b64decode(img_data["data"]))

            responseData = imageToText(prompt, image_path)

            # Save image data to the images model
            image_data = Image(
                email=user_email,
                prompt=prompt,
                image=unique_filename,
                responseData=responseData,
            )

            image_data.save_image()

            return (
                jsonify(
                    {
                        "status": "success",
                        "message": "Image saved successfully",
                        "filename": unique_filename,
                        "responseData": responseData,
                    }
                ),
                200,
            )
        else:
            return (
                jsonify({"status": "failed", "error": "File type is not allowed"}),
                400,
            )
    except Exception as e:
        print("ERROR IN IMAGE UPLOAD:", e)
        return jsonify({"status": "failed", "error": "Internal server error"}), 500


UPLOAD_FOLDER = "frontend/uploads"


import mimetypes
# NOT WORKING FOR IMAGE

@app.route("/frontend/uploads/<path:filename>", methods=["GET"])
def serve_image(filename):
    try:
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        mimetype = mimetypes.guess_type(file_path)[0]
        return send_file(file_path, mimetype=mimetype)
    except FileNotFoundError:
        os.abort(404)

# NOT WORKING FOR IMAGE
@app.route("/chats/image/<string:userId>", methods=["GET"])
@jwt_required()
def get_upload_file(userId):
    try:
        user_id = ObjectId(userId)
        print(f"Received userId: {userId}")
        user_details = mongo.db.users.find_one({"_id": user_id})
        print("GET CHAT IMAGE")
        print(user_details)
        if not user_details:
            return jsonify({"error": "User not found"}), 404
        current_user_email = get_jwt_identity()
        user_email = user_details.get("email")
        if current_user_email != user_email:
            return jsonify({"error": "Unauthorized access"}), 403
        chats = list(mongo.db.images.find({"email": user_email}))
        chats_list = [
            {
                "prompt": chat["prompt"],
                "responseData": chat["responseData"],
                "timestamp": chat["timestamp"],
                "imageUrl": f"/backend/uploads/{chat['image']}",
            }
            for chat in chats
        ]
        print(chats_list)
        return jsonify({"chats": chats_list}), 200
    except Exception as e:
        print("ERROR IN IMAGE UPLOAD:", e)
        return jsonify({"error": "Internal server error"}), 500
# SPEECH RECOGNITION


@app.route("/chats/voice", methods=["POST"])
def speech_upload():
    if request.method == "POST":
        print("Voice")
        recognized_text = audio_recognizer()
        print(recognized_text)
        return jsonify({"recognized_text": recognized_text}), 200
