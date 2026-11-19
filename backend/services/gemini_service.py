
import time
from google import genai
from google.genai.errors import ServerError
from backend.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)


def generate_response(prompt):

    for attempt in range(3):

        try:
            response = client.models.generate_content(
                model="gemini-3.5-flash",
                contents=prompt,
                config={"http_options": {"timeout": 120000}}
            )

            return response.text

        except ServerError as error:

            if attempt == 2:
                raise error

            print("Gemini is temporarily unavailable. Retrying...")
            time.sleep(2 * (attempt + 1))
