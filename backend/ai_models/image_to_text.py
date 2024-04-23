from PIL import Image
import os
import google.generativeai as genai


def imageToText(prompt, image_path):
    try:
        image = Image.open(image_path)
        genai.configure(api_key="AIzaSyCoAT805oVBf-ToA_9H3MjI99nD7HuXoBk")
        model = genai.GenerativeModel("gemini-pro-vision")
        prompt = [prompt, image]
        response = model.generate_content(prompt, stream=True)
        response.resolve()
        text = response.text
        return text
    except:
        print("ERROR IN IMAGE TO TEXT")
