// src/components/VoteCastingPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VoteCastingPage({ currentUser }) {
  const candidateOptions = [
    'Candidate A',
    'Candidate B',
    'Candidate C',
    'Candidate D',
    'Candidate E'
  ];

  // State for the vote data
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [voteValue, setVoteValue] = useState('');
  const [encryptedVote, setEncryptedVote] = useState('');
  const [message, setMessage] = useState('');

  // State for the existing encryption key
  const [keyData, setKeyData] = useState(null);

  // Fetch the current key from the backend
  const fetchCurrentKey = async () => {
    try {
      const res = await axios.get('http://localhost:8080/key');
      if (typeof res.data === 'object') {
        setKeyData(res.data);
      } else {
        setKeyData(null);
      }
    } catch (error) {
      setMessage("Error fetching encryption key: " + error.message);
    }
  };

  useEffect(() => {
    fetchCurrentKey();
  }, []);

  // Encrypt the vote value
  const handleEncryptVote = async () => {
    if (!keyData) {
      setMessage("Voting is inactive: No encryption key set by authority.");
      return;
    }
    if (!voteValue.trim()) {
      setMessage("Please enter a numeric vote value.");
      return;
    }
    try {
      const res = await axios.get('http://localhost:8080/crypto/aggregation/encrypt', {
        params: { value: voteValue }
      });
      setEncryptedVote(res.data);
      setMessage("Vote value encrypted successfully.");
    } catch (error) {
      setMessage("Encryption error: " + error.message);
    }
  };

  // Cast a vote
  const castVote = async () => {
    if (!keyData) {
      setMessage("Voting is inactive: No encryption key set by authority.");
      return;
    }
    if (!selectedCandidate || !encryptedVote) {
      setMessage("Please select a candidate and encrypt your vote first.");
      return;
    }
    try {
      const vote = {
        voterUsername: currentUser || 'anonymous',
        candidate: selectedCandidate,
        encryptedVote: encryptedVote,
      };
      const res = await axios.post('http://localhost:8080/vote/cast', vote);
      setMessage("Vote cast successfully: " + res.data);
    } catch (error) {
      setMessage("Vote casting error: " + error.message);
    }
  };

  return (
    <div className="card p-5">
      <h2>Cast Your Vote</h2>

      {!keyData ? (
        <div className="alert alert-warning">
          <p>Voting is inactive because the authority has not started the session yet.</p>
        </div>
      ) : (
        <div className="alert alert-info"
          style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          <p>
            Voting is active using the election key. <br />
            <strong>n:</strong> {keyData.n} <br />
            <strong>g:</strong> {keyData.g}
          </p>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Select Candidate:</label>
        <select
          className="form-select"
          value={selectedCandidate}
          onChange={e => setSelectedCandidate(e.target.value)}
          disabled={!keyData}
        >
          <option value="">-- Choose a Candidate --</option>
          {candidateOptions.map((candidate, idx) => (
            <option key={idx} value={candidate}>{candidate}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Vote Value (numeric):</label>
        <input
          type="number"
          className="form-control"
          value={voteValue}
          onChange={e => setVoteValue(e.target.value)}
          placeholder="Enter a numeric vote value (e.g., 1)"
          disabled={!keyData}
        />
      </div>
      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={handleEncryptVote} disabled={!keyData}>
          Encrypt Vote Value
        </button>
        <button className="btn btn-success" onClick={castVote} disabled={!keyData || !encryptedVote}>
          Cast Vote
        </button>
      </div>

      {message && <p className="mt-2">{message}</p>}

      {encryptedVote && (
        <div className="alert alert-secondary mt-3">
          <strong>Encrypted Vote:</strong> {encryptedVote}
        </div>
      )}
    </div>
  );
}

export default VoteCastingPage;
