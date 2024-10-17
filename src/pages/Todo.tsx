import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast.ts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpFromLine,
  CheckCircle,
  CircleX,
  Pencil,
  PlusIcon,
  Trash2,
} from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  Form,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

const firebaseConfig = {
  apiKey: "AIzaSyA4_XIB9x3nUAF0G6V-LY-41Jk8C8EUtU0",
  authDomain: "calc-ac5bd.firebaseapp.com",
  projectId: "calc-ac5bd",
  storageBucket: "calc-ac5bd.appspot.com",
  messagingSenderId: "18463822141",
  appId: "1:18463822141:web:f1e05898f077e21b1a7554",
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Schéma de validation avec Zod
const formSchema = z.object({
  tache: z
    .string()
    .min(4, { message: "La tache doit contenir au moins 4 caractères." })
    .max(100, { message: "La tache doit contenir moins de 100 caractères." }),
});

interface Todo {
  id: string;
  tache: string;
  date_ajout: Timestamp; // Assure-toi d'importer Timestamp depuis Firestore
  fait: boolean;
  date_finit: Timestamp | null; // Date de fin de la tâche
}

export default function Todo() {
  const { toast } = useToast();
  const [todos, setTodos] = useState<Todo[]>([]);
  // Calcul du pourcentage des tâches complétées
  const completedTasks = todos.filter((todo) => todo.fait).length;
  const totalTasks = todos.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tache: "",
    },
  });

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, "todos"), (querySnapshot) => {
      const fetchedTodos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Todo[];

      // Trier par date d'ajout si nécessaire
      const sortedTodos = fetchedTodos.sort((a, b) => {
        return (
          b.date_ajout.toDate().getTime() - a.date_ajout.toDate().getTime()
        );
      });

      setTodos(sortedTodos);
      setLoading(false); // Désactiver le chargement après la récupération
    });

    // Nettoyer l'écouteur quand le composant est démonté
    return () => unsubscribe();
  }, []);

  // Fonction pour basculer en mode édition
  const handleEditClick = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTask(todo.tache);
    setTimeout(() => {
      inputRef.current?.focus(); // Ajouter le focus automatiquement
    }, 0);
  };

  // Fonction pour gérer la modification de la tâche
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditingTask(e.target.value);
  };

  // Fonction pour sauvegarder les modifications
  const handleSaveClick = async (todo: Todo) => {
    if (editingTask.trim() === "") return; // Empêcher de sauvegarder une tâche vide

    try {
      const todoRef = doc(db, "todos", todo.id);
      await updateDoc(todoRef, {
        tache: editingTask, // Mise à jour de la tâche dans Firestore
      });

      setTodos((prevTodos) =>
        prevTodos.map((t) =>
          t.id === todo.id ? { ...t, tache: editingTask } : t,
        ),
      );
      toast({
        title: `Tâche modifiée`,
        description: `La tâche "${todo.tache}" a été modifiée avec succès.`,
      });
      setEditingTodoId(null); // Quitter le mode édition
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche :", error);
    }
  };

  // Fonction pour annuler la modification
  const handleCancelClick = () => {
    setEditingTodoId(null);
    toast({
      title: `Edition annulée`,
      description: `L'édition de la tâche a été annulée.`,
    }); // Annuler l'édition et revenir à l'affichage normal
  };

  // Fonction de gestion de la soumission du formulaire
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Ajouter une nouvelle tâche dans Firestore
      await addDoc(collection(db, "todos"), {
        tache: values.tache,
        date_ajout: Timestamp.now(),
        fait: false,
      });

      toast({
        title: `Tâche ajoutée`,
        description: `La tâche ${values.tache} a été ajoutée avec succès.`,
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout de la tâche.",
        variant: "destructive",
      });
      console.error("Erreur lors de l'ajout de la tâche :", error);
    }
  }

  // Fonction pour supprimer une tâche
  async function handleDelete(tache: Todo) {
    try {
      await deleteDoc(doc(db, "todos", tache.id));
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== tache.id));
      toast({
        title: `Tâche supprimée`,
        description: `La tâche ${tache.tache} a été supprimée avec succès.`,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche :", error);
    }
  }

  async function handleSwitchChange(todo: Todo) {
    const newFaitStatus = !todo.fait;
    const newDateFinit = newFaitStatus ? Timestamp.now() : null; // Ajouter la date uniquement si faite est true

    // Mise à jour optimiste de l'état local
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === todo.id
          ? { ...t, fait: newFaitStatus, date_finit: newDateFinit }
          : t,
      ),
    );

    try {
      const todoRef = doc(db, "todos", todo.id);
      await updateDoc(todoRef, {
        fait: newFaitStatus,
        date_finit: newDateFinit,
      });

      toast({
        title: `Tâche ${newFaitStatus ? "complétée" : "incomplète"}`,
        description: `La tâche "${todo.tache}" a été ${newFaitStatus ? "complétée" : "remise à incomplète"}.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Une erreur s'est produite lors de la mise à jour de la tâche`,
        variant: "destructive",
      });

      console.error("Erreur lors de la mise à jour de la tâche :", error);
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
    <div className="flex">
      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Tâche a faire</CardTitle>
            <CardDescription>To-do list propulsé par Firebase</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Ajout de la barre de progression */}
            <div className="pb-4 pt-4">
              <div className="mb-4 flex items-center justify-between">
                <span
                  className={`text-lg font-semibold transition-all duration-300 ${
                    progress === 100
                      ? "text-green-500"
                      : progress > 50
                        ? "text-blue-500"
                        : "text-red-500"
                  }`}
                >
                  {Math.round(progress)}% des tâches complétées
                </span>
                {progress === 100 ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : progress < 50 ? (
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                ) : null}
              </div>

              <Progress
                value={progress}
                className="h-4 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <Separator />

            <div className="pb-5">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex items-center space-x-2 pt-5"
                >
                  <FormField
                    control={form.control}
                    name="tache"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            className="w-full"
                            placeholder="Entrez la tache"
                            {...field}
                          />
                        </FormControl>
                        <ErrorAlert
                          error={form.formState.errors.tache?.message}
                        />
                      </FormItem>
                    )}
                  />
                  <Button size="icon" type="submit" className="space-x-2">
                    <PlusIcon className="h-6 w-6" />
                  </Button>
                </form>
              </Form>
            </div>
            <Separator />

            <div className="pt-10">
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
                </div>
              ) : (
                <Table>
                  <TableCaption>Liste des tâches</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="">Tache</TableHead>
                      <TableHead className="">Fait</TableHead>
                      <TableHead className="">Ajoutée le</TableHead>
                      <TableHead className="">Fait le</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todos.map((todo) => (
                      <TableRow
                        key={todo.id}
                        className="scale-90 transform opacity-0 transition-all duration-1000 ease-in-out"
                        style={{ opacity: 1, transform: "scale(1)" }}
                      >
                        <TableCell>
                          {/* Si la tâche est en mode édition, afficher un champ de saisie */}
                          {editingTodoId === todo.id ? (
                            <Input
                              ref={inputRef}
                              value={editingTask}
                              onChange={handleEditChange}
                              className="w-full"
                            />
                          ) : (
                            <span
                              className={
                                todo.fait ? "text-primary line-through" : ""
                              }
                            >
                              {todo.tache}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={todo.fait}
                            onCheckedChange={() => handleSwitchChange(todo)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {format(todo.date_ajout.toDate(), "dd/MM/yyyy HH:mm")}
                        </TableCell>
                        <TableCell className="font-medium">
                          {todo.date_finit ? (
                            format(todo.date_finit.toDate(), "dd/MM/yyyy HH:mm")
                          ) : (
                            <span className="text-gray-500">
                              Pas encore terminée
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="space-x-2 text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center text-red-600">
                                  <Trash2 className="mr-2 inline h-5 w-5" />
                                  Confirmer la suppression
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer la tâche "
                                  {todo.tache}" ? Cette action ne peut pas être
                                  annulée.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200">
                                  Annuler
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 text-white hover:bg-red-600"
                                  onClick={() => handleDelete(todo)}
                                >
                                  Confirmer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          {editingTodoId === todo.id ? (
                            // Si la tâche est en mode édition, afficher les boutons "Sauvegarder" et "Annuler."
                            <>
                              <Button
                                size="icon"
                                onClick={() => handleSaveClick(todo)}
                                className="bg-green-600 hover:bg-green-500"
                              >
                                <ArrowUpFromLine className="h-4 w-4"></ArrowUpFromLine>
                              </Button>
                              <Button size="icon" onClick={handleCancelClick}>
                                <CircleX className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            // Utiliser le bouton d'édition existant
                            <Button
                              onClick={() => handleEditClick(todo)}
                              size="icon"
                              className="bg-blue-600 hover:bg-blue-500"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
