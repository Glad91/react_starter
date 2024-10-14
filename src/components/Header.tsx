import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-primary text-primary-foreground p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">My App</Link>
        
        {/* Menu hamburger pour mobile */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X /> : <Menu />}
        </Button>

        {/* Navigation pour desktop */}
        <div className="hidden md:flex space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/about">About</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/contact">Contact</Link>
          </Button>
        </div>

        {/* Menu déroulant pour mobile */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-primary p-4 md:hidden">
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" asChild onClick={toggleMenu}>
                <Link to="/">Home</Link>
              </Button>
              <Button variant="ghost" asChild onClick={toggleMenu}>
                <Link to="/about">About</Link>
              </Button>
              <Button variant="ghost" asChild onClick={toggleMenu}>
                <Link to="/contact">Contact</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;