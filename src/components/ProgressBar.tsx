import * as React from "react";
import { Progress } from "@/components/ui/progress";

// Composant pour afficher la progression
export function ProgressBar() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return <Progress value={progress} className="w-[100%]" />;
}
