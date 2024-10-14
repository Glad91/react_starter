function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground p-4">
      <div className="container mx-auto text-center">
        © {new Date().getFullYear()} My App. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;