import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { DollarSign } from "lucide-react";
import useDepenseStore from "@/stores/depenseStore.tsx";

export default function CardDepensesTTC() {
  const totalTTC = useDepenseStore((state) => state.getTotalTTC());

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <DollarSign className="h-6 w-6 text-green-500" />
          <h3 className="text-lg font-semibold">Dépenses TTC</h3>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{totalTTC.toFixed(2)} €</p>
      </CardContent>
    </Card>
  );
}
