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
  startDateTime: Date;
  endDateTime: Date;
  modality: 'online' | 'presencial';
  isBooked: boolean;
  bookedBy?: string; // Session ID that booked this slot
}

export interface Session {
  id: string;
  psychologistId: string;
  patientName: string;
  patientDni: string;
  patientEmail: string;
  startDateTime: Date;
  endDateTime: Date;
  specialty: string;
  modality: 'online' | 'presencial';
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface Filter {
  specialty: string;
  modality: 'all' | 'online' | 'presencial';
  availability: 'all' | 'high' | 'low';
}