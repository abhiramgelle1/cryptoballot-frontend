// src/components/VoteCastingWithSignaturePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VoteCastingWithSignaturePage({ currentUser }) {
  const candidateOptions = [
    'Candidate A',
    'Candidate B',
    'Candidate C',
    'Candidate D',
    'Candidate E'
  ];

  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [voteValue, setVoteValue] = useState('');
  const [blindingFactor, setBlindingFactor] = useState('');
  const [encryptedVote, setEncryptedVote] = useState('');
  const [blindSignature, setBlindSignature] = useState('');
  const [message, setMessage] = useState('');

  // Key data from the authority
  const [keyData, setKeyData] = useState(null);

  // Fetch the encryption key from the backend
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

  // Encrypt the vote
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

  // Obtain blind signature
  const handleBlindSignature = async () => {
    if (!encryptedVote) {
      setMessage("Please encrypt your vote value first.");
      return;
    }
    if (!blindingFactor.trim()) {
      setMessage("Please enter a blinding factor.");
      return;
    }
    try {
      const res = await axios.post('http://localhost:8080/crypto/rsa/blind/fullBlind', null, {
        params: { message: encryptedVote, rStr: blindingFactor }
      });
      setBlindSignature(res.data);
      setMessage("Blind signature obtained successfully.");
    } catch (error) {
      setMessage("Blind signature error: " + error.message);
    }
  };

  // Cast vote with blind signature
  const castVoteWithSignature = async () => {
    if (!keyData) {
      setMessage("Voting is inactive: No encryption key set by authority.");
      return;
    }
    if (!selectedCandidate || !encryptedVote || !blindSignature) {
      setMessage("Select a candidate, encrypt your vote value, and obtain a blind signature first.");
      return;
    }
    try {
      const vote = {
        voterUsername: currentUser || 'anonymous',
        candidate: selectedCandidate,
        encryptedVote: encryptedVote,
        blindSignature: blindSignature,
      };
      const res = await axios.post('http://localhost:8080/vote/cast', vote);
      setMessage("Vote cast with blind signature successfully: " + res.data);
    } catch (error) {
      setMessage("Vote casting error: " + error.message);
    }
  };

  return (
    <div className="card p-5">
      <h2>Cast Your Vote with Blind Signature</h2>

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
      </div>

      {encryptedVote && (
        <div className="alert alert-secondary mb-3">
          <strong>Encrypted Vote:</strong> {encryptedVote}
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Blinding Factor (numeric):</label>
        <input
          type="number"
          className="form-control"
          value={blindingFactor}
          onChange={e => setBlindingFactor(e.target.value)}
          placeholder="Enter your blinding factor"
          disabled={!keyData}
        />
      </div>

      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={handleBlindSignature} disabled={!keyData}>
          Get Blind Signature
        </button>
      </div>

      {blindSignature && (
        <div className="alert alert-secondary mb-3">
          <strong>Blind Signature:</strong> {blindSignature}
        </div>
      )}

      <div className="mb-3">
        <button className="btn btn-success" onClick={castVoteWithSignature} disabled={!keyData || !encryptedVote || !blindSignature}>
          Cast Vote with Signature
        </button>
      </div>

      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}

export default VoteCastingWithSignaturePage;
