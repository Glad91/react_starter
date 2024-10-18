import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, CalendarIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import useDepenseStore, { Depense } from "@/stores/depenseStore"; // Import du store des dépenses
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx"; // Importer la locale française

// Liste des catégories
const categories = [
  { label: "Alimentation", value: "Alimentation" },
  { label: "Gestion", value: "Gestion" },
  { label: "Véhicule", value: "Véhicule" },
  { label: "Salaire", value: "Salaire" },
] as const;

// Définir une carte des erreurs pour traduire les messages par défaut de Zod
z.setErrorMap((issue, ctx) => {
  switch (issue.code) {
    case "invalid_enum_value": // Vérifier si lenum est valide
      console.log(issue);
      return {
        message: `Type invalide. Attendu ${JSON.stringify(issue.options)}, reçu "${issue.received}"`,
      };
    default:
      return { message: ctx.defaultError };
  }
});

// Schéma de validation avec Zod
const formSchema = z.object({
  montant: z
    .string() // Le champ `montant` est saisi comme une chaîne
    .transform((value) => parseFloat(value)) // On transforme la chaîne en nombre
    .refine((value) => !isNaN(value) && value > 0, {
      // On vérifie que la conversion est réussie et que le montant est positif
      message: "Le montant doit être un nombre valide supérieur à 0.",
    }),
  description: z
    .string()
    .min(5, { message: "La description doit contenir au moins 5 caractères." })
    .max(500, {
      message: "La description doit contenir moins de 500 caractères.",
    }),
  isTVAApplicable: z.boolean().optional(),
  categorie: z.enum(
    categories.map((cat) => cat.value) as [string, ...string[]],
    {
      required_error: "Veuillez sélectionner une catégorie valide.",
    },
  ),
  date: z.date({
    required_error: "Veuillez sélectionner une date.",
  }),
});

// Définir les types des props pour le formulaire
type DepenseFormProps = {
  expenseToEdit?: Depense | null;
  onSuccess?: () => void; // Callback après une soumission réussie
};

function DepenseForm({ expenseToEdit, onSuccess }: DepenseFormProps) {
  const { toast } = useToast();
  const { addDepense, updateDepense, loading } = useDepenseStore(); // Utilisation du store

  const [open, setOpen] = useState(false); // État pour gérer l'ouverture et la fermeture du Popover pour les catégories
  const [openDate, setOpenDate] = useState(false); // État pour gérer l'ouverture et la fermeture du Popover pour la date

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      montant: 0, // Le montant est une chaîne vide par défaut
      description: "",
      categorie: "",
      date: undefined,
      isTVAApplicable: false,
    },
  });

  // Utiliser useEffect pour réinitialiser le formulaire quand une dépense est à éditer
  useEffect(() => {
    if (expenseToEdit) {
      form.reset({
        montant: expenseToEdit.montant,
        description: expenseToEdit.description,
        categorie: expenseToEdit.categorie,
        date: expenseToEdit.date,
        isTVAApplicable: expenseToEdit.isTVAApplicable,
      });
    } else {
      // Si aucun expenseToEdit n'est fourni, réinitialiser avec des valeurs par défaut
      form.reset({
        montant: 0,
        description: "",
        categorie: "",
        date: undefined,
        isTVAApplicable: false,
      });
    }
  }, [expenseToEdit, form]);

  // Fonction de gestion de la soumission du formulaire pour ajouter ou mettre à jour une dépense
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const isTVAApplicable = values.isTVAApplicable ?? false; // Assure que la valeur est soit true, soit false
    try {
      if (expenseToEdit) {
        // Mode édition
        await updateDepense(
          expenseToEdit.id, // ID de la dépense à mettre à jour
          values.montant, // Montant HT
          values.description,
          values.categorie,
          values.date,
          isTVAApplicable, // Utilise toujours un booléen
        );
        form.reset(); // Réinitialiser le formulaire après la mise à jour
        toast({
          title: "Dépense mise à jour",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(values, null, 2)}
              </code>
            </pre>
          ),
        });
      } else {
        // Mode ajout
        await addDepense(
          values.montant, // Montant HT
          values.description,
          values.categorie,
          values.date,
          isTVAApplicable, // Utilise toujours un booléen
        );
        toast({
          title: "Dépense ajoutée",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(values, null, 2)}
              </code>
            </pre>
          ),
        });
      }
      form.reset(); // Réinitialiser le formulaire après ajout ou mise à jour
      if (onSuccess) onSuccess(); // Appeler le callback si défini
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de l'ajout ou de la mise à jour de la dépense.",
        variant: "destructive",
      });
      console.log(error);
    }
  }

  const ErrorAlert = ({ error }: { error: string | undefined }) => {
    if (!error) return null;
    return (
      <Alert variant="destructive" className="mt-2 w-full">
        <AlertCircle className="h-6 w-6" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Ajouter une dépense</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Champ Montant */}
          <FormField
            control={form.control}
            name="montant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Montant</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Montant"
                    {...form.register("montant", { valueAsNumber: false })}
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <ErrorAlert error={form.formState.errors.montant?.message} />
                <FormDescription>
                  Entrez le montant de la dépense.
                </FormDescription>
              </FormItem>
            )}
          />

          {/* Champ Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description de la dépense"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <ErrorAlert
                  error={form.formState.errors.description?.message}
                />
                <FormDescription>
                  Détaillez la nature de la dépense.
                </FormDescription>
              </FormItem>
            )}
          />
          {/* Champ TVA */}
          <FormField
            control={form.control}
            name="isTVAApplicable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="isTVAApplicable"
                  />
                </FormControl>
                <FormLabel>
                  <span className="text-[0.8rem] text-muted-foreground">
                    Appliquer la TVA (20 %)
                  </span>
                </FormLabel>
              </FormItem>
            )}
          />

          {/* Champ Date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de la dépense</FormLabel>
                <Popover open={openDate} onOpenChange={setOpenDate}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          // Utiliser le format avec la locale française
                          format(field.value, "PPP", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setOpenDate(false);
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      locale={fr} // Passer la locale au calendrier
                    />
                  </PopoverContent>
                </Popover>
                <ErrorAlert error={form.formState.errors.date?.message} />
                <FormDescription>
                  Sélectionnez la date de la dépense.
                </FormDescription>
              </FormItem>
            )}
          />

          {/* Champ Catégorie */}
          <FormField
            control={form.control}
            name="categorie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? categories.find(
                              (categorie) => categorie.value === field.value,
                            )?.label
                          : "Sélectionner une catégorie"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Chercher une catégorie..." />
                      <CommandList>
                        <CommandEmpty>Aucune catégorie trouvée.</CommandEmpty>
                        <CommandGroup>
                          {categories.map((categorie) => (
                            <CommandItem
                              value={categorie.label}
                              key={categorie.value}
                              onSelect={() => {
                                form.setValue("categorie", categorie.value);
                                setOpen(false); // Fermer le Popover après la sélection
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  categorie.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {categorie.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <ErrorAlert error={form.formState.errors.categorie?.message} />
                <FormDescription>
                  Choisissez la catégorie de la dépense.
                </FormDescription>
              </FormItem>
            )}
          />

          {/* Bouton de soumission */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? expenseToEdit
                ? "Mise à jour en cours..."
                : "Ajout en cours..."
              : expenseToEdit
                ? "Mettre à jour la dépense"
                : "Ajouter dépense"}
          </Button>
          {/* Bouton d'annulation en mode édition */}
          {expenseToEdit && onSuccess && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                form.reset();
                onSuccess();
              }}
              className="w-full"
            >
              Annuler
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}

export default DepenseForm;
