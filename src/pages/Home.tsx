import { Button } from "@/components/ui/button";

function Home() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">Welcome to Your React App</h1>
      <p className="mb-4">
        This is a blank starter using Vite, React, Tailwind CSS, and shadcn/ui.
      </p>
      <Button>Click me!</Button>
    </div>
  );
}

export default Home;
