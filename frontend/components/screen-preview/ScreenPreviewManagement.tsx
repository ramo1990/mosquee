"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList } from "@/lib/api";

type Screen = {
  id: number;
  name: string;
  location?: string;
  screen_group?: string;
  is_online: boolean;
};

type ScreenContent = {
  id: number;
  title: string;
  content?: string;
  media_url?: string;
  media_type?: "image" | "video";
  priority: number;
  start_datetime: string;
  end_datetime: string;
};

type PrayerTimes = {
  fajr?: string;
  dhuhr?: string;
  asr?: string;
  maghrib?: string;
  isha?: string;
  jumua_time?: string;
};

export default function ScreenPreviewManagement() {
  const [screens, setScreens] = useState<Screen[]>([]);

  const [selectedScreenId, setSelectedScreenId] = useState<
    number | null
  >(null);

  const [contents, setContents] = useState<ScreenContent[]>([]);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const loadScreens = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<Screen[]>("/screens/");

      setScreens(data);

      if (data.length > 0 && selectedScreenId === null) {
        setSelectedScreenId(data[0].id);
      }
    } catch (err) {
      console.error("Erreur chargement des écrans :", err);
      setScreens([]);
      setError(
        "Impossible de charger la liste des écrans pour le moment."
      );
    } finally {
      setLoading(false);
    }
  }, [selectedScreenId]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await apiGetList<Screen[]>("/screens/");

        if (!ignore) {
          setScreens(data);

          if (data.length > 0) {
            setSelectedScreenId((current) => current ?? data[0].id);
          }
        }
      } catch (err) {
        console.error("Erreur chargement des écrans :", err);

        if (!ignore) {
          setScreens([]);
          setError(
            "Impossible de charger la liste des écrans pour le moment."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    setCurrentTime(new Date());

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const selectedScreen = useMemo(
    () =>
      screens.find((screen) => screen.id === selectedScreenId) ?? null,
    [screens, selectedScreenId]
  );

  const loadPreview = useCallback(async () => {
    if (!selectedScreenId) {
      return;
    }

    setLoadingPreview(true);
    setError("");
    setSuccess("");

    try {
      const [contentsData, prayerTimesData] = await Promise.all([
        apiGetList<ScreenContent[]>(
          `/screens/${selectedScreenId}/contents/`
        ),
        apiGetList<PrayerTimes>(
          `/screens/${selectedScreenId}/prayer-times/`
        ),
      ]);

      setContents(contentsData);
      setPrayerTimes(prayerTimesData);
      setSuccess("Aperçu actualisé avec succès.");
    } catch (err) {
      console.error("Erreur chargement de l’aperçu :", err);
      setContents([]);
      setPrayerTimes(null);
      setError(
        "Impossible de charger l’aperçu de cet écran pour le moment."
      );
    } finally {
      setLoadingPreview(false);
    }
  }, [selectedScreenId]);

  useEffect(() => {
    loadPreview();
  }, [loadPreview]);

  const activeContents = useMemo(() => {
    if (!currentTime) {
      return [];
    }

    const now = currentTime.toISOString();

    return contents
      .filter((content) => {
        return (
          content.start_datetime <= now &&
          content.end_datetime >= now
        );
      })
      .sort((a, b) => b.priority - a.priority);
  }, [contents, currentTime]);

  const currentContent = activeContents[0] ?? null;

  const formattedTime = currentTime
    ? currentTime.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "--:--:--";

  const formattedDate = currentTime
    ? currentTime.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {success}
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Prévisualisation des écrans
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Visualisez l’affichage en temps réel de chaque écran avant diffusion.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadScreens}
            disabled={loading}
            className="rounded-xl border border-emerald-800 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
          >
            Actualiser les écrans
          </button>

          <button
            type="button"
            onClick={loadPreview}
            disabled={!selectedScreenId || loadingPreview}
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900 disabled:opacity-50"
          >
            {loadingPreview ? "Chargement..." : "Actualiser l’aperçu"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-bold text-gray-900">Écrans disponibles</h3>

          <p className="mt-1 text-xs text-gray-500">
            {screens.length} écran(s)
          </p>

          <div className="mt-4 space-y-3">
            {loading ? (
              <div className="py-8 text-center text-sm text-gray-500">
                Chargement...
              </div>
            ) : screens.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                Aucun écran disponible.
              </div>
            ) : (
              screens.map((screen) => {
                const isSelected =
                  screen.id === selectedScreenId;

                return (
                  <button
                    key={screen.id}
                    type="button"
                    onClick={() => setSelectedScreenId(screen.id)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-gray-900">
                          {screen.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {screen.location || "Emplacement non défini"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          screen.is_online
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {screen.is_online ? "En ligne" : "Hors ligne"}
                      </span>
                    </div>

                    {screen.screen_group && (
                      <p className="mt-2 text-xs text-gray-500">
                        Groupe : {screen.screen_group}
                      </p>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-bold text-gray-900">
                  {selectedScreen
                    ? selectedScreen.name
                    : "Aucun écran sélectionné"}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  {selectedScreen?.location ||
                    "Sélectionnez un écran pour afficher l’aperçu."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsPlaying((current) => !current)}
                disabled={!currentContent}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {isPlaying ? "Mettre en pause" : "Lire"}
              </button>
            </div>

            <div className="mt-5 aspect-video w-full overflow-hidden rounded-xl bg-gray-950">
              {!selectedScreen ? (
                <PreviewMessage
                  title="Aucun écran sélectionné"
                  description="Choisissez un écran dans la liste pour visualiser son affichage."
                />
              ) : loadingPreview ? (
                <PreviewMessage
                  title="Chargement de l’aperçu"
                  description="Récupération du contenu programmé..."
                />
              ) : !currentContent ? (
                <PreviewMessage
                  title="Aucun contenu actif"
                  description="Aucun contenu n’est programmé pour cet écran à cette heure."
                />
              ) : currentContent.media_type === "video" &&
                currentContent.media_url ? (
                <video
                  key={currentContent.id}
                  src={currentContent.media_url}
                  autoPlay={isPlaying}
                  loop
                  muted
                  playsInline
                  controls
                  className="h-full w-full object-cover"
                />
              ) : currentContent.media_type === "image" &&
                currentContent.media_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={currentContent.id}
                  src={currentContent.media_url}
                  alt={currentContent.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                  <h4 className="text-3xl font-extrabold text-white">
                    {currentContent.title}
                  </h4>

                  {currentContent.content && (
                    <p className="mt-4 max-w-2xl text-lg text-gray-200">
                      {currentContent.content}
                    </p>
                  )}
                </div>
              )}
            </div>

            {currentContent && (
              <div className="mt-4 rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-bold text-gray-900">
                  {currentContent.title}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Priorité : {currentContent.priority} • Du{" "}
                  {new Date(
                    currentContent.start_datetime
                  ).toLocaleString("fr-FR")}{" "}
                  au{" "}
                  {new Date(
                    currentContent.end_datetime
                  ).toLocaleString("fr-FR")}
                </p>
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="font-bold text-gray-900">Horloge</h3>

              <p className="mt-4 text-4xl font-extrabold text-gray-950">
                {formattedTime}
              </p>

              <p className="mt-2 text-sm capitalize text-gray-500">
                {formattedDate}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="font-bold text-gray-900">
                Horaires de prière
              </h3>

              {prayerTimes ? (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <PrayerTimeCard
                    label="Fajr"
                    time={prayerTimes.fajr}
                  />

                  <PrayerTimeCard
                    label="Dhuhr"
                    time={prayerTimes.dhuhr}
                  />

                  <PrayerTimeCard
                    label="Asr"
                    time={prayerTimes.asr}
                  />

                  <PrayerTimeCard
                    label="Maghrib"
                    time={prayerTimes.maghrib}
                  />

                  <PrayerTimeCard
                    label="Isha"
                    time={prayerTimes.isha}
                  />

                  <PrayerTimeCard
                    label="Jumua"
                    time={prayerTimes.jumua_time}
                  />
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500">
                  Aucun horaire disponible pour cet écran.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewMessage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
      <h4 className="text-2xl font-bold text-white">{title}</h4>

      <p className="mt-3 max-w-md text-sm text-gray-400">
        {description}
      </p>
    </div>
  );
}

function PrayerTimeCard({
  label,
  time,
}: {
  label: string;
  time?: string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-3 text-center">
      <p className="text-xs font-semibold text-gray-500">{label}</p>

      <p className="mt-1 text-lg font-bold text-gray-900">
        {time || "—"}
      </p>
    </div>
  );
}