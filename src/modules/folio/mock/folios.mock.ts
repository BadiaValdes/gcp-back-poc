import { IFolio } from "../interfaces/folio.interface";

export const FOLIOS_MOCKS: IFolio[] = [
  {
    folioApp: "12345678901",
    nombrePaciente: "Juan Perez",
    descripcion:
      "Se solicita una cita para el paciente Juan Pérez, quien presenta dolor abdominal desde hace una semana. El paciente describe el dolor como punzante y localizado en la región epigástrica. Además, refiere náuseas ocasionales pero niega vómitos o cambios en el hábito intestinal. Ha intentado aliviar el malestar con antiácidos sin mejoría. No hay antecedentes de cirugías abdominales ni enfermedades gastrointestinales previas. Se solicita evaluación médica para descartar patologías subyacentes.",
    codigo: "A1B2C3",
    cantidad: 2,
  },
  {
    folioApp: "23456789012",
    nombrePaciente: "María García",
    descripcion:
      "María García acude a consulta por presentar síntomas de ansiedad y episodios de pánico recurrentes durante las últimas semanas. Refiere sensación de opresión en el pecho, dificultad para respirar y temblores en las manos. Estos síntomas suelen ocurrir sin un desencadenante aparente y han interferido con su vida diaria, incluyendo el trabajo y las relaciones personales. María menciona que ha experimentado estrés laboral y problemas familiares recientemente. Se considera evaluación psicológica y posible derivación a un especialista en salud mental.",
    codigo: "D4E5F6",
    cantidad: 3,
  },
];
