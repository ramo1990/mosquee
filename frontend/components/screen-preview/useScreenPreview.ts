
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiGetList } from "@/lib/api";
import type { Screen, ScreenContent, PrayerTimes } from "./types";

export function useScreenPreview() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [selectedScreenId, setSelectedScreenId] = useState<number | null>(null);

  const [contents, setContents] = useState<ScreenContent[]>([]);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);

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

      setSelectedScreenId((current) => {
        if (current && data.some((screen) => screen.id === current)) {
          return current;
        }

        return data[0]?.id ?? null;
      });
    } catch (err) {
      console.error("Erreur chargement des écrans :", err);
      setScreens([]);
      setSelectedScreenId(null);
      setError("Impossible de charger la liste des écrans.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScreens();
  }, [loadScreens]);

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const selectedScreen = useMemo(
    () => screens.find((screen) => screen.id === selectedScreenId) ?? null,
    [screens, selectedScreenId]
  );

  const loadPreview = useCallback(async () => {
    if (selectedScreenId === null) {
      setContents([]);
      setPrayerTimes(null);
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
      console.error("Erreur chargement aperçu :", err);
      setContents([]);
      setPrayerTimes(null);
      setError("Impossible de charger l'aperçu de cet écran.");
    } finally {
      setLoadingPreview(false);
    }
  }, [selectedScreenId]);

  useEffect(() => {
    loadPreview();
  }, [loadPreview]);

  const activeContents = useMemo(() => {
    if (!currentTime) return [];

    const now = currentTime.getTime();

    return contents
      .filter((content) => {
        const start = new Date(content.start_datetime).getTime();
        const end = new Date(content.end_datetime).getTime();

        return start <= now && end >= now;
      })
      .sort((a, b) => b.priority - a.priority);
  }, [contents, currentTime]);

  const currentContent = activeContents[0] ?? null;

  const formattedTime = currentTime
    ? currentTime.toLocaleTimeString("fr-FR")
    : "--:--:--";

  const formattedDate = currentTime
    ? currentTime.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return {
    screens,
    selectedScreenId,
    setSelectedScreenId,
    selectedScreen,
    contents,
    prayerTimes,
    loading,
    loadingPreview,
    error,
    success,
    currentTime,
    isPlaying,
    setIsPlaying,
    currentContent,
    formattedTime,
    formattedDate,
    loadScreens,
    loadPreview,
  };
}