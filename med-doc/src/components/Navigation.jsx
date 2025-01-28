import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="navigation">
      <Link to="/">Symptom Checker</Link>
      <Link to="/emergency">Emergency Contacts</Link>
      <Link to="/medications">Medication Reminder</Link>
      <Link to="/diary">Health Diary</Link>
      <Link to="/bmi">BMI Calculator</Link>
    </nav>
  );
};

export default Navigation;