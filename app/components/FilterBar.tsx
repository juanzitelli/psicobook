// app/components/FilterBar.tsx
import { Filter as FilterIcon, X } from "lucide-react";
import type { Filter } from "~/types";

interface FilterBarProps {
  specialties: string[];
  currentFilter: Filter;
  onFilterChange: (filter: Filter) => void;
}

export function FilterBar({
  specialties,
  currentFilter,
  onFilterChange,
}: FilterBarProps) {
  const handleSpecialtyChange = (specialty: string) => {
    onFilterChange({ ...currentFilter, specialty });
  };

  const handleModalityChange = (modality: Filter["modality"]) => {
    onFilterChange({ ...currentFilter, modality });
  };

  const handleAvailabilityChange = (availability: Filter["availability"]) => {
    onFilterChange({ ...currentFilter, availability });
  };

  const clearFilters = () => {
    onFilterChange({ specialty: "", modality: "all", availability: "all" });
  };

  const hasActiveFilters =
    currentFilter.specialty !== "" ||
    currentFilter.modality !== "all" ||
    currentFilter.availability !== "all";

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FilterIcon className="w-5 h-5 mr-2" />
          Filtros
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Temática de consulta
          </label>
          <select
            value={currentFilter.specialty}
            onChange={(e) => handleSpecialtyChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las temáticas</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modalidad de sesión
          </label>
          <select
            value={currentFilter.modality}
            onChange={(e) =>
              handleModalityChange(e.target.value as Filter["modality"])
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas las modalidades</option>
            <option value="online">Online</option>
            <option value="presencial">Presencial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Disponibilidad
          </label>
          <select
            value={currentFilter.availability}
            onChange={(e) =>
              handleAvailabilityChange(e.target.value as Filter["availability"])
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toda disponibilidad</option>
            <option value="high">Alta disponibilidad (6+ horarios)</option>
            <option value="low">Poca disponibilidad (≤5 horarios)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
