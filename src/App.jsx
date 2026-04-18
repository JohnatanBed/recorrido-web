import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Habitacion from './pages/Habitación';
import Computadora from './pages/Computadora';
import Mural from './pages/Mural';
import Cama from './pages/Cama';
import Puerta from './pages/Puerta';
function App() {



  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/habitacion" element={<Habitacion />} />
      <Route path="/computadora" element={<Computadora />} />
      <Route path="/mural" element={<Mural />} />
      <Route path="/cama" element={<Cama />} />
      <Route path="/puerta" element={<Puerta />} />
    </Routes>



  );

};

export default App;