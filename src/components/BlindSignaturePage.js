import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bigInt from 'big-integer';

function BlindSignaturePage() {
  const [params, setParams] = useState({ n: null, e: null });
  const [message, setMessage] = useState("");
  const [r, setR] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get('http://localhost:8080/crypto/rsa/blind/params')
      .then(res => {
        const lines = res.data.split("\n");
        const n = bigInt(lines[0].split(":")[1].trim());
        const e = bigInt(lines[1].split(":")[1].trim());
        setParams({ n, e });
      })
      .catch(err => {
        setError("Failed to fetch RSA parameters");
      });
  }, []);

  const handleBlind = async () => {
    if (!params.n || !params.e) {
      setError("RSA parameters not loaded");
      return;
    }
    try {
      const res = await axios.post('http://localhost:8080/crypto/rsa/blind/fullBlind', null, {
        params: { message, rStr: r }
      });
      setResult(res.data);
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card p-4">
          <h2>Blind Signature Demo</h2>
          <p>
            Enter a numeric message (e.g., your vote as a number) and a blinding factor. 
            The system blinds your message, obtains a signature from the authority, and then unblinds it.
          </p>
          {params.n && params.e ? (
            <div className="mb-3">
              <p><strong>RSA Parameters:</strong></p>
              <p>n = {params.n.toString()}</p>
              <p>e = {params.e.toString()}</p>
            </div>
          ) : <p>Loading RSA parameters...</p>}
          <div className="mb-3">
            <label className="form-label">Message (number):</label>
            <input
              className="form-control"
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Blinding Factor r (number):</label>
            <input
              className="form-control"
              type="text"
              value={r}
              onChange={e => setR(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleBlind}>
            Obtain Blind Signature
          </button>
          {result && <pre className="mt-3">{result}</pre>}
          {error && <p className="text-danger mt-3">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default BlindSignaturePage;
