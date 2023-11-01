import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import NavbarLinks from "./components/Header";
import SendMessageComponent from "./components/SendMessage";
import UserList from "./components/UserList";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase listener to track authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        console.log("User signed in:", user); 
      } else {
        setCurrentUser(null);
      }
      setLoading(false); // State is determined (either logged in or not)
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // You can replace this with a loading spinner or similar
  }
  const handleLogout = async () => {
    try {
        await auth.signOut();
        console.log('Logged out successfully');
    } catch (error) {
        console.error('Error logging out:', error);
    }
};


  return (
    <div className="App">
    <NavbarLinks user={currentUser} setUser={setCurrentUser} handleLogout={handleLogout} />


      <Routes>
        <Route path="/auth" element={currentUser ? <Home /> : <SignIn />} />
        <Route path="/home" element={<Home  />} />
        <Route path="/messages/:userId" element={ <SendMessageComponent /> } />

        <Route path="/users" element={<UserList  /> } />
      </Routes>
    </div>
  );
};

export default App;
