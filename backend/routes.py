from app import app, mongo
from flask import request, jsonify, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from models import User, Chat
from ai_models.text_text import text_text
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity  # type: ignore
from datetime import datetime, timedelta
from bson import ObjectId

jwt = JWTManager(app)

from datetime import datetime, timedelta


@app.route("/", methods=["POST", "GET"])
def home():
    return jsonify({"Massage": "This is home"})


# SIGNUP ROUTE - INTEGRATION DONE


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


# LOGIN ROUTE - INTEGRATION DONE


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


# POST PROMPT ROUTE - INTEGRATION NOT DONE


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


# GET RESPONSE ROUTE - INTEGRATION NOT DONE


@app.route("/chats/<string:_id>", methods=["GET"])
@jwt_required()
def get_all_users(_id):
    try:
        id = ObjectId(_id)
        user_data = User.find_one_by_id(id)
        if not user_data:
            return jsonify({"error": "User not found"}), 404
        user = User(user_data["username"], user_data["email"], user_data["password"])

        current_user_email = user.email
        print(current_user_email)
        chats = list(mongo.db.chats.find({"email": current_user_email}))
        if not chats:
            return jsonify({}), 201

        chats_list = [
            {
                "prompt": chat["prompt"],
                "responseData": chat["responseData"],
                "timestamp": chat["timestamp"],
            }
            for chat in chats
        ]

        return jsonify({"chats": chats_list}), 200
    except Exception as e:
        print("Error in db fetching:", e)


# PROFILE ROUTE - INTEGRATION DONE


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

        print("Profile Data:", profile_data)
        print("Chat Data:", chats)

        return jsonify({"profile_data": profile_data, "chats": chats}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
