// app/utils/dateTime.ts
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
};

export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(dateObj);
};

export const formatTimeRange = (
  startDate: Date | string,
  endDate: Date | string
): string => {
  return `${formatTime(startDate)} - ${formatTime(endDate)}`;
};

export const getDayNameFromDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
  }).format(dateObj);
};

export const getNext30Days = (): Date[] => {
  const days: Date[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }

  return days;
};

export const isSameDay = (
  date1: Date | string,
  date2: Date | string
): boolean => {
  const dateObj1 = typeof date1 === "string" ? new Date(date1) : date1;
  const dateObj2 = typeof date2 === "string" ? new Date(date2) : date2;

  // Verificar que las fechas son válidas
  if (isNaN(dateObj1.getTime()) || isNaN(dateObj2.getTime())) {
    console.error("Invalid dates:", { date1, date2 });
    return false;
  }

  return (
    dateObj1.getFullYear() === dateObj2.getFullYear() &&
    dateObj1.getMonth() === dateObj2.getMonth() &&
    dateObj1.getDate() === dateObj2.getDate()
  );
};

// Función helper para asegurar que tenemos un objeto Date válido
export const ensureDate = (date: Date | string | null | undefined): Date => {
  if (!date) {
    return new Date();
  }

  if (typeof date === "string") {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      console.error("Invalid date string:", date);
      return new Date();
    }
    return parsed;
  }

  if (date instanceof Date && !isNaN(date.getTime())) {
    return date;
  }

  console.error("Invalid date object:", date);
  return new Date();
};
