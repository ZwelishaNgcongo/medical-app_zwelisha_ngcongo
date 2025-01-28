import { useState} from 'react';

const MedicationReminder = () => {
  const [medications, setMedications] = useState([]);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: ''
  });

  const addMedication = (e) => {
    e.preventDefault();
    setMedications([...medications, { ...newMedication, id: Date.now() }]);
    setNewMedication({ name: '', dosage: '', frequency: '', time: '' });
  };

  const deleteMedication = (id) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  return (
    <div className="medication-reminder">
      <h2>Medication Reminder</h2>
      <form onSubmit={addMedication} className="medication-form">
        <input
          type="text"
          placeholder="Medication Name"
          value={newMedication.name}
          onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Dosage"
          value={newMedication.dosage}
          onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
        />
        <select
          value={newMedication.frequency}
          onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
        >
          <option value="">Select Frequency</option>
          <option value="daily">Daily</option>
          <option value="twice">Twice Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <input
          type="time"
          value={newMedication.time}
          onChange={(e) => setNewMedication({ ...newMedication, time: e.target.value })}
        />
        <button type="submit">Add Medication</button>
      </form>

      <div className="medications-list">
        {medications.map(med => (
          <div key={med.id} className="medication-card">
            <h3>{med.name}</h3>
            <p>Dosage: {med.dosage}</p>
            <p>Frequency: {med.frequency}</p>
            <p>Time: {med.time}</p>
            <button onClick={() => deleteMedication(med.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationReminder;