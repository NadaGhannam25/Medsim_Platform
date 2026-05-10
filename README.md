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
## Prompt Design

The prompt is designed to make the AI act as a virtual patient inside a clinical case. It includes the case context, patient details, symptoms, and the allowed response style. This helps the AI generate consistent, realistic, and educational answers during the student interaction.

The prompt structure includes:

| Prompt Element | Purpose |
|---|---|
| Case Context | Provides the AI with the medical scenario and patient background. |
| Student Question | Sends the student’s clinical question as part of the conversation. |
| Patient Role | Guides the model to answer as a patient, not as a doctor. |
| Controlled Response | Keeps the response relevant to the case and suitable for learning. |

---

## Responsible AI Practices

Medsim applies responsible AI practices to ensure that the learning experience is safe, reliable, and educational. The platform is designed to support students without replacing real clinical supervision.

| Practice | Description |
|---|---|
| Privacy Protection | The system focuses on simulated cases and avoids collecting real patient information. |
| Secure API Connection | API requests are handled through a backend function instead of exposing keys in the frontend. |
| Error Handling | If the AI response fails, the system should provide a clear message and allow the student to try again. |
| Educational Purpose | AI responses are used for training and learning only, not for real medical diagnosis. |

---

## Project Objectives

The objectives of Medsim are:

1. To help health sciences students practice clinical cases in an interactive way.
2. To improve students’ clinical reasoning and decision-making skills.
3. To provide a safe learning environment before real patient interaction.
4. To support students with structured feedback and learning points.
5. To demonstrate how LLM technology can be used responsibly in medical education.

---
