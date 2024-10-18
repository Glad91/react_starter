import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Todo from "@/pages/Todo.tsx";
import GestionPage from "@/pages/GestionPage.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="todo" element={<Todo />} />
          <Route path="gestion" element={<GestionPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
