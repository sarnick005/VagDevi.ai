from PIL import Image
import os
import google.generativeai as genai
from config import Config
GEMINI_API_KEY = Config.GEMINI_API_KEY

def imageToText(prompt, image_path):
    try:
        image = Image.open(image_path)
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-pro-vision")
        prompt = [prompt, image]
        response = model.generate_content(prompt, stream=True)
        response.resolve()
        text = response.text
        return text
    except Exception as e:
        print("ERROR IN IMAGE TO TEXT:", e)
