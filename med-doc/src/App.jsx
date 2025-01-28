
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import Header from "./components/Header";
import Footer from "./components/Footer";
import EmergencyContacts from './components/EmergencyContacts';
import MedicationReminder from './components/MedicationReminder';
import HealthDiary from './components/HealthDiary';
import BMICalculator from './components/BMICalculator';
import Navigation from './components/Navigation';
import "./styles/App.css";

const App = () => (
  <Router>
    <Header />
    <Navigation />
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Home />} />
       
        <Route path="/emergency" element={<EmergencyContacts />} />
        <Route path="/medications" element={<MedicationReminder />} />
        <Route path="/diary" element={<HealthDiary />} />
        <Route path="/bmi" element={<BMICalculator />} />
      </Routes>
    </main>
    <Footer />
  </Router>
);

export default App;