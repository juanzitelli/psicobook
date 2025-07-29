import {
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Monitor,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { mockPsychologists } from "../data/mockData";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Psychologist, Session, TimeSlot } from "../types";
import { formatDateString, formatTime } from "../utils/dateTime";

interface BookingModalProps {
  psychologist: Psychologist;
  timeSlot: TimeSlot;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  psychologist,
  timeSlot,
  onClose,
}) => {
  const [sessions, setSessions] = useLocalStorage<Session[]>("sessions", []);
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    specialty: psychologist.specialties[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newSession: Session = {
      id: Date.now().toString(),
      psychologistId: psychologist.id,
      patientName: formData.patientName,
      patientEmail: formData.patientEmail,
      date: timeSlot.date,
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime,
      specialty: formData.specialty,
      modality: timeSlot.modality,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    };

    setSessions([...sessions, newSession]);

    // Mark slot as booked
    const psychologistIndex = mockPsychologists.findIndex(
      (p) => p.id === psychologist.id
    );
    if (psychologistIndex !== -1) {
      const slotIndex = mockPsychologists[
        psychologistIndex
      ].availability.findIndex((s) => s.id === timeSlot.id);
      if (slotIndex !== -1) {
        mockPsychologists[psychologistIndex].availability[slotIndex].isBooked =
          true;
        mockPsychologists[psychologistIndex].availability[slotIndex].bookedBy =
          newSession.id;
      }
    }

    setIsSubmitting(false);
    setIsConfirmed(true);
  };

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
              Hemos enviado los detalles de tu cita a {formData.patientEmail}
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
                  {formatDateString(timeSlot.date)}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatTime(timeSlot.startTime)} -{" "}
                  {formatTime(timeSlot.endTime)}
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
                    {formatDateString(timeSlot.date)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTime(timeSlot.startTime)} -{" "}
                    {formatTime(timeSlot.endTime)}
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo *
              </label>
              <input
                type="text"
                required
                value={formData.patientName}
                onChange={(e) =>
                  setFormData({ ...formData, patientName: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.patientEmail}
                onChange={(e) =>
                  setFormData({ ...formData, patientEmail: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temática de consulta
              </label>
              <select
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {psychologist.specialties.map((specialty) => (
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
          </form>
        </div>
      </div>
    </div>
  );
};
