import React, { useState } from 'react';
import axios from 'axios';

function AggregationPage() {
  const [value, setValue] = useState("");
  const [encryptedValue, setEncryptedValue] = useState("");
  const [ciphertexts, setCiphertexts] = useState([]);
  const [aggregatedCipher, setAggregatedCipher] = useState("");
  const [decryptedSum, setDecryptedSum] = useState("");
  const [groupedResults, setGroupedResults] = useState({});
  const [message, setMessage] = useState("");

  const handleEncrypt = async () => {
    try {
      const res = await axios.get('http://localhost:8080/crypto/aggregation/encrypt', {
        params: { value }
      });
      setEncryptedValue(res.data);
      setMessage("Encryption successful.");
    } catch (err) {
      setMessage("Encryption error: " + err.message);
    }
  };

  const addCiphertext = () => {
    if (encryptedValue) {
      setCiphertexts([...ciphertexts, encryptedValue]);
      setEncryptedValue("");
      setMessage("Encrypted value added to the list.");
    }
  };

  const handleAggregate = async () => {
    try {
      if (!ciphertexts.length) {
        setMessage("No ciphertexts available for aggregation.");
        return;
      }
      const ciphertextsStr = ciphertexts.join(",");
      const res = await axios.get('http://localhost:8080/crypto/aggregation/aggregate', {
        params: { ciphertexts: ciphertextsStr }
      });
      setAggregatedCipher(res.data);
      setMessage("Aggregation completed.");
    } catch (err) {
      setMessage("Aggregation error: " + err.message);
    }
  };

  const handleDecrypt = async () => {
    try {
      if (!aggregatedCipher) {
        setMessage("No aggregated ciphertext to decrypt.");
        return;
      }
      const res = await axios.get('http://localhost:8080/crypto/aggregation/decrypt', {
        params: { ciphertext: aggregatedCipher }
      });
      setDecryptedSum(res.data);
      setMessage("Decryption successful.");
    } catch (err) {
      setMessage("Decryption error: " + err.message);
    }
  };

  const handleAggregateVotesByCandidate = async () => {
    try {
      const res = await axios.get('http://localhost:8080/crypto/aggregation/aggregateVotesByCandidate');
      setGroupedResults(res.data);
      setMessage("Vote aggregation by candidate completed.");
    } catch (err) {
      setMessage("Aggregation by candidate error: " + err.message);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card p-4">
          <h2>Aggregation Demo</h2>
          <p>
            Enter a numeric value (e.g., salary, vote count), encrypt it, and add it to the list.
            Then aggregate and decrypt the final result.
          </p>
          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="Enter value"
            />
            <button className="btn btn-primary mt-2" onClick={handleEncrypt}>
              Encrypt Value
            </button>
          </div>
          {encryptedValue && <p>Encrypted Value: {encryptedValue}</p>}
          <button className="btn btn-secondary" onClick={addCiphertext}>Add to List</button>
          {ciphertexts.length > 0 && (
            <div className="mt-3">
              <h4>Encrypted Values:</h4>
              <ul className="list-group">
                {ciphertexts.map((ct, i) => (
                  <li key={i} className="list-group-item">{ct}</li>
                ))}
              </ul>
              <button className="btn btn-primary mt-3" onClick={handleAggregate}>
                Aggregate Encrypted Values
              </button>
            </div>
          )}
          {aggregatedCipher && (
            <div className="mt-3">
              <p><strong>Aggregated Ciphertext:</strong> {aggregatedCipher}</p>
              <button className="btn btn-success" onClick={handleDecrypt}>
                Decrypt Aggregated Value
              </button>
            </div>
          )}
          {decryptedSum && <h4 className="mt-3">Decrypted Sum: {decryptedSum}</h4>}
          <hr className="my-4" />
          <h3>Aggregate Votes By Candidate</h3>
          <p>Click below to aggregate all votes (grouped by candidate) from the database.</p>
          <button className="btn btn-warning" onClick={handleAggregateVotesByCandidate}>
            Aggregate Votes By Candidate
          </button>
          {Object.keys(groupedResults).length > 0 && (
            <div className="mt-3">
              <h4>Results by Candidate:</h4>
              <ul className="list-group">
                {Object.entries(groupedResults).map(([candidate, count]) => (
                  <li key={candidate} className="list-group-item">
                    Candidate: <strong>{candidate}</strong> - Votes: <strong>{count}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {message && <p className="mt-2">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default AggregationPage;
