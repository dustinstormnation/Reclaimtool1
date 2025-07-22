import { useState } from 'react';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { storage } from '../firebase'; // your Firebase init

export default function InspectionTool() {
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(false);

  async function analyzePhoto(base64, itemId) {
    setLoading(true);
    // 1. Upload to Firebase
    const path = `inspections/${Date.now()}/${itemId}.jpg`;
    const storageRef = ref(storage, path);
    await uploadString(storageRef, base64, 'data_url');
    const imageUrl = await getDownloadURL(storageRef);

    // 2. Call your new API route
    const resp = await fetch('/api/assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl }),
    });
    const { findings } = await resp.json();
    setFindings(findings);
    setLoading(false);
  }

  // ...in your capturePhoto handler, call analyzePhoto(canvasData, item.id)

  return (
    <div>
      {/* existing checklist & camera UI here */}
      {loading && <p>Analyzing image… 🔍</p>}
      {findings.length > 0 && (
        <section>
          <h2>AI Findings</h2>
          <ul>
            {findings.map((f, i) => (
              <li key={i}>
                {f.label} — {(f.confidence * 100).toFixed(0)}%  
                <pre>{JSON.stringify(f.box)}</pre>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
