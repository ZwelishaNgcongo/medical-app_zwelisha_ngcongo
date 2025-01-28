import { useState} from 'react';

const HealthDiary = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    date: '',
    symptoms: '',
    mood: '',
    notes: ''
  });

  const addEntry = (e) => {
    e.preventDefault();
    setEntries([{ ...newEntry, id: Date.now() }, ...entries]);
    setNewEntry({ date: '', symptoms: '', mood: '', notes: '' });
  };

  const deleteEntry = (idToDelete) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setEntries(entries.filter(entry => entry.id !== idToDelete));
    }
  };

  return (
    <div className="health-diary">
      <h2>Health Diary</h2>
      <form onSubmit={addEntry} className="diary-form">
        <input
          type="date"
          value={newEntry.date}
          onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
        />
        <textarea
          placeholder="Symptoms"
          value={newEntry.symptoms}
          onChange={(e) => setNewEntry({ ...newEntry, symptoms: e.target.value })}
        />
        <select
          value={newEntry.mood}
          onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value })}
        >
          <option value="">Select Mood</option>
          <option value="great">Great</option>
          <option value="good">Good</option>
          <option value="okay">Okay</option>
          <option value="poor">Poor</option>
        </select>
        <textarea
          placeholder="Additional Notes"
          value={newEntry.notes}
          onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
        />
        <button type="submit">Add Entry</button>
      </form>
      <div className="diary-entries">
        {entries.map(entry => (
          <div key={entry.id} className="diary-card">
            <div className="diary-header">
              <h3>{new Date(entry.date).toLocaleDateString()}</h3>
              <button
                onClick={() => deleteEntry(entry.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
            <p><strong>Symptoms:</strong> {entry.symptoms}</p>
            <p><strong>Mood:</strong> {entry.mood}</p>
            <p><strong>Notes:</strong> {entry.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

      
export default HealthDiary;