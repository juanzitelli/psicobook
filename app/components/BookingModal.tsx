import { Form } from "@remix-run/react";
import {
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Monitor,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { formatDate, formatTimeRange } from "~/utils/dateTime";
import type { Psychologist, TimeSlot } from "~/types";

interface BookingModalProps {
  psychologist: Psychologist;
  timeSlot: TimeSlot;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionData?: any;
  isSubmitting: boolean;
}

export function BookingModal({
  psychologist,
  timeSlot,
  onClose,
  actionData,
  isSubmitting,
}: BookingModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (actionData?.success) {
      setIsConfirmed(true);
    }
  }, [actionData]);

  const getModalityIcon = (modality: string) => {
    return modality === "online" ? (
      <Monitor className="w-4 h-4" />
    ) : (
      <MapPin className="w-4 h-4" />
    );
  };

  const getModalityLabel = (modality: string) => {
    return modality === "online" ? "Online" : "Presencial";
  };

  if (isConfirmed) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ¡Sesión agendada con éxito!
            </h3>
            <p className="text-gray-600 mb-6">
              Hemos enviado los detalles de tu cita por email
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h4 className="font-medium text-gray-900 mb-2">
                Detalles de tu cita:
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {psychologist.name}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(timeSlot.startDateTime)}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatTimeRange(
                    timeSlot.startDateTime,
                    timeSlot.endDateTime
                  )}
                </div>
                <div className="flex items-center">
                  {getModalityIcon(timeSlot.modality)}
                  <span className="ml-2">
                    {getModalityLabel(timeSlot.modality)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Agendar sesión
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {actionData?.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{actionData.error}</p>
            </div>
          )}

          <div
            className={`rounded-lg p-4 mb-6 ${
              timeSlot.modality === "online" ? "bg-green-50" : "bg-purple-50"
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={psychologist.avatar}
                alt={psychologist.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4
                  className={`font-semibold ${
                    timeSlot.modality === "online"
                      ? "text-green-900"
                      : "text-purple-900"
                  }`}
                >
                  {psychologist.name}
                </h4>
                <div
                  className={`text-sm space-y-1 ${
                    timeSlot.modality === "online"
                      ? "text-green-700"
                      : "text-purple-700"
                  }`}
                >
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(timeSlot.startDateTime)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTimeRange(
                      timeSlot.startDateTime,
                      timeSlot.endDateTime
                    )}
                  </div>
                  <div className="flex items-center">
                    {getModalityIcon(timeSlot.modality)}
                    <span className="ml-1 font-medium">
                      {getModalityLabel(timeSlot.modality)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="book" />
            <input
              type="hidden"
              name="psychologistId"
              value={psychologist.id}
            />
            <input type="hidden" name="timeSlotId" value={timeSlot.id} />
            <input
              type="hidden"
              name="startDateTime"
              value={new Date(timeSlot.startDateTime).toISOString()}
            />
            <input
              type="hidden"
              name="endDateTime"
              value={new Date(timeSlot.endDateTime).toISOString()}
            />
            <input type="hidden" name="modality" value={timeSlot.modality} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo *
              </label>
              <input
                type="text"
                name="patientName"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu nombre completo"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DNI *
              </label>
              <input
                type="text"
                name="patientDni"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12345678"
                pattern="[0-9]{7,8}"
                title="Ingresa un DNI válido (7-8 dígitos)"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="patientEmail"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temática de consulta
              </label>
              <select
                name="specialty"
                defaultValue={psychologist.specialties?.[0] || ""}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              >
                {psychologist.specialties?.map((specialty: string) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <h5 className="font-medium text-gray-900 mb-2">
                Antes de confirmar:
              </h5>
              <ul className="space-y-1">
                {timeSlot.modality === "online" ? (
                  <li>• La sesión será online vía videollamada</li>
                ) : (
                  <li>• La sesión será presencial en el consultorio</li>
                )}
                <li>• Duración: 50 minutos</li>
                <li>• Podés cancelar hasta 24h antes</li>
                {timeSlot.modality === "online" ? (
                  <li>• Vas a recibir un email con el link de acceso</li>
                ) : (
                  <li>
                    • Vas a recibir un email con la dirección del consultorio
                  </li>
                )}
              </ul>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Agendando..." : "Confirmar sesión"}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}