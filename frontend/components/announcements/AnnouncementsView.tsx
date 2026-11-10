
"use client";

import { Announcement } from "./types";
import AnnouncementsTable from "./AnnouncementsTable";

type Props = {
  announcements: Announcement[];
  loading: boolean;
  updatingId: number | null;
  onEdit: (announcement: Announcement) => void;
  onTogglePublication: (announcement: Announcement) => void;
  onToggleScreenDisplay: (announcement: Announcement) => void;
};

export default function AnnouncementsView({
  announcements,
  loading,
  updatingId,
  onEdit,
  onTogglePublication,
  onToggleScreenDisplay,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-bold text-gray-900">
          Liste des annonces
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {announcements.length} annonce(s)
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : (
        <AnnouncementsTable
          announcements={announcements}
          updatingId={updatingId}
          onEdit={onEdit}
          onTogglePublication={onTogglePublication}
          onToggleScreenDisplay={onToggleScreenDisplay}
        />
      )}
    </div>
  );
}