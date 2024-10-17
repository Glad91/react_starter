import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { AlertCircle } from "lucide-react";

// Schéma de validation avec Zod
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères." })
    .max(100, { message: "Le nom doit contenir moins de 100 caractères." }),
  email: z
    .string()
    .email({ message: "Veuillez entrer une adresse e-mail valide." }),
  message: z
    .string()
    .min(10, { message: "Le message doit contenir au moins 10 caractères." })
    .max(500, { message: "Le message doit contenir moins de 500 caractères." }),
});

function Contact() {
  const { toast } = useToast();

  // Initialisation du formulaire avec react-hook-form et zod pour la validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // Fonction de gestion de la soumission du formulaire
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Formulaire",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
  }

  const ErrorAlert = ({ error }: { error: string | undefined }) => {
    if (!error) return null;
    return (
      <Alert variant="destructive" className="mt-2">
        <AlertCircle className="h-6 w-6" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-2xl font-bold">Contactez-nous</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          {/* Champ Nom */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Votre nom" {...field} />
                </FormControl>
                <FormDescription>Entrez votre nom complet.</FormDescription>
                <ErrorAlert error={form.formState.errors.name?.message} />
              </FormItem>
            )}
          />

          {/* Champ Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="votre.email@example.com"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Nous vous contacterons via cette adresse e-mail.
                </FormDescription>
                <ErrorAlert error={form.formState.errors.email?.message} />
              </FormItem>
            )}
          />

          {/* Champ Message */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Votre message..." {...field} />
                </FormControl>
                <FormDescription>
                  Détaillez votre demande ou question.
                </FormDescription>
                <ErrorAlert error={form.formState.errors.message?.message} />
              </FormItem>
            )}
          />

          {/* Bouton de soumission */}
          <Button type="submit">Envoyer le message</Button>
        </form>
      </Form>
    </div>
  );
}

export default Contact;
