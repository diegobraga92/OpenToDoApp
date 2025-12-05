import { useState } from "react";

interface Task {
  id: string;
  title: string;
  done: boolean;
}

interface Payload {
  tasks: Task[];
}

export default function App() {
  const [apiUrl, setApiUrl] = useState("http://localhost:8080/process");

  const reqPayload: Payload = {
    tasks: [
      { id: "1", title: "Buy milk", done: true },
      { id: "2", title: "Walk dog", done: false },
      { id: "3", title: "Wash car", done: true },
    ],
  };

  const [response, setResponse] = useState("Waiting...");

  const sendRequest = async () => {
    setResponse("Sending...");

    try {
      const r = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqPayload),
      });

      if (!r.ok) {
        const text = await r.text();
        setResponse(`HTTP ${r.status}\n\n${text}`);
        return;
      }

      const json = await r.json();
      setResponse(JSON.stringify(json, null, 2));
    } catch (err: unknown) {
      setResponse("Request failed:\n" + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div style={{ fontFamily: "system-ui", padding: 20 }}>
      <h1>OpenToDoApp – Backend/Rust Integration Test</h1>

      <div style={{ marginBottom: 20 }}>
        <p>Backend URL:</p>
        <input
          style={{ width: 300 }}
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
        />
        <br /><br />
        <button onClick={sendRequest}>Send test request</button>
      </div>

      <h3>Request Payload</h3>
      <pre>{JSON.stringify(reqPayload, null, 2)}</pre>

      <h3>Response</h3>
      <pre>{response}</pre>
    </div>
  );
}
