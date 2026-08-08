import { useState, useRef, useEffect } from 'react';

export default function CallRecorder({ onSave, onDelete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [saved, setSaved] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(recordingTimerRef.current);
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedUrl(URL.createObjectURL(blob));
        setSaved(false);
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch {
      alert('Microphone access denied. Please allow microphone permission to record the call.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    clearInterval(recordingTimerRef.current);
  };

  const discardRecording = () => {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedUrl(null);
    setRecordingTime(0);
    setSaved(false);
  };

  const saveRecording = () => {
    if (!recordedUrl || saved) return;
    onSave(recordingTime);
    setSaved(true);
  };

  return (
    <div style={{ padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-elevated)', border: isRecording ? '2px solid #f87171' : '2px solid var(--line)' }}>
      {!isRecording && !recordedUrl && (
        <button className="btn btn-emergency btn-sm" onClick={startRecording} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>🎙️</span> Record Astrologer's Voice
        </button>
      )}
      {isRecording && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#f87171', animation: 'pulse 1s infinite' }} />
          <span style={{ fontWeight: 600, color: '#f87171', fontSize: '0.9rem' }}>Recording call...</span>
          <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {String(Math.floor(recordingTime / 60)).padStart(2, '0')}:{String(recordingTime % 60).padStart(2, '0')}
          </span>
          <button className="btn btn-sm" onClick={stopRecording} style={{ background: '#f87171', color: '#fff', marginLeft: 'auto' }}>⏹ Stop</button>
        </div>
      )}
      {recordedUrl && !isRecording && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem' }}>✅</span>
            <span style={{ fontWeight: 600, color: '#4ade80', fontSize: '0.85rem' }}>Recording captured</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ({String(Math.floor(recordingTime / 60)).padStart(2, '0')}:{String(recordingTime % 60).padStart(2, '0')})
            </span>
            {saved && <span className="tag tag-green" style={{ marginLeft: 'auto' }}>Saved</span>}
          </div>
          <audio controls src={recordedUrl} style={{ width: '100%', height: 36, marginBottom: '0.5rem' }} />
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {!saved && <button className="btn btn-sm btn-emergency" onClick={saveRecording}>💾 Save Recording</button>}
            <button className="btn btn-sm btn-secondary" onClick={startRecording}>🔄 Re-record</button>
            <button className="btn btn-sm btn-danger" onClick={discardRecording}>🗑 Discard</button>
          </div>
        </div>
      )}
    </div>
  );
}
