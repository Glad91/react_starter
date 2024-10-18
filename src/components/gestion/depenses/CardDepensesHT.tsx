import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { DollarSign } from "lucide-react";
import useDepenseStore from "@/stores/depenseStore.tsx";

export default function CardDepensesHT() {
  const totalHT = useDepenseStore((state) => state.getTotalHT());

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <DollarSign className="h-6 w-6 text-blue-500" />
          <h3 className="text-lg font-semibold">Dépenses HT</h3>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{totalHT.toFixed(2)} €</p>
      </CardContent>
    </Card>
  );
}
