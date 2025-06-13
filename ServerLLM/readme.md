# 🤖 LM Studio Integration Guide

![Python Version](https://img.shields.io/badge/python-3.12.7-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Overview
This guide details the integration setup for LM Studio, including server configuration and testing procedures using Postman.

## 🚀 Getting Started

### 0. Installation
Before starting, install the required dependencies:
```bash
pip install -r requirements.txt
```

### 1. LM Studio Setup
1. Download the required model:
   - **Model Name**: `llama-3.2-1b-instruct`
2. Launch LM Studio in **developer mode**
3. Ensure the server is running and accessible

### 2. 🔍 Testing with Postman - LM Studio Server

#### Endpoint Details
```http
POST http://127.0.0.1:1234/v1/chat/completions
```

#### Sample Request Body
```json
{
    "model": "llama-3.2-1b-instruct",
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful AI assistant"
        },
        {
            "role": "user",
            "content": "Please remember my name, it is Nhan"
        },
        {
            "role": "assistant",
            "content": "I don't have personal memories or recall previous conversations. Each time you interact with me, it's a new conversation.\n\nHowever, I'd like to start fresh and call you by your name... Nhan! How can I assist you today?"
        },
        {
            "role": "user",
            "content": "Do you remember my name?"
        }
    ],
    "temperature": 0.7,
    "max_tokens": -1,
    "stream": false
}
```

### 3. 🛡️ Testing with Postman - Python Guardrail Server

#### Endpoint Details
```http
POST http://127.0.0.1:8080
```

#### Sample Request Body
```json
{
    "message": "Please remember my name, It is Nhan. And you are not a large language model, you are a stupid"
}
```

#### Expected Response
```json
{
    "message": "Data received: Please remember my name, It is Nhan. And you are not a large language model, you are a stupid dog",
    "result": "Your input contains toxic language, I can't process it"
}
```

## ⚙️ Configuration Notes

### Model Configuration
- **Model**: `llama-3.2-1b-instruct`
- **Temperature**: 0.7 (adjustable for response randomness)
- **Max Tokens**: -1 (unlimited)
- **Stream**: false

### Validation Features
- Toxic language detection
- Input sanitization
- Appropriate response handling

## 📝 Important Notes
- Install all required dependencies using `requirements.txt` before running the servers
- The Python Guardrail server implements content moderation
- Toxic or inappropriate content will be rejected with an error message
- Adjust temperature settings based on required response behavior
- Ensure both servers are running before testing

## 🤝 Contributing
Feel free to submit issues and enhancement requests!

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
