import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

function Home() {
  const { toast } = useToast();

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
    </div>
  );
}

export default Home;
