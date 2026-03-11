from openai import OpenAI
from dotenv import load_dotenv
import os
load_dotenv()


messages = [
        {
            "role": "system",
            "content": "You are a helpful assistant"
        }
]

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
def getResponse(messages):
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=messages
    )
    return response.choices[0].message.content

while True:
    user = input("> ")
    messages.extend(
    [{
        "role": "user",
        "content": user,
    },
    {
        "role": "system",
        "content": getResponse(messages)
    }])
    print(getResponse(messages))
