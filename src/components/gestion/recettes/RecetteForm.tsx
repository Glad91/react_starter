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
import useRecetteStore from "@/stores/recetteStore"; // Import du store des recettes

// Schéma de validation avec Zod
const formSchema = z.object({
  montant: z
    .string()
    .transform((value) => parseFloat(value))
    .refine((value) => !isNaN(value) && value > 0, {
      message: "Le montant doit être supérieur à 0.",
    }),
  description: z
    .string()
    .min(5, { message: "La description doit contenir au moins 5 caractères." })
    .max(500, {
      message: "La description doit contenir moins de 500 caractères.",
    }),
  categorie: z
    .string()
    .min(2, { message: "La catégorie doit contenir au moins 2 caractères." }),
});

function RecetteForm() {
  const { toast } = useToast();
  const { addRecette, loading } = useRecetteStore(); // Utilisation du store des recettes

  // Initialisation du formulaire avec react-hook-form et zod pour la validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      montant: 0,
      description: "",
      categorie: "",
    },
  });

  // Fonction de gestion de la soumission du formulaire
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addRecette(values.montant, values.description, values.categorie);
      toast({
        title: "Recette ajoutée",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(values, null, 2)}
            </code>
          </pre>
        ),
      });
      form.reset(); // Réinitialiser le formulaire après ajout
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la recette.",
        variant: "destructive",
      });

      console.log(error);
    }
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Ajouter une recette</h1>
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
                    {...field}
                    className="w-full" // Largeur complète
                  />
                </FormControl>
                <FormDescription>
                  Entrez le montant de la recette.
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
                    placeholder="Description de la recette"
                    {...field}
                    className="w-full" // Largeur complète
                  />
                </FormControl>
                <FormDescription>
                  Détaillez la nature de la recette.
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
                <FormControl>
                  <Input
                    placeholder="Catégorie de la recette"
                    {...field}
                    className="w-full" // Largeur complète
                  />
                </FormControl>
                <FormDescription>
                  Indiquez la catégorie de la recette.
                </FormDescription>
              </FormItem>
            )}
          />

          {/* Bouton de soumission */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Ajout en cours..." : "Ajouter recette"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default RecetteForm;
