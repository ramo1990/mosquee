
"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";

import { apiPost } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

type ContactForm = {
  full_name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
};

const initialForm: ContactForm = {
  full_name: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
};

type Props = {
  mosqueSlug: string;
};

export default function MosqueContactForm({ mosqueSlug }: Props) {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  function updateField<K extends keyof ContactForm>(
    field: K,
    value: ContactForm[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (status !== "idle") {
      setStatus("idle");
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (status === "loading") return;

    setStatus("loading");

    try {
      await apiPost(
        `/mosquees/${mosqueSlug}/contacts/`,
        form
      );

      setForm(initialForm);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Card className="overflow-hidden rounded-2xl border shadow-sm">
      <CardHeader className="space-y-2 border-b bg-muted/30 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
          <Send className="h-5 w-5" />
        </div>

        <CardTitle className="text-xl font-bold">
          Contacter cette mosquée
        </CardTitle>

        <CardDescription>
          Une question ? Besoin d&apos;une information ?
          Envoyez directement un message à l&apos;équipe
          de cette mosquée.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">
                Nom complet *
              </Label>

              <Input
                id="full_name"
                placeholder="Votre nom"
                value={form.full_name}
                onChange={(e) =>
                  updateField("full_name", e.target.value)
                }
                required
                disabled={status === "loading"}
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Téléphone {!form.email.trim() && "*"}
              </Label>

              <Input
                id="phone"
                type="tel"
                placeholder="06 12 34 56 78"
                value={form.phone}
                onChange={(e) =>
                  updateField("phone", e.target.value)
                }
                disabled={status === "loading"}
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Adresse e-mail {!form.phone.trim() && "*"}
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="vous@exemple.fr"
              value={form.email}
              onChange={(e) =>
                updateField("email", e.target.value)
              }
              required={!form.phone.trim()}
              disabled={status === "loading"}
              autoComplete="email"
            />

            {!form.phone.trim() && (
              <p className="text-xs text-muted-foreground">
                Obligatoire si vous ne renseignez pas de téléphone.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">
              Sujet *
            </Label>

            <Input
              id="subject"
              placeholder="Objet de votre demande"
              value={form.subject}
              onChange={(e) =>
                updateField("subject", e.target.value)
              }
              required
              disabled={status === "loading"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">
              Votre message *
            </Label>

            <Textarea
              id="message"
              placeholder="Écrivez votre message ici..."
              rows={5}
              value={form.message}
              onChange={(e) =>
                updateField("message", e.target.value)
              }
              required
              disabled={status === "loading"}
              className="resize-none"
            />

            <p className="text-xs text-muted-foreground">
              Votre message sera transmis directement à
              l&apos;équipe de la mosquée.
            </p>
          </div>

          {status === "success" && (
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-600!" />

              <AlertDescription>
                Votre message a bien été envoyé à cette
                mosquée. Merci pour votre prise de contact !
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />

              <AlertDescription>
                Une erreur est survenue lors de l&apos;envoi.
                Veuillez réessayer.
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-emerald-800 hover:bg-emerald-900"
            size="lg"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Envoyer le message
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Les champs marqués d&apos;un * sont obligatoires.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
