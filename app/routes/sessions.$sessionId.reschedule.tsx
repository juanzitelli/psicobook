import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { MonthlyCalendar } from "~/components/MonthlyCalendar";
import { getPsychologistById } from "~/models/psychologist.server";
import {
  cancelSession,
  createSession,
  getSessionById,
} from "~/models/session.server";
import type { TimeSlot } from "~/types";

export async function loader({ params }: LoaderFunctionArgs) {
  // Get session by ID using getSessionsByPatient and filter
  const sessionId = params.sessionId!;
  const session = await getSessionById(sessionId);

  if (!session) {
    throw new Response("Sesión no encontrada", { status: 404 });
  }
  // Fetch full psychologist object
  const psychologist = await getPsychologistById(session.psychologistId);

  if (!psychologist) {
    throw new Response("Psicólogo no encontrado", { status: 404 });
  }

  return { session, psychologist };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const slotId = formData.get("slotId") as string;
  const sessionId = params.sessionId!;
  const session = await getSessionById(sessionId);
  if (!session) {
    return { error: "Sesión no encontrada" };
  }
  // Cancelar la sesión anterior
  await cancelSession(sessionId);
  // Crear nueva sesión con la info anterior y el nuevo slot
  await createSession({
    psychologistId: session.psychologistId,
    timeSlotId: slotId,
    patientName: session.patientName,
    patientDni: session.patientDni,
    patientEmail: session.patientEmail,
    specialty: session.specialty,
    modality: String(formData.get("modality") ?? ""),
    startDateTime: String(formData.get("startDateTime") ?? ""),
    endDateTime: String(formData.get("endDateTime") ?? ""),
  });

  return redirect("/my-sessions");
}

export default function RescheduleSession() {
  const { session, psychologist } = useLoaderData<typeof loader>();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const navigate = useNavigate();

  const handleSlotClick = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    await fetch("", {
      method: "POST",
      body: data,
    });
    navigate("/my-sessions");
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Reagendar sesión</h1>
      <p className="mb-6 text-gray-700">
        Selecciona un nuevo horario para tu sesión con{" "}
        <b>{session.psychologist?.name}</b>.
      </p>
      <MonthlyCalendar
        psychologist={{
          ...psychologist,
          availability: psychologist.availability.map((slot) => ({
            ...slot,
            startDateTime: new Date(slot.startDateTime),
            endDateTime: new Date(slot.endDateTime),
          })),
        }}
        onSlotClick={handleSlotClick}
      />
      {selectedSlot && (
        <form method="post" className="mt-6" onSubmit={handleSubmit}>
          <input type="hidden" name="slotId" value={selectedSlot.id} />
          <input type="hidden" name="modality" value={selectedSlot.modality} />
          <input
            type="hidden"
            name="startDateTime"
            value={
              selectedSlot.startDateTime instanceof Date
                ? selectedSlot.startDateTime.toISOString()
                : String(selectedSlot.startDateTime)
            }
          />
          <input
            type="hidden"
            name="endDateTime"
            value={
              selectedSlot.endDateTime instanceof Date
                ? selectedSlot.endDateTime.toISOString()
                : String(selectedSlot.endDateTime)
            }
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Confirmar nuevo horario
          </button>
        </form>
      )}
    </div>
  );
}
