🌡️ AI-Based Real-Time Heat Stress & Environmental Risk Detection System
📌 Overview

This project is an AI-powered system that detects real-time human heat stress using computer vision and combines it with environmental data to predict personalized heat exhaustion risk.

Unlike traditional weather applications that only show temperature or AQI, this system analyzes both:

Internal physiological stress (via webcam)

External environmental stress (via weather APIs)

It then generates a hybrid risk score and provides preventive recommendations to reduce heat-related illnesses.

🚨 Problem Statement

With increasing heatwaves due to climate change, especially in countries like India, heatstroke and dehydration cases are rising among:

Construction workers

Farmers

Traffic police

Outdoor delivery personnel

Elderly individuals

Existing platforms such as AccuWeather only provide general weather data and do not assess individual physiological stress levels.

There is a lack of personalized, real-time heat risk prediction systems.

💡 Proposed Solution

This system integrates:

1️⃣ Physiological Stress Detection (Computer Vision)

Using:

OpenCV

MediaPipe

Deep Learning (CNN/ML Model)

It analyzes:

Facial redness

Eye fatigue (blink rate & eye aspect ratio)

Skin brightness variation

Micro facial stress cues

Output:

Physiological Stress Score (0–100)

2️⃣ Environmental Intelligence

Using live API data:

Temperature

Humidity

UV Index

AQI

It calculates:

Heat Index

Environmental Stress Score (0–100)

3️⃣ Hybrid AI Risk Engine

Final Risk Score is computed as:

Final Risk =
0.5 × Physiological Score + 0.5 × Environmental Score

Risk Categories:

🟢 Safe

🟡 Moderate

🔴 High

🔥 Key Features

Real-time webcam-based heat stress detection

Hybrid AI-based risk prediction

Personalized safety recommendations

Voice alert system

Risk history tracking

Clean dashboard interface

🛠️ Tech Stack

Frontend

Streamlit / React

Backend

FastAPI

AI & Computer Vision

Python

OpenCV

MediaPipe

PyTorch / TensorFlow

Scikit-learn

Data

Weather API Integration

⚙️ System Architecture

Webcam → Feature Extraction → ML Stress Model
Weather API → Environmental Score Model
↓
Hybrid Risk Engine
↓
Decision Engine
↓
Dashboard + Voice Output

📊 Example Workflow

User opens the application.

Camera scans face for 10 seconds.

System calculates Physiological Stress Score.

Weather API fetches environmental data.

Hybrid model predicts overall risk.

App displays and announces safety recommendations.

Example Output:

Physiological Score: 72
Environmental Score: 78
Final Risk: HIGH

Recommendation:

Take a 20-minute break

Drink 500ml water

Avoid sun exposure between 12–4 PM

🌍 Impact

This system can:

Reduce heatstroke incidents

Improve occupational safety

Assist smart city health monitoring

Support climate-health research

It can be scaled for industrial, healthcare, and government applications.

🚀 Future Enhancements

Mobile deployment

Wearable device integration

Hospital heat case prediction

AI Agent-based continuous monitoring

Multilingual voice alerts

📁 Installation
git clone https://github.com/your-username/heat-stress-ai.git
cd heat-stress-ai
pip install -r requirements.txt
python app.py

📌 Project Status

Hackathon Prototype – Active Development

👩‍💻 Author

Divya Sharma
