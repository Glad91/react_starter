import { create } from "zustand";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

// Définir l'interface des tâches (Todo) et du store Zustand
interface Todo {
  id: string;
  tache: string;
  date_ajout: Timestamp;
  fait: boolean;
  date_finit: Timestamp | null;
}

interface TodoStore {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  fetchTodos: () => void;
  addTodo: (tache: string) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  updateTodo: (id: string, newTache: string, fait: boolean) => Promise<void>;
}

// Créer un store Zustand
export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  loading: true,
  error: null,

  // Fonction pour récupérer les tâches depuis Firebase
  fetchTodos: () => {
    const db = getFirestore();
    set({ loading: true, error: null });

    const unsubscribe = onSnapshot(
      collection(db, "todos"),
      (querySnapshot) => {
        const fetchedTodos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Todo[];

        // Trier les tâches par date d'ajout
        const sortedTodos = fetchedTodos.sort(
          (a, b) =>
            b.date_ajout.toDate().getTime() - a.date_ajout.toDate().getTime(),
        );

        set({ todos: sortedTodos, loading: false });
      },
      (error) => {
        set({ error: "Erreur lors du chargement des tâches", loading: false });
        console.error("Erreur lors de la récupération des tâches :", error);
      },
    );

    return unsubscribe; // Retourner la fonction de désabonnement pour nettoyer lors du démontage
  },

  // Fonction pour ajouter une nouvelle tâche
  addTodo: async (tache: string) => {
    const db = getFirestore();
    try {
      set({ loading: true });
      const newTodo = {
        tache,
        date_ajout: Timestamp.now(),
        fait: false,
        date_finit: null,
      };

      const docRef = await addDoc(collection(db, "todos"), newTodo);
      set((state) => ({
        todos: [...state.todos, { id: docRef.id, ...newTodo }],
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({ error: "Erreur lors de l'ajout de la tâche", loading: false });
      console.error("Erreur lors de l'ajout de la tâche :", error);
    }
  },

  // Fonction pour supprimer une tâche
  removeTodo: async (id: string) => {
    const db = getFirestore();
    try {
      set({ loading: true });
      await deleteDoc(doc(db, "todos", id));
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({
        error: "Erreur lors de la suppression de la tâche",
        loading: false,
      });
      console.error("Erreur lors de la suppression de la tâche :", error);
    }
  },

  // Fonction pour mettre à jour une tâche
  updateTodo: async (id: string, newTache: string, fait: boolean) => {
    const db = getFirestore();
    const date_finit = fait ? Timestamp.now() : null; // Ajouter une date de fin si la tâche est terminée
    try {
      set({ loading: true });
      const todoRef = doc(db, "todos", id);
      await updateDoc(todoRef, { tache: newTache, fait, date_finit });

      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id
            ? { ...todo, tache: newTache, fait, date_finit }
            : todo,
        ),
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({
        error: "Erreur lors de la mise à jour de la tâche",
        loading: false,
      });
      console.error("Erreur lors de la mise à jour de la tâche :", error);
    }
  },
}));
