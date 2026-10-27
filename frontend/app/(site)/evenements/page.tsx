import { Suspense } from "react";
import UpcomingEvents from "@/components/UpcomingEvents";

export default function EventsPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Événements à venir</h1>

      <Suspense fallback={<p className="text-gray-500">Chargement...</p>}>
        <UpcomingEvents />
      </Suspense>
    </div>
  );
}