import React, { useState } from "react";

function validate(username, password) {
  const errors = {};

  if (!username) {
    errors.username = "Username is required.";
  } else if (username.length < 4) {
    errors.username = "Username must be at least 4 characters.";
  } else if (username.length > 20) {
    errors.username = "Username must be at most 20 characters.";
  } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
    errors.username = "Username must contain only letters and numbers.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  } else if (!/[0-9]/.test(password)) {
    errors.password = "Password must contain at least one number.";
  } else if (!/[a-zA-Z]/.test(password)) {
    errors.password = "Password must contain at least one letter.";
  }

  return errors;
}

export default function Login({ onLogin, onSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleBlur = (field) => {
    const errs = validate(username, password);
    setErrors((prev) => ({ ...prev, [field]: errs[field] }));
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setErrors((prev) => ({ ...prev, username: undefined }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrors((prev) => ({ ...prev, password: undefined }));
  };

  const handleSubmit = (action) => {
    const errs = validate(username, password);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (action === "login") {
      onLogin(username, password);
    } else {
      onSignup(username, password);
    }
  };

  return (
    <div className="loginPage">
      <div className="loginCard">
        <h1 className="loginTitle">Cinematch</h1>
        <p className="loginSubtitle">Sign in or create an account</p>

        <form className="loginForm" onSubmit={(e) => e.preventDefault()}>
          <div className="loginField">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              onBlur={() => handleBlur("username")}
              placeholder="Enter your username"
              autoComplete="username"
              aria-describedby={errors.username ? "username-error" : undefined}
            />
            {errors.username && (
              <p id="username-error" className="loginError" role="alert">
                {errors.username}
              </p>
            )}
          </div>

          <div className="loginField">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleBlur("password")}
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="loginError" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <div className="loginActions">
            <button
              type="button"
              className="loginBtnPrimary"
              onClick={() => handleSubmit("login")}
            >
              Log In
            </button>
            <button
              type="button"
              className="loginBtnSecondary"
              onClick={() => handleSubmit("signup")}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
