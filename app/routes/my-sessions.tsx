/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import {
  AlertCircle,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Monitor,
  Search,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { cancelSession, getSessionsByPatient } from "~/models/session.server";
import type { Session } from "~/types";
import { formatDate, formatTimeRange } from "~/utils/dateTime";

export const meta: MetaFunction = () => {
  return [
    { title: "My Sessions - PsicoBook" },
    {
      name: "description",
      content: "Consulta y gestiona tus sesiones agendadas",
    },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "search") {
    try {
      const dni = formData.get("dni") as string;
      const email = formData.get("email") as string;

      if (!dni.trim() || !email.trim()) {
        return {
          error: "Por favor, completa tanto el DNI como el email",
          searchPerformed: true,
        };
      }

      const sessions = await getSessionsByPatient(dni.trim(), email.trim());
      return { sessions, searchPerformed: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Error al buscar sesiones",
        searchPerformed: true,
      };
    }
  }

  if (intent === "cancel") {
    try {
      const sessionId = formData.get("sessionId") as string;
      await cancelSession(sessionId);

      const dni = formData.get("dni") as string;
      const email = formData.get("email") as string;
      const sessions = await getSessionsByPatient(dni, email);

      return {
        sessions,
        searchPerformed: true,
        message: "Sesión cancelada exitosamente",
      };
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : "Error al cancelar la sesión",
        searchPerformed: true,
      };
    }
  }

  return { error: "Acción no válida" };
};

export default function MySessions() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [searchForm, setSearchForm] = useState({
    dni: "",
    email: "",
  });

  const isSearching =
    navigation.state === "submitting" &&
    navigation.formData?.get("intent") === "search";
  const isCancelling =
    navigation.state === "submitting" &&
    navigation.formData?.get("intent") === "cancel";

  const getStatusIcon = (status: string) => {
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

  const getStatusText = (status: string) => {
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

  // Type guard para verificar si actionData tiene sessions
  const hasSessionsData = (
    data: any
  ): data is {
    sessions: any[];
    searchPerformed: boolean;
    message?: string;
  } => {
    return data !== null && data !== undefined && "sessions" in data;
  };

  const sessions = hasSessionsData(actionData) ? actionData.sessions : [];
  const searchPerformed =
    actionData && "searchPerformed" in actionData
      ? actionData.searchPerformed
      : false;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between py-4">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Brain className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">PsicoBook</h1>
            </div>

            <nav className="flex space-x-4 w-full justify-center md:w-auto md:justify-start">
              <a
                href="/"
                className="px-4 py-2 rounded-lg font-medium transition-colors text-gray-600 hover:text-gray-900"
              >
                Psicólogos
              </a>
              <a
                href="/my-sessions"
                className="px-4 py-2 rounded-lg font-medium transition-colors bg-blue-100 text-blue-700"
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Mis sesiones
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Buscar mis sesiones
            </h2>

            <Form method="post" className="space-y-4">
              <input type="hidden" name="intent" value="search" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DNI *
                  </label>
                  <input
                    type="text"
                    name="dni"
                    required
                    value={searchForm.dni}
                    onChange={(e) =>
                      setSearchForm({ ...searchForm, dni: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="12345678"
                    pattern="[0-9]{7,8}"
                    title="Ingresa un DNI válido (7-8 dígitos)"
                    disabled={isSearching}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={searchForm.email}
                    onChange={(e) =>
                      setSearchForm({ ...searchForm, email: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tu@email.com"
                    disabled={isSearching}
                  />
                </div>
              </div>
              {(actionData as { error: string })?.error ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">
                    {(actionData as { error: string }).error}
                  </p>
                </div>
              ) : null}
              {hasSessionsData(actionData) && actionData.message && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">{actionData.message}</p>
                </div>
              )}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isSearching}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? "Buscando..." : "Buscar sesiones"}
                </button>
                {searchPerformed && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchForm({ dni: "", email: "" });
                      window.location.reload();
                    }}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            </Form>
          </div>

          {!searchPerformed && (
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

          {searchPerformed && sessions.length === 0 && !isSearching && (
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

          {searchPerformed && sessions.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Se encontraron {sessions.length} sesión(es)
              </p>
              {/* @ts-expect-error Type error*/}
              {sessions.map((session: Session) => (
                <div
                  key={session.id}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-col md:flex-row items-start space-y-4 md:space-x-4">
                      <img
                        src={
                          session.psychologist?.avatar || "/default-avatar.png"
                        }
                        alt={session.psychologist?.name || "Psicólogo"}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {session.psychologist?.name || "Psicólogo"}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {session.specialty}
                        </p>

                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(session.startDateTime)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {formatTimeRange(
                              session.startDateTime,
                              session.endDateTime
                            )}
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

                        <Form method="post" className="inline">
                          <input type="hidden" name="intent" value="cancel" />
                          <input
                            type="hidden"
                            name="sessionId"
                            value={session.id}
                          />
                          <input
                            type="hidden"
                            name="dni"
                            value={searchForm.dni}
                          />
                          <input
                            type="hidden"
                            name="email"
                            value={searchForm.email}
                          />

                          <button
                            type="submit"
                            disabled={isCancelling}
                            onClick={(e) => {
                              if (
                                !window.confirm(
                                  "¿Estás seguro de que querés cancelar esta sesión?"
                                )
                              ) {
                                e.preventDefault();
                              }
                            }}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>
                              {isCancelling ? "Cancelando..." : "Cancelar"}
                            </span>
                          </button>
                        </Form>
                      </div>
                    )}

                    {session.status === "cancelled" && (
                      <div className="flex-1 mr-4">
                        <div className="p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-800">
                            <strong>Sesión cancelada:</strong> El horario ha
                            sido liberado y está disponible para otros
                            pacientes.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
