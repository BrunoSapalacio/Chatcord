import React, { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export default function AuthContextProvider(props) {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, displayName, email, photoURL } = user;
        setUser({
          id: uid,
          name: displayName,
          email: email,
          photoURL: photoURL
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return getUser;
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user }}>
      {!loading && props.children}
    </AuthContext.Provider>
  );
}