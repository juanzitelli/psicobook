# PsicoBook

A web application to find, schedule, and manage psychology sessions online and in person. Easily browse psychologists, filter by specialties, modalities, and availability, book sessions, and view your upcoming appointments.

---

## Features

- Browse psychologists with detailed profiles
- Filter psychologists by specialty, modality, and availability
- View a weekly calendar of psychologist availability
- Book sessions online or in person
- Manage your bookings, view details, and cancel if needed

---

## Components Overview

### `BookingModal`

Allows users to schedule a session with a psychologist, filling out patient details and confirming the booking. Displays success message after booking.

### `FilterBar`

Filter psychologists based on specialty, session modality, and availability.

### `MyBookings`

View, search, and manage your scheduled sessions, including cancellation.

### `PsychologistCard`

Displays a psychologist's profile with availability and a button to view their calendar.

### `WeeklyCalendar`

Shows a 30-day calendar with available time slots for a psychologist. Users can select a slot to book.

---

## How to Use

1. **Browse Psychologists**: View profiles and filter by your preferences.
2. **View Availability**: Click "Ver disponibilidad" to see upcoming slots.
3. **Book a Session**: Select a slot, fill out your details, and confirm.
4. **Manage Bookings**: Access "Mis sesiones" to see your upcoming and past sessions, cancel if necessary.

---

## Technologies

- React with TypeScript
- Tailwind CSS for styling
- Lucide React icons
- Custom hooks and utility functions for date formatting and local storage

---

## Developers: How to run the app locally

### Prerequisites

- Node.js (version 20 or higher)
- npm package manager available

### Setup

1. Clone the repository:

```bash
git clone https://github.com/juanzitelli/psicobook.git
cd psicobook
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open your browser and navigate to:

```
http://localhost:5173/
```

### Additional Tips

- Make sure to have Node.js installed.

#### To build for production:

```bash
npm run build
```

---

## Notes

- All bookings are stored locally in your browser's storage.
- Cancelations are immediate and free up the slot.
-

# Things I'd have loved to add

First and foremost, I would have liked to integrate an API that manages everything from a backend server, storing all data in a database and enabling a full flow of loading schedules and other information for psychologists.

I also would have liked to implement a "15-minute lock" logic during the booking process to prevent double bookings if multiple users attempt to reserve the same slot simultaneously.

Validation improvements would be a priority, including basic client-side validation such as ensuring the email format is correct, and business logic validations like preventing booking already occupied slots.

Additionally, I would have liked to persist user information for quick identification during future bookings, enhancing user experience.

Other features I would have considered include:

- A system for psychologists or admin to block certain users or time slots (e.g., for vacations or personal reasons).
- A feedback system where users can report bad experiences or provide reviews.
- A matchmaking algorithm to rank psychologists based on how well they match user preferences, increasing the likelihood of a good fit.

---
