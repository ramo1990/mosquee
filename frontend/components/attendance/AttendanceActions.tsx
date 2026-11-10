
import { AttendanceStatus } from "./types";

type Props = {
  saving: boolean;
  loading: boolean;
  onSetAllStatus: (status: AttendanceStatus) => void;
  onSave: () => void;
};

export default function AttendanceActions({
  saving,
  loading,
  onSetAllStatus,
  onSave,
}: Props) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSetAllStatus("present")}
          disabled={loading || saving}
          className="rounded-xl bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-200 disabled:opacity-50"
        >
          Tout présent
        </button>

        <button
          type="button"
          onClick={() => onSetAllStatus("absent")}
          disabled={loading || saving}
          className="rounded-xl bg-red-100 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-200 disabled:opacity-50"
        >
          Tout absent
        </button>

        <button
          type="button"
          onClick={() => onSetAllStatus("late")}
          disabled={loading || saving}
          className="rounded-xl bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800 hover:bg-amber-200 disabled:opacity-50"
        >
          Tout en retard
        </button>
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={saving || loading}
        className="rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
      >
        {saving
          ? "Enregistrement..."
          : "Enregistrer les présences"}
      </button>
    </div>
  );
}