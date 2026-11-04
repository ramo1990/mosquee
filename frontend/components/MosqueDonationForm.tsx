
"use client";

import { useState } from "react";
import {
  Heart,
  HandHeart,
  Building2,
  Wrench,
  Gift,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Wallet,
} from "lucide-react";

import { apiPost } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";

type DonationForm = {
  campaign: string;
  donor_name: string;
  donor_phone: string;
  donor_email: string;
  amount: string;
  donation_type: string;
  payment_method: string;
};

type Props = {
  mosqueSlug: string;
  campaigns: {
    slug: string;
    title: string;
  }[];
};

const initialState: DonationForm = {
  campaign: "",
  donor_name: "",
  donor_phone: "",
  donor_email: "",
  amount: "",
  donation_type: "sadaqah",
  payment_method: "orange_money",
};

const suggestedAmounts = [1000, 2500, 5000, 10000];

const donationTypes = [
  {
    value: "sadaqah",
    label: "Sadaqa",
    description: "Don volontaire",
    icon: HandHeart,
  },
  {
    value: "zakat",
    label: "Zakat",
    description: "Aumône obligatoire",
    icon: Heart,
  },
  {
    value: "construction",
    label: "Construction",
    description: "Projets et travaux",
    icon: Building2,
  },
  {
    value: "maintenance",
    label: "Entretien",
    description: "Entretien de la mosquée",
    icon: Wrench,
  },
  {
    value: "other",
    label: "Autre",
    description: "Autre contribution",
    icon: Gift,
  },
];

const paymentMethods = [
  { value: "orange_money", label: "Orange Money" },
  { value: "mtn_momo", label: "MTN MoMo" },
  { value: "moov_money", label: "Moov Money" },
  { value: "wave", label: "Wave" },
  { value: "bank_transfer", label: "Virement bancaire" },
  { value: "cash", label: "Espèces" },
];

export default function MosqueDonationForm({
  mosqueSlug,
  campaigns,
}: Props) {
  const [form, setForm] = useState<DonationForm>(initialState);

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );

  function updateField<K extends keyof DonationForm>(
    field: K,
    value: DonationForm[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setStatus("idle");
    setErrorMessage(null);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (status === "loading") return;

    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount < 100) {
      setStatus("error");
      setErrorMessage("Le montant minimum est de 100 FCFA.");
      return;
    }

    if (!form.donor_phone.trim() && !form.donor_email.trim()) {
      setStatus("error");
      setErrorMessage(
        "Veuillez renseigner un numéro de téléphone ou une adresse e-mail."
      );
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    try {
      await apiPost(`/mosquees/${mosqueSlug}/dons/`, {
        campaign: form.campaign || null,
        donor_name: form.donor_name.trim(),
        donor_phone: form.donor_phone.trim(),
        donor_email: form.donor_email.trim() || null,
        amount: form.amount,
        donation_type: form.donation_type,
        payment_method: form.payment_method,
      });

      setForm(initialState);
      setStatus("success");
    } catch (error) {
      setStatus("error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'enregistrement du don."
      );
    }
  }

  const selectedAmount = Number(form.amount);

  const formattedAmount = new Intl.NumberFormat("fr-FR").format(
    Number.isFinite(selectedAmount) ? selectedAmount : 0
  );

  return (
    <Card className="overflow-hidden rounded-2xl border shadow-sm">
      <CardHeader className="space-y-3 border-b bg-muted/30 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
          <Heart className="h-6 w-6" />
        </div>

        <CardTitle className="text-xl font-bold">
          Faire un don
        </CardTitle>

        <CardDescription>
          Soutenez les actions de cette mosquée et
          participez à ses projets. Chaque contribution
          compte.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Campagne */}

          {campaigns.length > 0 && (
            <div className="space-y-2">
              <Label>Choisir une campagne</Label>

              <Select
                value={form.campaign || "general"}
                onValueChange={(value) =>
                  updateField(
                    "campaign",
                    value === "general" ? "" : value ?? ""
                  )
                }
                disabled={status === "loading"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Don général" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="general">
                    Don général
                  </SelectItem>

                  {campaigns.map((campaign) => (
                    <SelectItem
                      key={campaign.slug}
                      value={campaign.slug}
                    >
                      {campaign.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Montant */}

          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-base font-semibold">
                Quel montant souhaitez-vous donner ?
              </Label>

              <p className="text-sm text-muted-foreground">
                Choisissez un montant ou saisissez librement
                votre contribution.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {suggestedAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant="outline"
                  disabled={status === "loading"}
                  onClick={() =>
                    updateField("amount", String(amount))
                  }
                  className={cn(
                    "h-12 font-semibold",
                    form.amount === String(amount) &&
                      "border-emerald-700 bg-emerald-50 text-emerald-800 hover:bg-emerald-950"
                  )}
                >
                  {new Intl.NumberFormat("fr-FR").format(amount)}
                </Button>
              ))}
            </div>

            <div className="relative">
              <Input
                type="number"
                min="100"
                step="100"
                required
                placeholder="Autre montant"
                value={form.amount}
                onChange={(e) =>
                  updateField("amount", e.target.value)
                }
                disabled={status === "loading"}
                className="h-12 pr-20 text-lg font-semibold"
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                FCFA
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              Montant minimum : 500 FCFA.
            </p>
          </div>

          {/* Type de don */}

          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Type de contribution
            </Label>

            <div className="grid gap-3 sm:grid-cols-2">
              {donationTypes.map((type) => {
                const Icon = type.icon;
                const selected =
                  form.donation_type === type.value;

                return (
                  <button
                    key={type.value}
                    type="button"
                    disabled={status === "loading"}
                    onClick={() =>
                      updateField("donation_type", type.value)
                    }
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3 text-left transition",
                      selected
                        ? "border-emerald-700 bg-emerald-950"
                        : "border-border hover:bg-muted/50"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        selected
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold">
                        {type.label}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Informations donateur */}

          <div className="space-y-4 border-t pt-5">
            <div>
              <h3 className="font-semibold">
                Vos coordonnées
              </h3>

              <p className="text-sm text-muted-foreground">
                Pour assurer le suivi de votre contribution.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="donor_name">
                Nom complet *
              </Label>

              <Input
                id="donor_name"
                required
                placeholder="Votre nom"
                value={form.donor_name}
                onChange={(e) =>
                  updateField("donor_name", e.target.value)
                }
                disabled={status === "loading"}
                autoComplete="name"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="donor_phone">
                  Téléphone {!form.donor_email.trim() && "*"}
                </Label>

                <Input
                  id="donor_phone"
                  type="tel"
                  placeholder="Votre numéro"
                  value={form.donor_phone}
                  onChange={(e) =>
                    updateField("donor_phone", e.target.value)
                  }
                  required={!form.donor_email.trim()}
                  disabled={status === "loading"}
                  autoComplete="tel"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="donor_email">
                  E-mail {!form.donor_phone.trim() && "*"}
                </Label>

                <Input
                  id="donor_email"
                  type="email"
                  placeholder="vous@exemple.fr"
                  value={form.donor_email}
                  onChange={(e) =>
                    updateField("donor_email", e.target.value)
                  }
                  required={!form.donor_phone.trim()}
                  disabled={status === "loading"}
                  autoComplete="email"
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Au moins un moyen de contact est obligatoire.
            </p>
          </div>

          {/* Paiement */}

          <div className="space-y-3 border-t pt-5">
            <div>
              <h3 className="font-semibold">
                Moyen de paiement
              </h3>

              <p className="text-sm text-muted-foreground">
                Sélectionnez votre moyen de paiement préféré.
              </p>
            </div>

            <Select
              value={form.payment_method}
              onValueChange={(value) =>
                updateField("payment_method", value ?? "orange_money")
              }
              disabled={status === "loading"}
            >
              <SelectTrigger className="h-12">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Choisir un moyen de paiement" />
                </div>
              </SelectTrigger>

              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem
                    key={method.value}
                    value={method.value}
                  >
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Récapitulatif */}

          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">
                Votre contribution
              </span>

              <span className="text-xl font-bold text-emerald-800">
                {formattedAmount} FCFA
              </span>
            </div>
          </div>

          {/* Messages */}

          {status === "success" && (
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-600!" />

              <AlertDescription>
                Merci pour votre générosité ! Votre don a
                bien été enregistré.
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />

              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Bouton */}

          <Button
            type="submit"
            size="lg"
            disabled={status === "loading"}
            className="w-full bg-emerald-800 font-semibold hover:bg-emerald-900"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Heart className="mr-2 h-4 w-4" />
                Confirmer mon don
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Merci de soutenir les actions de votre mosquée.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
