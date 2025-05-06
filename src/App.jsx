import { useState, useEffect } from 'react';
import './App.css'
import googleLogo from './assets/providers/google.png';
//import loginImage from './assets/gifs/jerryandthebird.gif';
import signOutIcon from './assets/icons/icon-sign-out.svg';
import defaultUserIcon from './assets/images/default-profile-picture.jpeg';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3kIC0yDJFJQsy8p_y-Cdz5tl7uQ7juxA",
  authDomain: "moody-120b9.firebaseapp.com",
  projectId: "moody-120b9",
  storageBucket: "moody-120b9.firebasestorage.app"
};

/* We dont need that 
  messagingSenderId: "962879187317",
  appId: "1:962879187317:web:35d67b5e1c12e5f86bcb3c"* */

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

function App() {


//  console.log(app.options.projectId)

// === State ===
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [user, setUser] = useState(null);
const [displayName, setDisplayName] = useState('');
const [photoURL, setPhotoURL] = useState('');

  // === Firebase Auth Handlers ===
  const authSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          console.log("Signed in with Google");
        }).catch((error) => {
          console.log(error.message);
        });
      // setIsLoggedIn(true);
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
    }
  };

  

  const authSignInWithEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
//      setIsLoggedIn(true);
    } catch (error) {
      console.error("Email Sign-In Error:", error.message);
    }
  };

  const authCreateAccountWithEmail = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
 //     setIsLoggedIn(true);
    } catch (error) {
      console.error("Account Creation Error:", error.message);
    }
  };

  const authSignOut = async () => {
    try {
      await signOut(auth);
      setEmail('');      // Clear email
      setPassword('');   // Clear password
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Account Creation Error:", error.message);
    }
  };

  const authUpdateProfile = async () => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: displayName,
          photoURL: photoURL,
        });
        alert('Profile updated!');
        setUser({ ...auth.currentUser }); // force re-render with updated info
      } catch (error) {
        console.error("Profile update error:", error.message);
      }
    }
  };

  //set up a useEffect hook that listens for authentication state changes
  //store the user to help displaying the user name or profile picture once logged in
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);         // <-- SET the user object
        setIsLoggedIn(true);
      } else {
        setUser(null);         // <-- CLEAR it on logout
        setIsLoggedIn(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <>
      {!isLoggedIn ? (
        <section id="logged-out-view">
          <div className="container">
            <h1 className="app-title">Moody</h1>

            <div className="provider-buttons">
              <button onClick={authSignInWithGoogle} className="provider-btn">
                <img src={googleLogo} alt="Google logo" className="google-btn-logo" />
                Sign in with Google
              </button>
            </div>

            <div className="auth-fields-and-buttons">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={authSignInWithEmail} className="primary-btn">Sign in</button>
              <button onClick={authCreateAccountWithEmail} className="secondary-btn">Create Account</button>
            </div>
          </div>
        </section>
      ) : (
          <section id="logged-in-view">
            <div className="container">
              <div className="sign-out-wrapper">
                <button onClick={authSignOut} className="icon-btn">
                  <img src={signOutIcon} alt="sign out button" className="icon-img-btn" />
                </button>
              </div>


              <div className="container center-content">
                <div className="user-section">
                  <img
                    src={user?.photoURL ? user.photoURL : defaultUserIcon}
                    alt="User Icon"
                    className="user-icon"
                  />
                </div>
                <p className="welcome-text">Welcome, {user?.displayName || user?.email}</p>
 {/*               <img src={loginImage} alt="Logged-in animation" />
 */}
                <div className="auth-fields-and-buttons">
                  <input
                    id="display-name-input"
                    type="text"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />

                  <input
                    id="photo-url-input"
                    type="text"
                    placeholder="Profile Photo URL"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                  />

                  <button id="update-profile-btn" className="primary-btn" onClick={authUpdateProfile}>
                    Update profile
                  </button>
                </div>
              </div>

 
            </div>
          </section>
      )}
    </>
  )
}

export default App
