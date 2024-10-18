import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { BarChart } from "lucide-react";
import useDepenseStore from "@/stores/depenseStore.tsx";

export default function CardDepensesTva() {
  const totalTVA = useDepenseStore((state) => state.getTotalTVA());

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <BarChart className="h-6 w-6 text-purple-500" />
          <h3 className="text-lg font-semibold">TVA Récupérable</h3>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{totalTVA.toFixed(2)} €</p>
      </CardContent>
    </Card>
  );
}
