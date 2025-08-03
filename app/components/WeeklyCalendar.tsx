import { Clock, Filter as FilterIcon, MapPin, Monitor } from "lucide-react";
import { useState } from "react";
import {
  formatTime,
  getDayNameFromDate,
  getNext30Days,
  isSameDay,
} from "~/utils/dateTime";
import type { Psychologist, TimeSlot } from "~/types";

interface WeeklyCalendarProps {
  psychologist: Psychologist;
  onSlotClick: (slot: TimeSlot) => void;
}

export function WeeklyCalendar({
  psychologist,
  onSlotClick,
}: WeeklyCalendarProps) {
  const [modalityFilter, setModalityFilter] = useState<
    "all" | "online" | "presencial"
  >("all");
  const next30Days = getNext30Days();

  const getSlotsByDate = (targetDate: Date) => {
    let filteredSlots = psychologist.availability.filter((slot: TimeSlot) => {
      const slotDate = slot.startDateTime;
      return isSameDay(slotDate, targetDate) && !slot.isBooked;
    });

    if (modalityFilter !== "all") {
      filteredSlots = filteredSlots.filter(
        (slot: TimeSlot) => slot.modality === modalityFilter
      );
    }

    return filteredSlots.sort((a: TimeSlot, b: TimeSlot) => {
      const dateA = new Date(a.startDateTime);
      const dateB = new Date(b.startDateTime);
      return dateA.getTime() - dateB.getTime();
    });
  };

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
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FilterIcon className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Modalidad:
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setModalityFilter("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                modalityFilter === "all"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Todas
            </button>
            {psychologist.modalities.includes("online") && (
              <button
                onClick={() => setModalityFilter("online")}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  modalityFilter === "online"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Monitor className="w-3 h-3" />
                <span>Online</span>
              </button>
            )}
            {psychologist.modalities.includes("presencial") && (
              <button
                onClick={() => setModalityFilter("presencial")}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  modalityFilter === "presencial"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>Presencial</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 max-h-96 overflow-y-auto">
          {next30Days.map((date) => {
            const daySlots = getSlotsByDate(date);
            const dateKey = date.toISOString().split("T")[0];

            return (
              <div
                key={dateKey}
                className="border border-gray-200 rounded-lg p-4 min-h-[200px]"
              >
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-gray-900">
                    {getDayNameFromDate(date)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {date.getDate()}/{date.getMonth() + 1}
                  </p>
                </div>

                <div className="space-y-3">
                  {daySlots.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4">
                      Sin disponibilidad
                    </p>
                  ) : (
                    daySlots.map((slot: TimeSlot) => (
                      <button
                        key={slot.id}
                        onClick={() => onSlotClick(slot)}
                        disabled={slot.isBooked}
                        className={`w-full p-2 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center space-x-1 md:flex-col ${
                          slot.isBooked
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : slot.modality === "online"
                            ? "bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer"
                            : "bg-purple-50 text-purple-700 hover:bg-purple-100 cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 hidden md:inline" />
                          <span>{formatTime(slot.startDateTime)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getModalityIcon(slot.modality)}
                          <span className="text-xs">
                            {getModalityLabel(slot.modality)}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">
            Información importante:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Las sesiones duran 50 minutos</li>
            <li>• Sesiones online: videollamada desde tu casa</li>
            <li>• Sesiones presenciales: en el consultorio del profesional</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
