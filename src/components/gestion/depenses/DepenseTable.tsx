import { useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table.tsx";
import useDepenseStore, { Depense } from "@/stores/depenseStore.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { toast } from "@/hooks/use-toast.ts";
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
} from "@/components/ui/alert-dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Pencil, Trash2 } from "lucide-react"; // Ajustez les imports selon votre structure
const TVA_RATE = 0.2; // Taux de TVA à 20%

type DepenseTableProps = {
  onEditExpense: (depense: Depense) => void; // Type de la fonction callback
};

function DepenseTable({ onEditExpense: onEditExpense }: DepenseTableProps) {
  const { depenses, fetchDepenses, removeDepense } = useDepenseStore(); // Récupère les dépenses du store

  useEffect(() => {
    fetchDepenses();
  }, [fetchDepenses]);

  async function handleDelete(depense: Depense) {
    try {
      await removeDepense(depense.id);
      toast({
        title: `Dépense supprimée`,
        description: `La dépense "${depense.description}" a été supprimée avec succès.`,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense :", error);
    }
  }

  // Calcul du total des dépenses TTC
  const totalTTC = useMemo(() => {
    return depenses.reduce((acc, depense) => acc + depense.montant, 0);
  }, [depenses]);

  // Calcul du total des dépenses HT
  const totalHT = useMemo(() => {
    return depenses.reduce((acc, depense) => {
      if (depense.isTVAApplicable) {
        return acc + depense.montant / (1 + TVA_RATE);
      }
      return acc + depense.montant;
    }, 0);
  }, [depenses]);

  // Calcul de la TVA
  const tva = useMemo(() => {
    return depenses.reduce((acc, depense) => {
      if (depense.isTVAApplicable) {
        return acc + depense.montant - depense.montant / (1 + TVA_RATE);
      }
      return acc;
    }, 0);
  }, [depenses]);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Tableau des Dépenses</h1>
      <Table>
        <TableCaption>Liste des dépenses</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Description</TableHead>
            <TableHead className="text-center">Catégorie</TableHead>
            <TableHead className="text-center">TVA Applicable</TableHead>{" "}
            {/* Nouvelle colonne */}
            <TableHead>Montant HT (€)</TableHead>
            <TableHead>Montant TTC (€)</TableHead>
            <TableHead className="text-center">
              Date de la dépense
            </TableHead>{" "}
            {/* Nouvelle colonne */}
            <TableHead className="text-center">Date d'ajout</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {depenses.map((depense) => {
            const montantHT = depense.isTVAApplicable
              ? (depense.montant / (1 + TVA_RATE)).toFixed(2)
              : depense.montant.toFixed(2);
            return (
              <TableRow
                key={depense.id}
                className="scale-90 transform opacity-0 transition-all duration-1000 ease-in-out"
                style={{ opacity: 1, transform: "scale(1)" }}
              >
                <TableCell>{depense.description}</TableCell>
                <TableCell className="text-center">
                  <Badge>{depense.categorie}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Switch checked={depense.isTVAApplicable} />
                </TableCell>
                <TableCell className="font-medium">{montantHT} €</TableCell>
                <TableCell className="font-medium">
                  {depense.montant.toFixed(2)} €
                </TableCell>
                <TableCell className="text-center font-medium">
                  {/* Affichage de la date de la dépense */}
                  {new Date(depense.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-center font-medium">
                  {new Date(depense.date_ajout).toLocaleDateString()}
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  {/* Boutons pour les actions sur les dépenses */}
                  <Button
                    onClick={() => onEditExpense(depense)}
                    size="icon"
                    className="bg-blue-600 hover:bg-blue-500"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
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
                          Êtes-vous sûr de vouloir supprimer la dépense "
                          {depense.description}" ? Cette action ne peut pas être
                          annulée.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200">
                          Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500 text-white hover:bg-red-600"
                          onClick={() => handleDelete(depense)}
                        >
                          Confirmer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Section Totaux */}
      <div className="mt-4 rounded-md border p-4">
        <h2 className="text-xl font-semibold">Résumé des Dépenses</h2>
        <div className="flex justify-between">
          <span>Total (HT) :</span>
          <span>{totalHT.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between">
          <span>TVA ({(TVA_RATE * 100).toFixed(0)}%) :</span>
          <span>{tva.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total (TTC) :</span>
          <span>{totalTTC.toFixed(2)} €</span>
        </div>
      </div>
    </div>
  );
}

export default DepenseTable;
