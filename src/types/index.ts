export interface Psychologist {
  id: string;
  name: string;
  specialties: string[];
  modalities: ('online' | 'presencial')[];
  avatar: string;
  rating: number;
  experience: number;
  availability: TimeSlot[];
  bio: string;
}

export interface TimeSlot {
  id: string;
  psychologistId: string;
  date: string; // "2025-01-15"
  startTime: string;
  endTime: string;
  modality: 'online' | 'presencial';
  isBooked: boolean;
  bookedBy?: string; // Session ID that booked this slot
}

export interface Session {
  id: string;
  psychologistId: string;
  patientName: string;
  patientEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  specialty: string;
  modality: 'online' | 'presencial';
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Filter {
  specialty: string;
  modality: 'all' | 'online' | 'presencial';
  availability: 'all' | 'high' | 'low';
}