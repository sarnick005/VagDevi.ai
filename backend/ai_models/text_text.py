import google.generativeai as genai
from config import Config

GEMINI_API_KEY = Config.GEMINI_API_KEY


def text_text(prompt):
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        generation_config = {
            "temperature": 0.9,
            "top_p": 1,
            "top_k": 1,
            "max_output_tokens": 2048,
        }
        model = genai.GenerativeModel("gemini-pro")

        response = model.generate_content(prompt, stream=True)

        # Process each chunk of the response
        responseData = ""
        for chunk in response:
            responseData += chunk.text.replace("*", "")

        return responseData
    except Exception as e:
        print(f"Error: {e}")
