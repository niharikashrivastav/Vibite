from backend.services.gemini_service import generate_response

try:
    response = generate_response("Say hello in one sentence.")
    print("Gemini Response:", response)

except Exception as error:
    print("Gemini Test Failed:", error)