import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useTodoStore } from "@/stores/todoStore.tsx";

function Home() {
  const { toast } = useToast();
  const { todos, loading, fetchTodos } = useTodoStore();

  useEffect(() => {
    const unsubscribe = fetchTodos(); // Récupérer les tâches lors du montage du composant
    console.log("Unsubscribe:", todos);
    return () => unsubscribe; // Nettoyer l'écouteur lors du démontage
  }, [fetchTodos]);

  if (loading) {
    return <div>Loading...</div>; // Afficher un indicateur de chargement
  }

  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">Welcome to Your React App</h1>
      <p className="mb-4">
        This is a blank starter using Vite, React, Tailwind CSS, and shadcn/ui.
      </p>
      <Button
        onClick={() => {
          toast({
            title: "Bienvenue sur le starter React",
            description: "Vous venez de cliquer sur le bouton !",
            action: (
              <ToastAction
                onClick={() => console.log("Hello")}
                altText="Clique moi"
              >
                Clique moi
              </ToastAction>
            ),
          });
        }}
      >
        Toast !
      </Button>
      <div>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.tache}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
