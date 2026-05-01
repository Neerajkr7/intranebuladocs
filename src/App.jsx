import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>IntraNebula Docs</h1>
      <p>Welcome to your Vite + React project</p>
      
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Sample Component</h2>
        <p>Count: <strong>{count}</strong></p>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Increment Counter
        </button>
      </div>

      <div style={{ marginTop: '30px', color: '#666' }}>
        <h3>Project Info</h3>
        <ul>
          <li>Built with Vite</li>
          <li>Using React 18</li>
          <li>No CSS libraries</li>
          <li>Inline styles only</li>
        </ul>
      </div>
    </div>
  )
}

export default App
