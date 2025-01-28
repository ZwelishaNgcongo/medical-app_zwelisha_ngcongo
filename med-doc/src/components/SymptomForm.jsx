import { useState } from "react";
import "../styles/form.css";

const SymptomForm = () => {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

 
 
  const BASE_URL = 'https://api.fda.gov/drug/event.json';

  const fetchHealthInfo = async (symptomList) => {
    try {
      setIsLoading(true);
      /*  Converting symptoms to a search query */
      const searchTerms = symptomList
        .split(',')
        .map(s => s.trim())
        .join('+AND+');

      const url = `${BASE_URL}?search=patient.reaction.reactionmeddrapt:"${searchTerms}"&limit=5`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch health information');
      }

      const data = await response.json();
      
       /* Process and format the response data */
      const formattedResults = data.results.map(result => ({
        medications: result.patient.drug.map(drug => ({
          name: drug.medicinalproduct,
          dosage: drug.drugdosagetext || 'Not specified'
        })),
        reactions: result.patient.reaction.map(reaction => ({
          symptom: reaction.reactionmeddrapt,
          outcome: reaction.reactionoutcome
        }))
      }));

      return formattedResults;
    } catch (error) {
      console.error("Error fetching health data:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError("Please enter symptoms.");
      return;
    }

    try {
      setError("");
      const response = await fetchHealthInfo(symptoms);
      if (response && response.length > 0) {
        setResult(response);
      } else {
        setError("No matching conditions found. Please refine your symptoms.");
      }
    } catch {
      setError("An error occurred while fetching results. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Symptom Checker</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Enter symptoms separated by commas (e.g., headache, fever, nausea)"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Get Advice'}
        </button>
      </form>
      
      {error && <p className="error">{error}</p>}
      
      {result && (
        <div className="result">
          <h3>Related Health Information</h3>
          {result.map((item, index) => (
            <div key={index} className="result-item">
              <h4>Case {index + 1}</h4>
              <div className="medications">
                <h5>Related Medications:</h5>
                <ul>
                  {item.medications.map((med, medIndex) => (
                    <li key={medIndex}>
                      {med.name} - {med.dosage}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="reactions">
                <h5>Reported Reactions:</h5>
                <ul>
                  {item.reactions.map((reaction, reactionIndex) => (
                    <li key={reactionIndex}>
                      {reaction.symptom}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SymptomForm;
