# Medsim Platform

## Project Overview

Medsim is an intelligent educational web platform designed to support health sciences students in practicing clinical cases through interactive and realistic medical simulations. The platform allows students to interact with a virtual patient, ask clinical questions, collect patient history, choose suitable examinations, and receive structured feedback that helps improve their clinical reasoning skills.

The main goal of Medsim is to provide a safe and supportive learning environment where students can practice clinical decision-making before interacting with real patients. By combining simulation, user-centered design, and Large Language Model (LLM) technology, Medsim helps students strengthen their confidence, improve their diagnostic thinking, and understand their mistakes in a clear educational way.

---

## Problem Statement

Many health sciences students study medical concepts theoretically, but they may face difficulties when applying this knowledge in real clinical situations. Some students struggle with taking patient history, choosing the correct clinical examination, analyzing symptoms, and connecting medical information together.

This gap between theoretical learning and practical clinical decision-making may reduce students’ confidence and make them feel less prepared when dealing with real patient cases.

Medsim addresses this issue by offering a virtual clinical training environment that helps students practice safely, learn from mistakes, and improve their clinical reasoning step by step.

---

## Project Solution

Medsim provides an interactive virtual patient experience where students can practice clinical cases in a realistic but safe environment. The platform guides students through the clinical process, starting from understanding the patient’s condition, asking questions, selecting examinations, and reaching a diagnosis.

The system also provides personalized and structured feedback based on the student’s performance. This helps students identify what they did well, what they missed, and how they can improve in future cases.

---
## Main Features

| Feature | Description |
|---|---|
| Virtual Clinical Cases | Allows students to practice realistic patient scenarios in different medical situations. |
| Virtual Patient Chat | Enables students to ask questions and interact with a simulated patient. |
| Step-by-Step Training Flow | Guides students through history taking, clinical examination, investigation selection, and diagnosis. |
| Personalized Feedback | Provides feedback based on the student’s answers and decisions. |
| Safe Practice Environment | Allows students to make mistakes and learn without affecting real patients. |
| LLM-Based Responses | Uses Large Language Model technology to generate realistic patient responses. |
| Responsible AI Practices | Ensures the platform is used for learning only and not for real medical diagnosis. |

---

## Technology and Implementation

The prototype was developed using **Lovable** to build the application interface and create an organized, user-friendly learning experience. The implementation focused on simplicity, smooth navigation, and interactive learning.

The platform also uses an LLM-based chat flow to generate realistic patient responses during the clinical case. When the student asks a question, the request is sent from the frontend to a secure backend function, which communicates with the AI service and returns the generated patient response to the platform.

### AI Workflow

| Step | Description |
|---|---|
| 1. Student Input | The student writes a clinical question to interact with the virtual patient. |
| 2. Medsim Frontend | The frontend receives the question and sends it securely to the backend. |
| 3. Supabase Edge Function | The backend function manages the request, protects the API connection, and communicates with the AI service. |
| 4. Google Gemini 3 Flash Preview | The AI model generates a realistic patient response based on the clinical case context. |
| 5. Output Display | The response is displayed to the student inside the clinical case interface. |

---
