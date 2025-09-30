// Script para subir información de CIIMED al RAG
// Ejecutar: node scripts/upload-ciimed-data.js

const ciimedInfo = {
  title: "CIIMED - Centro de Investigación e Innovación Médica - Información General",
  content: `
CENTRO DE INVESTIGACIÓN E INNOVACIÓN MÉDICA (CIIMED)

DESCRIPCIÓN GENERAL
El Centro de Investigación e Innovación Médica (CIIMED) es una entidad dedicada a la creación de soluciones innovadoras en salud basadas en evidencia científica. Se enfoca en fortalecer la capacidad de investigación biomédica y clínica en Panamá, promoviendo la formación de investigadores, la colaboración con líderes científicos y la generación de evidencia científica relevante para la salud pública.

UBICACIÓN Y COLABORACIONES
- Ubicado en el Hospital Nacional, Panamá
- Colabora estrechamente con la Universidad de Panamá
- Trabaja con diversas entidades públicas y académicas del país
- Mantiene alianzas estratégicas entre sector público y privado

ÁREAS DE INVESTIGACIÓN PRIORITARIAS
Las investigaciones del CIIMED están alineadas con la Agenda Nacional de Prioridades de Investigación para la Salud (ANPIS) e incluyen:

1. CÁNCER
   - Investigación en prevención, diagnóstico y tratamiento
   - Estudios epidemiológicos sobre incidencia en Panamá

2. SALUD MENTAL
   - Investigación en trastornos mentales prevalentes
   - Desarrollo de estrategias de intervención comunitaria

3. NUEVAS TECNOLOGÍAS EN SALUD
   - Innovación en dispositivos médicos
   - Telemedicina y salud digital
   - Inteligencia artificial aplicada a diagnósticos

4. ENFERMEDADES CRÓNICAS NO TRANSMISIBLES
   - Diabetes, hipertensión, enfermedades cardiovasculares
   - Estrategias de prevención y manejo

5. SALUD INFANTIL
   - Investigación pediátrica
   - Nutrición y desarrollo infantil
   - Vacunación y prevención

6. ENFERMEDADES INFECCIOSAS
   - Medicina tropical
   - Enfermedades emergentes y reemergentes
   - Resistencia antimicrobiana

7. MEDICAMENTOS Y TERAPIAS FARMACOLÓGICAS
   - Farmacovigilancia
   - Desarrollo de nuevos tratamientos
   - Estudios de eficacia y seguridad

SERVICIOS Y PROGRAMAS

FORMACIÓN ACADÉMICA
- Programas de pasantías en investigación científica aplicada
- Dirigido especialmente a estudiantes de ciencias de la salud y medicina
- Entorno clínico de alta exigencia académica
- Integración de estudiantes en proyectos de investigación durante prácticas clínico-científicas

INVESTIGACIÓN BIOMÉDICA Y CLÍNICA
- Investigación aplicada con impacto directo en salud pública
- Proyectos colaborativos entre academia y práctica clínica
- Generación de conocimiento desde la academia hacia la aplicación práctica
- Participación en estudios nacionales relevantes

CAPACITACIÓN Y DESARROLLO
- Formación de investigadores a través de alianzas estratégicas
- Programas de mentoría con líderes científicos
- Desarrollo de capacidades en metodología de investigación
- Talleres y seminarios especializados

PROYECTOS DESTACADOS
- Participación en la Encuesta Nacional de Salud de Panamá (ENSPA)
- Estudios epidemiológicos nacionales
- Proyectos de investigación multicéntricos
- Colaboraciones internacionales en investigación

INFORMACIÓN DE CONTACTO

REDES SOCIALES
- Instagram oficial: @ciimedpanama
- Plataforma principal para difusión de actividades
- Comunicación de resultados de investigación
- Promoción de eventos y oportunidades

CONTACTO INSTITUCIONAL
- A través de la Universidad de Panamá
- Por medio del Hospital Nacional
- Plataformas institucionales vinculadas

UBICACIÓN FÍSICA
- Hospital Nacional
- Ciudad de la Salud, Panamá
- Acceso a través de instalaciones hospitalarias

MISIÓN Y VISIÓN

MISIÓN
Fortalecer la investigación médica temprana y aplicada en Panamá a través de la colaboración entre sector público y privado, buscando impactar directamente en la salud pública mediante la generación de evidencia científica de calidad.

VISIÓN
Ser el centro de referencia en investigación e innovación médica en Panamá, contribuyendo al desarrollo de soluciones de salud basadas en evidencia que respondan a las necesidades y prioridades nacionales.

CARACTERÍSTICAS DISTINTIVAS

ENFOQUE COLABORATIVO
- Trabajo conjunto entre sector público y privado
- Integración academia-hospital-comunidad
- Cooperación interinstitucional nacional e internacional

EXIGENCIA ACADÉMICA
- Ambiente riguroso de investigación
- Estándares internacionales de calidad
- Supervisión especializada en proyectos

ALINEACIÓN CON POLÍTICAS NACIONALES
- Seguimiento de la Agenda Nacional de Prioridades de Investigación para la Salud (ANPIS)
- Respuesta a necesidades reales del país
- Contribución a políticas públicas de salud

IMPACTO EN SALUD PÚBLICA
- Investigación orientada a soluciones prácticas
- Transferencia de conocimiento a la práctica clínica
- Mejora de la atención médica nacional
- Fortalecimiento del sistema de salud panameño

OPORTUNIDADES PARA ESTUDIANTES E INVESTIGADORES
- Pasantías de investigación
- Proyectos de tesis y trabajos de grado
- Colaboración en publicaciones científicas
- Participación en congresos y eventos académicos
- Networking con investigadores experimentados

Para mayor información específica sobre programas, requisitos de participación o colaboraciones, se recomienda contactar directamente a través de las redes sociales oficiales (@ciimedpanama) o las plataformas institucionales de la Universidad de Panamá y Hospital Nacional.
`,
  url: "https://www.instagram.com/ciimedpanama/",
  version: "1.0"
};

const contactInfo = {
  title: "CIIMED - Información de Contacto y Ubicación",
  content: `
INFORMACIÓN DE CONTACTO - CIIMED

REDES SOCIALES OFICIALES
Instagram: @ciimedpanama
- Canal principal de comunicación
- Difusión de actividades de investigación
- Noticias y actualizaciones del centro
- Oportunidades de participación

UBICACIÓN FÍSICA
Centro de Investigación e Innovación Médica (CIIMED)
Hospital Nacional
Ciudad de la Salud
Panamá, República de Panamá

INSTITUCIONES ASOCIADAS
Universidad de Panamá
- Vínculo académico principal
- Coordinación de programas de formación
- Gestión de proyectos de investigación

Hospital Nacional
- Sede física del centro
- Entorno clínico de investigación
- Acceso a infraestructura médica

CÓMO CONTACTAR

Para información general:
- Seguir @ciimedpanama en Instagram
- Contactar a través de la Universidad de Panamá
- Comunicarse via Hospital Nacional

Para estudiantes interesados:
- Consultar requisitos de pasantías via @ciimedpanama
- Coordinación a través de facultades de medicina
- Información sobre programas de formación

Para investigadores y colaboraciones:
- Contacto institucional via Universidad de Panamá
- Propuestas de colaboración via Hospital Nacional
- Seguimiento en redes sociales para oportunidades

HORARIOS Y ACCESO
El acceso al CIIMED se coordina a través del Hospital Nacional y está sujeto a los protocolos institucionales correspondientes. Para visitas y reuniones, se recomienda coordinación previa a través de los canales oficiales.

CORRESPONDENCIA
Para correspondencia oficial, dirigirse a:
- Universidad de Panamá (coordinación académica)
- Hospital Nacional (actividades clínicas)
- @ciimedpanama (consultas generales)
`,
  url: "https://www.instagram.com/ciimedpanama/",
  version: "1.0"
};

const researchPrograms = {
  title: "CIIMED - Programas de Investigación y Líneas de Trabajo",
  content: `
PROGRAMAS DE INVESTIGACIÓN - CIIMED

LÍNEAS DE INVESTIGACIÓN PRIORITARIAS

1. INVESTIGACIÓN EN CÁNCER
Objetivos:
- Estudios epidemiológicos sobre incidencia de cáncer en Panamá
- Investigación en factores de riesgo específicos de la población panameña
- Desarrollo de protocolos de prevención y detección temprana
- Evaluación de tratamientos y seguimiento de pacientes

Proyectos actuales:
- Registro nacional de casos oncológicos
- Estudios de supervivencia por tipo de cáncer
- Investigación en cáncer cervicouterino y de mama
- Análisis de factores ambientales y genéticos

2. SALUD MENTAL
Enfoques:
- Investigación en trastornos mentales prevalentes en Panamá
- Desarrollo de estrategias de intervención comunitaria
- Estudios sobre impacto socioeconómico de trastornos mentales
- Investigación en salud mental infantil y adolescente

Áreas específicas:
- Depresión y ansiedad
- Trastornos relacionados con violencia
- Salud mental en poblaciones vulnerables
- Intervenciones basadas en comunidad

3. NUEVAS TECNOLOGÍAS EN SALUD
Innovaciones:
- Desarrollo de dispositivos médicos adaptados al contexto local
- Implementación de telemedicina en áreas rurales
- Investigación en inteligencia artificial para diagnósticos
- Aplicaciones móviles para seguimiento de pacientes

Proyectos tecnológicos:
- Sistemas de monitoreo remoto
- Plataformas de educación médica digital
- Herramientas de diagnóstico por imagen
- Bases de datos clínicos integrados

4. ENFERMEDADES CRÓNICAS NO TRANSMISIBLES
Enfoque integral:
- Diabetes mellitus tipo 2
- Hipertensión arterial
- Enfermedades cardiovasculares
- Obesidad y síndrome metabólico

Estrategias de investigación:
- Estudios de prevalencia e incidencia
- Factores de riesgo en población panameña
- Evaluación de intervenciones preventivas
- Análisis de costos en salud pública

5. SALUD INFANTIL
Áreas de investigación:
- Nutrición y desarrollo infantil temprano
- Programas de vacunación y su efectividad
- Enfermedades pediátricas prevalentes
- Desarrollo neurológico y cognitivo

Proyectos específicos:
- Estudios de crecimiento y desarrollo
- Investigación en lactancia materna
- Prevención de enfermedades infecciosas
- Salud mental infantil

6. ENFERMEDADES INFECCIOSAS Y MEDICINA TROPICAL
Especialización en:
- Enfermedades tropicales endémicas
- Enfermedades emergentes y reemergentes
- Resistencia antimicrobiana
- Epidemiología de enfermedades vectoriales

Investigaciones actuales:
- Dengue, Zika y Chikungunya
- Tuberculosis y VIH
- Enfermedades parasitarias
- Vigilancia epidemiológica

7. MEDICAMENTOS Y TERAPIAS FARMACOLÓGICAS
Investigación farmacológica:
- Farmacovigilancia en población panameña
- Estudios de eficacia y seguridad de medicamentos
- Desarrollo de protocolos terapéuticos
- Investigación en medicina tradicional

Áreas de trabajo:
- Efectos adversos de medicamentos
- Interacciones farmacológicas
- Farmacogenética
- Adherencia terapéutica

METODOLOGÍA DE INVESTIGACIÓN

ENFOQUE MULTIDISCIPLINARIO
- Colaboración entre diferentes especialidades médicas
- Integración de ciencias básicas y clínicas
- Participación de epidemiólogos, bioestadísticos y metodólogos
- Cooperación con ciencias sociales y salud pública

ESTÁNDARES DE CALIDAD
- Protocolos basados en buenas prácticas clínicas
- Revisión ética de todos los proyectos
- Supervisión metodológica especializada
- Publicación en revistas indexadas

PARTICIPACIÓN ESTUDIANTIL
- Integración de estudiantes de medicina en proyectos
- Supervisión académica especializada
- Oportunidades de co-autoría en publicaciones
- Presentación en congresos nacionales e internacionales

COLABORACIONES Y REDES

COLABORACIONES NACIONALES
- Universidad de Panamá
- Hospital Nacional
- Ministerio de Salud
- Caja de Seguro Social
- Instituto Gorgas

COLABORACIONES INTERNACIONALES
- Redes de investigación latinoamericanas
- Proyectos multicéntricos regionales
- Intercambio académico internacional
- Participación en consorcios de investigación

IMPACTO ESPERADO
- Mejora en la toma de decisiones de salud pública
- Desarrollo de capacidades locales de investigación
- Contribución a políticas nacionales de salud
- Fortalecimiento del sistema sanitario panameño
`,
  url: "https://www.instagram.com/ciimedpanama/",
  version: "1.0"
};

async function uploadToRAG(documentData) {
  try {
    // Hacer login como admin
    const loginResponse = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: 'ciimed2024' })
    });

    if (!loginResponse.ok) {
      throw new Error('Error en login admin');
    }

    // Obtener cookies
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    
    // Subir documento
    const uploadResponse = await fetch('http://localhost:3000/api/ingest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': setCookieHeader || ''
      },
      body: JSON.stringify(documentData)
    });

    if (uploadResponse.ok) {
      const result = await uploadResponse.json();
      console.log(`✅ "${documentData.title}" subido exitosamente`);
      console.log(`   - Chunks creados: ${result.stats.chunks}`);
      console.log(`   - Embeddings: ${result.stats.embeddings}`);
      return true;
    } else {
      const error = await uploadResponse.text();
      console.error(`❌ Error subiendo "${documentData.title}":`, error);
      return false;
    }

  } catch (error) {
    console.error(`❌ Error con "${documentData.title}":`, error.message);
    return false;
  }
}

async function uploadAllData() {
  console.log('🚀 Iniciando carga de información de CIIMED al RAG...\n');
  
  const documents = [ciimedInfo, contactInfo, researchPrograms];
  let successCount = 0;
  
  for (const doc of documents) {
    const success = await uploadToRAG(doc);
    if (success) successCount++;
    
    // Esperar un poco entre uploads
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n📊 Resumen:`);
  console.log(`   - Documentos subidos: ${successCount}/${documents.length}`);
  console.log(`   - Estado: ${successCount === documents.length ? '✅ Completo' : '⚠️  Parcial'}`);
  
  if (successCount === documents.length) {
    console.log('\n🎉 ¡Toda la información de CIIMED ha sido cargada al chatbot!');
    console.log('   El chatbot ahora puede responder preguntas sobre:');
    console.log('   • Información general del CIIMED');
    console.log('   • Programas de investigación');
    console.log('   • Contacto y ubicación');
    console.log('   • Áreas de especialización');
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  uploadAllData();
}

module.exports = { uploadAllData, ciimedInfo, contactInfo, researchPrograms };