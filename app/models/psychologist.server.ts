// app/models/psychologist.server.ts
import { db } from "~/lib/db.server";
import type { Psychologist } from "~/types";

export async function getPsychologists(): Promise<Psychologist[]> {
  const psychologists = await db.psychologist.findMany({
    include: {
      timeSlots: {
        where: {
          startDateTime: {
            gte: new Date(),
          },
        },
        orderBy: {
          startDateTime: "asc",
        },
      },
    },
  });

  return psychologists.map((p) => ({
    id: p.id,
    name: p.name,
    specialties: JSON.parse(p.specialties),
    modalities: JSON.parse(p.modalities),
    avatar: p.avatar,
    rating: p.rating,
    experience: p.experience,
    bio: p.bio,
    availability: p.timeSlots.map((slot) => ({
      id: slot.id,
      psychologistId: slot.psychologistId,
      startDateTime: new Date(slot.startDateTime),
      endDateTime: new Date(slot.endDateTime),
      modality: slot.modality as "online" | "presencial",
      isBooked: slot.isBooked,
      bookedBy: slot.bookedBy,
    })),
  }));
}

export async function getPsychologistById(
  id: string
): Promise<Psychologist | null> {
  const psychologist = await db.psychologist.findUnique({
    where: { id },
    include: {
      timeSlots: {
        where: {
          startDateTime: {
            gte: new Date(),
          },
        },
        orderBy: {
          startDateTime: "asc",
        },
      },
    },
  });

  if (!psychologist) return null;

  return {
    id: psychologist.id,
    name: psychologist.name,
    specialties: JSON.parse(psychologist.specialties),
    modalities: JSON.parse(psychologist.modalities),
    avatar: psychologist.avatar,
    rating: psychologist.rating,
    experience: psychologist.experience,
    bio: psychologist.bio,
    availability: psychologist.timeSlots.map((slot) => ({
      id: slot.id,
      psychologistId: slot.psychologistId,
      startDateTime: new Date(slot.startDateTime),
      endDateTime: new Date(slot.endDateTime),
      modality: slot.modality as "online" | "presencial",
      isBooked: slot.isBooked,
      bookedBy: slot.bookedBy,
    })),
  };
}
