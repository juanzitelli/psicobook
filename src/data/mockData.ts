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

const generateTimeSlots = (
  psychologistId: string,
  availability: number
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const timeOptions = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  const modalityOptions: ("online" | "presencial")[] = ["online", "presencial"];

  for (let day = 0; day < 30; day++) {
    const date = new Date();
    date.setDate(date.getDate() + day);
    const dateString = date.toISOString().split("T")[0];

    const numSlotsToGenerate =
      Math.floor(availability / 30) + (Math.random() > 0.5 ? 1 : 0);

    const tempTimeOptions = [...timeOptions];
    const selectedTimes: string[] = [];

    for (let i = 0; i < numSlotsToGenerate && tempTimeOptions.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * tempTimeOptions.length);
      selectedTimes.push(tempTimeOptions[randomIndex]);
      tempTimeOptions.splice(randomIndex, 1);
    }
    selectedTimes.sort();

    selectedTimes.forEach((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const endHours = hours + 1;
      const endTime = `${endHours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;

      const availableModalities =
        Math.random() > 0.3
          ? modalityOptions
          : [
              modalityOptions[
                Math.floor(Math.random() * modalityOptions.length)
              ],
            ];

      availableModalities.forEach((modality) => {
        slots.push({
          id: `${psychologistId}-${dateString}-${time}-${modality}`,
          psychologistId,
          date: dateString,
          startTime: time,
          endTime,
          modality,
          isBooked: Math.random() > 0.8, // 20% chance of being booked
        });
      });
    });
  }

  return slots;
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
    availability: [],
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
    availability: [],
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
    availability: [],
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
    availability: [],
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
    availability: [],
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
    availability: [],
    bio: "Psicoterapeuta humanista especializado en procesos de duelo y desarrollo personal. Enfoque centrado en la persona.",
  },
];

mockPsychologists.forEach((psychologist) => {
  const availabilityLevel = Math.floor(Math.random() * 20) + 10; // 10-30 slots per week
  psychologist.availability = generateTimeSlots(
    psychologist.id,
    availabilityLevel
  );
});
