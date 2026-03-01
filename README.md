# 🌡️ AI-Powered Real-Time Heat Stress & Environmental Risk Detection System

## 🚀 Overview

Heatwaves are becoming more frequent and dangerous, especially in countries like India where millions of outdoor workers are exposed to extreme temperatures.

Most weather applications only provide general data such as temperature and AQI. They do not analyze an individual's real-time physiological condition or predict personalized heat exhaustion risk.

This project introduces an AI-based system that detects human heat stress using computer vision and combines it with environmental intelligence to predict real-time heat risk.

---

## 🎯 Problem Statement

Extreme heat conditions cause:

* Heatstroke
* Dehydration
* Worker fatigue
* Reduced productivity
* Increased hospital admissions

Current systems fail because they:

* Only show weather data
* Ignore individual physiological conditions
* Do not provide personalized real-time alerts

---

## 💡 Proposed Solution

This system integrates **Computer Vision + Machine Learning + Environmental Intelligence** to create a hybrid heat risk prediction engine.

---

## 🧠 System Working

### 1. Physiological Stress Detection

Using:

* OpenCV
* MediaPipe
* Deep Learning Models

The system analyzes:

* Eye fatigue and blink rate
* Facial redness intensity
* Skin brightness variation
* Micro facial stress cues

Output:
**Physiological Stress Score (0–100)**

---

### 2. Environmental Intelligence

The system fetches live environmental data:

* Temperature
* Humidity
* UV Index
* Air Quality Index

Output:
**Environmental Stress Score (0–100)**

---

### 3. Hybrid AI Risk Engine

Final Risk Calculation:

```
Final Risk = 0.5 × Physiological Score + 0.5 × Environmental Score
```

Risk Levels:

* 🟢 Safe
* 🟡 Moderate Risk
* 🔴 High Risk

---

## 🔥 Key Features

* Real-time webcam heat stress detection
* Hybrid AI-based risk prediction
* Live environmental data integration
* Personalized safety recommendations
* Voice alert system
* Risk history tracking dashboard

---

## 🏗️ System Architecture

```
Webcam → Feature Extraction → ML Stress Model → Physiological Score
Weather API → Environmental Processing → Environmental Score
                 ↓
          Hybrid Risk Engine
                 ↓
        Decision Intelligence
                 ↓
        Dashboard + Alerts
```

---

## 📊 Example Workflow

1. User opens the application and scans face using webcam.
2. System calculates physiological stress score.
3. Weather API fetches environmental data.
4. Hybrid AI predicts final heat risk.
5. App provides personalized safety recommendations.

---

## 🛠️ Technology Stack

**Computer Vision**

* OpenCV
* MediaPipe

**Machine Learning**

* Python
* Scikit-learn
* TensorFlow / PyTorch

**Backend**

* FastAPI

**Frontend**

* Streamlit / React

**Data Integration**

* Weather API

---

## 🌍 Impact

This system can improve safety for:

* Construction workers
* Farmers
* Traffic police
* Delivery personnel
* Elderly individuals

It helps prevent heatstroke by providing early warnings and personalized recommendations.

---

## 🏆 Innovation

Unlike traditional weather apps, this system:

* Detects real human physiological heat stress
* Combines internal body signals with external climate data
* Provides personalized real-time risk prediction

---

## 🔮 Future Scope

* Mobile deployment
* Wearable device integration
* Multilingual voice alerts
* Smart city heat monitoring systems

---

## ⚙️ Installation

```bash
git clone https://github.com/Varun-men/Foss-Hack-Ignivis.git
cd Foss-Hack-Ignivis
```

---

## 📜 License

This project is licensed under the MIT License.

The MIT License is a permissive open-source license that allows anyone to:

* Use the software for personal or commercial purposes
* Modify and distribute the code
* Create derivative works

As long as proper credit is given to the original authors.
This license encourages open collaboration, innovation, and academic use, making it ideal for hackathons and research-based projects.
See the LICENSE file for complete details.

---

## 👨‍💻 Contributors

Varun Kumar ,
Divya Vashishtha ,
Yash Ahuja ,
Nishant Verma .

B.Tech Computer Science Engineering

---

## ⭐ Project Status

Hackathon Prototype — Under Development
