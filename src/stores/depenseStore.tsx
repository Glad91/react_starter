import { create } from "zustand";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

// TypeScript interface pour les dépenses
export interface Depense {
  id: string;
  montant: number;
  description: string;
  categorie: string;
  date_ajout: Date;
  date: Date;
  isTVAApplicable: boolean; // Indiquer si la TVA s'applique
  tva: number; // Stocker le montant de la TVA
}

interface DepenseStore {
  depenses: Depense[]; // Liste des dépenses
  loading: boolean; // Indicateur de chargement
  error: string | null; // Message d'erreur
  fetchDepenses: () => void; // Fonction pour récupérer les dépenses
  addDepense: (
    montant: number,
    description: string,
    categorie: string,
    date: Date,
    isTVAApplicable: boolean, // Le champ TVA ajouté comme argument
  ) => Promise<void>;
  updateDepense: (
    id: string,
    montant: number,
    description: string,
    categorie: string,
    date: Date,
    isTVAApplicable: boolean,
  ) => Promise<void>; // Fonction pour mettre à jour une dépense
  removeDepense: (id: string) => Promise<void>; // Fonction pour supprimer une dépense
  getTotalTVA: () => number; // Fonction pour obtenir le total de la TVA
  getTotalHT: () => number; // Fonction pour obtenir le total des dépenses HT
  getTotalTTC: () => number; // Fonction pour obtenir le total des dépenses TTC
}

// Création du store avec zustand
const useDepenseStore = create<DepenseStore>((set, get) => ({
  depenses: [],
  loading: false,
  error: null,

  removeDepense: async (id: string) => {
    const db = getFirestore();
    set({ loading: true, error: null });
    try {
      await deleteDoc(doc(db, "depenses", id));
      set((state) => ({
        depenses: state.depenses.filter((depense) => depense.id !== id),
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({
        error: "Erreur lors de la suppression de la dépense",
        loading: false,
      });
      console.error("Erreur lors de la suppression de la dépense :", error);
    }
  },

  updateDepense: async (
    id,
    montant,
    description,
    categorie,
    date,
    isTVAApplicable,
  ) => {
    const db = getFirestore();
    set({ loading: true, error: null });
    try {
      await updateDoc(doc(db, "depenses", id), {
        montant,
        description,
        categorie,
        date,
        isTVAApplicable,
      });
      set((state) => ({
        depenses: state.depenses.map((dep) =>
          dep.id === id
            ? { ...dep, montant, description, categorie, date, isTVAApplicable }
            : dep,
        ),
      }));
      // Vous pouvez ajouter ici des appels à une API pour mettre à jour les données
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la dépense :", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Fonction pour récupérer les dépenses depuis Firebase
  fetchDepenses: () => {
    const db = getFirestore();
    set({ loading: true, error: null });

    return onSnapshot(
      collection(db, "depenses"),
      (querySnapshot) => {
        const fetchedDepenses = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Convertir 'date_ajout' et 'date' en objet Date si ce sont des Timestamps
            date_ajout:
              data.date_ajout instanceof Timestamp
                ? data.date_ajout.toDate()
                : data.date_ajout,
            date:
              data.date instanceof Timestamp ? data.date.toDate() : data.date,
            isTVAApplicable: data.isTVAApplicable || false, // Gestion de la TVA
            tva: data.tva || 0, // Montant de la TVA
          };
        }) as Depense[];

        // Trier les dépenses par date d'ajout (ordre décroissant)
        const sortedDepenses = fetchedDepenses.sort(
          (a, b) => b.date_ajout.getTime() - a.date_ajout.getTime(),
        );

        // Mettre à jour le store avec les données triées
        set({ depenses: sortedDepenses, loading: false });
      },
      (error) => {
        set({
          error: "Erreur lors du chargement des dépenses",
          loading: false,
        });
        console.error("Erreur lors de la récupération des dépenses :", error);
      },
    ); // Retourner la fonction de désabonnement pour nettoyer lors du démontage
  },

  // Fonction pour ajouter une dépense
  addDepense: async (
    montant,
    description,
    categorie,
    date,
    isTVAApplicable,
  ) => {
    const db = getFirestore();
    set({ loading: true, error: null });

    const TVA_RATE = 1.2; // Taux de TVA à 20%
    const tva = isTVAApplicable
      ? parseFloat((montant - montant / TVA_RATE).toFixed(2))
      : 0; // Calcul de la TVA arrondi

    try {
      // Ajout de la nouvelle dépense dans Firestore avec le champ 'date' et TVA
      await addDoc(collection(db, "depenses"), {
        montant,
        description,
        categorie,
        date_ajout: new Date(), // Ajouter la date actuelle
        date: new Date(date), // Convertir la date en objet Date
        isTVAApplicable, // Stocker si la TVA est applicable
        tva, // Stocker le montant de la TVA
      });

      set({ loading: false });
    } catch (error) {
      set({ error: "Erreur lors de l'ajout de la dépense", loading: false });
      console.error("Erreur lors de l'ajout de la dépense :", error);
    }
  },

  // Fonction pour obtenir le total de la TVA
  getTotalTVA: () => {
    const depenses = get().depenses;
    return depenses.reduce((acc, depense) => {
      if (depense.isTVAApplicable) {
        return acc + depense.montant - depense.montant / (1 + 0.2);
      }
      return acc;
    }, 0);
  },

  // Fonction pour obtenir le total des dépenses HT
  getTotalHT: () => {
    const depenses = get().depenses;
    return depenses.reduce((acc, depense) => {
      if (depense.isTVAApplicable) {
        return acc + depense.montant / (1 + 0.2);
      }
      return acc + depense.montant;
    }, 0);
  },

  // Fonction pour obtenir le total des dépenses TTC
  getTotalTTC: () => {
    const depenses = get().depenses;
    return depenses.reduce((total, depense) => total + depense.montant, 0);
  },
}));

export default useDepenseStore;
