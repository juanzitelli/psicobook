import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  data,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { ArrowLeft, Calendar } from "lucide-react";
import { useState } from "react";
import { BookingModal } from "~/components/BookingModal";
import { MonthlyCalendar } from "~/components/MonthlyCalendar";
import { getPsychologistById } from "~/models/psychologist.server";
import { checkSlotAvailability, createSession } from "~/models/session.server";
import type { TimeSlot } from "~/types";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  if (!id) throw new Response("Not Found", { status: 404 });

  const psychologist = await getPsychologistById(id);
  if (!psychologist) throw new Response("Not Found", { status: 404 });

  return { psychologist };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "book") {
    try {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const isEmailValid = emailRegex.test(
        formData.get("patientEmail") as string
      );

      if (!isEmailValid) {
        return {
          error: "El correo electrónico proporcionado no es válido.",
        };
      }

      const timeSlotId = formData.get("timeSlotId") as string;

      const isAvailable = await checkSlotAvailability(timeSlotId);
      if (!isAvailable) {
        return {
          error:
            "Este horario ya no está disponible. Por favor, selecciona otro horario.",
        };
      }

      const startDateTimeStr = formData.get("startDateTime") as string;
      const endDateTimeStr = formData.get("endDateTime") as string;

      await createSession({
        psychologistId: formData.get("psychologistId") as string,
        timeSlotId,
        patientName: formData.get("patientName") as string,
        patientDni: formData.get("patientDni") as string,
        patientEmail: formData.get("patientEmail") as string,
        startDateTime: startDateTimeStr,
        endDateTime: endDateTimeStr,
        specialty: formData.get("specialty") as string,
        modality: formData.get("modality") as string,
      });

      return { success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Error al agendar la sesión",
      };
    }
  }

  return data({ error: "Acción no válida" }, { status: 400 });
};

export default function PsychologistCalendar() {
  const { psychologist } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleSlotClick = (slot: TimeSlot) => {
    if (!slot.isBooked) {
      setSelectedSlot(slot);
      setShowBookingModal(true);
    }
  };

  const handleBookingClose = () => {
    setShowBookingModal(false);
    setSelectedSlot(null);

    // @ts-expect-error Type error
    if (actionData?.success) {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <a
              href="/"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div className="flex items-center space-x-3">
              <img
                src={psychologist.avatar}
                alt={psychologist.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {psychologist.name}
                </h1>
                <p className="text-gray-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Próximos 30 días
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MonthlyCalendar
          psychologist={{
            ...psychologist,
            availability: psychologist.availability.map((item) => ({
              ...item,
              endDateTime: new Date(item.endDateTime),
              startDateTime: new Date(item.startDateTime),
            })),
          }}
          onSlotClick={handleSlotClick}
        />

        {showBookingModal && selectedSlot && (
          <BookingModal
            psychologist={{
              ...psychologist,
              availability: psychologist.availability.map((item) => ({
                ...item,
                endDateTime: new Date(item.endDateTime),
                startDateTime: new Date(item.startDateTime),
              })),
            }}
            timeSlot={selectedSlot}
            onClose={handleBookingClose}
            actionData={actionData}
            isSubmitting={navigation.state === "submitting"}
          />
        )}
      </main>
    </div>
  );
}
