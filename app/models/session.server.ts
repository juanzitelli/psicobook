import { Modality } from "@prisma/client";
import { db } from "~/lib/db.server";
import type { Session } from "~/types";

export async function createSession(data: {
  psychologistId: string;
  timeSlotId: string;
  patientName: string;
  patientDni: string;
  patientEmail: string;
  startDateTime: string;
  endDateTime: string;
  specialty: string;
  modality: string;
}) {
  const timeSlot = await db.timeSlot.findUnique({
    where: { id: data.timeSlotId },
  });

  if (!timeSlot || timeSlot.isBooked) {
    throw new Error("El horario ya no está disponible");
  }

  const session = await db.$transaction(async (tx) => {
    const newSession = await tx.session.create({
      data: {
        psychologistId: data.psychologistId,
        timeSlotId: data.timeSlotId,
        patientName: data.patientName,
        patientDni: data.patientDni,
        patientEmail: data.patientEmail.toLowerCase(),
        startDateTime: new Date(data.startDateTime),
        endDateTime: new Date(data.endDateTime),
        specialty: data.specialty,
        modality: data.modality as Modality,
      },
    });

    await tx.timeSlot.update({
      where: { id: data.timeSlotId },
      data: {
        isBooked: true,
        bookedBy: data.patientEmail.toLowerCase(),
      },
    });

    return newSession;
  });

  return session;
}

export async function getSessionsByPatient(
  dni: string,
  email: string
): Promise<Session[]> {
  const sessions = await db.session.findMany({
    where: {
      patientDni: dni,
      patientEmail: email.toLowerCase(),
    },
    include: {
      psychologist: {
        select: {
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      startDateTime: "desc",
    },
  });

  return sessions.map((session) => ({
    ...session,
    startDateTime: new Date(session.startDateTime),
    endDateTime: new Date(session.endDateTime),
    createdAt: new Date(session.createdAt),
    status: session.status as "scheduled" | "completed" | "cancelled",
    modality: session.modality as "online" | "presencial",
  }));
}

export async function getSessionById(
  sessionId: string
): Promise<Session | null> {
  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: {
      psychologist: {
        select: {
          name: true,
          avatar: true,
        },
      },
    },
  });

  if (!session) return null;

  return {
    ...session,
    startDateTime: new Date(session.startDateTime),
    endDateTime: new Date(session.endDateTime),
    createdAt: new Date(session.createdAt),
    status: session.status as "scheduled" | "completed" | "cancelled",
    modality: session.modality as "online" | "presencial",
  };
}

export async function cancelSession(sessionId: string) {
  const session = await db.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw new Error("Sesión no encontrada");
  }

  if (session.status !== "scheduled") {
    throw new Error("Solo se pueden cancelar sesiones agendadas");
  }

  await db.$transaction(async (tx) => {
    // Eliminar la sesión
    await tx.session.delete({
      where: { id: sessionId },
    });

    // Liberar el timeSlot
    await tx.timeSlot.update({
      where: { id: session.timeSlotId },
      data: {
        isBooked: false,
        bookedBy: null,
      },
    });
  });
}

export async function checkSlotAvailability(
  timeSlotId: string
): Promise<boolean> {
  const slot = await db.timeSlot.findUnique({
    where: { id: timeSlotId },
  });

  return slot ? !slot.isBooked : false;
}
