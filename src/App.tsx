import { Brain, Calendar, Filter as FilterIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { FilterBar } from "./components/FilterBar";
import { MyBookings } from "./components/MyBookings";
import { PsychologistCard } from "./components/PsychologistCard";
import { WeeklyCalendar } from "./components/WeeklyCalendar";
import { mockPsychologists, specialties } from "./data/mockData";
import { Filter, Psychologist } from "./types";

type ViewMode = "list" | "calendar" | "bookings";

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedPsychologist, setSelectedPsychologist] =
    useState<Psychologist | null>(null);
  const [filter, setFilter] = useState<Filter>({
    specialty: "",
    modality: "all",
    availability: "all",
  });

  const filteredPsychologists = useMemo(() => {
    return mockPsychologists.filter((psychologist) => {
      if (
        filter.specialty &&
        !psychologist.specialties.includes(filter.specialty)
      ) {
        return false;
      }

      if (
        filter.modality !== "all" &&
        !psychologist.modalities.includes(filter.modality)
      ) {
        return false;
      }

      let availableSlots = psychologist.availability.filter(
        (slot) => !slot.isBooked
      );

      if (filter.modality !== "all") {
        availableSlots = availableSlots.filter(
          (slot) => slot.modality === filter.modality
        );
      }

      if (filter.availability === "high" && availableSlots.length <= 5) {
        return false;
      }
      if (filter.availability === "low" && availableSlots.length > 5) {
        return false;
      }

      return true;
    });
  }, [filter]);

  const handleViewCalendar = (psychologist: Psychologist) => {
    setSelectedPsychologist(psychologist);
    setViewMode("calendar");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedPsychologist(null);
  };

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
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FilterIcon className="w-4 h-4 inline mr-2" />
                Psicólogos
              </button>
              <button
                onClick={() => setViewMode("bookings")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === "bookings"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Mis sesiones
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === "list" && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Encontrá tu psicólogo ideal
              </h2>
              <p className="text-lg text-gray-600">
                Sesiones online y presenciales con profesionales especializados
                en diferentes temáticas
              </p>
            </div>

            <FilterBar
              specialties={specialties}
              currentFilter={filter}
              onFilterChange={setFilter}
            />

            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Mostrando {filteredPsychologists.length} de{" "}
                {mockPsychologists.length} psicólogos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPsychologists.map((psychologist) => (
                <PsychologistCard
                  key={psychologist.id}
                  psychologist={psychologist}
                  onViewCalendar={handleViewCalendar}
                />
              ))}
            </div>

            {filteredPsychologists.length === 0 && (
              <div className="text-center py-12">
                <FilterIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No encontramos psicólogos con esos filtros
                </h3>
                <p className="text-gray-600 mb-4">
                  Intenta ajustar los filtros para ver más opciones
                </p>
                <button
                  onClick={() =>
                    setFilter({
                      specialty: "",
                      modality: "all",
                      availability: "all",
                    })
                  }
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </>
        )}

        {viewMode === "calendar" && selectedPsychologist && (
          <WeeklyCalendar
            psychologist={selectedPsychologist}
            onBack={handleBackToList}
          />
        )}

        {viewMode === "bookings" && <MyBookings />}
      </main>
    </div>
  );
}

export default App;
