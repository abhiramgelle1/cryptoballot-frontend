import React from 'react';

function Home() {
  return (
    <div>
      <h1 className="mb-4">Welcome to CryptoBallot</h1>
      <p className="lead">
        CryptoBallot is a secure electronic voting system that uses advanced security techniques to protect voter privacy, ensure vote integrity, and provide verifiable results.
      </p>
      <p>
        Use the navigation bar above to:
      </p>
      <ul>
        <li><strong>Register & Login:</strong> Create your account and authenticate using a secure challenge-response process.</li>
        <li><strong>Blind Signature:</strong> View a demo of how your vote can be signed without revealing its content.</li>
        <li><strong>Aggregation:</strong> See how encrypted votes are aggregated and decrypted to reveal the final tally.</li>
        <li><strong>Cast Vote:</strong> Encrypt and cast your vote securely. All your data is persisted in the database.</li>
      </ul>
    </div>
  );
}

export default Home;
