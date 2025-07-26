import React, { useState, useRef, useEffect } from 'react';
import { Camera, Ruler, FileText, Plus, Save } from 'lucide-react';

const InspectionTool = () => {
  // 1) State hooks
  const [inspectionTab, setInspectionTab] = useState('camera');
  const [checklistItems, setChecklistItems] = useState([
    { id: 1,  category: 'Roof',          item: 'Shingles/Tiles',                        checked: false, photos: 0, required: true },
    { id: 2,  category: 'Roof',          item: 'Ridge Line',                             checked: false, photos: 0, required: true },
    { id: 3,  category: 'Roof',          item: 'Roof Valleys',                           checked: false, photos: 0, required: true },
    { id: 4,  category: 'Roof',          item: 'Flashing (chimney, vents, skylights)',  checked: false, photos: 0, required: true },
    { id: 5,  category: 'Roof',          item: 'Gutters & Downspouts',                  checked: false, photos: 0, required: true },
    { id: 6,  category: 'Roof',          item: 'Soffit & Fascia',                        checked: false, photos: 0, required: true },
    { id: 7,  category: 'Exterior',      item: 'Siding (all sides)',                     checked: false, photos: 0, required: true },
    { id: 8,  category: 'Exterior',      item: 'Windows (frames & glass)',               checked: false, photos: 0, required: true },
    { id: 9,  category: 'Exterior',      item: 'Entry Doors',                            checked: false, photos: 0, required: true },
    { id: 10, category: 'Exterior',      item: 'Garage Door',                            checked: false, photos: 0, required: false },
    { id: 11, category: 'Exterior',      item: 'Outdoor HVAC Unit',                      checked: false, photos: 0, required: true },
    { id: 12, category: 'Exterior',      item: 'Deck/Patio',                             checked: false, photos: 0, required: false },
    { id: 13, category: 'Exterior',      item: 'Fence',                                  checked: false, photos: 0, required: false },
    { id: 14, category: 'Documentation', item: 'Overall Property Overview',              checked: false, photos: 0, required: true },
    { id: 15, category: 'Documentation', item: 'Insurance Nameplate/Mailbox',              checked: false, photos: 0, required: true }
  ]);

  // Helpers for toggles and photo count
  const toggleChecklistItem = (id) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };
  const addPhoto = (id) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === id ? { ...item, photos: item.photos + 1 } : item
      )
    );
    alert('Photo captured! In production, this would save to the checklist item.');
  };

  // Camera setup
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };
  const stopCamera = () => {
    if (!videoRef.current?.srcObject) return;
    videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    setCameraActive(false);
  };
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    alert('Photo captured! In a real app, this would be saved.');
  };
 const analyzePhoto = async (base64, itemId) => {
  setLoadingAI(true)
  const resp = await fetch('/api/assess', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64: base64, itemId })
  })
  const { findings } = await resp.json()
  setFindings(prev => ({ ...prev, [itemId]: findings }))
  setLoadingAI(false)
} 
  // Measurement tool
  const [measurements, setMeasurements] = useState([]);
  const addMeasurement = () => {
    const newM = {
      id: measurements.length + 1,
      type: 'roof_length',
      value: Math.floor(Math.random() * 50) + 20,
      unit: 'feet',
      timestamp: new Date().toLocaleString()
    };
    setMeasurements([...measurements, newM]);
  };

  // Notes
  const [notes, setNotes] = useState('');

  // Camera & Tools tab
  const CameraTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Camera className="mr-2" />
          Camera Inspection Tool
        </h3>
        <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '300px' }}>
          <video
            ref={videoRef}
            autoPlay playsInline
            className="w-full h-full object-cover"
            style={{ display: cameraActive ? 'block' : 'none' }}
          />
          {!cameraActive && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center opacity-50">
                <Camera size={48} />
                <p>Camera not active</p>
              </div>
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
        <div className="flex space-x-2">
          {!cameraActive ? (
            <button
              onClick={startCamera}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Start Camera
            </button>
          ) : (
            <>
              <button onClick={capturePhoto} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Capture Photo
              </button>
              <button onClick={stopCamera} className="bg-red-600 text-white px-4 py-2 rounded-lg">
                Stop Camera
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Ruler className="mr-2" />
          Measurement Tools
        </h3>
        <button
          onClick={addMeasurement}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="mr-2" size={16} />
          Add Measurement
        </button>
        {measurements.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium">Recent Measurements:</h4>
            {measurements.map(m => (
              <div key={m.id} className="bg-gray-50 p-3 rounded border">
                <div className="flex justify-between">
                  <span className="font-medium">{m.type.replace('_',' ')}</span>
                  <span className="text-blue-600">{m.value} {m.unit}</span>
                </div>
                <div className="text-sm text-gray-500">{m.timestamp}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="mr-2" />
          Inspection Notes
        </h3>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Enter inspection notes…"
          className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Save className="mr-2" size={16} />
          Save Notes
        </button>
      </div>
    </div>
  );

  // Field Checklist tab
  const ChecklistTab = () => {
    const completedItems   = checklistItems.filter(i => i.checked).length;
    const totalRequired    = checklistItems.filter(i => i.required).length;
    const completedRequired= checklistItems.filter(i => i.required && i.checked).length;
    const categories       = Array.from(new Set(checklistItems.map(i=>i.category)));

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Field Inspection Checklist</h3>
            <div className="text-sm">
              <span className="text-green-600">{completedRequired}/{totalRequired} Required</span>
              <span className="mx-2">•</span>
              <span className="text-blue-600">{completedItems}/{checklistItems.length} Total</span>
            </div>
          </div>

          {categories.map(cat => (
            <div key={cat} className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3 pb-2 border-b flex items-center">
                {cat==='Roof' && '🏠'}
                {cat==='Exterior' && '🏘️'}
                {cat==='Documentation' && '📸'}
                <span className="ml-2">{cat}</span>
              </h4>
              <div className="space-y-3">
                {checklistItems
                  .filter(i=>i.category===cat)
                  .map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={()=>toggleChecklistItem(item.id)}
                          className="w-5 h-5"
                        />
                        <span className={item.checked ? 'line-through text-gray-500' : ''}>
                          {item.required && '⭐'} {item.item}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.photos>0 && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            {item.photos} photo{item.photos>1?'s':''}
                          </span>
                        )}
                        <button
                          onClick={()=>addPhoto(item.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center"
                        >
                          <Camera size={14} className="mr-1" /> Photo
                        </button>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Switch between tabs
  const renderInspectionContent = () =>
    inspectionTab === 'camera' ? <CameraTab/> : <ChecklistTab/>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 flex space-x-2">
        <button
          onClick={()=>setInspectionTab('camera')}
          className={inspectionTab==='camera' ? 'bg-blue-600 text-white' : ''}
        >
          Camera & Tools
        </button>
        <button
          onClick={()=>setInspectionTab('checklist')}
          className={inspectionTab==='checklist' ? 'bg-blue-600 text-white' : ''}
        >
          Field Checklist
        </button>
      </div>
      {renderInspectionContent()}
    </div>
  );
};

export default InspectionTool;
