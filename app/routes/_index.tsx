import { json } from "@remix-run/node"; // app/routes/_index.tsx
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { Brain, Calendar, Filter as FilterIcon } from "lucide-react";
import { FilterBar } from "~/components/FilterBar";
import { PsychologistCard } from "~/components/PsychologistCard";
import { getPsychologists } from "~/models/psychologist.server";
import type { Filter, Psychologist } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "PsicoBook - Encontrá tu psicólogo ideal" },
    {
      name: "description",
      content:
        "Sesiones online y presenciales con profesionales especializados",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const specialty = url.searchParams.get("specialty") || "";
  const modality = url.searchParams.get("modality") || "all";
  const availability = url.searchParams.get("availability") || "all";

  const psychologists = await getPsychologists();

  // Obtener especialidades únicas
  const specialties = Array.from(
    new Set(psychologists.flatMap((p) => p.specialties))
  ).sort();

  return {
    psychologists,
    specialties,
    currentFilter: { specialty, modality, availability },
  };
};

export default function Index() {
  const { psychologists, specialties, currentFilter } =
    useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (filter: Filter) => {
    const newSearchParams = new URLSearchParams();
    if (filter.specialty) newSearchParams.set("specialty", filter.specialty);
    if (filter.modality !== "all")
      newSearchParams.set("modality", filter.modality);
    if (filter.availability !== "all")
      newSearchParams.set("availability", filter.availability);

    setSearchParams(newSearchParams);
  };

  // Filtrar psicólogos en el cliente para mejor UX
  const filteredPsychologists = psychologists
    .map((psychologist) => ({
      ...psychologist,
      availability: psychologist.availability.map((item) => ({
        ...item,
        endDateTime: new Date(item.endDateTime),
        startDateTime: new Date(item.startDateTime),
      })),
    }))
    .filter((psychologist: Psychologist) => {
      if (
        currentFilter.specialty &&
        !psychologist.specialties.includes(currentFilter.specialty)
      ) {
        return false;
      }

      if (
        currentFilter.modality !== "all" &&
        !psychologist.modalities.includes(currentFilter.modality as any)
      ) {
        return false;
      }

      let availableSlots = psychologist.availability.filter(
        (slot) => !slot.isBooked
      );

      if (currentFilter.modality !== "all") {
        availableSlots = availableSlots.filter(
          (slot) => slot.modality === currentFilter.modality
        );
      }

      if (currentFilter.availability === "high" && availableSlots.length <= 5) {
        return false;
      }
      if (currentFilter.availability === "low" && availableSlots.length > 5) {
        return false;
      }

      return true;
    });

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
                className="px-4 py-2 rounded-lg font-medium transition-colors bg-blue-100 text-blue-700"
              >
                <FilterIcon className="w-4 h-4 inline mr-2" />
                Psicólogos
              </a>
              <a
                href="/my-sessions"
                className="px-4 py-2 rounded-lg font-medium transition-colors text-gray-600 hover:text-gray-900"
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Mis sesiones
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Encontrá tu psicólogo ideal
          </h2>
          <p className="text-lg text-gray-600">
            Sesiones online y presenciales con profesionales especializados en
            diferentes temáticas
          </p>
        </div>

        <FilterBar
          specialties={specialties}
          currentFilter={(currentFilter as unknown as Filter)}
          onFilterChange={handleFilterChange}
        />

        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Mostrando {filteredPsychologists.length} de {psychologists.length}{" "}
            psicólogos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPsychologists.map((psychologist: Psychologist) => (
            <PsychologistCard
              key={psychologist.id}
              psychologist={psychologist}
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
              onClick={() => setSearchParams({})}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
