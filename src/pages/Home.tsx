import { Button } from '@/components/ui/button';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
      <h1 className="text-4xl font-bold mb-4">Welcome to Your React App</h1>
      <p className="mb-4">This is a blank starter using Vite, React, Tailwind CSS, and shadcn/ui.</p>
      <Button>Click me!</Button>
    </div>
  );
}

export default Home;