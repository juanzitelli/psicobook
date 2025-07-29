export const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  const minutesStr = minutes.toString().padStart(2, "0");
  return `${hour12}:${minutesStr} ${ampm}`;
};

export const formatTimeRange = (startDate: Date, endDate: Date): string => {
  return `${formatTime(startDate)} - ${formatTime(endDate)}`;
};

export const getDayName = (dayIndex: number): string => {
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  return days[dayIndex];
};

export const getDayNameFromDate = (date: Date): string => {
  const dayIndex = date.getDay();
  return getDayName(dayIndex);
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const getNext30Days = (): Date[] => {
  const dates: Date[] = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    // Set to start of day for comparison purposes
    date.setHours(0, 0, 0, 0);
    dates.push(date);
  }
  return dates;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const getDateString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};