import { useEffect, useState } from 'react';
import './App.css';

function App() {
  // Holds the WebSocket instance (initially null)
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Stores the current value from the input field
  const [data, setData] = useState<string>('');

  // Stores all messages received from the server
  const [messages, setMessages] = useState<string[]>([]);

  // Tracks whether WebSocket connection has been established
  const [connected, setConnected] = useState<boolean>(false);

  // Function to initiate WebSocket connection
  const handleConnect = () => {
    if (connected) {
      alert("Already connected");
      return;
    }

    // Create a new WebSocket connection to the server
    const newSocket = new WebSocket("ws://localhost:8080");

    // Save socket to state
    setSocket(newSocket);

    // When connection is successfully established
    newSocket.onopen = () => {
      console.log("Connected to WebSocket server");

      // You can send initial message like this:
      // newSocket.send("Connection established from client");
    };

    // When a message is received from the server
    newSocket.onmessage = (event: MessageEvent) => {
      setMessages(prev => [...prev, `Server: ${event.data}`]); // Append new message
    };

    // If there's an error with the WebSocket
    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // When the WebSocket connection is closed
    newSocket.onclose = () => {
      console.warn("WebSocket connection closed");
      setConnected(false);
      setSocket(null);
    };

    // Set the connection flag to true
    setConnected(true);
    // Optional cleanup function (not needed here as it's inside a normal function, not useEffect)
    // return () => {
    //   newSocket.close();
    //   setConnected(false);
    // };
  };

  const handleDisconnect=()=>{
    if(socket && socket.readyState==WebSocket.OPEN) socket.close();
    else{
      alert("No active connection to close")
    }
  }

  // Function to send data to the server
  const handleSubmit = () => {
    // Check if WebSocket is open
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(data); // Send message
      setData(''); // Clear input field
    } else {
      alert("WebSocket is not open");
    }
  };

  // Update `data` state as the user types
  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(e.target.value);
  };

  return (
    <>
      <h1>Ping Pong WebSocket App</h1>

      {connected && 
        <button onClick={handleDisconnect}>DisConnect</button>
      }

      {/* Show Connect button only if not already connected */}
      {!connected && 
        <button onClick={handleConnect}>Connect</button>
      }

      {/* Input field to type messages */}
      <input
        type="text"
        placeholder="Type sali"
        value={data} // Controlled input — keeps input in sync with React state
        onChange={handleUpdate}
      />

      {/* Button to send message to server */}
      <button onClick={handleSubmit}>Submit</button>

      {/* Display received messages */}
      <div>
        <h2>Messages</h2>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
    </>
  );
}

export default App;