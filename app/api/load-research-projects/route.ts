import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const sampleProjects = [
  {
    title: "Desarrollo de Biomateriales Inteligentes para Regeneración Tisular",
    slug: "biomateriales-inteligentes-regeneracion-tisular",
    description: "Investigación avanzada en el desarrollo de biomateriales biocompatibles con propiedades autoreparativas para aplicaciones en medicina regenerativa.",
    abstract: "Este proyecto se enfoca en el diseño y síntesis de biomateriales inteligentes que respondan a estímulos biológicos específicos para promover la regeneración de tejidos dañados. Utilizamos nanotecnología y bioingeniería para crear matrices que guíen el crecimiento celular y la formación de nuevos tejidos.",
    researchLine: "Bioingeniería",
    category: "Investigación Aplicada",
    area: "Ciencias de la Salud",
    status: "active",
    priority: 9,
    tags: ["biomateriales", "regeneración tisular", "nanotecnología", "biocompatibilidad"],
    startDate: "2024-01-15",
    endDate: "2026-12-31",
    estimatedDuration: "3 años",
    currentProgress: 35,
    principalInvestigator: "Dr. María Elena Rodríguez",
    coInvestigators: ["Dr. Carlos Mendoza", "Dr. Ana Patricia Silva"],
    budget: 150000,
    currency: "USD",
    fundingSource: "COLCIENCIAS - Programa de Ciencia, Tecnología e Innovación",
    currentFunding: 52500,
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=center",
    imageAlt: "Investigación en biomateriales en laboratorio",
    objectives: [
      "Desarrollar biomateriales con propiedades autoreparativas",
      "Evaluar la biocompatibilidad en modelos in vitro e in vivo",
      "Optimizar las propiedades mecánicas y de degradación",
      "Establecer protocolos de fabricación escalable"
    ],
    expectedResults: "Se espera obtener al menos 3 biomateriales con propiedades autoreparativas validadas, 5 publicaciones en revistas Q1, y una patente de invención.",
    methodology: "Síntesis química, caracterización fisicoquímica, ensayos de biocompatibilidad, pruebas mecánicas, estudios in vitro con líneas celulares, y validación in vivo en modelos animales.",
    equipment: ["Microscopio electrónico", "Espectrómetro FTIR", "Máquina de ensayos mecánicos"],
    software: ["ImageJ", "MATLAB", "ChemDraw"],
    institutionalPartners: ["Universidad Nacional", "Hospital San José"],
    internationalPartners: ["MIT - Massachusetts Institute of Technology", "ETH Zurich"],
    studentParticipants: 6,
    impactMeasures: ["Publicaciones científicas", "Patentes", "Transferencia tecnológica"],
    ethicsApproval: "CEI-2024-001",
    featured: true,
    published: true,
    allowPublicView: true,
    link: "/research-projects/biomateriales-inteligentes-regeneracion-tisular"
  },
  {
    title: "Inteligencia Artificial para Diagnóstico Médico Temprano",
    slug: "ia-diagnostico-medico-temprano",
    description: "Desarrollo de algoritmos de machine learning para la detección temprana de enfermedades mediante análisis de imágenes médicas.",
    abstract: "Este proyecto busca desarrollar sistemas de inteligencia artificial capaces de identificar patrones sutiles en imágenes médicas que puedan indicar el desarrollo temprano de enfermedades, especialmente cáncer y enfermedades cardiovasculares.",
    researchLine: "Inteligencia Artificial en Salud",
    category: "Investigación Básica",
    area: "Ciencias Computacionales",
    status: "active",
    priority: 8,
    tags: ["machine learning", "diagnóstico médico", "imágenes médicas", "deep learning"],
    startDate: "2023-08-01",
    endDate: "2025-07-31",
    estimatedDuration: "2 años",
    currentProgress: 65,
    principalInvestigator: "Dr. Roberto Fernández",
    coInvestigators: ["Dra. Laura Gómez", "Dr. Andrés Morales"],
    budget: 85000,
    currency: "USD",
    fundingSource: "Fondo Nacional de Investigación en IA",
    currentFunding: 55250,
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop&crop=center",
    imageAlt: "Análisis de imágenes médicas con IA",
    objectives: [
      "Desarrollar algoritmos de detección temprana de cáncer pulmonar",
      "Crear sistemas de análisis cardiovascular automatizado",
      "Validar la precisión diagnóstica con datos clínicos reales",
      "Implementar interfaces usuario-amigables para médicos"
    ],
    expectedResults: "Sistema de IA con 95% de precisión en detección temprana, 3 publicaciones en revistas de alto impacto, y prototipo funcional para hospitales.",
    methodology: "Recolección de datasets médicos, preprocesamiento de imágenes, desarrollo de redes neuronales convolucionales, validación cruzada, y pruebas clínicas piloto.",
    equipment: ["Servidores GPU", "Estaciones de trabajo especializadas"],
    software: ["TensorFlow", "PyTorch", "DICOM Viewer", "Python"],
    institutionalPartners: ["Hospital Universitario", "Clínica Médica del País"],
    internationalPartners: ["Stanford Medical AI Lab", "University of Toronto"],
    studentParticipants: 4,
    impactMeasures: ["Precisión diagnóstica", "Tiempo de detección", "Adopción clínica"],
    ethicsApproval: "CEI-2023-045",
    featured: true,
    published: true,
    allowPublicView: true,
    link: "/research-projects/ia-diagnostico-medico-temprano"
  },
  {
    title: "Microrobótica para Cirugía Mínimamente Invasiva",
    slug: "microrobotica-cirugia-minima-invasion",
    description: "Desarrollo de microrobots médicos para procedimientos quirúrgicos de alta precisión con mínima invasión al paciente.",
    abstract: "Investigación en el diseño y fabricación de microrobots biocompatibles capaces de realizar procedimientos quirúrgicos precisos a escala microscópica, reduciendo el trauma quirúrgico y mejorando la recuperación del paciente.",
    researchLine: "Robótica Médica",
    category: "Investigación Aplicada",
    area: "Ingeniería Biomédica",
    status: "planning",
    priority: 7,
    tags: ["microrobótica", "cirugía", "mínima invasión", "biocompatibilidad"],
    startDate: "2024-06-01",
    endDate: "2027-05-31",
    estimatedDuration: "3 años",
    currentProgress: 5,
    principalInvestigator: "Dr. Sandra López",
    coInvestigators: ["Dr. Miguel Torres", "Dra. Patricia Herrera"],
    budget: 200000,
    currency: "USD",
    fundingSource: "Consejo Nacional de Ciencia y Tecnología",
    currentFunding: 10000,
    imageUrl: "https://images.unsplash.com/photo-1559757175-0a57d41ea5ac?w=800&h=600&fit=crop&crop=center",
    imageAlt: "Microrobots médicos en desarrollo",
    objectives: [
      "Diseñar microrobots para cirugía cardiovascular",
      "Desarrollar sistemas de navegación autónoma",
      "Validar seguridad y eficacia en modelos animales",
      "Crear protocolos de esterilización y biocompatibilidad"
    ],
    expectedResults: "3 prototipos de microrobots funcionales, 4 publicaciones científicas, y solicitud de aprobación regulatoria.",
    methodology: "Diseño CAD, microfabricación, pruebas de biocompatibilidad, desarrollo de algoritmos de control, y validación preclínica.",
    equipment: ["Microfabricación", "Microscopios especializados", "Simuladores quirúrgicos"],
    software: ["SolidWorks", "COMSOL", "ROS", "MATLAB"],
    institutionalPartners: ["Instituto de Cirugía Avanzada"],
    internationalPartners: ["Johns Hopkins University", "Tokyo Institute of Technology"],
    studentParticipants: 8,
    impactMeasures: ["Precisión quirúrgica", "Tiempo de recuperación", "Seguridad del paciente"],
    ethicsApproval: "",
    featured: false,
    published: true,
    allowPublicView: true,
    link: "/research-projects/microrobotica-cirugia-minima-invasion"
  },
  {
    title: "Terapias Génicas para Enfermedades Raras",
    slug: "terapias-genicas-enfermedades-raras",
    description: "Investigación en el desarrollo de terapias génicas innovadoras para el tratamiento de enfermedades raras sin opciones terapéuticas actuales.",
    abstract: "Este proyecto se centra en el desarrollo de vectores de terapia génica seguros y eficaces para el tratamiento de enfermedades genéticas raras, utilizando tecnología CRISPR y vectores virales avanzados.",
    researchLine: "Terapia Génica",
    category: "Investigación Básica",
    area: "Biotecnología",
    status: "active",
    priority: 8,
    tags: ["terapia génica", "CRISPR", "enfermedades raras", "vectores virales"],
    startDate: "2023-03-01",
    endDate: "2026-02-28",
    estimatedDuration: "3 años",
    currentProgress: 45,
    principalInvestigator: "Dra. Isabel Vargas",
    coInvestigators: ["Dr. Fernando Castro", "Dra. Mónica Reyes"],
    budget: 180000,
    currency: "USD",
    fundingSource: "Fundación de Enfermedades Raras",
    currentFunding: 81000,
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=center",
    imageAlt: "Investigación en terapia génica",
    objectives: [
      "Desarrollar vectores de terapia génica seguros",
      "Validar eficacia en modelos celulares y animales",
      "Optimizar la entrega dirigida a tejidos específicos",
      "Preparar estudios clínicos fase I"
    ],
    expectedResults: "2 vectores terapéuticos validados, 6 publicaciones científicas, y aprobación para ensayos clínicos.",
    methodology: "Diseño de vectores, clonación molecular, cultivos celulares, modelos animales, análisis de biodistribución, y estudios de toxicología.",
    equipment: ["Biosafety cabinets nivel 2", "Citómetro de flujo", "PCR tiempo real"],
    software: ["SnapGene", "FlowJo", "GraphPad Prism"],
    institutionalPartners: ["Instituto Nacional de Genética"],
    internationalPartners: ["Harvard Medical School", "Institut Pasteur"],
    studentParticipants: 5,
    impactMeasures: ["Eficacia terapéutica", "Seguridad", "Transferencia clínica"],
    ethicsApproval: "CEI-2023-022",
    featured: true,
    published: true,
    allowPublicView: true,
    link: "/research-projects/terapias-genicas-enfermedades-raras"
  },
  {
    title: "Biosensores Portátiles para Monitoreo de Salud",
    slug: "biosensores-portatiles-monitoreo-salud",
    description: "Desarrollo de dispositivos biosensores miniaturizados para el monitoreo continuo de parámetros de salud en tiempo real.",
    abstract: "Investigación en el desarrollo de biosensores electroquímicos miniaturizados que permitan el monitoreo no invasivo y continuo de biomarcadores importantes para la salud, integrados en dispositivos wearables.",
    researchLine: "Dispositivos Médicos",
    category: "Investigación Aplicada",
    area: "Ingeniería Electrónica",
    status: "completed",
    priority: 6,
    tags: ["biosensores", "wearables", "monitoreo salud", "electroquímica"],
    startDate: "2022-01-01",
    endDate: "2023-12-31",
    estimatedDuration: "2 años",
    currentProgress: 100,
    principalInvestigator: "Dr. Javier Ramírez",
    coInvestigators: ["Dra. Carmen Jiménez", "Dr. Pablo Medina"],
    budget: 95000,
    currency: "USD",
    fundingSource: "Programa de Innovación Tecnológica",
    currentFunding: 95000,
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop&crop=center",
    imageAlt: "Biosensores portátiles en desarrollo",
    objectives: [
      "Desarrollar sensores de glucosa no invasivos",
      "Crear dispositivos de monitoreo cardiovascular",
      "Validar precisión y estabilidad a largo plazo",
      "Integrar conectividad IoT para telemedicina"
    ],
    expectedResults: "3 prototipos validados clínicamente, 4 publicaciones, 2 patentes otorgadas, y 1 empresa spin-off creada.",
    methodology: "Microfabricación de electrodos, caracterización electroquímica, desarrollo de algoritmos de procesamiento, validación clínica, y estudios de usabilidad.",
    equipment: ["Microscopio AFM", "Potenciostato", "Analizador de impedancia"],
    software: ["KLayout", "COMSOL", "LabVIEW"],
    institutionalPartners: ["Centro de Innovación Médica", "Hospital Clínico"],
    internationalPartners: ["UC Berkeley", "TU Delft"],
    studentParticipants: 3,
    impactMeasures: ["Precisión de medición", "Adopción comercial", "Patentes"],
    ethicsApproval: "CEI-2022-018",
    featured: false,
    published: true,
    allowPublicView: true,
    link: "/research-projects/biosensores-portatiles-monitoreo-salud",
    publications: 4,
    citations: 127
  }
];

export async function GET() {
  try {
    console.log('🚀 Iniciando carga de proyectos de investigación...');

    let createdCount = 0;
    let existingCount = 0;
    let errorCount = 0;

    for (const projectData of sampleProjects) {
      try {
        // Verificar si el proyecto ya existe
        const existingProject = await prisma.researchProject.findUnique({
          where: { slug: projectData.slug }
        });

        if (existingProject) {
          existingCount++;
          console.log(`⚠️  Ya existe: ${projectData.title}`);
          continue;
        }

        // Crear nuevo proyecto
        await prisma.researchProject.create({
          data: {
            ...projectData,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        createdCount++;
        console.log(`✅ Creado: ${projectData.title}`);
      } catch (projectError) {
        errorCount++;
        console.error(`❌ Error con el proyecto "${projectData.title}":`, projectError);
      }
    }

    // Obtener estadísticas finales
    const totalCount = await prisma.researchProject.count();
    const statusStats = await prisma.researchProject.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Proyectos de investigación cargados exitosamente',
      results: {
        created: createdCount,
        existing: existingCount,
        errors: errorCount,
        total: totalCount,
        statusDistribution: statusStats.reduce((acc, stat) => {
          acc[stat.status] = stat._count.status;
          return acc;
        }, {} as Record<string, number>)
      }
    });

  } catch (error) {
    console.error('Error loading research projects:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cargar proyectos de investigación',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}