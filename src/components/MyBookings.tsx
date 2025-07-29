import React from "react";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  Trash2,
  Monitor,
  MapPin,
} from "lucide-react";
import { Session } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { formatTime, formatDateString } from "../utils/dateTime";
import { mockPsychologists } from "../data/mockData";

export const MyBookings: React.FC = () => {
  const [sessions, setSessions] = useLocalStorage<Session[]>("sessions", []);

  const getPsychologist = (id: string) => {
    return mockPsychologists.find((p) => p.id === id);
  };

  const getStatusIcon = (status: Session["status"]) => {
    switch (status) {
      case "scheduled":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: Session["status"]) => {
    switch (status) {
      case "scheduled":
        return "Agendada";
      case "completed":
        return "Completada";
      case "cancelled":
        return "Cancelada";
      default:
        return "Pendiente";
    }
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
  const handleCancelSession = (sessionId: string) => {
    if (window.confirm("¿Estás seguro de que quieres cancelar esta sesión?")) {
      // Update session status to cancelled
      const updatedSessions = sessions.map((session) =>
        session.id === sessionId
          ? { ...session, status: "cancelled" as const }
          : session
      );
      setSessions(updatedSessions);

      // Free up the time slot
      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        const psychologistIndex = mockPsychologists.findIndex(
          (p) => p.id === session.psychologistId
        );
        if (psychologistIndex !== -1) {
          const slotIndex = mockPsychologists[
            psychologistIndex
          ].availability.findIndex((slot) => slot.bookedBy === sessionId);
          if (slotIndex !== -1) {
            mockPsychologists[psychologistIndex].availability[
              slotIndex
            ].isBooked = false;
            mockPsychologists[psychologistIndex].availability[
              slotIndex
            ].bookedBy = undefined;
          }
        }
      }
    }
  };

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No tenés sesiones agendadas
        </h3>
        <p className="text-gray-600">
          Cuando agendes una sesión, aparecerá acá
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis sesiones</h2>

      {sessions.map((session) => {
        const psychologist = getPsychologist(session.psychologistId);
        if (!psychologist) return null;

        return (
          <div key={session.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col md:flex-row items-start space-y-4 md:space-x-4">
                <img
                  src={psychologist.avatar}
                  alt={psychologist.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {psychologist.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{session.specialty}</p>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDateString(session.date)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatTime(session.startTime)} -{" "}
                      {formatTime(session.endTime)}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {session.patientName}
                    </div>
                    <div className="flex items-center">
                      {getModalityIcon(session.modality)}
                      <span className="ml-2 font-medium">
                        {getModalityLabel(session.modality)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {getStatusIcon(session.status)}
                <span className="text-sm font-medium">
                  {getStatusText(session.status)}
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between">
              {session.status === "scheduled" && (
                <div className="flex-1 mr-4">
                  <div
                    className={`p-3 rounded-lg mb-3 ${
                      session.modality === "online"
                        ? "bg-green-50"
                        : "bg-purple-50"
                    }`}
                  >
                    <p
                      className={`text-sm ${
                        session.modality === "online"
                          ? "text-green-800"
                          : "text-purple-800"
                      }`}
                    >
                      <strong>Recordatorio:</strong>{" "}
                      {session.modality === "online"
                        ? "Recibirás el link de la videollamada por email 15 minutos antes de la sesión."
                        : "Recibirás la dirección del consultorio por email. Por favor, asegurate de llegar 10 minutos antes."}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCancelSession(session.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium justify-self-end"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                </div>
              )}

              {session.status === "cancelled" && (
                <div className="flex-1 mr-4">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Sesión cancelada:</strong> El horario ha sido
                      liberado y está disponible para otros pacientes.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
