import React, { useEffect, useState } from 'react';
import { auth, firestore, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously, signOut } from './firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribeFromAuth = auth.onAuthStateChanged(user => {
      setUser(user || null);
      setError(''); // Clear error on state change
    });

    return () => unsubscribeFromAuth();
  }, []);

  useEffect(() => {
    const q = query(collection(firestore, 'messages'), orderBy('createdAt', 'desc'), limit(50)); // Limit to 50 messages
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs.reverse()); // Reverse for chronological order
    });

    return unsubscribe;
  }, []);

  const handleSend = async () => {
    if (newMessage.trim() === '' || !user) return;

    try {
      await addDoc(collection(firestore, 'messages'), {
        text: newMessage,
        createdAt: serverTimestamp(),
        uid: user.uid,
        displayName: user.email,
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleAuth = async () => {
    setError(''); // Clear previous errors
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error("Error during authentication:", error);
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Reset user state to show login/register screen
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">QuikChat</h2>
      {!user ? (
        <div className="auth-container">
          <h3>{isRegistering ? 'Register' : 'Login'}</h3>
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
          <button onClick={handleAuth}>{isRegistering ? 'Register' : 'Login'}</button>
          <button onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Switch to Login' : 'Switch to Register'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      ) : (
        <>
          <button onClick={handleLogout} className="logout-button">Logout</button>
          <div className="message-box">
            {messages.map(message => (
              <div key={message.id} className={`message ${message.uid === user.uid ? 'sent' : 'received'}`}>
                <div className="message-content">
                  <span className="message-sender">{message.displayName}:</span>
                  <span className="message-text">{message.text}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="message-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <button onClick={handleSend} className="send-button">Send</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
