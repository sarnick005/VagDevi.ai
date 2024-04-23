import speech_recognition as sr


def audio_recognizer():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        recognizer.adjust_for_ambient_noise(source)
        try:
            audio = recognizer.listen(source, timeout=5)
            print("Recognizing...")
            text = recognizer.recognize_google(audio)
            return text
        except sr.UnknownValueError:
            print("Sorry, could not understand audio.")
            return "Couldn't recognize voice!"
        except sr.RequestError as e:
            print("Could not request results; {0}".format(e))
            return "Couldn't recognize voice!"
        except sr.WaitTimeoutError:
            print("No speech detected within the specified time.")
            return "Couldn't recognize voice!"


