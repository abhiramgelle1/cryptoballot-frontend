// src/components/ResultsTallyPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import KeyManagementForm from './KeyManagementForm';

function ResultsTallyPage({ currentUser }) {
  const [candidateResults, setCandidateResults] = useState({});
  const [totalVotes, setTotalVotes] = useState(null);
  const [userVotes, setUserVotes] = useState([]);
  const [userCandidateAgg, setUserCandidateAgg] = useState({});
  const [message, setMessage] = useState("");
  const [keyData, setKeyData] = useState(null);
  const [showKeyForm, setShowKeyForm] = useState(false);

  // Function to fetch current key from backend
  const fetchCurrentKey = async () => {
    try {
      const res = await axios.get('http://localhost:8080/key');
      if (typeof res.data === "object") {
        setKeyData(res.data);
      } else {
        setKeyData(null);
      }
    } catch (error) {
      setMessage("Error fetching key: " + error.message);
    }
  };

  // Function to fetch candidate results, total votes, and user votes
  const fetchResults = async () => {
    try {
      const aggRes = await axios.get('http://localhost:8080/crypto/aggregation/aggregateVotesByCandidate');
      if (typeof aggRes.data === 'object') {
        setCandidateResults(aggRes.data);
      } else {
        setMessage(aggRes.data);
      }
      const totalRes = await axios.get('http://localhost:8080/vote/count');
      setTotalVotes(totalRes.data);
      if (currentUser) {
        const userRes = await axios.get(`http://localhost:8080/vote/user/${currentUser}`);
        setUserVotes(userRes.data);
      }
    } catch (error) {
      setMessage("Error fetching results: " + error.message);
    }
  };

  // Aggregate user votes by candidate
  const aggregateUserVotes = () => {
    const agg = {};
    userVotes.forEach(v => {
      agg[v.candidate] = (agg[v.candidate] || 0) + 1;
    });
    setUserCandidateAgg(agg);
  };

  // When component mounts, check for key and fetch results if available
  useEffect(() => {
    fetchCurrentKey();
  }, []);

  // Whenever keyData is updated (i.e., key is set), fetch results
  useEffect(() => {
    if (keyData) {
      fetchResults();
    }
  }, [keyData, currentUser]);

  useEffect(() => {
    // if (userVotes.length > 0) {
    //   aggregateUserVotes();
    // }
    if (userVotes.length > 0) {
      const decryptPromises = userVotes.map(v =>
        axios.get('http://localhost:8080/crypto/aggregation/decrypt', {
          params: { ciphertext: v.encryptedVote }
        }).then(res => ({
          candidate: v.candidate,
          value: parseInt(res.data, 10)   
        }))
      );

      Promise.all(decryptPromises)
        .then(results => {
          const agg = {};
          results.forEach(({ candidate, value }) => {
            agg[candidate] = (agg[candidate] || 0) + value;
          });
          setUserCandidateAgg(agg);
        })
        .catch(err => setMessage("Error decrypting your votes: " + err.message));
    }
  }, [userVotes]);

  const handleKeySet = () => {
    fetchCurrentKey();
    setShowKeyForm(false);
  };

  const displayUser = currentUser ? currentUser : "anonymous";

  return (
    <div>
      <h2>Results Tally</h2>
      
      {/* Display the current key details if available */}
      {keyData ? (
        <div className="card p-3 mb-4">
          <h5>Current Decryption Key Parameters</h5>
          <p><strong>n:</strong> {keyData.n}</p>
          <p><strong>g:</strong> {keyData.g}</p>
          <p><strong>lambda:</strong> {keyData.lambda}</p>
          <p className="text-info">These are the key parameters used to decrypt the aggregated votes. Save these for future tally verification.</p>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowKeyForm(true)}>Change Key</button>
        </div>
      ) : (
        <div className="alert alert-warning">
          <p>No decryption key is set yet. Please set a key to view accurate results.</p>
          <button className="btn btn-primary btn-sm" onClick={() => setShowKeyForm(true)}>Set Key</button>
        </div>
      )}

      {/* Conditionally render the KeyManagementForm */}
      {showKeyForm && <KeyManagementForm onKeySet={handleKeySet} />}

      {/* Only fetch and display aggregation results if key is set */}
      {keyData ? (
        <>
          <h4 className="mt-3">Candidate Results (System-wide)</h4>
          {typeof candidateResults === 'object' && Object.keys(candidateResults).length > 0 ? (
            <ul className="list-group">
              {Object.entries(candidateResults).map(([candidate, count]) => (
                <li key={candidate} className="list-group-item d-flex justify-content-between align-items-center">
                  Candidate: <strong>{candidate}</strong>
                  <span className="badge bg-primary rounded-pill">{count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No candidate results available.</p>
          )}

          <h4 className="mt-4">Total Votes Cast</h4>
          {totalVotes !== null ? (
            <p className="lead">{totalVotes}</p>
          ) : (
            <p>Loading total vote count...</p>
          )}
        </>
      ) : (
        <p className="mt-3 text-warning">Please set the decryption key to view the results.</p>
      )}

      <hr className="my-4" />
      <h4>Logged in as: <em>{displayUser}</em></h4>
      {currentUser ? (
        <>
          <h5 className="mt-3">Your Votes (by candidate)</h5>
          {Object.keys(userCandidateAgg).length > 0 ? (
            <ul className="list-group">
              {Object.entries(userCandidateAgg).map(([candidate, count]) => (
                <li key={candidate} className="list-group-item d-flex justify-content-between align-items-center">
                  Candidate: <strong>{candidate}</strong>
                  <span className="badge bg-secondary rounded-pill">{count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>You haven't cast any votes yet.</p>
          )}
        </>
      ) : (
        <p className="mt-3">You are not logged in, so no personal vote data is displayed.</p>
      )}

      {message && <p className="mt-3 text-danger">{message}</p>}
    </div>
  );
}

export default ResultsTallyPage;
