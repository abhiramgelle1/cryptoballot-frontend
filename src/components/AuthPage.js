import React from 'react';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';

function AuthPage({ onLogin }) {
  return (
    <div className="card p-4">
      <h2 className="mb-3">Voter Registration & Login</h2>
      <p>
        If you are new to CryptoBallot, register with your username and password.
        If you already have an account, log in using your username and password.
      </p>
      <div className="row mt-4">
        <div className="col-md-6 mb-3">
          <h4>Register</h4>
          <RegistrationForm />
        </div>
        <div className="col-md-6 mb-3">
          <h4>Login</h4>
          <LoginForm onLogin={onLogin} />
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
