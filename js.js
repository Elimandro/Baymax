const baymaxFrases = [
    "Hola, soy Baymax, tu asistente medico personal.",
    "En una escala del 1 al 10, ¿cómo calificarías tu dolor?",
    "Estoy aquí para ayudarte. Dame un momento para analizar tu consulta.",
    "Por favor, espera mientras reviso tus síntomas.",
    "Voy a brindarte la mejor información posible."
];

let voces = [];

// Cargar voces de síntesis de voz
function cargarVoces() {
    voces = window.speechSynthesis.getVoices();
}

window.speechSynthesis.onvoiceschanged = cargarVoces;

// Función para que Baymax hable
function hablar(texto) {
    console.log("Hablando: " + texto);
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';
    utterance.pitch = 1;
    utterance.rate = 2;

    if (voces.length > 0) {
        utterance.voice = voces.find(voice => voice.name === 'Google español');
    }

    window.speechSynthesis.speak(utterance);
}

// Función para enviar mensaje en el chat
async function enviarMensaje() {
    const prompt = document.getElementById('userInput').value;

    if (prompt.trim() === "") {
        const mensajeVacio = "El mensaje no puede estar vacío.";
        document.getElementById('chatDisplay').innerHTML += `<div class="baymax-message">${mensajeVacio}</div>`;
        hablar(mensajeVacio);
        return;
    }

    const chatDisplay = document.getElementById('chatDisplay');
    chatDisplay.innerHTML += `<div class="user-message">${prompt}</div>`;
    hablar(prompt);
    document.getElementById('userInput').value = ""; // Limpiar la entrada

    setTimeout(async () => {
        let fraseInicial = baymaxFrases[Math.floor(Math.random() * baymaxFrases.length)];
        chatDisplay.innerHTML += `<div class="baymax-message">${fraseInicial}</div>`;
        hablar(fraseInicial);

        setTimeout(async () => {
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: prompt })
                });

                const data = await response.json();

                chatDisplay.innerHTML += `<div class="baymax-message">${data.respuesta}</div>`;
                hablar(data.respuesta);

                // Desplazar el chat hacia abajo
                chatDisplay.scrollTop = chatDisplay.scrollHeight;

            } catch (error) {
                const errorMessage = "Lo siento, ocurrió un error al procesar la solicitud.";
                chatDisplay.innerHTML += `<div class="baymax-message">${errorMessage}</div>`;
                hablar(errorMessage);
                console.error("Error:", error);
            }
        }, 1000);
    }, 2000);
}

// Agregar evento al botón de enviar en el chat
document.getElementById('sendButton').addEventListener('click', enviarMensaje);

// Función para guardar paciente
document.getElementById('savePatientButton').addEventListener('click', async () => {
    const nombre = document.getElementById('patientName').value;
    const edad = document.getElementById('patientAge').value;
    const fechaNacimiento = document.getElementById('patientDOB').value;
    const sintomas = document.getElementById('patientSymptoms').value;
    const analisis = document.getElementById('patientAnalysis').value;

    if (!nombre || !edad || !fechaNacimiento || !sintomas || !analisis) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    try {
        const response = await fetch('/guardar_paciente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
                edad: edad,
                fecha_nacimiento: fechaNacimiento,
                sintomas: sintomas,
                analisis: analisis
            })
        });

        const data = await response.json();
        if (data.error) {
            alert(data.error);
        } else {
            alert(data.mensaje);
            document.getElementById('patientForm').reset();
        }
    } catch (error) {
        console.error("Error al guardar el paciente:", error);
    }
});

// Función para ver pacientes registrados
async function verPacientes() {
    try {
        const response = await fetch('/ver_pacientes', { method: 'GET' });
        const data = await response.json();

        const pacientes = data.pacientes;
        let pacientesInfo = '';

        pacientes.forEach(paciente => {
            pacientesInfo += `
                <div class="paciente-info">
                    <p><strong>Nombre:</strong> ${paciente.nombre}</p>
                    <p><strong>Edad:</strong> ${paciente.edad}</p>
                    <p><strong>Fecha de Nacimiento:</strong> ${paciente.fecha_nacimiento}</p>
                    <p><strong>Síntomas:</strong> ${paciente.sintomas}</p>
                    <p><strong>Análisis:</strong> ${paciente.analisis}</p>
                </div><hr>`;
        });

        document.getElementById('pacientesLista').innerHTML = pacientesInfo;
    } catch (error) {
        console.error("Error al obtener la lista de pacientes:", error);
    }
}

// Agregar evento al botón para ver pacientes registrados
document.getElementById('verPacientesButton').addEventListener('click', verPacientes);
