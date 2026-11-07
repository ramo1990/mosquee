
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  UserPlus,
  UserRound,
  ShieldCheck,
  Building2,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import type { UserFormData, UserRole } from "@/lib/types";
import { USER_ROLE_LABELS } from "@/lib/types";
import { apiCreateUser } from "@/lib/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const initialData: UserFormData = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  role: "member",
  mosque: "",
  password: "",
  is_active: true,
};

export default function NewUserPage() {
  const router = useRouter();

  const [data, setData] = useState<UserFormData>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof UserFormData>(
    field: K,
    value: UserFormData[K]
  ) {
    setData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      await apiCreateUser(data);
      router.push("/admin/utilisateurs");
    } catch {
      setError(
        "Impossible de créer cet utilisateur. Vérifiez les informations saisies."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh bg-muted/40 px-4 py-8 md:py-12">
      <div className="mx-auto max-w-3xl space-y-6">

        {/* Navigation */}
        <div>
            <Link
                href="/admin/utilisateurs"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                <ArrowLeft className="h-4 w-4" />
                Retour aux utilisateurs
            </Link>
        </div>

        {/* En-tête */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
            <UserPlus className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Nouvel utilisateur
            </h1>

            <p className="text-sm text-muted-foreground">
              Ajoutez un membre à votre communauté.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserRound className="h-5 w-5 text-emerald-700" />

                <CardTitle className="text-lg">
                  Informations personnelles
                </CardTitle>
              </div>

              <CardDescription>
                Renseignez les informations de base du membre.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Prénom</Label>

                  <Input
                    id="first_name"
                    value={data.first_name}
                    onChange={(e) =>
                      updateField("first_name", e.target.value)
                    }
                    placeholder="Ex : Mohamed"
                    autoComplete="given-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Nom</Label>

                  <Input
                    id="last_name"
                    value={data.last_name}
                    onChange={(e) =>
                      updateField("last_name", e.target.value)
                    }
                    placeholder="Ex : Diallo"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>

                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) =>
                    updateField("email", e.target.value)
                  }
                  placeholder="exemple@email.com"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>

                <Input
                  id="phone"
                  type="tel"
                  value={data.phone}
                  onChange={(e) =>
                    updateField("phone", e.target.value)
                  }
                  placeholder="+33 6 00 00 00 00"
                  autoComplete="tel"
                />
              </div>
            </CardContent>
          </Card>

          {/* Identifiants */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-700" />

                <CardTitle className="text-lg">
                  Identifiants de connexion
                </CardTitle>
              </div>

              <CardDescription>
                Ces informations permettront à l&apos;utilisateur de se connecter.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">
                  Nom d&apos;utilisateur <span className="text-destructive">*</span>
                </Label>

                <Input
                  id="username"
                  value={data.username}
                  onChange={(e) =>
                    updateField("username", e.target.value)
                  }
                  placeholder="ex : mohamed123"
                  autoComplete="username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Mot de passe <span className="text-destructive">*</span>
                </Label>

                <Input
                  id="password"
                  type="password"
                  value={data.password ?? ""}
                  onChange={(e) =>
                    updateField("password", e.target.value)
                  }
                  placeholder="Créer un mot de passe"
                  autoComplete="new-password"
                  required
                />

                <p className="text-xs text-muted-foreground">
                  Choisissez un mot de passe suffisamment robuste.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rôle et affectation */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-700" />

                <CardTitle className="text-lg">
                  Rôle et affectation
                </CardTitle>
              </div>

              <CardDescription>
                Définissez les permissions et la mosquée de rattachement.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="role">Rôle de l&apos;utilisateur</Label>

                <Select
                  value={data.role}
                  onValueChange={(value) =>
                    updateField("role", value as UserRole)
                  }
                >
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Choisir un rôle" />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.entries(USER_ROLE_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mosque">Mosquée de rattachement</Label>

                <Input
                  id="mosque"
                  value={data.mosque}
                  onChange={(e) =>
                    updateField("mosque", e.target.value)
                  }
                  placeholder="mosquee-al-falah"
                />

                <p className="text-xs text-muted-foreground">
                  Indiquez le slug de la mosquée.
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <Label htmlFor="is_active">Compte actif</Label>

                  <p className="text-xs text-muted-foreground">
                    Autoriser cet utilisateur à accéder à son compte.
                  </p>
                </div>

                <Switch
                  id="is_active"
                  checked={data.is_active}
                  onCheckedChange={(checked) =>
                    updateField("is_active", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Erreur */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />

              <AlertTitle>Erreur de création</AlertTitle>

              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => router.push("/admin/utilisateurs")}
            >
                Annuler
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-800 hover:bg-emerald-900"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Créer l&apos;utilisateur
                </>
              )}
            </Button>
          </div>

        </form>
      </div>
    </main>
  );
}
