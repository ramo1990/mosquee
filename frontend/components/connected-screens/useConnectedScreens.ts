
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { apiGetList, apiPatch } from "@/lib/api";

import type {
  ConnectedScreen,
  ScreenAction,
  ScreenStatusFilter,
} from "./types";

export function useConnectedScreens() {
  const [screens, setScreens] = useState<ConnectedScreen[]>([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<ScreenStatusFilter>("all");
  const [groupFilter, setGroupFilter] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Chargement des écrans
  const loadScreens = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiGetList<ConnectedScreen[]>(
        "/connected-screens/"
      );

      setScreens(data);
    } catch (err) {
      console.error(
        "Erreur chargement des écrans connectés :",
        err
      );

      setScreens([]);

      setError(
        "Impossible de charger les écrans connectés pour le moment."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await apiGetList<ConnectedScreen[]>(
          "/connected-screens/"
        );

        if (!ignore) {
          setScreens(data);
        }
      } catch (err) {
        console.error(
          "Erreur chargement des écrans connectés :",
          err
        );

        if (!ignore) {
          setScreens([]);
          setError(
            "Impossible de charger les écrans connectés pour le moment."
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

  // Groupes disponibles
  const availableGroups = useMemo(() => {
    const groups = new Set<string>();

    screens.forEach((screen) => {
      if (screen.group) {
        groups.add(screen.group);
      }
    });

    return Array.from(groups).sort();
  }, [screens]);

  // Recherche et filtres
  const filteredScreens = useMemo(() => {
    const query = search.toLowerCase().trim();

    return screens.filter((screen) => {
      const matchesSearch =
        !query ||
        [
          screen.name,
          screen.location,
          screen.group,
          screen.ip_address,
          screen.mac_address,
          screen.browser,
        ].some((value) =>
          value?.toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "all" ||
        screen.connection_status === statusFilter;

      const matchesGroup =
        groupFilter === "all" ||
        screen.group === groupFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesGroup
      );
    });
  }, [screens, search, statusFilter, groupFilter]);

  // Statistiques
  const connectedCount = screens.filter(
    (screen) =>
      screen.connection_status === "connected"
  ).length;

  const disconnectedCount = screens.filter(
    (screen) =>
      screen.connection_status === "disconnected"
  ).length;

  const maintenanceCount = screens.filter(
    (screen) =>
      screen.connection_status === "maintenance"
  ).length;

  // Actions sur les écrans
  async function handleScreenAction({
    screenId,
    action,
  }: ScreenAction) {
    setError("");
    setSuccess("");
    setUpdatingId(screenId);

    const payload =
      action === "restart"
        ? { action: "restart" }
        : action === "maintenance"
          ? { connection_status: "maintenance" }
          : {
              connection_status: "connected",
              is_active: true,
            };

    try {
      const updatedScreen = await apiPatch<ConnectedScreen>(
        `/connected-screens/${screenId}/`,
        payload
      );

      setScreens((current) =>
        current.map((screen) =>
          screen.id === screenId
            ? { ...screen, ...updatedScreen }
            : screen
        )
      );

      setSuccess(
        action === "restart"
          ? "Redémarrage demandé avec succès."
          : action === "maintenance"
            ? "Écran mis en maintenance."
            : "Écran activé avec succès."
      );
    } catch (err) {
      console.error(
        "Erreur action sur l'écran :",
        err
      );

      setError(
        "Impossible d'exécuter cette action sur l'écran."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return {
    screens,
    loading,
    updatingId,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    groupFilter,
    setGroupFilter,

    availableGroups,
    filteredScreens,

    connectedCount,
    disconnectedCount,
    maintenanceCount,

    error,
    success,

    loadScreens,
    handleScreenAction,
  };
}