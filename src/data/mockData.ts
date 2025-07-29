import { Psychologist, TimeSlot } from "../types";

export const specialties = [
  "Ansiedad",
  "Depresión",
  "Relaciones personales",
  "Fobias",
  "Trastornos alimentarios",
  "Autoestima",
  "Duelo",
  "Estrés laboral",
  "Terapia de pareja",
  "Trastornos del sueño",
];

export const modalities = [
  { value: "online", label: "Online" },
  { value: "presencial", label: "Presencial" },
];

// Helper function to create a date for a specific day and time
const createDateTime = (daysFromNow: number, hour: number, minute: number = 0): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, minute, 0, 0);
  return date;
};

// Helper function to create end time (1 hour later)
const createEndDateTime = (startDate: Date): Date => {
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 1);
  return endDate;
};

export const mockPsychologists: Psychologist[] = [
  {
    id: "1",
    name: "Dr. Ana García",
    specialties: ["Ansiedad", "Depresión", "Estrés laboral"],
    modalities: ["online", "presencial"],
    avatar:
      "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300",
    rating: 4.9,
    experience: 8,
    availability: [
      // Lunes
      {
        id: "1-slot-1",
        psychologistId: "1",
        startDateTime: createDateTime(1, 9),
        endDateTime: createDateTime(1, 10),
        modality: "online",
        isBooked: false,
      },
      {
        id: "1-slot-2",
        psychologistId: "1",
        startDateTime: createDateTime(1, 14),
        endDateTime: createDateTime(1, 15),
        modality: "presencial",
        isBooked: false,
      },
      {
        id: "1-slot-3",
        psychologistId: "1",
        startDateTime: createDateTime(1, 16),
        endDateTime: createDateTime(1, 17),
        modality: "online",
        isBooked: false,
      },
      // Martes
      {
        id: "1-slot-4",
        psychologistId: "1",
        startDateTime: createDateTime(2, 10),
        endDateTime: createDateTime(2, 11),
        modality: "online",
        isBooked: false,
      },
      {
        id: "1-slot-5",
        psychologistId: "1",
        startDateTime: createDateTime(2, 15),
        endDateTime: createDateTime(2, 16),
        modality: "presencial",
        isBooked: false,
      },
      // Miércoles
      {
        id: "1-slot-6",
        psychologistId: "1",
        startDateTime: createDateTime(3, 11),
        endDateTime: createDateTime(3, 12),
        modality: "online",
        isBooked: false,
      },
      {
        id: "1-slot-7",
        psychologistId: "1",
        startDateTime: createDateTime(3, 17),
        endDateTime: createDateTime(3, 18),
        modality: "online",
        isBooked: false,
      },
      // Jueves
      {
        id: "1-slot-8",
        psychologistId: "1",
        startDateTime: createDateTime(4, 9),
        endDateTime: createDateTime(4, 10),
        modality: "presencial",
        isBooked: false,
      },
      {
        id: "1-slot-9",
        psychologistId: "1",
        startDateTime: createDateTime(4, 13),
        endDateTime: createDateTime(4, 14),
        modality: "online",
        isBooked: false,
      },
      // Viernes
      {
        id: "1-slot-10",
        psychologistId: "1",
        startDateTime: createDateTime(5, 8),
        endDateTime: createDateTime(5, 9),
        modality: "online",
        isBooked: false,
      },
      {
        id: "1-slot-11",
        psychologistId: "1",
        startDateTime: createDateTime(5, 16),
        endDateTime: createDateTime(5, 17),
        modality: "presencial",
        isBooked: false,
      },
    ],
    bio: "Especialista en trastornos de ansiedad con enfoque cognitivo-conductual. 8 años de experiencia ayudando a pacientes a superar sus desafíos emocionales.",
  },
  {
    id: "2",
    name: "Lic. Carlos Mendoza",
    specialties: ["Relaciones personales", "Terapia de pareja", "Autoestima"],
    modalities: ["online", "presencial"],
    avatar:
      "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300",
    rating: 4.8,
    experience: 12,
    availability: [
      // Lunes
      {
        id: "2-slot-1",
        psychologistId: "2",
        startDateTime: createDateTime(1, 10),
        endDateTime: createDateTime(1, 11),
        modality: "presencial",
        isBooked: false,
      },
      {
        id: "2-slot-2",
        psychologistId: "2",
        startDateTime: createDateTime(1, 15),
        endDateTime: createDateTime(1, 16),
        modality: "online",
        isBooked: false,
      },
      // Martes
      {
        id: "2-slot-3",
        psychologistId: "2",
        startDateTime: createDateTime(2, 9),
        endDateTime: createDateTime(2, 10),
        modality: "online",
        isBooked: false,
      },
      {
        id: "2-slot-4",
        psychologistId: "2",
        startDateTime: createDateTime(2, 14),
        endDateTime: createDateTime(2, 15),
        modality: "presencial",
        isBooked: false,
      },
      {
        id: "2-slot-5",
        psychologistId: "2",
        startDateTime: createDateTime(2, 18),
        endDateTime: createDateTime(2, 19),
        modality: "online",
        isBooked: false,
      },
      // Miércoles
      {
        id: "2-slot-6",
        psychologistId: "2",
        startDateTime: createDateTime(3, 8),
        endDateTime: createDateTime(3, 9),
        modality: "presencial",
        isBooked: false,
      },
      {
        id: "2-slot-7",
        psychologistId: "2",
        startDateTime: createDateTime(3, 16),
        endDateTime: createDateTime(3, 17),
        modality: "online",
        isBooked: false,
      },
      // Jueves
      {
        id: "2-slot-8",
        psychologistId: "2",
        startDateTime: createDateTime(4, 11),
        endDateTime: createDateTime(4, 12),
        modality: "online",
        isBooked: false,
      },
      {
        id: "2-slot-9",
        psychologistId: "2",
        startDateTime: createDateTime(4, 17),
        endDateTime: createDateTime(4, 18),
        modality: "presencial",
        isBooked: false,
      },
      // Viernes
      {
        id: "2-slot-10",
        psychologistId: "2",
        startDateTime: createDateTime(5, 10),
        endDateTime: createDateTime(5, 11),
        modality: "online",
        isBooked: false,
      },
    ],
    bio: "Terapeuta familiar y de pareja con más de 12 años de experiencia. Especializado en terapia sistémica y humanística.",
  },
  {
    id: "3",
    name: "Dra. María López",
    specialties: ["Fobias", "Trastornos de ansiedad", "Duelo"],
    modalities: ["online"],
    avatar:
      "https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=300",
    rating: 4.7,
    experience: 6,
    availability: [
      // Lunes
      {
        id: "3-slot-1",
        psychologistId: "3",
        startDateTime: createDateTime(1, 8),
        endDateTime: createDateTime(1, 9),
        modality: "online",
        isBooked: false,
      },
      {
        id: "3-slot-2",
        psychologistId: "3",
        startDateTime: createDateTime(1, 13),
        endDateTime: createDateTime(1, 14),
        modality: "online",
        isBooked: false,
      },
      {
        id: "3-slot-3",
        psychologistId: "3",
        startDateTime: createDateTime(1, 19),
        endDateTime: createDateTime(1, 20),
        modality: "online",
        isBooked: false,
      },
      // Martes
      {
        id: "3-slot-4",
        psychologistId: "3",
        startDateTime: createDateTime(2, 7),
        endDateTime: createDateTime(2, 8),
        modality: "online",
        isBooked: false,
      },
      {
        id: "3-slot-5",
        psychologistId: "3",
        startDateTime: createDateTime(2, 12),
        endDateTime: createDateTime(2, 13),
        modality: "online",
        isBooked: false,
      },
      {
        id: "3-slot-6",
        psychologistId: "3",
        startDateTime: createDateTime(2, 20),
        endDateTime: createDateTime(2, 21),
        modality: "online",
        isBooked: false,
      },
      // Miércoles
      {
        id: "3-slot-7",
        psychologistId: "3",
        startDateTime: createDateTime(3, 9),
        endDateTime: createDateTime(3, 10),
        modality: "online",
        isBooked: false,
      },
      {
        id: "3-slot-8",
        psychologistId: "3",
        startDateTime: createDateTime(3, 14),
        endDateTime: createDateTime(3, 15),
        modality: "online",
        isBooked: false,
      },
      // Jueves
      {
        id: "3-slot-9",
        psychologistId: "3",
        startDateTime: createDateTime(4, 8),
        endDateTime: createDateTime(4, 9),
        modality: "online",
        isBooked: false,
      },
      {
        id: "3-slot-10",
        psychologistId: "3",
        startDateTime: createDateTime(4, 15),
        endDateTime: createDateTime(4, 16),
        modality: "online",
        isBooked: false,
      },
      {
        id: "3-slot-11",
        psychologistId: "3",
        startDateTime: createDateTime(4, 18),
        endDateTime: createDateTime(4, 19),
        modality: "online",
        isBooked: false,
      },
      // Viernes
      {
        id: "3-slot-12",
        psychologistId: "3",
        startDateTime: createDateTime(5, 11),
        endDateTime: createDateTime(5, 12),
        modality: "online",
        isBooked: false,
      },
      {
        id: "3-slot-13",
        psychologistId: "3",
        startDateTime: createDateTime(5, 17),
        endDateTime: createDateTime(5, 18),
        modality: "online",
        isBooked: false,
      },
    ],
    bio: "Psicóloga clínica especializada en terapias de exposición y EMDR. Enfoque compasivo para el tratamiento de traumas y fobias.",
  },
  {
    id: "4",
    name: "Lic. Roberto Silva",
    specialties: ["Trastornos alimentarios", "Autoestima", "Depresión"],
    modalities: ["presencial"],
    avatar:
      "https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=300",
    rating: 4.6,
    experience: 10,
    availability: [
      // Lunes
      {
        id: "4-slot-1",
        psychologistId: "4",
        startDateTime: createDateTime(1, 9),
        endDateTime: createDateTime(1, 10),
        modality: "presencial",
        isBooked: false,
      },
      {
        id: "4-slot-2",
        psychologistId: "4",
        startDateTime: createDateTime(1, 11),
        endDateTime: createDateTime(1, 12),
        modality: "presencial",
        isBooked: false,
      },
      {
        id: "4-slot-3",
        psychologistId: "4",
        startDateTime: createDateTime(1, 16),
        endDateTime: createDateTime(1, 17),
        modality: "presencial",
        isBooked: false,
      },
      // Miércoles
      {
        id: "4-slot-4",
        psychologistId: "4",
        startDateTime: createDateTime(3, 10),
        endDateTime: createDateTime(3, 11),
        modality: "presencial",
        isBooked: false,
      },
      {
        id: "4-slot-5",
        psychologistId: "4",
        startDateTime: createDateTime(3, 15),
        endDateTime: createDateTime(3, 16),
        modality: "presencial",
        isBooked: false,
      },
      // Viernes
      {
        id: "4-slot-6",
        psychologistId: "4",
        startDateTime: createDateTime(5, 8),
        endDateTime: createDateTime(5, 9),
        modality: "presencial",
        isBooked: false,
      },
      {
        id: "4-slot-7",
        psychologistId: "4",
        startDateTime: createDateTime(5, 14),
        endDateTime: createDateTime(5, 15),
        modality: "presencial",
        isBooked: false,
      },
    ],
    bio: "Especialista en trastornos alimentarios y imagen corporal. Enfoque integral combinando terapia cognitiva y mindfulness.",
  },
  {
    id: "5",
    name: "Dra. Laura Fernández",
    specialties: ["Trastornos del sueño", "Estrés laboral", "Ansiedad"],
    modalities: ["online", "presencial"],
    avatar:
      "https://images.pexels.com/photos/5452299/pexels-photo-5452299.jpeg?auto=compress&cs=tinysrgb&w=300",
    rating: 4.9,
    experience: 15,
    availability: [
      // Lunes
      {
        id: "5-slot-1",
        psychologistId: "5",
        startDateTime: createDateTime(1, 7),
        endDateTime: createDateTime(1, 8),
        modality: "online",
        isBooked: false,
      },
      {
        id: "5-slot-2",
        psychologistId: "5",
        startDateTime: createDateTime(1, 12),
        endDateTime: createDateTime(1, 13),
        modality: "presencial",
        isBooked: false,
      },
      {
        id: "5-slot-3",
        psychologistId: "5",
        startDateTime: createDateTime(1, 18),
        endDateTime: createDateTime(1, 19),
        modality: "online",
        isBooked: false,
      },
      // Martes
      {
        id: "5-slot-4",
        psychologistId: "5",
        startDateTime: createDateTime(2, 8),
        endDateTime: createDateTime(2, 9),
        modality: "presencial",
        isBooked: false,
      },
      {
        id: "5-slot-5",
        psychologistId: "5",
        startDateTime: createDateTime(2, 16),
        endDateTime: createDateTime(2, 17),
        modality: "online",
        isBooked: false,
      },
      {
        id: "5-slot-6",
        psychologistId: "5",
        startDateTime: createDateTime(2, 19),
        endDateTime: createDateTime(2, 20),
        modality: "online",
        isBooked: false,
      },
      // Miércoles
      {
        id: "5-slot-7",
        psychologistId: "5",
        startDateTime: createDateTime(3, 7),
        endDateTime: createDateTime(3, 8),
        modality: "online",
        isBooked: false,
      },
      {
        id: "5-slot-8",
        psychologistId: "5",
        startDateTime: createDateTime(3, 13),
        endDateTime: createDateTime(3, 14),
        modality: "presencial",
        isBooked: false,
      },
      // Jueves
      {
        id: "5-slot-9",
        psychologistId: "5",
        startDateTime: createDateTime(4, 10),
        endDateTime: createDateTime(4, 11),
        modality: "online",
        isBooked: false,
      },
      {
        id: "5-slot-10",
        psychologistId: "5",
        startDateTime: createDateTime(4, 14),
        endDateTime: createDateTime(4, 15),
        modality: "presencial",
        isBooked: false,
      },
      {
        id: "5-slot-11",
        psychologistId: "5",
        startDateTime: createDateTime(4, 20),
        endDateTime: createDateTime(4, 21),
        modality: "online",
        isBooked: false,
      },
      // Viernes
      {
        id: "5-slot-12",
        psychologistId: "5",
        startDateTime: createDateTime(5, 9),
        endDateTime: createDateTime(5, 10),
        modality: "presencial",
        isBooked: false,
      },
      {
        id: "5-slot-13",
        psychologistId: "5",
        startDateTime: createDateTime(5, 15),
        endDateTime: createDateTime(5, 16),
        modality: "online",
        isBooked: false,
      },
    ],
    bio: "Neuropsicóloga con especialización en trastornos del sueño y manejo del estrés. 15 años de experiencia en consulta privada.",
  },
  {
    id: "6",
    name: "Lic. Diego Martín",
    specialties: ["Duelo", "Depresión", "Autoestima"],
    modalities: ["online"],
    avatar:
      "https://images.pexels.com/photos/5452297/pexels-photo-5452297.jpeg?auto=compress&cs=tinysrgb&w=300",
    rating: 4.5,
    experience: 7,
    availability: [
      // Lunes
      {
        id: "6-slot-1",
        psychologistId: "6",
        startDateTime: createDateTime(1, 14),
        endDateTime: createDateTime(1, 15),
        modality: "online",
        isBooked: false,
      },
      {
        id: "6-slot-2",
        psychologistId: "6",
        startDateTime: createDateTime(1, 17),
        endDateTime: createDateTime(1, 18),
        modality: "online",
        isBooked: false,
      },
      // Martes
      {
        id: "6-slot-3",
        psychologistId: "6",
        startDateTime: createDateTime(2, 11),
        endDateTime: createDateTime(2, 12),
        modality: "online",
        isBooked: false,
      },
      {
        id: "6-slot-4",
        psychologistId: "6",
        startDateTime: createDateTime(2, 17),
        endDateTime: createDateTime(2, 18),
        modality: "online",
        isBooked: false,
      },
      // Miércoles
      {
        id: "6-slot-5",
        psychologistId: "6",
        startDateTime: createDateTime(3, 10),
        endDateTime: createDateTime(3, 11),
        modality: "online",
        isBooked: false,
      },
      {
        id: "6-slot-6",
        psychologistId: "6",
        startDateTime: createDateTime(3, 18),
        endDateTime: createDateTime(3, 19),
        modality: "online",
        isBooked: false,
      },
      // Jueves
      {
        id: "6-slot-7",
        psychologistId: "6",
        startDateTime: createDateTime(4, 12),
        endDateTime: createDateTime(4, 13),
        modality: "online",
        isBooked: false,
      },
      {
        id: "6-slot-8",
        psychologistId: "6",
        startDateTime: createDateTime(4, 16),
        endDateTime: createDateTime(4, 17),
        modality: "online",
        isBooked: false,
      },
      // Viernes
      {
        id: "6-slot-9",
        psychologistId: "6",
        startDateTime: createDateTime(5, 13),
        endDateTime: createDateTime(5, 14),
        modality: "online",
        isBooked: false,
      },
      {
        id: "6-slot-10",
        psychologistId: "6",
        startDateTime: createDateTime(5, 19),
        endDateTime: createDateTime(5, 20),
        modality: "online",
        isBooked: false,
      },
    ],
    bio: "Psicoterapeuta humanista especializado en procesos de duelo y desarrollo personal. Enfoque centrado en la persona.",
  },
];