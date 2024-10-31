from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import openai
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)

openai.api_key = "api_key"
pacientes = []

MEDICAL_KEYWORDS = [
    "síntomas", "tratamiento", "diagnóstico", "enfermedad", "medicamento",
    "medicina", "salud", "doctor", "dolor", "infección", "fiebre", "virus",
    "bacteria", "consulta", "prescripción", "receta" , "´pastilla" , "malestar" ,
    "brazo" , "pierna" , "fractura" ,  "esguinse" , 
]


def is_medical_question(prompt):
    return any(keyword in prompt.lower() for keyword in MEDICAL_KEYWORDS)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/medico', methods=['GET', 'POST'])
def medico():
    if request.method == 'POST':
        password = request.form.get('password')
        if password == 'medico':
            session['role'] = 'medico'
            return redirect(url_for('chat'))
        else:
            return render_template('medico.html', error='Contraseña incorrecta')
    return render_template('medico.html')


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


@app.route('/guardar_paciente', methods=['POST'])
def guardar_paciente():
    data = request.get_json()

    if not all(key in data for key in ('nombre', 'edad', 'fecha_nacimiento', 'sintomas', 'analisis')):
        return jsonify({"error": "Faltan datos requeridos."}), 400

    paciente = {
        "nombre": data['nombre'],
        "edad": data['edad'],
        "fecha_nacimiento": data['fecha_nacimiento'],
        "sintomas": data['sintomas'],
        "analisis": data['analisis']
    }
    pacientes.append(paciente)

    return jsonify({"mensaje": "Paciente guardado exitosamente."}), 201


@app.route('/ver_pacientes', methods=['GET'])
def ver_pacientes():
    return jsonify({"pacientes": pacientes})


@app.route('/buscar_pacientes', methods=['GET'])
def buscar_pacientes():
    query = request.args.get('query', '').lower()
    resultados = [p for p in pacientes if query in p['nombre'].lower()]
    return jsonify({"resultados": resultados})


@app.route('/api/chat', methods=['POST'])
def chat_api():
    data = request.json
    prompt = data.get('prompt')
    role = session.get('role')

    if not prompt:
        return jsonify({'respuesta': 'El prompt no puede estar vacío.'})

    if not is_medical_question(prompt):
        return jsonify({'respuesta': 'Lo siento, solo puedo responder consultas relacionadas con temas médicos.'})

    if role == 'medico':
        context = f"Eres un asistente médico y un doctor te está consultando. Responde solo preguntas de medicina de forma precisa y breve. La pregunta es: {prompt}"
    else:
        context = f"Eres un asistente de salud y un paciente te está consultando. Responde solo con información médica relevante y precisa, sin extenderte demasiado. Los síntomas son: {prompt}"

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": context},
                {"role": "user", "content": prompt}
            ],
            max_tokens=100,
            temperature=0.5
        )

        respuesta = response['choices'][0]['message']['content'].strip()
        return jsonify({'respuesta': respuesta})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'respuesta': 'Lo siento, ocurrió un error.', 'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True)
