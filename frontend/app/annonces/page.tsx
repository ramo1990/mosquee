import { Suspense } from "react";
import AnnouncementsList from "@/components/AnnouncementsList";

export default function AnnouncementsPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Annonces</h1>

      <Suspense fallback={<p className="text-gray-500">Chargement...</p>}>
        <AnnouncementsList />
      </Suspense>
    </div>
  );
}