import { useState } from "react";
import "../styles/form.css";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const BASE_URL = 'https://api.fda.gov/drug/event.json';

  const filterSymptomMatches = (symptomList, results) => {
    // Convert input symptoms to lowercase array and trim whitespace
    const userSymptoms = symptomList
      .split(',')
      .map(s => s.trim().toLowerCase());

    // Filter and analyze only matching symptoms
    const symptomAnalysis = new Map();
    const matchingCases = [];

    results.forEach(result => {
      const matchedSymptoms = result.patient.reaction
        .filter(reaction => 
          userSymptoms.some(symptom => 
            reaction.reactionmeddrapt.toLowerCase().includes(symptom)
          )
        );

      if (matchedSymptoms.length > 0) {
        // Add to matching cases
        matchingCases.push({
          medications: result.patient.drug.map(drug => ({
            name: drug.medicinalproduct,
            dosage: drug.drugdosagetext || 'Not specified',
            indication: drug.drugindication || 'Not specified'
          })),
          reactions: matchedSymptoms.map(reaction => ({
            symptom: reaction.reactionmeddrapt,
            outcome: reaction.reactionoutcome
          })),
          possibleConditions: Array.from(
            new Set(
              result.patient.drug
                .map(drug => drug.drugindication)
                .filter(Boolean)
            )
          )
        });

        // Analyze matching symptoms
        matchedSymptoms.forEach(reaction => {
          const symptom = reaction.reactionmeddrapt.toLowerCase();
          if (!symptomAnalysis.has(symptom)) {
            symptomAnalysis.set(symptom, {
              count: 1,
              medications: new Set(),
              possibleConditions: new Set()
            });
          }

          const analysis = symptomAnalysis.get(symptom);
          result.patient.drug.forEach(drug => {
            if (drug.medicinalproduct) {
              analysis.medications.add(drug.medicinalproduct);
            }
            if (drug.drugindication) {
              analysis.possibleConditions.add(drug.drugindication);
            }
          });
        });
      }
    });

    return {
      analysis: symptomAnalysis,
      cases: matchingCases
    };
  };

  const fetchHealthInfo = async (symptomList) => {
    try {
      setIsLoading(true);
      const searchTerms = symptomList
        .split(',')
        .map(s => s.trim())
        .join('+AND+');

      const url = `${BASE_URL}?search=patient.reaction.reactionmeddrapt:"${searchTerms}"&limit=10`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch health information');
      }

      const data = await response.json();
      return filterSymptomMatches(symptomList, data.results);
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
      if (response && response.cases.length > 0) {
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
          <div className="symptom-analysis">
            <h3>Symptom Analysis</h3>
            <div className="analysis-items">
              {Array.from(result.analysis.entries()).map(([symptom, analysis]) => (
                <div key={symptom} className="analysis-item">
                  <h4>{symptom}</h4>
                  {analysis.possibleConditions.size > 0 && (
                    <div className="conditions">
                      <p>Possible related conditions:</p>
                      <ul>
                        {Array.from(analysis.possibleConditions).map((condition, idx) => (
                          <li key={idx}>{condition}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <h3>Related Health Information</h3>
          {result.cases.map((item, index) => (
            <div key={index} className="result-item">
              <h4>Case {index + 1}</h4>
              
              {item.possibleConditions.length > 0 && (
                <div className="conditions">
                  <h5>Potential Conditions:</h5>
                  <ul>
                    {item.possibleConditions.map((condition, idx) => (
                      <li key={idx}>{condition}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="medications">
                <h5>Related Medications:</h5>
                <ul>
                  {item.medications.map((med, medIndex) => (
                    <li key={medIndex}>
                      {med.name} - {med.dosage}
                      {med.indication !== 'Not specified' && (
                        <span className="indication"> (Used for: {med.indication})</span>
                      )}
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

export default SymptomChecker;