import { Modality, PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const psychologists = [
  {
    name: "Dra. María González",
    specialties: ["Ansiedad", "Depresión", "Autoestima"],
    modalities: ["online", "presencial"],
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    rating: 4.8,
    experience: 8,
    bio: "Especialista en terapia cognitivo-conductual con enfoque en ansiedad y depresión. Más de 8 años ayudando a personas a mejorar su bienestar emocional.",
  },
  {
    name: "Dr. Carlos Mendoza",
    specialties: ["Terapia de pareja", "Estrés laboral"],
    modalities: ["presencial"],
    avatar:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    rating: 4.9,
    experience: 12,
    bio: "Psicólogo especializado en terapia sistémica y de pareja. Ayudo a las parejas a mejorar su comunicación y resolver conflictos.",
  },
  {
    name: "Dra. Ana Rodríguez",
    specialties: ["Trastornos alimentarios", "Autoestima", "Ansiedad"],
    modalities: ["online"],
    avatar:
      "https://images.unsplash.com/photo-1594824388853-2c5e2a99c1cf?w=400&h=400&fit=crop&crop=face",
    rating: 4.7,
    experience: 6,
    bio: "Especialista en trastornos de la conducta alimentaria y trabajo con la autoestima. Enfoque integral y empático.",
  },
];

function generateTimeSlots(psychologistId: string, modalities: string[]) {
  const slots = [];
  const today = new Date();

  // Generar slots para los próximos 30 días
  for (let day = 0; day < 30; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    // Generate 4-6 slots per day
    const slotsPerDay = Math.floor(Math.random() * 3) + 4;

    for (let slot = 0; slot < slotsPerDay; slot++) {
      const hour = 9 + Math.floor(Math.random() * 8); // 9 AM to 5 PM
      const startDateTime = new Date(date);
      startDateTime.setHours(hour, 0, 0, 0);

      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(50); // 50 minute sessions

      const modalityString =
        modalities[Math.floor(Math.random() * modalities.length)];
      const modality =
        modalityString === "online" ? Modality.online : Modality.presencial;

      slots.push({
        psychologistId,
        startDateTime,
        endDateTime,
        modality,
        isBooked: Math.random() < 0.3, // 30% chance of being booked
      });
    }
  }

  return slots;
}

async function seed() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await db.session.deleteMany();
  await db.timeSlot.deleteMany();
  await db.psychologist.deleteMany();

  // Create psychologists
  for (const psychologist of psychologists) {
    const created = await db.psychologist.create({
      data: {
        name: psychologist.name,
        specialties: JSON.stringify(psychologist.specialties),
        modalities: JSON.stringify(psychologist.modalities),
        avatar: psychologist.avatar,
        rating: psychologist.rating,
        experience: psychologist.experience,
        bio: psychologist.bio,
      },
    });

    // Generate time slots for this psychologist
    const timeSlots = generateTimeSlots(created.id, psychologist.modalities);

    for (const slot of timeSlots) {
      await db.timeSlot.create({
        data: slot,
      });
    }

    console.log(`✅ Created psychologist: ${psychologist.name}`);
  }

  console.log("🎉 Database seeded successfully!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
