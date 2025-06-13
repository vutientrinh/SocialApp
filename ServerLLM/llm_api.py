from typing import Optional
import requests

conversation_history = []

def  my_llm_api(
    prompt: Optional[str] = None,
) -> str:
    global conversation_history  # Use global history variable to maintain conversation

    # URL of the server to which you want to send the request
    url = "http://127.0.0.1:1234/v1/chat/completions"

    # Initialize conversation history if it's the first request
    if not conversation_history:
        conversation_history = []
        conversation_history.append({"role": "user", "content": prompt})

    else:
        # Append the user message to the conversation history for subsequent requests
        conversation_history.append({"role": "user", "content": prompt})
    data = {
        "model": "llama-3.2-1b-instruct",
        "messages": conversation_history,
        "temperature": 0.7,  # Adjust temperature if necessary
        "max_tokens": -1,    # Set max tokens as needed
        "stream": False,     # Set to False for non-streaming output
    }

    # Make the POST request to the LLM API
    response = requests.post(url=url, json=data)

    # Process the response if it's successful
    if response.status_code == 200:
        content = response.json()["choices"][0]["message"]["content"]

        # Update the conversation history with the assistant's response
        conversation_history.append({"role": "assistant", "content": content})

        return content

    # Handle error response
    return f"Error: {response.status_code}, {response.text}"