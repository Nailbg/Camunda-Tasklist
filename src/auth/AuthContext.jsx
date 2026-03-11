import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function login(username, password) {
  const authHeader = "Basic " + btoa(username + ":" + password);

  const res = await fetch(`/engine-rest/user/${username}/profile`, {
    headers: {
      Authorization: authHeader
    }
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  const userData = await res.json();

  setUser({
    username: userData.id,
    password
  });
}

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);