
"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function MosqueSectionError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erreur de chargement :", error);
  }, [error]);

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
        <AlertCircle className="h-8 w-8 text-muted-foreground" />

        <p className="font-semibold">
          Impossible de charger cette section.
        </p>

        <p className="text-sm text-muted-foreground">
          Veuillez réessayer dans quelques instants.
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={reset}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </CardContent>
    </Card>
  );
}