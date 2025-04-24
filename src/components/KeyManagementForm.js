// src/components/KeyManagementForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function KeyManagementForm({ onKeySet, displayMode }) {
  // displayMode: "votecast" means hide lambda, otherwise show lambda

  const [mode, setMode] = useState("generate");
  const [customKey, setCustomKey] = useState({ n: "", g: "", lambda: "" });
  const [message, setMessage] = useState("");
  const [currentKey, setCurrentKey] = useState(null);

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  const handleInputChange = (e) => {
    setCustomKey({ ...customKey, [e.target.name]: e.target.value });
  };

  const setKey = async () => {
    try {
      let payload;
      if (mode === "generate") {
        payload = { mode: "generate" };
      } else {
        payload = { mode: "custom", ...customKey };
      }
      const res = await axios.post('http://localhost:8080/key', payload);
      setMessage(res.data);
      fetchCurrentKey();
      if (onKeySet) onKeySet();
    } catch (error) {
      setMessage("Error setting key: " + error.response.data);
    }
  };

  const fetchCurrentKey = async () => {
    try {
      const res = await axios.get('http://localhost:8080/key');
      if (typeof res.data === "object") {
        setCurrentKey(res.data);
      } else {
        setCurrentKey(null);
      }
    } catch (error) {
      console.error("Error fetching key:", error);
    }
  };

  useEffect(() => {
    fetchCurrentKey();
  }, []);

  return (
    <div className="card p-4 mb-4">
      <h2>Key Management</h2>
      <p>
        Please set the encryption key used for voting. The public key (n and g) will be shown to you.
        {displayMode !== "votecast" && " The private key parameter (lambda) will also be displayed for auditing purposes."}
      </p>
      <div className="mb-3">
        <label className="form-label">Select Mode:</label>
        <select className="form-select" value={mode} onChange={handleModeChange}>
          <option value="generate">Generate New Key</option>
          <option value="custom">Use Custom Key</option>
        </select>
      </div>
      {mode === "custom" && (
        <div className="mb-3">
          <label className="form-label">Modulus (n):</label>
          <input
            type="text"
            className="form-control"
            name="n"
            value={customKey.n}
            onChange={handleInputChange}
          />
          <label className="form-label">Generator (g):</label>
          <input
            type="text"
            className="form-control"
            name="g"
            value={customKey.g}
            onChange={handleInputChange}
          />
          {displayMode !== "votecast" && (
            <>
              <label className="form-label">Lambda:</label>
              <input
                type="text"
                className="form-control"
                name="lambda"
                value={customKey.lambda}
                onChange={handleInputChange}
              />
            </>
          )}
        </div>
      )}
      <button className="btn btn-primary" onClick={setKey}>
        Set Key
      </button>
      {message && <p className="mt-2">{message}</p>}
      {currentKey && typeof currentKey === "object" && (
        <div className="mt-3">
          <h5>Current Key Parameters</h5>
          <p><strong>n:</strong> {currentKey.n}</p>
          <p><strong>g:</strong> {currentKey.g}</p>
          {displayMode !== "votecast" && (
            <p><strong>lambda:</strong> {currentKey.lambda}</p>
          )}
          {displayMode === "votecast" && (
            <p className="text-info">These parameters (n and g) are public and used for encryption. The private key (lambda) is not shown here for security.</p>
          )}
          {displayMode !== "votecast" && (
            <p className="text-info">Save these key parameters for future tally verification.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default KeyManagementForm;
