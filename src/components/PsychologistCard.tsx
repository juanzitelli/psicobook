import { Clock, MapPin, Monitor, Star, User } from "lucide-react";
import React from "react";
import { Psychologist } from "../types";

interface PsychologistCardProps {
  psychologist: Psychologist;
  onViewCalendar: (psychologist: Psychologist) => void;
}

export const PsychologistCard: React.FC<PsychologistCardProps> = ({
  psychologist,
  onViewCalendar,
}) => {
  const availableSlots = psychologist.availability.filter(
    (slot) => !slot.isBooked
  ).length;
  const isLowAvailability = availableSlots <= 5;

  const getModalityIcon = (modality: string) => {
    return modality === "online" ? (
      <Monitor className="w-3 h-3" />
    ) : (
      <MapPin className="w-3 h-3" />
    );
  };

  const getModalityLabel = (modality: string) => {
    return modality === "online" ? "Online" : "Presencial";
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <img
              src={psychologist.avatar}
              alt={psychologist.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {psychologist.name}
                </h3>
                {isLowAvailability && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                    Poca disponibilidad
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{psychologist.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>
                    {psychologist.experience}
                    <span className="hidden md:inline"> años exp.</span>
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {availableSlots}
                    <span className="hidden md:inline">
                      {" "}
                      horarios disponibles
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-2">
                {psychologist.modalities.map((modality) => (
                  <span
                    key={modality}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                      modality === "online"
                        ? "bg-green-100 text-green-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {getModalityIcon(modality)}
                    <span>{getModalityLabel(modality)}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-gray-600 mt-4 text-sm">{psychologist.bio}</p>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Especialidades:
            </h4>
            <div className="flex flex-wrap gap-2">
              {psychologist.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => onViewCalendar(psychologist)}
            className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Ver disponibilidad
          </button>
        </div>
      </div>
    </>
  );
};
