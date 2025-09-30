const ciimedData = {
  title: "CIIMED - Centro de Investigación e Innovación Médica",
  content: `
CIIMED - Centro de Investigación e Innovación Médica

DESCRIPCIÓN
El Centro de Investigación e Innovación Médica (CIIMED) es una entidad dedicada a la creación de soluciones innovadoras en salud basadas en evidencia científica. Se enfoca en fortalecer la capacidad de investigación biomédica y clínica en Panamá, promoviendo la formación de investigadores, la colaboración con líderes científicos y la generación de evidencia científica relevante para la salud pública.

COLABORACIONES INSTITUCIONALES
- Hospital Nacional
- Universidad de Panamá
- Entidades públicas y académicas de Panamá
- Colaboración público-privada

ÁREAS DE INVESTIGACIÓN
Las investigaciones están alineadas con la Agenda Nacional de Prioridades de Investigación para la Salud (ANPIS):
- Cáncer
- Salud mental
- Nuevas tecnologías aplicadas a la salud
- Enfermedades crónicas no transmisibles
- Salud infantil
- Enfermedades infecciosas
- Medicamentos y terapias farmacológicas

SERVICIOS OFRECIDOS
1. Programas de pasantías en investigación científica aplicada para estudiantes en ciencias de la salud, especialmente medicina
2. Investigación biomédica y clínica en un entorno clínico de alta exigencia académica
3. Colaboración en proyectos orientados a la salud pública
4. Generación de conocimiento desde la academia hacia la práctica clínica
5. Formación de investigadores a través de alianzas estratégicas
6. Participación en estudios nacionales como la Encuesta Nacional de Salud de Panamá (ENSPA)

PROGRAMAS DE INVESTIGACIÓN
- Investigación aplicada que impacta la salud pública
- Integración de estudiantes de medicina en proyectos de investigación durante sus prácticas clínica-científicas
- Proyectos colaborativos entre sector público y privado
- Investigación médica temprana y aplicada

CONTACTO
- Instagram oficial: @ciimedpanama
- Presencia activa en redes sociales para difusión y comunicación
- Acceso a través de plataformas institucionales vinculadas a Universidad de Panamá y Hospital Nacional

MISIÓN Y VISIÓN
El CIIMED realiza un esfuerzo colaborativo entre sector público y privado para fortalecer la investigación médica temprana y aplicada, buscando impactar directamente en la salud pública. Su conexión con el Hospital Nacional y la Universidad de Panamá le permite ofrecer un entorno riguroso y de alta exigencia para formación en investigación.

ALINEACIÓN CON POLÍTICAS NACIONALES
El centro alinea su trabajo con políticas nacionales de salud para asegurar que sus investigaciones respondan a las prioridades y necesidades reales del país, siguiendo la Agenda Nacional de Prioridades de Investigación para la Salud (ANPIS).
`,
  url: "https://ciimedpanama.org",
  version: "1.0"
};

async function uploadCiimedData() {
  try {
    // Primero hacer login como admin
    const loginResponse = await fetch('http://localhost:3001/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: 'admin123' })
    });

    if (!loginResponse.ok) {
      throw new Error('Error en login admin');
    }

    // Obtener cookies de la respuesta
    const cookies = loginResponse.headers.get('set-cookie');
    
    // Subir el documento
    const ingestResponse = await fetch('http://localhost:3001/api/ingest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies || ''
      },
      body: JSON.stringify(ciimedData)
    });

    if (ingestResponse.ok) {
      const result = await ingestResponse.json();
      console.log('✅ Información de CIIMED subida exitosamente:', result);
    } else {
      const error = await ingestResponse.text();
      console.error('❌ Error subiendo información:', error);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  uploadCiimedData();
}

module.exports = { uploadCiimedData };