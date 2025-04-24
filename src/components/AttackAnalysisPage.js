// src/components/AttackAnalysisPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AttackAnalysisPage() {
  const [logEntries, setLogEntries] = useState([]);
  const [counts, setCounts] = useState({
    replay: { success: 0, failure: 0 },
    substitution: { success: 0, failure: 0 },
    injection: { success: 0, failure: 0 },
  });

  // Helper function to add a log entry with a timestamp and conditional style
  const addLogEntry = (attackType, result) => {
    const timestamp = new Date().toLocaleTimeString();
    // Determine color based on result content
    let color = 'black';
    if (result.toLowerCase().includes("successful")) {
      color = 'green';
    } else if (result.toLowerCase().includes("failed") || result.toLowerCase().includes("error")) {
      color = 'red';
    }
    setLogEntries((prev) => [{ attackType, result, timestamp, color }, ...prev]);
  };

  // General function to simulate an attack by calling the corresponding endpoint.
  const simulateAttack = async (type, endpoint) => {
    try {
      const res = await axios.get(`http://localhost:8080/attack/${endpoint}`);
      const resultText = res.data;
      const isSuccess = resultText.toLowerCase().includes("successful");
      setCounts((prev) => ({
        ...prev,
        [type]: {
          success: prev[type].success + (isSuccess ? 1 : 0),
          failure: prev[type].failure + (isSuccess ? 0 : 1),
        },
      }));
      addLogEntry(type, resultText);
    } catch (error) {
      const errorMsg = error.message;
      setCounts((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          failure: prev[type].failure + 1,
        },
      }));
      addLogEntry(type, `Error: ${errorMsg}`);
    }
  };

  // Specific functions for each attack type.
  const simulateReplayAttack = () => simulateAttack("replay", "replay");
  const simulateSubstitutionAttack = () => simulateAttack("substitution", "substitution");
  const simulateInjectionAttack = () => simulateAttack("injection", "injection");

  // Prepare data for the dynamic bar chart.
  const chartData = {
    labels: ['Replay', 'Substitution', 'Injection'],
    datasets: [
      {
        label: 'Success',
        data: [
          counts.replay.success,
          counts.substitution.success,
          counts.injection.success,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // greenish
      },
      {
        label: 'Failure',
        data: [
          counts.replay.failure,
          counts.substitution.failure,
          counts.injection.failure,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // reddish
      },
    ],
  };

  return (
    <div className="card p-4">
      <h2 className="mb-3">Live Attack Analysis & Monitoring</h2>
      <p>
        Click a button to simulate an attack. The system uses its live security operations (encryption, blind signatures, aggregation) and DB values to generate real attack scenarios.
        For example, the substitution attack retrieves a real vote, modifies its encrypted value, and then decrypts both the original and modified ciphertext.
      </p>
      <div className="mb-3">
        <button className="btn btn-warning me-2" onClick={simulateReplayAttack}>
          Simulate Replay Attack
        </button>
        <button className="btn btn-warning me-2" onClick={simulateSubstitutionAttack}>
          Simulate Substitution Attack
        </button>
        <button className="btn btn-warning" onClick={simulateInjectionAttack}>
          Simulate Injection Attack
        </button>
      </div>
      <div className="mb-4" style={{ maxWidth: '600px', margin: 'auto' }}>
        <Bar data={chartData} options={{ maintainAspectRatio: true }} />
      </div>
      <h4>Live Log</h4>
      <div
        className="list-group"
        style={{ maxHeight: '300px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}
      >
        {logEntries.map((entry, index) => (
          <div key={index} className="list-group-item" style={{ color: entry.color }}>
            <small className="text-muted">
              {entry.timestamp} [{entry.attackType.toUpperCase()}]
            </small>
            <br />
            <span>{entry.result}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttackAnalysisPage;
