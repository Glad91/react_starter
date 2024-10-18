import DepenseForm from "@/components/gestion/depenses/DepenseForm.tsx";
import RecetteForm from "@/components/gestion/recettes/RecetteForm.tsx";
import DepenseTable from "@/components/gestion/depenses/DepenseTable.tsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CardDepensesTTC from "@/components/gestion/depenses/CardDepensesTTC.tsx";
import CardDepensesHT from "@/components/gestion/depenses/CardDepensesHT.tsx";
import CardDepensesTva from "@/components/gestion/depenses/CardDepensesTVA.tsx";
import useDepenseStore from "@/stores/depenseStore.tsx";
import { useState } from "react";

export default function GestionDashboard() {
  const { depenses } = useDepenseStore();
  const [expenseToEdit, setExpenseToEdit] = useState<
    null | (typeof depenses)[0]
  >(null);

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Dashboard de Gestion
      </h1>

      {/* Indicateurs principaux */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <CardDepensesTTC />
        <CardDepensesHT />
        <CardDepensesTva />
      </div>

      {/* Formulaires et Tableaux */}
      <Tabs defaultValue="depenses" className="space-y-4">
        <TabsList className="mb-4 flex justify-center">
          <TabsTrigger value="depenses">Dépenses</TabsTrigger>
          <TabsTrigger value="recettes">Recettes</TabsTrigger>
        </TabsList>

        <TabsContent value="depenses">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-1">
            {/* Formulaire des Dépenses */}
            <Card>
              <CardContent className="pt-4">
                <DepenseForm
                  expenseToEdit={expenseToEdit} // Passer la dépense à éditer
                  onSuccess={() => setExpenseToEdit(null)} // Réinitialiser après l'édition
                />
              </CardContent>
            </Card>

            {/* Tableau des Dépenses */}
            <Card>
              <CardContent className="pt-4">
                <DepenseTable
                  onEditExpense={(depense) => setExpenseToEdit(depense)} // Gérer l'édition
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recettes">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Formulaire des Recettes */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Ajouter une Recette</h2>
              </CardHeader>
              <CardContent>
                <RecetteForm />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
