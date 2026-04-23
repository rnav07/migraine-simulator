import { useState, useEffect } from 'react';
import VisualSnow from './components/VisualSnow';
import Floaters from './components/Floaters';
import AudioEngine from './components/AudioEngine';
import './index.css';

function App() {
  const [started, setStarted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Symptom States
  const [symptoms, setSymptoms] = useState({
    aura: true,
    throbbing: true,
    lightSensitivity: true,
    soundSensitivity: true,
    cognitiveFog: true,
    nausea: true
  });

  const toggleSymptom = (key: keyof typeof symptoms) => {
    setSymptoms(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Effect for Cognitive Fog (random blur changes)
  useEffect(() => {
    if (!started || !symptoms.cognitiveFog) {
      document.documentElement.style.setProperty('--fog-blur', '0px');
      return;
    }

    const fogInterval = setInterval(() => {
      // Randomly blur between 1px and 4px
      const blurAmount = Math.random() > 0.4 ? Math.random() * 3 + 1 : 0;
      document.documentElement.style.setProperty('--fog-blur', `${blurAmount}px`);
    }, 3000);

    return () => clearInterval(fogInterval);
  }, [started, symptoms.cognitiveFog]);

  // Effect to handle pausing/resuming speech when sound sensitivity is toggled
  useEffect(() => {
    if (!started) return;
    const audioEl = document.getElementById('bg-speech') as HTMLAudioElement;
    if (audioEl) {
      audioEl.volume = 0.10; // Adjusted volume to 10%
      if (!symptoms.soundSensitivity) {
        audioEl.pause();
      } else {
        audioEl.play().catch(() => {});
      }
    }
  }, [symptoms.soundSensitivity, started]);

  // Apply CSS classes to body based on symptoms
  useEffect(() => {
    if (!started) return;
    
    document.body.className = '';
    if (symptoms.throbbing) document.body.classList.add('sim-throbbing');
    if (symptoms.lightSensitivity) document.body.classList.add('sim-light-sensitivity');
    if (symptoms.cognitiveFog) document.body.classList.add('sim-fog');
    if (symptoms.nausea) document.body.classList.add('sim-nausea');
    
    return () => {
      document.body.className = '';
    };
  }, [started, symptoms]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  if (!started) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="card" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Migraine Experience</h1>
          <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: 'var(--text-color)', opacity: 0.8 }}>
            This is an interactive simulation designed to convey what it feels like to experience a severe migraine. 
            <br/><br/>
            <strong>Warning:</strong> This simulation includes flashing lights, visual noise, distorted audio, and effects that may cause motion sickness.
          </p>
          <button className="btn-primary" onClick={() => setStarted(true)}>
            Start Simulation
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Background Speech Audio */}
      <audio id="bg-speech" loop>
        <source src={`${import.meta.env.BASE_URL}voice.m4a`} type="audio/mp4" />
      </audio>

      {/* Symptom Overlays (Outside transformed container to maintain true fixed position) */}
      <VisualSnow active={symptoms.aura} />
      <Floaters active={symptoms.aura} />
      {symptoms.throbbing && <div className="pulsing-overlay" />}
      {symptoms.lightSensitivity && (
        <div className="glare-overlay">
          <div className="flash-effect" style={{ width: '100%', height: '100%', background: 'white' }} />
        </div>
      )}
      <AudioEngine active={symptoms.soundSensitivity} />

      <div className="app-container">
        {/* Main Content */}
      <div className="content-wrapper">
        <div className="hero">
          <h1 className="fog-text">Understanding My Migraines</h1>
          <p className="fog-text">
            A first-person perspective into the sensory overload and physical toll of my chronic migraines.
          </p>
        </div>

        <div className="card">
          <h2 className="fog-text" style={{ marginBottom: '1rem' }}>The Aura (24/7)</h2>
          <p className="fog-text" style={{ marginBottom: '1rem' }}>
            I experience visual disturbances 24/7. This includes constant visual snow (like static on an old TV) and floaters that drift across my vision. It never fully goes away.
          </p>
          
          <h2 className="fog-text" style={{ marginBottom: '1rem', marginTop: '2rem' }}>The Pain</h2>
          <p className="fog-text" style={{ marginBottom: '1rem' }}>
            When a severe migraine hits, the pain is intense, throbbing, and pulsating. It is almost always concentrated on one side of my head, beating in time with my pulse.
          </p>

          <h2 className="fog-text" style={{ marginBottom: '1rem', marginTop: '2rem' }}>Sensory Overload</h2>
          <p className="fog-text" style={{ marginBottom: '1rem' }}>
            Light and sound become physically painful. Normal room lighting feels like staring into the sun (photophobia). Sounds become distorted—sometimes it feels like my ears are hearing a lower frequency, a constant uncomfortable rumbling.
          </p>

          <h2 className="fog-text" style={{ marginBottom: '1rem', marginTop: '2rem' }}>Cognitive Fog & Nausea</h2>
          <p className="fog-text">
            It becomes incredibly difficult to think straight. Words blur together, and holding a thought feels impossible. This is often accompanied by deep nausea, making the world feel like it's slightly swaying.
          </p>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="controls-panel">
        <div className="controls-header">
          <h3>Simulation Controls</h3>
        </div>
        
        <div className="symptom-toggle">
          <span>Dark Mode (Relief)</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="symptom-toggle">
          <span>Visual Aura (Snow & Floaters)</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={symptoms.aura} onChange={() => toggleSymptom('aura')} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="symptom-toggle">
          <span>Throbbing Pain (One-Sided)</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={symptoms.throbbing} onChange={() => toggleSymptom('throbbing')} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="symptom-toggle">
          <span>Light Sensitivity</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={symptoms.lightSensitivity} onChange={() => toggleSymptom('lightSensitivity')} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="symptom-toggle">
          <span>Sound Sensitivity</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={symptoms.soundSensitivity} onChange={() => toggleSymptom('soundSensitivity')} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="symptom-toggle">
          <span>Cognitive Fog</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={symptoms.cognitiveFog} onChange={() => toggleSymptom('cognitiveFog')} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="symptom-toggle">
          <span>Nausea (Swaying)</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={symptoms.nausea} onChange={() => toggleSymptom('nausea')} />
            <span className="slider"></span>
          </label>
        </div>

      </div>
    </div>
    </>
  );
}

export default App;
