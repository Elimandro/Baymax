from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import openai
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)

openai.api_key = "api_key"
pacientes = []

MEDICAL_KEYWORDS = [
    "ansiedad", "tdah", "tda", "depresion", "medicamento",
    "triste", "soledad", "cuidado", "atencion", "abrazo", "problema",
    "problemas", "ruptura", "hiperactividad", "emocion", "emocionales",
    "juventud", "salud", "bienestar", "furia", "enojo", "llorar", "llanto",
    "ansioso", "episodio", "prescripción", "poder", "puedo", "malestar",
    "recurrir", "recurro", "mente", "caos", "joven", "jovenes", "nosotros",
    "amistades", "familia", "amigos", "novio", "novia", "conflicto", "conflictos",
    "esposo", "esposa", "hijo", "hija", "familiares", "test", "carrera", "estudiante",
    "actividad", "mejorar", "trastorno", "facultad", "enfrentar",
]

def is_medical_question(prompt):
    return any(keyword in prompt.lower() for keyword in MEDICAL_KEYWORDS)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/paciente')
def paciente():
    session['role'] = 'paciente'
    return redirect(url_for('chat'))

@app.route('/chat')
def chat():
    if 'role' not in session:
        return redirect(url_for('index'))
    role = session['role']
    return render_template('chat.html', role=role)

@app.route('/api/chat', methods=['POST'])
def chat_api():
    data = request.json
    prompt = data.get('prompt')
    role = data.get('rol')  # Obtener el rol del cuerpo de la solicitud

    if not prompt:
        return jsonify({'respuesta': 'El prompt no puede estar vacío.'})

    if not is_medical_question(prompt):
        return jsonify({'respuesta': 'Lo siento, solo puedo responder consultas relacionadas con temas del bienestar juvenil.'})

    if role == 'psicologo':
        context = (
            "Eres un asistente especializado en bienestar psicosocial juvenil. "
            "Tu tarea es responder con precisión, brevedad y empatía preguntas relacionadas con psicología, "
            "centrándote en el manejo de síntomas y signos de ansiedad y depresión. "
            "Evita explicaciones excesivamente técnicas o extensas. "
            "Utiliza información basada en fuentes confiables y académicas para apoyar tus respuestas. "
            "La información debe ser de Google Académico o SciELO. "
            f"La pregunta del joven paciente es: {prompt}"
        )
    elif role == 'psiquiatra':
        context = (
            "Eres un asistente experto en salud psiquiátrica y neurológica enfocado en jóvenes. "
            "Ofrece respuestas claras, concisas y basadas en evidencia sobre temas relacionados con TDA y TDAH, "
            "evitando explicaciones excesivamente técnicas o extensas. "
            "La información debe ser de Google Académico o SciELO. "
            f"Consulta los síntomas descritos por el paciente y proporciona orientación adecuada: {prompt}"
        )
    else:
        context = (
            "Eres un consejero en bienestar social para jóvenes que enfrentan problemas personales o de estudio en su escuela, universidad, "
            "centro educativo que pueden generar ansiedad. Ofrece consejos prácticos, alentadores y respetuosos para mejorar su bienestar emocional, "
            "centrándote en el apoyo y orientación sin abordar temas médicos o diagnósticos. "
            "La información debe ser de Google Académico o SciELO. "
            f"El paciente describe sus desafíos como: {prompt}"
        )

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": context},
                {"role": "user", "content": prompt}
            ],
            max_tokens=135,
            temperature=0.5
        )

        respuesta = response['choices'][0]['message']['content'].strip()
        return jsonify({'respuesta': respuesta})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'respuesta': 'Lo siento, ocurrió un error.', 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
