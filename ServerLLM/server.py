from flask import Flask, request, jsonify
from guardrails import Guard
from guardrails.hub import ToxicLanguage
from flask_cors import CORS  # Import CORS
from llm_api import my_llm_api  # Import the my_llm_api function

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

guard = Guard()
guard.name = 'toxic_language_guard'
guard.use(ToxicLanguage(threshold=0.5,
          validation_method="sentence", on_fail="noop"))

@app.route('/', methods=['POST'])
def handle_post():
    data = request.get_json()
    message = "You are a helpful AI assistant, you can summary the content : "+ data.get("message")
    llm_output = my_llm_api(prompt=message)
    return jsonify(message="Data received: " + message, result=llm_output), 200


@app.route('/ToxicLanguage', methods=['POST'])
def handle_toxic_language():
    data = request.get_json()
    message = data.get("message")
    input_validation = guard.validate(message)
    if not input_validation.validation_passed:
        return jsonify(message="Data received: " + message,
                       result="Your input contains toxic language, I can't process it",
                       passValidate=False), 200
    return jsonify(message="Data received: " + message, passValidate=True), 200


if __name__ == "__main__":
    app.run(port=8082, host="0.0.0.0")  # Debugging enabled here
