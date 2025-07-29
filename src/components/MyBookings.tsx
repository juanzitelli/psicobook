import React from "react";
import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  CreditCard,
  CheckCircle,
  AlertCircle,
  XCircle,
  Trash2,
  Monitor,
  MapPin,
  Search,
} from "lucide-react";
import { Session } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { formatDate, formatTimeRange } from "../utils/dateTime";
import { mockPsychologists } from "../data/mockData";

export const MyBookings: React.FC = () => {
  const [sessions, setSessions] = useLocalStorage<Session[]>("sessions", [], (sessions: any[]) => {
    return sessions.map(session => ({
      ...session,
      startDateTime: new Date(session.startDateTime),
      endDateTime: new Date(session.endDateTime),
      createdAt: new Date(session.createdAt)
    }));
  });
  const [searchForm, setSearchForm] = useState({
    dni: "",
    email: "",
  });
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchForm.dni.trim() || !searchForm.email.trim()) {
      alert("Por favor, completa tanto el DNI como el email");
      return;
    }

    const filtered = sessions.filter(
      (session) =>
        session.patientDni === searchForm.dni.trim() &&
        session.patientEmail.toLowerCase() === searchForm.email.trim().toLowerCase()
    );

    setFilteredSessions(filtered);
    setHasSearched(true);
  };

  const clearSearch = () => {
    setSearchForm({ dni: "", email: "" });
    setFilteredSessions([]);
    setHasSearched(false);
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

      // Update filtered sessions if we're in search mode
      if (hasSearched) {
        const updatedFiltered = filteredSessions.map((session) =>
          session.id === sessionId
            ? { ...session, status: "cancelled" as const }
            : session
        );
        setFilteredSessions(updatedFiltered);
      }
    }
  };

  const displaySessions = hasSearched ? filteredSessions : [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Mis sesiones</h2>

      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Search className="w-5 h-5 mr-2" />
          Buscar mis sesiones
        </h3>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DNI *
              </label>
              <input
                type="text"
                required
                value={searchForm.dni}
                onChange={(e) =>
                  setSearchForm({ ...searchForm, dni: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12345678"
                pattern="[0-9]{7,8}"
                title="Ingresa un DNI válido (7-8 dígitos)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={searchForm.email}
                onChange={(e) =>
                  setSearchForm({ ...searchForm, email: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Buscar sesiones
            </button>
            {hasSearched && (
              <button
                type="button"
                onClick={clearSearch}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results */}
      {!hasSearched && (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Busca tus sesiones
          </h3>
          <p className="text-gray-600">
            Ingresa tu DNI y email para ver tus sesiones agendadas
          </p>
        </div>
      )}

      {hasSearched && displaySessions.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No se encontraron sesiones
          </h3>
          <p className="text-gray-600">
            No hay sesiones registradas con ese DNI y email
          </p>
        </div>
      )}

      {hasSearched && displaySessions.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Se encontraron {displaySessions.length} sesión(es)
          </p>
          {displaySessions.map((session) => {
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
                          {formatDate(session.startDateTime)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {formatTimeRange(session.startDateTime, session.endDateTime)}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          {session.patientName}
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          DNI: {session.patientDni}
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
      )}
    </div>
  );
};
