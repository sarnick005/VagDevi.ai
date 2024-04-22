from googletrans import Translator


def translate_text(text, target_language):
    translator = Translator()
    translated_text = translator.translate(text, dest=target_language)
    return translated_text.text


# text_to_translate = input("Enter text to translate: ")
# target_language = input("Enter text to translate: ")
# translated_text = translate_text(text_to_translate, target_language)
# print("Translated text:", translated_text)
