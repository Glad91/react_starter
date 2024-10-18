import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon } from "lucide-react"; // Importer les icônes pour le bouton de mode sombre

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const location = useLocation();

  // Bascule le menu mobile
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Bascule entre le mode sombre et clair
  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Vérifie si un lien est actif
  const isActiveLink = (path: string) => location.pathname === path;

  return (
    <header className="bg-secondary p-4 text-secondary-foreground">
      <nav className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          Starter React
        </Link>

        {/* Menu hamburger pour mobile avec le bouton dark mode */}
        <div className="flex items-center space-x-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun /> : <Moon />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Navigation pour desktop */}
        <div className="hidden items-center space-x-4 md:flex">
          <Button
            variant={isActiveLink("/") ? "default" : "ghost"}
            className={`${isActiveLink("/") ? "bg-primary" : ""}`}
            asChild
          >
            <Link to="/">Home</Link>
          </Button>
          <Button
            variant={isActiveLink("/gestion") ? "default" : "ghost"}
            className={`${isActiveLink("/gestion") ? "bg-primary" : ""}`}
            asChild
          >
            <Link to="/gestion">Gestion</Link>
          </Button>
          <Button
            variant={isActiveLink("/todo") ? "default" : "ghost"}
            className={`${isActiveLink("/todo") ? "bg-primary" : ""}`}
            asChild
          >
            <Link to="/todo">Todo</Link>
          </Button>
          <Button
            variant={isActiveLink("/about") ? "default" : "ghost"}
            className={`${isActiveLink("/about") ? "bg-primary" : ""}`}
            asChild
          >
            <Link to="/about">About</Link>
          </Button>
          <Button
            variant={isActiveLink("/contact") ? "default" : "ghost"}
            className={`${isActiveLink("/contact") ? "bg-primary" : ""}`}
            asChild
          >
            <Link to="/contact">Contact</Link>
          </Button>

          {/* Bouton pour le mode sombre */}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun /> : <Moon />}
          </Button>
        </div>

        {/* Menu déroulant pour mobile */}
        {isMenuOpen && (
          <div className="absolute left-0 right-0 top-16 bg-white p-4 dark:bg-gray-900 md:hidden">
            <div className="flex flex-col space-y-2">
              <Button
                variant={isActiveLink("/") ? "default" : "ghost"}
                className={isActiveLink("/") ? "bg-primary" : ""}
                asChild
                onClick={toggleMenu}
              >
                <Link to="/">Home</Link>
              </Button>
              <Button
                variant={isActiveLink("/about") ? "default" : "ghost"}
                className={isActiveLink("/about") ? "bg-primary" : ""}
                asChild
                onClick={toggleMenu}
              >
                <Link to="/about">About</Link>
              </Button>
              <Button
                variant={isActiveLink("/contact") ? "default" : "ghost"}
                className={isActiveLink("/contact") ? "bg-primary" : ""}
                asChild
                onClick={toggleMenu}
              >
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
