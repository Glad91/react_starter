import { create } from "zustand";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

// Interface pour les recettes
interface Recette {
  id: string;
  montant: number;
  description: string;
  categorie: string;
  date_ajout: Date;
}

interface RecetteStore {
  recettes: Recette[];
  loading: boolean;
  error: string | null;
  fetchRecettes: () => void;
  addRecette: (
    montant: number,
    description: string,
    categorie: string,
  ) => Promise<void>;
}

// Création du store
const useRecetteStore = create<RecetteStore>((set) => ({
  recettes: [],
  loading: false,
  error: null,

  // Fonction pour récupérer les recettes depuis Firebase
  fetchRecettes: () => {
    const db = getFirestore();
    set({ loading: true, error: null });

    return onSnapshot(
      collection(db, "recettes"),
      (querySnapshot) => {
        const fetchedRecettes = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date_ajout:
              data.date_ajout instanceof Timestamp
                ? data.date_ajout.toDate()
                : data.date_ajout,
          };
        }) as Recette[];

        // Trier les recettes par date d'ajout
        const sortedRecettes = fetchedRecettes.sort(
          (a, b) => b.date_ajout.getTime() - a.date_ajout.getTime(),
        );

        set({ recettes: sortedRecettes, loading: false });
      },
      (error) => {
        set({
          error: "Erreur lors du chargement des recettes",
          loading: false,
        });
        console.error("Erreur lors de la récupération des recettes :", error);
      },
    );
  },

  // Fonction pour ajouter une recette
  addRecette: async (montant, description, categorie) => {
    const db = getFirestore();
    set({ loading: true, error: null });

    try {
      await addDoc(collection(db, "recettes"), {
        montant,
        description,
        categorie,
        date_ajout: new Date(), // Date d'ajout actuelle
      });

      set({ loading: false });
    } catch (error) {
      set({ error: "Erreur lors de l'ajout de la recette", loading: false });
      console.error("Erreur lors de l'ajout de la recette :", error);
    }
  },
}));

export default useRecetteStore;
