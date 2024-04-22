from gtts import gTTS
import os


def text_to_speech(text):
    text = text
    language = "en"

    tts = gTTS(text=text, lang=language, slow=False)

    tts.save("output.mp3")
    if text:
        audio_data = b"Some binary audio data"
        return audio_data
    else:
        return None
