import React, { useState } from 'react';
import { useAppState, AppStateProvider } from './context/AppState';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import MenuDrawer from './components/MenuDrawer';
import { 
  Trophy, Search, MapPin, Calendar, CreditCard, ChevronRight, ShieldAlert, 
  Map, Award, User, Star, Plus, Phone, Users, Clock, AlertTriangle, Play, CheckCircle, Trash2, Layers, Gamepad2, Monitor, Zap, Camera
} from 'lucide-react';

const SPORTS_WITH_CAPTAINS = ['Cricket', 'Box Cricket', 'Football', 'Basketball', 'Volleyball', 'Hockey', 'Ice Hockey'];
const REGISTERABLE_SPORTS = [
  'Box Cricket',
  'Cricket',
  'Football',
  'Basketball',
  'Volleyball',
  'Pickleball',
  'Golf',
  'Hockey',
  'Ice Hockey',
  'Skating',
  'Badminton',
  'Tennis',
  'Snooker'
];

const API_BASE = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001'
    : '');

function CustomModal() {
  const { modalState } = useAppState();
  const [inputValue, setInputValue] = useState('');

  // Sync internal state when modal defaultValue changes
  React.useEffect(() => {
    if (modalState.isOpen && modalState.type === 'prompt') {
      setInputValue(modalState.defaultValue || '');
    }
  }, [modalState.isOpen, modalState.defaultValue, modalState.type]);

  if (!modalState.isOpen) return null;

  const isError = modalState.type === 'error';

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      zIndex: 20000
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: isError ? '1px solid #DC2626' : '1px solid rgba(15, 23, 42, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        {/* Title */}
        <h3 style={{
          color: isError ? '#DC2626' : 'var(--text-primary)',
          fontSize: '1.25rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          textTransform: 'uppercase',
          borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
          paddingBottom: 8,
          marginTop: 0
        }}>
          {isError ? '⚠️ ERROR' : modalState.title || 'Notification'}
        </h3>

        {/* Message */}
        <p style={{
          color: isError ? '#DC2626' : 'var(--text-secondary)',
          fontSize: '0.9rem',
          lineHeight: '1.4',
          margin: 0,
          fontWeight: isError ? '600' : 'normal'
        }}>
          {modalState.message}
        </p>

        {/* Input for prompts */}
        {modalState.type === 'prompt' && (
          <input
            type="text"
            className="form-input"
            placeholder={modalState.placeholder}
            value={inputValue}
            maxLength={100}
            onChange={(e) => setInputValue(e.target.value)}
            style={{
              borderColor: 'var(--primary)',
              marginTop: 4
            }}
            autoFocus
          />
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginTop: 8
        }}>
          {(modalState.type === 'confirm' || modalState.type === 'prompt') && (
            <button
              onClick={() => modalState.onCancel && modalState.onCancel()}
              className="btn-outlined"
              style={{ flex: 1, textTransform: 'uppercase', height: 42 }}
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => {
              if (modalState.type === 'prompt') {
                modalState.onConfirm && modalState.onConfirm(inputValue);
              } else {
                modalState.onConfirm && modalState.onConfirm();
              }
            }}
            className="btn-neon"
            style={{
              flex: 1,
              backgroundColor: isError ? '#DC2626' : 'var(--primary)',
              color: "var(--text-primary)",
              boxShadow: isError ? '0 4px 12px rgba(220, 38, 38, 0.2)' : 'var(--primary-glow)',
              fontSize: '1rem',
              padding: '10px 16px',
              height: 42
            }}
          >
            {modalState.type === 'confirm' ? 'Confirm' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PermissionModal() {
  const { permissions, setPermissions } = useAppState();

  if (permissions.asked) return null;

  const togglePermission = (type) => {
    setPermissions(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleContinue = () => {
    setPermissions(prev => ({
      ...prev,
      asked: true
    }));
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      zIndex: 9998
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(15, 23, 42, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        <h3 style={{
          color: 'var(--text-primary)',
          fontSize: '1.25rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          textTransform: 'uppercase',
          borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
          paddingBottom: 8,
          marginTop: 0
        }}>
          🛡️ APP PERMISSIONS
        </h3>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
          lineHeight: '1.4',
          margin: 0
        }}>
          To deliver the best Playfinity experience, please allow the following permissions:
        </p>

        <div style={{display: 'flex', flexDirection: 'column', gap: 12, margin: '8px 0'}}>
          {/* Notifications */}
          <div className={`sporty-card ${permissions.notifications ? 'glow-green' : ''}`} style={styles.permissionCard}>
            <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
              <span style={{fontSize: '1.25rem'}}>🔔</span>
              <div style={{flex: 1}}>
                <h4 style={{fontSize: '0.85rem', color: "var(--text-primary)"}}>Match Live Alerts</h4>
                <p style={{fontSize: '0.7rem', color: 'var(--text-muted)'}}>Notify when box scores changes</p>
              </div>
            </div>
            <button 
              onClick={() => togglePermission('notifications')} 
              className={permissions.notifications ? "btn-neon" : "btn-outlined"} 
              style={{padding: '4px 10px', fontSize: '0.75rem', width: 'auto', minWidth: 80}}
            >
              {permissions.notifications ? 'ALLOWED' : 'ALLOW'}
            </button>
          </div>

          {/* Location */}
          <div className={`sporty-card ${permissions.location ? 'glow-green' : ''}`} style={styles.permissionCard}>
            <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
              <span style={{fontSize: '1.25rem'}}>📍</span>
              <div style={{flex: 1}}>
                <h4 style={{fontSize: '0.85rem', color: "var(--text-primary)"}}>Nearby Arenas</h4>
                <p style={{fontSize: '0.7rem', color: 'var(--text-muted)'}}>Used to display closest boxes</p>
              </div>
            </div>
            <button 
              onClick={() => togglePermission('location')} 
              className={permissions.location ? "btn-neon" : "btn-outlined"} 
              style={{padding: '4px 10px', fontSize: '0.75rem', width: 'auto', minWidth: 80}}
            >
              {permissions.location ? 'ALLOWED' : 'ALLOW'}
            </button>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="btn-neon"
          style={{
            width: '100%',
            backgroundColor: 'var(--primary)',
            color: "#FFFFFF",
            boxShadow: 'var(--primary-glow)',
            fontSize: '1rem',
            padding: '10px 16px',
            height: 42,
            marginTop: 8
          }}
        >
          CONTINUE ⚡
        </button>
      </div>
    </div>
  );
}

function PhoneOnboardingModal() {
  const { 
    userRole, userPhone, userName, updateProfileOnBackend,
    logoutUser, checkUsernameUnique, showError, showAlert 
  } = useAppState();

  const [usernameVal, setUsernameVal] = useState(userName ? userName.replace(/\s+/g, '_') : '');
  const [usernameError, setUsernameError] = useState('');
  const [phoneVal, setPhoneVal] = useState(userPhone || '');
  const [caretakerVal, setCaretakerVal] = useState(localStorage.getItem('bcp_caretaker_phone') || '');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUsernameBlur = async () => {
    const trimmed = usernameVal.trim();
    if (!trimmed || trimmed.length < 3) return;
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setUsernameError('Only letters, numbers and underscores allowed.');
      return;
    }
    try {
      const isUnique = await checkUsernameUnique(trimmed);
      if (!isUnique) {
        setUsernameError('This username is already taken.');
      } else {
        setUsernameError('');
      }
    } catch {
      // silently ignore network errors on blur
    }
  };

  const handlePhoneBlur = async () => {
    if (!phoneVal.trim() || phoneVal.trim().length < 6) return;
    try {
      const res = await fetch(`${API_BASE}/api/auth/check-phone?phone=${encodeURIComponent(phoneVal.trim())}`);
      const data = await res.json();
      if (data.taken && phoneVal.trim() !== (userPhone || '')) {
        setPhoneError('This phone number is already registered.');
      } else {
        setPhoneError('');
      }
    } catch {
      // silently ignore network errors on blur
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setPhoneError('');
    setUsernameError('');
    
    const trimmedUser = usernameVal.trim();
    const trimmedPhone = phoneVal.trim();

    // Username validations
    if (!trimmedUser) {
      setUsernameError('Please enter a username.');
      return;
    }
    if (trimmedUser.length < 3) {
      setUsernameError('Username must be at least 3 characters.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUser)) {
      setUsernameError('Only letters, numbers and underscores allowed.');
      return;
    }

    // Phone validations
    if (!trimmedPhone) {
      setPhoneError('Please enter your phone number.');
      return;
    }
    if (!/^[0-9+ ]{8,15}$/.test(trimmedPhone)) {
      setPhoneError('Please enter a valid phone number (8–15 digits).');
      return;
    }
    if (userRole === 'admin' && !caretakerVal.trim()) {
      showError('Validation Error', 'Please enter the caretaker phone number.');
      return;
    }

    setLoading(true);
    try {
      // Check username uniqueness if it changed
      if (trimmedUser.toLowerCase() !== (userName || '').toLowerCase()) {
        const isUnique = await checkUsernameUnique(trimmedUser);
        if (!isUnique) {
          setUsernameError('This username is already taken by another user.');
          setLoading(false);
          return;
        }
      }

      // Check phone uniqueness if it changed
      if (trimmedPhone !== (userPhone || '')) {
        const checkRes = await fetch(`${API_BASE}/api/auth/check-phone?phone=${encodeURIComponent(trimmedPhone)}`);
        const checkData = await checkRes.json();
        if (checkData.taken) {
          setPhoneError('This phone number is already registered.');
          setLoading(false);
          return;
        }
      }

      // Update profile on backend
      await updateProfileOnBackend(trimmedUser, trimmedPhone);
      
      if (userRole === 'admin') {
        localStorage.setItem('bcp_owner_phone', trimmedPhone);
        localStorage.setItem('bcp_caretaker_phone', caretakerVal.trim());
      }
      await showAlert('Success 🎉', 'Profile details saved successfully.');
    } catch (err) {
      showError('Failed to Save', err.message || 'Could not save profile details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(15, 23, 42, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        <h3 style={{
          color: 'var(--text-primary)',
          fontSize: '1.25rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          textTransform: 'uppercase',
          borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
          paddingBottom: 8,
          marginTop: 0
        }}>
          📱 COMPLETE PROFILE
        </h3>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
          lineHeight: '1.4',
          margin: 0
        }}>
          Please provide a username and the required contact number(s) to finish setting up your account:
        </p>

        <form onSubmit={handleSave} style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              placeholder="e.g. player_one" 
              className="form-input" 
              value={usernameVal}
              style={usernameError ? { borderColor: '#dc143c' } : {}}
              onChange={e => { setUsernameVal(e.target.value); setUsernameError(''); }}
              onBlur={handleUsernameBlur}
              required
            />
            {usernameError && (
              <p style={{
                color: '#dc143c',
                fontSize: '0.78rem',
                fontWeight: 600,
                marginTop: 5,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 4
              }}>
                ⚠ {usernameError}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">{userRole === 'admin' ? 'Owner Phone Number' : 'Your Phone Number'}</label>
            <input 
              type="tel" 
              placeholder="e.g. 9876543210" 
              className="form-input" 
              value={phoneVal}
              maxLength={15}
              style={phoneError ? { borderColor: '#dc143c' } : {}}
              onChange={e => { setPhoneVal(e.target.value); setPhoneError(''); }}
              onBlur={handlePhoneBlur}
              required
            />
            {phoneError && (
              <p style={{
                color: '#dc143c',
                fontSize: '0.78rem',
                fontWeight: 600,
                marginTop: 5,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 4
              }}>
                ⚠ {phoneError}
              </p>
            )}
          </div>

          {userRole === 'admin' && (
            <div className="form-group">
              <label className="form-label">Caretaker Phone Number</label>
              <input 
                type="tel" 
                placeholder="e.g. 9876543210" 
                className="form-input" 
                value={caretakerVal}
                maxLength={15}
                onChange={e => setCaretakerVal(e.target.value)}
                required
              />
            </div>
          )}

          <div style={{display: 'flex', gap: 10, marginTop: 8}}>
            <button
              type="button"
              onClick={logoutUser}
              style={{
                flex: 1, padding: '12px 0', borderRadius: 8,
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem'
              }}
              disabled={loading}
            >
              Back
            </button>
            <button 
              type="submit" 
              className="btn-neon" 
              style={{
                flex: 2, 
                padding: '12px 0', 
                fontSize: '1rem', 
                fontWeight: 'bold',
                background: 'var(--primary)',
                color: '#fff',
                boxShadow: 'var(--primary-glow)'
              }} 
              disabled={loading}
            >
              {loading ? 'SAVING...' : 'SAVE DETAILS ⚡'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const SPORT_POSITIONS = {
  'Box Cricket': [
    { id: 'Batting', label: '🏏 Batting (Batter)' },
    { id: 'Bowling', label: '⚾ Bowling (Bowler)' },
    { id: 'Wicketkeeping', label: '🧤 Wicketkeeping' },
    { id: 'Fielding', label: '🛡️ Fielding (Fielder)' },
    { id: 'All Rounder', label: '⚡ All Rounder' }
  ],
  'Football': [
    { id: 'Goalkeeper', label: '🥅 Goalkeeper' },
    { id: 'Striker', label: '⚽ Striker' },
    { id: 'Midfielder', label: '🏃 Midfielder' },
    { id: 'Defender', label: '🛡️ Defender' },
    { id: 'Winger', label: '⚡ Winger' },
    { id: 'Centre-Back', label: '🧱 Centre-Back' }
  ],
  'Badminton': [
    { id: 'Singles Player', label: '🏸 Singles Player' },
    { id: 'Doubles Player', label: '👥 Doubles Player' },
    { id: 'Mixed Doubles', label: '🔀 Mixed Doubles' }
  ],
  'Tennis': [
    { id: 'Singles Player', label: '🎾 Singles Player' },
    { id: 'Doubles Player', label: '👥 Doubles Player' },
    { id: 'Mixed Doubles', label: '🔀 Mixed Doubles' }
  ],
  'Table Tennis': [
    { id: 'Singles', label: '🏓 Singles' },
    { id: 'Doubles', label: '👥 Doubles' },
    { id: 'Coach', label: '📋 Coach' }
  ],
  'Snooker': [
    { id: 'Competitive Player', label: '🎱 Competitive' },
    { id: 'Casual Player', label: '✨ Casual' }
  ],
  'Pool': [
    { id: 'Competitive Player', label: '🔵 Competitive' },
    { id: 'Casual Player', label: '✨ Casual' }
  ],
  'Basketball': [
    { id: 'Point Guard', label: '🏀 Point Guard' },
    { id: 'Shooting Guard', label: '🎯 Shooting Guard' },
    { id: 'Small Forward', label: '🏃 Small Forward' },
    { id: 'Power Forward', label: '💪 Power Forward' },
    { id: 'Center', label: '🧍 Center' }
  ],
  'Volleyball': [
    { id: 'Setter', label: '🏐 Setter' },
    { id: 'Libero', label: '🛡️ Libero' },
    { id: 'Outside Hitter', label: '💥 Outside Hitter' },
    { id: 'Middle Blocker', label: '🧱 Middle Blocker' },
    { id: 'Opposite Hitter', label: '⚡ Opposite Hitter' }
  ],
  'Pickleball': [
    { id: 'Singles Player', label: '🎾 Singles Player' },
    { id: 'Doubles Player', label: '👥 Doubles Player' },
    { id: 'Mixed Doubles', label: '👫 Mixed Doubles' }
  ],
  'Golf': [
    { id: 'Golfer', label: '🏌️ Golfer' },
    { id: 'Caddy', label: '🎒 Caddy' }
  ],
  'Hockey': [
    { id: 'Goalkeeper', label: '🧤 Goalkeeper' },
    { id: 'Defender', label: '🛡️ Defender' },
    { id: 'Midfielder', label: '🏃 Midfielder' },
    { id: 'Forward', label: '🎯 Forward' }
  ],
  'Ice Hockey': [
    { id: 'Goaltender', label: '🥅 Goaltender' },
    { id: 'Defenseman', label: '🛡️ Defenseman' },
    { id: 'Winger', label: '⚡ Winger' },
    { id: 'Center', label: '🏒 Center' }
  ],
  'Skating': [
    { id: 'Speed Skater', label: '⚡ Speed Skater' },
    { id: 'Figure Skater', label: '💃 Figure Skater' },
    { id: 'Roller Skater', label: '🛼 Roller Skater' }
  ],
  'Gaming': [
    { id: 'Pro Gamer', label: '🎮 Pro Gamer' },
    { id: 'Casual Gamer', label: '✨ Casual Gamer' },
    { id: 'Streamer', label: '🎥 Streamer' },
    { id: 'In-Game Leader', label: '👑 In-Game Leader' }
  ]
};

function SportSpecialtiesModal({ onClose }) {
  const { playerSportsInterests, playerSpecialties, updateSpecialtiesOnBackend, showError } = useAppState();
  const [currentSportIdx, setCurrentSportIdx] = useState(0);
  const [tempSpecialties, setTempSpecialties] = useState({ ...playerSpecialties });
  const [selected, setSelected] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Active sports list
  const activeSports = playerSportsInterests.length > 0 ? playerSportsInterests : ['Box Cricket'];
  const currentSport = activeSports[currentSportIdx];
  const positions = SPORT_POSITIONS[currentSport] || [];

  // Update selection when sport index changes
  React.useEffect(() => {
    if (currentSport) {
      setSelected(tempSpecialties[currentSport] || '');
    }
  }, [currentSportIdx, currentSport]);

  const handleNext = async () => {
    // Save current selection locally
    const updated = { ...tempSpecialties, [currentSport]: selected };
    setTempSpecialties(updated);

    if (currentSportIdx < activeSports.length - 1) {
      setCurrentSportIdx(prev => prev + 1);
    } else {
      // Save all to backend
      setSubmitting(true);
      try {
        await updateSpecialtiesOnBackend(updated);
        if (onClose) onClose();
      } catch (e) {
        await showError('Error', 'Failed to save roles: ' + e.message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentSportIdx > 0) {
      setCurrentSportIdx(prev => prev - 1);
    }
  };

  if (!currentSport) return null;

  const sportColor = ALL_SPORTS.find(s => s.id === currentSport)?.color || '#AAFF00';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      backgroundColor: 'rgba(6, 7, 9, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24
    }}>
      <div className="sporty-card glow-green" style={{
        backgroundColor: 'var(--bg-surface-solid)',
        border: `2px solid ${sportColor}`,
        borderRadius: 16, padding: 24, width: '100%', maxWidth: 400,
        boxShadow: `0 8px 32px ${sportColor}33`
      }}>
        <div style={{textAlign: 'center', marginBottom: 20}}>
          <span style={{fontSize: '2.5rem'}}>{ALL_SPORTS.find(s => s.id === currentSport)?.label.split(' ')[0] || '🏆'}</span>
          <h2 style={{fontSize: '1.5rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 8}}>
            Role in {currentSport}
          </h2>
          <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4}}>
            Step {currentSportIdx + 1} of {activeSports.length}: Select position/role
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8,
          maxHeight: 280, overflowY: 'auto', paddingRight: 4, marginBottom: 20
        }}>
          {positions.map(opt => {
            const isSelected = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                style={{
                  padding: '12px 10px',
                  background: isSelected ? `${sportColor}22` : 'var(--bg-secondary)',
                  border: isSelected ? `1.5px solid ${sportColor}` : '1px solid var(--border-light)',
                  borderRadius: 8,
                  color: isSelected ? sportColor : 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div style={{display: 'flex', gap: 10}}>
          {currentSportIdx > 0 ? (
            <button
              onClick={handleBack}
              style={{
                flex: 1, padding: '12px 0', borderRadius: 8,
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem'
              }}
              disabled={submitting}
            >
              Back
            </button>
          ) : (
            onClose && (
              <button
                onClick={onClose}
                style={{
                  flex: 1, padding: '12px 0', borderRadius: 8,
                  border: '1px solid var(--border)', background: 'transparent',
                  color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem'
                }}
                disabled={submitting}
              >
                Cancel
              </button>
            )
          )}
          <button
            onClick={handleNext}
            disabled={!selected || submitting}
            className="btn-neon"
            style={{
              flex: (currentSportIdx > 0 || onClose) ? 2 : 1, 
              padding: '12px 0', 
              fontSize: '1rem', 
              fontWeight: 'bold',
              background: sportColor,
              color: '#000',
              boxShadow: `0 0 12px ${sportColor}66`
            }}
          >
            {submitting ? 'SAVING...' : (currentSportIdx < activeSports.length - 1 ? 'NEXT ⚡' : 'CONFIRM ROLES ⚡')}
          </button>
        </div>
      </div>
    </div>
  );
}

const ALL_SPORTS = [
  { id: 'Box Cricket', label: '🏏 Box Cricket', color: '#AAFF00' },
  { id: 'Football', label: '⚽ Football', color: '#22d3ee' },
  { id: 'Badminton', label: '🏸 Badminton', color: '#f59e0b' },
  { id: 'Tennis', label: '🎾 Tennis', color: '#84cc16' },
  { id: 'Table Tennis', label: '🏓 Table Tennis', color: '#a78bfa' },
  { id: 'Snooker', label: '🎱 Snooker', color: '#34d399' },
  { id: 'Pool', label: '🔵 Pool', color: '#60a5fa' },
  { id: 'Basketball', label: '🏀 Basketball', color: '#fb923c' },
  { id: 'Volleyball', label: '🏐 Volleyball', color: '#f87171' },
  { id: 'Pickleball', label: '🏓 Pickleball', color: '#ec4899' },
  { id: 'Golf', label: '⛳ Golf', color: '#10b981' },
  { id: 'Hockey', label: '🏑 Hockey', color: '#3b82f6' },
  { id: 'Ice Hockey', label: '🏒 Ice Hockey', color: '#06b6d4' },
  { id: 'Skating', label: '🛼 Skating', color: '#8b5cf6' },
  { id: 'Gaming', label: '🎮 Gaming', color: '#a855f7' }
];

function SportsInterestModal({ onClose }) {
  const { playerSportsInterests, updateSportsInterestsOnBackend, showError } = useAppState();
  const [selected, setSelected] = useState(playerSportsInterests || []);
  const [submitting, setSubmitting] = useState(false);

  const toggle = (sportId) => {
    setSelected(prev =>
      prev.includes(sportId) ? prev.filter(s => s !== sportId) : [...prev, sportId]
    );
  };

  const handleSave = async () => {
    if (selected.length === 0) {
      await showError('Select Sports', 'Please select at least one sport you are interested in!');
      return;
    }
    setSubmitting(true);
    try {
      await updateSportsInterestsOnBackend(selected);
      if (onClose) onClose();
    } catch (e) {
      await showError('Error', 'Failed to save sports interests: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9997,
      backgroundColor: 'rgba(6, 7, 9, 0.88)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface-solid)',
        border: '2px solid var(--primary)',
        borderRadius: 20, padding: 24, width: '100%', maxWidth: 420,
        boxShadow: '0 8px 40px rgba(170, 255, 0, 0.18)'
      }}>
        <div style={{textAlign: 'center', marginBottom: 20}}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              overflow: 'hidden',
              border: '1px solid var(--border-light)',
              backgroundColor: '#efeff4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.04)'
            }}>
              <img src="/logo2.png" alt="SportSpot Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </div>
          <h2 style={{
            fontSize: '1.5rem', color: 'var(--text-primary)',
            fontFamily: 'var(--font-condensed)', textTransform: 'uppercase',
            letterSpacing: 2, marginTop: 10, marginBottom: 4
          }}>
            Pick Your Sports
          </h2>
          <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5}}>
            Select the sports you love. We'll filter venues for you automatically — you can always change this later.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
          marginBottom: 20, maxHeight: 280, overflowY: 'auto'
        }}>
          {ALL_SPORTS.map(sport => {
            const isSelected = selected.includes(sport.id);
            return (
              <button
                key={sport.id}
                onClick={() => toggle(sport.id)}
                style={{
                  padding: '12px 6px',
                  background: isSelected ? `rgba(${sport.color === '#AAFF00' ? '170,255,0' : sport.color === '#22d3ee' ? '34,211,238' : sport.color === '#f59e0b' ? '245,158,11' : sport.color === '#84cc16' ? '132,204,22' : sport.color === '#a78bfa' ? '167,139,250' : sport.color === '#34d399' ? '52,211,153' : sport.color === '#60a5fa' ? '96,165,250' : sport.color === '#fb923c' ? '251,146,60' : '248,113,113'}, 0.15)` : 'var(--bg-secondary)',
                  border: isSelected ? `1.5px solid ${sport.color}` : '1px solid var(--border-light)',
                  borderRadius: 10,
                  color: isSelected ? sport.color : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 700 : 400,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  lineHeight: 1.4,
                  transform: isSelected ? 'scale(1.04)' : 'scale(1)'
                }}
              >
                {sport.label}
              </button>
            );
          })}
        </div>

        <div style={{
          fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600,
          textAlign: 'center', marginBottom: 14
        }}>
          {selected.length} sport{selected.length !== 1 ? 's' : ''} selected
        </div>

        <div style={{display: 'flex', gap: 10}}>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: '12px 0', borderRadius: 8,
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem'
              }}
              disabled={submitting}
            >
              Skip
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={submitting || selected.length === 0}
            className="btn-neon"
            style={{flex: onClose ? 2 : 1, padding: '12px 0', fontSize: '1rem', fontWeight: 'bold'}}
          >
            {submitting ? 'SAVING...' : 'CONFIRM SPORTS ⚡'}
          </button>
        </div>
      </div>
    </div>
  );
}


function PlayerOnboardingFlow({ onClose }) {
  const { 
    permissions, setPermissions,
    playerSportsInterests, updateSportsInterestsOnBackend,
    playerSpecialties, updateSpecialtiesOnBackend,
    showError, showAlert 
  } = useAppState();

  const [wizardStep, setWizardStep] = useState(() => {
    if (!permissions.asked) return 'permissions';
    if (playerSportsInterests.length === 0) return 'sports';
    return 'specialties';
  });

  // Sports interests selection state
  const [selectedSports, setSelectedSports] = useState(playerSportsInterests || []);
  
  // Specialties selection state
  const [currentSportIdx, setCurrentSportIdx] = useState(0);
  const [tempSpecialties, setTempSpecialties] = useState({ ...playerSpecialties });
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const activeSports = selectedSports.length > 0 ? selectedSports : ['Box Cricket'];
  const currentSport = activeSports[currentSportIdx];
  const positions = SPORT_POSITIONS[currentSport] || [];

  // Update selected specialty when sport index changes
  React.useEffect(() => {
    if (currentSport) {
      setSelectedSpecialty(tempSpecialties[currentSport] || '');
    }
  }, [currentSportIdx, currentSport]);

  const handlePermissionsContinue = () => {
    setPermissions(prev => ({ ...prev, asked: true }));
    setWizardStep('sports');
  };

  const handleSportsSave = async () => {
    if (selectedSports.length === 0) {
      await showError('Select Sports', 'Please select at least one sport you are interested in!');
      return;
    }
    setSubmitting(true);
    try {
      await updateSportsInterestsOnBackend(selectedSports);
      // Move to specialties
      setWizardStep('specialties');
      setCurrentSportIdx(0);
    } catch (e) {
      await showError('Error', 'Failed to save sports: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSpecialtyNext = async () => {
    const updated = { ...tempSpecialties, [currentSport]: selectedSpecialty };
    setTempSpecialties(updated);

    if (currentSportIdx < activeSports.length - 1) {
      setCurrentSportIdx(prev => prev + 1);
    } else {
      // Complete!
      setSubmitting(true);
      try {
        await updateSpecialtiesOnBackend(updated);
        if (onClose) onClose();
      } catch (e) {
        await showError('Error', 'Failed to save roles: ' + e.message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleSpecialtyBack = () => {
    if (currentSportIdx > 0) {
      setCurrentSportIdx(prev => prev - 1);
    } else {
      // Go back to sports interests
      setWizardStep('sports');
    }
  };

  // Styles and Colors
  const sportColor = ALL_SPORTS.find(s => s.id === currentSport)?.color || '#AAFF00';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9997,
      backgroundColor: 'rgba(6, 7, 9, 0.88)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24
    }}>
      {wizardStep === 'permissions' && (
        <div key="permissions" className="slide-in-right sporty-card glow-green" style={{
          backgroundColor: 'var(--bg-surface-solid)',
          borderRadius: 20, padding: 24, width: '100%', maxWidth: 420,
          boxShadow: '0 8px 40px rgba(170, 255, 0, 0.18)'
        }}>
          <div style={{textAlign: 'center', marginBottom: 20}}>
            <span style={{fontSize: '3rem'}}>📱</span>
            <h2 style={{
              fontSize: '1.5rem', color: 'var(--text-primary)',
              fontFamily: 'var(--font-condensed)', textTransform: 'uppercase',
              letterSpacing: 2, marginTop: 10, marginBottom: 4
            }}>
              App Permissions
            </h2>
            <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5}}>
              To deliver the best SportSpot experience, please allow the following permissions:
            </p>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: 12, margin: '16px 0'}}>
            <div className={`sporty-card ${permissions.notifications ? 'glow-green' : ''}`} style={styles.permissionCard}>
              <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                <span style={{fontSize: '1.25rem'}}>🔔</span>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 'bold', fontSize: '0.85rem', color: "var(--text-primary)"}}>Match Alerts</div>
                  <div style={{fontSize: '0.72rem', color: 'var(--text-muted)'}}>Get real-time scoring notifications</div>
                </div>
              </div>
              <button 
                onClick={() => setPermissions(prev => ({ ...prev, notifications: !prev.notifications }))} 
                className={permissions.notifications ? "btn-neon" : "btn-outlined"} 
                style={{padding: '4px 10px', fontSize: '0.75rem', width: 'auto', minWidth: 80}}
              >
                {permissions.notifications ? 'ALLOWED' : 'ALLOW'}
              </button>
            </div>

            <div className={`sporty-card ${permissions.location ? 'glow-green' : ''}`} style={styles.permissionCard}>
              <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                <span style={{fontSize: '1.25rem'}}>📍</span>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 'bold', fontSize: '0.85rem', color: "var(--text-primary)"}}>Nearby Arenas</div>
                  <div style={{fontSize: '0.72rem', color: 'var(--text-muted)'}}>Sort sports boxes closest to you</div>
                </div>
              </div>
              <button 
                onClick={() => setPermissions(prev => ({ ...prev, location: !prev.location }))} 
                className={permissions.location ? "btn-neon" : "btn-outlined"} 
                style={{padding: '4px 10px', fontSize: '0.75rem', width: 'auto', minWidth: 80}}
              >
                {permissions.location ? 'ALLOWED' : 'ALLOW'}
              </button>
            </div>
          </div>

          <button
            onClick={handlePermissionsContinue}
            className="btn-neon"
            style={{
              width: '100%',
              backgroundColor: 'var(--primary)',
              color: "#FFFFFF",
              boxShadow: 'var(--primary-glow)',
              fontSize: '1rem',
              padding: '10px 16px',
              height: 42,
              marginTop: 8
            }}
          >
            CONTINUE ⚡
          </button>
        </div>
      )}

      {wizardStep === 'sports' && (
        <div key="sports" className="slide-in-right sporty-card glow-green" style={{
          backgroundColor: 'var(--bg-surface-solid)',
          border: '2px solid var(--primary)',
          borderRadius: 20, padding: 24, width: '100%', maxWidth: 420,
          boxShadow: '0 8px 40px rgba(170, 255, 0, 0.18)'
        }}>
          <div style={{textAlign: 'center', marginBottom: 20}}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 14,
                overflow: 'hidden',
                border: '1px solid var(--border-light)',
                backgroundColor: '#efeff4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.04)'
              }}>
                <img src="/logo2.png" alt="SportSpot Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            </div>
            <h2 style={{
              fontSize: '1.5rem', color: 'var(--text-primary)',
              fontFamily: 'var(--font-condensed)', textTransform: 'uppercase',
              letterSpacing: 2, marginTop: 10, marginBottom: 4
            }}>
              Pick Your Sports
            </h2>
            <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5}}>
              Select the sports you love. We'll filter venues for you automatically — you can always change this later.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
            marginBottom: 20, maxHeight: 280, overflowY: 'auto'
          }}>
            {ALL_SPORTS.map(sport => {
              const isSelected = selectedSports.includes(sport.id);
              return (
                <button
                  key={sport.id}
                  onClick={() => setSelectedSports(prev => 
                    prev.includes(sport.id) ? prev.filter(s => s !== sport.id) : [...prev, sport.id]
                  )}
                  style={{
                    padding: '12px 6px',
                    background: isSelected ? `rgba(${sport.color === '#AAFF00' ? '170,255,0' : sport.color === '#22d3ee' ? '34,211,238' : sport.color === '#f59e0b' ? '245,158,11' : sport.color === '#84cc16' ? '132,204,22' : sport.color === '#a78bfa' ? '167,139,250' : sport.color === '#34d399' ? '52,211,153' : sport.color === '#60a5fa' ? '96,165,250' : sport.color === '#fb923c' ? '251,146,60' : '248,113,113'}, 0.15)` : 'var(--bg-secondary)',
                    border: isSelected ? `1.5px solid ${sport.color}` : '1px solid var(--border-light)',
                    borderRadius: 10,
                    color: isSelected ? sport.color : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: isSelected ? 700 : 400,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    lineHeight: 1.4,
                    transform: isSelected ? 'scale(1.04)' : 'scale(1)'
                  }}
                >
                  {sport.label}
                </button>
              );
            })}
          </div>

          <div style={{
            fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600,
            textAlign: 'center', marginBottom: 14
          }}>
            {selectedSports.length} sport{selectedSports.length !== 1 ? 's' : ''} selected
          </div>

          <div style={{display: 'flex', gap: 10}}>
            <button
              onClick={handleSportsSave}
              disabled={submitting || selectedSports.length === 0}
              className="btn-neon"
              style={{width: '100%', padding: '12px 0', fontSize: '1rem', fontWeight: 'bold'}}
            >
              {submitting ? 'SAVING...' : 'CONFIRM SPORTS ⚡'}
            </button>
          </div>
        </div>
      )}

      {wizardStep === 'specialties' && (
        <div key={`specialties-${currentSport}`} className="slide-in-right sporty-card glow-green" style={{
          backgroundColor: 'var(--bg-surface-solid)',
          border: `2px solid ${sportColor}`,
          borderRadius: 16, padding: 24, width: '100%', maxWidth: 400,
          boxShadow: `0 8px 32px ${sportColor}33`
        }}>
          <div style={{textAlign: 'center', marginBottom: 20}}>
            <span style={{fontSize: '2.5rem'}}>{ALL_SPORTS.find(s => s.id === currentSport)?.label.split(' ')[0] || '🏆'}</span>
            <h2 style={{fontSize: '1.5rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 8}}>
              Role in {currentSport}
            </h2>
            <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4}}>
              Step {currentSportIdx + 1} of {activeSports.length}: Select position/role
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8,
            maxHeight: 280, overflowY: 'auto', paddingRight: 4, marginBottom: 20
          }}>
            {positions.map(opt => {
              const isSelected = selectedSpecialty === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedSpecialty(opt.id)}
                  style={{
                    padding: '12px 10px',
                    background: isSelected ? `${sportColor}22` : 'var(--bg-secondary)',
                    border: isSelected ? `1.5px solid ${sportColor}` : '1px solid var(--border-light)',
                    borderRadius: 8,
                    color: isSelected ? sportColor : 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 'bold' : 'normal',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div style={{display: 'flex', gap: 10}}>
            <button
              onClick={handleSpecialtyBack}
              disabled={submitting}
              style={{
                flex: 1, padding: '12px 0', borderRadius: 8,
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem'
              }}
            >
              Back
            </button>
            <button
              onClick={handleSpecialtyNext}
              disabled={!selectedSpecialty || submitting}
              className="btn-neon"
              style={{
                flex: 2, 
                padding: '12px 0', 
                fontSize: '1rem', 
                fontWeight: 'bold',
                background: sportColor,
                color: '#000',
                boxShadow: `0 0 12px ${sportColor}66`
              }}
            >
              {submitting ? 'SAVING...' : (currentSportIdx < activeSports.length - 1 ? 'NEXT ⚡' : 'CONFIRM ROLES ⚡')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


function AppContent() {
  const { 
    currentScreen, 
    setCurrentScreen, 
    userRole, 
    setUserRole, 
    selectedVenueId, 
    permissions, 
    authToken, 
    playerSpecialties, 
    playerSportsInterests,
    venues,
    playerId,
    userPhone,
    setLiveMatch,
    authFetch,
    showAlert,
    showError,
    selectedCompletedMatch,
    showPayModal,
    setShowPayModal,
    isDrawerOpen,
    selectedTournamentId,
    setSelectedTournamentId
  } = useAppState();

  const [showOpeningSplash, setShowOpeningSplash] = React.useState(true);
  const [isSplashExiting, setIsSplashExiting] = React.useState(false);
  const exitTimerRef = React.useRef(null);
  const removeTimerRef = React.useRef(null);

  const handleSkipSplash = () => {
    if (isSplashExiting) return;
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    if (removeTimerRef.current) clearTimeout(removeTimerRef.current);
    
    setIsSplashExiting(true);
    removeTimerRef.current = setTimeout(() => {
      setShowOpeningSplash(false);
    }, 600); // Wait 600ms for exit transition
  };

  React.useEffect(() => {
    // 3.0s loading bar and fade-in animation + 2.0s bright hold time = 5000ms
    exitTimerRef.current = setTimeout(() => {
      setIsSplashExiting(true);
    }, 5000);

    // 5.0s hold + 0.6s exit fade-out transition = 5600ms
    removeTimerRef.current = setTimeout(() => {
      setShowOpeningSplash(false);
    }, 5600);

    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (removeTimerRef.current) clearTimeout(removeTimerRef.current);
    };
  }, []);

  React.useEffect(() => {
    if (authToken && currentScreen === 'splash') {
      if (userRole === 'admin') {
        const owned = venues.filter(v => v.ownerId === playerId);
        if (venues.length > 0) {
          if (owned.length > 0) {
            setCurrentScreen('owner_dashboard');
          } else {
            setCurrentScreen('venue_onboarding');
          }
        } else {
          setCurrentScreen('owner_dashboard');
        }
      } else {
        setCurrentScreen('player_home');
      }
    }
  }, [authToken, userRole, venues, playerId, currentScreen]);

  React.useEffect(() => {
    if (window.Capacitor && authToken) {
      const initPushNotifications = async () => {
        try {
          const { PushNotifications } = await import('@capacitor/push-notifications');
          
          let permStatus = await PushNotifications.checkPermissions();
          if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
          }

          if (permStatus.receive === 'granted') {
            // Register with Apple/Google to receive push notifications
            await PushNotifications.register();

            // Register the device token with our backend
            await PushNotifications.addListener('registration', (token) => {
              console.log('Push registration success, token: ' + token.value);
              authFetch('http://localhost:3001/api/notifications/register', {
                method: 'POST',
                body: JSON.stringify({ token: token.value })
              })
              .then(res => {
                if (res.ok) return res.json();
                throw new Error('Failed to register token');
              })
              .then(data => {
                console.log('FCM token registered successfully:', data);
              })
              .catch(err => {
                console.error('Failed to save FCM token to backend:', err);
              });
            });

            // Handle errors
            await PushNotifications.addListener('registrationError', (error) => {
              console.error('Push registration error: ', JSON.stringify(error));
            });

            // Handle foreground push notification event
            await PushNotifications.addListener('pushNotificationReceived', (notification) => {
              console.log('Push notification received in foreground: ', JSON.stringify(notification));
            });

            // Handle push notification click action
            await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
              console.log('Push notification clicked: ', JSON.stringify(notification));
            });
          }
        } catch (err) {
          console.error('Failed to initialize Capacitor push notifications:', err);
        }
      };

      initPushNotifications();
    }
  }, [authToken]);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shareScoreMatchId = urlParams.get('shareScoreMatchId');
    
    const handleShare = async (matchId) => {
      if (!authToken) {
        localStorage.setItem('pending_share_match_id', matchId);
        await showAlert('Sign In Required', 'Please sign in or sign up to accept scoring access for this match.');
        setCurrentScreen('login');
      } else {
        try {
          const res = await authFetch(`http://localhost:3001/api/matches/live/${matchId}`);
          if (res.ok) {
            const liveMatchData = await res.json();
            setUserRole('viewer');
            localStorage.setItem('bcp_user_role', 'viewer');
            setLiveMatch(liveMatchData);
            setCurrentScreen('scorer_panel');
            await showAlert('Access Granted', 'You now have scoring access for this match!');
          } else {
            await showError('Error', 'Shared match not found or already completed.');
          }
        } catch (e) {
          await showError('Error', 'Failed to load shared match scoring access.');
        }
      }
    };

    if (shareScoreMatchId) {
      window.history.replaceState({}, document.title, window.location.pathname);
      handleShare(shareScoreMatchId);
    } else if (authToken) {
      const pendingId = localStorage.getItem('pending_share_match_id');
      if (pendingId) {
        localStorage.removeItem('pending_share_match_id');
        handleShare(pendingId);
      }
    }
  }, [authToken]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashView />;
      case 'login':
        return <LoginView />;
      case 'venue_onboarding':
        return <VenueOnboardingView key={selectedVenueId || 'new'} />;
      case 'player_home':
        return <PlayerHomeView />;
      case 'my_sports_screen':
        return <MySportsView />;
      case 'looking_screen':
        return <LookingView />;
      case 'store_screen':
        return <StoreView />;
      case 'venue_detail':
        return <VenueDetailView />;
      case 'live_scorecard':
        return <LiveScorecardView />;
      case 'scorer_panel':
        return <ScorerPanelView />;
      case 'owner_dashboard':
        return <OwnerDashboardView />;
      case 'create_tournament':
        return <CreateTournamentView />;
      case 'bracket':
        return <TournamentListView />;
      case 'tournament_detail':
        return <BracketView />;
      case 'teams':
        return <TeamsView />;
      case 'profile':
        return <PlayerProfileView />;
      case 'rewards':
        return <RewardsView />;
      case 'gaming_hub':
        return <GamingHubView />;
      default:
        return <SplashView />;
    }
  };

  const showHeader = currentScreen !== 'splash' && currentScreen !== 'login';
  const showBottomNav = currentScreen !== 'splash' && currentScreen !== 'login' && currentScreen !== 'venue_onboarding' && currentScreen !== 'tournament_detail';
  
  // Show permission modal for owner/scorer who hasn't answered
  const showOwnerOrScorerPermissionPrompt = !permissions.asked && ['owner_dashboard', 'scorer_panel'].includes(currentScreen);
  
  const showPhoneOnboarding = !!authToken && (
    (userRole === 'viewer' && !userPhone) ||
    (userRole === 'admin' && (!userPhone || !localStorage.getItem('bcp_caretaker_phone')))
  );

  // Show player onboarding wizard after login when onboarding details are missing
  const showPlayerOnboardingWizard = !showPhoneOnboarding && userRole === 'viewer' && authToken && currentScreen === 'player_home' && (
    !permissions.asked || 
    playerSportsInterests.length === 0 || 
    Object.keys(playerSpecialties).length === 0
  );

  return (
    <div style={styles.appWrapper}>
      {showOpeningSplash && <OpeningSplashView exit={isSplashExiting} onTap={handleSkipSplash} />}
      {showHeader && <Header />}
      <div style={styles.mainContent}>
        {renderScreen()}
      </div>
      {showBottomNav && <BottomNav />}
      <CustomModal />
      {showOwnerOrScorerPermissionPrompt && <PermissionModal />}
      {showPlayerOnboardingWizard && <PlayerOnboardingFlow />}
      {showPhoneOnboarding && <PhoneOnboardingModal />}
      {selectedCompletedMatch && <CompletedMatchDetailModal />}
      {showPayModal && <PaymentModal />}
      {isDrawerOpen && <MenuDrawer />}
    </div>
  );
}

/* ==========================================================================
   0. PREMIUM OPENING SPLASH ANIMATION
   ========================================================================== */
function OpeningSplashView({ exit, onTap }) {
  const randomizedItems = React.useMemo(() => {
    const icons = ['⚽', '🏀', '🏏', '🏸', '🥅', '🎾', '🏆', '🎱', '🏈', '🏓', '🏐', '🎯'];
    
    // 12 safe regions: Top, Bottom, and Side columns (to frame the logo)
    const regions = [
      // Top regions (above logo)
      { topMin: 4, topMax: 14, leftMin: 6, leftMax: 18 },
      { topMin: 4, topMax: 14, rightMin: 6, rightMax: 18 },
      { topMin: 10, topMax: 20, leftMin: 20, leftMax: 32 },
      { topMin: 2, topMax: 10, leftMin: 42, leftMax: 58 },

      // Bottom regions (below logo and progress loader)
      { topMin: 78, topMax: 88, leftMin: 6, leftMax: 18 },
      { topMin: 78, topMax: 88, rightMin: 6, rightMax: 18 },
      { topMin: 82, topMax: 92, rightMin: 20, rightMax: 32 },
      { topMin: 86, topMax: 94, leftMin: 42, leftMax: 58 },

      // Side regions (Left and Right of the logo - smaller to avoid overlap on mobile)
      { topMin: 22, topMax: 35, leftMin: 3, leftMax: 10 },
      { topMin: 22, topMax: 35, rightMin: 3, rightMax: 10 },
      { topMin: 48, topMax: 65, leftMin: 3, leftMax: 10 },
      { topMin: 48, topMax: 65, rightMin: 3, rightMax: 10 }
    ];

    // Shuffle icons list
    const shuffledIcons = [...icons].sort(() => Math.random() - 0.5);

    return regions.map((reg, idx) => {
      const top = reg.topMin !== undefined ? `${reg.topMin + Math.random() * (reg.topMax - reg.topMin)}%` : undefined;
      const bottom = reg.bottomMin !== undefined ? `${reg.bottomMin + Math.random() * (reg.bottomMax - reg.bottomMin)}%` : undefined;
      const left = reg.leftMin !== undefined ? `${reg.leftMin + Math.random() * (reg.leftMax - reg.leftMin)}%` : undefined;
      const right = reg.rightMin !== undefined ? `${reg.rightMin + Math.random() * (reg.rightMax - reg.rightMin)}%` : undefined;
      
      const isSide = idx >= 8;
      const size = isSide 
        ? `${1.6 + Math.random() * 0.4}rem` // between 1.6rem and 2.0rem to guarantee zero collision
        : `${2.2 + Math.random() * 0.6}rem`; // between 2.2rem and 2.8rem
      const duration = `${7 + Math.random() * 8}s`; // between 7s and 15s
      const delay = `${Math.random() * 1.5}s`; // between 0s and 1.5s

      return {
        icon: shuffledIcons[idx],
        style: {
          position: 'absolute',
          top,
          bottom,
          left,
          right,
          fontSize: size,
          animationDuration: duration,
          animationDelay: delay
        }
      };
    });
  }, []);

  return (
    <div className={`opening-splash-overlay ${exit ? 'exit' : ''}`} onClick={onTap} style={{ cursor: 'pointer' }}>
      <div className="opening-mobile-container">
        {/* Floating background sports elements */}
        {randomizedItems.map((item, idx) => (
          <span
            key={idx}
            className="opening-floating-item"
            style={item.style}
          >
            {item.icon}
          </span>
        ))}

        <div className="opening-logo-container">
          <div className="opening-logo-wrapper">
            <img src="/logo2.png" alt="SportSpot Logo" className="opening-logo-img" />
          </div>
        </div>
        
        <div className="opening-loader-container">
          <div className="opening-loader-bar" />
        </div>
        
        <div className="opening-footer-text">
          SPORT SPOT
        </div>
        
        <div className="opening-tap-continue">
          TAP TO CONTINUE
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   0.5 GLOBAL SUBSCRIPTION PAYMENT MODAL
   ========================================================================== */
/* ==========================================================================
   0.5 GLOBAL SUBSCRIPTION PAYMENT MODAL
   ========================================================================== */
const SUBSCRIPTION_PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 500,
    days: 30,
    period: 'Month',
    badge: 'Popular',
    savings: ''
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    price: 1300,
    days: 90,
    period: '3 Months',
    badge: 'Save 13%',
    savings: 'Save ₹200'
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 5400,
    days: 365,
    period: 'Year',
    badge: 'Best Value',
    savings: 'Save ₹600'
  }
];

function PaymentModal() {
  const { 
    setShowPayModal, 
    setPaymentStatus, 
    setSubscriptionExpiry, 
    setSubscriptionPlan,
    setUserRole,
    authFetch, loadData, showAlert, showError
  } = useAppState();

  const [selectedPlan, setSelectedPlan] = React.useState('monthly');
  const [payMethod, setPayMethod] = React.useState('upi');
  const [upiVal, setUpiVal] = React.useState('');
  const [isProcessingPay, setIsProcessingPay] = React.useState(false);

  const activePlanObj = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan) || SUBSCRIPTION_PLANS[0];

  const handleSimulatePayment = async () => {
    if (payMethod === 'upi') {
      if (!upiVal.trim()) {
        await showError('Input Required', 'Please enter your UPI ID or Transaction ID.');
        return;
      }
      setIsProcessingPay(true);
      setTimeout(async () => {
        try {
          const res = await authFetch('http://localhost:3001/api/auth/subscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ plan: selectedPlan })
          });
          if (res.ok) {
            const data = await res.json();
            setPaymentStatus(data.paymentStatus);
            setSubscriptionExpiry(data.subscriptionExpiry);
            if (data.subscriptionPlan) {
              setSubscriptionPlan(data.subscriptionPlan);
              localStorage.setItem('bcp_subscription_plan', data.subscriptionPlan);
            }
            if (data.role) {
              setUserRole(data.role);
              localStorage.setItem('bcp_user_role', data.role);
            }
            localStorage.setItem('bcp_payment_status', data.paymentStatus);
            localStorage.setItem('bcp_subscription_expiry', data.subscriptionExpiry);
            
            setIsProcessingPay(false);
            setShowPayModal(false);
            await showAlert('Success', `Payment Successful! Subscription activated/extended for ${activePlanObj.days} days.`);
            await loadData();
          } else {
            setIsProcessingPay(false);
            await showError('Payment Failed', 'Server rejected subscription activation.');
          }
        } catch (err) {
          setIsProcessingPay(false);
          await showError('Error', 'Payment processing error: ' + err.message);
        }
      }, 400);
    } else {
      setIsProcessingPay(true);
      try {
        // 1. Create order on backend
        const orderRes = await fetch(`${API_BASE}/api/payment/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: activePlanObj.price * 100, // in paise
            receipt: `subscribe_${selectedPlan}_${Date.now()}`
          })
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok) throw new Error(orderData.error || 'Razorpay order creation failed');

        // 2. Open Razorpay Checkout popup
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'SportSpot Premium',
          description: `Subscribe to ${activePlanObj.name} (${activePlanObj.days} Days)`,
          order_id: orderData.orderId,
          handler: async (response) => {
            try {
              // 3. Send payment details to subscription activation endpoint
              const verifyRes = await authFetch('http://localhost:3001/api/auth/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  plan: selectedPlan,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });
              if (verifyRes.ok) {
                const data = await verifyRes.json();
                setPaymentStatus(data.paymentStatus);
                setSubscriptionExpiry(data.subscriptionExpiry);
                if (data.subscriptionPlan) {
                  setSubscriptionPlan(data.subscriptionPlan);
                  localStorage.setItem('bcp_subscription_plan', data.subscriptionPlan);
                }
                if (data.role) {
                  setUserRole(data.role);
                  localStorage.setItem('bcp_user_role', data.role);
                }
                localStorage.setItem('bcp_payment_status', data.paymentStatus);
                localStorage.setItem('bcp_subscription_expiry', data.subscriptionExpiry);
                
                setShowPayModal(false);
                await showAlert('Success 🎉', `Payment verified! Subscription activated/extended for ${activePlanObj.days} days.`);
                await loadData();
              } else {
                const errorData = await verifyRes.json();
                await showError('Verification Failed', errorData.error || 'Failed to verify subscription payment.');
              }
            } catch (err) {
              await showError('Error', 'Subscription activation failed: ' + err.message);
            } finally {
              setIsProcessingPay(false);
            }
          },
          prefill: {
            name: '',
            email: '',
            contact: ''
          },
          theme: {
            color: '#AAFF00'
          },
          modal: {
            ondismiss: () => {
              setIsProcessingPay(false);
            }
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        setIsProcessingPay(false);
        await showError('Error', 'Razorpay checkout failed: ' + err.message);
      }
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24
    }}>
      <div className="sporty-card glow-green" style={{
        background: 'var(--bg-surface-solid, #1E293B)', border: '2px solid var(--primary)',
        borderRadius: 16, padding: 24, width: '100%', maxWidth: 420,
        boxShadow: '0 8px 32px rgba(170,255,0,0.18)',
        color: '#FFFFFF'
      }}>
        <div style={{textAlign: 'center', marginBottom: 16}}>
          <span style={{fontSize: '2rem'}}>⚡</span>
          <h2 style={{fontSize: '1.4rem', color: 'var(--text-primary)', marginTop: 8, fontFamily: 'var(--font-label)'}}>
            SportSpot Checkout
          </h2>
          <p style={{fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 6}}>
            Choose a plan to list your arenas and receive bookings
          </p>
        </div>

        {/* Plan Selector Grid */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20}}>
          {SUBSCRIPTION_PLANS.map(plan => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                style={{
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                  borderRadius: 10,
                  padding: '12px 6px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: isSelected ? 'rgba(170, 255, 0, 0.04)' : 'transparent',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '85px',
                  transition: 'all 0.2s ease-in-out',
                  boxShadow: isSelected ? '0 0 10px rgba(170,255,0,0.1)' : 'none'
                }}
              >
                {plan.badge && (
                  <span style={{
                    position: 'absolute',
                    top: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: plan.id === 'yearly' ? '#D97706' : 'var(--primary)',
                    color: plan.id === 'yearly' ? '#FFF' : '#000',
                    fontSize: '0.55rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 8,
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {plan.badge}
                  </span>
                )}
                <div style={{fontSize: '0.75rem', fontWeight: 700, color: isSelected ? 'var(--primary)' : 'var(--text-muted)', marginTop: plan.badge ? 4 : 0}}>
                  {plan.name}
                </div>
                <div style={{fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: '4px 0'}}>
                  ₹{plan.price}
                </div>
                <div style={{fontSize: '0.62rem', color: 'var(--text-muted)'}}>
                  {plan.days} Days
                </div>
              </div>
            );
          })}
        </div>

        <div style={{display: 'flex', gap: 10, marginBottom: 16}}>
          {['upi', 'card'].map(method => (
            <button
              key={method}
              type="button"
              onClick={() => setPayMethod(method)}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 8,
                border: payMethod === method ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                background: payMethod === method ? 'rgba(170,255,0,0.06)' : 'transparent',
                color: payMethod === method ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.75rem'
              }}
            >
              {method === 'upi' ? '⚡ UPI / QR' : '💳 CARD / RAZORPAY'}
            </button>
          ))}
        </div>

        {payMethod === 'upi' ? (
          <div style={{display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginBottom: 20}}>
            <div style={{
              padding: 12, backgroundColor: '#FFFFFF', borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center', width: 160, height: 210,
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              position: 'relative'
            }}>
              <img 
                src="/subscription_qr.png" 
                alt="UPI Scanner" 
                style={{width: '100%', height: '100%', objectFit: 'contain', borderRadius: 6}} 
              />
            </div>
            <div style={{textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 2}}>
              <span style={{fontSize: '0.8rem', fontWeight: 'bold', color: '#FFFFFF'}}>Barot Yaksh Maheshkumar</span>
              <span style={{fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700}}>6353874452@fam</span>
              <span style={{fontSize: '0.7rem', color: '#9CA3AF', marginTop: 4}}>Scan QR to Pay ₹{activePlanObj.price} or enter UPI details below</span>
            </div>
            <input
              type="text"
              placeholder="Your name@upi or Txn ID"
              className="form-input"
              value={upiVal}
              style={{width: '100%', boxSizing: 'border-box'}}
              onChange={e => setUpiVal(e.target.value)}
            />
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginBottom: 20, textAlign: 'center'}}>
            <span style={{fontSize: '2.5rem'}}>💳</span>
            <h4 style={{fontSize: '0.95rem', color: '#FFFFFF', fontWeight: 700}}>Secure Checkout powered by Razorpay</h4>
            <p style={{fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, padding: '0 12px'}}>
              Pay safely using credit/debit card, netbanking, or other UPI apps via Razorpay.
            </p>
          </div>
        )}

        <button 
          className="btn-neon" 
          style={{width: '100%', padding: '12px 0', fontSize: '0.95rem', fontWeight: 'bold'}}
          onClick={handleSimulatePayment}
        >
          {isProcessingPay ? 'PROCESSING PAYMENT...' : (payMethod === 'upi' ? `PAY ₹${activePlanObj.price} / ${activePlanObj.period.toUpperCase()} ⚡` : 'PAY VIA RAZORPAY 💳')}
        </button>
        
        <button 
          className="btn-outlined" 
          style={{width: '100%', padding: '10px 0', fontSize: '0.85rem', marginTop: 10}}
          onClick={() => { setShowPayModal(false); }}
        >
          CANCEL
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   1. SPLASH / ROLE SELECTION
   ========================================================================== */
function SplashView() {
  const { setCurrentScreen, setUserRole } = useAppState();

  const handleSelectRole = (role, screen) => {
    setUserRole(role);
    setCurrentScreen(screen);
  };

  return (
    <div style={{...styles.container, padding: 24, justifyContent: 'center'}}>
      <div style={styles.splashHeader}>
        <div style={styles.logoContainer}>
          <img src="/logo2.png" alt="SportSpot Logo" style={styles.logoBadgeImg} />
        </div>
        <h1 style={styles.brandTitle}>SPORT<span style={{color: 'var(--primary)'}}>SPOT</span></h1>
        <p style={styles.brandTagline}>BOOK. PLAY. WIN.</p>
        <div style={{display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap'}}>
          {['🏏','⚽','🏸','🎾','🏓','🎱','🏀','🏐'].map(e => (
            <span key={e} style={{fontSize: '1.3rem'}}>{e}</span>
          ))}
        </div>
      </div>

      <div style={styles.roleSelectionGroup}>
        <div 
          className="sporty-card glow-green" 
          onClick={() => handleSelectRole('admin', 'login')}
          style={styles.roleCard}
        >
          <div style={styles.roleHeader}>
            <span style={styles.roleIcon}>🏟️</span>
            <h3 style={styles.roleTitle}>VENUE PARTNER / ADMIN</h3>
          </div>
          <p style={styles.roleSub}>Register and manage your sports venues — cricket, football, badminton & more. Get bookings instantly!</p>
        </div>

        <div 
          className="sporty-card glow-gold" 
          onClick={() => handleSelectRole('viewer', 'login')}
          style={styles.roleCard}
        >
          <div style={styles.roleHeader}>
            <span style={styles.roleIcon}>⚡</span>
            <h3 style={styles.roleTitle}>PLAYER / USER</h3>
          </div>
          <p style={styles.roleSub}>Find nearby sports venues, book slots for cricket, football, badminton & more, and earn rewards.</p>
        </div>
      </div>

      <div style={styles.footerLink}>
        Already have an account? <span onClick={() => { setUserRole('general'); setCurrentScreen('login'); }} style={{color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline'}}>LOGIN</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. LOGIN & SIGNUP
   ========================================================================== */
function LoginView() {
  const { 
    setCurrentScreen, 
    userRole, 
    setUserRole, 
    venues, 
    signupUser, 
    loginUser, 
    logoutUser, 
    setSelectedVenueId, 
    authFetch, 
    showAlert,
    setAuthToken,
    setApiKey,
    setPlayerId,
    setUserName,
    setUserEmail,
    setUserPhone,
    setPlayerSpecialty,
    setPlayerSpecialties,
    setPlayerSportsInterests,
    updateUsernameOnBackend,
    setPaymentStatus,
    setSubscriptionExpiry,
    setSubscriptionPlan
  } = useAppState();
  const [activeTab, setActiveTab] = useState('login');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const getFriendlyError = (err, defaultMsg = 'An error occurred.') => {
    if (err && (err.message === 'Failed to fetch' || err.message?.includes('fetch'))) {
      return 'Connection failed. Please ensure the backend server is running and try again.';
    }
    return err?.message || defaultMsg;
  };
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showSignupVerifyForm, setShowSignupVerifyForm] = useState(false);
  const [signupVerifyCode, setSignupVerifyCode] = useState('');
  const [signupSuccessMessage, setSignupSuccessMessage] = useState('');

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotPhase, setForgotPhase] = useState(1); // 1: enter email, 2: enter code & new password
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState('');

  React.useEffect(() => {
    setFullName('');
    setPhone('');
    setEmail('');
    setPassword('');
    setAuthError('');
    setPhoneError('');
    setShowSignupVerifyForm(false);
    setSignupVerifyCode('');
    setSignupSuccessMessage('');
  }, [userRole, activeTab, isForgotPassword]);

  // Real-time phone duplicate check on blur
  const handlePhoneBlur = async () => {
    if (!phone.trim() || phone.trim().length < 6 || activeTab !== 'signup') return;
    try {
      const res = await fetch(`${API_BASE}/api/auth/check-phone?phone=${encodeURIComponent(phone.trim())}`);
      const data = await res.json();
      if (data.taken) {
        setPhoneError('This phone number is already registered. Please use a different number or log in.');
      } else {
        setPhoneError('');
      }
    } catch {
      // silently ignore network errors on blur
    }
  };

  React.useEffect(() => {
    if (userRole === 'general' && activeTab !== 'login') {
      setActiveTab('login');
    }
  }, [userRole, activeTab]);

  // Helper to handle login success state/storage updates and redirection
  const processLoginSuccess = async (data) => {
    const { token, user } = data;
    
    setAuthToken(token);
    setApiKey(user.apiKey || '');
    setPlayerId(user.playerId);
    setUserName(user.username || '');
    setUserEmail(user.email || '');
    setUserPhone(user.phone || '');
    const activeRole = userRole === 'scorer' && user.role === 'viewer' ? 'scorer' : (user.role || 'viewer');
    setUserRole(activeRole);
    setPaymentStatus(user.paymentStatus || 'unpaid');
    setSubscriptionExpiry(user.subscriptionExpiry || '');
    setSubscriptionPlan(user.subscriptionPlan || '');
    setPlayerSpecialty(user.specialty || '');
    const specs = typeof user.specialties === 'object' && user.specialties !== null ? user.specialties : (user.specialties ? JSON.parse(user.specialties) : {});
    setPlayerSpecialties(specs);
    const loginSportsArr = Array.isArray(user.sports_interests) ? user.sports_interests : [];
    setPlayerSportsInterests(loginSportsArr);
    
    localStorage.setItem('bcp_auth_token', token);
    localStorage.setItem('bcp_api_key', user.apiKey || '');
    localStorage.setItem('bcp_player_id', user.playerId);
    localStorage.setItem('bcp_username', user.username || '');
    localStorage.setItem('bcp_email', user.email || '');
    localStorage.setItem('bcp_phone', user.phone || '');
    localStorage.setItem('bcp_user_role', activeRole);
    localStorage.setItem('bcp_payment_status', user.paymentStatus || 'unpaid');
    localStorage.setItem('bcp_subscription_expiry', user.subscriptionExpiry || '');
    localStorage.setItem('bcp_subscription_plan', user.subscriptionPlan || '');
    localStorage.setItem('bcp_player_specialty', user.specialty || '');
    localStorage.setItem('bcp_player_specialties', JSON.stringify(specs));
    localStorage.setItem('bcp_sports_interests', JSON.stringify(loginSportsArr));

    // Redirect based on resolved activeRole
    if (activeRole === 'admin') {
      try {
        const resV = await authFetch('http://localhost:3001/api/venues');
        if (resV.ok) {
          const dataV = await resV.json();
          const owned = dataV.filter(v => v.ownerId === user.playerId);
          if (owned.length === 0) {
            setCurrentScreen('venue_onboarding');
          } else {
            setSelectedVenueId(owned[0].id);
            setCurrentScreen('owner_dashboard');
          }
        } else {
          setCurrentScreen('venue_onboarding');
        }
      } catch (e) {
        setCurrentScreen('venue_onboarding');
      }
    } else {
      setCurrentScreen('player_home');
    }
  };

  // Google Authentication handler using Google Identity Services SDK callback (Web)
  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential, role: userRole })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Google Authentication failed.');
      }
      
      await processLoginSuccess(data);
    } catch (err) {
      setAuthError(getFriendlyError(err, 'Google Authentication failed.'));
    } finally {
      setLoading(false);
    }
  };

  // Google Authentication handler using Capacitor Google Auth plugin (Mobile)
  const handleNativeGoogleSignIn = async () => {
    setLoading(true);
    setAuthError('');
    try {
      const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
      
      try {
        await GoogleAuth.initialize({
          clientId: '358543794487-bknljggg9huk1p788sgo9kqqnrf2l6ug.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
          grantOfflineAccess: true
        });
      } catch (initErr) {
        console.warn("GoogleAuth initialize warning:", initErr);
      }
      
      const googleUser = await GoogleAuth.signIn();
      const idToken = googleUser.authentication.idToken;
      
      if (!idToken) {
        throw new Error("No ID Token returned from Google Sign-In.");
      }
      
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken, role: userRole })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Google Authentication failed.');
      }
      
      await processLoginSuccess(data);
    } catch (err) {
      console.error("Native Google Sign-In error:", err);
      setAuthError(getFriendlyError(err, 'Native Google Sign-In failed.'));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (window.google && !window.Capacitor) {
      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '358543794487-bknljggg9huk1p788sgo9kqqnrf2l6ug.apps.googleusercontent.com',
          callback: handleGoogleCredentialResponse
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleBtnDiv"),
          { theme: "outline", size: "large", width: 280 }
        );
      } catch (err) {
        console.error("Failed to initialize Google Sign-In SDK:", err);
      }
    }
  }, [activeTab, isForgotPassword]);


  const handleRequestCode = async (e) => {
    e.preventDefault();
    setAuthError('');
    setForgotSuccessMessage('');
    if (!forgotEmail) {
      setAuthError('Please enter your Email Address.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to request verification code.');
      }
      
      setForgotSuccessMessage('Verification code sent to your email address!');
      setForgotPhase(2);
    } catch (err) {
      setAuthError(getFriendlyError(err, 'Failed to request verification code.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setAuthError('');
    setForgotSuccessMessage('');
    if (!forgotCode) {
      setAuthError('Please enter the 6-digit verification code.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, code: forgotCode })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to verify code.');
      }
      
      setForgotSuccessMessage('Code verified successfully! Choose your new password.');
      setForgotPhase(3);
    } catch (err) {
      setAuthError(getFriendlyError(err, 'Failed to verify code.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setForgotSuccessMessage('');
    if (!forgotCode || !forgotNewPassword) {
      setAuthError('Verification Code and New Password are required.');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setAuthError('New password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, code: forgotCode, newPassword: forgotNewPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password.');
      }
      
      await showAlert('Success', 'Password reset successfully! You can now log in.');
      setIsForgotPassword(false);
      setForgotEmail('');
      setForgotCode('');
      setForgotNewPassword('');
      setForgotPhase(1);
      setActiveTab('login');
    } catch (err) {
      setAuthError(getFriendlyError(err, 'Failed to reset password.'));
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    setAuthError('');
    setLoading(true);
    
    if (activeTab === 'signup') {
      if (userRole === 'admin') {
        if (!fullName.trim()) {
          setAuthError('Please enter your Full Name.');
          setLoading(false);
          return;
        }
        if (!phone.trim()) {
          setAuthError('Please enter your Mobile Number.');
          setLoading(false);
          return;
        }
        if (phoneError) {
          setAuthError(phoneError);
          setLoading(false);
          return;
        }
        if (!email.trim()) {
          setAuthError('Please enter your Email Address.');
          setLoading(false);
          return;
        }
      } else {
        if (!email && !phone) {
          setAuthError('Please enter at least an Email Address or Mobile Number.');
          setLoading(false);
          return;
        }
      }

      if (email && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
        setAuthError('Access Denied: Only valid Google Accounts (@gmail.com) are supported.');
        setLoading(false);
        return;
      }
      if (!password || password.length < 6) {
        setAuthError('Password must be at least 6 characters.');
        setLoading(false);
        return;
      }

      if (userRole === 'admin') {
        try {
          const res = await fetch(`${API_BASE}/api/auth/request-signup-verification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Failed to request verification code.');
          }
          
          setSignupSuccessMessage('Verification code sent to your email address!');
          setShowSignupVerifyForm(true);
        } catch (err) {
          setAuthError(getFriendlyError(err, 'Failed to request verification code.'));
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        await signupUser(email || null, phone || null, password, userRole);
        if (userRole === 'admin') {
          setCurrentScreen('venue_onboarding');
        } else {
          setCurrentScreen('player_home');
        }
      } catch (err) {
        setAuthError(getFriendlyError(err, 'Signup failed.'));
      } finally {
        setLoading(false);
      }
    } else {
      const identifier = email || phone;
      if (!identifier) {
        setAuthError('Please enter your Phone Number or Email.');
        setLoading(false);
        return;
      }
      
      const isGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(identifier);
      if (!password && !isGmail) {
        setAuthError('Please enter your password.');
        setLoading(false);
        return;
      }

      try {
        let user;
        if (isGmail) {
          // Passwordless Direct Google Email Login
          const res = await fetch(`${API_BASE}/api/auth/direct-google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: identifier, role: userRole })
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Direct Google Login failed.');
          }
          const { token } = data;
          user = data.user;

          // Unified login: no role selection constraints
          
          setAuthToken(token);
          setApiKey(user.apiKey || '');
          setPlayerId(user.playerId);
          setUserName(user.username || '');
          setUserEmail(user.email || '');
          setUserPhone(user.phone || '');
          const activeRole = userRole === 'scorer' && user.role === 'viewer' ? 'scorer' : (user.role || 'viewer');
          setUserRole(activeRole);
          setPaymentStatus(user.paymentStatus || 'unpaid');
          setSubscriptionExpiry(user.subscriptionExpiry || '');
          setSubscriptionPlan(user.subscriptionPlan || '');
          setPlayerSpecialty(user.specialty || '');
          const specs = typeof user.specialties === 'object' && user.specialties !== null ? user.specialties : (user.specialties ? JSON.parse(user.specialties) : {});
          setPlayerSpecialties(specs);
          const loginSportsArr = Array.isArray(user.sports_interests) ? user.sports_interests : [];
          setPlayerSportsInterests(loginSportsArr);
          
          localStorage.setItem('bcp_auth_token', token);
          localStorage.setItem('bcp_api_key', user.apiKey || '');
          localStorage.setItem('bcp_player_id', user.playerId);
          localStorage.setItem('bcp_username', user.username || '');
          localStorage.setItem('bcp_email', user.email || '');
          localStorage.setItem('bcp_phone', user.phone || '');
          localStorage.setItem('bcp_user_role', activeRole);
          localStorage.setItem('bcp_payment_status', user.paymentStatus || 'unpaid');
          localStorage.setItem('bcp_subscription_expiry', user.subscriptionExpiry || '');
          localStorage.setItem('bcp_subscription_plan', user.subscriptionPlan || '');
          localStorage.setItem('bcp_player_specialty', user.specialty || '');
          localStorage.setItem('bcp_player_specialties', JSON.stringify(specs));
          localStorage.setItem('bcp_sports_interests', JSON.stringify(loginSportsArr));
        } else {
          // Standard Password Login
          user = await loginUser(identifier, password);
        }

        // Unified login: no role selection constraints
        
        const resolvedRole = userRole === 'scorer' && user.role === 'viewer' ? 'scorer' : (user.role || 'viewer');
        setUserRole(resolvedRole);
        localStorage.setItem('bcp_user_role', resolvedRole);

        if (resolvedRole === 'admin') {
          try {
            const resV = await authFetch('http://localhost:3001/api/venues');
            if (resV.ok) {
              const dataV = await resV.json();
              const owned = dataV.filter(v => v.ownerId === user.playerId);
              if (owned.length === 0) {
                setCurrentScreen('venue_onboarding');
              } else {
                setSelectedVenueId(owned[0].id);
                setCurrentScreen('owner_dashboard');
              }
            } else {
              setCurrentScreen('venue_onboarding');
            }
          } catch (e) {
            console.error("Failed to fetch venues on login:", e);
            setCurrentScreen('venue_onboarding');
          }
        } else {
          setCurrentScreen('player_home');
        }
      } catch (err) {
        setAuthError(getFriendlyError(err, 'Login failed. Please check your credentials.'));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifySignupAndComplete = async (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    setSignupSuccessMessage('');
    if (!signupVerifyCode) {
      setAuthError('Please enter the 6-digit verification code.');
      return;
    }
    setLoading(true);
    try {
      const verifyRes = await fetch(`${API_BASE}/api/auth/verify-signup-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: signupVerifyCode })
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Failed to verify signup code.');
      }

      await signupUser(email || null, phone || null, password, userRole);
      
      if (fullName.trim()) {
        try {
          await updateUsernameOnBackend(fullName.trim());
        } catch (nameErr) {
          console.error("Failed to update username after signup:", nameErr.message);
        }
      }
      
      setCurrentScreen('venue_onboarding');
    } catch (err) {
      setAuthError(getFriendlyError(err, 'Signup verification failed.'));
    } finally {
      setLoading(false);
    }
  };

  const headerTitle = activeTab === 'login' 
    ? 'PORTAL LOGIN' 
    : 'JOIN THE ARENA';

  const headerSub = activeTab === 'login'
    ? 'Log in to book venues, score matches, or manage your arenas.'
    : 'Create an account to get started.';

  return (
    <div style={{...styles.container, padding: 20}}>
      <div style={styles.authHeader}>
        <h2 style={{color: "var(--text-primary)"}}>{isForgotPassword ? 'FORGOT PASSWORD' : headerTitle}</h2>
        <p style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>{isForgotPassword ? 'Reset your account password using your email verification code' : headerSub}</p>
      </div>

      {authError && (
        <div style={{
          color: '#dc143c',
          backgroundColor: 'rgba(220, 20, 60, 0.08)',
          border: '1px solid rgba(220, 20, 60, 0.2)',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          fontSize: '0.82rem',
          fontWeight: 600,
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          ⚠ {authError}
        </div>
      )}

      {forgotSuccessMessage && (
        <div style={{
          color: 'var(--primary)',
          backgroundColor: 'rgba(170, 255, 0, 0.08)',
          border: '1px solid rgba(170, 255, 0, 0.2)',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          fontSize: '0.82rem',
          fontWeight: 600,
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          ✅ {forgotSuccessMessage}
        </div>
      )}

      {signupSuccessMessage && (
        <div style={{
          color: 'var(--primary)',
          backgroundColor: 'rgba(170, 255, 0, 0.08)',
          border: '1px solid rgba(170, 255, 0, 0.2)',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          fontSize: '0.82rem',
          fontWeight: 600,
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          ✅ {signupSuccessMessage}
        </div>
      )}

      {isForgotPassword ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: 12, width: '100%'}}>
          {forgotPhase === 1 ? (
            <form onSubmit={handleRequestCode} style={{display: 'flex', flexDirection: 'column', gap: 12}}>
              <div className="form-group">
                <label className="form-label">Registered Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="form-input" 
                  value={forgotEmail}
                  maxLength={100}
                  autoComplete="off"
                  onChange={e => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-neon" style={{marginTop: 12}} disabled={loading}>
                {loading ? 'SENDING CODE...' : 'SEND VERIFICATION CODE ⚡'}
              </button>
            </form>
          ) : forgotPhase === 2 ? (
            <form onSubmit={handleVerifyCode} style={{display: 'flex', flexDirection: 'column', gap: 12}}>
              <div style={{fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 4}}>
                We've sent a 6-digit verification code to **{forgotEmail}**. Enter it below to verify.
              </div>
              <div className="form-group">
                <label className="form-label">Verification Code (6-digit)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 123456" 
                  className="form-input" 
                  value={forgotCode}
                  maxLength={6}
                  onChange={e => setForgotCode(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-neon" style={{marginTop: 12}} disabled={loading}>
                {loading ? 'VERIFYING CODE...' : 'VERIFY CODE ⚡'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPasswordSubmit} style={{display: 'flex', flexDirection: 'column', gap: 12}}>
              <div className="form-group">
                <label className="form-label">Choose New Password</label>
                <input 
                  type="password" 
                  placeholder="At least 6 characters" 
                  className="form-input" 
                  value={forgotNewPassword}
                  maxLength={50}
                  autoComplete="new-password"
                  onChange={e => setForgotNewPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-neon" style={{marginTop: 12}} disabled={loading}>
                {loading ? 'RESETTING PASSWORD...' : 'RESET PASSWORD ⚡'}
              </button>
            </form>
          )}

          <button 
            type="button" 
            onClick={() => { 
              setIsForgotPassword(false); 
              setForgotPhase(1); 
              setForgotEmail(''); 
              setForgotCode(''); 
              setForgotNewPassword(''); 
              setAuthError(''); 
              setForgotSuccessMessage(''); 
            }} 
            className="btn-outlined" 
            style={{marginTop: 8}}
          >
            Back to Login
          </button>
        </div>
      ) : (
        <>
          {!showSignupVerifyForm && (
            <div className="tabs-container">
              <button 
                className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => { setActiveTab('login'); setAuthError(''); }}
              >
                Login
              </button>
              <button 
                className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => { setActiveTab('signup'); setAuthError(''); }}
              >
                Sign Up
              </button>
            </div>
          )}

          {activeTab === 'login' ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
              <div className="form-group">
                <label className="form-label">Phone/Email</label>
                <input 
                  type="text" 
                  placeholder="9876543210 or name@email.com" 
                  className="form-input" 
                  value={email || phone}
                  maxLength={100}
                  autoComplete="off"
                  onChange={e => {
                    const val = e.target.value;
                    if (val.includes('@')) {
                      setEmail(val);
                      setPhone('');
                    } else {
                      setPhone(val);
                      setEmail('');
                    }
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="form-input" 
                  value={password}
                  maxLength={50}
                  autoComplete="new-password"
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: 12, width: '100%'}}>
              {!showSignupVerifyForm && (
                <div style={{
                  display: 'flex',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 12,
                  padding: 4,
                  marginBottom: 16,
                  border: '1px solid var(--border-light)'
                }}>
                  {[
                    { id: 'viewer', label: 'Player' },
                    { id: 'admin', label: 'Venue Partner' }
                  ].map(r => {
                    const isActive = userRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => { setUserRole(r.id); setAuthError(''); }}
                        style={{
                          flex: 1,
                          padding: '10px 4px',
                          borderRadius: 8,
                          border: 'none',
                          backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                          color: isActive ? '#000000' : 'var(--text-primary)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontFamily: 'var(--font-label)'
                        }}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              )}
              {userRole === 'admin' ? (
              showSignupVerifyForm ? (
                <form onSubmit={handleVerifySignupAndComplete} style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                  <div style={{fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 4}}>
                    We've sent a 6-digit verification code to **{email}**. Enter it below to complete registration.
                  </div>
                  <div className="form-group">
                    <label className="form-label">Verification Code (6-digit)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 123456" 
                      className="form-input" 
                      value={signupVerifyCode}
                      maxLength={6}
                      onChange={e => setSignupVerifyCode(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-neon" style={{marginTop: 12}} disabled={loading}>
                    {loading ? 'VERIFYING CODE...' : 'VERIFY & REGISTER ⚡'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { 
                      setShowSignupVerifyForm(false); 
                      setSignupVerifyCode(''); 
                      setAuthError(''); 
                      setSignupSuccessMessage(''); 
                    }} 
                    className="btn-outlined" 
                    style={{marginTop: 8}}
                  >
                    Back to Registration
                  </button>
                </form>
              ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className="form-input" 
                      value={fullName}
                      maxLength={50}
                      autoComplete="off"
                      onChange={e => setFullName(e.target.value)}
                    />
                  </div>
                    <div className="form-group">
                      <label className="form-label">Mobile Number</label>
                      <input 
                        type="tel" 
                        placeholder="Phone" 
                        className="form-input" 
                        value={phone}
                        maxLength={15}
                        autoComplete="off"
                        style={phoneError ? { borderColor: '#dc143c' } : {}}
                        onChange={e => { setPhone(e.target.value); setPhoneError(''); }}
                        onBlur={handlePhoneBlur}
                      />
                      {phoneError && (
                        <p style={{
                          color: '#dc143c',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          marginTop: 5,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 4
                        }}>
                          ⚠ {phoneError}
                        </p>
                      )}
                    </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="name@email.com" 
                      className="form-input" 
                      value={email}
                      maxLength={100}
                      autoComplete="off"
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Create Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="form-input" 
                      value={password}
                      maxLength={50}
                      autoComplete="new-password"
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              )
              ) : (
                <div style={{textAlign: 'center', padding: '15px 10px', color: 'var(--text-primary)'}}>
                  <div style={{fontSize: '1.6rem', marginBottom: 8}}>⚡</div>
                  <p style={{fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: 5}}>
                    Players and Scorers can sign up instantly using Google Sign Up below.
                  </p>
                </div>
              )}
            </div>
          )}

          {(activeTab === 'login' || (userRole === 'admin' && !showSignupVerifyForm)) && (
            <button onClick={handleContinue} className="btn-neon" style={{marginTop: 20}} disabled={loading}>
              {loading ? 'PROCESSING...' : 'CONTINUE ⚡'}
            </button>
          )}

          {activeTab === 'login' && (
            <div style={{textAlign: 'center', marginTop: 10, marginBottom: 5}}>
              <button 
                type="button"
                onClick={() => { setIsForgotPassword(true); setAuthError(''); setForgotSuccessMessage(''); }} 
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textDecoration: 'underline',
                  padding: '4px 8px',
                  transition: 'opacity 0.2s'
                }}
              >
                Forgot Password?
              </button>
            </div>
          )}

          {!showSignupVerifyForm && (
            window.Capacitor ? (
              <button
                type="button"
                onClick={handleNativeGoogleSignIn}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ffffff',
                  color: '#757575',
                  border: '1px solid #dadce0',
                  borderRadius: '4px',
                  padding: '0 12px',
                  height: '40px',
                  width: '280px',
                  fontFamily: 'Roboto, arial, sans-serif',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  margin: '15px auto 5px auto',
                  boxShadow: 'none',
                  transition: 'background-color 0.218s, border-color 0.218s'
                }}
              >
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 48 48" style={{ marginRight: '10px' }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.5 24c0-1.55-.15-3.24-.47-4.77H24v9.03h12.75c-.53 2.87-2.14 5.3-4.57 6.92l7.1 5.51C43.43 36.6 46.5 30.9 46.5 24z"></path>
                  <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.1-5.51c-2.2 1.48-5.01 2.32-8.79 2.32-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                Sign in with Google
              </button>
            ) : (
              <div id="googleBtnDiv" style={{ display: 'flex', justifyContent: 'center', marginTop: 15, marginBottom: 5 }}></div>
            )
          )}

          <div style={{textAlign: 'center', marginTop: 16, fontSize: '0.75rem', color: 'var(--text-muted)'}}>
            By proceeding you agree to Playfinity Terms & Conditions
          </div>
        </>
      )}
    </div>
  );
}

/* ==========================================================================
   2.5 VENUE OWNER ONBOARDING
   ========================================================================== */
function VenueOnboardingView() {
  const { 
    setCurrentScreen, registerVenue, deleteVenue, setSelectedVenueId, updateVenue,
    venues, setVenues, selectedVenueId, playerId, showAlert, showError, showConfirm,
    onboardingViewMode, setOnboardingViewMode, paymentStatus, setShowPayModal
  } = useAppState();
  
  const viewMode = onboardingViewMode;
  const setViewMode = setOnboardingViewMode;
  
  // Filter owned venues
  const ownerVenues = venues.filter(v => v.ownerId === playerId);
  
  const [editingVenueId, setEditingVenueId] = useState(null);

  // Sync global onboarding view mode on mount or list changes
  React.useEffect(() => {
    if (ownerVenues.length === 0) {
      setViewMode('create');
    } else if (viewMode !== 'edit' && viewMode !== 'create') {
      setViewMode('list');
    }
  }, [ownerVenues.length, viewMode, setViewMode]);

  // Form states
  const [boxName, setBoxName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(() => localStorage.getItem('bcp_owner_phone') || '');
  const [caretakerPhone, setCaretakerPhone] = useState(() => localStorage.getItem('bcp_caretaker_phone') || '');
  const [pricePerHour, setPricePerHour] = useState(800);
  const [advancePercent, setAdvancePercent] = useState(30);
  const [terms, setTerms] = useState('1. 30% advance is required to confirm slot. 2. Cancellation allowed 24 hours prior.');
  const [venueImages, setVenueImages] = useState(['https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=800']);
  const [upiId, setUpiId] = useState('arena@upi');
  const [upiQrImage, setUpiQrImage] = useState('');
  const [venueSports, setVenueSports] = useState(['Box Cricket']);

  // Gaming configuration states
  const [ps5Count, setPs5Count] = useState(0);
  const [ps4Count, setPs4Count] = useState(0);
  const [pcCount, setPcCount] = useState(0);
  const [availableGames, setAvailableGames] = useState('');
  const [ps5SinglePrice, setPs5SinglePrice] = useState(150);
  const [ps5MultiPrice, setPs5MultiPrice] = useState(250);
  const [ps4SinglePrice, setPs4SinglePrice] = useState(100);
  const [ps4MultiPrice, setPs4MultiPrice] = useState(180);
  const [pcSinglePrice, setPcSinglePrice] = useState(120);
  const [pcMultiPrice, setPcMultiPrice] = useState(120);


  const presetImages = [
    { label: 'Turf A', url: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&q=80&w=800' },
    { label: 'Turf B', url: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800' },
    { label: 'Turf C', url: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=800' }
  ];

  // Load existing venue details when editing
  const handleEditClick = (venue) => {
    setEditingVenueId(venue.id);
    setBoxName(venue.name);
    setAddress(venue.address);
    setPhone(venue.phone);
    setCaretakerPhone(venue.caretakerPhone || '');
    setPricePerHour(venue.pricePerHour);
    setAdvancePercent(venue.advancePercent);
    setTerms(venue.terms);
    setVenueImages(venue.images && venue.images.length > 0 ? venue.images : [presetImages[0].url]);
    setUpiId(venue.upiId || 'arena@upi');
    setUpiQrImage(venue.upiQrImage || '');
    setVenueSports(venue.sports || (venue.sport ? [venue.sport] : ['Box Cricket']));

    const gd = venue.gamingDetails ? (typeof venue.gamingDetails === 'string' ? JSON.parse(venue.gamingDetails) : venue.gamingDetails) : {};
    setPs5Count(gd.ps5Count || 0);
    setPs4Count(gd.ps4Count || 0);
    setPcCount(gd.pcCount || 0);
    setAvailableGames(gd.availableGames || '');
    setPs5SinglePrice(gd.ps5SinglePrice || 150);
    setPs5MultiPrice(gd.ps5MultiPrice || 250);
    setPs4SinglePrice(gd.ps4SinglePrice || 100);
    setPs4MultiPrice(gd.ps4MultiPrice || 180);
    setPcSinglePrice(gd.pcSinglePrice || 120);
    setPcMultiPrice(gd.pcMultiPrice || 120);

    setViewMode('edit');
  };

  const handleCreateNewClick = () => {
    if (paymentStatus !== 'active') {
      showAlert('Subscription Required', 'You must have an active SportSpot Premium subscription to register arenas. Please subscribe using the dashboard billing card.');
      return;
    }
    setEditingVenueId(null);
    setBoxName('');
    setAddress('');
    
    // Autofill from existing owned venue if available
    const existing = ownerVenues[0];
    setPhone(existing ? existing.phone : (localStorage.getItem('bcp_owner_phone') || ''));
    setCaretakerPhone(existing ? (existing.caretakerPhone || '') : (localStorage.getItem('bcp_caretaker_phone') || ''));
    setUpiId(existing ? existing.upiId : 'arena@upi');
    setUpiQrImage(existing ? existing.upiQrImage : '');

    setPricePerHour(800);
    setAdvancePercent(30);
    setTerms('1. 30% advance is required to confirm slot. 2. Cancellation allowed 24 hours prior.');
    setVenueImages([presetImages[0].url]);
    setVenueSports(['Box Cricket']);

    setPs5Count(0);
    setPs4Count(0);
    setPcCount(0);
    setAvailableGames('');
    setPs5SinglePrice(150);
    setPs5MultiPrice(250);
    setPs4SinglePrice(100);
    setPs4MultiPrice(180);
    setPcSinglePrice(120);
    setPcMultiPrice(120);

    setViewMode('create');
  };

  const handleDeleteClick = async (venue) => {
    const confirmed = await showConfirm(
      'Delete Arena 🏟️',
      `Are you sure you want to delete "${venue.name}"? This will permanently delete the arena, its bookings, and reviews.`
    );
    if (confirmed) {
      try {
        await deleteVenue(venue.id);
        await showAlert('Success', 'Venue deleted successfully.');
      } catch (err) {
        showError('Deletion Failed', err.message || 'Could not delete venue.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentStatus !== 'active') {
      await showError('Subscription Required', 'You must have an active SportSpot Premium subscription to register or update venues. Please pay from the dashboard billing card.');
      return;
    }
    if (!boxName || !address || !phone || !caretakerPhone) {
      await showError('Validation Error', 'Please fill out Arena Name, Address, Phone Number, and Caretaker Phone Number!');
      return;
    }

    const finalSports = venueSports.length > 0 ? venueSports : ['Box Cricket'];
    const finalSport = finalSports[0];

    const gamingDetails = {
      ps5Count: parseInt(ps5Count) || 0,
      ps4Count: parseInt(ps4Count) || 0,
      pcCount: parseInt(pcCount) || 0,
      availableGames: availableGames || '',
      ps5SinglePrice: parseInt(ps5SinglePrice) || 150,
      ps5MultiPrice: parseInt(ps5MultiPrice) || 250,
      ps4SinglePrice: parseInt(ps4SinglePrice) || 100,
      ps4MultiPrice: parseInt(ps4MultiPrice) || 180,
      pcSinglePrice: parseInt(pcSinglePrice) || 120,
      pcMultiPrice: parseInt(pcSinglePrice) || 120
    };

    let finalPricePerHour = parseInt(pricePerHour) || 800;
    if (finalSports.includes('Gaming')) {
      const minPrice = Math.min(
        gamingDetails.ps5Count > 0 ? gamingDetails.ps5SinglePrice : 9999,
        gamingDetails.ps4Count > 0 ? gamingDetails.ps4SinglePrice : 9999,
        gamingDetails.pcCount > 0 ? gamingDetails.pcSinglePrice : 9999
      );
      finalPricePerHour = minPrice === 9999 ? 150 : minPrice;
    }

    const venueData = {
      name: boxName,
      address,
      phone,
      caretakerPhone,
      pricePerHour: finalPricePerHour,
      advancePercent: parseInt(advancePercent) || 30,
      terms,
      images: venueImages.length > 0 ? venueImages : [presetImages[0].url],
      upiId: upiId || 'arena@upi',
      upiQrImage: upiQrImage || null,
      sport: finalSport,
      sports: finalSports,
      gamingDetails: finalSports.includes('Gaming') ? gamingDetails : null
    };

    try {
      if (viewMode === 'edit') {
        const editingVenue = venues.find(v => v.id === editingVenueId);
        const updated = {
          ...editingVenue,
          ...venueData,
          id: editingVenueId
        };
        await updateVenue(updated);
        await showAlert('Success', 'Venue Updated Successfully!');
      } else {
        const newVenueId = await registerVenue(venueData);
        setSelectedVenueId(newVenueId);
        await showAlert('Success', 'Venue Registered Successfully!');
      }
      setViewMode('list');
    } catch (err) {
      console.error("Failed to save venue:", err);
      await showError('Save Failed', err.message || 'Could not save venue details to server.');
    }
  };

  if (viewMode === 'list') {
    return (
      <div style={{...styles.container, padding: 16}}>
        <div style={styles.authHeader}>
          <h2 style={{color: "var(--text-primary)"}}>MANAGE YOUR ARENAS</h2>
          <p style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>Review, edit or add another sports arena</p>
        </div>

        {paymentStatus !== 'active' && (
          <div className="sporty-card glow-green" style={{
            padding: '16px',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, rgba(170, 255, 0, 0.04) 0%, rgba(0, 0, 0, 0.3) 100%)',
            border: '1.5px solid var(--primary)',
            borderRadius: 14,
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(170, 255, 0, 0.1)'
          }}>
            <span style={{fontSize: '2rem', display: 'block', marginBottom: 4}}>⚡</span>
            <h3 style={{color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-label)'}}>Subscription Action Required</h3>
            <p style={{color: 'var(--text-muted)', fontSize: '0.8rem', margin: '6px 0 12px 0', lineHeight: 1.4}}>
              Subscribe to a premium plan to make your arenas visible to players and accept bookings.
            </p>
            <button 
              onClick={() => setShowPayModal(true)} 
              className="btn-neon" 
              style={{padding: '8px 20px', fontSize: '0.85rem', fontWeight: 'bold'}}
            >
              SUBSCRIBE NOW ⚡
            </button>
          </div>
        )}

        <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20}}>
          {ownerVenues.map(venue => (
            <div key={venue.id} className="sporty-card" style={{padding: 16, display: 'flex', gap: 16, alignItems: 'center', borderColor: 'var(--border-light)'}}>
              <img 
                src={venue.images && venue.images.length > 0 ? venue.images[0] : presetImages[0].url} 
                alt={venue.name} 
                style={{width: 80, height: 80, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border-light)'}} 
              />
              <div style={{flex: 1}}>
                <h3 style={{
                  fontSize: '1.35rem', 
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-venue)',
                  fontWeight: '400',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                  margin: 0
                }}>{venue.name}</h3>
                <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4}}>📍 {venue.address}</p>
                <p style={{fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', marginTop: 4}}>₹{venue.pricePerHour}/hr · {venue.advancePercent}% Advance</p>
                <div style={{display: 'flex', gap: 5, marginTop: 6, flexWrap: 'wrap'}}>
                  {(() => {
                    const sportsList = Array.isArray(venue.sports) && venue.sports.length > 0
                      ? venue.sports
                      : [venue.sport || 'Box Cricket'];
                    return sportsList.map(sport => {
                      const sportDef = ALL_SPORTS.find(s => s.id === sport);
                      return (
                        <span key={sport} style={{
                          fontSize: '0.65rem', padding: '2px 8px', borderRadius: 4,
                          background: sportDef ? `${sportDef.color}22` : 'rgba(170,255,0,0.1)',
                          color: sportDef?.color || 'var(--primary)',
                          border: `1px solid ${sportDef?.color || 'var(--primary)'}`,
                          fontWeight: 'bold'
                        }}>
                          {sportDef?.label || sport}
                        </span>
                      );
                    });
                  })()}
                </div>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                <button 
                  onClick={() => handleEditClick(venue)} 
                  className="btn-neon" 
                  style={{padding: '6px 12px', fontSize: '0.78rem', width: 'auto'}}
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => {
                    setSelectedVenueId(venue.id);
                    setCurrentScreen('owner_dashboard');
                  }} 
                  className="btn-outlined" 
                  style={{padding: '6px 12px', fontSize: '0.78rem', width: 'auto'}}
                >
                  📊 View
                </button>
                <button 
                  onClick={() => handleDeleteClick(venue)} 
                  className="btn-outlined" 
                  style={{
                    padding: '6px 12px', 
                    fontSize: '0.78rem', 
                    width: 'auto', 
                    borderColor: '#dc143c', 
                    color: '#dc143c',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(220, 20, 60, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={handleCreateNewClick} 
          className="btn-neon" 
          style={{width: '100%', padding: '12px 0', fontSize: '1rem'}}
        >
          ➕ REGISTER ANOTHER ARENA 🏟️
        </button>
      </div>
    );
  }

  return (
    <div style={{...styles.container, padding: 20}}>
      <div style={styles.authHeader}>
        <h2 style={{color: "var(--text-primary)"}}>{viewMode === 'edit' ? 'EDIT VENUE DETAILS' : 'REGISTER YOUR VENUE'}</h2>
        <p style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>Fill out your sports venue profile details</p>
      </div>

      {paymentStatus !== 'active' && (
        <div className="sporty-card glow-green" style={{
          padding: '16px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, rgba(170, 255, 0, 0.04) 0%, rgba(0, 0, 0, 0.3) 100%)',
          border: '1.5px solid var(--primary)',
          borderRadius: 14,
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(170, 255, 0, 0.1)'
        }}>
          <span style={{fontSize: '2rem', display: 'block', marginBottom: 4}}>⚡</span>
          <h3 style={{color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-label)'}}>Subscription Action Required</h3>
          <p style={{color: 'var(--text-muted)', fontSize: '0.8rem', margin: '6px 0 12px 0', lineHeight: 1.4}}>
            Subscribe to a premium plan to make your arenas visible to players and accept bookings.
          </p>
          <button 
            onClick={() => setShowPayModal(true)} 
            className="btn-neon" 
            style={{padding: '8px 20px', fontSize: '0.85rem', fontWeight: 'bold'}}
          >
            SUBSCRIBE NOW ⚡
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 12}}>
        {/* SPORT TYPE SELECTOR - First & Required */}
        <div className="form-group">
          <label className="form-label" style={{color: 'var(--primary)', fontWeight: 700}}>⚡ Sports Offered (Select all that apply)</label>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8}}>
            {ALL_SPORTS.map(sport => {
              const isSelected = venueSports.includes(sport.id);
              return (
                <button
                  key={sport.id}
                  type="button"
                  onClick={() => {
                    setVenueSports(prev => {
                      if (prev.includes(sport.id)) {
                        if (prev.length === 1) return prev; // keep at least one
                        return prev.filter(s => s !== sport.id);
                      } else {
                        return [...prev, sport.id];
                      }
                    });
                  }}
                  style={{
                    padding: '10px 4px',
                    background: isSelected ? `${sport.color}22` : 'var(--bg-secondary)',
                    border: isSelected ? `1.5px solid ${sport.color}` : '1px solid var(--border-light)',
                    borderRadius: 8,
                    color: isSelected ? sport.color : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: isSelected ? 700 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                >
                  {sport.label}
                </button>
              );
            })}
          </div>
        </div>

        {venueSports.includes('Gaming') && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(15, 11, 30, 0.4) 100%)',
            border: '2px solid rgba(168, 85, 247, 0.3)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            boxShadow: '0 4px 15px rgba(168, 85, 247, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 'bold',
              color: '#c084fc',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 14
            }}>
              <span>🎮</span> Gaming Station & Pricing Setup
            </h3>

            {/* Counts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem', opacity: 0.9 }}>PS5 Count</label>
                <input 
                  type="number" 
                  min="0"
                  className="form-input" 
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(168, 85, 247, 0.2)' }}
                  value={ps5Count}
                  onChange={e => setPs5Count(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem', opacity: 0.9 }}>PS4 Pro Count</label>
                <input 
                  type="number" 
                  min="0"
                  className="form-input" 
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(168, 85, 247, 0.2)' }}
                  value={ps4Count}
                  onChange={e => setPs4Count(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem', opacity: 0.9 }}>Gaming PC Count</label>
                <input 
                  type="number" 
                  min="0"
                  className="form-input" 
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(168, 85, 247, 0.2)' }}
                  value={pcCount}
                  onChange={e => setPcCount(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
            </div>

            {/* Games list */}
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label" style={{ fontSize: '0.75rem', opacity: 0.9 }}>Available Games (Comma separated)</label>
              <input 
                type="text" 
                placeholder="e.g. FIFA 24, Tekken 8, Valorant, GTA V"
                className="form-input" 
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(168, 85, 247, 0.2)' }}
                value={availableGames}
                onChange={e => setAvailableGames(e.target.value)}
              />
            </div>

            {/* Pricing Details */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 4 }}>
                Hourly Pricing (₹)
              </div>

              {/* PS5 pricing */}
              {ps5Count > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.8rem', color: '#FFF' }}>PlayStation 5</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.5)' }}>Single Player</span>
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ padding: '6px 8px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(168, 85, 247, 0.2)', margin: 0 }}
                      value={ps5SinglePrice}
                      onChange={e => setPs5SinglePrice(Math.max(0, parseInt(e.target.value) || 0))}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.5)' }}>Multiplayer (Per Player)</span>
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ padding: '6px 8px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(168, 85, 247, 0.2)', margin: 0 }}
                      value={ps5MultiPrice}
                      onChange={e => setPs5MultiPrice(Math.max(0, parseInt(e.target.value) || 0))}
                    />
                  </div>
                </div>
              )}

              {/* PS4 pricing */}
              {ps4Count > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.8rem', color: '#FFF' }}>PS4 Pro</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.5)' }}>Single Player</span>
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ padding: '6px 8px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(168, 85, 247, 0.2)', margin: 0 }}
                      value={ps4SinglePrice}
                      onChange={e => setPs4SinglePrice(Math.max(0, parseInt(e.target.value) || 0))}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.5)' }}>Multiplayer (Per Player)</span>
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ padding: '6px 8px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(168, 85, 247, 0.2)', margin: 0 }}
                      value={ps4MultiPrice}
                      onChange={e => setPs4MultiPrice(Math.max(0, parseInt(e.target.value) || 0))}
                    />
                  </div>
                </div>
              )}

              {/* PC pricing */}
              {pcCount > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.8rem', color: '#FFF' }}>Gaming PC</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.5)' }}>Single Player Price</span>
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ padding: '6px 8px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(168, 85, 247, 0.2)', margin: 0 }}
                      value={pcSinglePrice}
                      onChange={e => setPcSinglePrice(Math.max(0, parseInt(e.target.value) || 0))}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Venue / Complex Name</label>
          <input 
            type="text" 
            placeholder="e.g. Smash Sports Complex"
            className="form-input"
            value={boxName}
            maxLength={100}
            onChange={e => setBoxName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Address</label>
          <input 
            type="text" 
            placeholder="Arena street address, city" 
            className="form-input"
            value={address}
            maxLength={255}
            onChange={e => setAddress(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Owner Contact Number</label>
          <input 
            type="tel" 
            placeholder="e.g. +91 98765 43210" 
            className="form-input"
            value={phone}
            maxLength={15}
            onChange={e => setPhone(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Caretaker Phone Number</label>
          <input 
            type="tel" 
            placeholder="e.g. +91 98765 43210" 
            className="form-input"
            value={caretakerPhone}
            maxLength={15}
            onChange={e => setCaretakerPhone(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">UPI ID for Direct Payments</label>
          <input 
            type="text" 
            placeholder="e.g. smashbox@okaxis" 
            className="form-input"
            value={upiId}
            maxLength={100}
            onChange={e => setUpiId(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">UPI QR Code Scanner (Image Upload)</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setUpiQrImage(reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
            style={{ display: 'none' }}
            id="upi-qr-upload"
          />
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 6 }}>
            <label htmlFor="upi-qr-upload" className="btn-outlined" style={{ padding: '8px 16px', fontSize: '0.82rem', cursor: 'pointer', margin: 0, width: 'auto' }}>
              📁 Choose QR Image
            </label>
            {upiQrImage ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={upiQrImage} alt="QR Scanner" style={{ width: 45, height: 45, objectFit: 'contain', border: '1px dashed var(--primary)', borderRadius: 6, backgroundColor: '#FFF' }} />
                <span style={{ fontSize: '0.75rem', color: '#ff4444', cursor: 'pointer', fontWeight: 600 }} onClick={() => setUpiQrImage('')}>Remove ❌</span>
              </div>
            ) : (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No scanner uploaded</span>
            )}
          </div>
        </div>

        <div style={{display: 'flex', gap: 16}}>
          {!venueSports.includes('Gaming') && (
            <div className="form-group" style={{flex: 1}}>
              <label className="form-label">Hourly Price (₹)</label>
              <input 
                type="number" 
                className="form-input"
                value={pricePerHour}
                onChange={e => setPricePerHour(e.target.value.slice(0, 5))}
              />
            </div>
          )}
          <div className="form-group" style={{flex: 1}}>
            <label className="form-label">Advance Required (%)</label>
            <select 
              className="form-input" 
              value={advancePercent}
              onChange={e => setAdvancePercent(e.target.value)}
            >
              <option value="10">10%</option>
              <option value="20">20%</option>
              <option value="30">30%</option>
              <option value="40">40%</option>
              <option value="50">50%</option>
              <option value="100">100%</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">📸 Venue Photos (Add Multiple)</label>
          
          {/* Current Images Grid */}
          {venueImages.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              {venueImages.map((imgUrl, idx) => (
                <div key={idx} style={{
                  position: 'relative',
                  width: 80,
                  height: 70,
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: idx === 0 ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.15)'
                }}>
                  <img src={imgUrl} alt={`Venue ${idx+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {idx === 0 && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'rgba(0,0,0,0.65)', fontSize: '0.58rem',
                      textAlign: 'center', padding: '2px 0', color: 'var(--primary)', fontWeight: 700
                    }}>COVER</div>
                  )}
                  <button
                    type="button"
                    onClick={() => setVenueImages(prev => prev.filter((_, i) => i !== idx))}
                    style={{
                      position: 'absolute', top: 3, right: 3,
                      width: 18, height: 18, borderRadius: '50%',
                      background: 'rgba(220,38,38,0.9)', border: 'none',
                      color: '#FFF', fontSize: '0.65rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      lineHeight: 1, padding: 0
                    }}
                  >✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Add Photo Options */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {/* Preset quick-adds */}
            {presetImages.map(img => (
              <div
                key={img.label}
                onClick={() => {
                  if (!venueImages.includes(img.url)) {
                    setVenueImages(prev => [...prev, img.url]);
                  }
                }}
                style={{
                  width: 70, height: 60, cursor: 'pointer',
                  border: venueImages.includes(img.url) ? '2px solid var(--primary)' : '1px dashed rgba(255,255,255,0.2)',
                  borderRadius: 8, overflow: 'hidden', position: 'relative', opacity: venueImages.includes(img.url) ? 0.5 : 1
                }}
              >
                <img src={img.url} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'rgba(0,0,0,0.6)', fontSize: '0.6rem',
                  textAlign: 'center', padding: '2px 0', color: '#FFF'
                }}>{img.label}</div>
              </div>
            ))}

            {/* Custom Upload */}
            <div
              onClick={() => document.getElementById('custom-cover-upload').click()}
              style={{
                width: 70, height: 60, cursor: 'pointer',
                border: '1px dashed rgba(255,255,255,0.2)',
                borderRadius: 8, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.02)'
              }}
            >
              <input
                type="file"
                id="custom-cover-upload"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  files.forEach(file => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setVenueImages(prev => [...prev, reader.result]);
                    };
                    reader.readAsDataURL(file);
                  });
                  e.target.value = '';
                }}
                style={{ display: 'none' }}
              />
              <span style={{fontSize: '1.2rem'}}>📁</span>
              <span style={{fontSize: '0.55rem', color: 'rgba(255,255,255,0.6)', marginTop: 2, textAlign: 'center'}}>Upload</span>
            </div>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 6 }}>First image is the cover. Tap ✕ to remove any image.</p>
        </div>

        <div className="form-group">
          <label className="form-label">Booking Terms & Conditions</label>
          <textarea 
            className="form-input" 
            rows="3" 
            style={{background: 'rgba(0,0,0,0.3)', resize: 'none'}}
            value={terms}
            maxLength={500}
            onChange={e => setTerms(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-neon" style={{marginTop: 12}}>
          {viewMode === 'edit' ? 'UPDATE VENUE 🏟' : 'REGISTER VENUE 🏟'}
        </button>

        {ownerVenues.length > 0 && (
          <button 
            type="button" 
            onClick={() => setViewMode('list')} 
            className="btn-outlined" 
            style={{marginTop: 8, width: '100%', padding: '12px 0'}}
          >
            CANCEL
          </button>
        )}
      </form>
    </div>
  );
}

/* ==========================================================================
   3. PLAYER / USER HOME
   ========================================================================== */
function PlayerHomeView() {
  const { 
    setCurrentScreen, 
    venues, 
    liveMatch, 
    setSelectedVenueId, 
    userName, 
    checkUsernameUnique, 
    updateUsernameOnBackend, 
    playerSportsInterests, 
    selectedSportFilter, 
    setSelectedSportFilter,
    teams,
    userRole,
    userPhone,
    showAlert,
    gpsStatus,
    requestGpsLocation,
    isDataLoading
  } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(!userName);
  const [draftUsername, setDraftUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveUsername = async () => {
    const trimmed = draftUsername.trim();
    if (!trimmed) {
      setUsernameError('Username cannot be empty.');
      return;
    }
    if (trimmed.length < 3) {
      setUsernameError('Username must be at least 3 characters.');
      return;
    }
    if (trimmed.length > 20) {
      setUsernameError('Username must be 20 characters or fewer.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setUsernameError('Only letters, numbers and underscores allowed.');
      return;
    }

    setSaving(true);
    setUsernameError('');

    try {
      const isUnique = await checkUsernameUnique(trimmed);
      if (!isUnique) {
        setUsernameError('This username is already taken by another user.');
        setSaving(false);
        return;
      }

      await updateUsernameOnBackend(trimmed);
      setShowUsernameModal(false);
    } catch (err) {
      setUsernameError(err.message || 'Failed to save username. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLiveCardClick = () => {
    if (userRole === 'admin' || userRole === 'scorer') {
      setCurrentScreen('live_scorecard');
      return;
    }

    const normalizedUser = (userName || '').trim().toLowerCase();
    const normalizedPhone = (userPhone || '').trim().replace(/\D/g, '');

    let isAdded = false;
    for (const team of teams) {
      if (team.players && Array.isArray(team.players)) {
        for (const player of team.players) {
          const playerName = (player.name || '').trim().toLowerCase();
          const playerPhone = (player.phone || '').trim().replace(/\D/g, '');
          if (
            (normalizedUser && playerName && playerName === normalizedUser) ||
            (normalizedPhone && playerPhone && playerPhone === normalizedPhone)
          ) {
            isAdded = true;
            break;
          }
        }
      }
      if (isAdded) break;
    }

    if (isAdded) {
      setCurrentScreen('live_scorecard');
    } else {
      showAlert('Access Denied', 'You can only watch the live score if your name is added to a team player list. Please ask your Team Captain or Venue Partner to add you.');
    }
  };

  // Build sport filter tabs: 'All' + all sports (excluding Gaming)
  const displayTabs = ['All', ...ALL_SPORTS.filter(s => s.id !== 'Gaming').map(s => s.id)];

  const getSportIcon = (sport) => {
    const found = ALL_SPORTS.find(s => s.id === sport);
    return found ? found.label.split(' ')[0] : '🏟️';
  };

  const filteredVenues = venues.filter(v => {
    if (v.ownerPaymentStatus !== 'active') return false;
    const sportsList = Array.isArray(v.sports) && v.sports.length > 0 ? v.sports : [v.sport || 'Box Cricket'];
    if (sportsList.includes('Gaming')) return false;

    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSportFilter === 'All' || sportsList.includes(selectedSportFilter);
    return matchesSearch && matchesSport;
  });

  const sortedFilteredVenues = [...filteredVenues].sort((a, b) => {
    const distA = parseFloat(a.distance) || 0;
    const distB = parseFloat(b.distance) || 0;
    return distA - distB;
  });


  return (
    <div style={{...styles.container, padding: 16}}>

      {/* USERNAME SETUP MODAL */}
      {showUsernameModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24
        }}>
          <div style={{
            background: 'var(--bg-primary)', border: '2px solid var(--primary)',
            borderRadius: 16, padding: 28, width: '100%', maxWidth: 380,
            boxShadow: '0 8px 32px rgba(220,20,60,0.18)'
          }}>
            <div style={{textAlign: 'center', marginBottom: 20}}>
              <span style={{fontSize: '2.5rem'}}>👤</span>
              <h2 style={{fontSize: '1.4rem', color: 'var(--text-primary)', marginTop: 8}}>
                Choose Your Username
              </h2>
              <p style={{fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5}}>
                This is your public display name — visible to other players on leaderboards and scoreboards.
              </p>
            </div>

            <div style={{marginBottom: 16}}>
              <label style={{fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6}}>
                Username
              </label>
              <input
                className="input-field"
                autoFocus
                placeholder="e.g. SixHitter99"
                value={draftUsername}
                maxLength={20}
                onChange={e => { setDraftUsername(e.target.value); setUsernameError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleSaveUsername()}
                style={{width: '100%', boxSizing: 'border-box'}}
              />
              {usernameError && (
                <p style={{color: 'var(--error, #dc143c)', fontSize: '0.78rem', marginTop: 6, fontWeight: 600}}>
                  ⚠ {usernameError}
                </p>
              )}
              <p style={{fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6}}>
                3–20 chars · letters, numbers, underscores only
              </p>
            </div>

            <button className="btn-neon" style={{width: '100%', padding: '12px 0', fontSize: '1rem'}} onClick={handleSaveUsername} disabled={saving}>
              {saving ? 'SAVING...' : "LET'S PLAY 🚀"}
            </button>
          </div>
        </div>
      )}

      {/* PlayStation Gaming Hub Banner */}
      <div
        onClick={() => {
          setSelectedVenueId(null);
          setCurrentScreen('gaming_hub');
        }}
        style={{
          padding: '16px 18px',
          background: 'linear-gradient(135deg, #0D1117 0%, #161B22 60%, #0D1117 100%)',
          borderRadius: 16,
          cursor: 'pointer',
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          border: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <div style={{flex: 1}}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: '0.58rem',
            backgroundColor: 'rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.8)',
            padding: '2px 8px',
            borderRadius: 4,
            fontWeight: '700',
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            marginBottom: 8,
            fontFamily: 'var(--font-label)'
          }}>
            <span style={{width:5,height:5,borderRadius:'50%',background:'#22C55E',display:'inline-block',boxShadow:'0 0 6px #22C55E'}}></span>
            NOW LIVE
          </div>
          <h4 style={{fontSize: '1.2rem', color: '#FFFFFF', margin: '0 0 4px 0', fontWeight: 800, fontFamily: 'var(--font-label)', letterSpacing: '-0.2px', lineHeight: 1.2}}>PlayStation Gaming Hub</h4>
          <p style={{fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', margin: '0 0 12px 0', fontFamily: 'var(--font-body)'}}>Book PS5, PS4 Pro &amp; Gaming PCs from ₹80/hr</p>
          <button style={{
            background: '#FFFFFF',
            color: '#0D1117',
            border: 'none',
            borderRadius: 20,
            padding: '7px 14px',
            fontSize: '0.75rem',
            fontWeight: '700',
            fontFamily: 'var(--font-label)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5
          }}>
            Explore now <span style={{fontSize:'0.85rem'}}>→</span>
          </button>
        </div>
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.07)',
          width: 48, height: 48,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{fontSize: '1.5rem'}}>🎮</span>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          type="text"
          placeholder="Search venues by name or area..."
          style={{
            width: '100%',
            background: '#F3F4F6',
            border: '1px solid #E5E7EB',
            borderRadius: 25,
            padding: '11px 16px 11px 40px',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-body)',
            color: 'var(--text-primary)',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          value={searchTerm}
          maxLength={100}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* SPORT FILTER CHIPS */}
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6,
        msOverflowStyle: 'none', scrollbarWidth: 'none', marginBottom: 8
      }}>
        {displayTabs.map(tab => {
          const isActive = selectedSportFilter === tab;
          return (
            <button
              key={tab}
              onClick={() => setSelectedSportFilter(tab)}
              style={{
                flexShrink: 0,
                padding: '7px 16px',
                borderRadius: 25,
                border: isActive ? 'none' : '1.5px solid #D1D5DB',
                backgroundColor: isActive ? 'var(--primary)' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#374151',
                fontSize: '0.8rem',
                fontWeight: isActive ? '700' : '500',
                fontFamily: 'var(--font-label)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                letterSpacing: '0.1px',
                boxShadow: isActive ? '0 2px 8px rgba(220,38,38,0.25)' : 'none'
              }}
            >
              {tab === 'All' ? 'All Sports' : tab}
            </button>
          );
        })}
      </div>

      {/* Result count */}
      <p style={{ fontSize: '0.72rem', color: '#9CA3AF', margin: '0 0 12px 0', fontFamily: 'var(--font-body)' }}>
        {selectedSportFilter === 'All' ? 'Showing all venues' : `Filtered: ${selectedSportFilter}`} · {filteredVenues.length} found
      </p>

      {/* Live Match Summary Banner (Conditional Empty State) */}
      {isDataLoading ? (
        <div className="sporty-card" style={{ ...styles.liveBannerCard, pointerEvents: 'none', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="shimmer" style={{ width: 150, height: 12, borderRadius: 4 }} />
            <div className="shimmer" style={{ width: 60, height: 12, borderRadius: 4 }} />
          </div>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="shimmer" style={{ width: 120, height: 18, borderRadius: 4, marginBottom: 8 }} />
              <div className="shimmer" style={{ width: 80, height: 12, borderRadius: 4 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div className="shimmer" style={{ width: 80, height: 28, borderRadius: 4, marginBottom: 4 }} />
              <div className="shimmer" style={{ width: 60, height: 12, borderRadius: 4 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 14, borderTop: '1px solid var(--border-light)', paddingTop: 10 }}>
            <div className="shimmer" style={{ width: 50, height: 10, borderRadius: 4 }} />
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="shimmer" style={{ width: 22, height: 22, borderRadius: '50%' }} />
            ))}
          </div>
        </div>
      ) : liveMatch ? (
        <div 
          className="sporty-card glow-green" 
          onClick={handleLiveCardClick}
          style={styles.liveBannerCard}
        >
          {(!liveMatch.sport || liveMatch.sport === 'Cricket') ? (
            <>
              <div className="flex-between">
                <div className="live-indicator">
                  <span className="live-dot" /> LIVE SCOREBOARD · {liveMatch.innings === 1 ? '1st Innings' : `2nd Innings (Target: ${liveMatch.target})`}
                </div>
                <span style={{color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-heading)'}}>CRR: {liveMatch.crr}</span>
              </div>
              <div style={{marginTop: 12}} className="flex-between">
                <div style={{textAlign: 'left'}}>
                  <h4 style={{fontSize: '1.1rem', color: "var(--text-primary)"}}>
                    {liveMatch.innings === 1 ? `${liveMatch.team1}*` : `${liveMatch.team1}`} vs {liveMatch.innings === 2 ? `${liveMatch.team2}*` : `${liveMatch.team2}`}
                  </h4>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>
                    {liveMatch.innings === 1 ? 'First Innings Batting' : `Chasing target of ${liveMatch.target}`}
                  </p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <h2 className="text-gold" style={{fontSize: '2rem'}}>{liveMatch.runs}/{liveMatch.wickets}</h2>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>({Math.floor(liveMatch.balls / 6)}.{liveMatch.balls % 6} Overs)</p>
                </div>
              </div>
              {liveMatch.toss && (
                <div style={{marginTop: 6, fontSize: '0.72rem', color: 'var(--primary)', fontStyle: 'italic', fontWeight: '500'}}>
                  🪙 {liveMatch.toss.text}
                </div>
              )}
              {liveMatch.innings === 2 && !liveMatch.isCompleted && (
                <p style={{fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 'bold', marginTop: 8, borderTop: '1px dashed var(--border-light)', paddingTop: 6, width: '100%'}}>
                  ⚡ Needs {liveMatch.target - liveMatch.runs} runs in {Math.max(0, (liveMatch.maxOvers * 6) - liveMatch.balls)} balls (Req RR: {(((liveMatch.target - liveMatch.runs) / (Math.max(1, (liveMatch.maxOvers * 6) - liveMatch.balls) / 6))).toFixed(2)})
                </p>
              )}
              <div style={styles.liveBallsRow}>
                <span style={{color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase'}}>Last Balls:</span>
                {liveMatch.lastBalls.map((b, i) => (
                  <span 
                    key={i} 
                    style={{
                      ...styles.ballCircle,
                      backgroundColor: b === 'W' ? 'var(--danger)' : b === '6' ? 'var(--primary)' : b === '4' ? 'var(--primary)' : 'var(--border-light)'
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </>
          ) : liveMatch.sport === 'Football' ? (
            <>
              <div className="flex-between">
                <div className="live-indicator">
                  <span className="live-dot" /> LIVE FOOTBALL MATCH
                </div>
                <span style={{color: 'var(--text-muted)', fontSize: '0.75rem'}}>{liveMatch.venue}</span>
              </div>
              <div style={{marginTop: 12}} className="flex-between">
                <div style={{textAlign: 'left'}}>
                  <h4 style={{fontSize: '1.1rem', color: "var(--text-primary)"}}>{liveMatch.team1} vs {liveMatch.team2}</h4>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Fouls: {liveMatch.fouls1} - {liveMatch.fouls2}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <h2 className="text-gold" style={{fontSize: '2rem'}}>{liveMatch.goals1} - {liveMatch.goals2}</h2>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Live Scored</p>
                </div>
              </div>
            </>
          ) : liveMatch.sport === 'Volleyball' ? (
            <>
              <div className="flex-between">
                <div className="live-indicator">
                  <span className="live-dot" /> LIVE VOLLEYBALL MATCH
                </div>
                <span style={{color: 'var(--text-muted)', fontSize: '0.75rem'}}>Set {liveMatch.currentSet}</span>
              </div>
              <div style={{marginTop: 12}} className="flex-between">
                <div style={{textAlign: 'left'}}>
                  <h4 style={{fontSize: '1.1rem', color: "var(--text-primary)"}}>{liveMatch.team1} vs {liveMatch.team2}</h4>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Sets: {liveMatch.sets1} - {liveMatch.sets2}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <h2 className="text-gold" style={{fontSize: '2rem'}}>{liveMatch.points1} - {liveMatch.points2}</h2>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Current Set Points</p>
                </div>
              </div>
            </>
          ) : liveMatch.sport === 'Basketball' ? (
            <>
              <div className="flex-between">
                <div className="live-indicator">
                  <span className="live-dot" /> LIVE BASKETBALL MATCH
                </div>
                <span style={{color: 'var(--text-muted)', fontSize: '0.75rem'}}>Period {liveMatch.period}</span>
              </div>
              <div style={{marginTop: 12}} className="flex-between">
                <div style={{textAlign: 'left'}}>
                  <h4 style={{fontSize: '1.1rem', color: "var(--text-primary)"}}>{liveMatch.team1} vs {liveMatch.team2}</h4>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Fouls: {liveMatch.fouls1} - {liveMatch.fouls2}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <h2 className="text-gold" style={{fontSize: '2rem'}}>{liveMatch.points1} - {liveMatch.points2}</h2>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Live Scored</p>
                </div>
              </div>
            </>
          ) : liveMatch.sport === 'Pickleball' ? (
            <>
              <div className="flex-between">
                <div className="live-indicator">
                  <span className="live-dot" /> LIVE PICKLEBALL MATCH
                </div>
                <span style={{color: 'var(--text-muted)', fontSize: '0.75rem'}}>Set {liveMatch.currentSet}</span>
              </div>
              <div style={{marginTop: 12}} className="flex-between">
                <div style={{textAlign: 'left'}}>
                  <h4 style={{fontSize: '1.1rem', color: "var(--text-primary)"}}>{liveMatch.team1} vs {liveMatch.team2}</h4>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Sets: {liveMatch.sets1} - {liveMatch.sets2}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <h2 className="text-gold" style={{fontSize: '2rem'}}>{liveMatch.points1} - {liveMatch.points2}</h2>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Current Set Points</p>
                </div>
              </div>
            </>
          ) : liveMatch.sport === 'Golf' ? (
            <>
              <div className="flex-between">
                <div className="live-indicator">
                  <span className="live-dot" /> LIVE GOLF MATCH
                </div>
                <span style={{color: 'var(--text-muted)', fontSize: '0.75rem'}}>Hole {liveMatch.currentHole} of {liveMatch.totalHoles}</span>
              </div>
              <div style={{marginTop: 12}} className="flex-between">
                <div style={{textAlign: 'left'}}>
                  <h4 style={{fontSize: '1.1rem', color: "var(--text-primary)"}}>{liveMatch.team1} vs {liveMatch.team2}</h4>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Par: {liveMatch.parValues.reduce((a, b) => a + b, 0)}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <h2 className="text-gold" style={{fontSize: '2rem'}}>
                    {liveMatch.strokes1.reduce((a, b) => a + b, 0)} - {liveMatch.strokes2.reduce((a, b) => a + b, 0)}
                  </h2>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Total Strokes</p>
                </div>
              </div>
            </>
          ) : (liveMatch.sport === 'Hockey' || liveMatch.sport === 'Ice Hockey') ? (
            <>
              <div className="flex-between">
                <div className="live-indicator">
                  <span className="live-dot" /> LIVE {liveMatch.sport.toUpperCase()} MATCH
                </div>
                <span style={{color: 'var(--text-muted)', fontSize: '0.75rem'}}>Period {liveMatch.period}</span>
              </div>
              <div style={{marginTop: 12}} className="flex-between">
                <div style={{textAlign: 'left'}}>
                  <h4 style={{fontSize: '1.1rem', color: "var(--text-primary)"}}>{liveMatch.team1} vs {liveMatch.team2}</h4>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Shots: {liveMatch.shots1} - {liveMatch.shots2}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <h2 className="text-gold" style={{fontSize: '2rem'}}>{liveMatch.goals1} - {liveMatch.goals2}</h2>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Live Scored</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex-between">
                <div className="live-indicator">
                  <span className="live-dot" /> LIVE SKATING PERFORMANCE
                </div>
                <span style={{color: 'var(--text-muted)', fontSize: '0.75rem'}}>Judging Active</span>
              </div>
              <div style={{marginTop: 12}} className="flex-between">
                <div style={{textAlign: 'left'}}>
                  <h4 style={{fontSize: '1.1rem', color: "var(--text-primary)"}}>{liveMatch.team1} vs {liveMatch.team2}</h4>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Tech/Art: {liveMatch.technicalScore1.toFixed(1)}/{liveMatch.artisticScore1.toFixed(1)} vs {liveMatch.technicalScore2.toFixed(1)}/{liveMatch.artisticScore2.toFixed(1)}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <h2 className="text-gold" style={{fontSize: '1.8rem'}}>{liveMatch.totalScore1.toFixed(2)} - {liveMatch.totalScore2.toFixed(2)}</h2>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Total Scores</p>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #E5E7EB',
          borderRadius: 16,
          padding: '28px 20px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: 10 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', fontWeight: '700', color: '#111827', fontFamily: 'var(--font-label)' }}>No ongoing live match</h4>
          <p style={{ fontSize: '0.78rem', color: '#6B7280', lineHeight: 1.5, fontFamily: 'var(--font-body)', margin: 0 }}>
            Check back later for <span style={{ color: 'var(--primary)' }}>live score updates</span> of ongoing games.
          </p>
        </div>
      )}

      {/* Nearby Venues list */}
      <div style={{ marginTop: 24 }}>

        <h3 style={{
          marginBottom: 14,
          fontSize: '1.2rem',
          fontWeight: '800',
          fontFamily: 'var(--font-label)',
          color: '#111827',
          letterSpacing: '-0.2px'
        }}>Nearby Arenas ({sortedFilteredVenues.length})</h3>
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          {isDataLoading ? (
            [1, 2, 3].map(i => (
              <div key={i} style={{
                background: 'var(--bg-surface)',
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid var(--border-light)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.07)'
              }}>
                {/* Image section skeleton */}
                <div className="shimmer" style={{ width: '100%', height: 180 }} />
                
                {/* Card body skeleton */}
                <div style={{ padding: '14px 16px 16px' }}>
                  {/* Title */}
                  <div className="shimmer" style={{ height: 18, width: '55%', borderRadius: 4, marginBottom: 8 }} />
                  {/* Address */}
                  <div className="shimmer" style={{ height: 12, width: '75%', borderRadius: 4, marginBottom: 12 }} />
                  
                  {/* Info row */}
                  <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                    <div className="shimmer" style={{ height: 12, width: 80, borderRadius: 4 }} />
                    <div className="shimmer" style={{ height: 12, width: 90, borderRadius: 4 }} />
                  </div>
                  
                  {/* Divider */}
                  <div style={{ height: 1, background: 'var(--border-light)', marginBottom: 14 }} />
                  
                  {/* Price + Button row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="shimmer" style={{ height: 22, width: 70, borderRadius: 4 }} />
                    <div className="shimmer" style={{ height: 38, width: 105, borderRadius: 25 }} />
                  </div>
                </div>
              </div>
            ))
          ) : sortedFilteredVenues.length > 0 ? (
            sortedFilteredVenues.map(v => {
              const sportsList = Array.isArray(v.sports) && v.sports.length > 0
                ? v.sports
                : [v.sport || 'Box Cricket'];

              return (
                <div key={v.id} style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: '1px solid var(--border-light)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}>
                  {/* Image with overlaid badges */}
                  <div style={{ position: 'relative' }}>
                    <img
                      src={v.images[0]}
                      alt={v.name}
                      style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
                    />
                    {/* Sport badge — top left overlay */}
                    <div style={{
                      position: 'absolute', top: 10, left: 10,
                      display: 'flex', gap: 5, flexWrap: 'wrap'
                    }}>
                      {sportsList.slice(0, 2).map(sport => {
                        const sportDef = ALL_SPORTS.find(s => s.id === sport);
                        return (
                          <span key={sport} style={{
                            backgroundColor: 'rgba(255,255,255,0.92)',
                            color: '#111',
                            fontSize: '0.68rem',
                            fontWeight: '700',
                            fontFamily: 'var(--font-label)',
                            padding: '3px 10px',
                            borderRadius: 20,
                            backdropFilter: 'blur(6px)',
                            letterSpacing: '0.2px',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
                          }}>
                            {getSportIcon(sport)} {sport}
                          </span>
                        );
                      })}
                    </div>
                    {/* Rating badge — top right overlay */}
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      backgroundColor: 'rgba(255,255,255,0.92)',
                      borderRadius: 10,
                      padding: '3px 9px',
                      display: 'flex', alignItems: 'center', gap: 4,
                      backdropFilter: 'blur(6px)',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
                    }}>
                      <span style={{ fontSize: '0.78rem' }}>⭐</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#111', fontFamily: 'var(--font-label)' }}>{v.rating}</span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '14px 16px 16px' }}>
                    {/* Venue name */}
                    <h4 style={{
                      fontSize: '1.05rem',
                      fontFamily: 'var(--font-label)',
                      fontWeight: '800',
                      color: '#111827',
                      margin: '0 0 5px 0',
                      lineHeight: 1.3,
                      letterSpacing: '-0.1px'
                    }}>{v.name}</h4>

                    {/* Address */}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        fontSize: '0.76rem',
                        color: '#6B7280',
                        textDecoration: 'none',
                        marginBottom: 8
                      }}
                    >
                      <MapPin size={13} color="var(--primary)" style={{ flexShrink: 0 }} />
                      {v.address}
                    </a>

                    {/* Info row */}
                    <div style={{ display: 'flex', gap: 16, marginBottom: 14, alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.76rem', color: '#6B7280' }}>
                        <MapPin size={13} color="#9CA3AF" style={{ flexShrink: 0 }} /> {v.distance} km away
                      </span>
                      {sportsList.includes('Gaming') ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.76rem', color: '#6B7280' }}>
                          <Layers size={13} color="#9CA3AF" style={{ flexShrink: 0 }} /> PS5 &amp; Gaming PCs
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.76rem', color: '#6B7280' }}>
                          <Layers size={13} color="#9CA3AF" style={{ flexShrink: 0 }} /> {v.pitchType}
                        </span>
                      )}
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: 'var(--border-light)', marginBottom: 14 }} />

                    {/* Price + Book button row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyComposite: 'space-between', justifyContent: 'space-between' }}>
                      <div>
                        {(() => {
                          if (sportsList.includes('Gaming')) {
                            const gd = v.gamingDetails ? (typeof v.gamingDetails === 'string' ? JSON.parse(v.gamingDetails) : v.gamingDetails) : null;
                            if (gd) {
                              const minPrice = Math.min(
                                gd.ps5Count > 0 ? gd.ps5SinglePrice : 9999,
                                gd.ps4Count > 0 ? gd.ps4SinglePrice : 9999,
                                gd.pcCount > 0 ? gd.pcSinglePrice : 9999
                              );
                              return (
                                <span style={{ fontFamily: 'var(--font-label)', fontWeight: '800', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                                  ₹{minPrice === 9999 ? v.pricePerHour : minPrice}
                                  <span style={{ fontSize: '0.72rem', fontWeight: '400', color: 'var(--text-muted)' }}>/hr</span>
                                </span>
                              );
                            }
                          }
                          return (
                            <span style={{ fontFamily: 'var(--font-label)', fontWeight: '800', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                              ₹{v.pricePerHour}
                              <span style={{ fontSize: '0.72rem', fontWeight: '400', color: 'var(--text-muted)' }}>/hr</span>
                            </span>
                          );
                        })()}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedVenueId(v.id);
                          setCurrentScreen('venue_detail');
                        }}
                        style={{
                          background: 'var(--primary)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 25,
                          padding: '11px 22px',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          fontFamily: 'var(--font-label)',
                          letterSpacing: '0.2px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          boxShadow: '0 4px 12px rgba(220,38,38,0.3)',
                          transition: 'transform 0.15s, box-shadow 0.15s',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(220,38,38,0.4)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(220,38,38,0.3)'; }}
                      >
                        Book Slot →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="sporty-card" style={{textAlign: 'center', padding: 24}}>
              <span style={{fontSize: '2rem'}}>🏟️</span>
              <h4 style={{marginTop: 10, fontSize: '1rem', color: "var(--text-primary)"}}>No registered boxes nearby</h4>
              <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4}}>
                Create a Venue Partner account and register your arena details to go live!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. VENUE DETAIL & BOOKING
   ========================================================================== */
function VenueDetailView() {
  const { setCurrentScreen, venues, bookSlot, loyaltyVisits, selectedVenueId, bookings, addVenueReview, showAlert, showError } = useAppState();
  
  const selectedVenue = venues.find(v => v.id === selectedVenueId);
  const isGamingVenue = selectedVenue && (selectedVenue.sport === 'Gaming' || (Array.isArray(selectedVenue.sports) && selectedVenue.sports.includes('Gaming')));
  if (selectedVenueId === 'gaming-hub' || isGamingVenue) {
    return <GamingHubView />;
  }

  // Payment state
  const [showPayment, setShowPayment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // Reviews submission state
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const venue = venues.find(v => v.id === selectedVenueId) || venues[0];

  // Helper to format date as "D MMM" (e.g., "25 May")
  const formatDateToLabel = (dateObj) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${dateObj.getDate()} ${months[dateObj.getMonth()]}`;
  };

  const getSelectableDates = () => {
    const today = new Date();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const list = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const label = i === 0 ? 'Today' : daysOfWeek[d.getDay()];
      list.push({ label, date: formatDateToLabel(d), year: d.getFullYear() });
    }
    return list;
  };

  const selectableDates = getSelectableDates();

  const [selectedDate, setSelectedDate] = useState(selectableDates[0].date);
  const [selectedSlotTimes, setSelectedSlotTimes] = useState([]);

  const selectedDateItem = selectableDates.find(d => d.date === selectedDate);
  const selectedYear = selectedDateItem ? selectedDateItem.year : new Date().getFullYear();

  const venueSlots = venue?.timeSlots || [];
  const duration = selectedSlotTimes.length;

  const isSelected = (slotTime) => selectedSlotTimes.includes(slotTime);

  // Helper to check if a slot is in the past for today's date
  const isSlotInPast = (dateStr, slotTimeRange) => {
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const todayStr = `${today.getDate()} ${months[today.getMonth()]}`;
    
    if (dateStr !== todayStr) {
      return false; // Not today
    }
    
    const startStr = slotTimeRange.split(' - ')[0];
    const [timePart, ampm] = startStr.split(' ');
    let [hourStr, minStr] = timePart.split(':');
    let hour = parseInt(hourStr);
    const minutes = parseInt(minStr) || 0;
    
    if (ampm === 'PM' && hour !== 12) {
      hour += 12;
    } else if (ampm === 'AM' && hour === 12) {
      hour = 0;
    }
    
    const slotDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, minutes);
    return slotDateTime < today;
  };

  // Check if any selected slot is already booked or is in the past
  const hasConflict = venue ? selectedSlotTimes.some(slotTime => 
    bookings.some(b => b.venueId === venue.id && b.date === `${selectedDate} ${selectedYear}` && b.timeSlot === slotTime) ||
    isSlotInPast(selectedDate, slotTime)
  ) : false;

  const handleSlotClick = (slotTime) => {
    const isBooked = bookings.some(b => b.venueId === venue.id && b.date === `${selectedDate} ${selectedYear}` && b.timeSlot === slotTime);
    const passed = isSlotInPast(selectedDate, slotTime);
    if (isBooked || passed) return;

    setSelectedSlotTimes(prev => 
      prev.includes(slotTime) ? prev.filter(t => t !== slotTime) : [...prev, slotTime]
    );
  };

  if (!venue) {
    return (
      <div style={{...styles.container, padding: 20, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
        <span style={{fontSize: '3rem'}}>🏟️</span>
        <h3 style={{marginTop: 20, color: "var(--text-primary)"}}>No Arena Selected</h3>
        <p style={{color: 'var(--text-muted)', marginTop: 10, fontSize: '0.9rem', textAlign: 'center'}}>Please select an arena from the list to book a slot.</p>
        <button onClick={() => setCurrentScreen('player_home')} className="btn-neon" style={{marginTop: 20, width: '200px'}}>
          GO TO HOME ⚡
        </button>
      </div>
    );
  }

  const visitsCount = venue ? loyaltyVisits[venue.id] || 0 : 0;
  const isDiscountEligible = visitsCount >= 6; // 7th visit gets discount

  const calculatedTotal = venue ? venue.pricePerHour * duration : 0;
  const discountAmount = isDiscountEligible ? 250 : 0;
  const finalTotal = Math.max(0, calculatedTotal - discountAmount);
  const advanceAmount = venue ? Math.round(finalTotal * (venue.advancePercent / 100)) : 0;

  const handleBooking = async () => {
    if (selectedSlotTimes.length === 0) {
      await showError('Booking Error', 'Please select at least one available slot!');
      return;
    }
    if (hasConflict) {
      await showError('Conflict Error', 'Conflict! One or more of your selected slots are already booked.');
      return;
    }
    setShowPayment(true);
  };

  const handleRazorpayPayment = async () => {
    if (advanceAmount <= 0) {
      // Free / zero advance — confirm directly
      bookSlot(venue.id, `${selectedDate} ${selectedYear}`, selectedSlotTimes, calculatedTotal, isDiscountEligible);
      await showAlert('Booking Confirmed 🎉', `Yes, your booking is confirmed for ${selectedDate} (${selectedSlotTimes.length} hour(s)).`);
      setShowPayment(false);
      setCurrentScreen('rewards');
      return;
    }

    setPaymentLoading(true);
    try {
      // 1. Create Razorpay order on backend
      const orderRes = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: advanceAmount * 100, // convert ₹ to paise
          receipt: `venue_${venue.id}_${Date.now()}`,
          notes: { venue: venue.name, date: selectedDate, slots: selectedSlotTimes.join(', ') }
        })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Order creation failed');

      // 2. Open Razorpay Checkout popup
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Playfinity',
        description: `${venue.name} — ${selectedDate} (${selectedSlotTimes.length} slot(s))`,
        order_id: orderData.orderId,
        handler: async (response) => {
          // 3. Verify payment signature on backend
          const verifyRes = await fetch(`${API_BASE}/api/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            // 4. Confirm booking
            bookSlot(venue.id, `${selectedDate} ${selectedYear}`, selectedSlotTimes, calculatedTotal, isDiscountEligible);
            await showAlert('Booking Confirmed 🎉', `Yes, your booking is confirmed! Payment ID: ${response.razorpay_payment_id}. Paid ₹${advanceAmount} advance.`);
            setShowPayment(false);
            setCurrentScreen('rewards');
          } else {
            await showError('Payment Failed', 'Payment verification failed. Please contact support.');
          }
        },
        prefill: {},
        theme: { color: '#DC2626' },
        modal: { ondismiss: () => setPaymentLoading(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async (resp) => {
        setPaymentLoading(false);
        await showError('Payment Failed', resp.error?.description || 'Payment was not completed.');
      });
      rzp.open();
    } catch (err) {
      setPaymentLoading(false);
      await showError('Payment Error', err.message || 'Could not initiate payment. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div style={{...styles.container, padding: 0}}>
      {/* HERO IMAGE GALLERY */}
      <div style={{position: 'relative'}}>
        <img
          src={venue.images && venue.images[activeImgIdx] ? venue.images[activeImgIdx] : (venue.images && venue.images[0])}
          alt={venue.name}
          style={{ ...styles.heroImage, height: 240, transition: 'opacity 0.25s' }}
        />
        <div style={styles.imageOverlay} />
        {/* Image count badge */}
        {venue.images && venue.images.length > 1 && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
            color: '#FFF', fontSize: '0.72rem', fontWeight: 700,
            padding: '4px 10px', borderRadius: 12,
            fontFamily: 'var(--font-label)'
          }}>
            {activeImgIdx + 1} / {venue.images.length}
          </div>
        )}
      </div>
      {/* THUMBNAIL STRIP */}
      {venue.images && venue.images.length > 1 && (
        <div style={{
          display: 'flex', gap: 8, padding: '10px 16px',
          overflowX: 'auto', backgroundColor: 'var(--bg-primary)',
          scrollbarWidth: 'none', msOverflowStyle: 'none'
        }}>
          {venue.images.map((imgUrl, idx) => (
            <div
              key={idx}
              onClick={() => setActiveImgIdx(idx)}
              style={{
                flexShrink: 0, width: 72, height: 52, borderRadius: 8,
                overflow: 'hidden', cursor: 'pointer',
                border: idx === activeImgIdx ? '2.5px solid var(--primary)' : '2px solid transparent',
                opacity: idx === activeImgIdx ? 1 : 0.6,
                transition: 'all 0.2s'
              }}
            >
              <img src={imgUrl} alt={`Photo ${idx+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}

      <div style={{padding: 16}}>
        <h2 style={{
          fontSize: '2.2rem',
          fontFamily: 'var(--font-venue)',
          fontWeight: '400',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          lineHeight: 1.1,
          color: 'var(--text-primary)'
        }}>{venue.name}</h2>
        <div style={{display: 'flex', alignItems: 'center', gap: 6, margin: '6px 0'}}>
          <MapPin size={16} color="var(--primary)" />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            {venue.address}
          </a>
        </div>
        <div style={{display: 'flex', gap: 10, margin: '10px 0', flexWrap: 'wrap'}}>
          {(() => {
            const sportsList = Array.isArray(venue.sports) && venue.sports.length > 0
              ? venue.sports
              : [venue.sport || 'Box Cricket'];
            return sportsList.map(sport => {
              const sportDef = ALL_SPORTS.find(s => s.id === sport);
              return (
                <span key={sport} style={{
                  fontSize: '0.72rem', padding: '3px 12px', borderRadius: 20,
                  background: sportDef ? `${sportDef.color}22` : 'rgba(170,255,0,0.1)',
                  color: sportDef?.color || 'var(--primary)',
                  border: `1px solid ${sportDef?.color || 'var(--primary)'}`,
                  fontWeight: 700
                }}>
                  {sportDef?.label || sport}
                </span>
              );
            });
          })()}
          <span style={styles.infoBadge}>💡 Floodlit</span>
          <span style={styles.infoBadge}>👥 Max {venue.capacity} players</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)', alignSelf: 'flex-start' }}>
          <Phone size={14} color="var(--primary)" />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Phone No:</span>
          <span 
            onClick={() => { window.location.href = `tel:${venue.caretakerPhone || venue.phone}`; }}
            style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 700, cursor: 'pointer' }}
          >
            {venue.caretakerPhone || venue.phone}
          </span>
        </div>

        {/* Loyalty progress tracker */}
        <div className="sporty-card glow-gold" style={{margin: '16px 0', padding: 12}}>
          <div className="flex-between">
            <span style={{fontSize: '0.85rem', color: "var(--text-primary)", fontWeight: 'bold'}}>🏆 Arena Loyalty Club</span>
            <span style={{fontSize: '0.75rem', color: 'var(--primary)'}}>{visitsCount}/7 Visits</span>
          </div>
          <div style={styles.progressTrackBar}>
            <div style={{...styles.progressIndicator, width: `${(visitsCount / 7) * 100}%`}} />
          </div>
          <p style={{fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 6}}>
            {isDiscountEligible ? '⚡ Ready! Rs. 250 off applied on this booking!' : `${7 - visitsCount} more visits to get Rs. 250 discount.`}
          </p>
        </div>

        {/* Date Selector */}
        <div style={{margin: '16px 0'}}>
          <h4 style={{marginBottom: 8, fontSize: '0.9rem', color: 'var(--text-muted)'}}>SELECT DATE</h4>
          <div style={{display: 'flex', gap: 8}}>
            {selectableDates.map(d => (
              <button
                key={d.date}
                onClick={() => {
                  setSelectedDate(d.date);
                  setSelectedSlotTimes([]);
                }}
                style={{
                  ...styles.dateChip,
                  borderColor: selectedDate === d.date ? 'var(--primary)' : 'var(--border-light)',
                  backgroundColor: selectedDate === d.date ? 'var(--primary)' : 'var(--bg-surface)',
                  color: selectedDate === d.date ? '#FFF' : 'var(--text-primary)'
                }}
              >
                <div style={{fontSize: '0.7rem'}}>{d.label}</div>
                <div style={{fontWeight: '700', fontSize: '1rem'}}>{d.date}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Time slots picker */}
        <div style={{margin: '16px 0'}}>
          <div className="flex-between" style={{marginBottom: 8}}>
            <h4 style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>SELECT TIME SLOTS</h4>
            <span style={{fontSize: '0.7rem', color: 'var(--primary)'}}>Select multiple slots to book multiple hours</span>
          </div>
          <div style={styles.slotGrid}>
            {venueSlots.map(s => {
              const isSelected = selectedSlotTimes.includes(s.time);
              const isBooked = bookings.some(b => b.venueId === venue.id && b.date === `${selectedDate} ${selectedYear}` && b.timeSlot === s.time);
              const passed = isSlotInPast(selectedDate, s.time);
              const isDisabled = isBooked || passed;

              return (
                <button
                  key={s.time}
                  disabled={isDisabled}
                  onClick={() => handleSlotClick(s.time)}
                  style={{
                    ...styles.slotButton,
                    backgroundColor: isSelected ? 'var(--primary)' : isDisabled ? 'rgba(220, 38, 38, 0.05)' : 'var(--bg-surface)',
                    color: isSelected ? '#FFF' : isDisabled ? 'var(--text-muted)' : 'var(--text-primary)',
                    borderColor: isSelected ? 'var(--primary)' : isBooked ? 'var(--danger)' : 'var(--border-light)',
                    textDecoration: isBooked ? 'line-through' : passed ? 'line-through' : 'none',
                    opacity: passed ? 0.5 : 1,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    fontWeight: isSelected ? 'bold' : 'normal'
                  }}
                >
                  {s.time.split(' - ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Booking summary */}
        <div className="sporty-card glow-green" style={{marginTop: 20}}>
          <div style={styles.summaryRow} className="flex-between">
            <span>Selected Date:</span>
            <span style={{color: "var(--text-primary)"}}>{selectedDate}</span>
          </div>
          <div style={styles.summaryRow} className="flex-between">
            <span>Time Slots:</span>
            <span style={{color: "var(--text-primary)", textAlign: 'right', fontSize: '0.82rem'}}>
              {selectedSlotTimes.length === 0 ? 'None selected' : selectedSlotTimes.map(t => t.split(' - ')[0]).join(', ')}
            </span>
          </div>
          <div style={styles.summaryRow} className="flex-between">
            <span>Duration:</span>
            <span style={{color: "var(--text-primary)"}}>{duration} Hour{duration > 1 ? 's' : ''}</span>
          </div>
          <div style={styles.summaryRow} className="flex-between">
            <span>Booking Fee:</span>
            <span style={{color: "var(--text-primary)"}}>₹{calculatedTotal}</span>
          </div>
          {isDiscountEligible && (
            <div style={styles.summaryRow} className="flex-between">
              <span className="text-gold">Loyalty Discount:</span>
              <span className="text-gold">- ₹250</span>
            </div>
          )}
          <hr style={{borderColor: 'rgba(255,255,255,0.06)', margin: '8px 0'}} />
          <div style={styles.summaryRow} className="flex-between">
            <span style={{fontWeight: '700', fontSize: '1rem'}}>Advance Payable ({venue.advancePercent}%):</span>
            <span className="text-neon" style={{fontSize: '1.25rem', fontWeight: 'bold'}}>₹{selectedSlotTimes.length > 0 ? advanceAmount : 0}</span>
          </div>
        </div>

        {selectedSlotTimes.length > 0 && hasConflict && (
          <div style={{display: 'flex', gap: 10, backgroundColor: 'rgba(255, 77, 77, 0.1)', border: '1px solid var(--danger)', padding: 12, borderRadius: 8, margin: '12px 0', alignItems: 'center'}}>
            <AlertTriangle size={16} color="var(--danger)" />
            <span style={{color: 'var(--danger)', fontSize: '0.75rem'}}>
              Conflict: One or more selected slots are already booked!
            </span>
          </div>
        )}

        <div style={styles.advanceAlert}>
          <AlertTriangle size={16} color="var(--danger)" />
          <span style={{color: 'var(--danger)', fontSize: '0.75rem'}}>Note: Advance payment is non-refundable.</span>
        </div>

        <button 
          onClick={handleBooking} 
          className="btn-neon" 
          style={{marginTop: 16}}
          disabled={selectedSlotTimes.length === 0 || hasConflict}
        >
          CONFIRM & BOOK SLOT ⚡
        </button>
      </div>

      {/* REVIEWS & RATINGS SECTION */}
      <div style={{padding: 16, borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: 24}}>
        <h3 style={{fontSize: '1.25rem', marginBottom: 12}}>COMMUNITY REVIEWS</h3>
        
        {/* Write review form */}
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (!reviewComment.trim()) return;
          addVenueReview(venue.id, { rating: reviewRating, comment: reviewComment });
          setReviewComment('');
          await showAlert('Review Submitted', 'Review submitted successfully! Thank you.');
        }} className="sporty-card" style={{padding: 12, marginBottom: 16}}>
          <h4 style={{fontSize: '0.85rem', color: 'var(--primary)', marginBottom: 8}}>WRITE A REVIEW</h4>
          <div style={{display: 'flex', gap: 6, marginBottom: 8}}>
            {[1, 2, 3, 4, 5].map(star => (
              <span 
                key={star} 
                onClick={() => setReviewRating(star)}
                style={{
                  cursor: 'pointer', 
                  fontSize: '1.25rem',
                  color: star <= reviewRating ? 'var(--primary)' : '#4B5563'
                }}
              >
                ★
              </span>
            ))}
          </div>
          <textarea 
            placeholder="Share your playing experience at this box turf..." 
            className="form-input" 
            rows="2"
            value={reviewComment}
            maxLength={500}
            onChange={e => setReviewComment(e.target.value)}
            style={{background: 'rgba(0,0,0,0.3)', resize: 'none', fontSize: '0.8rem', padding: 8}}
          />
          <button type="submit" className="btn-neon" style={{marginTop: 8, padding: '6px 0', fontSize: '0.75rem'}}>
            SUBMIT REVIEW ⭐
          </button>
        </form>

        {/* Reviews List */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {venue.reviews && venue.reviews.length > 0 ? (
            venue.reviews.map(r => (
              <div key={r.id} className="sporty-card" style={{padding: 10}}>
                <div className="flex-between" style={{marginBottom: 4}}>
                  <span style={{fontWeight: 'bold', fontSize: '0.8rem', color: "var(--text-primary)"}}>{r.user}</span>
                  <span style={{fontSize: '0.75rem', color: 'var(--primary)'}}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{r.comment}</p>
              </div>
            ))
          ) : (
            <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center'}}>No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>

      {/* RAZORPAY PAYMENT MODAL */}
      {showPayment && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16
          }}
        >
          <div
            className="sporty-card"
            style={{
              width: '100%',
              maxWidth: 380,
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              padding: 24,
              borderRadius: 16,
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>💳</div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: 4 }}>Confirm Payment</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
              Secure payment powered by Razorpay
            </p>

            <div style={{ backgroundColor: '#F9FAFB', borderRadius: 10, padding: 16, marginBottom: 20, textAlign: 'left' }}>
              <div className="flex-between" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Venue</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{venue.name}</span>
              </div>
              <div className="flex-between" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{selectedDate} {selectedYear}</span>
              </div>
              <div className="flex-between" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Slots</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{selectedSlotTimes.length} hour(s)</span>
              </div>
              {isDiscountEligible && (
                <div className="flex-between" style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: '0.85rem', color: '#16a34a' }}>Loyalty Discount</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#16a34a' }}>- ₹{discountAmount}</span>
                </div>
              )}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 10, marginTop: 8 }} className="flex-between">
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>Advance Payable</span>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>₹{advanceAmount}</span>
              </div>
            </div>

            <button
              onClick={handleRazorpayPayment}
              disabled={paymentLoading}
              className="btn-neon"
              style={{ marginBottom: 10 }}
            >
              {paymentLoading ? 'Processing...' : `Pay ₹${advanceAmount} via Razorpay`}
            </button>
            <button
              onClick={() => setShowPayment(false)}
              className="btn-outlined"
              disabled={paymentLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



/* ==========================================================================
   4.5 PROFESSIONAL SCORECARD RENDERER (ESPN CRICINFO STYLE)
   ========================================================================== */
function renderProfessionalScorecard({
  battingList = [],
  bowlingList = [],
  fallOfWickets = [],
  extras = { wides: 0, noBalls: 0, legByes: 0, byes: 0, total: 0 },
  runs = 0,
  wickets = 0,
  totalBalls = 0,
  teamName = '',
  isLive = false,
  crr = null,
  target = null,
  isSecondInnings = false,
  captainName = ''
}) {
  const battedList = battingList.filter(b => b.isActive || b.balls > 0 || b.dismissal);
  const didNotBatList = battingList.filter(b => !b.isActive && b.balls === 0 && !b.dismissal);
  const activeBowlers = bowlingList.filter(b => b.isActive || parseFloat(b.overs) > 0 || b.wickets > 0);
  const oversStr = `${Math.floor(totalBalls / 6)}.${totalBalls % 6}`;
  const computedCrr = totalBalls > 0 ? ((runs / (totalBalls / 6)).toFixed(2)) : '0.00';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Batting Card */}
      <div className="sporty-card" style={{ padding: '12px 0', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
        <div style={{ padding: '0 16px 10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 'bold', fontFamily: 'var(--font-heading)', margin: 0 }}>
            🏏 {teamName} BATTING {captainName && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'none', fontWeight: 'normal', marginLeft: 8 }}>(C: {captainName})</span>}
          </h4>
          {isLive && crr && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              CRR: <strong style={{ color: 'var(--text-primary)' }}>{crr}</strong>
            </span>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="stats-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', margin: 0 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem' }}>BATTING</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', width: '45px' }}>R</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', width: '45px' }}>B</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', width: '40px' }}>4s</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', width: '40px' }}>6s</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', width: '65px' }}>SR</th>
              </tr>
            </thead>
            <tbody>
              {battedList.map(b => {
                const sr = b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : '0.0';
                const isStriking = b.isStriking && b.isActive;
                
                let dismissalText = '';
                if (!b.isActive && b.dismissal) {
                  dismissalText = b.dismissal;
                } else if (b.isActive) {
                  dismissalText = isLive ? 'batting' : 'not out';
                } else {
                  dismissalText = 'not out';
                }

                return (
                  <tr 
                    key={b.id} 
                    style={{ 
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      backgroundColor: isStriking ? 'rgba(170,255,0,0.03)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '10px 16px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ 
                        fontWeight: b.isActive ? 'bold' : '500', 
                        color: b.isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}>
                        {b.name}
                        {isStriking && (
                          <span 
                            style={{ 
                              fontSize: '0.62rem', 
                              backgroundColor: 'rgba(170,255,0,0.15)', 
                              color: 'var(--primary)', 
                              padding: '1px 5px', 
                              borderRadius: 4,
                              fontWeight: 'bold',
                              letterSpacing: '0.5px'
                            }}
                          >
                            * STRIKER
                          </span>
                        )}
                      </div>
                      <div style={{ 
                        fontSize: '0.72rem', 
                        color: b.isActive ? '#22c55e' : 'var(--text-muted)', 
                        marginTop: 3,
                        fontWeight: b.isActive ? '600' : 'normal'
                      }}>
                        {dismissalText}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold', padding: '10px 16px', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{b.runs}</td>
                    <td style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{b.balls}</td>
                    <td style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{b.fours}</td>
                    <td style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{b.sixes}</td>
                    <td style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--primary)', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{sr}</td>
                  </tr>
                );
              })}

              {battedList.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    No batting details logged yet.
                  </td>
                </tr>
              )}

              {/* Extras Row */}
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: '10px 16px', textAlign: 'left' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>Extras</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                    (b {extras.byes || 0}, lb {extras.legByes || 0}, wd {extras.wides || 0}, nb {extras.noBalls || 0})
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 'bold', padding: '10px 16px', color: 'var(--text-primary)' }}>
                  {extras.total || 0}
                </td>
                <td colSpan={4}></td>
              </tr>

              {/* Total Row */}
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.015)' }}>
                <td style={{ padding: '10px 16px', textAlign: 'left' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>TOTAL</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                    ({oversStr} Ov, RR {isLive && crr ? crr : computedCrr})
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 'bold', padding: '10px 16px', color: 'var(--primary)' }}>
                  {runs}/{wickets}
                </td>
                <td colSpan={4}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Did Not Bat Section */}
        {didNotBatList.length > 0 && (
          <div style={{ padding: '12px 16px 4px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>Yet to bat: </span>
            <span style={{ color: 'var(--text-secondary)' }}>
              {didNotBatList.map(b => b.name).join(', ')}
            </span>
          </div>
        )}

        {/* Fall of Wickets Section */}
        {fallOfWickets.length > 0 && (
          <div style={{ padding: '12px 16px 4px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.78rem' }}>
            <div style={{ color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: 4 }}>Fall of Wickets:</div>
            <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {fallOfWickets.map((w, index) => (
                <span key={index}>
                  {index > 0 && ', '}
                  <strong>{w.score}-{index + 1}</strong> ({w.batter}, {w.overs} ov)
                </span>
              ))}
            </span>
          </div>
        )}
      </div>

      {/* Bowling Card */}
      <div className="sporty-card" style={{ padding: '12px 0', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
        <div style={{ padding: '0 16px 10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 'bold', fontFamily: 'var(--font-heading)', margin: 0 }}>
            🎯 BOWLING
          </h4>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="stats-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', margin: 0 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem' }}>BOWLER</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', width: '55px' }}>O</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', width: '45px' }}>M</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', width: '45px' }}>R</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', width: '45px' }}>W</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem', width: '65px' }}>ECON</th>
              </tr>
            </thead>
            <tbody>
              {activeBowlers.map(b => (
                <tr 
                  key={b.id} 
                  style={{ 
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    backgroundColor: b.isActive ? 'rgba(170,255,0,0.03)' : 'transparent'
                  }}
                >
                  <td style={{ padding: '10px 16px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ 
                      fontWeight: b.isActive ? 'bold' : '500', 
                      color: b.isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      {b.name}
                      {b.isActive && (
                        <span 
                          style={{ 
                            fontSize: '0.62rem', 
                            backgroundColor: 'rgba(170,255,0,0.15)', 
                            color: 'var(--primary)', 
                            padding: '1px 5px', 
                            borderRadius: 4,
                            fontWeight: 'bold',
                            letterSpacing: '0.5px'
                          }}
                        >
                          BOWLING
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{b.overs}</td>
                  <td style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{b.maidens}</td>
                  <td style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{b.runs}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', padding: '10px 16px', color: 'var(--danger)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{b.wickets}</td>
                  <td style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--primary)', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{b.economy}</td>
                </tr>
              ))}

              {activeBowlers.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    No bowlers have bowled yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   5. LIVE SCORECARD
   ========================================================================== */
function LiveScorecardView() {
  const { liveMatch: activeLiveMatch, selectedLiveMatch, setSelectedLiveMatch } = useAppState();
  const liveMatch = selectedLiveMatch || activeLiveMatch;
  const [activeTab, setActiveTab] = React.useState('');
  const [lastInnings, setLastInnings] = React.useState(liveMatch?.innings);

  React.useEffect(() => {
    return () => {
      if (setSelectedLiveMatch) setSelectedLiveMatch(null);
    };
  }, [setSelectedLiveMatch]);

  React.useEffect(() => {
    if (liveMatch) {
      if (liveMatch.innings !== lastInnings) {
        setLastInnings(liveMatch.innings);
        setActiveTab(liveMatch.innings === 2 ? liveMatch.team2 : liveMatch.team1);
      } else if (!activeTab) {
        setActiveTab(liveMatch.innings === 2 ? liveMatch.team2 : liveMatch.team1);
      }
    }
  }, [liveMatch, activeTab, lastInnings]);

  if (!liveMatch) {
    return (
      <div style={{...styles.container, padding: 16, justifyContent: 'center', alignItems: 'center'}}>
        <div className="sporty-card" style={{textAlign: 'center', padding: 24}}>
          <span style={{fontSize: '2.5rem'}}>📊</span>
          <h3 style={{color: "var(--text-primary)", marginTop: 12}}>No Live Match Active</h3>
          <p style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 6}}>
            Go to Admin Role and create a Roster & Team, then Launch Match to score.
          </p>
        </div>
      </div>
    );
  }

  if (liveMatch.sport === 'Football') {
    return (
      <div style={{...styles.container, padding: 16}}>
        <div className="sporty-card glow-green" style={{marginBottom: 16}}>
          <div className="flex-between">
            <div className="live-indicator"><span className="live-dot" /> LIVE FOOTBALL</div>
            <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>{liveMatch.venue}</span>
          </div>
          <div style={{margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.4rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.team1}</h3>
              {liveMatch.team1Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {liveMatch.team1Captain}</div>
              )}
            </div>
            <div style={{textAlign: 'center', padding: '0 16px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.goals1} - {liveMatch.goals2}</h2>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.4rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.team2}</h3>
              {liveMatch.team2Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {liveMatch.team2Captain}</div>
              )}
            </div>
          </div>
        </div>

        {/* Stats and timeline */}
        <div className="sporty-card" style={{marginBottom: 16}}>
          <h4 style={{fontSize: '0.9rem', color: 'var(--primary)', marginBottom: 10, textTransform: 'uppercase'}}>Match Stats</h4>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Stat</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team1}</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team2}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Goals</td>
                <td style={{textAlign: 'center', fontWeight: 'bold'}}>{liveMatch.goals1}</td>
                <td style={{textAlign: 'center', fontWeight: 'bold'}}>{liveMatch.goals2}</td>
              </tr>
              <tr>
                <td>Fouls</td>
                <td style={{textAlign: 'center'}}>{liveMatch.fouls1}</td>
                <td style={{textAlign: 'center'}}>{liveMatch.fouls2}</td>
              </tr>
              <tr>
                <td>Yellow Cards</td>
                <td style={{textAlign: 'center'}}>{liveMatch.yellowCards1}</td>
                <td style={{textAlign: 'center'}}>{liveMatch.yellowCards2}</td>
              </tr>
              <tr>
                <td>Red Cards</td>
                <td style={{textAlign: 'center', color: 'var(--danger)'}}>{liveMatch.redCards1}</td>
                <td style={{textAlign: 'center', color: 'var(--danger)'}}>{liveMatch.redCards2}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="sporty-card">
          <h4 style={{fontSize: '0.9rem', color: 'var(--primary)', marginBottom: 8, textTransform: 'uppercase'}}>Timeline</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
            {liveMatch.events.slice().reverse().map((ev, index) => (
              <div key={index} className="flex-between" style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>
                <span>{ev.time} - {ev.team} {ev.type}</span>
                <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{ev.detail}</span>
              </div>
            ))}
            {liveMatch.events.length === 0 && (
              <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center'}}>No events logged yet.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (liveMatch.sport === 'Volleyball') {
    return (
      <div style={{...styles.container, padding: 16}}>
        <div className="sporty-card glow-green" style={{marginBottom: 16}}>
          <div className="flex-between">
            <div className="live-indicator"><span className="live-dot" /> LIVE VOLLEYBALL</div>
            <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>{liveMatch.venue}</span>
          </div>
          <div style={{margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.3rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.team1}</h3>
              {liveMatch.team1Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {liveMatch.team1Captain}</div>
              )}
              <span className="text-gold" style={{fontSize: '0.95rem', fontWeight: 'bold', display: 'block', marginTop: 4}}>Sets won: {liveMatch.sets1}</span>
            </div>
            <div style={{textAlign: 'center', padding: '0 16px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.points1} - {liveMatch.points2}</h2>
              <span style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>Current Set {liveMatch.currentSet} Points</span>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.3rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.team2}</h3>
              {liveMatch.team2Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {liveMatch.team2Captain}</div>
              )}
              <span className="text-gold" style={{fontSize: '0.95rem', fontWeight: 'bold', display: 'block', marginTop: 4}}>Sets won: {liveMatch.sets2}</span>
            </div>
          </div>
        </div>

        <div className="sporty-card">
          <h4 style={{fontSize: '0.9rem', color: 'var(--primary)', marginBottom: 8, textTransform: 'uppercase'}}>Sets History</h4>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Set</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team1}</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team2}</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
              {liveMatch.setScores.map((s, idx) => (
                <tr key={idx}>
                  <td>Set {s.set}</td>
                  <td style={{textAlign: 'center'}}>{s.score1}</td>
                  <td style={{textAlign: 'center'}}>{s.score2}</td>
                  <td style={{color: 'var(--primary)', fontWeight: 'bold'}}>{s.winner}</td>
                </tr>
              ))}
              {liveMatch.setScores.length === 0 && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem'}}>No sets completed yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (liveMatch.sport === 'Basketball') {
    return (
      <div style={{...styles.container, padding: 16}}>
        <div className="sporty-card glow-green" style={{marginBottom: 16}}>
          <div className="flex-between">
            <div className="live-indicator"><span className="live-dot" /> LIVE BASKETBALL</div>
            <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>{liveMatch.venue}</span>
          </div>
          <div style={{margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.4rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.team1}</h3>
              {liveMatch.team1Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {liveMatch.team1Captain}</div>
              )}
            </div>
            <div style={{textAlign: 'center', padding: '0 16px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.points1} - {liveMatch.points2}</h2>
              <span style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>Period {liveMatch.period}</span>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.4rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.team2}</h3>
              {liveMatch.team2Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {liveMatch.team2Captain}</div>
              )}
            </div>
          </div>
        </div>

        <div className="sporty-card">
          <h4 style={{fontSize: '0.9rem', color: 'var(--primary)', marginBottom: 8, textTransform: 'uppercase'}}>Match Stats</h4>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Stat</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team1}</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team2}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Points</td>
                <td style={{textAlign: 'center', fontWeight: 'bold'}}>{liveMatch.points1}</td>
                <td style={{textAlign: 'center', fontWeight: 'bold'}}>{liveMatch.points2}</td>
              </tr>
              <tr>
                <td>Team Fouls</td>
                <td style={{textAlign: 'center'}}>{liveMatch.fouls1}</td>
                <td style={{textAlign: 'center'}}>{liveMatch.fouls2}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (liveMatch.sport === 'Pickleball') {
    return (
      <div style={{...styles.container, padding: 16}}>
        <div className="sporty-card glow-green" style={{marginBottom: 16}}>
          <div className="flex-between">
            <div className="live-indicator"><span className="live-dot" /> LIVE PICKLEBALL</div>
            <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>{liveMatch.venue}</span>
          </div>
          <div style={{margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.3rem', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team1}</h3>
              <span className="text-gold" style={{fontSize: '0.95rem', fontWeight: 'bold'}}>Sets won: {liveMatch.sets1}</span>
            </div>
            <div style={{textAlign: 'center', padding: '0 16px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)'}}>{liveMatch.points1} - {liveMatch.points2}</h2>
              <span style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>Current Set {liveMatch.currentSet} Points</span>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.3rem', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team2}</h3>
              <span className="text-gold" style={{fontSize: '0.95rem', fontWeight: 'bold'}}>Sets won: {liveMatch.sets2}</span>
            </div>
          </div>
        </div>

        <div className="sporty-card">
          <h4 style={{fontSize: '0.9rem', color: 'var(--primary)', marginBottom: 8, textTransform: 'uppercase'}}>Sets History</h4>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Set</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team1}</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team2}</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
              {liveMatch.setScores.map((s, idx) => (
                <tr key={idx}>
                  <td>Set {s.set}</td>
                  <td style={{textAlign: 'center'}}>{s.score1}</td>
                  <td style={{textAlign: 'center'}}>{s.score2}</td>
                  <td style={{color: 'var(--primary)', fontWeight: 'bold'}}>{s.winner}</td>
                </tr>
              ))}
              {liveMatch.setScores.length === 0 && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem'}}>No sets completed yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (liveMatch.sport === 'Golf') {
    const totalStrokes1 = liveMatch.strokes1.reduce((a, b) => a + b, 0);
    const totalStrokes2 = liveMatch.strokes2.reduce((a, b) => a + b, 0);
    const totalPar = liveMatch.parValues.reduce((a, b) => a + b, 0);
    const scoreDiff1 = totalStrokes1 - totalPar;
    const scoreDiff2 = totalStrokes2 - totalPar;

    const renderScoreDiff = (diff) => {
      if (diff === 0) return 'E (Even)';
      return diff > 0 ? `+${diff}` : `${diff}`;
    };

    return (
      <div style={{...styles.container, padding: 16}}>
        <div className="sporty-card glow-green" style={{marginBottom: 16}}>
          <div className="flex-between">
            <div className="live-indicator"><span className="live-dot" /> LIVE GOLF</div>
            <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>{liveMatch.venue}</span>
          </div>
          <div style={{margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.3rem', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team1}</h3>
              <div style={{fontSize: '0.95rem', color: 'var(--secondary)', fontWeight: 'bold'}}>Strokes: {totalStrokes1} ({renderScoreDiff(scoreDiff1)})</div>
            </div>
            <div style={{textAlign: 'center', padding: '0 10px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>
              Hole {liveMatch.currentHole} of {liveMatch.totalHoles}
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.3rem', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team2}</h3>
              <div style={{fontSize: '0.95rem', color: 'var(--secondary)', fontWeight: 'bold'}}>Strokes: {totalStrokes2} ({renderScoreDiff(scoreDiff2)})</div>
            </div>
          </div>
        </div>

        <div className="sporty-card" style={{overflowX: 'auto'}}>
          <h4 style={{fontSize: '0.9rem', color: 'var(--primary)', marginBottom: 8, textTransform: 'uppercase'}}>Scorecard</h4>
          <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', color: 'var(--text-primary)'}}>
            <thead>
              <tr style={{borderBottom: '1px solid var(--border-light)'}}>
                <th style={{padding: 4, textAlign: 'left'}}>Hole</th>
                {liveMatch.strokes1.map((_, idx) => (
                  <th key={idx} style={{padding: 4, textAlign: 'center', backgroundColor: liveMatch.currentHole === idx + 1 ? 'rgba(255,255,255,0.06)' : 'transparent'}}>{idx + 1}</th>
                ))}
                <th style={{padding: 4, textAlign: 'center', fontWeight: 'bold'}}>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{borderBottom: '1px solid var(--border-light)'}}>
                <td style={{padding: 4, fontWeight: '500'}}>Par</td>
                {liveMatch.parValues.map((p, idx) => (
                  <td key={idx} style={{padding: 4, textAlign: 'center', backgroundColor: liveMatch.currentHole === idx + 1 ? 'rgba(255,255,255,0.06)' : 'transparent'}}>{p}</td>
                ))}
                <td style={{padding: 4, textAlign: 'center', fontWeight: 'bold'}}>{totalPar}</td>
              </tr>
              <tr style={{borderBottom: '1px solid var(--border-light)'}}>
                <td style={{padding: 4, fontWeight: '500', color: 'var(--primary)'}}>{liveMatch.team1}</td>
                {liveMatch.strokes1.map((s, idx) => (
                  <td key={idx} style={{padding: 4, textAlign: 'center', color: s === 0 ? 'var(--text-muted)' : 'var(--text-primary)', backgroundColor: liveMatch.currentHole === idx + 1 ? 'rgba(255,255,255,0.06)' : 'transparent'}}>{s || '-'}</td>
                ))}
                <td style={{padding: 4, textAlign: 'center', fontWeight: 'bold', color: 'var(--primary)'}}>{totalStrokes1}</td>
              </tr>
              <tr>
                <td style={{padding: 4, fontWeight: '500', color: 'var(--secondary)'}}>{liveMatch.team2}</td>
                {liveMatch.strokes2.map((s, idx) => (
                  <td key={idx} style={{padding: 4, textAlign: 'center', color: s === 0 ? 'var(--text-muted)' : 'var(--text-primary)', backgroundColor: liveMatch.currentHole === idx + 1 ? 'rgba(255,255,255,0.06)' : 'transparent'}}>{s || '-'}</td>
                ))}
                <td style={{padding: 4, textAlign: 'center', fontWeight: 'bold', color: 'var(--secondary)'}}>{totalStrokes2}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (liveMatch.sport === 'Hockey' || liveMatch.sport === 'Ice Hockey') {
    const isIce = liveMatch.sport === 'Ice Hockey';
    return (
      <div style={{...styles.container, padding: 16}}>
        <div className="sporty-card glow-green" style={{marginBottom: 16}}>
          <div className="flex-between">
            <div className="live-indicator"><span className="live-dot" /> LIVE {isIce ? 'ICE HOCKEY' : 'HOCKEY'}</div>
            <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>{liveMatch.venue}</span>
          </div>
          <div style={{margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.4rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.team1}</h3>
              {liveMatch.team1Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {liveMatch.team1Captain}</div>
              )}
            </div>
            <div style={{textAlign: 'center', padding: '0 16px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.goals1} - {liveMatch.goals2}</h2>
              <span style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>Period {liveMatch.period}</span>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.4rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.team2}</h3>
              {liveMatch.team2Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {liveMatch.team2Captain}</div>
              )}
            </div>
          </div>
        </div>

        <div className="sporty-card" style={{marginBottom: 16}}>
          <h4 style={{fontSize: '0.9rem', color: 'var(--primary)', marginBottom: 10, textTransform: 'uppercase'}}>Match Stats</h4>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Stat</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team1}</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team2}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Goals</td>
                <td style={{textAlign: 'center', fontWeight: 'bold'}}>{liveMatch.goals1}</td>
                <td style={{textAlign: 'center', fontWeight: 'bold'}}>{liveMatch.goals2}</td>
              </tr>
              <tr>
                <td>Shots on Goal</td>
                <td style={{textAlign: 'center'}}>{liveMatch.shots1}</td>
                <td style={{textAlign: 'center'}}>{liveMatch.shots2}</td>
              </tr>
              <tr>
                <td>Penalties Logged</td>
                <td style={{textAlign: 'center'}}>{liveMatch.penalties1}</td>
                <td style={{textAlign: 'center'}}>{liveMatch.penalties2}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="sporty-card">
          <h4 style={{fontSize: '0.9rem', color: 'var(--primary)', marginBottom: 8, textTransform: 'uppercase'}}>Timeline</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
            {liveMatch.events.slice().reverse().map((ev, index) => (
              <div key={index} className="flex-between" style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>
                <span>{ev.time} - {ev.team} {ev.type}</span>
                <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{ev.detail}</span>
              </div>
            ))}
            {liveMatch.events.length === 0 && (
              <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center'}}>No events logged yet.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (liveMatch.sport === 'Skating') {
    return (
      <div style={{...styles.container, padding: 16}}>
        <div className="sporty-card glow-green" style={{marginBottom: 16}}>
          <div className="flex-between">
            <div className="live-indicator"><span className="live-dot" /> LIVE SKATING</div>
            <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>{liveMatch.venue}</span>
          </div>
          <div style={{margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.3rem', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team1}</h3>
              <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Tech: {liveMatch.technicalScore1.toFixed(1)} | Art: {liveMatch.artisticScore1.toFixed(1)}</div>
              <div style={{fontSize: '1.2rem', color: 'var(--secondary)', fontWeight: 'bold', marginTop: 4}}>Total: {liveMatch.totalScore1.toFixed(2)}</div>
            </div>
            <div style={{textAlign: 'center', padding: '0 10px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>
              VS
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.3rem', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team2}</h3>
              <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Tech: {liveMatch.technicalScore2.toFixed(1)} | Art: {liveMatch.artisticScore2.toFixed(1)}</div>
              <div style={{fontSize: '1.2rem', color: 'var(--secondary)', fontWeight: 'bold', marginTop: 4}}>Total: {liveMatch.totalScore2.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (liveMatch.sport === 'Badminton') {
    return (
      <div style={{...styles.container, padding: 16}}>
        <div className="sporty-card glow-green" style={{marginBottom: 16}}>
          <div className="flex-between">
            <div className="live-indicator"><span className="live-dot" /> LIVE BADMINTON</div>
            <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>{liveMatch.venue}</span>
          </div>
          <div style={{margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.3rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.team1}</h3>
              {liveMatch.team1Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {liveMatch.team1Captain}</div>
              )}
              <span className="text-gold" style={{fontSize: '0.95rem', fontWeight: 'bold', display: 'block', marginTop: 4}}>Sets won: {liveMatch.sets1}</span>
            </div>
            <div style={{textAlign: 'center', padding: '0 16px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.points1} - {liveMatch.points2}</h2>
              <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Current Set Points</span>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.3rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.team2}</h3>
              {liveMatch.team2Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {liveMatch.team2Captain}</div>
              )}
              <span className="text-gold" style={{fontSize: '0.95rem', fontWeight: 'bold', display: 'block', marginTop: 4}}>Sets won: {liveMatch.sets2}</span>
            </div>
          </div>
        </div>

        <div className="sporty-card">
          <h4 style={{fontSize: '0.9rem', color: 'var(--primary)', marginBottom: 8, textTransform: 'uppercase'}}>Sets History</h4>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Set</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team1}</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team2}</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
              {liveMatch.setScores && liveMatch.setScores.map((s, idx) => (
                <tr key={idx}>
                  <td>Set {s.set}</td>
                  <td style={{textAlign: 'center'}}>{s.score1}</td>
                  <td style={{textAlign: 'center'}}>{s.score2}</td>
                  <td style={{color: 'var(--primary)', fontWeight: 'bold'}}>{s.winner}</td>
                </tr>
              ))}
              {(!liveMatch.setScores || liveMatch.setScores.length === 0) && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem'}}>No sets completed yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (liveMatch.sport === 'Table Tennis') {
    return (
      <div style={{...styles.container, padding: 16}}>
        <div className="sporty-card glow-green" style={{marginBottom: 16}}>
          <div className="flex-between">
            <div className="live-indicator"><span className="live-dot" /> LIVE TABLE TENNIS</div>
            <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>{liveMatch.venue}</span>
          </div>
          <div style={{margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.3rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.team1}</h3>
              {liveMatch.team1Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {liveMatch.team1Captain}</div>
              )}
              <span className="text-gold" style={{fontSize: '0.95rem', fontWeight: 'bold', display: 'block', marginTop: 4}}>Sets won: {liveMatch.sets1}</span>
            </div>
            <div style={{textAlign: 'center', padding: '0 16px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.points1} - {liveMatch.points2}</h2>
              <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Current Set Points</span>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.3rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.team2}</h3>
              {liveMatch.team2Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {liveMatch.team2Captain}</div>
              )}
              <span className="text-gold" style={{fontSize: '0.95rem', fontWeight: 'bold', display: 'block', marginTop: 4}}>Sets won: {liveMatch.sets2}</span>
            </div>
          </div>
        </div>

        <div className="sporty-card">
          <h4 style={{fontSize: '0.9rem', color: 'var(--primary)', marginBottom: 8, textTransform: 'uppercase'}}>Sets History</h4>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Set</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team1}</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team2}</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
              {liveMatch.setScores && liveMatch.setScores.map((s, idx) => (
                <tr key={idx}>
                  <td>Set {s.set}</td>
                  <td style={{textAlign: 'center'}}>{s.score1}</td>
                  <td style={{textAlign: 'center'}}>{s.score2}</td>
                  <td style={{color: 'var(--primary)', fontWeight: 'bold'}}>{s.winner}</td>
                </tr>
              ))}
              {(!liveMatch.setScores || liveMatch.setScores.length === 0) && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem'}}>No sets completed yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (liveMatch.sport === 'Tennis') {
    return (
      <div style={{...styles.container, padding: 16}}>
        <div className="sporty-card glow-green" style={{marginBottom: 16}}>
          <div className="flex-between">
            <div className="live-indicator"><span className="live-dot" /> LIVE TENNIS</div>
            <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>{liveMatch.venue}</span>
          </div>
          <div style={{margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.3rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.team1}</h3>
              {liveMatch.team1Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {liveMatch.team1Captain}</div>
              )}
              <span className="text-gold" style={{fontSize: '0.95rem', fontWeight: 'bold', display: 'block', marginTop: 4}}>Sets won: {liveMatch.sets1}</span>
              <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Games: {liveMatch.games1}</span>
            </div>
            <div style={{textAlign: 'center', padding: '0 16px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.points1} - {liveMatch.points2}</h2>
              <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Game Score</span>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.3rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.team2}</h3>
              {liveMatch.team2Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {liveMatch.team2Captain}</div>
              )}
              <span className="text-gold" style={{fontSize: '0.95rem', fontWeight: 'bold', display: 'block', marginTop: 4}}>Sets won: {liveMatch.sets2}</span>
              <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Games: {liveMatch.games2}</span>
            </div>
          </div>
        </div>

        <div className="sporty-card">
          <h4 style={{fontSize: '0.9rem', color: 'var(--primary)', marginBottom: 8, textTransform: 'uppercase'}}>Sets History</h4>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Set</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team1}</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team2}</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
              {liveMatch.setScores && liveMatch.setScores.map((s, idx) => (
                <tr key={idx}>
                  <td>Set {s.set}</td>
                  <td style={{textAlign: 'center'}}>{s.games1}</td>
                  <td style={{textAlign: 'center'}}>{s.games2}</td>
                  <td style={{color: 'var(--primary)', fontWeight: 'bold'}}>{s.winner}</td>
                </tr>
              ))}
              {(!liveMatch.setScores || liveMatch.setScores.length === 0) && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem'}}>No sets completed yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (liveMatch.sport === 'Snooker') {
    return (
      <div style={{...styles.container, padding: 16}}>
        <div className="sporty-card glow-green" style={{marginBottom: 16}}>
          <div className="flex-between">
            <div className="live-indicator"><span className="live-dot" /> LIVE SNOOKER</div>
            <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>{liveMatch.venue}</span>
          </div>
          <div style={{margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.3rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.team1}</h3>
              {liveMatch.team1Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {liveMatch.team1Captain}</div>
              )}
              <span className="text-gold" style={{fontSize: '0.95rem', fontWeight: 'bold', display: 'block', marginTop: 4}}>Frames won: {liveMatch.frames1}</span>
            </div>
            <div style={{textAlign: 'center', padding: '0 16px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.points1} - {liveMatch.points2}</h2>
              <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Current Frame Points</span>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.3rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.team2}</h3>
              {liveMatch.team2Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {liveMatch.team2Captain}</div>
              )}
              <span className="text-gold" style={{fontSize: '0.95rem', fontWeight: 'bold', display: 'block', marginTop: 4}}>Frames won: {liveMatch.frames2}</span>
            </div>
          </div>
        </div>

        <div className="sporty-card">
          <h4 style={{fontSize: '0.9rem', color: 'var(--primary)', marginBottom: 8, textTransform: 'uppercase'}}>Frames History</h4>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Frame</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team1}</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team2}</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
              {liveMatch.frameScores && liveMatch.frameScores.map((f, idx) => (
                <tr key={idx}>
                  <td>Frame {f.frame}</td>
                  <td style={{textAlign: 'center'}}>{f.score1}</td>
                  <td style={{textAlign: 'center'}}>{f.score2}</td>
                  <td style={{color: 'var(--primary)', fontWeight: 'bold'}}>{f.winner}</td>
                </tr>
              ))}
              {(!liveMatch.frameScores || liveMatch.frameScores.length === 0) && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem'}}>No frames completed yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (liveMatch.sport === 'Pool') {
    return (
      <div style={{...styles.container, padding: 16}}>
        <div className="sporty-card glow-green" style={{marginBottom: 16}}>
          <div className="flex-between">
            <div className="live-indicator"><span className="live-dot" /> LIVE POOL</div>
            <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>{liveMatch.venue}</span>
          </div>
          <div style={{margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.3rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.team1}</h3>
              {liveMatch.team1Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {liveMatch.team1Captain}</div>
              )}
              <span className="text-gold" style={{fontSize: '0.95rem', fontWeight: 'bold', display: 'block', marginTop: 4}}>Frames won: {liveMatch.frames1}</span>
            </div>
            <div style={{textAlign: 'center', padding: '0 16px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.points1} - {liveMatch.points2}</h2>
              <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Current Frame Balls</span>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.3rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.team2}</h3>
              {liveMatch.team2Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {liveMatch.team2Captain}</div>
              )}
              <span className="text-gold" style={{fontSize: '0.95rem', fontWeight: 'bold', display: 'block', marginTop: 4}}>Frames won: {liveMatch.frames2}</span>
            </div>
          </div>
        </div>

        <div className="sporty-card">
          <h4 style={{fontSize: '0.9rem', color: 'var(--primary)', marginBottom: 8, textTransform: 'uppercase'}}>Frames History</h4>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Frame</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team1}</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team2}</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
              {liveMatch.frameScores && liveMatch.frameScores.map((f, idx) => (
                <tr key={idx}>
                  <td>Frame {f.frame}</td>
                  <td style={{textAlign: 'center'}}>{f.score1}</td>
                  <td style={{textAlign: 'center'}}>{f.score2}</td>
                  <td style={{color: 'var(--primary)', fontWeight: 'bold'}}>{f.winner}</td>
                </tr>
              ))}
              {(!liveMatch.frameScores || liveMatch.frameScores.length === 0) && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem'}}>No frames completed yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (liveMatch.sport === 'Gaming') {
    return (
      <div style={{...styles.container, padding: 16}}>
        <div className="sporty-card glow-green" style={{marginBottom: 16}}>
          <div className="flex-between">
            <div className="live-indicator"><span className="live-dot" /> LIVE GAMING</div>
            <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>{liveMatch.venue}</span>
          </div>
          <div style={{margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.3rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.team1}</h3>
              {liveMatch.team1Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {liveMatch.team1Captain}</div>
              )}
              <span className="text-gold" style={{fontSize: '0.95rem', fontWeight: 'bold', display: 'block', marginTop: 4}}>Rounds won: {liveMatch.rounds1}</span>
            </div>
            <div style={{textAlign: 'center', padding: '0 16px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.points1} - {liveMatch.points2}</h2>
              <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Current Round Points</span>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.3rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{liveMatch.team2}</h3>
              {liveMatch.team2Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {liveMatch.team2Captain}</div>
              )}
              <span className="text-gold" style={{fontSize: '0.95rem', fontWeight: 'bold', display: 'block', marginTop: 4}}>Rounds won: {liveMatch.rounds2}</span>
            </div>
          </div>
        </div>

        <div className="sporty-card">
          <h4 style={{fontSize: '0.9rem', color: 'var(--primary)', marginBottom: 8, textTransform: 'uppercase'}}>Rounds History</h4>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Round</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team1}</th>
                <th style={{textAlign: 'center'}}>{liveMatch.team2}</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
              {liveMatch.roundScores && liveMatch.roundScores.map((r, idx) => (
                <tr key={idx}>
                  <td>Round {r.round}</td>
                  <td style={{textAlign: 'center'}}>{r.score1}</td>
                  <td style={{textAlign: 'center'}}>{r.score2}</td>
                  <td style={{color: 'var(--primary)', fontWeight: 'bold'}}>{r.winner}</td>
                </tr>
              ))}
              {(!liveMatch.roundScores || liveMatch.roundScores.length === 0) && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem'}}>No rounds completed yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const isCricket = liveMatch.sport === 'Cricket' || !liveMatch.sport;
  // If Cricket, dynamic tabs:
  const cricketTabs = [];
  if (isCricket) {
    if (liveMatch.innings === 2) {
      cricketTabs.push(liveMatch.team2, liveMatch.team1);
    } else {
      cricketTabs.push(liveMatch.team1);
    }
    cricketTabs.push('overs', 'partnerships');
  }

  return (
    <div style={{...styles.container, padding: 16}}>
      <div className="sporty-card glow-green" style={{marginBottom: 16}}>
        <div className="flex-between">
          <div className="live-indicator"><span className="live-dot" /> LIVE MATCH</div>
          <span style={{color: 'var(--text-muted)', fontSize: '0.8rem'}}>CRR: {liveMatch.crr}</span>
        </div>
        <div style={{margin: '12px 0'}} className="flex-between">
          <div>
            <h3 style={{fontSize: '1.6rem', margin: 0}}>{liveMatch.innings === 1 ? liveMatch.team1 : liveMatch.team2}</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
              <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>
                {liveMatch.innings === 1 ? '1st Innings Batting' : `2nd Innings Batting (Target: ${liveMatch.target})`}
              </span>
              {SPORTS_WITH_CAPTAINS.includes(liveMatch.sport || 'Box Cricket') && (
                <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>
                  C: {liveMatch.innings === 1 ? liveMatch.team1Captain : liveMatch.team2Captain}
                </span>
              )}
            </div>
          </div>
          <div style={{textAlign: 'right'}}>
            <h2 className="text-gold" style={{fontSize: '2.2rem'}}>{liveMatch.runs}/{liveMatch.wickets}</h2>
            <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>({Math.floor(liveMatch.balls / 6)}.{liveMatch.balls % 6} Overs)</span>
          </div>
        </div>
        {liveMatch.innings === 2 && !liveMatch.isCompleted && (
          <div style={{borderTop: '1px dashed var(--border-light)', paddingTop: 8, marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem'}}>
            <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>
              ⚡ NEEDS {liveMatch.target - liveMatch.runs} RUNS FROM {Math.max(0, (liveMatch.maxOvers * 6) - liveMatch.balls)} BALLS
            </span>
            <span style={{color: 'var(--text-muted)'}}>
              REQ RR: {(((liveMatch.target - liveMatch.runs) / (Math.max(1, (liveMatch.maxOvers * 6) - liveMatch.balls) / 6))).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="tabs-container">
        {cricketTabs.map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === liveMatch.team1 && (
        liveMatch.innings === 1 ? (
          renderProfessionalScorecard({
            battingList: liveMatch.batting,
            bowlingList: liveMatch.bowling,
            fallOfWickets: liveMatch.fallOfWickets,
            extras: liveMatch.extras,
            runs: liveMatch.runs,
            wickets: liveMatch.wickets,
            totalBalls: liveMatch.balls,
            teamName: liveMatch.team1,
            isLive: true,
            crr: liveMatch.crr,
            captainName: liveMatch.team1Captain
          })
        ) : (
          renderProfessionalScorecard({
            battingList: liveMatch.firstInningsBatting || [],
            bowlingList: liveMatch.firstInningsBowling || [],
            fallOfWickets: liveMatch.firstInningsFallOfWickets || [],
            extras: liveMatch.firstInningsExtras || { wides: 0, noBalls: 0, legByes: 0, byes: 0, total: 0 },
            runs: liveMatch.firstInningsScore || 0,
            wickets: liveMatch.firstInningsWickets || 0,
            totalBalls: liveMatch.firstInningsBalls || 0,
            teamName: liveMatch.team1,
            isLive: false,
            captainName: liveMatch.team1Captain
          })
        )
      )}

      {activeTab === liveMatch.team2 && liveMatch.innings === 2 && (
        renderProfessionalScorecard({
          battingList: liveMatch.batting,
          bowlingList: liveMatch.bowling,
          fallOfWickets: liveMatch.fallOfWickets,
          extras: liveMatch.extras,
          runs: liveMatch.runs,
          wickets: liveMatch.wickets,
          totalBalls: liveMatch.balls,
          teamName: liveMatch.team2,
          isLive: true,
          crr: liveMatch.crr,
          captainName: liveMatch.team2Captain
        })
      )}

      {activeTab === 'overs' && (
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          {/* Current Innings Overs History */}
          <div className="sporty-card">
            <h4 style={{fontSize: '0.9rem', color: 'var(--primary)', marginBottom: 12, textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>
              {liveMatch.innings === 1 ? '1st Innings Over History' : '2nd Innings Over History'}
            </h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
              {(liveMatch.oversHistory && liveMatch.oversHistory.length > 0) ? (
                liveMatch.oversHistory.slice().reverse().map((over, index) => (
                  <div key={index} style={{borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12}}>
                    <div className="flex-between" style={{fontSize: '0.85rem', fontWeight: 'bold', alignItems: 'center'}}>
                      <span style={{color: 'var(--text-primary)'}}>Over {over.overNumber} · {over.bowlerName}</span>
                      <span className="text-gold">{over.runs} Runs {over.wickets > 0 ? `· ${over.wickets} Wkts` : ''}</span>
                    </div>
                    <div style={{display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap'}}>
                      {over.balls.map((b, bi) => (
                        <span 
                          key={bi} 
                          style={{
                            ...styles.ballCircle,
                            width: 22, height: 22, fontSize: '0.7rem',
                            backgroundColor: b === 'W' ? 'var(--danger)' : b === '6' ? 'var(--primary)' : b === '4' ? 'var(--primary)' : 'var(--border-light)'
                          }}
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center'}}>No overs bowled in this innings yet.</p>
              )}
            </div>
          </div>

          {/* First Innings Overs History (If we are in 2nd innings) */}
          {liveMatch.innings === 2 && liveMatch.firstInningsOversHistory && liveMatch.firstInningsOversHistory.length > 0 && (
            <div className="sporty-card">
              <h4 style={{fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>
                1st Innings Over History
              </h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                {liveMatch.firstInningsOversHistory.slice().reverse().map((over, index) => (
                  <div key={index} style={{borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12}}>
                    <div className="flex-between" style={{fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)', alignItems: 'center'}}>
                      <span>Over {over.overNumber} · {over.bowlerName}</span>
                      <span>{over.runs} Runs {over.wickets > 0 ? `· ${over.wickets} Wkts` : ''}</span>
                    </div>
                    <div style={{display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap'}}>
                      {over.balls.map((b, bi) => (
                        <span 
                          key={bi} 
                          style={{
                            ...styles.ballCircle,
                            width: 22, height: 22, fontSize: '0.7rem',
                            backgroundColor: b === 'W' ? 'var(--danger)' : b === '6' ? 'var(--primary)' : b === '4' ? 'var(--primary)' : 'var(--border-light)'
                          }}
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'partnerships' && (
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          {liveMatch.batting.filter(b => b.isActive).length < 2 ? (
            <div className="sporty-card glow-gold" style={{ textAlign: 'center', padding: 20 }}>
              <h4 style={{ color: '#FFD700', fontSize: '0.95rem', marginBottom: 6, fontFamily: 'var(--font-heading)' }}>Single Batsman Batting</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
                All other wickets have fallen. The last batsman is batting alone.
              </p>
            </div>
          ) : (
            <div className="sporty-card glow-gold">
              <div className="flex-between" style={{marginBottom: 8}}>
                <h4 style={{fontSize: '0.95rem'}}>CURRENT PARTNERSHIP</h4>
                <span className="text-gold" style={{fontWeight: 'bold'}}>{liveMatch.partnership.runs} Runs</span>
              </div>
              <div className="flex-between" style={{fontSize: '0.85rem'}}>
                <span>{liveMatch.partnership.batter1}</span>
                <span style={{color: 'var(--text-muted)'}}>{liveMatch.partnership.balls} Balls</span>
                <span>{liveMatch.partnership.batter2}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   6. SCORER BALL-BY-BALL INPUT PANEL
   ========================================================================== */
function ScorerPanelView() {
  const { 
    teams,
    createNewMatch,
    liveMatch,
    setLiveMatch,
    logBall,
    undoLastBall,
    updateFootballScore,
    updateFootballStats,
    updateVolleyballScore,
    updateBasketballScore,
    updateBasketballStats,
    editPlayerInTeam,
    deletePlayerFromTeam,
    endFirstInnings,
    authFetch,
    venues,
    showAlert,
    showError,
    showConfirm,
    addPlayerToTeam,
    addTeam,
    saveCompletedMatch,
    setSelectedLiveMatch,
    playerId,
    userName,
    setCurrentScreen,
    updatePickleballScore,
    updateGolfStrokes,
    changeGolfHole,
    updateHockeyScore,
    updateHockeyStats,
    updateSkatingScore,
    selectedSportFilter,
    updateBadmintonScore,
    updateTableTennisScore,
    updateTennisScore,
    updateCueMatchScore,
    endCueFrame,
    updateGamingScore,
    winGamingRound,
    updateTeam,
    showPrompt,
    loadData
  } = useAppState();

  const handleShareScoring = () => {
    const shareUrl = `${window.location.origin}?shareScoreMatchId=${liveMatch.id}`;
    const text = `Take over live scoring for the match ${liveMatch.team1} vs ${liveMatch.team2} (${liveMatch.sport || 'Cricket'}): ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [oversCount, setOversCount] = useState(8);
  const [maxBowlerOvers, setMaxBowlerOvers] = useState(3);
  const [maxBowlerOversLimitCount, setMaxBowlerOversLimitCount] = useState(2);
  const [showRegisterTeam, setShowRegisterTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamCaptain, setNewTeamCaptain] = useState('');
  const [newTeamSport, setNewTeamSport] = useState('Box Cricket');

  // Sport and Venue search states
  const [selectedSport, setSelectedSport] = useState(selectedSportFilter === 'All' ? 'Cricket' : selectedSportFilter);
  React.useEffect(() => {
    if (!liveMatch) {
      setSelectedSport(selectedSportFilter === 'All' ? 'Cricket' : selectedSportFilter);
    }
  }, [selectedSportFilter, liveMatch]);
  const [venueSearchQuery, setVenueSearchQuery] = useState('');
  const [showVenueDropdown, setShowVenueDropdown] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [footballDuration, setFootballDuration] = useState(90);
  const [volleyballSets, setVolleyballSets] = useState(3);
  const [basketballDuration, setBasketballDuration] = useState(10);
  const [pickleballSets, setPickleballSets] = useState(3);
  const [pickleballTargetPoints, setPickleballTargetPoints] = useState(11);
  const [golfHoles, setGolfHoles] = useState(9);
  const [badmintonSets, setBadmintonSets] = useState(3);
  const [ttSets, setTtSets] = useState(5);
  const [tennisSets, setTennisSets] = useState(3);
  const [snookerFrames, setSnookerFrames] = useState(5);
  const [poolFrames, setPoolFrames] = useState(5);
  const [gamingRounds, setGamingRounds] = useState(3);
  const [hockeyDuration, setHockeyDuration] = useState(20);
  const [iceHockeyDuration, setIceHockeyDuration] = useState(20);
  const [showGoalTypeModal, setShowGoalTypeModal] = useState({ show: false, teamIndex: null });

  React.useEffect(() => {
    const handleOutsideClick = () => setShowVenueDropdown(false);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Roster states for ScorerPanelView
  const [activeTeamForPlayerAdd, setActiveTeamForPlayerAdd] = useState(null); // team ID if adding player
  const [searchQuery, setSearchQuery] = useState('');
  const [appUsers, setAppUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [playerPhone, setPlayerPhone] = useState('');
  const [playerRole, setPlayerRole] = useState('batsman');
  const [jersey, setJersey] = useState('-');

  // Editing player states
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editPlayerName, setEditPlayerName] = useState('');
  const [editPlayerPhone, setEditPlayerPhone] = useState('');
  const [editJersey, setEditJersey] = useState('-');
  const [editPlayerRole, setEditPlayerRole] = useState('batsman');

  // Helper to render player avatar/profile picture
  const renderPlayerAvatar = (player) => {
    let pic = null;
    if (player.phone && appUsers && appUsers.length > 0) {
      const u = appUsers.find(user => user.phone && user.phone.trim() === player.phone.trim());
      if (u) {
        pic = localStorage.getItem('bcp_profile_pic_' + u.playerId);
      }
    }
    if (!pic && player.id) {
      pic = localStorage.getItem('bcp_profile_pic_' + player.id);
    }

    if (pic) {
      return (
        <div style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '1.5px solid var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F3F4F6',
          flexShrink: 0
        }}>
          <img src={pic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      );
    }

    // Fallback: Initials with gradient background
    const initials = player.name ? player.name.trim().charAt(0).toUpperCase() : '?';
    return (
      <div 
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          flexShrink: 0,
          border: '1px solid rgba(255,255,255,0.1)'
        }}
        title={player.name}
      >
        {initials}
      </div>
    );
  };

  const handleImportSharedTeam = async () => {
    const code = await showPrompt("Import Shared Team", "Enter the Share Code / Team ID to import the team:", "e.g. team-12345");
    if (!code || !code.trim()) return;

    try {
      const res = await authFetch('http://localhost:3001/api/teams/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareCode: code.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        await showError('Error', data.error || 'Failed to import team');
      } else {
        await showAlert('Success', 'Team imported successfully!');
        await loadData();
      }
    } catch (err) {
      await showError('Error', 'Failed to connect to server');
    }
  };

  const handleShareTeam = async (team) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(team.id);
        await showAlert('Copied!', `Share Code "${team.id}" copied to clipboard! Share it with others to let them view/use this team.`);
      } else {
        await showAlert('Share Code', `Team Share Code: ${team.id}\n\nCopy this code to share with other users.`);
      }
    } catch (err) {
      await showAlert('Share Code', `Team Share Code: ${team.id}\n\nCopy this code to share with other users.`);
    }
  };

  // Wicket modal state
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [pendingWicketType, setPendingWicketType] = useState(null); // 'Caught' | 'Caught Behind' | 'Run Out'
  const [customFielderName, setCustomFielderName] = useState('');

  // Toss interactive modal states
  const [showTossModal, setShowTossModal] = useState(false);
  const [tossCaller, setTossCaller] = useState(null); // team ID of the caller
  const [tossCall, setTossCall] = useState(null); // 'Heads' | 'Tails'
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinRotation, setCoinRotation] = useState(0);
  const [coinResult, setCoinResult] = useState(null); // 'Heads' | 'Tails'
  const [tossWinner, setTossWinner] = useState(null); // team ID of winner
  const [tossChoice, setTossChoice] = useState(null); // 'Batting' | 'Bowling'

  const handleStartEditPlayer = (teamId, player) => {
    setEditingPlayerId(player.id);
    setEditingTeamId(teamId);
    setEditPlayerName(player.name);
    setEditPlayerPhone(player.phone || '');
    setEditJersey(player.jersey);
    setEditPlayerRole(player.role);
  };

  const handleSaveEditPlayer = async (e) => {
    e.preventDefault();
    if (!editPlayerName) {
      await showError('Validation Error', 'Please fill out the Name field!');
      return;
    }
    
    editPlayerInTeam(editingTeamId, editingPlayerId, {
      name: editPlayerName,
      jersey: editJersey || '-',
      role: editPlayerRole,
      phone: editPlayerPhone || null
    });
    
    await showAlert('Success', 'Player details updated successfully!');
    setEditingPlayerId(null);
    setEditingTeamId(null);
  };

  const handleDeletePlayerClick = async (teamId, playerId, playerName) => {
    const confirm = await showConfirm('Delete Player', `Are you sure you want to delete "${playerName}" from this team?`);
    if (confirm) {
      deletePlayerFromTeam(teamId, playerId);
      await showAlert('Deleted', 'Player deleted from team successfully.');
    }
  };

  // Fetch registered player app accounts on mount
  React.useEffect(() => {
    authFetch('http://localhost:3001/api/users')
      .then(res => res.ok ? res.json() : [])
      .then(data => setAppUsers(data))
      .catch(err => console.error("Error loading app users in scorer panel:", err));
  }, []);

  // Clean up states on close of form
  React.useEffect(() => {
    if (!activeTeamForPlayerAdd) {
      setSearchQuery('');
      setSelectedUser(null);
      setPlayerPhone('');
      setPlayerName('');
      setJersey('-');
    }
  }, [activeTeamForPlayerAdd]);

  const handleInlineAddPlayer = async (e) => {
    e.preventDefault();
    if (!activeTeamForPlayerAdd || !playerName) {
      await showError('Validation Error', 'Please fill out all required fields!');
      return;
    }
    if (!selectedUser && !playerPhone) {
      await showError('Validation Error', 'Please enter a Phone Number for manual registration or select an app player!');
      return;
    }

    addPlayerToTeam(activeTeamForPlayerAdd, {
      name: playerName,
      role: playerRole,
      jersey: jersey || '-',
      phone: playerPhone || (selectedUser ? selectedUser.phone : null)
    });
    await showAlert('Success', 'Player Registered to Team!');
    setPlayerName('');
    setJersey('-');
    setPlayerPhone('');
    setSelectedUser(null);
    setSearchQuery('');
    setActiveTeamForPlayerAdd(null);
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    const hasCaptain = SPORTS_WITH_CAPTAINS.includes(newTeamSport);
    if (!newTeamName || (hasCaptain && !newTeamCaptain)) {
      await showError('Validation Error', 'Please fill out all fields!');
      return;
    }
    addTeam(newTeamName, hasCaptain ? newTeamCaptain : '', newTeamSport);
    await showAlert('Success', 'Team Registered Successfully!');
    setNewTeamName('');
    setNewTeamCaptain('');
    setNewTeamSport('Box Cricket');
    setShowRegisterTeam(false);
  };

  const handleStartMatch = async (e) => {
    e.preventDefault();
    if (!selectedVenue) {
      await showError('Match Setup', 'Please search and select a Venue for the match!');
      return;
    }
    if (!teamA || !teamB) {
      await showError('Match Setup', 'Please select both Team A and Team B!');
      return;
    }
    if (teamA === teamB) {
      await showError('Match Setup', 'A team cannot play against itself!');
      return;
    }
    const tA = teams.find(t => t.id === teamA);
    const tB = teams.find(t => t.id === teamB);
    
    if (selectedSport === 'Cricket') {
      if (!tA || tA.players.length < 2 || !tB || tB.players.length < 2) {
        await showError('Roster Requirement', 'Both selected teams must have at least 2 players registered before starting a match!');
        return;
      }
      // Reset and trigger Toss modal for Cricket
      setTossCaller(null);
      setTossCall(null);
      setCoinResult(null);
      setTossWinner(null);
      setTossChoice(null);
      setIsFlipping(false);
      setShowTossModal(true);
    } else {
      let config = {};
      if (selectedSport === 'Football') {
        config = { duration: footballDuration };
      } else if (selectedSport === 'Volleyball') {
        config = { sets: volleyballSets };
      } else if (selectedSport === 'Basketball') {
        config = { duration: basketballDuration };
      } else if (selectedSport === 'Pickleball') {
        config = { sets: pickleballSets, targetPoints: pickleballTargetPoints };
      } else if (selectedSport === 'Golf') {
        config = { holes: golfHoles };
      } else if (selectedSport === 'Hockey') {
        config = { duration: hockeyDuration };
      } else if (selectedSport === 'Ice Hockey') {
        config = { duration: iceHockeyDuration };
      } else if (selectedSport === 'Skating') {
        config = {};
      } else if (selectedSport === 'Badminton') {
        config = { sets: badmintonSets };
      } else if (selectedSport === 'Table Tennis') {
        config = { sets: ttSets };
      } else if (selectedSport === 'Tennis') {
        config = { sets: tennisSets };
      } else if (selectedSport === 'Snooker') {
        config = { frames: snookerFrames };
      } else if (selectedSport === 'Pool') {
        config = { frames: poolFrames };
      } else if (selectedSport === 'Gaming') {
        config = { rounds: gamingRounds };
      }
      createNewMatch(teamA, teamB, config, selectedSport, selectedVenue.name);
      await showAlert('Match Launched', 'Live match started!');
    }
  };

  const handleFlipCoin = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setCoinResult(null);
    setTossWinner(null);

    // Random result: equal 50/50 probability
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    
    // Check if currently showing Tails (odd multiple of 180 degrees)
    const isCurrentlyTails = (coinRotation / 180) % 2 !== 0;
    
    // Add multiple spins (1800 deg = 5 full rotations)
    let degreesToAdd = 1800;
    if (result === 'Heads') {
      degreesToAdd += isCurrentlyTails ? 180 : 0;
    } else {
      degreesToAdd += isCurrentlyTails ? 0 : 180;
    }
    
    const nextRotation = coinRotation + degreesToAdd;
    setCoinRotation(nextRotation);

    setTimeout(() => {
      setIsFlipping(false);
      setCoinResult(result);

      // Determine toss winner
      const otherTeamId = tossCaller === teamA ? teamB : teamA;
      if (tossCall === result) {
        setTossWinner(tossCaller);
      } else {
        setTossWinner(otherTeamId);
      }
    }, 2000);
  };

  const handleLaunchCricketMatch = async () => {
    if (!tossWinner || !tossChoice) {
      await showError('Toss Decision', 'Toss winner must elect to bat or bowl first!');
      return;
    }

    const tA = teams.find(t => t.id === teamA);
    const tB = teams.find(t => t.id === teamB);
    const callerTeam = teams.find(t => t.id === tossCaller);
    const winnerTeam = teams.find(t => t.id === tossWinner);

    // Determine dynamic batting and bowling order based on toss winner's choice
    let battingTeamId, bowlingTeamId;
    if (tossWinner === teamA) {
      if (tossChoice === 'Batting') {
        battingTeamId = teamA;
        bowlingTeamId = teamB;
      } else {
        battingTeamId = teamB;
        bowlingTeamId = teamA;
      }
    } else {
      if (tossChoice === 'Batting') {
        battingTeamId = teamB;
        bowlingTeamId = teamA;
      } else {
        battingTeamId = teamA;
        bowlingTeamId = teamB;
      }
    }

    const decisionText = tossChoice === 'Batting' ? 'bat' : 'bowl';
    const tossSummaryText = `${winnerTeam.name} won the toss and elected to ${decisionText} first.`;

    const config = {
      overs: oversCount,
      maxBowlerOvers: parseInt(maxBowlerOvers) || 3,
      maxBowlerOversLimitCount: parseInt(maxBowlerOversLimitCount) || 2,
      toss: {
        caller: callerTeam.name,
        call: tossCall,
        result: coinResult,
        winnerName: winnerTeam.name,
        decision: tossChoice,
        text: tossSummaryText
      }
    };

    createNewMatch(battingTeamId, bowlingTeamId, config, 'Cricket', selectedVenue.name);
    setShowTossModal(false);
    await showAlert('Match Launched', 'Live match started!');
  };

  const getFilteredVenues = () => {
    return venues.filter(v => {
      const targetSport = selectedSport === 'Cricket' ? 'box cricket' : selectedSport.toLowerCase();
      const venueSports = v.sports || (v.sport ? [v.sport] : ['box cricket']);
      return venueSports.some(s => s.toLowerCase().includes(targetSport) || targetSport.includes(s.toLowerCase()));
    });
  };
  const matchedVenues = getFilteredVenues().filter(v => 
    v.name.toLowerCase().includes(venueSearchQuery.toLowerCase()) ||
    v.address.toLowerCase().includes(venueSearchQuery.toLowerCase())
  );

  const getFilteredTeams = () => {
    return teams.filter(t => {
      const tSport = (t.sport || 'Box Cricket').toLowerCase();
      const selSport = selectedSport.toLowerCase();
      if (selSport === 'cricket' || selSport === 'box cricket') {
        return tSport === 'cricket' || tSport === 'box cricket';
      }
      return tSport === selSport;
    });
  };
  const filteredTeams = getFilteredTeams();

  if (!liveMatch) {
    return (
      <div style={{...styles.container, padding: 16}}>
        <div className="sporty-card glow-green" style={{marginBottom: 20}}>
          <h2 style={{fontSize: '1.4rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)', letterSpacing: '0.5px', marginBottom: 6}}>📝 LIVE MATCH LAUNCHER</h2>
          <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4}}>
            Select two registered teams, choose the sport and venue, and configure rules to launch the live scorer.
          </p>
        </div>

        {/* TEAM REGISTRATION */}
        {showRegisterTeam ? (
          <form onSubmit={handleCreateTeam} className="sporty-card glow-gold" style={{marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10}}>
            <h4 style={{fontSize: '0.9rem', color: 'var(--primary)', textTransform: 'uppercase'}}>Register New Team</h4>
            <div className="form-group">
              <label className="form-label">Team Name</label>
              <input 
                type="text" 
                placeholder="e.g. MUMBAI WARRIORS" 
                className="form-input" 
                value={newTeamName}
                maxLength={50}
                onChange={e => setNewTeamName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Sport</label>
              <select
                value={newTeamSport}
                onChange={e => {
                  setNewTeamSport(e.target.value);
                  if (!SPORTS_WITH_CAPTAINS.includes(e.target.value)) {
                    setNewTeamCaptain('');
                  }
                }}
                className="form-input"
              >
                {REGISTERABLE_SPORTS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            {SPORTS_WITH_CAPTAINS.includes(newTeamSport) && (
              <div className="form-group">
                <label className="form-label">Team Captain</label>
                <input 
                  type="text" 
                  placeholder="Captain Name" 
                  className="form-input" 
                  value={newTeamCaptain}
                  maxLength={50}
                  onChange={e => setNewTeamCaptain(e.target.value)}
                />
              </div>
            )}
            <div style={{display: 'flex', gap: 10}}>
              <button type="button" onClick={() => setShowRegisterTeam(false)} className="btn-outlined" style={{flex: 1, padding: '10px 0'}}>
                Cancel
              </button>
              <button type="submit" className="btn-neon" style={{flex: 1, padding: '10px 0'}}>
                CREATE TEAM ⚡
              </button>
            </div>
          </form>
        ) : (
          <button onClick={() => setShowRegisterTeam(true)} className="btn-outlined" style={{width: '100%', marginBottom: 20, padding: '12px 0'}}>
            ➕ REGISTER NEW TEAM
          </button>
        )}

        {/* MATCH CONFIG FORM */}
        <form onSubmit={handleStartMatch} onClick={e => e.stopPropagation()} className="sporty-card" style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          <h4 style={{fontSize: '0.9rem', color: 'var(--primary)', textTransform: 'uppercase'}}>Match Configurations</h4>
          {teams.length < 2 ? (
            <p style={{fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '10px 0'}}>
              Please register at least 2 teams to launch a match. Use the register team button above!
            </p>
          ) : (
            <>
              {/* Sport Selection First */}
              <div className="form-group">
                <label className="form-label">⚽ Select Sport</label>
                <select 
                  value={selectedSport} 
                  onChange={e => {
                    setSelectedSport(e.target.value);
                    setSelectedVenue(null);
                    setVenueSearchQuery('');
                  }} 
                  className="form-input"
                >
                  <option value="Cricket">Cricket 🏏</option>
                  <option value="Football">Football ⚽</option>
                  <option value="Volleyball">Volleyball 🏐</option>
                  <option value="Basketball">Basketball 🏀</option>
                  <option value="Pickleball">Pickleball 🏓</option>
                  <option value="Golf">Golf ⛳</option>
                  <option value="Hockey">Hockey 🏑</option>
                  <option value="Ice Hockey">Ice Hockey 🏒</option>
                  <option value="Skating">Skating 🛼</option>
                </select>
              </div>

              {/* Venue Selection search bar */}
              <div className="form-group" style={{position: 'relative'}}>
                <label className="form-label">🔍 Select Venue</label>
                <input 
                  type="text" 
                  placeholder="🔍 Search venue by name or address..." 
                  className="form-input" 
                  value={venueSearchQuery}
                  maxLength={100}
                  onChange={e => {
                    setVenueSearchQuery(e.target.value);
                    setShowVenueDropdown(true);
                  }}
                  onFocus={() => setShowVenueDropdown(true)}
                />
                {showVenueDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    backgroundColor: 'var(--bg-surface-solid)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    {matchedVenues.map(v => (
                      <div 
                        key={v.id} 
                        onClick={() => {
                          setSelectedVenue(v);
                          setVenueSearchQuery(v.name);
                          setShowVenueDropdown(false);
                        }}
                        style={{
                          padding: '10px 12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid var(--border-light)',
                          fontSize: '0.85rem',
                          color: 'var(--text-primary)',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-secondary)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <div style={{fontWeight: 'bold'}}>{v.name}</div>
                        <div style={{fontSize: '0.72rem', color: 'var(--text-muted)'}}>{v.address}</div>
                      </div>
                    ))}
                    {matchedVenues.length === 0 && (
                      <div style={{padding: '10px 12px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center'}}>
                        No venues found for {selectedSport}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Team selection */}
              <div className="form-group">
                <label className="form-label">Select Team A ({selectedSport === 'Cricket' ? 'Batting' : 'Home'})</label>
                <select value={teamA} onChange={e => setTeamA(e.target.value)} className="form-input">
                  <option value="">-- Choose Team A --</option>
                  {filteredTeams.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.players.length} Players)</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Select Team B ({selectedSport === 'Cricket' ? 'Bowling' : 'Away'})</label>
                <select value={teamB} onChange={e => setTeamB(e.target.value)} className="form-input">
                  <option value="">-- Choose Team B --</option>
                  {filteredTeams.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.players.length} Players)</option>
                  ))}
                </select>
              </div>

              {/* Sport specific config inputs */}
              {selectedSport === 'Cricket' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Match Overs</label>
                    <input type="number" value={oversCount} onChange={e => setOversCount(e.target.value.slice(0, 3))} className="form-input" />
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 4, marginBottom: 12 }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Max Overs Per Bowler</label>
                      <input 
                        type="number" 
                        value={maxBowlerOvers} 
                        onChange={e => setMaxBowlerOvers(Math.max(1, parseInt(e.target.value) || 1))} 
                        className="form-input" 
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Bowlers Allowed Max</label>
                      <input 
                        type="number" 
                        value={maxBowlerOversLimitCount} 
                        onChange={e => setMaxBowlerOversLimitCount(Math.max(1, parseInt(e.target.value) || 1))} 
                        className="form-input" 
                      />
                    </div>
                  </div>
                </>
              )}
              {selectedSport === 'Football' && (
                <div className="form-group">
                  <label className="form-label">Match Duration (Minutes)</label>
                  <input type="number" value={footballDuration} onChange={e => setFootballDuration(e.target.value.slice(0, 3))} className="form-input" />
                </div>
              )}
              {selectedSport === 'Volleyball' && (
                <div className="form-group">
                  <label className="form-label">Sets (Best Of)</label>
                  <select value={volleyballSets} onChange={e => setVolleyballSets(e.target.value)} className="form-input">
                    <option value="3">Best of 3 Sets</option>
                    <option value="5">Best of 5 Sets</option>
                  </select>
                </div>
              )}
              {selectedSport === 'Basketball' && (
                <div className="form-group">
                  <label className="form-label">Quarter Duration (Minutes)</label>
                  <input type="number" value={basketballDuration} onChange={e => setBasketballDuration(e.target.value.slice(0, 3))} className="form-input" />
                </div>
              )}
              {selectedSport === 'Pickleball' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Sets (Best Of)</label>
                    <select value={pickleballSets} onChange={e => setPickleballSets(e.target.value)} className="form-input">
                      <option value="3">Best of 3 Sets</option>
                      <option value="5">Best of 5 Sets</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Points to Win Set</label>
                    <input type="number" value={pickleballTargetPoints} onChange={e => setPickleballTargetPoints(e.target.value)} className="form-input" />
                  </div>
                </>
              )}
              {selectedSport === 'Golf' && (
                <div className="form-group">
                  <label className="form-label">Holes to Play</label>
                  <select value={golfHoles} onChange={e => setGolfHoles(e.target.value)} className="form-input">
                    <option value="9">9 Holes</option>
                    <option value="18">18 Holes</option>
                  </select>
                </div>
              )}
              {selectedSport === 'Hockey' && (
                <div className="form-group">
                  <label className="form-label">Period Duration (Minutes)</label>
                  <input type="number" value={hockeyDuration} onChange={e => setHockeyDuration(e.target.value.slice(0, 3))} className="form-input" />
                </div>
              )}
              {selectedSport === 'Ice Hockey' && (
                <div className="form-group">
                  <label className="form-label">Period Duration (Minutes)</label>
                  <input type="number" value={iceHockeyDuration} onChange={e => setIceHockeyDuration(e.target.value.slice(0, 3))} className="form-input" />
                </div>
              )}
              {selectedSport === 'Badminton' && (
                <div className="form-group">
                  <label className="form-label">Sets (Best Of)</label>
                  <select value={badmintonSets} onChange={e => setBadmintonSets(parseInt(e.target.value))} className="form-input">
                    <option value="3">Best of 3 Sets</option>
                    <option value="5">Best of 5 Sets</option>
                  </select>
                </div>
              )}
              {selectedSport === 'Table Tennis' && (
                <div className="form-group">
                  <label className="form-label">Sets (Best Of)</label>
                  <select value={ttSets} onChange={e => setTtSets(parseInt(e.target.value))} className="form-input">
                    <option value="3">Best of 3 Sets</option>
                    <option value="5">Best of 5 Sets</option>
                    <option value="7">Best of 7 Sets</option>
                  </select>
                </div>
              )}
              {selectedSport === 'Tennis' && (
                <div className="form-group">
                  <label className="form-label">Sets (Best Of)</label>
                  <select value={tennisSets} onChange={e => setTennisSets(parseInt(e.target.value))} className="form-input">
                    <option value="3">Best of 3 Sets</option>
                    <option value="5">Best of 5 Sets</option>
                  </select>
                </div>
              )}
              {selectedSport === 'Snooker' && (
                <div className="form-group">
                  <label className="form-label">Frames (Best Of)</label>
                  <select value={snookerFrames} onChange={e => setSnookerFrames(parseInt(e.target.value))} className="form-input">
                    <option value="3">Best of 3 Frames</option>
                    <option value="5">Best of 5 Frames</option>
                    <option value="7">Best of 7 Frames</option>
                    <option value="9">Best of 9 Frames</option>
                  </select>
                </div>
              )}
              {selectedSport === 'Pool' && (
                <div className="form-group">
                  <label className="form-label">Frames (Best Of)</label>
                  <select value={poolFrames} onChange={e => setPoolFrames(parseInt(e.target.value))} className="form-input">
                    <option value="3">Best of 3 Frames</option>
                    <option value="5">Best of 5 Frames</option>
                    <option value="7">Best of 7 Frames</option>
                  </select>
                </div>
              )}
              {selectedSport === 'Gaming' && (
                <div className="form-group">
                  <label className="form-label">Rounds (Best Of)</label>
                  <select value={gamingRounds} onChange={e => setGamingRounds(parseInt(e.target.value))} className="form-input">
                    <option value="3">Best of 3 Rounds</option>
                    <option value="5">Best of 5 Rounds</option>
                  </select>
                </div>
              )}

              <button type="submit" className="btn-neon" style={{marginTop: 8, padding: '12px 0'}}>
                START LIVE MATCH 🚀
              </button>
            </>
          )}
        </form>

        {/* TEAMS & ROSTERS SECTION ON SCORER DASHBOARD */}
        <div className="sporty-card" style={{marginTop: 20}}>
          <div className="flex-between" style={{marginBottom: 12}}>
            <h3 style={{fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-condensed)', letterSpacing: '0.5px'}}>👥 REGISTERED TEAMS & ROSTERS</h3>
            <button 
              onClick={handleImportSharedTeam} 
              className="btn-outlined" 
              style={{padding: '3px 8px', fontSize: '0.65rem', width: 'auto', borderColor: 'var(--primary)', color: 'var(--primary)'}}
            >
              📥 Import Team
            </button>
          </div>
          
          {teams.length === 0 ? (
            <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '15px 0'}}>
              No teams registered yet. Use the "Register New Team" button above to add one!
            </p>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
              {teams.map(t => (
                <div key={t.id} style={{padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border-light)'}}>
                  <div className="flex-between" style={{marginBottom: 6}}>
                    <div style={{flex: 1}}>
                      <div style={{display: 'flex', gap: 6, alignItems: 'center'}}>
                        <h4 style={{
                          color: 'var(--text-primary)', 
                          fontSize: '1.05rem', 
                          margin: 0, 
                          fontWeight: '700',
                          fontFamily: 'var(--font-heading)',
                          letterSpacing: '0.3px',
                          lineHeight: 1.3
                        }}>{t.name}</h4>
                        <button 
                          onClick={() => handleShareTeam(t)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--primary)',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            padding: '2px 4px',
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}
                          title="Share Team Code"
                        >
                          🔗
                        </button>
                      </div>
                      <span style={{fontSize: '0.72rem', color: 'var(--text-muted)'}}>{t.captain ? `Captain: ${t.captain}` : ''}</span>
                    </div>
                    {activeTeamForPlayerAdd !== t.id && (
                      <button 
                        onClick={() => setActiveTeamForPlayerAdd(t.id)} 
                        className="btn-outlined" 
                        style={{padding: '4px 10px', fontSize: '0.7rem', width: 'auto'}}
                      >
                        + Add Player
                      </button>
                    )}
                  </div>

                  {/* INLINE ADD PLAYER FORM FOR THIS TEAM */}
                  {activeTeamForPlayerAdd === t.id && (
                    <form onSubmit={handleInlineAddPlayer} className="sporty-card glow-green" style={{margin: '10px 0', padding: 12, display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--bg-secondary)'}}>
                      <h5 style={{fontSize: '0.8rem', color: 'var(--primary)', margin: 0, textTransform: 'uppercase'}}>Add Player to {t.name}</h5>
                      
                      {/* Search App Player Accounts */}
                      <div className="form-group">
                        <label className="form-label" style={{fontSize: '0.75rem'}}>🔍 Search Registered App Users</label>
                        <div style={{display: 'flex', gap: 6}}>
                          <input 
                            type="text" 
                            placeholder="🔍 Enter phone number to search..." 
                            className="form-input" 
                            value={searchQuery}
                            maxLength={15}
                            onChange={e => {
                              setSearchQuery(e.target.value);
                              if (!e.target.value) {
                                setSelectedUser(null);
                                setPlayerName('');
                                setPlayerPhone('');
                              }
                            }}
                          />
                          {searchQuery && /^[0-9+\-\s]+$/.test(searchQuery.trim()) && (
                            <button
                              type="button"
                              onClick={() => {
                                setPlayerPhone(searchQuery.trim());
                                setSelectedUser(null);
                                setSearchQuery('');
                                setPlayerName('');
                              }}
                              className="btn-neon"
                              style={{padding: '0 12px', fontSize: '0.8rem', width: 'auto', flexShrink: 0}}
                              title="Add as new player"
                            >
                              ➕
                            </button>
                          )}
                        </div>
                        {searchQuery && !selectedUser && (
                          <div style={{
                            maxHeight: 120, overflowY: 'auto', background: 'var(--bg-surface-solid)',
                            border: '1px solid var(--border-light)', borderRadius: 6, marginTop: 4
                          }}>
                            {(() => {
                              const isPhone = /^[0-9+\-\s]+$/.test(searchQuery.trim());
                              const filtered = appUsers.filter(u => 
                                (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                (u.phone && u.phone.includes(searchQuery))
                              );
                              return (
                                <>
                                  {isPhone && (
                                    <div 
                                      onClick={() => {
                                        setPlayerPhone(searchQuery.trim());
                                        setSelectedUser(null);
                                        setSearchQuery('');
                                        setPlayerName('');
                                      }}
                                      style={{
                                        padding: '6px 10px', borderBottom: '1px solid rgba(255,255,255,0.03)',
                                        cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                                        alignItems: 'center', fontSize: '0.75rem', color: 'var(--primary)',
                                        fontWeight: 'bold', background: 'rgba(170,255,0,0.03)'
                                      }}
                                    >
                                      <span>➕ Add "{searchQuery}" as a new player</span>
                                      <span style={{fontSize: '0.68rem'}}>MANUAL ➕</span>
                                    </div>
                                  )}
                                  {filtered.length === 0 ? (
                                    !isPhone && (
                                      <div style={{padding: 6, fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center'}}>
                                        No matching accounts. Fill details manually below!
                                      </div>
                                    )
                                  ) : (
                                    filtered.map(u => (
                                      <div 
                                        key={u.playerId} 
                                        onClick={() => {
                                          setSelectedUser(u);
                                          setPlayerName(u.username || u.email.split('@')[0]);
                                          setPlayerPhone(u.phone || '');
                                          setSearchQuery(u.username || u.email);
                                        }}
                                        style={{
                                          padding: '6px 10px', borderBottom: '1px solid rgba(255,255,255,0.03)',
                                          cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                                          alignItems: 'center', fontSize: '0.75rem'
                                        }}
                                      >
                                        <div>
                                          <div style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{u.username || '—'}</div>
                                          <div style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>{u.email}</div>
                                        </div>
                                        <span style={{fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 'bold'}}>SELECT ➕</span>
                                      </div>
                                    ))
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>

                      {/* Selected linked user card */}
                      {selectedUser && (
                        <div style={{
                          padding: 8, background: 'rgba(170,255,0,0.05)', border: '1px solid var(--primary)',
                          borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                          <div>
                            <span style={{fontSize: '0.6rem', color: 'var(--primary)', fontWeight: 'bold', display: 'block'}}>LINKED ACCOUNT</span>
                            <span style={{fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 'bold'}}>{selectedUser.username || selectedUser.email}</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => { setSelectedUser(null); setSearchQuery(''); setPlayerName(''); setPlayerPhone(''); }}
                            style={{background: 'transparent', border: 'none', color: '#EF4444', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold'}}
                          >
                            Unlink ✖️
                          </button>
                        </div>
                      )}

                      <div className="form-group">
                        <label className="form-label" style={{fontSize: '0.75rem'}}>Player Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Suresh R." 
                          className="form-input" 
                          value={playerName}
                          maxLength={50}
                          onChange={e => setPlayerName(e.target.value)}
                          disabled={!!selectedUser}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{fontSize: '0.75rem'}}>Phone Number</label>
                        <input 
                          type="text" 
                          placeholder="Manual entry phone number" 
                          className="form-input" 
                          value={playerPhone}
                          maxLength={15}
                          onChange={e => setPlayerPhone(e.target.value)}
                          disabled={!!selectedUser}
                          required={!selectedUser}
                        />
                      </div>


                      <div className="form-group">
                        <label className="form-label" style={{fontSize: '0.75rem'}}>Playing Role</label>
                        <select 
                          value={playerRole} 
                          onChange={e => setPlayerRole(e.target.value)} 
                          className="form-input"
                          required
                        >
                          <option value="batsman">Batsman</option>
                          <option value="bowler">Bowler</option>
                          <option value="allrounder">All-Rounder</option>
                        </select>
                      </div>

                      <div style={{display: 'flex', gap: 8, marginTop: 4}}>
                        <button type="button" onClick={() => setActiveTeamForPlayerAdd(null)} className="btn-outlined" style={{flex: 1, padding: '6px 0', fontSize: '0.75rem'}}>
                          Cancel
                        </button>
                        <button type="submit" className="btn-neon" style={{flex: 1, padding: '6px 0', fontSize: '0.75rem'}}>
                          SAVE PLAYER ⚡
                        </button>
                      </div>
                    </form>
                  )}

                  {/* PLAYER ROSTER DISPLAY */}
                  {/* PLAYER ROSTER DISPLAY */}
                  {t.players.length > 0 ? (
                    <div style={{display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8}}>
                      {t.players.map(p => {
                        const isEditingThisPlayer = editingPlayerId === p.id;
                        const isCaptain = SPORTS_WITH_CAPTAINS.includes(t.sport || 'Box Cricket') && t.captain === p.name;
                        if (isEditingThisPlayer) {
                          return (
                            <form 
                              key={p.id} 
                              onSubmit={handleSaveEditPlayer}
                              className="sporty-card glow-gold" 
                              style={{padding: 10, display: 'flex', flexDirection: 'column', gap: 8, background: 'rgba(255,255,255,0.03)'}}
                            >
                              <span style={{fontSize: '0.72rem', color: 'var(--secondary)', fontWeight: 'bold'}}>EDIT PLAYER DETAILS</span>
                              <div className="form-group" style={{marginBottom: 4}}>
                                <input 
                                  type="text" 
                                  placeholder="Name" 
                                  className="form-input" 
                                  style={{padding: '6px 8px', fontSize: '0.8rem'}}
                                  value={editPlayerName}
                                  maxLength={50}
                                  onChange={e => setEditPlayerName(e.target.value)}
                                  required 
                                />
                              </div>
                              <div style={{marginTop: 6}}>
                                <select 
                                  value={editPlayerRole} 
                                  onChange={e => setEditPlayerRole(e.target.value)} 
                                  className="form-input"
                                  style={{padding: '6px 8px', fontSize: '0.8rem'}}
                                >
                                  <option value="batsman">Batsman</option>
                                  <option value="bowler">Bowler</option>
                                  <option value="allrounder">All-Rounder</option>
                                </select>
                              </div>
                              <div className="form-group" style={{marginBottom: 4}}>
                                <input 
                                  type="text" 
                                  placeholder="Phone Number (Optional)" 
                                  className="form-input" 
                                  style={{padding: '6px 8px', fontSize: '0.8rem'}}
                                  value={editPlayerPhone}
                                  maxLength={15}
                                  onChange={e => setEditPlayerPhone(e.target.value)}
                                />
                              </div>
                              <div style={{display: 'flex', gap: 6, marginTop: 2}}>
                                <button 
                                  type="button" 
                                  onClick={() => { setEditingPlayerId(null); setEditingTeamId(null); }} 
                                  className="btn-outlined" 
                                  style={{flex: 1, padding: '4px 0', fontSize: '0.7rem', width: 'auto'}}
                                >
                                  Cancel
                                </button>
                                <button 
                                  type="submit" 
                                  className="btn-neon" 
                                  style={{flex: 1, padding: '4px 0', fontSize: '0.7rem', width: 'auto'}}
                                >
                                  Save ⚡
                                </button>
                              </div>
                            </form>
                          );
                        }

                        return (
                          <div key={p.id} style={{...styles.miniPlayerRow, gap: 10}}>
                            <div style={{display: 'flex', gap: 8, alignItems: 'center', flex: 1}}>
                              {SPORTS_WITH_CAPTAINS.includes(t.sport || 'Box Cricket') && (
                                <input 
                                  type="radio" 
                                  name={`scorer-captain-${t.id}`}
                                  checked={isCaptain}
                                  onChange={() => updateTeam(t.id, { captain: p.name })}
                                  style={{
                                    accentColor: 'var(--primary)',
                                    cursor: 'pointer',
                                    width: 14,
                                    height: 14,
                                    marginRight: 2
                                  }}
                                  title="Set as Captain"
                                />
                              )}
                              {renderPlayerAvatar(p)}
                              <span style={{fontSize: '0.8rem', color: 'var(--text-primary)'}}>
                                {p.name}
                                {isCaptain && <span title="Captain" style={{marginLeft: 4}}>👑</span>}
                              </span>
                            </div>
                            <div style={{display: 'flex', gap: 6, alignItems: 'center'}}>
                              <span className={`role-badge ${p.role}`} style={{fontSize: '0.58rem', padding: '1px 5px'}}>{p.role}</span>
                              <button
                                type="button"
                                onClick={() => handleStartEditPlayer(t.id, p)}
                                style={{
                                  background: 'transparent', border: 'none', cursor: 'pointer',
                                  fontSize: '0.82rem', padding: '2px 4px', color: 'var(--primary)',
                                  display: 'flex', alignItems: 'center'
                                }}
                                title="Edit Player"
                              >
                                ✏️
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePlayerClick(t.id, p.id, p.name)}
                                style={{
                                  background: 'transparent', border: 'none', cursor: 'pointer',
                                  fontSize: '0.82rem', padding: '2px 4px', color: '#EF4444',
                                  display: 'flex', alignItems: 'center'
                                }}
                                title="Delete Player"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p style={{fontSize: '0.72rem', color: 'var(--text-muted)', margin: '8px 0 0 0', fontStyle: 'italic'}}>
                      No players in this roster yet. Click "+ Add Player" to start adding!
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TOSS MODAL */}
        {showTossModal && (
          <div style={styles.modalOverlay}>
            <div className="sporty-card glow-green" style={{width: '90%', maxWidth: 450, padding: 24, textAlign: 'center', backgroundColor: 'var(--bg-surface-solid)', border: '2px solid var(--primary)'}}>
              <h3 style={{fontFamily: 'var(--font-condensed)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 16}}>
                🪙 MATCH TOSS MANAGER
              </h3>

              {/* STEP 1: SELECT CALLER */}
              {!tossCaller && (
                <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                  <h4 style={{fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 4}}>
                    Step 1: Who calls the toss?
                  </h4>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
                    <button
                      type="button"
                      onClick={() => setTossCaller(teamA)}
                      className="btn-outlined"
                      style={{padding: '12px 6px', fontSize: '0.85rem', fontWeight: 'bold'}}
                    >
                      📢 {teams.find(t => t.id === teamA)?.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTossCaller(teamB)}
                      className="btn-outlined"
                      style={{padding: '12px 6px', fontSize: '0.85rem', fontWeight: 'bold'}}
                    >
                      📢 {teams.find(t => t.id === teamB)?.name}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: SELECT CALL VALUE */}
              {tossCaller && !tossCall && (
                <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                  <h4 style={{fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 4}}>
                    Step 2: What is {teams.find(t => t.id === tossCaller)?.name}'s call?
                  </h4>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
                    <button
                      type="button"
                      onClick={() => setTossCall('Heads')}
                      className="btn-outlined"
                      style={{padding: '12px 6px', fontSize: '0.9rem', fontWeight: 'bold', borderColor: 'var(--primary)', color: 'var(--primary)'}}
                    >
                      🪙 HEADS
                    </button>
                    <button
                      type="button"
                      onClick={() => setTossCall('Tails')}
                      className="btn-outlined"
                      style={{padding: '12px 6px', fontSize: '0.9rem', fontWeight: 'bold', borderColor: 'var(--secondary)', color: 'var(--secondary)'}}
                    >
                      🪙 TAILS
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: FLIP THE COIN */}
              {tossCaller && tossCall && !tossWinner && (
                <div style={{display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center'}}>
                  <h4 style={{fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', margin: '4px 0'}}>
                    Step 3: Flip the Coin
                  </h4>
                  <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>
                    {teams.find(t => t.id === tossCaller)?.name} called <strong>{tossCall.toUpperCase()}</strong>
                  </p>
                  
                  {/* Interactive 3D Coin */}
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transform: `rotateY(${coinRotation}deg)`,
                    margin: '20px auto',
                    cursor: 'pointer'
                  }} onClick={handleFlipCoin}>
                    {/* Heads Side */}
                    <div style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      backfaceVisibility: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #FFE066 0%, #F5B041 100%)',
                      color: '#5D4037',
                      border: '4px solid #F39C12',
                      boxShadow: '0 0 20px rgba(243, 156, 18, 0.5)',
                      fontWeight: 'bold',
                      fontFamily: 'var(--font-condensed)'
                    }}>
                      <span style={{fontSize: '1.8rem'}}>👑</span>
                      <span style={{fontSize: '0.8rem', letterSpacing: '1px'}}>HEADS</span>
                    </div>
                    {/* Tails Side */}
                    <div style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      backfaceVisibility: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #BDC3C7 0%, #7F8C8D 100%)',
                      color: '#2C3E50',
                      border: '4px solid #95A5A6',
                      boxShadow: '0 0 20px rgba(149, 165, 166, 0.5)',
                      fontWeight: 'bold',
                      fontFamily: 'var(--font-condensed)',
                      transform: 'rotateY(180deg)'
                    }}>
                      <span style={{fontSize: '1.8rem'}}>🏹</span>
                      <span style={{fontSize: '0.8rem', letterSpacing: '1px'}}>TAILS</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleFlipCoin}
                    className="btn-neon"
                    style={{padding: '12px 24px', fontSize: '0.9rem', minWidth: '160px', marginTop: 10}}
                    disabled={isFlipping}
                  >
                    {isFlipping ? 'SPINNING... 🔄' : 'FLIP COIN 🪙'}
                  </button>
                </div>
              )}

              {/* STEP 4: DECISION */}
              {tossWinner && !tossChoice && (
                <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                  <div style={{display: 'flex', justifyContent: 'center', gap: 8, fontSize: '0.95rem', margin: '8px 0'}}>
                    <span>Result: <strong>{coinResult}</strong></span>
                    <span>·</span>
                    <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>
                      🎉 {teams.find(t => t.id === tossWinner)?.name} won the toss!
                    </span>
                  </div>
                  <h4 style={{fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase'}}>
                    What does {teams.find(t => t.id === tossWinner)?.name} elect to do?
                  </h4>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
                    <button
                      type="button"
                      onClick={() => setTossChoice('Batting')}
                      className="btn-outlined"
                      style={{padding: '12px 6px', fontSize: '0.9rem', fontWeight: 'bold'}}
                    >
                      🏏 BATTING
                    </button>
                    <button
                      type="button"
                      onClick={() => setTossChoice('Bowling')}
                      className="btn-outlined"
                      style={{padding: '12px 6px', fontSize: '0.9rem', fontWeight: 'bold'}}
                    >
                      ⚾ BOWLING
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: TOSS SUMMARY / CONFIRMATION */}
              {tossWinner && tossChoice && (
                <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 12}}>
                  <div style={{
                    padding: 16,
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 10,
                    border: '1px dashed var(--primary)',
                    textAlign: 'left'
                  }}>
                    <h5 style={{color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: 6, letterSpacing: '0.5px'}}>
                      Toss Summary
                    </h5>
                    <div style={{fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: 4, color: 'var(--text-muted)'}}>
                      <div>Caller: <strong>{teams.find(t => t.id === tossCaller)?.name}</strong></div>
                      <div>Call Value: <strong>{tossCall}</strong></div>
                      <div>Coin Result: <strong>{coinResult}</strong></div>
                      <div style={{color: 'var(--text-primary)', marginTop: 6, fontWeight: '600', fontSize: '0.88rem'}}>
                        🪙 {teams.find(t => tossWinner === t.id)?.name} won the toss and elected to {tossChoice === 'Batting' ? 'bat' : 'bowl'} first.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLaunchCricketMatch}
                    className="btn-neon"
                    style={{width: '100%', padding: '12px 0'}}
                  >
                    LAUNCH MATCH 🚀
                  </button>
                </div>
              )}

              <div style={{marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14}}>
                <button
                  type="button"
                  onClick={() => setShowTossModal(false)}
                  className="btn-outlined"
                  style={{borderColor: 'var(--danger)', color: 'var(--danger)', width: '100%', padding: '8px 0', fontSize: '0.85rem'}}
                >
                  Cancel / Back to Match Launcher
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleScoreClick = (runs) => {
    logBall('normal', runs);
  };

  const handleExtraClick = (type) => {
    logBall(type, 0);
  };

  const handleWicket = () => {
    setShowWicketModal(true);
  };

  const calculateMatchAwards = (match) => {
    if (!match || match.isAbandoned || (match.sport && match.sport !== 'Cricket') || !match.batting || !match.bowling) {
      return { bestBatsman: null, bestBowler: null, manOfTheMatch: null };
    }
    const allBatting = [];
    const allBowling = [];
    
    if (match.firstInningsBatting) {
      allBatting.push(...match.firstInningsBatting);
    }
    if (match.firstInningsBowling) {
      allBowling.push(...match.firstInningsBowling);
    }
    
    allBatting.push(...match.batting);
    allBowling.push(...match.bowling);

    let bestBatsman = null;
    allBatting.forEach(b => {
      if (b.runs > 0) {
        const sr = b.balls > 0 ? (b.runs / b.balls) * 100 : 0;
        if (!bestBatsman || b.runs > bestBatsman.runs || (b.runs === bestBatsman.runs && sr > bestBatsman.sr)) {
          bestBatsman = { ...b, sr };
        }
      }
    });

    let bestBowler = null;
    allBowling.forEach(b => {
      const oversParts = (b.overs || '0.0').toString().split('.');
      const oversNum = parseInt(oversParts[0]) || 0;
      const ballsNum = parseInt(oversParts[1]) || 0;
      const totalBalls = oversNum * 6 + ballsNum;
      if (totalBalls > 0) {
        const oversVal = oversNum + (ballsNum / 6);
        const eco = b.runs / (oversVal || 1);
        if (!bestBowler || b.wickets > bestBowler.wickets || (b.wickets === bestBowler.wickets && eco < bestBowler.eco)) {
          bestBowler = { ...b, eco, totalBalls };
        }
      }
    });

    let manOfTheMatch = null;
    let highestScore = -1;
    const playerScores = {};

    allBatting.forEach(b => {
      const score = b.runs + (b.fours || 0) * 1 + (b.sixes || 0) * 2;
      playerScores[b.name] = {
        name: b.name,
        runs: b.runs,
        balls: b.balls,
        fours: b.fours || 0,
        sixes: b.sixes || 0,
        wickets: 0,
        runsConceded: 0,
        oversBowled: '0.0',
        score: score
      };
    });

    allBowling.forEach(b => {
      const score = (b.wickets * 25);
      if (playerScores[b.name]) {
        playerScores[b.name].wickets = b.wickets;
        playerScores[b.name].runsConceded = b.runs;
        playerScores[b.name].oversBowled = b.overs;
        playerScores[b.name].score += score;
      } else {
        playerScores[b.name] = {
          name: b.name,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          wickets: b.wickets,
          runsConceded: b.runs,
          oversBowled: b.overs,
          score: score
        };
      }
    });

    Object.values(playerScores).forEach(p => {
      if (p.score > highestScore) {
        highestScore = p.score;
        manOfTheMatch = p;
      }
    });

    return { bestBatsman, bestBowler, manOfTheMatch };
  };

  if (liveMatch && liveMatch.isCompleted) {
    const awards = calculateMatchAwards(liveMatch);
    return (
      <div style={{...styles.container, padding: 16}}>
        <div className="sporty-card glow-green" style={{textAlign: 'center', padding: 20, marginBottom: 20, borderColor: liveMatch.isAbandoned ? 'var(--danger)' : 'var(--primary)'}}>
          <span style={{fontSize: '3rem'}}>{liveMatch.isAbandoned ? '❌' : '🏆'}</span>
          <h2 style={{fontFamily: 'var(--font-condensed)', fontSize: '1.8rem', color: 'var(--text-primary)', marginTop: 8}}>
            {liveMatch.isAbandoned ? 'MATCH ABANDONED' : 'MATCH COMPLETED'}
          </h2>
          <h3 className="text-gold" style={{fontSize: '1.2rem', marginTop: 6}}>{liveMatch.result}</h3>
        </div>

        {/* AWARDS SECTION */}
        {(!liveMatch.sport || liveMatch.sport === 'Cricket') && !liveMatch.isAbandoned && (
          <>
            <h3 style={{fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 12, fontFamily: 'var(--font-condensed)', letterSpacing: '0.5px'}}>🌟 MATCH AWARDS</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20}}>
              {awards.manOfTheMatch && (
                <div className="sporty-card glow-gold" style={{padding: 14, display: 'flex', alignItems: 'center', gap: 12}}>
                  <span style={{fontSize: '2rem'}}>🏅</span>
                  <div style={{flex: 1}}>
                    <span style={{fontSize: '0.65rem', color: 'var(--secondary)', fontWeight: 'bold', display: 'block'}}>MAN OF THE MATCH</span>
                    <span style={{fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 'bold'}}>{awards.manOfTheMatch.name}</span>
                    <span style={{fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: 2}}>
                      {awards.manOfTheMatch.runs > 0 ? `${awards.manOfTheMatch.runs} Runs (${awards.manOfTheMatch.balls}b)` : ''}
                      {awards.manOfTheMatch.runs > 0 && awards.manOfTheMatch.wickets > 0 ? ' & ' : ''}
                      {awards.manOfTheMatch.wickets > 0 ? `${awards.manOfTheMatch.wickets} Wkts (${awards.manOfTheMatch.oversBowled} Ov)` : ''}
                    </span>
                  </div>
                </div>
              )}

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
                {awards.bestBatsman && (
                  <div className="sporty-card" style={{padding: 12, display: 'flex', flexDirection: 'column', gap: 4}}>
                    <span style={{fontSize: '1.4rem'}}>🏏</span>
                    <span style={{fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 'bold'}}>BEST BATSMAN</span>
                    <span style={{fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{awards.bestBatsman.name}</span>
                    <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{awards.bestBatsman.runs} Runs ({awards.bestBatsman.balls}b)</span>
                    <span style={{fontSize: '0.7rem', color: 'var(--primary)'}}>SR: {awards.bestBatsman.sr.toFixed(1)}</span>
                  </div>
                )}

                {awards.bestBowler && (
                  <div className="sporty-card" style={{padding: 12, display: 'flex', flexDirection: 'column', gap: 4}}>
                    <span style={{fontSize: '1.4rem'}}>🎯</span>
                    <span style={{fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 'bold'}}>BEST BOWLER</span>
                    <span style={{fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{awards.bestBowler.name}</span>
                    <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{awards.bestBowler.wickets} Wickets</span>
                    <span style={{fontSize: '0.7rem', color: 'var(--primary)'}}>Eco: {awards.bestBowler.eco.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* SUMMARY CARD */}
        <div className="sporty-card" style={{padding: 16, marginBottom: 20}}>
          <h4 style={{fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 10, borderBottom: '1px solid var(--border-light)', paddingBottom: 6}}>MATCH DETAILS</h4>
          {(!liveMatch.sport || liveMatch.sport === 'Cricket') ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: 'var(--text-muted)'}}>
              <div className="flex-between">
                <span>1st Innings ({liveMatch.team1}):</span>
                <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{liveMatch.firstInningsScore}/{liveMatch.firstInningsWickets} ({Math.floor(liveMatch.firstInningsBalls / 6)}.{liveMatch.firstInningsBalls % 6} Ov)</span>
              </div>
              <div className="flex-between">
                <span>2nd Innings ({liveMatch.team2}):</span>
                <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{liveMatch.runs}/{liveMatch.wickets} ({Math.floor(liveMatch.balls / 6)}.{liveMatch.balls % 6} Ov)</span>
              </div>
            </div>
          ) : liveMatch.sport === 'Football' ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: 'var(--text-muted)'}}>
              <div className="flex-between">
                <span>Final Score:</span>
                <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{liveMatch.goals1} - {liveMatch.goals2}</span>
              </div>
              <div className="flex-between">
                <span>Total Fouls:</span>
                <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{liveMatch.fouls1} - {liveMatch.fouls2}</span>
              </div>
              <div className="flex-between">
                <span>Yellow / Red Cards:</span>
                <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{liveMatch.yellowCards1}/{liveMatch.redCards1} - {liveMatch.yellowCards2}/{liveMatch.redCards2}</span>
              </div>
            </div>
          ) : liveMatch.sport === 'Volleyball' ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: 'var(--text-muted)'}}>
              <div className="flex-between">
                <span>Sets Result:</span>
                <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{liveMatch.sets1} - {liveMatch.sets2}</span>
              </div>
              {liveMatch.setScores.map((s, idx) => (
                <div key={idx} className="flex-between" style={{fontSize: '0.78rem'}}>
                  <span>Set {s.set} Winner: {s.winner}</span>
                  <span style={{fontWeight: 'bold'}}>{s.score1} - {s.score2}</span>
                </div>
              ))}
            </div>
          ) : liveMatch.sport === 'Pickleball' ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: 'var(--text-muted)'}}>
              <div className="flex-between">
                <span>Sets Result:</span>
                <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{liveMatch.sets1} - {liveMatch.sets2}</span>
              </div>
              {liveMatch.setScores.map((s, idx) => (
                <div key={idx} className="flex-between" style={{fontSize: '0.78rem'}}>
                  <span>Set {s.set} Winner: {s.winner}</span>
                  <span style={{fontWeight: 'bold'}}>{s.score1} - {s.score2}</span>
                </div>
              ))}
            </div>
          ) : liveMatch.sport === 'Golf' ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: 'var(--text-muted)'}}>
              <div className="flex-between">
                <span>Total Strokes ({liveMatch.team1}):</span>
                <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{liveMatch.strokes1.reduce((a, b) => a + b, 0)} (Par: {liveMatch.parValues.reduce((a, b) => a + b, 0)})</span>
              </div>
              <div className="flex-between">
                <span>Total Strokes ({liveMatch.team2}):</span>
                <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{liveMatch.strokes2.reduce((a, b) => a + b, 0)} (Par: {liveMatch.parValues.reduce((a, b) => a + b, 0)})</span>
              </div>
            </div>
          ) : (liveMatch.sport === 'Hockey' || liveMatch.sport === 'Ice Hockey') ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: 'var(--text-muted)'}}>
              <div className="flex-between">
                <span>Final Score:</span>
                <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{liveMatch.goals1} - {liveMatch.goals2}</span>
              </div>
              <div className="flex-between">
                <span>Total Shots:</span>
                <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{liveMatch.shots1} - {liveMatch.shots2}</span>
              </div>
              <div className="flex-between">
                <span>Penalties:</span>
                <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{liveMatch.penalties1} - {liveMatch.penalties2}</span>
              </div>
            </div>
          ) : liveMatch.sport === 'Skating' ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: 'var(--text-muted)'}}>
              <div className="flex-between">
                <span>Technical / Artistic Score ({liveMatch.team1}):</span>
                <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{liveMatch.technicalScore1} / {liveMatch.artisticScore1} (Total: {liveMatch.totalScore1})</span>
              </div>
              <div className="flex-between">
                <span>Technical / Artistic Score ({liveMatch.team2}):</span>
                <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{liveMatch.technicalScore2} / {liveMatch.artisticScore2} (Total: {liveMatch.totalScore2})</span>
              </div>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem', color: 'var(--text-muted)'}}>
              <div className="flex-between">
                <span>Final Score:</span>
                <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{liveMatch.points1} - {liveMatch.points2}</span>
              </div>
              <div className="flex-between">
                <span>Team Fouls:</span>
                <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{liveMatch.fouls1} - {liveMatch.fouls2}</span>
              </div>
              <div className="flex-between">
                <span>Periods:</span>
                <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{liveMatch.period} Periods Played</span>
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={async () => {
            const runsValue = 
              (!liveMatch.sport || liveMatch.sport === 'Cricket') ? liveMatch.runs : 
              (liveMatch.sport === 'Football' ? liveMatch.goals1 : 
              (liveMatch.sport === 'Volleyball' ? liveMatch.sets1 : 
              (liveMatch.sport === 'Basketball' ? liveMatch.points1 :
              (liveMatch.sport === 'Pickleball' ? liveMatch.sets1 :
              (liveMatch.sport === 'Golf' ? liveMatch.strokes1.reduce((a, b) => a + b, 0) :
              (liveMatch.sport === 'Hockey' || liveMatch.sport === 'Ice Hockey' ? liveMatch.goals1 :
              (liveMatch.sport === 'Skating' ? Math.round(liveMatch.totalScore1) : liveMatch.points1)))))));

            const wicketsValue = 
              (!liveMatch.sport || liveMatch.sport === 'Cricket') ? liveMatch.wickets : 
              (liveMatch.sport === 'Football' ? liveMatch.goals2 : 
              (liveMatch.sport === 'Volleyball' ? liveMatch.sets2 : 
              (liveMatch.sport === 'Basketball' ? liveMatch.points2 :
              (liveMatch.sport === 'Pickleball' ? liveMatch.sets2 :
              (liveMatch.sport === 'Golf' ? liveMatch.strokes2.reduce((a, b) => a + b, 0) :
              (liveMatch.sport === 'Hockey' || liveMatch.sport === 'Ice Hockey' ? liveMatch.goals2 :
              (liveMatch.sport === 'Skating' ? Math.round(liveMatch.totalScore2) : liveMatch.points2)))))));

            saveCompletedMatch({
              team1: liveMatch.team1,
              team2: liveMatch.team2,
              team1Id: liveMatch.team1Id,
              team2Id: liveMatch.team2Id,
              runs: runsValue,
              wickets: wicketsValue,
              balls: (!liveMatch.sport || liveMatch.sport === 'Cricket') ? liveMatch.balls : 0,
              crr: (!liveMatch.sport || liveMatch.sport === 'Cricket') ? liveMatch.crr : '0.00',
              sport: liveMatch.sport || 'Cricket',
              venue: liveMatch.venue || 'Local Arena',
              scorerId: liveMatch.scorerId || playerId,
              scorerName: liveMatch.scorerName || userName,
              result: liveMatch.result || 'Match Completed',
              isAbandoned: liveMatch.isAbandoned || false,
              matchState: liveMatch,
              tossText: liveMatch.isAbandoned ? (liveMatch.toss ? `${liveMatch.toss.text} · Match Abandoned` : 'Match Abandoned') : (liveMatch.toss ? liveMatch.toss.text : null)
            });
            authFetch(`http://localhost:3001/api/matches/live/${liveMatch.id}`, { method: 'DELETE' }).catch(e => {});
            setLiveMatch(null);
            await showAlert('Saved', 'Match completed and saved!');
            setCurrentScreen('scorer_panel');
          }} 
          className="btn-neon" 
          style={{width: '100%', padding: '14px 0'}}
        >
          CONFIRM & CLOSE MATCH ⚡
        </button>
      </div>
    );
  }

  if (liveMatch && liveMatch.sport === 'Football') {
    return (
      <div style={{...styles.container, padding: 16}}>
        {/* Top Mini Score */}
        <div className="sporty-card glow-green" style={{padding: 16, marginBottom: 16}}>
          <div className="flex-between" style={{alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <span className="live-dot" /> <span style={{fontSize: '0.85rem', color: "var(--text-primary)", fontWeight: 'bold'}}>FOOTBALL LIVE MATCH</span>
            </div>
            <button
              onClick={() => {
                setSelectedLiveMatch(liveMatch);
                setCurrentScreen('live_scorecard');
              }}
              className="btn-neon"
              style={{padding: '4px 8px', fontSize: '0.68rem', width: 'auto'}}
            >
              📊 Scorecard
            </button>
          </div>
          <div style={{margin: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team1}</h3>
            </div>
            <div style={{textAlign: 'center', padding: '0 20px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)'}}>{liveMatch.goals1} - {liveMatch.goals2}</h2>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team2}</h3>
            </div>
          </div>
        </div>

        {/* Scoring Actions */}
        <div style={styles.scorerDashboard}>
          <div style={{marginBottom: 10, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>Goals</div>
          <div style={styles.scorerGrid}>
            <button 
              onClick={() => {
                setShowGoalTypeModal({ show: true, teamIndex: 1 });
              }} 
              className="btn-neon" 
              style={{gridColumn: "span 2", padding: '14px 0'}}
            >
              ⚽ GOAL {liveMatch.team1}
            </button>
            <button 
              onClick={() => {
                setShowGoalTypeModal({ show: true, teamIndex: 2 });
              }} 
              className="btn-neon" 
              style={{gridColumn: "span 2", padding: '14px 0', backgroundColor: 'var(--secondary)'}}
            >
              ⚽ GOAL {liveMatch.team2}
            </button>
          </div>

          <div style={{margin: '16px 0 10px 0', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>Yellow / Red Cards</div>
          <div style={styles.scorerGrid}>
            <button onClick={() => updateFootballStats(1, 'yellow', 1)} className="score-btn-box" style={{fontSize: '0.9rem', padding: '12px 0'}}>🟨 Card {liveMatch.team1} (+1)</button>
            <button onClick={() => updateFootballStats(1, 'red', 1)} className="score-btn-box" style={{fontSize: '0.9rem', padding: '12px 0', borderColor: 'var(--danger)'}}>🟥 Card {liveMatch.team1} (+1)</button>
            <button onClick={() => updateFootballStats(2, 'yellow', 1)} className="score-btn-box" style={{fontSize: '0.9rem', padding: '12px 0'}}>🟨 Card {liveMatch.team2} (+1)</button>
            <button onClick={() => updateFootballStats(2, 'red', 1)} className="score-btn-box" style={{fontSize: '0.9rem', padding: '12px 0', borderColor: 'var(--danger)'}}>🟥 Card {liveMatch.team2} (+1)</button>
          </div>

          <div style={{margin: '16px 0 10px 0', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>Fouls & Stats</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20}}>
            <div className="sporty-card" style={{padding: 12, textAlign: 'center'}}>
              <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6}}>FOULS ({liveMatch.team1})</span>
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10}}>
                <button onClick={() => updateFootballStats(1, 'foul', -1)} className="btn-outlined" style={{width: 32, height: 32, padding: 0}}>-</button>
                <strong style={{fontSize: '1.2rem', color: 'var(--text-primary)'}}>{liveMatch.fouls1}</strong>
                <button onClick={() => updateFootballStats(1, 'foul', 1)} className="btn-outlined" style={{width: 32, height: 32, padding: 0}}>+</button>
              </div>
            </div>
            <div className="sporty-card" style={{padding: 12, textAlign: 'center'}}>
              <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6}}>FOULS ({liveMatch.team2})</span>
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10}}>
                <button onClick={() => updateFootballStats(2, 'foul', -1)} className="btn-outlined" style={{width: 32, height: 32, padding: 0}}>-</button>
                <strong style={{fontSize: '1.2rem', color: 'var(--text-primary)'}}>{liveMatch.fouls2}</strong>
                <button onClick={() => updateFootballStats(2, 'foul', 1)} className="btn-outlined" style={{width: 32, height: 32, padding: 0}}>+</button>
              </div>
            </div>
          </div>

          {/* Timeline Events */}
          <div className="sporty-card" style={{marginBottom: 20}}>
            <h4 style={{fontSize: '0.85rem', color: 'var(--primary)', marginBottom: 8, textTransform: 'uppercase'}}>Timeline Events</h4>
            <div style={{maxHeight: 120, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6}}>
              {liveMatch.events.slice().reverse().map((ev, index) => (
                <div key={index} className="flex-between" style={{fontSize: '0.8rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-light)', paddingBottom: 4}}>
                  <span>{ev.time} - {ev.team} {ev.type}</span>
                  <span style={{fontWeight: 'bold', color: 'var(--text-muted)'}}>{ev.detail}</span>
                </div>
              ))}
              {liveMatch.events.length === 0 && (
                <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center'}}>No events logged yet.</p>
              )}
            </div>
          </div>

          <div style={{display: 'flex', gap: 10, marginTop: 10}}>
            <button onClick={undoLastBall} className="btn-outlined" style={{borderColor: 'var(--danger)', color: 'var(--danger)', flex: 1}}>
              UNDO ACTION
            </button>
            <button 
              onClick={async () => {
                const confirm = await showConfirm('End Match', 'Are you sure you want to end this match?');
                if (confirm) {
                  setLiveMatch(prev => {
                    const updated = { ...prev };
                    updated.isCompleted = true;
                    if (updated.goals1 > updated.goals2) {
                      updated.result = `${updated.team1} won ${updated.goals1} - ${updated.goals2}!`;
                    } else if (updated.goals2 > updated.goals1) {
                      updated.result = `${updated.team2} won ${updated.goals2} - ${updated.goals1}!`;
                    } else {
                      updated.result = `Match Draw ${updated.goals1} - ${updated.goals2}!`;
                    }
                    return updated;
                  });
                }
              }} 
              className="btn-neon" 
              style={{flex: 1}}
            >
              END MATCH
            </button>
          </div>
          <button
            onClick={async () => {
              const confirm = await showConfirm('Abandon Match', 'Are you sure you want to abandon this match? This will end scoring immediately.');
              if (confirm) {
                setLiveMatch(prev => ({ ...prev, isCompleted: true, isAbandoned: true, result: 'Match Abandoned' }));
              }
            }}
            className="btn-outlined"
            style={{width: '100%', marginTop: 10, borderColor: 'var(--danger)', color: 'var(--danger)', fontWeight: 'bold'}}
          >
            ⚠ ABANDON MATCH
          </button>
        </div>

        {/* Goal Type Modal */}
        {showGoalTypeModal.show && (
          <div style={styles.modalOverlay}>
            <div className="sporty-card glow-green" style={{width: '90%', maxWidth: 400, padding: 24, textAlign: 'center', backgroundColor: 'var(--bg-surface-solid)', border: '2px solid var(--primary)'}}>
              <h3 style={{fontFamily: 'var(--font-condensed)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 16}}>SELECT GOAL TYPE</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20}}>
                {['Normal Goal', 'Penalty', 'Own Goal'].map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      updateFootballScore(showGoalTypeModal.teamIndex, type);
                      setShowGoalTypeModal({ show: false, teamIndex: null });
                    }}
                    className="btn-outlined"
                    style={{padding: '12px', fontSize: '0.9rem', fontWeight: 'bold'}}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowGoalTypeModal({ show: false, teamIndex: null })} className="btn-outlined" style={{borderColor: 'var(--danger)', color: 'var(--danger)', width: '100%'}}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (liveMatch && liveMatch.sport === 'Volleyball') {
    return (
      <div style={{...styles.container, padding: 16}}>
        {/* Top Mini Score */}
        <div className="sporty-card glow-green" style={{padding: 16, marginBottom: 16}}>
          <div className="flex-between" style={{alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <span className="live-dot" /> <span style={{fontSize: '0.85rem', color: "var(--text-primary)", fontWeight: 'bold'}}>VOLLEYBALL SCORING</span>
            </div>
            <button
              onClick={() => {
                setSelectedLiveMatch(liveMatch);
                setCurrentScreen('live_scorecard');
              }}
              className="btn-neon"
              style={{padding: '4px 8px', fontSize: '0.68rem', width: 'auto'}}
            >
              📊 Scorecard
            </button>
          </div>
          <div style={{margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.2rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team1}</h3>
              <span className="text-gold" style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Sets: {liveMatch.sets1}</span>
            </div>
            <div style={{textAlign: 'center', padding: '0 16px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)'}}>{liveMatch.points1} - {liveMatch.points2}</h2>
              <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Current Set Points</span>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.2rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team2}</h3>
              <span className="text-gold" style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Sets: {liveMatch.sets2}</span>
            </div>
          </div>
        </div>

        {/* Set History */}
        {liveMatch.setScores.length > 0 && (
          <div className="sporty-card" style={{padding: 10, marginBottom: 16}}>
            <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4, textTransform: 'uppercase'}}>Set Results</span>
            <div style={{display: 'flex', gap: 8, overflowX: 'auto'}}>
              {liveMatch.setScores.map((s, idx) => (
                <div key={idx} style={{padding: '4px 8px', backgroundColor: 'var(--bg-secondary)', borderRadius: 6, fontSize: '0.75rem', whiteSpace: 'nowrap'}}>
                  Set {s.set}: <strong>{s.score1} - {s.score2}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scoring Actions */}
        <div style={styles.scorerDashboard}>
          <div style={{marginBottom: 10, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>Points Control</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16}}>
            <button 
              onClick={() => updateVolleyballScore(1, 1)} 
              className="btn-neon" 
              style={{padding: '16px 0', fontSize: '1.2rem'}}
            >
              +1 POINT {liveMatch.team1}
            </button>
            <button 
              onClick={() => updateVolleyballScore(2, 1)} 
              className="btn-neon" 
              style={{padding: '16px 0', fontSize: '1.2rem', backgroundColor: 'var(--secondary)'}}
            >
              +1 POINT {liveMatch.team2}
            </button>
            <button onClick={() => updateVolleyballScore(1, -1)} className="btn-outlined" style={{padding: '10px 0'}}>-1 Point Team A</button>
            <button onClick={() => updateVolleyballScore(2, -1)} className="btn-outlined" style={{padding: '10px 0'}}>-1 Point Team B</button>
          </div>

          <div style={{display: 'flex', gap: 10, marginTop: 20}}>
            <button onClick={undoLastBall} className="btn-outlined" style={{borderColor: 'var(--danger)', color: 'var(--danger)', flex: 1}}>
              UNDO POINT
            </button>
            <button 
              onClick={async () => {
                const confirm = await showConfirm('End Match', 'Are you sure you want to end this Volleyball match?');
                if (confirm) {
                  setLiveMatch(prev => {
                    const updated = { ...prev };
                    updated.isCompleted = true;
                    if (updated.sets1 > updated.sets2) {
                      updated.result = `${updated.team1} won the Volleyball match ${updated.sets1} - ${updated.sets2}!`;
                    } else if (updated.sets2 > updated.sets1) {
                      updated.result = `${updated.team2} won the Volleyball match ${updated.sets2} - ${updated.sets1}!`;
                    } else {
                      updated.result = `Match Finished: ${updated.sets1} - ${updated.sets2}`;
                    }
                    return updated;
                  });
                }
              }} 
              className="btn-neon" 
              style={{flex: 1}}
            >
              END MATCH
            </button>
          </div>
          <button
            onClick={async () => {
              const confirm = await showConfirm('Abandon Match', 'Are you sure you want to abandon this match? This will end scoring immediately.');
              if (confirm) {
                setLiveMatch(prev => ({ ...prev, isCompleted: true, isAbandoned: true, result: 'Match Abandoned' }));
              }
            }}
            className="btn-outlined"
            style={{width: '100%', marginTop: 10, borderColor: 'var(--danger)', color: 'var(--danger)', fontWeight: 'bold'}}
          >
            ⚠ ABANDON MATCH
          </button>
        </div>
      </div>
    );
  }

  if (liveMatch && liveMatch.sport === 'Basketball') {
    return (
      <div style={{...styles.container, padding: 16}}>
        {/* Top Mini Score */}
        <div className="sporty-card glow-green" style={{padding: 16, marginBottom: 16}}>
          <div className="flex-between" style={{alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <span className="live-dot" /> <span style={{fontSize: '0.85rem', color: "var(--text-primary)", fontWeight: 'bold'}}>BASKETBALL LIVE</span>
            </div>
            <button
              onClick={() => {
                setSelectedLiveMatch(liveMatch);
                setCurrentScreen('live_scorecard');
              }}
              className="btn-neon"
              style={{padding: '4px 8px', fontSize: '0.68rem', width: 'auto'}}
            >
              📊 Scorecard
            </button>
          </div>
          <div style={{margin: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team1}</h3>
            </div>
            <div style={{textAlign: 'center', padding: '0 20px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)'}}>{liveMatch.points1} - {liveMatch.points2}</h2>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team2}</h3>
            </div>
          </div>
        </div>

        {/* Scoring Actions */}
        <div style={styles.scorerDashboard}>
          <div style={{marginBottom: 10, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>{liveMatch.team1} Points</div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14}}>
            <button onClick={() => updateBasketballScore(1, 1)} className="score-btn-box" style={{padding: '10px 0', fontSize: '1rem'}}>+1 FT</button>
            <button onClick={() => updateBasketballScore(1, 2)} className="score-btn-box" style={{padding: '10px 0', fontSize: '1rem'}}>+2 PTS</button>
            <button onClick={() => updateBasketballScore(1, 3)} className="score-btn-box" style={{padding: '10px 0', fontSize: '1rem'}}>+3 PTS</button>
          </div>

          <div style={{marginBottom: 10, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>{liveMatch.team2} Points</div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14}}>
            <button onClick={() => updateBasketballScore(2, 1)} className="score-btn-box" style={{padding: '10px 0', fontSize: '1rem'}}>+1 FT</button>
            <button onClick={() => updateBasketballScore(2, 2)} className="score-btn-box" style={{padding: '10px 0', fontSize: '1rem'}}>+2 PTS</button>
            <button onClick={() => updateBasketballScore(2, 3)} className="score-btn-box" style={{padding: '10px 0', fontSize: '1rem'}}>+3 PTS</button>
          </div>

          {/* Period Control & stats */}
          <div style={{margin: '16px 0 10px 0', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>Match Period & Details</div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20}}>
            <div className="sporty-card" style={{padding: 8, textAlign: 'center'}}>
              <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4}}>PERIOD</span>
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6}}>
                <button onClick={() => updateBasketballStats(0, 'period', -1)} className="btn-outlined" style={{width: 24, height: 24, padding: 0}}>-</button>
                <strong style={{fontSize: '1rem'}}>{liveMatch.period}</strong>
                <button onClick={() => updateBasketballStats(0, 'period', 1)} className="btn-outlined" style={{width: 24, height: 24, padding: 0}}>+</button>
              </div>
            </div>
            <div className="sporty-card" style={{padding: 8, textAlign: 'center'}}>
              <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4}}>FOULS (A)</span>
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6}}>
                <button onClick={() => updateBasketballStats(1, 'foul', -1)} className="btn-outlined" style={{width: 24, height: 24, padding: 0}}>-</button>
                <strong style={{fontSize: '1rem'}}>{liveMatch.fouls1}</strong>
                <button onClick={() => updateBasketballStats(1, 'foul', 1)} className="btn-outlined" style={{width: 24, height: 24, padding: 0}}>+</button>
              </div>
            </div>
            <div className="sporty-card" style={{padding: 8, textAlign: 'center'}}>
              <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4}}>FOULS (B)</span>
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6}}>
                <button onClick={() => updateBasketballStats(2, 'foul', -1)} className="btn-outlined" style={{width: 24, height: 24, padding: 0}}>-</button>
                <strong style={{fontSize: '1rem'}}>{liveMatch.fouls2}</strong>
                <button onClick={() => updateBasketballStats(2, 'foul', 1)} className="btn-outlined" style={{width: 24, height: 24, padding: 0}}>+</button>
              </div>
            </div>
          </div>

          <div style={{display: 'flex', gap: 10, marginTop: 10}}>
            <button onClick={undoLastBall} className="btn-outlined" style={{borderColor: 'var(--danger)', color: 'var(--danger)', flex: 1}}>
              UNDO ACTION
            </button>
            <button 
              onClick={async () => {
                const confirm = await showConfirm('End Match', 'Are you sure you want to end this Basketball match?');
                if (confirm) {
                  setLiveMatch(prev => {
                    const updated = { ...prev };
                    updated.isCompleted = true;
                    if (updated.points1 > updated.points2) {
                      updated.result = `${updated.team1} won ${updated.points1} - ${updated.points2}!`;
                    } else if (updated.points2 > updated.points1) {
                      updated.result = `${updated.team2} won ${updated.points2} - ${updated.points1}!`;
                    } else {
                      updated.result = `Match Tied ${updated.points1} - ${updated.points2}!`;
                    }
                    return updated;
                  });
                }
              }} 
              className="btn-neon" 
              style={{flex: 1}}
            >
              END MATCH
            </button>
          </div>
          <button
            onClick={async () => {
              const confirm = await showConfirm('Abandon Match', 'Are you sure you want to abandon this match? This will end scoring immediately.');
              if (confirm) {
                setLiveMatch(prev => ({ ...prev, isCompleted: true, isAbandoned: true, result: 'Match Abandoned' }));
              }
            }}
            className="btn-outlined"
            style={{width: '100%', marginTop: 10, borderColor: 'var(--danger)', color: 'var(--danger)', fontWeight: 'bold'}}
          >
            ⚠ ABANDON MATCH
          </button>
        </div>
      </div>
    );
  }

  if (liveMatch && liveMatch.sport === 'Pickleball') {
    return (
      <div style={{...styles.container, padding: 16}}>
        {/* Top Mini Score */}
        <div className="sporty-card glow-green" style={{padding: 16, marginBottom: 16}}>
          <div className="flex-between" style={{alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <span className="live-dot" /> <span style={{fontSize: '0.85rem', color: "var(--text-primary)", fontWeight: 'bold'}}>🏓 PICKLEBALL LIVE</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <span style={{fontSize: '0.72rem', color: 'var(--text-muted)'}}>Set {liveMatch.currentSet} (First to {liveMatch.targetPoints || 11})</span>
              <button
                onClick={() => {
                  setSelectedLiveMatch(liveMatch);
                  setCurrentScreen('live_scorecard');
                }}
                className="btn-neon"
                style={{padding: '4px 8px', fontSize: '0.68rem', width: 'auto'}}
              >
                📊 Scorecard
              </button>
            </div>
          </div>
          <div style={{margin: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team1}</h3>
              <div style={{fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 'bold'}}>Sets: {liveMatch.sets1}</div>
            </div>
            <div style={{textAlign: 'center', padding: '0 20px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)'}}>{liveMatch.points1} - {liveMatch.points2}</h2>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team2}</h3>
              <div style={{fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 'bold'}}>Sets: {liveMatch.sets2}</div>
            </div>
          </div>
          {liveMatch.setScores && liveMatch.setScores.length > 0 && (
            <div style={{textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8}}>
              Set Scores: {liveMatch.setScores.map((s, i) => `[S${s.set}: ${s.score1}-${s.score2}]`).join(' ')}
            </div>
          )}
        </div>

        <div style={styles.scorerDashboard}>
          <div style={{marginBottom: 10, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>Point Scoring</div>
          <div style={styles.scorerGrid}>
            <button 
              onClick={() => updatePickleballScore(1, 1)} 
              className="btn-neon" 
              style={{gridColumn: "span 2", padding: '14px 0'}}
            >
              ➕ POINT {liveMatch.team1}
            </button>
            <button 
              onClick={() => updatePickleballScore(2, 1)} 
              className="btn-neon" 
              style={{gridColumn: "span 2", padding: '14px 0', backgroundColor: 'var(--secondary)'}}
            >
              ➕ POINT {liveMatch.team2}
            </button>
            <button 
              onClick={() => updatePickleballScore(1, -1)} 
              className="btn-outlined" 
              style={{gridColumn: "span 2", padding: '10px 0'}}
            >
              ➖ Remove Point
            </button>
            <button 
              onClick={() => updatePickleballScore(2, -1)} 
              className="btn-outlined" 
              style={{gridColumn: "span 2", padding: '10px 0'}}
            >
              ➖ Remove Point
            </button>
          </div>

          <div style={{display: 'flex', gap: 10, marginTop: 30}}>
            <button onClick={undoLastBall} className="btn-outlined" style={{borderColor: 'var(--danger)', color: 'var(--danger)', flex: 1}}>
              UNDO ACTION
            </button>
            <button 
              onClick={async () => {
                const confirm = await showConfirm('End Match', 'Are you sure you want to end this match?');
                if (confirm) {
                  setLiveMatch(prev => {
                    const updated = { ...prev };
                    updated.isCompleted = true;
                    if (updated.sets1 > updated.sets2) {
                      updated.result = `${updated.team1} won the Pickleball match ${updated.sets1} - ${updated.sets2}!`;
                    } else if (updated.sets2 > updated.sets1) {
                      updated.result = `${updated.team2} won the Pickleball match ${updated.sets2} - ${updated.sets1}!`;
                    } else {
                      updated.result = `Match ended in a draw!`;
                    }
                    return updated;
                  });
                }
              }} 
              className="btn-neon" 
              style={{flex: 1}}
            >
              END MATCH
            </button>
          </div>
          <button
            onClick={async () => {
              const confirm = await showConfirm('Abandon Match', 'Are you sure you want to abandon this match? This will end scoring immediately.');
              if (confirm) {
                setLiveMatch(prev => ({ ...prev, isCompleted: true, isAbandoned: true, result: 'Match Abandoned' }));
              }
            }}
            className="btn-outlined"
            style={{width: '100%', marginTop: 10, borderColor: 'var(--danger)', color: 'var(--danger)', fontWeight: 'bold'}}
          >
            ⚠ ABANDON MATCH
          </button>
        </div>
      </div>
    );
  }

  if (liveMatch && liveMatch.sport === 'Golf') {
    const totalStrokes1 = liveMatch.strokes1.reduce((a, b) => a + b, 0);
    const totalStrokes2 = liveMatch.strokes2.reduce((a, b) => a + b, 0);
    const totalPar = liveMatch.parValues.reduce((a, b) => a + b, 0);
    const scoreDiff1 = totalStrokes1 - totalPar;
    const scoreDiff2 = totalStrokes2 - totalPar;

    const renderScoreDiff = (diff) => {
      if (diff === 0) return 'E (Even)';
      return diff > 0 ? `+${diff}` : `${diff}`;
    };

    return (
      <div style={{...styles.container, padding: 16}}>
        {/* Top Mini Score */}
        <div className="sporty-card glow-green" style={{padding: 16, marginBottom: 16}}>
          <div className="flex-between" style={{alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <span className="live-dot" /> <span style={{fontSize: '0.85rem', color: "var(--text-primary)", fontWeight: 'bold'}}>⛳ GOLF LIVE</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <span style={{fontSize: '0.72rem', color: 'var(--text-muted)'}}>Hole {liveMatch.currentHole} of {liveMatch.totalHoles} (Par {liveMatch.parValues[liveMatch.currentHole - 1]})</span>
              <button
                onClick={() => {
                  setSelectedLiveMatch(liveMatch);
                  setCurrentScreen('live_scorecard');
                }}
                className="btn-neon"
                style={{padding: '4px 8px', fontSize: '0.68rem', width: 'auto'}}
              >
                📊 Scorecard
              </button>
            </div>
          </div>
          
          <div style={{margin: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team1}</h3>
              <div style={{fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: 'bold'}}>Strokes: {totalStrokes1} ({renderScoreDiff(scoreDiff1)})</div>
            </div>
            <div style={{textAlign: 'center', padding: '0 10px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>
              VS
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team2}</h3>
              <div style={{fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: 'bold'}}>Strokes: {totalStrokes2} ({renderScoreDiff(scoreDiff2)})</div>
            </div>
          </div>

          {/* Hole Selector */}
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 12}}>
            <button onClick={() => changeGolfHole(-1)} className="btn-outlined" style={{padding: '4px 12px', fontSize: '0.75rem'}} disabled={liveMatch.currentHole === 1}>◀ Prev Hole</button>
            <strong style={{color: 'var(--text-primary)', fontSize: '0.95rem'}}>Hole {liveMatch.currentHole}</strong>
            <button onClick={() => changeGolfHole(1)} className="btn-outlined" style={{padding: '4px 12px', fontSize: '0.75rem'}} disabled={liveMatch.currentHole === liveMatch.totalHoles}>Next Hole ▶</button>
          </div>
        </div>

        <div style={styles.scorerDashboard}>
          <div style={{marginBottom: 10, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>Adjust Strokes (Hole {liveMatch.currentHole})</div>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20}}>
            <div className="sporty-card" style={{padding: 12, textAlign: 'center'}}>
              <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6}}>{liveMatch.team1}</span>
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10}}>
                <button onClick={() => updateGolfStrokes(1, -1)} className="btn-outlined" style={{width: 36, height: 36, padding: 0, fontSize: '1.2rem'}}>-</button>
                <strong style={{fontSize: '1.5rem', color: 'var(--text-primary)'}}>{liveMatch.strokes1[liveMatch.currentHole - 1]}</strong>
                <button onClick={() => updateGolfStrokes(1, 1)} className="btn-outlined" style={{width: 36, height: 36, padding: 0, fontSize: '1.2rem'}}>+</button>
              </div>
            </div>

            <div className="sporty-card" style={{padding: 12, textAlign: 'center'}}>
              <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6}}>{liveMatch.team2}</span>
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10}}>
                <button onClick={() => updateGolfStrokes(2, -1)} className="btn-outlined" style={{width: 36, height: 36, padding: 0, fontSize: '1.2rem'}}>-</button>
                <strong style={{fontSize: '1.5rem', color: 'var(--text-primary)'}}>{liveMatch.strokes2[liveMatch.currentHole - 1]}</strong>
                <button onClick={() => updateGolfStrokes(2, 1)} className="btn-outlined" style={{width: 36, height: 36, padding: 0, fontSize: '1.2rem'}}>+</button>
              </div>
            </div>
          </div>

          {/* Full Scorecard View */}
          <div className="sporty-card" style={{marginBottom: 20, overflowX: 'auto'}}>
            <h4 style={{fontSize: '0.85rem', color: 'var(--primary)', marginBottom: 8, textTransform: 'uppercase'}}>Scorecard Preview</h4>
            <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', color: 'var(--text-primary)'}}>
              <thead>
                <tr style={{borderBottom: '1px solid var(--border-light)'}}>
                  <th style={{padding: 4, textAlign: 'left'}}>Hole</th>
                  {liveMatch.strokes1.map((_, idx) => (
                    <th key={idx} style={{padding: 4, textAlign: 'center', backgroundColor: liveMatch.currentHole === idx + 1 ? 'rgba(255,255,255,0.06)' : 'transparent'}}>{idx + 1}</th>
                  ))}
                  <th style={{padding: 4, textAlign: 'center', fontWeight: 'bold'}}>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{borderBottom: '1px solid var(--border-light)'}}>
                  <td style={{padding: 4, fontWeight: '500'}}>Par</td>
                  {liveMatch.parValues.map((p, idx) => (
                    <td key={idx} style={{padding: 4, textAlign: 'center', backgroundColor: liveMatch.currentHole === idx + 1 ? 'rgba(255,255,255,0.06)' : 'transparent'}}>{p}</td>
                  ))}
                  <td style={{padding: 4, textAlign: 'center', fontWeight: 'bold'}}>{totalPar}</td>
                </tr>
                <tr style={{borderBottom: '1px solid var(--border-light)'}}>
                  <td style={{padding: 4, fontWeight: '500', color: 'var(--primary)'}}>{liveMatch.team1}</td>
                  {liveMatch.strokes1.map((s, idx) => (
                    <td key={idx} style={{padding: 4, textAlign: 'center', color: s === 0 ? 'var(--text-muted)' : 'var(--text-primary)', backgroundColor: liveMatch.currentHole === idx + 1 ? 'rgba(255,255,255,0.06)' : 'transparent'}}>{s || '-'}</td>
                  ))}
                  <td style={{padding: 4, textAlign: 'center', fontWeight: 'bold', color: 'var(--primary)'}}>{totalStrokes1}</td>
                </tr>
                <tr>
                  <td style={{padding: 4, fontWeight: '500', color: 'var(--secondary)'}}>{liveMatch.team2}</td>
                  {liveMatch.strokes2.map((s, idx) => (
                    <td key={idx} style={{padding: 4, textAlign: 'center', color: s === 0 ? 'var(--text-muted)' : 'var(--text-primary)', backgroundColor: liveMatch.currentHole === idx + 1 ? 'rgba(255,255,255,0.06)' : 'transparent'}}>{s || '-'}</td>
                  ))}
                  <td style={{padding: 4, textAlign: 'center', fontWeight: 'bold', color: 'var(--secondary)'}}>{totalStrokes2}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{display: 'flex', gap: 10, marginTop: 10}}>
            <button onClick={undoLastBall} className="btn-outlined" style={{borderColor: 'var(--danger)', color: 'var(--danger)', flex: 1}}>
              UNDO ACTION
            </button>
            <button 
              onClick={async () => {
                const confirm = await showConfirm('End Match', 'Are you sure you want to end this match?');
                if (confirm) {
                  setLiveMatch(prev => {
                    const updated = { ...prev };
                    updated.isCompleted = true;
                    if (totalStrokes1 < totalStrokes2) {
                      updated.result = `${updated.team1} won Golf by ${totalStrokes2 - totalStrokes1} strokes (${totalStrokes1} to ${totalStrokes2})!`;
                    } else if (totalStrokes2 < totalStrokes1) {
                      updated.result = `${updated.team2} won Golf by ${totalStrokes1 - totalStrokes2} strokes (${totalStrokes2} to ${totalStrokes1})!`;
                    } else {
                      updated.result = `Golf match tied at ${totalStrokes1} strokes!`;
                    }
                    return updated;
                  });
                }
              }} 
              className="btn-neon" 
              style={{flex: 1}}
            >
              END MATCH
            </button>
          </div>
          <button
            onClick={async () => {
              const confirm = await showConfirm('Abandon Match', 'Are you sure you want to abandon this match? This will end scoring immediately.');
              if (confirm) {
                setLiveMatch(prev => ({ ...prev, isCompleted: true, isAbandoned: true, result: 'Match Abandoned' }));
              }
            }}
            className="btn-outlined"
            style={{width: '100%', marginTop: 10, borderColor: 'var(--danger)', color: 'var(--danger)', fontWeight: 'bold'}}
          >
            ⚠ ABANDON MATCH
          </button>
        </div>
      </div>
    );
  }

  if (liveMatch && (liveMatch.sport === 'Hockey' || liveMatch.sport === 'Ice Hockey')) {
    const isIce = liveMatch.sport === 'Ice Hockey';
    return (
      <div style={{...styles.container, padding: 16}}>
        {/* Top Mini Score */}
        <div className="sporty-card glow-green" style={{padding: 16, marginBottom: 16}}>
          <div className="flex-between" style={{alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <span className="live-dot" /> <span style={{fontSize: '0.85rem', color: "var(--text-primary)", fontWeight: 'bold'}}>{isIce ? '🏒 ICE HOCKEY LIVE' : '🏑 HOCKEY LIVE'}</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <span style={{fontSize: '0.72rem', color: 'var(--text-muted)'}}>Period {liveMatch.period}</span>
              <button
                onClick={() => {
                  setSelectedLiveMatch(liveMatch);
                  setCurrentScreen('live_scorecard');
                }}
                className="btn-neon"
                style={{padding: '4px 8px', fontSize: '0.68rem', width: 'auto'}}
              >
                📊 Scorecard
              </button>
            </div>
          </div>
          <div style={{margin: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team1}</h3>
            </div>
            <div style={{textAlign: 'center', padding: '0 20px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)'}}>{liveMatch.goals1} - {liveMatch.goals2}</h2>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team2}</h3>
            </div>
          </div>
        </div>

        <div style={styles.scorerDashboard}>
          <div style={{marginBottom: 10, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>Goals</div>
          <div style={styles.scorerGrid}>
            <button 
              onClick={() => updateHockeyScore(1, 1)} 
              className="btn-neon" 
              style={{gridColumn: "span 2", padding: '14px 0'}}
            >
              🏒 GOAL {liveMatch.team1}
            </button>
            <button 
              onClick={() => updateHockeyScore(2, 1)} 
              className="btn-neon" 
              style={{gridColumn: "span 2", padding: '14px 0', backgroundColor: 'var(--secondary)'}}
            >
              🏒 GOAL {liveMatch.team2}
            </button>
            <button 
              onClick={() => updateHockeyScore(1, -1)} 
              className="btn-outlined" 
              style={{gridColumn: "span 2", padding: '10px 0'}}
            >
              ➖ Remove Goal
            </button>
            <button 
              onClick={() => updateHockeyScore(2, -1)} 
              className="btn-outlined" 
              style={{gridColumn: "span 2", padding: '10px 0'}}
            >
              ➖ Remove Goal
            </button>
          </div>

          <div style={{margin: '20px 0 10px 0', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>Shots & Penalties</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20}}>
            <div className="sporty-card" style={{padding: 10, textAlign: 'center'}}>
              <span style={{fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4}}>SHOTS ON GOAL</span>
              <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                <div className="flex-between">
                  <span style={{fontSize: '0.75rem'}}>{liveMatch.team1}: {liveMatch.shots1}</span>
                  <div style={{display: 'flex', gap: 4}}>
                    <button onClick={() => updateHockeyStats(1, 'shot', -1)} className="btn-outlined" style={{width: 24, height: 24, padding: 0}}>-</button>
                    <button onClick={() => updateHockeyStats(1, 'shot', 1)} className="btn-outlined" style={{width: 24, height: 24, padding: 0}}>+</button>
                  </div>
                </div>
                <div className="flex-between">
                  <span style={{fontSize: '0.75rem'}}>{liveMatch.team2}: {liveMatch.shots2}</span>
                  <div style={{display: 'flex', gap: 4}}>
                    <button onClick={() => updateHockeyStats(2, 'shot', -1)} className="btn-outlined" style={{width: 24, height: 24, padding: 0}}>-</button>
                    <button onClick={() => updateHockeyStats(2, 'shot', 1)} className="btn-outlined" style={{width: 24, height: 24, padding: 0}}>+</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="sporty-card" style={{padding: 10, textAlign: 'center'}}>
              <span style={{fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4}}>PENALTIES</span>
              <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                <div className="flex-between">
                  <span style={{fontSize: '0.75rem'}}>{liveMatch.team1}: {liveMatch.penalties1}</span>
                  <div style={{display: 'flex', gap: 4}}>
                    <button onClick={() => updateHockeyStats(1, 'penalty', -1)} className="btn-outlined" style={{width: 24, height: 24, padding: 0}}>-</button>
                    <button onClick={() => updateHockeyStats(1, 'penalty', 1)} className="btn-outlined" style={{width: 24, height: 24, padding: 0}}>+</button>
                  </div>
                </div>
                <div className="flex-between">
                  <span style={{fontSize: '0.75rem'}}>{liveMatch.team2}: {liveMatch.penalties2}</span>
                  <div style={{display: 'flex', gap: 4}}>
                    <button onClick={() => updateHockeyStats(2, 'penalty', -1)} className="btn-outlined" style={{width: 24, height: 24, padding: 0}}>-</button>
                    <button onClick={() => updateHockeyStats(2, 'penalty', 1)} className="btn-outlined" style={{width: 24, height: 24, padding: 0}}>+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{margin: '16px 0 10px 0', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>Periods</div>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 20}}>
            <button onClick={() => updateHockeyStats(1, 'period', -1)} className="btn-outlined" style={{padding: '6px 16px'}} disabled={liveMatch.period === 1}>◀ Prev</button>
            <strong style={{color: 'var(--text-primary)', fontSize: '1rem'}}>Period {liveMatch.period}</strong>
            <button onClick={() => updateHockeyStats(1, 'period', 1)} className="btn-outlined" style={{padding: '6px 16px'}} disabled={liveMatch.period === 3}>Next ▶</button>
          </div>

          {/* Timeline Events */}
          <div className="sporty-card" style={{marginBottom: 20}}>
            <h4 style={{fontSize: '0.85rem', color: 'var(--primary)', marginBottom: 8, textTransform: 'uppercase'}}>Timeline Events</h4>
            <div style={{maxHeight: 120, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6}}>
              {liveMatch.events.slice().reverse().map((ev, index) => (
                <div key={index} className="flex-between" style={{fontSize: '0.8rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-light)', paddingBottom: 4}}>
                  <span>{ev.time} - {ev.team} {ev.type}</span>
                  <span style={{fontWeight: 'bold', color: 'var(--text-muted)'}}>{ev.detail}</span>
                </div>
              ))}
              {liveMatch.events.length === 0 && (
                <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center'}}>No events logged yet.</p>
              )}
            </div>
          </div>

          <div style={{display: 'flex', gap: 10, marginTop: 10}}>
            <button onClick={undoLastBall} className="btn-outlined" style={{borderColor: 'var(--danger)', color: 'var(--danger)', flex: 1}}>
              UNDO ACTION
            </button>
            <button 
              onClick={async () => {
                const confirm = await showConfirm('End Match', 'Are you sure you want to end this match?');
                if (confirm) {
                  setLiveMatch(prev => {
                    const updated = { ...prev };
                    updated.isCompleted = true;
                    if (updated.goals1 > updated.goals2) {
                      updated.result = `${updated.team1} won ${updated.goals1} - ${updated.goals2}!`;
                    } else if (updated.goals2 > updated.goals1) {
                      updated.result = `${updated.team2} won ${updated.goals2} - ${updated.goals1}!`;
                    } else {
                      updated.result = `Match ended in a Draw ${updated.goals1} - ${updated.goals2}!`;
                    }
                    return updated;
                  });
                }
              }} 
              className="btn-neon" 
              style={{flex: 1}}
            >
              END MATCH
            </button>
          </div>
          <button
            onClick={async () => {
              const confirm = await showConfirm('Abandon Match', 'Are you sure you want to abandon this match? This will end scoring immediately.');
              if (confirm) {
                setLiveMatch(prev => ({ ...prev, isCompleted: true, isAbandoned: true, result: 'Match Abandoned' }));
              }
            }}
            className="btn-outlined"
            style={{width: '100%', marginTop: 10, borderColor: 'var(--danger)', color: 'var(--danger)', fontWeight: 'bold'}}
          >
            ⚠ ABANDON MATCH
          </button>
        </div>
      </div>
    );
  }

  if (liveMatch && liveMatch.sport === 'Skating') {
    return (
      <div style={{...styles.container, padding: 16}}>
        {/* Top Mini Score */}
        <div className="sporty-card glow-green" style={{padding: 16, marginBottom: 16}}>
          <div className="flex-between" style={{alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <span className="live-dot" /> <span style={{fontSize: '0.85rem', color: "var(--text-primary)", fontWeight: 'bold'}}>⛸️ SKATING JUDGING LIVE</span>
            </div>
            <button
              onClick={() => {
                setSelectedLiveMatch(liveMatch);
                setCurrentScreen('live_scorecard');
              }}
              className="btn-neon"
              style={{padding: '4px 8px', fontSize: '0.68rem', width: 'auto'}}
            >
              📊 Scorecard
            </button>
          </div>
          <div style={{margin: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team1}</h3>
              <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Tech: {liveMatch.technicalScore1.toFixed(1)} | Art: {liveMatch.artisticScore1.toFixed(1)}</div>
              <div style={{fontSize: '1.1rem', color: 'var(--secondary)', fontWeight: 'bold', marginTop: 4}}>Total: {liveMatch.totalScore1.toFixed(2)}</div>
            </div>
            <div style={{textAlign: 'center', padding: '0 10px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>
              VS
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team2}</h3>
              <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Tech: {liveMatch.technicalScore2.toFixed(1)} | Art: {liveMatch.artisticScore2.toFixed(1)}</div>
              <div style={{fontSize: '1.1rem', color: 'var(--secondary)', fontWeight: 'bold', marginTop: 4}}>Total: {liveMatch.totalScore2.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div style={styles.scorerDashboard}>
          <div style={{marginBottom: 10, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>Adjust Judge Scores</div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20}}>
            {/* Team 1 Score Adjuster */}
            <div className="sporty-card" style={{padding: 12}}>
              <h4 style={{fontSize: '0.9rem', color: 'var(--primary)', marginBottom: 10}}>{liveMatch.team1}</h4>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
                <div>
                  <span style={{fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4}}>TECHNICAL (0-10)</span>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <button onClick={() => updateSkatingScore(1, 'technical', -0.1)} className="btn-outlined" style={{width: 28, height: 28, padding: 0}}>-</button>
                    <span style={{fontSize: '0.95rem', fontWeight: 'bold', minWidth: 32, textAlign: 'center'}}>{liveMatch.technicalScore1.toFixed(1)}</span>
                    <button onClick={() => updateSkatingScore(1, 'technical', 0.1)} className="btn-outlined" style={{width: 28, height: 28, padding: 0}}>+</button>
                  </div>
                </div>
                <div>
                  <span style={{fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4}}>ARTISTIC (0-10)</span>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <button onClick={() => updateSkatingScore(1, 'artistic', -0.1)} className="btn-outlined" style={{width: 28, height: 28, padding: 0}}>-</button>
                    <span style={{fontSize: '0.95rem', fontWeight: 'bold', minWidth: 32, textAlign: 'center'}}>{liveMatch.artisticScore1.toFixed(1)}</span>
                    <button onClick={() => updateSkatingScore(1, 'artistic', 0.1)} className="btn-outlined" style={{width: 28, height: 28, padding: 0}}>+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Team 2 Score Adjuster */}
            <div className="sporty-card" style={{padding: 12}}>
              <h4 style={{fontSize: '0.9rem', color: 'var(--secondary)', marginBottom: 10}}>{liveMatch.team2}</h4>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
                <div>
                  <span style={{fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4}}>TECHNICAL (0-10)</span>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <button onClick={() => updateSkatingScore(2, 'technical', -0.1)} className="btn-outlined" style={{width: 28, height: 28, padding: 0}}>-</button>
                    <span style={{fontSize: '0.95rem', fontWeight: 'bold', minWidth: 32, textAlign: 'center'}}>{liveMatch.technicalScore2.toFixed(1)}</span>
                    <button onClick={() => updateSkatingScore(2, 'technical', 0.1)} className="btn-outlined" style={{width: 28, height: 28, padding: 0}}>+</button>
                  </div>
                </div>
                <div>
                  <span style={{fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4}}>ARTISTIC (0-10)</span>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <button onClick={() => updateSkatingScore(2, 'artistic', -0.1)} className="btn-outlined" style={{width: 28, height: 28, padding: 0}}>-</button>
                    <span style={{fontSize: '0.95rem', fontWeight: 'bold', minWidth: 32, textAlign: 'center'}}>{liveMatch.artisticScore2.toFixed(1)}</span>
                    <button onClick={() => updateSkatingScore(2, 'artistic', 0.1)} className="btn-outlined" style={{width: 28, height: 28, padding: 0}}>+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{display: 'flex', gap: 10, marginTop: 10}}>
            <button onClick={undoLastBall} className="btn-outlined" style={{borderColor: 'var(--danger)', color: 'var(--danger)', flex: 1}}>
              UNDO ACTION
            </button>
            <button 
              onClick={async () => {
                const confirm = await showConfirm('End Match', 'Are you sure you want to end this match?');
                if (confirm) {
                  setLiveMatch(prev => {
                    const updated = { ...prev };
                    updated.isCompleted = true;
                    if (updated.totalScore1 > updated.totalScore2) {
                      updated.result = `${updated.team1} won Skating with ${updated.totalScore1.toFixed(2)} pts over ${updated.totalScore2.toFixed(2)} pts!`;
                    } else if (updated.totalScore2 > updated.totalScore1) {
                      updated.result = `${updated.team2} won Skating with ${updated.totalScore2.toFixed(2)} pts over ${updated.totalScore1.toFixed(2)} pts!`;
                    } else {
                      updated.result = `Skating match ended in a tie at ${updated.totalScore1.toFixed(2)} pts!`;
                    }
                    return updated;
                  });
                }
              }} 
              className="btn-neon" 
              style={{flex: 1}}
            >
              END MATCH
            </button>
          </div>
          <button
            onClick={async () => {
              const confirm = await showConfirm('Abandon Match', 'Are you sure you want to abandon this match? This will end scoring immediately.');
              if (confirm) {
                setLiveMatch(prev => ({ ...prev, isCompleted: true, isAbandoned: true, result: 'Match Abandoned' }));
              }
            }}
            className="btn-outlined"
            style={{width: '100%', marginTop: 10, borderColor: 'var(--danger)', color: 'var(--danger)', fontWeight: 'bold'}}
          >
            ⚠ ABANDON MATCH
          </button>
        </div>
      </div>
    );
  }

  if (liveMatch && liveMatch.sport === 'Badminton') {
    return (
      <div style={{...styles.container, padding: 16}}>
        {/* Top Mini Score */}
        <div className="sporty-card glow-green" style={{padding: 16, marginBottom: 16}}>
          <div className="flex-between" style={{alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <span className="live-dot" /> <span style={{fontSize: '0.85rem', color: "var(--text-primary)", fontWeight: 'bold'}}>BADMINTON SCORING</span>
            </div>
            <button
              onClick={() => {
                setSelectedLiveMatch(liveMatch);
                setCurrentScreen('live_scorecard');
              }}
              className="btn-neon"
              style={{padding: '4px 8px', fontSize: '0.68rem', width: 'auto'}}
            >
              📊 Scorecard
            </button>
          </div>
          <div style={{margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team1}</h3>
              <span className="text-gold" style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Sets: {liveMatch.sets1}</span>
            </div>
            <div style={{textAlign: 'center', padding: '0 16px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)'}}>{liveMatch.points1} - {liveMatch.points2}</h2>
              <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Current Set Points</span>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team2}</h3>
              <span className="text-gold" style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Sets: {liveMatch.sets2}</span>
            </div>
          </div>
        </div>

        {/* Set History */}
        {liveMatch.setScores && liveMatch.setScores.length > 0 && (
          <div className="sporty-card" style={{padding: 10, marginBottom: 16}}>
            <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4, textTransform: 'uppercase'}}>Set Results</span>
            <div style={{display: 'flex', gap: 8, overflowX: 'auto'}}>
              {liveMatch.setScores.map((s, idx) => (
                <div key={idx} style={{padding: '4px 8px', backgroundColor: 'var(--bg-secondary)', borderRadius: 6, fontSize: '0.75rem', whiteSpace: 'nowrap'}}>
                  Set {s.set}: <strong>{s.score1} - {s.score2}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scoring Actions */}
        <div style={styles.scorerDashboard}>
          <div style={{marginBottom: 10, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>Points Control</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16}}>
            <button 
              onClick={() => updateBadmintonScore(1, 1)} 
              className="btn-neon" 
              style={{padding: '16px 0', fontSize: '1.2rem'}}
            >
              +1 POINT {liveMatch.team1}
            </button>
            <button 
              onClick={() => updateBadmintonScore(2, 1)} 
              className="btn-neon" 
              style={{padding: '16px 0', fontSize: '1.2rem', backgroundColor: 'var(--secondary)'}}
            >
              +1 POINT {liveMatch.team2}
            </button>
            <button onClick={() => updateBadmintonScore(1, -1)} className="btn-outlined" style={{padding: '10px 0'}}>-1 Point Team A</button>
            <button onClick={() => updateBadmintonScore(2, -1)} className="btn-outlined" style={{padding: '10px 0'}}>-1 Point Team B</button>
          </div>

          <div style={{display: 'flex', gap: 10, marginTop: 20}}>
            <button onClick={undoLastBall} className="btn-outlined" style={{borderColor: 'var(--danger)', color: 'var(--danger)', flex: 1}}>
              UNDO POINT
            </button>
            <button 
              onClick={async () => {
                const confirm = await showConfirm('End Match', 'Are you sure you want to end this Badminton match?');
                if (confirm) {
                  setLiveMatch(prev => {
                    const updated = { ...prev };
                    updated.isCompleted = true;
                    if (updated.sets1 > updated.sets2) {
                      updated.result = `${updated.team1} won the Badminton match ${updated.sets1} - ${updated.sets2}!`;
                    } else if (updated.sets2 > updated.sets1) {
                      updated.result = `${updated.team2} won the Badminton match ${updated.sets2} - ${updated.sets1}!`;
                    } else {
                      updated.result = `Match Finished: ${updated.sets1} - ${updated.sets2}`;
                    }
                    return updated;
                  });
                }
              }} 
              className="btn-neon" 
              style={{flex: 1}}
            >
              END MATCH
            </button>
          </div>
          <button
            onClick={async () => {
              const confirm = await showConfirm('Abandon Match', 'Are you sure you want to abandon this match? This will end scoring immediately.');
              if (confirm) {
                setLiveMatch(prev => ({ ...prev, isCompleted: true, isAbandoned: true, result: 'Match Abandoned' }));
              }
            }}
            className="btn-outlined"
            style={{width: '100%', marginTop: 10, borderColor: 'var(--danger)', color: 'var(--danger)', fontWeight: 'bold'}}
          >
            ⚠ ABANDON MATCH
          </button>
        </div>
      </div>
    );
  }

  if (liveMatch && liveMatch.sport === 'Table Tennis') {
    return (
      <div style={{...styles.container, padding: 16}}>
        {/* Top Mini Score */}
        <div className="sporty-card glow-green" style={{padding: 16, marginBottom: 16}}>
          <div className="flex-between" style={{alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <span className="live-dot" /> <span style={{fontSize: '0.85rem', color: "var(--text-primary)", fontWeight: 'bold'}}>TABLE TENNIS SCORING</span>
            </div>
            <button
              onClick={() => {
                setSelectedLiveMatch(liveMatch);
                setCurrentScreen('live_scorecard');
              }}
              className="btn-neon"
              style={{padding: '4px 8px', fontSize: '0.68rem', width: 'auto'}}
            >
              📊 Scorecard
            </button>
          </div>
          <div style={{margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team1}</h3>
              <span className="text-gold" style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Sets: {liveMatch.sets1}</span>
            </div>
            <div style={{textAlign: 'center', padding: '0 16px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)'}}>{liveMatch.points1} - {liveMatch.points2}</h2>
              <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Current Set Points</span>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team2}</h3>
              <span className="text-gold" style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Sets: {liveMatch.sets2}</span>
            </div>
          </div>
        </div>

        {/* Set History */}
        {liveMatch.setScores && liveMatch.setScores.length > 0 && (
          <div className="sporty-card" style={{padding: 10, marginBottom: 16}}>
            <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4, textTransform: 'uppercase'}}>Set Results</span>
            <div style={{display: 'flex', gap: 8, overflowX: 'auto'}}>
              {liveMatch.setScores.map((s, idx) => (
                <div key={idx} style={{padding: '4px 8px', backgroundColor: 'var(--bg-secondary)', borderRadius: 6, fontSize: '0.75rem', whiteSpace: 'nowrap'}}>
                  Set {s.set}: <strong>{s.score1} - {s.score2}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scoring Actions */}
        <div style={styles.scorerDashboard}>
          <div style={{marginBottom: 10, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>Points Control</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16}}>
            <button 
              onClick={() => updateTableTennisScore(1, 1)} 
              className="btn-neon" 
              style={{padding: '16px 0', fontSize: '1.2rem'}}
            >
              +1 POINT {liveMatch.team1}
            </button>
            <button 
              onClick={() => updateTableTennisScore(2, 1)} 
              className="btn-neon" 
              style={{padding: '16px 0', fontSize: '1.2rem', backgroundColor: 'var(--secondary)'}}
            >
              +1 POINT {liveMatch.team2}
            </button>
            <button onClick={() => updateTableTennisScore(1, -1)} className="btn-outlined" style={{padding: '10px 0'}}>-1 Point Team A</button>
            <button onClick={() => updateTableTennisScore(2, -1)} className="btn-outlined" style={{padding: '10px 0'}}>-1 Point Team B</button>
          </div>

          <div style={{display: 'flex', gap: 10, marginTop: 20}}>
            <button onClick={undoLastBall} className="btn-outlined" style={{borderColor: 'var(--danger)', color: 'var(--danger)', flex: 1}}>
              UNDO POINT
            </button>
            <button 
              onClick={async () => {
                const confirm = await showConfirm('End Match', 'Are you sure you want to end this Table Tennis match?');
                if (confirm) {
                  setLiveMatch(prev => {
                    const updated = { ...prev };
                    updated.isCompleted = true;
                    if (updated.sets1 > updated.sets2) {
                      updated.result = `${updated.team1} won the Table Tennis match ${updated.sets1} - ${updated.sets2}!`;
                    } else if (updated.sets2 > updated.sets1) {
                      updated.result = `${updated.team2} won the Table Tennis match ${updated.sets2} - ${updated.sets1}!`;
                    } else {
                      updated.result = `Match Finished: ${updated.sets1} - ${updated.sets2}`;
                    }
                    return updated;
                  });
                }
              }} 
              className="btn-neon" 
              style={{flex: 1}}
            >
              END MATCH
            </button>
          </div>
          <button
            onClick={async () => {
              const confirm = await showConfirm('Abandon Match', 'Are you sure you want to abandon this match? This will end scoring immediately.');
              if (confirm) {
                setLiveMatch(prev => ({ ...prev, isCompleted: true, isAbandoned: true, result: 'Match Abandoned' }));
              }
            }}
            className="btn-outlined"
            style={{width: '100%', marginTop: 10, borderColor: 'var(--danger)', color: 'var(--danger)', fontWeight: 'bold'}}
          >
            ⚠ ABANDON MATCH
          </button>
        </div>
      </div>
    );
  }

  if (liveMatch && liveMatch.sport === 'Tennis') {
    return (
      <div style={{...styles.container, padding: 16}}>
        {/* Top Mini Score */}
        <div className="sporty-card glow-green" style={{padding: 16, marginBottom: 16}}>
          <div className="flex-between" style={{alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <span className="live-dot" /> <span style={{fontSize: '0.85rem', color: "var(--text-primary)", fontWeight: 'bold'}}>TENNIS SCORING</span>
            </div>
            <button
              onClick={() => {
                setSelectedLiveMatch(liveMatch);
                setCurrentScreen('live_scorecard');
              }}
              className="btn-neon"
              style={{padding: '4px 8px', fontSize: '0.68rem', width: 'auto'}}
            >
              📊 Scorecard
            </button>
          </div>
          <div style={{margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team1}</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4}}>
                <span className="text-gold" style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Sets: {liveMatch.sets1}</span>
                <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Games: {liveMatch.games1}</span>
              </div>
            </div>
            <div style={{textAlign: 'center', padding: '0 16px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)'}}>{liveMatch.points1} - {liveMatch.points2}</h2>
              <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Current Game Score</span>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team2}</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4}}>
                <span className="text-gold" style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Sets: {liveMatch.sets2}</span>
                <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Games: {liveMatch.games2}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Set History */}
        {liveMatch.setScores && liveMatch.setScores.length > 0 && (
          <div className="sporty-card" style={{padding: 10, marginBottom: 16}}>
            <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4, textTransform: 'uppercase'}}>Set Results</span>
            <div style={{display: 'flex', gap: 8, overflowX: 'auto'}}>
              {liveMatch.setScores.map((s, idx) => (
                <div key={idx} style={{padding: '4px 8px', backgroundColor: 'var(--bg-secondary)', borderRadius: 6, fontSize: '0.75rem', whiteSpace: 'nowrap'}}>
                  Set {s.set}: <strong>{s.games1} - {s.games2}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scoring Actions */}
        <div style={styles.scorerDashboard}>
          <div style={{marginBottom: 10, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>Point Win</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16}}>
            <button 
              onClick={() => updateTennisScore(1, 1)} 
              className="btn-neon" 
              style={{padding: '16px 0', fontSize: '1.1rem'}}
            >
              POINT {liveMatch.team1} 🎾
            </button>
            <button 
              onClick={() => updateTennisScore(2, 1)} 
              className="btn-neon" 
              style={{padding: '16px 0', fontSize: '1.1rem', backgroundColor: 'var(--secondary)'}}
            >
              POINT {liveMatch.team2} 🎾
            </button>
          </div>

          <div style={{display: 'flex', gap: 10, marginTop: 20}}>
            <button onClick={undoLastBall} className="btn-outlined" style={{borderColor: 'var(--danger)', color: 'var(--danger)', flex: 1}}>
              UNDO POINT
            </button>
            <button 
              onClick={async () => {
                const confirm = await showConfirm('End Match', 'Are you sure you want to end this Tennis match?');
                if (confirm) {
                  setLiveMatch(prev => {
                    const updated = { ...prev };
                    updated.isCompleted = true;
                    if (updated.sets1 > updated.sets2) {
                      updated.result = `${updated.team1} won the Tennis match ${updated.sets1} - ${updated.sets2}!`;
                    } else if (updated.sets2 > updated.sets1) {
                      updated.result = `${updated.team2} won the Tennis match ${updated.sets2} - ${updated.sets1}!`;
                    } else {
                      updated.result = `Match Finished: ${updated.sets1} - ${updated.sets2}`;
                    }
                    return updated;
                  });
                }
              }} 
              className="btn-neon" 
              style={{flex: 1}}
            >
              END MATCH
            </button>
          </div>
          <button
            onClick={async () => {
              const confirm = await showConfirm('Abandon Match', 'Are you sure you want to abandon this match? This will end scoring immediately.');
              if (confirm) {
                setLiveMatch(prev => ({ ...prev, isCompleted: true, isAbandoned: true, result: 'Match Abandoned' }));
              }
            }}
            className="btn-outlined"
            style={{width: '100%', marginTop: 10, borderColor: 'var(--danger)', color: 'var(--danger)', fontWeight: 'bold'}}
          >
            ⚠ ABANDON MATCH
          </button>
        </div>
      </div>
    );
  }

  if (liveMatch && liveMatch.sport === 'Snooker') {
    const snookerBalls = [
      { color: '#e11d48', label: 'Red (1)', pts: 1 },
      { color: '#eab308', label: 'Yellow (2)', pts: 2 },
      { color: '#22c55e', label: 'Green (3)', pts: 3 },
      { color: '#a16207', label: 'Brown (4)', pts: 4 },
      { color: '#3b82f6', label: 'Blue (5)', pts: 5 },
      { color: '#ec4899', label: 'Pink (6)', pts: 6 },
      { color: '#111827', label: 'Black (7)', pts: 7, border: '1px solid #374151' }
    ];

    return (
      <div style={{...styles.container, padding: 16}}>
        {/* Top Mini Score */}
        <div className="sporty-card glow-green" style={{padding: 16, marginBottom: 16}}>
          <div className="flex-between" style={{alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <span className="live-dot" /> <span style={{fontSize: '0.85rem', color: "var(--text-primary)", fontWeight: 'bold'}}>SNOOKER SCORING</span>
            </div>
            <button
              onClick={() => {
                setSelectedLiveMatch(liveMatch);
                setCurrentScreen('live_scorecard');
              }}
              className="btn-neon"
              style={{padding: '4px 8px', fontSize: '0.68rem', width: 'auto'}}
            >
              📊 Scorecard
            </button>
          </div>
          <div style={{margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team1}</h3>
              <span className="text-gold" style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Frames: {liveMatch.frames1}</span>
            </div>
            <div style={{textAlign: 'center', padding: '0 16px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)'}}>{liveMatch.points1} - {liveMatch.points2}</h2>
              <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Current Frame Points</span>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team2}</h3>
              <span className="text-gold" style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Frames: {liveMatch.frames2}</span>
            </div>
          </div>
        </div>

        {/* Frames History */}
        {liveMatch.frameScores && liveMatch.frameScores.length > 0 && (
          <div className="sporty-card" style={{padding: 10, marginBottom: 16}}>
            <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4, textTransform: 'uppercase'}}>Frame Results</span>
            <div style={{display: 'flex', gap: 8, overflowX: 'auto'}}>
              {liveMatch.frameScores.map((f, idx) => (
                <div key={idx} style={{padding: '4px 8px', backgroundColor: 'var(--bg-secondary)', borderRadius: 6, fontSize: '0.75rem', whiteSpace: 'nowrap'}}>
                  Frame {f.frame}: <strong>{f.score1} - {f.score2}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scoring Console */}
        <div style={styles.scorerDashboard}>
          <div style={{display: 'flex', gap: 16, marginBottom: 20}}>
            {/* Team 1 scoring buttons */}
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 6}}>
              <h5 style={{color: 'var(--primary)', textAlign: 'center', marginBottom: 4, fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{liveMatch.team1}</h5>
              {snookerBalls.map(b => (
                <button 
                  key={b.pts} 
                  onClick={() => updateCueMatchScore(1, b.pts, true)}
                  className="score-btn-box"
                  style={{backgroundColor: b.color, color: b.pts === 2 || b.pts === 3 ? '#111' : '#fff', border: b.border || 'none', padding: '8px 0', fontSize: '0.75rem', fontWeight: 'bold'}}
                >
                  {b.label}
                </button>
              ))}
              <div style={{display: 'flex', gap: 4}}>
                <button onClick={() => updateCueMatchScore(1, 4, true)} className="btn-outlined" style={{flex: 1, padding: '6px 0', fontSize: '0.68rem'}}>+4 Pen</button>
                <button onClick={() => updateCueMatchScore(1, 7, true)} className="btn-outlined" style={{flex: 1, padding: '6px 0', fontSize: '0.68rem'}}>+7 Pen</button>
              </div>
              <div style={{display: 'flex', gap: 4}}>
                <button onClick={() => updateCueMatchScore(1, -1, true)} className="btn-outlined" style={{flex: 1, padding: '6px 0', fontSize: '0.68rem'}}>-1 Pt</button>
                <button onClick={() => endCueFrame(1, true)} className="btn-neon" style={{flex: 1, padding: '6px 0', fontSize: '0.68rem'}}>Win Frm</button>
              </div>
            </div>

            {/* Team 2 scoring buttons */}
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 6}}>
              <h5 style={{color: 'var(--secondary)', textAlign: 'center', marginBottom: 4, fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{liveMatch.team2}</h5>
              {snookerBalls.map(b => (
                <button 
                  key={b.pts} 
                  onClick={() => updateCueMatchScore(2, b.pts, true)}
                  className="score-btn-box"
                  style={{backgroundColor: b.color, color: b.pts === 2 || b.pts === 3 ? '#111' : '#fff', border: b.border || 'none', padding: '8px 0', fontSize: '0.75rem', fontWeight: 'bold'}}
                >
                  {b.label}
                </button>
              ))}
              <div style={{display: 'flex', gap: 4}}>
                <button onClick={() => updateCueMatchScore(2, 4, true)} className="btn-outlined" style={{flex: 1, padding: '6px 0', fontSize: '0.68rem'}}>+4 Pen</button>
                <button onClick={() => updateCueMatchScore(2, 7, true)} className="btn-outlined" style={{flex: 1, padding: '6px 0', fontSize: '0.68rem'}}>+7 Pen</button>
              </div>
              <div style={{display: 'flex', gap: 4}}>
                <button onClick={() => updateCueMatchScore(2, -1, true)} className="btn-outlined" style={{flex: 1, padding: '6px 0', fontSize: '0.68rem'}}>-1 Pt</button>
                <button onClick={() => endCueFrame(2, true)} className="btn-neon" style={{flex: 1, padding: '6px 0', fontSize: '0.68rem', backgroundColor: 'var(--secondary)'}}>Win Frm</button>
              </div>
            </div>
          </div>

          <div style={{display: 'flex', gap: 10, marginTop: 10}}>
            <button onClick={undoLastBall} className="btn-outlined" style={{borderColor: 'var(--danger)', color: 'var(--danger)', flex: 1}}>
              UNDO ACTION
            </button>
            <button 
              onClick={async () => {
                const confirm = await showConfirm('End Match', 'Are you sure you want to end this Snooker match?');
                if (confirm) {
                  setLiveMatch(prev => {
                    const updated = { ...prev };
                    updated.isCompleted = true;
                    if (updated.frames1 > updated.frames2) {
                      updated.result = `${updated.team1} won the Snooker match ${updated.frames1} - ${updated.frames2}!`;
                    } else if (updated.frames2 > updated.frames1) {
                      updated.result = `${updated.team2} won the Snooker match ${updated.frames2} - ${updated.frames1}!`;
                    } else {
                      updated.result = `Match Finished: ${updated.frames1} - ${updated.frames2}`;
                    }
                    return updated;
                  });
                }
              }} 
              className="btn-neon" 
              style={{flex: 1}}
            >
              END MATCH
            </button>
          </div>
          <button
            onClick={async () => {
              const confirm = await showConfirm('Abandon Match', 'Are you sure you want to abandon this match? This will end scoring immediately.');
              if (confirm) {
                setLiveMatch(prev => ({ ...prev, isCompleted: true, isAbandoned: true, result: 'Match Abandoned' }));
              }
            }}
            className="btn-outlined"
            style={{width: '100%', marginTop: 10, borderColor: 'var(--danger)', color: 'var(--danger)', fontWeight: 'bold'}}
          >
            ⚠ ABANDON MATCH
          </button>
        </div>
      </div>
    );
  }

  if (liveMatch && liveMatch.sport === 'Pool') {
    return (
      <div style={{...styles.container, padding: 16}}>
        {/* Top Mini Score */}
        <div className="sporty-card glow-green" style={{padding: 16, marginBottom: 16}}>
          <div className="flex-between" style={{alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <span className="live-dot" /> <span style={{fontSize: '0.85rem', color: "var(--text-primary)", fontWeight: 'bold'}}>8-BALL POOL SCORING</span>
            </div>
          </div>
          <div style={{margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team1}</h3>
              <span className="text-gold" style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Frames: {liveMatch.frames1}</span>
            </div>
            <div style={{textAlign: 'center', padding: '0 16px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)'}}>{liveMatch.points1} - {liveMatch.points2}</h2>
              <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Current Frame Balls</span>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team2}</h3>
              <span className="text-gold" style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Frames: {liveMatch.frames2}</span>
            </div>
          </div>
        </div>

        {/* Frames History */}
        {liveMatch.frameScores && liveMatch.frameScores.length > 0 && (
          <div className="sporty-card" style={{padding: 10, marginBottom: 16}}>
            <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4, textTransform: 'uppercase'}}>Frame Results</span>
            <div style={{display: 'flex', gap: 8, overflowX: 'auto'}}>
              {liveMatch.frameScores.map((f, idx) => (
                <div key={idx} style={{padding: '4px 8px', backgroundColor: 'var(--bg-secondary)', borderRadius: 6, fontSize: '0.75rem', whiteSpace: 'nowrap'}}>
                  Frame {f.frame}: <strong>{f.score1} - {f.score2}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scoring Console */}
        <div style={styles.scorerDashboard}>
          <div style={{display: 'flex', gap: 16, marginBottom: 20}}>
            {/* Team 1 scoring buttons */}
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 10}}>
              <h5 style={{color: 'var(--primary)', textAlign: 'center', fontSize: '0.82rem'}}>{liveMatch.team1}</h5>
              <button 
                onClick={() => updateCueMatchScore(1, 1, false)}
                className="btn-neon"
                style={{padding: '12px 0', fontSize: '0.9rem'}}
              >
                🔵 POT BALL
              </button>
              <button 
                onClick={() => updateCueMatchScore(1, -1, false)}
                className="btn-outlined"
                style={{padding: '8px 0', fontSize: '0.8rem'}}
              >
                Remove Ball
              </button>
              <button 
                onClick={() => endCueFrame(1, false)}
                className="btn-outlined"
                style={{padding: '8px 0', fontSize: '0.8rem', borderColor: 'var(--primary)', color: 'var(--primary)'}}
              >
                Win Frame
              </button>
            </div>

            {/* Team 2 scoring buttons */}
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 10}}>
              <h5 style={{color: 'var(--secondary)', textAlign: 'center', fontSize: '0.82rem'}}>{liveMatch.team2}</h5>
              <button 
                onClick={() => updateCueMatchScore(2, 1, false)}
                className="btn-neon"
                style={{padding: '12px 0', fontSize: '0.9rem', backgroundColor: 'var(--secondary)'}}
              >
                🔵 POT BALL
              </button>
              <button 
                onClick={() => updateCueMatchScore(2, -1, false)}
                className="btn-outlined"
                style={{padding: '8px 0', fontSize: '0.8rem'}}
              >
                Remove Ball
              </button>
              <button 
                onClick={() => endCueFrame(2, false)}
                className="btn-outlined"
                style={{padding: '8px 0', fontSize: '0.8rem', borderColor: 'var(--secondary)', color: 'var(--secondary)'}}
              >
                Win Frame
              </button>
            </div>
          </div>

          <div style={{display: 'flex', gap: 10, marginTop: 10}}>
            <button onClick={undoLastBall} className="btn-outlined" style={{borderColor: 'var(--danger)', color: 'var(--danger)', flex: 1}}>
              UNDO ACTION
            </button>
            <button 
              onClick={async () => {
                const confirm = await showConfirm('End Match', 'Are you sure you want to end this Pool match?');
                if (confirm) {
                  setLiveMatch(prev => {
                    const updated = { ...prev };
                    updated.isCompleted = true;
                    if (updated.frames1 > updated.frames2) {
                      updated.result = `${updated.team1} won the Pool match ${updated.frames1} - ${updated.frames2}!`;
                    } else if (updated.frames2 > updated.frames1) {
                      updated.result = `${updated.team2} won the Pool match ${updated.frames2} - ${updated.frames1}!`;
                    } else {
                      updated.result = `Match Finished: ${updated.frames1} - ${updated.frames2}`;
                    }
                    return updated;
                  });
                }
              }} 
              className="btn-neon" 
              style={{flex: 1}}
            >
              END MATCH
            </button>
          </div>
          <button
            onClick={async () => {
              const confirm = await showConfirm('Abandon Match', 'Are you sure you want to abandon this match? This will end scoring immediately.');
              if (confirm) {
                setLiveMatch(prev => ({ ...prev, isCompleted: true, isAbandoned: true, result: 'Match Abandoned' }));
              }
            }}
            className="btn-outlined"
            style={{width: '100%', marginTop: 10, borderColor: 'var(--danger)', color: 'var(--danger)', fontWeight: 'bold'}}
          >
            ⚠ ABANDON MATCH
          </button>
        </div>
      </div>
    );
  }

  if (liveMatch && liveMatch.sport === 'Gaming') {
    return (
      <div style={{...styles.container, padding: 16}}>
        {/* Top Mini Score */}
        <div className="sporty-card glow-green" style={{padding: 16, marginBottom: 16}}>
          <div className="flex-between" style={{alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <span className="live-dot" /> <span style={{fontSize: '0.85rem', color: "var(--text-primary)", fontWeight: 'bold'}}>GAMING MATCH SCORING</span>
            </div>
            <button
              onClick={() => {
                setSelectedLiveMatch(liveMatch);
                setCurrentScreen('live_scorecard');
              }}
              className="btn-neon"
              style={{padding: '4px 8px', fontSize: '0.68rem', width: 'auto'}}
            >
              📊 Scorecard
            </button>
          </div>
          <div style={{margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team1}</h3>
              <span className="text-gold" style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Rounds: {liveMatch.rounds1}</span>
            </div>
            <div style={{textAlign: 'center', padding: '0 16px'}}>
              <h2 className="text-gold" style={{fontSize: '2.5rem', fontFamily: 'var(--font-condensed)'}}>{liveMatch.points1} - {liveMatch.points2}</h2>
              <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Current Round Points</span>
            </div>
            <div style={{textAlign: 'center', flex: 1}}>
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)'}}>{liveMatch.team2}</h3>
              <span className="text-gold" style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Rounds: {liveMatch.rounds2}</span>
            </div>
          </div>
        </div>

        {/* Rounds History */}
        {liveMatch.roundScores && liveMatch.roundScores.length > 0 && (
          <div className="sporty-card" style={{padding: 10, marginBottom: 16}}>
            <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4, textTransform: 'uppercase'}}>Round Results</span>
            <div style={{display: 'flex', gap: 8, overflowX: 'auto'}}>
              {liveMatch.roundScores.map((r, idx) => (
                <div key={idx} style={{padding: '4px 8px', backgroundColor: 'var(--bg-secondary)', borderRadius: 6, fontSize: '0.75rem', whiteSpace: 'nowrap'}}>
                  Round {r.round}: <strong>{r.score1} - {r.score2}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scoring Console */}
        <div style={styles.scorerDashboard}>
          <div style={{display: 'flex', gap: 16, marginBottom: 20}}>
            {/* Team 1 scoring buttons */}
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 10}}>
              <h5 style={{color: 'var(--primary)', textAlign: 'center', fontSize: '0.82rem'}}>{liveMatch.team1}</h5>
              <button 
                onClick={() => updateGamingScore(1, 1)}
                className="btn-neon"
                style={{padding: '12px 0', fontSize: '0.9rem'}}
              >
                🎮 +1 POINT
              </button>
              <button 
                onClick={() => updateGamingScore(1, -1)}
                className="btn-outlined"
                style={{padding: '8px 0', fontSize: '0.8rem'}}
              >
                Remove Pt
              </button>
              <button 
                onClick={() => winGamingRound(1)}
                className="btn-outlined"
                style={{padding: '8px 0', fontSize: '0.8rem', borderColor: 'var(--primary)', color: 'var(--primary)'}}
              >
                Win Round
              </button>
            </div>

            {/* Team 2 scoring buttons */}
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 10}}>
              <h5 style={{color: 'var(--secondary)', textAlign: 'center', fontSize: '0.82rem'}}>{liveMatch.team2}</h5>
              <button 
                onClick={() => updateGamingScore(2, 1)}
                className="btn-neon"
                style={{padding: '12px 0', fontSize: '0.9rem', backgroundColor: 'var(--secondary)'}}
              >
                🎮 +1 POINT
              </button>
              <button 
                onClick={() => updateGamingScore(2, -1)}
                className="btn-outlined"
                style={{padding: '8px 0', fontSize: '0.8rem'}}
              >
                Remove Pt
              </button>
              <button 
                onClick={() => winGamingRound(2)}
                className="btn-outlined"
                style={{padding: '8px 0', fontSize: '0.8rem', borderColor: 'var(--secondary)', color: 'var(--secondary)'}}
              >
                Win Round
              </button>
            </div>
          </div>

          <div style={{display: 'flex', gap: 10, marginTop: 10}}>
            <button onClick={undoLastBall} className="btn-outlined" style={{borderColor: 'var(--danger)', color: 'var(--danger)', flex: 1}}>
              UNDO ACTION
            </button>
            <button 
              onClick={async () => {
                const confirm = await showConfirm('End Match', 'Are you sure you want to end this Gaming match?');
                if (confirm) {
                  setLiveMatch(prev => {
                    const updated = { ...prev };
                    updated.isCompleted = true;
                    if (updated.rounds1 > updated.rounds2) {
                      updated.result = `${updated.team1} won the Gaming match ${updated.rounds1} - ${updated.rounds2}!`;
                    } else if (updated.rounds2 > updated.rounds1) {
                      updated.result = `${updated.team2} won the Gaming match ${updated.rounds2} - ${updated.rounds1}!`;
                    } else {
                      updated.result = `Match Finished: ${updated.rounds1} - ${updated.rounds2}`;
                    }
                    return updated;
                  });
                }
              }} 
              className="btn-neon" 
              style={{flex: 1}}
            >
              END MATCH
            </button>
          </div>
          <button
            onClick={async () => {
              const confirm = await showConfirm('Abandon Match', 'Are you sure you want to abandon this match? This will end scoring immediately.');
              if (confirm) {
                setLiveMatch(prev => ({ ...prev, isCompleted: true, isAbandoned: true, result: 'Match Abandoned' }));
              }
            }}
            className="btn-outlined"
            style={{width: '100%', marginTop: 10, borderColor: 'var(--danger)', color: 'var(--danger)', fontWeight: 'bold'}}
          >
            ⚠ ABANDON MATCH
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{...styles.container, padding: 16}}>
      {/* Top Mini Score */}
      <div className="sporty-card" style={{padding: 12, marginBottom: 16}}>
        {(() => {
          const crr = liveMatch.balls > 0 ? ((liveMatch.runs * 6) / liveMatch.balls).toFixed(2) : '0.00';
          const runsNeeded = liveMatch.innings === 2 ? liveMatch.target - liveMatch.runs : 0;
          const ballsRemaining = liveMatch.innings === 2 ? Math.max(0, (liveMatch.maxOvers * 6) - liveMatch.balls) : 0;
          const rrr = liveMatch.innings === 2 ? (ballsRemaining > 0 ? ((runsNeeded * 6) / ballsRemaining).toFixed(2) : '0.00') : null;
          
          return (
            <>
              <div className="flex-between" style={{alignItems: 'center'}}>
                <div>
                  <h4 style={{fontSize: '0.85rem', color: "var(--text-primary)"}}>{liveMatch.team1} vs {liveMatch.team2}</h4>
                  <span style={{fontSize: '0.72rem', color: 'var(--text-muted)'}}>{liveMatch.innings === 1 ? '1st Innings' : `2nd Innings (Target: ${liveMatch.target})`}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <button
                    onClick={() => {
                      setSelectedLiveMatch(liveMatch);
                      setCurrentScreen('live_scorecard');
                    }}
                    className="btn-neon"
                    style={{padding: '4px 8px', fontSize: '0.68rem', width: 'auto'}}
                  >
                    📊 Scorecard
                  </button>
                  <div style={{textAlign: 'right'}}>
                    <h3 className="text-gold">{liveMatch.runs}/{liveMatch.wickets}</h3>
                    <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>({Math.floor(liveMatch.balls / 6)}.{liveMatch.balls % 6} Ov)</span>
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginTop: 8, 
                paddingTop: 8, 
                borderTop: '1px solid rgba(255,255,255,0.04)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)'
              }}>
                <div>
                  <span>CRR: </span>
                  <strong style={{color: 'var(--primary)'}}>{crr}</strong>
                </div>
                {liveMatch.innings === 2 && !liveMatch.isCompleted && (
                  <div style={{textAlign: 'right'}}>
                    <span style={{color: 'var(--primary)', marginRight: 8, fontWeight: 'bold'}}>
                      ⚡ Needs {runsNeeded} runs in {ballsRemaining} balls
                    </span>
                    <span>RRR: </span>
                    <strong style={{color: 'var(--secondary)'}}>{rrr}</strong>
                  </div>
                )}
              </div>
            </>
          );
        })()}
        {liveMatch.toss && (
          <div style={{marginTop: 8, fontSize: '0.72rem', color: 'var(--primary)', fontStyle: 'italic', fontWeight: '500', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 6}}>
            🪙 {liveMatch.toss.text}
          </div>
        )}
        <div style={{marginTop: 8, display: 'flex', gap: 6}}>
          {liveMatch.lastBalls.map((b, i) => (
            <span 
              key={i} 
              style={{
                ...styles.ballCircle,
                width: 22, height: 22, fontSize: '0.7rem',
                backgroundColor: b === 'W' ? 'var(--danger)' : b === '6' ? 'var(--primary)' : b === '4' ? 'var(--primary)' : 'var(--border-light)'
              }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Batters Mini summary */}
      {(() => {
        const activeBatsmen = liveMatch.batting.filter(b => b.isActive);
        const isLastManStanding = activeBatsmen.length === 1;
        return (
          <>
            {isLastManStanding && (
              <div style={{
                padding: '8px 14px',
                marginBottom: 12,
                background: 'linear-gradient(90deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))',
                border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '0.8rem',
                color: '#f87171',
                fontWeight: 'bold'
              }}>
                <span style={{ fontSize: '1.1rem' }}>🏏</span>
                LAST MAN STANDING — Batting solo until overs end
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {activeBatsmen.map(b => {
                const sr = b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : '0.0';
                return (
                  <div key={b.id} className="sporty-card" style={{ flex: 1, padding: 10, borderLeft: b.isStriking ? '3px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex-between" style={{ alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: "var(--text-primary)", fontWeight: b.isStriking ? 'bold' : 'normal' }}>
                        {b.name}{b.isStriking ? '*' : ''}
                      </span>
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                        <span className="text-gold" style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{b.runs} ({b.balls})</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SR: {sr}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        );
      })()}


      {/* Active Bowler Display */}
      {liveMatch.bowling && liveMatch.bowling.find(b => b.isActive) && (() => {
        const activeBowler = liveMatch.bowling.find(b => b.isActive);
        return (
          <div className="sporty-card glow-gold" style={{padding: 12, marginBottom: 16, borderLeft: '3px solid var(--secondary)'}}>
            <div className="flex-between" style={{alignItems: 'center'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                <span style={{fontSize: '1.2rem'}}>⚾</span>
                <div>
                  <span style={{fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block'}}>Active Bowler</span>
                  <span style={{fontSize: '0.85rem', color: "var(--text-primary)", fontWeight: 'bold'}}>{activeBowler.name}</span>
                </div>
              </div>
              <div style={{textAlign: 'right', display: 'flex', flexDirection: 'column'}}>
                <span className="text-gold" style={{fontSize: '0.85rem', fontWeight: 'bold'}}>
                  {activeBowler.overs} Ov · {activeBowler.runs} R · {activeBowler.wickets} Wkts
                </span>
                <span style={{fontSize: '0.7rem', color: 'var(--text-muted)'}}>
                  Econ: {activeBowler.economy}
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Scorer inputs */}
      <div style={styles.scorerDashboard}>
        <div style={{marginBottom: 10, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>Runs Inputs</div>
        <div style={styles.scorerGrid}>
          {[0, 1, 2, 3].map(r => (
            <button 
              key={r} 
              onClick={() => handleScoreClick(r)} 
              className="score-btn-box"
              style={styles.scoreButton}
            >
              {r}
            </button>
          ))}
        </div>

        <div style={{margin: '14px 0 10px 0', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>Boundaries</div>
        <div style={styles.scorerGrid}>
          <button onClick={() => handleScoreClick(4)} style={{...styles.scoreButton, backgroundColor: 'var(--primary)', color: '#FFF'}}>4</button>
          <button onClick={() => handleScoreClick(6)} style={{...styles.scoreButton, backgroundColor: 'var(--secondary)', color: '#FFF'}}>6</button>
        </div>

        <div style={{margin: '14px 0 10px 0', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-heading)'}}>Extras & Wickets</div>
        <div style={styles.scorerGrid}>
          <button onClick={() => handleExtraClick('WD')} style={{...styles.scoreButton, backgroundColor: 'var(--bg-primary)', color: 'var(--primary)', border: '1px solid var(--primary)'}}>WD</button>
          <button onClick={() => handleExtraClick('NB')} style={{...styles.scoreButton, backgroundColor: 'var(--bg-primary)', color: 'var(--primary)', border: '1px solid var(--primary)'}}>NB</button>
          <button 
            onClick={handleWicket} 
            disabled={liveMatch.batting.filter(b => b.isActive).length <= 1}
            style={{
              ...styles.scoreButton, 
              backgroundColor: liveMatch.batting.filter(b => b.isActive).length <= 1 ? 'rgba(239,68,68,0.3)' : 'var(--danger)', 
              color: "#FFF", 
              gridColumn: "span 2",
              opacity: liveMatch.batting.filter(b => b.isActive).length <= 1 ? 0.5 : 1,
              cursor: liveMatch.batting.filter(b => b.isActive).length <= 1 ? 'not-allowed' : 'pointer'
            }}
          >
            {liveMatch.batting.filter(b => b.isActive).length <= 1 ? '🏏 LAST MAN (No more wickets)' : '🛑 WICKET'}
          </button>
        </div>

        {liveMatch.innings === 1 && liveMatch.firstInningsCompleted ? (
          <button 
            onClick={endFirstInnings} 
            className="btn-neon" 
            style={{width: '100%', marginTop: 20, backgroundColor: 'var(--secondary)', color: '#FFF'}}
          >
            START 2ND INNINGS ⚡
          </button>
        ) : (
          <div style={{display: 'flex', gap: 10, marginTop: 20}}>
            <button onClick={undoLastBall} className="btn-outlined" style={{borderColor: 'var(--danger)', color: 'var(--danger)', flex: 1}}>
              UNDO BALL
            </button>
            {liveMatch.innings === 1 ? (
              <button 
                onClick={async () => { 
                  const confirm = await showConfirm('End Innings', 'Do you want to end the 1st Innings and start the 2nd Innings?');
                  if (confirm) endFirstInnings();
                }} 
                className="btn-neon" 
                style={{flex: 1}}
              >
                END INNINGS
              </button>
            ) : (
              <button 
                onClick={async () => { 
                  const confirm = await showConfirm('End Match', 'Are you sure you want to end this match?');
                  if (confirm) {
                    setLiveMatch(prev => ({ ...prev, isCompleted: true }));
                  }
                }} 
                className="btn-neon" 
                style={{flex: 1}}
              >
                END MATCH
              </button>
            )}
          </div>
        )}
        <button
          onClick={async () => {
            const confirm = await showConfirm('Abandon Match', 'Are you sure you want to abandon this match? This will end scoring immediately.');
            if (confirm) {
              setLiveMatch(prev => ({ ...prev, isCompleted: true, isAbandoned: true, result: 'Match Abandoned' }));
            }
          }}
          className="btn-outlined"
          style={{width: '100%', marginTop: 16, borderColor: 'var(--danger)', color: 'var(--danger)', fontWeight: 'bold'}}
        >
          ⚠ ABANDON MATCH
        </button>
      </div>

      {/* WICKET TYPE SELECTION MODAL */}
      {showWicketModal && (
        <div style={styles.modalOverlay}>
          <div className="sporty-card glow-green" style={{width: '90%', maxWidth: 400, padding: 24, textAlign: 'center', backgroundColor: 'var(--bg-surface-solid)', border: '2px solid var(--primary)'}}>
            <h3 style={{fontFamily: 'var(--font-condensed)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 16}}>SELECT WICKET TYPE</h3>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20}}>
              {['Bowled', 'Caught', 'LBW', 'Stumped', 'Run Out', 'Caught Behind'].map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setShowWicketModal(false);
                    if (type === 'Caught' || type === 'Run Out' || type === 'Caught Behind') {
                      setPendingWicketType(type);
                      setCustomFielderName('');
                    } else {
                      logBall('W', 0, type);
                    }
                  }}
                  className="btn-outlined"
                  style={{padding: '12px 6px', fontSize: '0.85rem', fontWeight: 'bold', width: 'auto'}}
                >
                  {type}
                </button>
              ))}
            </div>
            <button onClick={() => setShowWicketModal(false)} className="btn-outlined" style={{borderColor: 'var(--danger)', color: 'var(--danger)', width: '100%', padding: '10px 0'}}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* FIELDER SELECTION MODAL FOR CAUGHT, RUN OUT, CAUGHT BEHIND */}
      {pendingWicketType && (
        <div style={styles.modalOverlay}>
          <div className="sporty-card glow-green" style={{width: '90%', maxWidth: 450, padding: 24, textAlign: 'center', backgroundColor: 'var(--bg-surface-solid)', border: '2px solid var(--primary)'}}>
            <h3 style={{fontFamily: 'var(--font-condensed)', fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: 8}}>
              {pendingWicketType === 'Caught' && 'SELECT PLAYER WHO TOOK THE CATCH 🤲'}
              {pendingWicketType === 'Caught Behind' && 'SELECT PLAYER WHO CAUGHT BEHIND 🧤'}
              {pendingWicketType === 'Run Out' && 'SELECT PLAYER WHO THREW THE BALL 🎯'}
            </h3>
            <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 16}}>
              Choose a fielder from the team roster below or enter a custom name.
            </p>
            
            {/* Fielding Team Roster List */}
            <div className="scroll-elegant" style={{display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflowY: 'auto', marginBottom: 16, paddingRight: 4}}>
              {liveMatch.bowling && liveMatch.bowling.map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    logBall('W', 0, pendingWicketType, f.name);
                    setPendingWicketType(null);
                  }}
                  className="btn-outlined"
                  style={{padding: '10px 12px', fontSize: '0.85rem', fontWeight: 'bold', width: '100%', textAlign: 'left'}}
                >
                  🏃 {f.name}
                </button>
              ))}
              {(!liveMatch.bowling || liveMatch.bowling.length === 0) && (
                <div style={{fontSize: '0.8rem', color: 'var(--text-muted)', padding: 12}}>No players registered in the fielding team</div>
              )}
            </div>
            
            {/* Custom/Substitute Input */}
            <div style={{borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, marginBottom: 20}}>
              <label style={{fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', textAlign: 'left', marginBottom: 6, fontWeight: 600}}>
                SUBSTITUTE / OTHER FIELDER:
              </label>
              <div style={{display: 'flex', gap: 8}}>
                <input
                  type="text"
                  placeholder="Type fielder name..."
                  value={customFielderName}
                  onChange={(e) => setCustomFielderName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    width: 'auto',
                    padding: '10px 12px',
                    fontSize: '0.85rem',
                    border: '1px solid var(--border-light)',
                    borderRadius: 8,
                    background: 'var(--bg-surface-solid)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-body)',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  onClick={() => {
                    if (customFielderName.trim()) {
                      logBall('W', 0, pendingWicketType, customFielderName.trim());
                      setPendingWicketType(null);
                    }
                  }}
                  className="btn-neon"
                  style={{padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center'}}
                  disabled={!customFielderName.trim()}
                >
                  Confirm
                </button>
              </div>
            </div>

            {/* Modal Controls */}
            <div style={{display: 'flex', gap: 10}}>
              <button
                onClick={() => {
                  logBall('W', 0, pendingWicketType, null);
                  setPendingWicketType(null);
                }}
                className="btn-outlined"
                style={{borderColor: 'var(--text-muted)', color: 'var(--text-muted)', flex: 1, padding: '10px 0', fontSize: '0.85rem'}}
              >
                Skip Fielder
              </button>
              <button
                onClick={() => {
                  setPendingWicketType(null);
                  setShowWicketModal(true);
                }}
                className="btn-outlined"
                style={{borderColor: 'var(--danger)', color: 'var(--danger)', flex: 1, padding: '10px 0', fontSize: '0.85rem'}}
              >
                Cancel / Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOWLER SELECTION MODAL AT END OF OVER */}
      {liveMatch && !liveMatch.isCompleted && !liveMatch.firstInningsCompleted && liveMatch.balls > 0 && liveMatch.balls % 6 === 0 && liveMatch.bowling.every(b => !b.isActive) && (
        <div style={styles.modalOverlay}>
          <div className="sporty-card glow-green" style={{width: '90%', maxWidth: 400, padding: 24, textAlign: 'center', backgroundColor: 'var(--bg-surface-solid)', border: '2px solid var(--primary)'}}>
            <h3 style={{fontFamily: 'var(--font-condensed)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 8}}>OVER COMPLETED ⚾</h3>
            <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 16}}>
              Select the next bowler for the upcoming over.
            </p>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto', marginBottom: 20}}>
              {liveMatch.bowling.map(b => {
                const completedOvers = Math.floor(parseFloat(b.overs) || 0);
                let isRestricted = false;
                let restrictionReason = '';

                // Check for max overs rule
                if (liveMatch.maxBowlerOvers && liveMatch.maxBowlerOversLimitCount) {
                  if (completedOvers >= liveMatch.maxBowlerOvers) {
                    isRestricted = true;
                    restrictionReason = `Max ${liveMatch.maxBowlerOvers} overs reached`;
                  } else if (completedOvers === liveMatch.maxBowlerOvers - 1) {
                    const bowlersReachedMax = liveMatch.bowling.filter(bowler => 
                      Math.floor(parseFloat(bowler.overs) || 0) >= liveMatch.maxBowlerOvers
                    ).length;
                    if (bowlersReachedMax >= liveMatch.maxBowlerOversLimitCount) {
                      isRestricted = true;
                      restrictionReason = `Limit of ${liveMatch.maxBowlerOversLimitCount} bowlers reaching ${liveMatch.maxBowlerOvers} overs met`;
                    }
                  }
                }

                // Check for consecutive overs rule (alternate overs)
                const lastOverIndex = (liveMatch.balls / 6) - 1;
                const lastOver = liveMatch.oversHistory?.[lastOverIndex];
                const isLastBowler = lastOver && (lastOver.bowlerId === b.id || lastOver.bowlerName === b.name);
                if (isLastBowler) {
                  isRestricted = true;
                  restrictionReason = `Cannot bowl consecutive overs`;
                }

                return (
                  <button
                    key={b.id}
                    onClick={async () => {
                      if (isRestricted) {
                        const message = isLastBowler
                          ? `⚠️ ${b.name} cannot bowl consecutive overs. A bowler must bowl alternate overs.`
                          : (completedOvers >= liveMatch.maxBowlerOvers
                            ? `⚠️ ${b.name} has already bowled their maximum limit of ${liveMatch.maxBowlerOvers} overs in this match and cannot bowl any more.`
                            : `⚠️ ${b.name} cannot bowl this over. The limit of ${liveMatch.maxBowlerOversLimitCount} bowlers allowed to bowl ${liveMatch.maxBowlerOvers} overs has already been reached.`);
                        await showError('Bowler Restricted', message);
                        return;
                      }
                      setLiveMatch(prev => {
                        const updated = { ...prev };
                        updated.bowling = updated.bowling.map(bow => ({
                          ...bow,
                          isActive: bow.id === b.id
                        }));
                        return updated;
                      });
                    }}
                    className="btn-outlined"
                    style={{
                      padding: '10px 12px', 
                      fontSize: '0.85rem', 
                      fontWeight: 'bold', 
                      textAlign: 'left', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      width: '100%',
                      opacity: isRestricted ? 0.6 : 1,
                      cursor: isRestricted ? 'not-allowed' : 'pointer',
                      borderColor: isRestricted ? 'var(--danger)' : 'var(--border)'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{b.name}</span>
                      {isRestricted && (
                        <span style={{ color: 'var(--danger)', fontSize: '0.7rem', fontWeight: 'normal', marginTop: 2 }}>
                          ⚠️ {restrictionReason}
                        </span>
                      )}
                    </div>
                    <span style={{color: 'var(--text-muted)', fontSize: '0.75rem', alignSelf: 'center'}}>
                      {b.overs} Ov · {b.runs} R · {b.wickets} Wkts (Econ: {b.economy})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FIRST INNINGS COMPLETED OVERLAY MODAL */}
      {liveMatch && liveMatch.innings === 1 && liveMatch.firstInningsCompleted && (
        <div style={{
          ...styles.modalOverlay,
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(15, 23, 42, 0.85)'
        }}>
          <div 
            className="sporty-card glow-gold innings-modal-entrance" 
            style={{
              width: '90%', 
              maxWidth: 400, 
              padding: 28, 
              textAlign: 'center', 
              backgroundColor: 'var(--bg-surface-solid)', 
              border: '2px solid #FFD700',
              borderRadius: '16px'
            }}
          >
            {/* Animated Header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '3rem', marginBottom: 10, animation: 'logoRedPulse 2s infinite ease-in-out' }}>🏏</div>
              <h2 style={{ 
                fontFamily: 'var(--font-condensed)', 
                fontSize: '2.2rem', 
                color: '#FFD700', 
                letterSpacing: '1px',
                margin: '0 0 4px 0',
                textShadow: '0 0 10px rgba(255,215,0,0.3)' 
              }}>
                {liveMatch.wickets >= liveMatch.batting.length - 1 ? 'ALL OUT!' : `${liveMatch.maxOvers} OVERS COMPLETED!`}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                1st Innings has come to an end.
              </p>
            </div>

            {/* Score Recap Card */}
            <div style={{ 
              backgroundColor: 'rgba(255, 215, 0, 0.05)', 
              border: '1px solid rgba(255, 215, 0, 0.2)', 
              borderRadius: '12px', 
              padding: '16px 20px', 
              marginBottom: 24 
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 4 }}>
                {liveMatch.team1} Score
              </span>
              <h1 style={{ fontSize: '3rem', color: 'var(--text-primary)', margin: 0, fontFamily: 'Teko', letterSpacing: '1px', lineHeight: 1 }}>
                {liveMatch.runs}/{liveMatch.wickets}
              </h1>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                in {Math.floor(liveMatch.balls / 6)}.{liveMatch.balls % 6} Overs
              </span>
              
              <div style={{ borderTop: '1px dashed rgba(255, 215, 0, 0.3)', marginTop: 12, paddingTop: 12 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Target for {liveMatch.team2}:</span>
                <h3 style={{ fontSize: '1.8rem', color: '#FFD700', margin: '4px 0 0 0', fontFamily: 'Teko', letterSpacing: '0.5px' }}>
                  🎯 {liveMatch.runs + 1} Runs
                </h3>
              </div>
            </div>

            {/* Call to Action Button */}
            <button
              onClick={endFirstInnings}
              className="btn-neon innings-button-pulse"
              style={{
                width: '100%',
                backgroundColor: '#FFD700',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                padding: '14px 24px',
                border: 'none',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)'
              }}
            >
              START 2ND INNINGS ⚡
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   7. VENUE OWNER / ADMIN DASHBOARD (WITH VISUAL CALENDAR)
   ========================================================================== */
function OwnerDashboardView() {
  const { setCurrentScreen, bookings, venues, selectedVenueId, setSelectedVenueId, playerId, bookSlot, cancelBooking, completedMatches, setSelectedCompletedMatch, showAlert, showError, showConfirm, showPrompt, paymentStatus, setShowPayModal, subscriptionExpiry, subscriptionPlan } = useAppState();

  const [activeTab, setActiveTab] = useState('slots');
  
  const getFormatMonthYear = (dateObj) => {
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    return `${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  };
  const [currentMonth, setCurrentMonth] = useState(() => getFormatMonthYear(new Date()));
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);

  React.useEffect(() => {
    if (paymentStatus === 'active' && subscriptionExpiry) {
      const expiryDate = new Date(subscriptionExpiry);
      const diffTime = expiryDate - new Date();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (daysRemaining === 3 || daysRemaining === 1) {
        const lastAlertShownFor = sessionStorage.getItem('expiry_alert_shown');
        if (lastAlertShownFor !== daysRemaining.toString()) {
          showAlert(
            'Subscription Expiring Soon ⚠️',
            `Your SportSpot Premium subscription expires in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}. Please renew soon to prevent your venues from being hidden from players.`
          );
          sessionStorage.setItem('expiry_alert_shown', daysRemaining.toString());
        }
      }
    }
  }, [paymentStatus, subscriptionExpiry]);

  // Helper to parse currentMonth and calculate initial day / passed dates
  const parseCalendarDate = (day = 1) => {
    const today = new Date();
    const [monthName, yearStr] = currentMonth.split(' ');
    const year = parseInt(yearStr) || today.getFullYear();
    const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    const monthIndex = months.findIndex(m => m.startsWith(monthName.toUpperCase()));
    const targetMonth = monthIndex !== -1 ? monthIndex : today.getMonth();
    return { today, year, targetMonth, cellDate: new Date(year, targetMonth, day) };
  };

  const getInitialDay = () => {
    const { today, year, targetMonth } = parseCalendarDate();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === targetMonth;
    return isCurrentMonth ? today.getDate() : 1;
  };

  const isDatePassed = (day) => {
    const { today, cellDate } = parseCalendarDate(day);
    const todayReset = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return cellDate < todayReset;
  };

  const [selectedDay, setSelectedDay] = useState(getInitialDay);

  const getMonthAbbrAndYear = () => {
    const [monthName, yearStr] = currentMonth.split(' ');
    const monthsFull = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    const monthsAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = monthsFull.findIndex(m => m.startsWith(monthName.toUpperCase()));
    const targetAbbr = monthIndex !== -1 ? monthsAbbr[monthIndex] : 'May';
    return { monthAbbr: targetAbbr, year: yearStr || '2026' };
  };
  const { monthAbbr, year: calendarYear } = getMonthAbbrAndYear();

  const isOwnerSlotInPast = (slotTimeRange) => {
    const { today, cellDate } = parseCalendarDate(selectedDay);
    const todayReset = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // If selected day is in the past
    if (cellDate < todayReset) {
      return true;
    }
    
    // If selected day is in the future
    if (cellDate > todayReset) {
      return false;
    }
    
    // If selected day is today, check slot time
    const startStr = slotTimeRange.split(' - ')[0];
    const [timePart, ampm] = startStr.split(' ');
    let [hourStr, minStr] = timePart.split(':');
    let hour = parseInt(hourStr);
    const minutes = parseInt(minStr) || 0;
    
    if (ampm === 'PM' && hour !== 12) {
      hour += 12;
    } else if (ampm === 'AM' && hour === 12) {
      hour = 0;
    }
    
    const slotDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, minutes);
    return slotDateTime < today;
  };

  // Range selection states for Venue Owner
  const [ownerStartSlot, setOwnerStartSlot] = useState(null);
  const [ownerEndSlot, setOwnerEndSlot] = useState(null);

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const ownerVenues = venues.filter(v => v.ownerId === playerId);
  const ownerVenue = ownerVenues.find(v => v.id === selectedVenueId) || ownerVenues[0];
  const ownerSlots = ownerVenue?.timeSlots || [];

  const venueBookings = bookings.filter(b => ownerVenue && b.venueId === ownerVenue.id);
  const venueCompletedMatches = completedMatches.filter(m => ownerVenue && m.venue === ownerVenue.name);

  const getBookingDot = (day) => {
    // Only return dots if bookings list contains items for this day and venue
    const dayBookings = venueBookings.filter(b => b.date === `${day} ${monthAbbr} ${calendarYear}`);
    if (dayBookings.length > 0) return 'green';
    return null;
  };

  const selectedDayBookings = venueBookings.filter(b => b.date === `${selectedDay} ${monthAbbr} ${calendarYear}`);

  // Helper variables for range selection
  const ownerStartIdx = ownerVenue && ownerStartSlot ? ownerSlots.findIndex(s => s.time === ownerStartSlot) : -1;
  const ownerEndIdx = ownerVenue && ownerEndSlot ? ownerSlots.findIndex(s => s.time === ownerEndSlot) : ownerStartIdx;

  const isOwnerSelected = (slotTime) => {
    if (!ownerStartSlot) return false;
    const idx = ownerSlots.findIndex(s => s.time === slotTime);
    return idx >= ownerStartIdx && idx <= ownerEndIdx;
  };

  const selectedOwnerSlots = (ownerVenue && ownerStartIdx !== -1) ? ownerSlots.slice(ownerStartIdx, ownerEndIdx + 1) : [];
  const ownerDuration = selectedOwnerSlots.length;
  const selectedOwnerSlotTimes = selectedOwnerSlots.map(s => s.time);

  // Check if range contains any booked slot
  const ownerHasConflict = ownerVenue ? selectedOwnerSlots.some(s => 
    bookings.some(b => b.venueId === ownerVenue.id && b.date === `${selectedDay} ${monthAbbr} ${calendarYear}` && b.timeSlot === s.time)
  ) : false;

  const handleOwnerSlotClick = (slotTime) => {
    const isBooked = bookings.some(b => b.venueId === ownerVenue.id && b.date === `${selectedDay} ${monthAbbr} ${calendarYear}` && b.timeSlot === slotTime);
    const passed = isOwnerSlotInPast(slotTime);
    if (isBooked || passed) return;

    if (!ownerStartSlot || (ownerStartSlot && ownerEndSlot)) {
      setOwnerStartSlot(slotTime);
      setOwnerEndSlot(null);
    } else {
      const clickIdx = ownerSlots.findIndex(s => s.time === slotTime);
      if (clickIdx < ownerStartIdx) {
        setOwnerStartSlot(slotTime);
        setOwnerEndSlot(null);
      } else if (clickIdx === ownerStartIdx) {
        setOwnerStartSlot(null);
        setOwnerEndSlot(null);
      } else {
        setOwnerEndSlot(slotTime);
      }
    }
  };

  if (!ownerVenue) {
    return (
      <div style={{...styles.container, padding: 16, justifyContent: 'center', alignItems: 'center'}}>
        <div className="sporty-card" style={{textAlign: 'center', padding: 24}}>
          <span style={{fontSize: '2.5rem'}}>🏟️</span>
          <h3 style={{color: "var(--text-primary)", marginTop: 12}}>No Arena Registered</h3>
          <p style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 6}}>
            Go to the **My Arena** tab to register your sports venue and unlock slot management!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{...styles.container, padding: 16}}>
      {/* Premium Subscription Status Header/Banner */}
      {paymentStatus === 'active' ? (
        <>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            marginBottom: 16,
            alignSelf: 'flex-start'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.75rem',
              color: 'var(--primary)',
              fontWeight: 700,
              backgroundColor: 'rgba(170, 255, 0, 0.08)',
              padding: '6px 12px',
              borderRadius: 20,
              border: '1px solid rgba(170, 255, 0, 0.2)',
              alignSelf: 'flex-start'
            }}>
              <span>🛡️ PREMIUM ACTIVE {subscriptionPlan ? `(${subscriptionPlan})` : ''}</span>
            </div>
            {subscriptionExpiry && (
              <span style={{fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, paddingLeft: 4}}>
                Expires: {new Date(subscriptionExpiry).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            )}
            <button 
              onClick={() => setShowPayModal(true)} 
              className="btn-outlined" 
              style={{
                padding: '4px 12px', 
                fontSize: '0.7rem', 
                marginTop: 4, 
                alignSelf: 'flex-start',
                borderColor: 'rgba(170, 255, 0, 0.4)',
                color: 'var(--primary)',
                borderRadius: 6,
                background: 'rgba(170,255,0,0.02)'
              }}
            >
              Extend / Upgrade Subscription ⚡
            </button>
          </div>
          {subscriptionExpiry && (() => {
            const expiryDate = new Date(subscriptionExpiry);
            const diffTime = expiryDate - new Date();
            const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (daysRemaining <= 5 && daysRemaining > 0) {
              return (
                <div className="sporty-card glow-gold" style={{
                  padding: '12px 16px',
                  marginBottom: '20px',
                  background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.08) 0%, rgba(0, 0, 0, 0.3) 100%)',
                  border: '1px solid #D97706',
                  borderRadius: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 4px 15px rgba(217, 119, 6, 0.1)'
                }}>
                  <div>
                    <h4 style={{color: '#F59E0B', fontSize: '0.85rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-label)'}}>⚠️ SUBSCRIPTION EXPIRES IN {daysRemaining} DAY{daysRemaining > 1 ? 'S' : ''}</h4>
                    <p style={{color: 'var(--text-muted)', fontSize: '0.72rem', margin: '2px 0 0 0'}}>
                      Renew now to ensure uninterrupted listing visibility for players.
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowPayModal(true)} 
                    className="btn-neon" 
                    style={{
                      padding: '6px 12px', 
                      fontSize: '0.72rem', 
                      fontWeight: 'bold', 
                      background: '#D97706', 
                      borderColor: '#D97706', 
                      color: '#FFF',
                      cursor: 'pointer'
                    }}
                  >
                    RENEW NOW ⚡
                  </button>
                </div>
              );
            }
            return null;
          })()}
        </>
      ) : (
        <div className="sporty-card glow-green" style={{
          padding: '16px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, rgba(170, 255, 0, 0.04) 0%, rgba(0, 0, 0, 0.3) 100%)',
          border: '1.5px solid var(--primary)',
          borderRadius: 14,
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(170, 255, 0, 0.1)'
        }}>
          <span style={{fontSize: '2rem', display: 'block', marginBottom: 4}}>⚡</span>
          <h3 style={{color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-label)'}}>Premium Subscription Inactive</h3>
          <p style={{color: 'var(--text-muted)', fontSize: '0.8rem', margin: '6px 0 12px 0', lineHeight: 1.4}}>
            Venues under your account are currently hidden from players. Subscribe to a premium plan to list your venues and enable bookings.
          </p>
          <button 
            onClick={() => setShowPayModal(true)} 
            className="btn-neon" 
            style={{padding: '8px 20px', fontSize: '0.85rem', fontWeight: 'bold'}}
          >
            SUBSCRIBE NOW 🚀
          </button>
        </div>
      )}
      {/* ARENA SELECTOR (For owners with multiple arenas) */}
      {ownerVenues.length > 1 && (
        <div className="sporty-card glow-green" style={{marginBottom: 16, padding: 12}}>
          <label style={{fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6, fontWeight: 600}}>
            Managing Arena
          </label>
          <select
            value={selectedVenueId || ''}
            onChange={(e) => setSelectedVenueId(e.target.value)}
            className="form-input"
            style={{width: '100%', padding: '10px', fontSize: '0.9rem', fontWeight: 600, border: '1px solid var(--primary)', borderRadius: 8, background: 'var(--bg-primary)', color: 'var(--text-primary)'}}
          >
            {ownerVenues.map(v => (
              <option key={v.id} value={v.id}>🏟️ {v.name} ({v.address})</option>
            ))}
          </select>
        </div>
      )}

      {/* Revenue Mini Stats */}
      <div style={styles.statsCardGrid}>
        <div className="sporty-card glow-green" style={{padding: 10, flex: 1}}>
          <span style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>TOTAL BOOKINGS</span>
          <h3 style={{fontSize: '1.3rem', color: 'var(--primary)'}}>{venueBookings.length}</h3>
        </div>
        <div className="sporty-card" style={{padding: 10, flex: 1, borderColor: 'var(--primary)'}}>
          <span style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>MATCHES PLAYED</span>
          <h3 style={{fontSize: '1.3rem', color: 'var(--primary)'}}>{venueCompletedMatches.length}</h3>
        </div>
        <div className="sporty-card glow-gold" style={{padding: 10, flex: 1}}>
          <span style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>TOTAL REVENUE</span>
          <h3 style={{fontSize: '1.3rem', color: 'var(--primary)'}}>₹{venueBookings.reduce((sum, b) => sum + b.amountPaid, 0)}</h3>
        </div>
      </div>


      {/* VISUAL CALENDAR VIEW */}
      <div className="sporty-card" style={{marginTop: 16, padding: 12}}>
        <div className="flex-between" style={{marginBottom: 12}}>
          <h4 style={{fontSize: '0.95rem'}}>{currentMonth}</h4>
          <span style={{fontSize: '0.75rem', color: 'var(--primary)'}}>Schedule calendar</span>
        </div>
        
        <div style={styles.calendarDayGrid}>
          {['S','M','T','W','T','F','S'].map((w, index) => (
            <span key={index} style={styles.calendarWeekday}>{w}</span>
          ))}
          {daysInMonth.map(day => {
            const dot = getBookingDot(day);
            const isSelected = selectedDay === day;
            const passed = isDatePassed(day);
            return (
              <div 
                key={day} 
                onClick={() => { 
                  if (passed) return;
                  setSelectedDay(day); 
                  setOwnerStartSlot(null); 
                  setOwnerEndSlot(null); 
                  setIsSlotModalOpen(true);
                }}
                style={{
                  ...styles.calendarDayCell,
                  backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                  color: isSelected ? '#FFFFFF' : passed ? 'rgba(0, 0, 0, 0.25)' : 'var(--text-primary)',
                  cursor: passed ? 'not-allowed' : 'pointer',
                  opacity: passed ? 0.4 : 1
                }}
              >
                <span>{day}</span>
                {dot && (
                  <span style={{
                    ...styles.calendarDot,
                    backgroundColor: isSelected ? '#FFFFFF' : 'var(--primary)',
                    opacity: passed ? 0.4 : 1
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MATCH HISTORY PLAYED ON BOX */}
      <div style={{marginTop: 24}}>
        <h4 style={{fontSize: '1rem', color: 'var(--primary)', marginBottom: 12}}>🏆 MATCH HISTORY ({venueCompletedMatches.length})</h4>
        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          {venueCompletedMatches.length > 0 ? (
            venueCompletedMatches.map(m => (
              <div 
                key={m.id} 
                onClick={() => {
                  setSelectedCompletedMatch(m);
                  setCurrentScreen('live_scorecard');
                }}
                className="sporty-card" 
                style={{
                  padding: 16, 
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div className="flex-between" style={{borderBottom: '1px solid #F3F4F6', paddingBottom: 8, marginBottom: 8}}>
                  <span style={{fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500}}>
                    {m.sport || 'Cricket'} · {m.venue || 'Local Arena'}
                  </span>
                  <span style={{fontSize: '0.68rem', color: 'var(--text-muted)'}}>{m.date || 'Completed'}</span>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0'}}>
                  <div className="flex-between">
                    <span style={{fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)'}}>{m.team1}</span>
                    <span style={{fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)'}}>
                      {m.runs !== undefined ? `${m.runs}/${m.wickets || 0} (${Math.floor(m.balls/6)}.${m.balls%6} Ov)` : m.goals1 !== undefined ? m.goals1 : ''}
                    </span>
                  </div>
                  <div className="flex-between">
                    <span style={{fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)'}}>{m.team2}</span>
                    <span style={{fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)'}}>
                      {m.team2Runs !== undefined ? `${m.team2Runs}/${m.team2Wickets || 0} (${Math.floor(m.team2Balls/6)}.${m.team2Balls%6} Ov)` : m.goals2 !== undefined ? m.goals2 : ''}
                    </span>
                  </div>
                </div>

                {m.result && (
                  <p style={{fontSize: '0.72rem', color: '#10B981', fontWeight: 'bold', marginTop: 4}}>
                    🏆 {m.result}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="sporty-card" style={{padding: 16, textAlign: 'center'}}>
              <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>No matches played on your box turf yet. Setup and launch a match!</p>
            </div>
          )}
        </div>
      </div>

      {/* Centered Modal Slot Selector */}
      {isSlotModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: 16,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="sporty-card glow-green" style={{
            width: '100%',
            maxWidth: '480px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            padding: 20,
            overflow: 'auto',
            backgroundColor: 'var(--bg-surface-solid)',
            border: '2px solid var(--primary)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Modal Header */}
            <div className="flex-between" style={{borderBottom: '1px solid var(--border-light)', paddingBottom: 10, flexShrink: 0}}>
              <div>
                <h3 style={{fontSize: '1.2rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)', letterSpacing: '0.5px'}}>
                  🏟️ SLOT MANAGER - {selectedDay} {monthAbbr.toUpperCase()}
                </h3>
                <span style={{fontSize: '0.68rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)'}}>Tap Start Slot → Tap End Slot to select range</span>
              </div>
              <button 
                onClick={() => {
                  setIsSlotModalOpen(false);
                  setOwnerStartSlot(null);
                  setOwnerEndSlot(null);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '1.5rem',
                  lineHeight: 1,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '50%',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                &times;
              </button>
            </div>

            {/* Slots Scrollable List */}
            <div className="scroll-elegant" style={{overflowY: 'auto', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 4, margin: '8px 0'}}>
              {ownerSlots.map(s => {
                const isStart = s.time === ownerStartSlot;
                const isEnd = s.time === ownerEndSlot;
                const isMiddle = ownerStartSlot && ownerEndSlot && isOwnerSelected(s.time) && !isStart && !isEnd;
                const booking = bookings.find(b => b.venueId === ownerVenue.id && b.date === `${selectedDay} ${monthAbbr} ${calendarYear}` && b.timeSlot === s.time);
                const isActive = isStart || isEnd || isMiddle;
                const passed = isOwnerSlotInPast(s.time);
                const isDisabled = booking || passed;

                return (
                  <div 
                    key={s.time} 
                    onClick={() => {
                      if (isDisabled) return;
                      handleOwnerSlotClick(s.time);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      border: '1px solid',
                      borderColor: isStart || isEnd ? 'var(--primary)' : isMiddle ? 'rgba(220, 38, 38, 0.3)' : booking ? 'rgba(220, 38, 38, 0.2)' : 'var(--border-light)',
                      background: isStart || isEnd ? 'rgba(220, 38, 38, 0.06)' : isMiddle ? 'rgba(220, 38, 38, 0.03)' : booking ? 'rgba(220, 38, 38, 0.02)' : passed ? 'rgba(255,255,255,0.02)' : 'var(--bg-surface-solid)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      opacity: passed && !booking ? 0.5 : 1,
                      textDecoration: passed && !booking ? 'line-through' : 'none'
                    }}
                  >
                    <div className="flex-between">
                      <div style={{display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start'}}>
                        <span 
                          style={{
                            fontWeight: '700', 
                            fontSize: '0.98rem', 
                            fontFamily: 'var(--font-body)',
                            lineHeight: '1.4',
                            color: isStart || isEnd ? 'var(--primary)' : 'var(--text-primary)'
                          }}
                        >
                          {s.time}
                        </span>
                        <div style={{display: 'flex', gap: 6, alignItems: 'center'}}>
                          <span 
                            style={{
                              fontSize: '0.68rem', 
                              padding: '3px 8px', 
                              borderRadius: 4,
                              fontWeight: 'bold',
                              fontFamily: 'var(--font-body)',
                              letterSpacing: '0.5px',
                              backgroundColor: booking ? '#FEE2E2' : passed ? 'rgba(255,255,255,0.06)' : isActive ? 'rgba(220, 38, 38, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                              color: booking ? 'var(--danger)' : passed ? 'var(--text-muted)' : isActive ? 'var(--primary)' : 'var(--text-secondary)'
                            }}
                          >
                            {booking ? 'BOOKED' : passed ? 'PASSED' : isActive ? 'SELECTED' : 'AVAILABLE'}
                          </span>
                          {booking && (
                            <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)'}}>
                              Customer: {booking.customerName}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        {booking && (
                          <button 
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (await showConfirm('Release Slot', `Are you sure you want to release the booking for ${s.time}?`)) {
                                cancelBooking(booking.id);
                              }
                            }}
                            className="btn-outlined" 
                            style={{borderColor: 'var(--danger)', color: 'var(--danger)', padding: '6px 12px', fontSize: '0.75rem', width: 'auto', fontFamily: 'var(--font-body)'}}
                          >
                            Release 🔓
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Bar (Sticky inside Modal bottom when range selected) */}
            {ownerStartSlot && (
              <div className="sporty-card glow-green" style={{
                border: '1px solid var(--primary)',
                backgroundColor: 'var(--bg-primary)',
                padding: 12,
                borderRadius: 8,
                marginTop: 8,
                flexShrink: 0
              }}>
                <div className="flex-between" style={{marginBottom: 8}}>
                  <div>
                    <span style={{fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase'}}>Range Selected</span>
                    <h4 style={{fontSize: '0.85rem', color: 'var(--text-primary)', margin: '2px 0'}}>
                      {!ownerEndSlot ? ownerStartSlot.split(' - ')[0] : `${ownerStartSlot.split(' - ')[0]} to ${ownerEndSlot.split(' - ')[1]}`}
                    </h4>
                    <span style={{fontSize: '0.7rem', color: 'var(--primary)'}}>{ownerDuration} Hour{ownerDuration > 1 ? 's' : ''} Selected</span>
                  </div>
                  <button 
                    onClick={() => { setOwnerStartSlot(null); setOwnerEndSlot(null); }}
                    className="btn-outlined"
                    style={{padding: '3px 8px', fontSize: '0.7rem', width: 'auto', borderColor: 'var(--border-light)', color: 'var(--text-secondary)'}}
                  >
                    Clear ✖️
                  </button>
                </div>

                {ownerHasConflict && (
                  <p style={{color: 'var(--danger)', fontSize: '0.68rem', marginBottom: 8}}>
                    ⚠️ Conflict: The selected range contains already-booked slots!
                  </p>
                )}

                <div style={{display: 'flex', gap: 8}}>
                  <button
                    disabled={ownerHasConflict}
                    onClick={async () => {
                      const name = await showPrompt("Offline Booking", "Enter customer name for offline booking:", "Customer Name", "");
                      if (name && name.trim()) {
                        bookSlot(ownerVenue.id, `${selectedDay} ${monthAbbr} ${calendarYear}`, selectedOwnerSlotTimes, ownerVenue.pricePerHour * ownerDuration, false, name);
                        setOwnerStartSlot(null);
                        setOwnerEndSlot(null);
                      }
                    }}
                    className="btn-neon"
                    style={{flex: 1, padding: '8px 0', fontSize: '0.75rem'}}
                  >
                    Book Offline 📝
                  </button>
                  <button
                    disabled={ownerHasConflict}
                    onClick={async () => {
                      if (await showConfirm('Block Range', `Block selected range for maintenance?`)) {
                        bookSlot(ownerVenue.id, `${selectedDay} ${monthAbbr} ${calendarYear}`, selectedOwnerSlotTimes, 0, false, "Maintenance / Blocked");
                        setOwnerStartSlot(null);
                        setOwnerEndSlot(null);
                      }
                    }}
                    className="btn-outlined"
                    style={{flex: 1, padding: '8px 0', fontSize: '0.75rem'}}
                  >
                    Block Range 🚫
                  </button>
                </div>
              </div>
            )}

            {/* Close Button */}
            <button 
              onClick={() => {
                setIsSlotModalOpen(false);
                setOwnerStartSlot(null);
                setOwnerEndSlot(null);
              }} 
              className="btn-outlined" 
              style={{width: '100%', padding: '10px 0', marginTop: 4, fontWeight: 'bold', flexShrink: 0}}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   8. CREATE TOURNAMENT
   ========================================================================== */
function CreateTournamentView() {
  const { setCurrentScreen, addTournament, showAlert, showError, selectedSportFilter, setSelectedTournamentId } = useAppState();
  const [step, setStep] = useState(1);
  const [tourName, setTourName] = useState('');
  const [format, setFormat] = useState('Knockout');
  const [overs, setOvers] = useState(8);
  const [teamsCount, setTeamsCount] = useState(8);
  const [maxPlayers, setMaxPlayers] = useState(11);
  const [registrationType, setRegistrationType] = useState('contact'); // 'open' | 'contact'
  const [entryFee, setEntryFee] = useState(1000);
  const [contactPhone, setContactPhone] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [termsText, setTermsText] = useState('By registering, you agree to comply with all tournament rules, safety policies, and decisions of the organizers. Players must play in a sportsmanlike manner. Entry fees are non-refundable.');

  const calculatedPrize = entryFee * teamsCount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tourName.trim()) {
      await showError('Create Tournament', 'Please fill out the tournament name!');
      return;
    }
    if (registrationType === 'contact' && !contactPhone.trim() && !instagramUrl.trim()) {
      await showError('Create Tournament', 'Please provide either a Contact Phone or an Instagram URL so players can contact you!');
      return;
    }
    const fresh = addTournament({
      name: tourName,
      format,
      overs,
      maxTeams: teamsCount,
      maxPlayers,
      registrationType,
      entryFee: registrationType === 'open' ? entryFee : 0,
      contactPhone,
      instagramUrl,
      termsText,
      sport: selectedSportFilter || 'Box Cricket',
      date: new Date().toLocaleDateString()
    });
    if (fresh && fresh.id) {
      setSelectedTournamentId(fresh.id);
    }
    await showAlert('Success', 'Tournament Created Successfully!');
    setCurrentScreen('tournament_detail');
  };

  const renderStepIndicators = () => {
    const steps = [
      { num: 1, label: 'Info' },
      { num: 2, label: 'Capacity' },
      { num: 3, label: 'Registration' }
    ];
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        position: 'relative',
        padding: '0 10px'
      }}>
        {/* Progress Line */}
        <div style={{
          position: 'absolute',
          top: 15,
          left: 30,
          right: 30,
          height: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          top: 15,
          left: 30,
          width: `${((step - 1) / (steps.length - 1)) * 82}%`, // adjusted for correct line span
          height: 2,
          backgroundColor: 'var(--primary)',
          transition: 'width 0.3s ease',
          zIndex: 2
        }} />

        {steps.map(s => {
          const isActive = step === s.num;
          const isCompleted = step > s.num;
          return (
            <div key={s.num} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 3,
              position: 'relative'
            }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: isCompleted ? 'var(--primary)' : (isActive ? 'var(--bg-surface-solid)' : 'var(--bg-secondary)'),
                border: isActive || isCompleted ? '2.5px solid var(--primary)' : '2.5px solid var(--border-light)',
                color: isCompleted ? '#000' : (isActive ? 'var(--primary)' : 'var(--text-muted)'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                boxShadow: isActive ? '0 0 12px rgba(170, 255, 0, 0.3)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                {isCompleted ? '✓' : s.num}
              </div>
              <span style={{
                fontSize: '0.7rem',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 'bold' : 'normal',
                marginTop: 6,
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{...styles.container, padding: 16, overflowY: 'auto', maxHeight: 'calc(100vh - 120px)'}}>
      {renderStepIndicators()}

      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 14}}>
        {step === 1 && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}} className="animate-fade-in">
            <div className="form-group">
              <label className="form-label">Tournament Name</label>
              <input 
                type="text" 
                placeholder="e.g. Kopar Champions League" 
                className="form-input" 
                value={tourName}
                maxLength={100}
                onChange={e => setTourName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Format Type</label>
              <div style={{display: 'flex', gap: 10}}>
                {['Knockout', 'League', 'Both'].map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormat(f)}
                    style={{
                      ...styles.slotButton,
                      flex: 1,
                      backgroundColor: format === f ? 'var(--primary)' : 'var(--bg-surface)',
                      color: format === f ? '#FFF' : 'var(--text-primary)',
                      borderColor: format === f ? 'var(--primary)' : 'var(--border-light)'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Overs per Innings</label>
              <input 
                type="number" 
                className="form-input" 
                value={overs}
                onChange={e => setOvers(parseInt(e.target.value) || 0)}
              />
            </div>

            <button
              type="button"
              onClick={async () => {
                if (!tourName.trim()) {
                  await showError('Validation Error', 'Please fill out the tournament name!');
                  return;
                }
                setStep(2);
              }}
              className="btn-neon"
              style={{marginTop: 12, padding: '12px 0'}}
            >
              CONTINUE ⚡
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}} className="animate-fade-in">
            <div className="form-group">
              <label className="form-label">Max Teams</label>
              <select 
                className="form-input" 
                value={teamsCount}
                onChange={e => setTeamsCount(parseInt(e.target.value) || 8)}
                style={{backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)'}}
              >
                <option value="2">2 Teams</option>
                <option value="4">4 Teams</option>
                <option value="8">8 Teams (Quarterfinals)</option>
                <option value="16">16 Teams (Octafinals)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Max Players per Team</label>
              <input 
                type="number" 
                className="form-input" 
                value={maxPlayers}
                onChange={e => setMaxPlayers(parseInt(e.target.value) || 11)}
              />
            </div>

            <div style={{display: 'flex', gap: 10, marginTop: 12}}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-outlined"
                style={{flex: 1, padding: '12px 0'}}
              >
                BACK
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-neon"
                style={{flex: 2, padding: '12px 0'}}
              >
                CONTINUE ⚡
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}} className="animate-fade-in">
            <div className="form-group">
              <label className="form-label">Registration Type</label>
              <div style={{display: 'flex', gap: 10}}>
                {[
                  { id: 'open', label: 'Open Registration (Online)' },
                  { id: 'contact', label: 'Invite / Contact Owner' }
                ].map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setRegistrationType(type.id)}
                    style={{
                      ...styles.slotButton,
                      flex: 1,
                      fontSize: '0.8rem',
                      padding: '10px 6px',
                      backgroundColor: registrationType === type.id ? 'var(--primary)' : 'var(--bg-surface)',
                      color: registrationType === type.id ? '#FFF' : 'var(--text-primary)',
                      borderColor: registrationType === type.id ? 'var(--primary)' : 'var(--border-light)'
                    }}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {registrationType === 'open' ? (
              <>
                <div className="form-group">
                  <label className="form-label">Registration Fee (Per Team)</label>
                  <div style={{position: 'relative'}}>
                    <span style={{position: 'absolute', left: 14, top: 12, color: 'var(--text-muted)'}}>₹</span>
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{paddingLeft: 28}}
                      value={entryFee}
                      onChange={e => setEntryFee(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="sporty-card glow-gold" style={{padding: 12, textAlign: 'center'}}>
                  <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>ESTIMATED PRIZE POOL</span>
                  <h2 className="text-gold" style={{fontSize: '1.8rem', margin: '4px 0'}}>₹{calculatedPrize}</h2>
                </div>
              </>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                <div className="form-group">
                  <label className="form-label">Contact Mobile Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. +91 99000 88888" 
                    className="form-input" 
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Instagram Username / Link</label>
                  <input 
                    type="text" 
                    placeholder="e.g. @playfinity_turf" 
                    className="form-input" 
                    value={instagramUrl}
                    onChange={e => setInstagramUrl(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Terms and Conditions</label>
              <textarea 
                className="form-input" 
                style={{minHeight: 80, fontFamily: 'sans-serif', fontSize: '0.8rem'}}
                value={termsText}
                onChange={e => setTermsText(e.target.value)}
                rows={4}
              />
            </div>

            <div style={{display: 'flex', gap: 10, marginTop: 12}}>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-outlined"
                style={{flex: 1, padding: '12px 0'}}
              >
                BACK
              </button>
              <button 
                type="submit" 
                className="btn-neon" 
                style={{flex: 2, padding: '12px 0'}}
              >
                LAUNCH TOURNAMENT 🏆
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

/* ==========================================================================
   9. TOURNAMENT BRACKET & STANDINGS
   ========================================================================== */
/* ==========================================================================
   9. TOURNAMENT BRACKET & STANDINGS
   ========================================================================== */

const getTourSettings = (tournament) => {
  const defaults = {
    maxTeams: tournament.maxTeams || 8,
    maxPlayers: 11,
    registrationType: 'contact',
    entryFee: tournament.entryFee || 1000,
    contactPhone: '',
    instagramUrl: '',
    termsText: 'By registering, you agree to comply with all tournament rules, safety policies, and decisions of the organizers. Players must play in a sportsmanlike manner. Entry fees are non-refundable.',
    teamsRegistered: []
  };
  return {
    ...defaults,
    ...(tournament.bracket?.settings || {})
  };
};

const getTourHistory = (tournament) => {
  return tournament.bracket?.history || [
    { timestamp: new Date().toLocaleString(), text: 'Tournament created.' }
  ];
};

const generateKnockoutBracket = (teams, maxTeams = 8) => {
  const bracketTeams = [...teams];
  while (bracketTeams.length < maxTeams) {
    bracketTeams.push({ teamName: 'BYE' });
  }

  const checkBye = (t1, t2) => {
    if (t2 === 'BYE') return t1;
    if (t1 === 'BYE') return t2;
    return '';
  };

  if (maxTeams === 8) {
    const quarterFinals = [
      { id: 'q-1', team1: bracketTeams[0].teamName, team2: bracketTeams[1].teamName, score1: '', score2: '', winner: checkBye(bracketTeams[0].teamName, bracketTeams[1].teamName) },
      { id: 'q-2', team1: bracketTeams[2].teamName, team2: bracketTeams[3].teamName, score1: '', score2: '', winner: checkBye(bracketTeams[2].teamName, bracketTeams[3].teamName) },
      { id: 'q-3', team1: bracketTeams[4].teamName, team2: bracketTeams[5].teamName, score1: '', score2: '', winner: checkBye(bracketTeams[4].teamName, bracketTeams[5].teamName) },
      { id: 'q-4', team1: bracketTeams[6].teamName, team2: bracketTeams[7].teamName, score1: '', score2: '', winner: checkBye(bracketTeams[6].teamName, bracketTeams[7].teamName) },
    ];
    const semiFinals = [
      { id: 's-1', team1: quarterFinals[0].winner || 'TBD', team2: quarterFinals[1].winner || 'TBD', score1: '', score2: '', winner: '' },
      { id: 's-2', team1: quarterFinals[2].winner || 'TBD', team2: quarterFinals[3].winner || 'TBD', score1: '', score2: '', winner: '' },
    ];
    const final = { id: 'f-1', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' };
    return { octafinals: [], quarterFinals, semiFinals, final };
  } else if (maxTeams === 4) {
    const semiFinals = [
      { id: 's-1', team1: bracketTeams[0].teamName, team2: bracketTeams[1].teamName, score1: '', score2: '', winner: checkBye(bracketTeams[0].teamName, bracketTeams[1].teamName) },
      { id: 's-2', team1: bracketTeams[2].teamName, team2: bracketTeams[3].teamName, score1: '', score2: '', winner: checkBye(bracketTeams[2].teamName, bracketTeams[3].teamName) },
    ];
    const final = { id: 'f-1', team1: semiFinals[0].winner || 'TBD', team2: semiFinals[1].winner || 'TBD', score1: '', score2: '', winner: '' };
    return { octafinals: [], quarterFinals: [], semiFinals, final };
  } else if (maxTeams === 16) {
    const octafinals = [];
    for (let i = 0; i < 8; i++) {
      const t1 = bracketTeams[i * 2].teamName;
      const t2 = bracketTeams[i * 2 + 1].teamName;
      octafinals.push({
        id: `o-${i + 1}`,
        team1: t1,
        team2: t2,
        score1: '',
        score2: '',
        winner: checkBye(t1, t2)
      });
    }
    const quarterFinals = [
      { id: 'q-1', team1: octafinals[0].winner || 'TBD', team2: octafinals[1].winner || 'TBD', score1: '', score2: '', winner: '' },
      { id: 'q-2', team1: octafinals[2].winner || 'TBD', team2: octafinals[3].winner || 'TBD', score1: '', score2: '', winner: '' },
      { id: 'q-3', team1: octafinals[4].winner || 'TBD', team2: octafinals[5].winner || 'TBD', score1: '', score2: '', winner: '' },
      { id: 'q-4', team1: octafinals[6].winner || 'TBD', team2: octafinals[7].winner || 'TBD', score1: '', score2: '', winner: '' },
    ];
    const semiFinals = [
      { id: 's-1', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
      { id: 's-2', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
    ];
    const final = { id: 'f-1', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' };
    return { octafinals, quarterFinals, semiFinals, final };
  } else {
    // 2 Teams
    const final = { id: 'f-1', team1: bracketTeams[0].teamName, team2: bracketTeams[1].teamName, score1: '', score2: '', winner: checkBye(bracketTeams[0].teamName, bracketTeams[1].teamName) };
    return { octafinals: [], quarterFinals: [], semiFinals: [], final };
  }
};

const updateMatchInBracket = (bracket, matchId, score1, score2, winner, overs1 = '', overs2 = '', allOut1 = false, allOut2 = false, date = '', court = '') => {
  const updated = { ...bracket };
  let found = false;

  if (updated.octafinals) {
    updated.octafinals = updated.octafinals.map(m => {
      if (m.id === matchId) {
        found = true;
        return { ...m, score1, score2, winner, overs1, overs2, allOut1, allOut2, date, court };
      }
      return m;
    });
  }
  
  if (!found && updated.quarterFinals) {
    updated.quarterFinals = updated.quarterFinals.map(m => {
      if (m.id === matchId) {
        found = true;
        return { ...m, score1, score2, winner, overs1, overs2, allOut1, allOut2, date, court };
      }
      return m;
    });
  }
  
  if (!found && updated.semiFinals) {
    updated.semiFinals = updated.semiFinals.map(m => {
      if (m.id === matchId) {
        found = true;
        return { ...m, score1, score2, winner, overs1, overs2, allOut1, allOut2, date, court };
      }
      return m;
    });
  }
  
  if (!found && updated.final && updated.final.id === matchId) {
    updated.final = { ...updated.final, score1, score2, winner, overs1, overs2, allOut1, allOut2, date, court };
  }
  
  // Propagate winners
  if (updated.octafinals && updated.octafinals.length > 0) {
    const o = updated.octafinals;
    if (updated.quarterFinals && updated.quarterFinals.length > 0) {
      updated.quarterFinals = updated.quarterFinals.map((m, idx) => {
        const o1 = o[idx * 2];
        const o2 = o[idx * 2 + 1];
        return { ...m, team1: o1?.winner || 'TBD', team2: o2?.winner || 'TBD' };
      });
    }
  }

  if (updated.quarterFinals && updated.quarterFinals.length > 0) {
    const q1 = updated.quarterFinals.find(m => m.id === 'q-1');
    const q2 = updated.quarterFinals.find(m => m.id === 'q-2');
    const q3 = updated.quarterFinals.find(m => m.id === 'q-3');
    const q4 = updated.quarterFinals.find(m => m.id === 'q-4');
    
    if (updated.semiFinals && updated.semiFinals.length > 0) {
      updated.semiFinals = updated.semiFinals.map(m => {
        if (m.id === 's-1') {
          return { ...m, team1: q1?.winner || 'TBD', team2: q2?.winner || 'TBD' };
        }
        if (m.id === 's-2') {
          return { ...m, team1: q3?.winner || 'TBD', team2: q4?.winner || 'TBD' };
        }
        return m;
      });
    }
  }
  
  if (updated.semiFinals && updated.semiFinals.length > 0) {
    const s1 = updated.semiFinals.find(m => m.id === 's-1');
    const s2 = updated.semiFinals.find(m => m.id === 's-2');
    
    if (updated.final) {
      updated.final = { ...updated.final, team1: s1?.winner || 'TBD', team2: s2?.winner || 'TBD' };
    }
  }
  
  return updated;
};

const generateStandings = (teamsRegistered, bracket) => {
  if (!teamsRegistered || teamsRegistered.length === 0) return [];
  
  const stats = {};
  teamsRegistered.forEach(t => {
    stats[t.teamName] = {
      teamName: t.teamName,
      logoColor: getRandomColorForTeam(t.teamName),
      played: 0,
      won: 0,
      lost: 0,
      nr: 0,
      points: 0,
      totalRunsScored: 0,
      totalBallsFaced: 0,
      totalRunsConceded: 0,
      totalBallsBowled: 0
    };
  });
  
  const allMatches = [];
  if (bracket?.octafinals) allMatches.push(...bracket.octafinals);
  if (bracket?.quarterFinals) allMatches.push(...bracket.quarterFinals);
  if (bracket?.semiFinals) allMatches.push(...bracket.semiFinals);
  if (bracket?.final) allMatches.push(bracket.final);
  
  const maxOvers = bracket?.settings?.overs || 8;
  
  const parseOversToBalls = (oversVal) => {
    if (oversVal === undefined || oversVal === null || oversVal === '') return 0;
    const str = oversVal.toString().trim();
    if (str.includes('.')) {
      const parts = str.split('.');
      const completeOvers = parseInt(parts[0]) || 0;
      const balls = parseInt(parts[1]) || 0;
      return (completeOvers * 6) + Math.min(balls, 6);
    }
    return (parseFloat(str) || 0) * 6;
  };
  
  allMatches.forEach(m => {
    if (m && m.winner && m.team1 !== 'TBD' && m.team2 !== 'TBD' && m.team1 !== 'BYE' && m.team2 !== 'BYE') {
      const t1 = m.team1;
      const t2 = m.team2;
      const runs1 = parseInt(m.score1) || 0;
      const runs2 = parseInt(m.score2) || 0;
      
      if (stats[t1] && stats[t2]) {
        stats[t1].played += 1;
        stats[t2].played += 1;
        
        if (m.winner === t1) {
          stats[t1].won += 1;
          stats[t1].points += 2;
          stats[t2].lost += 1;
        } else if (m.winner === t2) {
          stats[t2].won += 1;
          stats[t2].points += 2;
          stats[t1].lost += 1;
        } else {
          stats[t1].nr += 1;
          stats[t1].points += 1;
          stats[t2].nr += 1;
          stats[t2].points += 1;
        }
        
        // Calculate balls faced/bowled using IPL NRR guidelines (full overs if all out)
        let ballsFacedT1 = m.allOut1 ? (maxOvers * 6) : (parseOversToBalls(m.overs1) || (maxOvers * 6));
        let ballsFacedT2 = m.allOut2 ? (maxOvers * 6) : (parseOversToBalls(m.overs2) || (maxOvers * 6));
        
        stats[t1].totalRunsScored += runs1;
        stats[t1].totalBallsFaced += ballsFacedT1;
        stats[t1].totalRunsConceded += runs2;
        stats[t1].totalBallsBowled += ballsFacedT2;
        
        stats[t2].totalRunsScored += runs2;
        stats[t2].totalBallsFaced += ballsFacedT2;
        stats[t2].totalRunsConceded += runs1;
        stats[t2].totalBallsBowled += ballsFacedT1;
      }
    }
  });
  
  const standingsList = Object.values(stats).map(item => {
    const decimalOversFaced = item.totalBallsFaced / 6;
    const decimalOversBowled = item.totalBallsBowled / 6;
    
    const runRateScored = decimalOversFaced > 0 ? (item.totalRunsScored / decimalOversFaced) : 0;
    const runRateConceded = decimalOversBowled > 0 ? (item.totalRunsConceded / decimalOversBowled) : 0;
    
    const nrrVal = runRateScored - runRateConceded;
    
    return {
      team: item.teamName,
      logoColor: item.logoColor,
      played: item.played,
      won: item.won,
      lost: item.lost,
      nr: item.nr,
      points: item.points,
      nrr: nrrVal.toFixed(3)
    };
  });
  
  standingsList.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.won !== a.won) return b.won - a.won;
    return parseFloat(b.nrr) - parseFloat(a.nrr);
  });
  
  return standingsList.map((item, idx) => ({
    pos: idx + 1,
    ...item
  }));
};

const getRandomColorForTeam = (name) => {
  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

function TeamRosterExpandableCard({ team, index, maxPlayers, userRole, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div 
      style={{
        border: '1px solid var(--border-light)',
        borderRadius: 8,
        backgroundColor: 'var(--bg-surface)',
        overflow: 'hidden'
      }}
    >
      <div 
        onClick={() => setExpanded(!expanded)} 
        style={{
          padding: '12px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <div>
          <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: 6}}>#{index + 1}</span>
          <strong style={{color: 'var(--text-primary)', fontSize: '0.9rem'}}>{team.teamName}</strong>
          <div style={{fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2}}>
            Captain: {team.captainName} ({team.players?.length || 0} players)
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}} onClick={(e) => {
          if (e.target.closest('.action-btn')) {
            e.stopPropagation();
          }
        }}>
          {team.paymentStatus === 'paid' && (
            <span style={{fontSize: '0.65rem', padding: '2px 6px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', borderRadius: 4, fontWeight: 'bold'}}>
              PAID
            </span>
          )}
          {userRole === 'admin' && (
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                className="action-btn btn-outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                style={{ padding: '2px 6px', fontSize: '0.62rem', width: 'auto', border: '1px solid var(--primary)', color: 'var(--primary)', height: 22 }}
              >
                ✏️
              </button>
              <button
                type="button"
                className="action-btn btn-outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                style={{ padding: '2px 6px', fontSize: '0.62rem', width: 'auto', border: '1px solid var(--danger)', color: 'var(--danger)', height: 22 }}
              >
                🗑️
              </button>
            </div>
          )}
          <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>
      
      {expanded && (
        <div style={{padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.04)', backgroundColor: 'rgba(0,0,0,0.1)'}}>
          <span style={{fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)'}}>PLAYER ROSTER:</span>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6}}>
            {team.players && team.players.length > 0 ? (
              team.players.map((p, pidx) => (
                <span 
                  key={pidx} 
                  style={{
                    fontSize: '0.75rem', 
                    padding: '3px 8px', 
                    backgroundColor: 'var(--bg-card)', 
                    color: 'var(--text-primary)', 
                    borderRadius: 4,
                    border: '1px solid var(--border-light)'
                  }}
                >
                  👤 {p}
                </span>
              ))
            ) : (
              <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>No players registered</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TournamentListView() {
  const { tournaments, selectedSportFilter, setSelectedTournamentId, setCurrentScreen, userRole, userName, userPhone } = useAppState();

  const activeSportName = selectedSportFilter === 'All' ? 'Sports' : selectedSportFilter;
  const sportTournaments = tournaments.filter(t => {
    if (selectedSportFilter === 'All') return true;
    const tSport = (t.sport || 'Box Cricket').toLowerCase();
    const activeSport = activeSportName.toLowerCase();
    if (activeSport === 'cricket' || activeSport === 'box cricket') {
      return tSport === 'cricket' || tSport === 'box cricket';
    }
    return tSport === activeSport;
  });

  return (
    <div style={{ ...styles.container, padding: '16px 16px 80px', overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
      {/* Header bar / Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
            {activeSportName} Tournaments
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '4px 0 0' }}>
            {sportTournaments.length} tournament{sportTournaments.length !== 1 ? 's' : ''} available
          </p>
        </div>
        {userRole === 'admin' && (
          <button
            onClick={() => setCurrentScreen('create_tournament')}
            className="btn-neon"
            style={{
              padding: '8px 14px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              width: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            Create Tournament 🏆
          </button>
        )}
      </div>

      {sportTournaments.length === 0 ? (
        <div className="sporty-card" style={{ textAlign: 'center', padding: '40px 16px', marginTop: 20 }}>
          <span style={{ fontSize: '2.5rem' }}>🏆</span>
          <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginTop: 10 }}>No Active Tournaments</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            There are no tournaments currently active for this sport.
          </p>
          {userRole === 'admin' && (
            <button
              onClick={() => setCurrentScreen('create_tournament')}
              className="btn-neon"
              style={{ padding: '10px 20px', fontSize: '0.8rem', marginTop: 16 }}
            >
              Create New Tournament ⚡
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sportTournaments.map(t => {
            const settings = getTourSettings(t);
            const registeredCount = settings.teamsRegistered?.length || 0;
            const maxTeams = settings.maxTeams || 8;
            const percentRegistered = Math.min(100, Math.round((registeredCount / maxTeams) * 100));
            
            // Check status
            const isStarted = (t.bracket?.quarterFinals && t.bracket.quarterFinals.length > 0) ||
                              (t.bracket?.semiFinals && t.bracket.semiFinals.length > 0) ||
                              (t.bracket?.octafinals && t.bracket.octafinals.length > 0) ||
                              (t.bracket?.final && t.bracket.final.team1 !== 'TBD');
            const isCompleted = t.bracket?.final?.winner ? true : false;
            
            let statusBadge = { text: 'Registrations Open', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' };
            if (isCompleted) {
              statusBadge = { text: 'Completed', color: '#F59E0B', bg: 'rgba(234,179,8,0.15)' };
            } else if (isStarted) {
              statusBadge = { text: 'Live Match', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' };
            }

            const isUserJoined = settings.teamsRegistered?.some(team => {
              const isCaptain = team.captainName?.toLowerCase() === userName?.toLowerCase() || team.captainPhone === userPhone;
              const isPlayer = team.players?.some(p => p.toLowerCase() === userName?.toLowerCase());
              return isCaptain || isPlayer;
            });

            return (
              <div
                key={t.id}
                className="sporty-card"
                onClick={() => {
                  setSelectedTournamentId(t.id);
                  setCurrentScreen('tournament_detail');
                }}
                style={{
                  cursor: 'pointer',
                  padding: 16,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {t.name}
                    </h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      ⚽ {t.sport} • {t.format}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isUserJoined && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 'bold',
                          padding: '4px 8px',
                          borderRadius: 12,
                          color: 'var(--primary)',
                          backgroundColor: 'rgba(170,255,0,0.12)',
                          border: '1px solid var(--primary)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        💎 JOINED
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        padding: '4px 8px',
                        borderRadius: 12,
                        color: statusBadge.color,
                        backgroundColor: statusBadge.bg,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {statusBadge.text}
                    </span>
                  </div>
                </div>

                {/* Progress bar for registrations */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                    <span>Registered Teams</span>
                    <span>{registeredCount} / {maxTeams}</span>
                  </div>
                  <div style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${percentRegistered}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: 3 }} />
                  </div>
                </div>

                {/* Details foot strip */}
                <div style={{ display: 'flex', gap: 12, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 10, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <span>🏏 {settings.overs || 8} Overs</span>
                  <span>👥 {settings.maxPlayers || 11} per side</span>
                  <span>💰 {settings.registrationType === 'open' ? `₹${settings.entryFee}` : 'Invite only'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BracketView() {
  const { tournaments, selectedTournamentId, selectedSportFilter, userRole, userName, userPhone, updateTournament, showAlert, showError, showConfirm, teams, playerId, deleteTournament, setCurrentScreen } = useAppState();
  const [activeTab, setActiveTab] = useState('details');

  // Registration Modal state
  const [showRegModal, setShowRegModal] = useState(false);
  const [regStep, setRegStep] = useState(1);
  const [teamName, setTeamName] = useState('');
  const [captainName, setCaptainName] = useState(userName || 'Yaksh');
  const [captainPhone, setCaptainPhone] = useState(userPhone || '6353874452');
  const [roster, setRoster] = useState([userName || 'Yaksh']);
  const [newPlayer, setNewPlayer] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [payUpi, setPayUpi] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Edit Match State
  const [editingMatch, setEditingMatch] = useState(null);
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');
  const [winner, setWinner] = useState('');
  const [overs1, setOvers1] = useState('');
  const [overs2, setOvers2] = useState('');
  const [allOut1, setAllOut1] = useState(false);
  const [allOut2, setAllOut2] = useState(false);
  const [matchDateInput, setMatchDateInput] = useState('');
  const [matchCourtInput, setMatchCourtInput] = useState('');

  // Tournament Settings Editing State
  const [showEditTourModal, setShowEditTourModal] = useState(false);
  const [editTourName, setEditTourName] = useState('');
  const [editTourFormat, setEditTourFormat] = useState('Knockout');
  const [editMaxTeams, setEditMaxTeams] = useState(8);
  const [editMaxPlayers, setEditMaxPlayers] = useState(11);
  const [editOvers, setEditOvers] = useState(8);
  const [editEntryFee, setEditEntryFee] = useState(1000);
  const [editRegType, setEditRegType] = useState('open');
  const [editPhone, setEditPhone] = useState('');
  const [editInsta, setEditInsta] = useState('');
  const [editTerms, setEditTerms] = useState('');

  // Registered Team Editing State
  const [editingTeamIndex, setEditingTeamIndex] = useState(null);
  const [editTeamName, setEditTeamName] = useState('');
  const [editTeamCaptain, setEditTeamCaptain] = useState('');
  const [editTeamPhone, setEditTeamPhone] = useState('');
  const [editTeamRoster, setEditTeamRoster] = useState([]);
  const [editTeamNewPlayer, setEditTeamNewPlayer] = useState('');

  if (tournaments.length === 0) {
    return (
      <div style={{...styles.container, padding: 16, justifyContent: 'center', alignItems: 'center'}}>
        <div className="sporty-card" style={{textAlign: 'center', padding: 24}}>
          <span style={{fontSize: '2.5rem'}}>🏆</span>
          <h3 style={{color: "var(--text-primary)", marginTop: 12}}>No Tournaments Yet</h3>
          <p style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 6}}>
            Go to Admin Role and use the Create Tournament stepper form to launch one!
          </p>
        </div>
      </div>
    );
  }

  const tournament = tournaments.find(t => t.id === selectedTournamentId) || 
    tournaments.find(t => t.sport.toLowerCase() === selectedSportFilter.toLowerCase()) || 
    tournaments[0];

  const settings = getTourSettings(tournament);
  const registeredCount = settings.teamsRegistered?.length || 0;

  // Check if current user is registered in this tournament
  const userTeam = settings.teamsRegistered?.find(team => {
    const isCaptain = team.captainName?.toLowerCase() === userName?.toLowerCase() || team.captainPhone === userPhone;
    const isPlayer = team.players?.some(p => p.toLowerCase() === userName?.toLowerCase());
    return isCaptain || isPlayer;
  });
  const userTeamName = userTeam ? userTeam.teamName : '';
  const isUserJoined = !!userTeam;

  // Filter player's teams that match this sport for auto-filling
  const tournamentSport = tournament ? (tournament.sport || '').toLowerCase() : '';
  const myTeams = (teams || []).filter(team => {
    const teamSport = (team.sport || '').toLowerCase();
    const matchesSport = teamSport === tournamentSport || 
                         ((tournamentSport === 'cricket' || tournamentSport === 'box cricket') && (teamSport === 'cricket' || teamSport === 'box cricket'));
    const isMember = team.creatorId === playerId || team.captain === userName;
    return matchesSport && isMember;
  });
  const isStarted = (tournament.bracket?.quarterFinals && tournament.bracket.quarterFinals.length > 0) ||
                    (tournament.bracket?.semiFinals && tournament.bracket.semiFinals.length > 0) ||
                    (tournament.bracket?.octafinals && tournament.bracket.octafinals.length > 0) ||
                    (tournament.bracket?.final && tournament.bracket.final.team1 !== 'TBD');

  const standings = generateStandings(settings.teamsRegistered, tournament.bracket);

  const handleStartTournament = async () => {
    if (registeredCount < 2) {
      await showError('Start Tournament', 'At least 2 teams must be registered to start the tournament!');
      return;
    }
    
    const confirmed = await showConfirm('Start Tournament', 'Are you sure you want to lock registrations and generate the roadmap to finals?');
    if (!confirmed) return;
    
    const maxTeams = settings.maxTeams || 8;
    const initialBracket = generateKnockoutBracket(settings.teamsRegistered, maxTeams);
    const propagated = updateMatchInBracket(initialBracket, '', '', '', '');
    
    const updatedTournament = {
      ...tournament,
      bracket: {
        ...tournament.bracket,
        ...propagated,
        settings: {
          ...settings
        },
        history: [
          ...(tournament.bracket?.history || []),
          { timestamp: new Date().toLocaleString(), text: 'Tournament started. Registrations locked and brackets generated!' }
        ]
      }
    };
    
    updateTournament(updatedTournament);
    await showAlert('Success', 'Roadmap generated and tournament started!');
  };

  const handleCompleteRegistration = async (paymentRef) => {
    setIsRegistering(true);
    try {
      const newRegisteredTeam = {
        teamName: teamName.toUpperCase(),
        captainName,
        captainPhone,
        players: roster,
        registeredAt: new Date().toLocaleString(),
        paymentStatus: paymentRef !== 'N/A' ? 'paid' : 'manual',
        paymentReference: paymentRef
      };

      const updatedTeamsRegistered = [...(settings.teamsRegistered || []), newRegisteredTeam];
      let updatedBracket = { ...tournament.bracket };
      let bracketHistoryText = `Team "${teamName}" registered successfully.`;
      const maxTeams = settings.maxTeams || 8;
      
      if (updatedTeamsRegistered.length === maxTeams) {
        const autoBracket = generateKnockoutBracket(updatedTeamsRegistered, maxTeams);
        const propagated = updateMatchInBracket(autoBracket, '', '', '', '');
        updatedBracket = {
          ...updatedBracket,
          ...propagated
        };
        bracketHistoryText += ` Max teams count reached (${maxTeams}/${maxTeams}). Knockout brackets generated automatically!`;
      }

      const updatedTournament = {
        ...tournament,
        bracket: {
          ...updatedBracket,
          settings: {
            ...settings,
            teamsRegistered: updatedTeamsRegistered
          },
          history: [
            ...(tournament.bracket?.history || []),
            { timestamp: new Date().toLocaleString(), text: bracketHistoryText }
          ]
        }
      };

      updateTournament(updatedTournament);
      setIsRegistering(false);
      setShowRegModal(false);
      await showAlert('Success', `Team "${teamName}" registered successfully!`);
    } catch (err) {
      setIsRegistering(false);
      await showError('Error', 'Registration failed: ' + err.message);
    }
  };

  const getTeamColor = (name) => {
    if (!name || name === 'TBD' || name === 'BYE') return '#6B7280';
    const colors = ['#EF4444','#F97316','#EAB308','#22C55E','#14B8A6','#3B82F6','#8B5CF6','#EC4899','#06B6D4','#84CC16'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const renderMatchNode = (m) => {
    if (!m) return null;
    const isOwnerOrScorer = userRole === 'admin' || userRole === 'scorer';
    const isBye = m.team1 === 'BYE' || m.team2 === 'BYE';
    const isTBD = m.team1 === 'TBD' || m.team2 === 'TBD';
    const isCompleted = !!m.winner;
    const canClick = isOwnerOrScorer && !isBye && !isTBD;

    const renderTeamRow = (teamName, score, isWinner, isLoser) => {
      const color = getTeamColor(teamName);
      const isByeTeam = teamName === 'BYE';
      const isTBDTeam = teamName === 'TBD';
      return (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px',
          borderRadius: 6,
          backgroundColor: isWinner ? 'rgba(170,255,0,0.08)' : 'transparent',
          transition: 'background 0.2s'
        }}>
          {/* Jersey icon */}
          <div style={{
            width: 22, height: 22, borderRadius: 5,
            backgroundColor: isByeTeam || isTBDTeam ? 'rgba(255,255,255,0.06)' : color + '22',
            border: `2px solid ${isByeTeam || isTBDTeam ? 'rgba(255,255,255,0.12)' : color + '55'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.55rem', fontWeight: '800', color: isByeTeam || isTBDTeam ? '#6B7280' : color,
            flexShrink: 0, letterSpacing: '-0.5px'
          }}>
            {isByeTeam ? 'BYE' : isTBDTeam ? '?' : teamName.slice(0,2)}
          </div>
          {/* Name */}
          <span style={{
            flex: 1, fontSize: '0.75rem',
            fontWeight: isWinner ? '800' : '500',
            color: isWinner ? 'var(--primary)' : isLoser ? 'var(--text-muted)' : 'var(--text-primary)',
            opacity: isByeTeam || isTBDTeam ? 0.5 : 1,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {teamName}
          </span>
          {/* Score */}
          {!isByeTeam && !isTBDTeam && (
            <span style={{
              fontSize: '0.8rem', fontWeight: 'bold',
              color: isWinner ? 'var(--primary)' : isLoser ? 'var(--text-muted)' : 'var(--text-secondary)',
              minWidth: 24, textAlign: 'right'
            }}>
              {score !== '' && score !== undefined ? score : '—'}
            </span>
          )}
          {/* Winner crown */}
          {isWinner && <span style={{fontSize: '0.7rem'}}>👑</span>}
        </div>
      );
    };

    if (isBye) {
      const realTeam = m.team1 !== 'BYE' ? m.team1 : m.team2;
      return (
        <div key={m.id} style={{
          ...styles.matchNode,
          border: '1px dashed rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 10, padding: '10px 12px'
        }}>
          <div style={{fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6}}>Bye Round</div>
          {renderTeamRow(realTeam, '', false, false)}
          <div style={{textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 4}}>Advances automatically ➜</div>
        </div>
      );
    }

    const isTeam1User = m.team1 !== 'TBD' && m.team1 !== 'BYE' && userTeamName && m.team1.toLowerCase() === userTeamName.toLowerCase();
    const isTeam2User = m.team2 !== 'TBD' && m.team2 !== 'BYE' && userTeamName && m.team2.toLowerCase() === userTeamName.toLowerCase();
    const isUserMatch = isTeam1User || isTeam2User;

    const matchDate = m.date;
    const matchCourt = m.court;
    let formattedDateTime = '';
    if (matchDate) {
      try {
        formattedDateTime = new Date(matchDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      } catch (err) {
        formattedDateTime = matchDate;
      }
    }

    return (
      <div
        key={m.id}
        style={{
          ...styles.matchNode,
          border: isUserMatch
            ? '2.5px solid var(--primary)'
            : isCompleted
            ? '1px solid rgba(170,255,0,0.25)'
            : canClick
            ? '1px solid rgba(255,255,255,0.12)'
            : '1px solid rgba(255,255,255,0.06)',
          cursor: canClick ? 'pointer' : 'default',
          position: 'relative',
          borderRadius: 12,
          overflow: 'hidden',
          transition: 'box-shadow 0.2s, transform 0.15s',
          boxShadow: isUserMatch
            ? '0 0 16px rgba(170,255,0,0.25)'
            : isCompleted
            ? '0 0 12px rgba(170,255,0,0.08)'
            : 'none'
        }}
        onMouseEnter={e => { if (canClick) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.3)'; } }}
        onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=isUserMatch?'0 0 16px rgba(170,255,0,0.25)':isCompleted?'0 0 12px rgba(170,255,0,0.08)':'none'; }}
        onClick={() => {
          if (canClick) {
            setEditingMatch(m);
            setScore1(m.score1 !== undefined ? m.score1 : '');
            setScore2(m.score2 !== undefined ? m.score2 : '');
            setWinner(m.winner || '');
            setOvers1(m.overs1 !== undefined ? m.overs1 : '');
            setOvers2(m.overs2 !== undefined ? m.overs2 : '');
            setAllOut1(!!m.allOut1);
            setAllOut2(!!m.allOut2);
            setMatchDateInput(m.date || '');
            setMatchCourtInput(m.court || '');
          }
        }}
      >
        {/* Status indicator strip */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: isCompleted
            ? 'linear-gradient(90deg, var(--primary), #00e5ff)'
            : isTBD
            ? 'rgba(255,255,255,0.08)'
            : 'linear-gradient(90deg, rgba(255,165,0,0.5), rgba(255,200,0,0.3))'
        }} />

        <div style={{padding: '8px 10px', paddingTop: 10}}>
          {/* Top Bar for Schedule and Badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.62rem',
            color: 'var(--text-muted)',
            marginBottom: 6,
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            paddingBottom: 4
          }}>
            <div style={{ display: 'flex', gap: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {formattedDateTime && <span>📅 {formattedDateTime}</span>}
              {matchCourt && <span>🏟️ {matchCourt}</span>}
              {!formattedDateTime && !matchCourt && <span>⏳ TBA</span>}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {isUserMatch && (
                <span style={{
                  fontSize: '0.5rem', color: '#000', backgroundColor: 'var(--primary)',
                  padding: '1px 4px', borderRadius: 3, fontWeight: '950'
                }}>YOUR MATCH</span>
              )}
              {canClick && !isCompleted && (
                <span style={{
                  fontSize: '0.5rem', color: 'rgba(255,165,0,0.9)',
                  fontWeight: 'bold'
                }}>✏️ EDIT</span>
              )}
              {isCompleted && (
                <span style={{
                  fontSize: '0.5rem', color: 'var(--primary)',
                  fontWeight: 'bold'
                }}>✅ DONE</span>
              )}
            </div>
          </div>

          {renderTeamRow(m.team1, m.score1, m.winner === m.team1, isCompleted && m.winner !== m.team1)}
          
          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '2px 8px'
          }}>
            <div style={{flex:1, height:1, backgroundColor: 'rgba(255,255,255,0.06)'}} />
            <span style={{fontSize: '0.6rem', color:'var(--text-muted)', fontWeight:'bold'}}>VS</span>
            <div style={{flex:1, height:1, backgroundColor: 'rgba(255,255,255,0.06)'}} />
          </div>

          {renderTeamRow(m.team2, m.score2, m.winner === m.team2, isCompleted && m.winner !== m.team2)}
        </div>
      </div>
    );
  };

  const statusLabel = tournament.bracket?.final?.winner
    ? { text: '🏆 Completed', bg: 'rgba(234,179,8,0.15)', color: '#F59E0B', border: 'rgba(234,179,8,0.3)' }
    : isStarted
    ? { text: '🔴 Live', bg: 'rgba(239,68,68,0.12)', color: '#EF4444', border: 'rgba(239,68,68,0.3)' }
    : { text: '🟢 Registrations Open', bg: 'rgba(34,197,94,0.1)', color: '#22C55E', border: 'rgba(34,197,94,0.25)' };

  return (
    <div style={{...styles.container, padding: 0, overflowY: 'auto', maxHeight: 'calc(100vh - 56px)'}}>

      {/* ── Hero Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(170,255,0,0.08) 0%, rgba(0,229,255,0.06) 50%, rgba(139,92,246,0.06) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '20px 16px 16px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative glow */}
        <div style={{ position:'absolute', top:-30, right:-30, width:120, height:120, borderRadius:'50%', background:'radial-gradient(circle, rgba(170,255,0,0.12), transparent 70%)', pointerEvents:'none' }} />
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom: 10 }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.3, paddingRight: 8 }}>{tournament.name}</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 3 }}>{tournament.sport} • {tournament.format}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 10 }}>
            {isUserJoined && (
              <span style={{
                fontSize: '0.65rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: 20,
                backgroundColor: 'rgba(170,255,0,0.12)', color: 'var(--primary)',
                border: '1.5px solid var(--primary)', whiteSpace: 'nowrap'
              }}>💎 JOINED</span>
            )}
            <span style={{
              fontSize: '0.65rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: 20,
              backgroundColor: statusLabel.bg, color: statusLabel.color,
              border: `1px solid ${statusLabel.border}`, whiteSpace: 'nowrap'
            }}>{statusLabel.text}</span>
          </div>
        </div>
        {/* Stat strip */}
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop: 4 }}>
          {[
            { icon:'👥', label:`${registeredCount}/${settings.maxTeams} Teams` },
            { icon:'🏏', label:`${settings.overs || 8} Overs` },
            { icon:'👤', label:`${settings.maxPlayers} per Team` },
            settings.registrationType === 'open'
              ? { icon:'💰', label:`₹${settings.entryFee} Entry` }
              : { icon:'📩', label:'Invite Only' }
          ].map((s, i) => (
            <span key={i} style={{
              fontSize: '0.65rem', padding: '3px 8px', borderRadius: 12,
              backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>{s.icon} {s.label}</span>
          ))}
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{ display:'flex', gap:0, borderBottom:'1px solid rgba(255,255,255,0.06)', backgroundColor: 'var(--bg-secondary)', overflowX:'auto', padding:'0 8px' }}>
        {[
          { id:'details', icon:'ℹ️', label:'Details' },
          { id:'bracket', icon:'🏆', label:'Bracket' },
          { id:'standings', icon:'📊', label:'Standings' },
          { id:'history', icon:'📜', label:'Timeline' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: '1 0 auto', padding: '11px 8px', fontSize: '0.72rem', fontWeight: activeTab === tab.id ? '700' : '500',
            color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
            background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
            transition: 'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:4
          }}>
            <span style={{fontSize:'0.8rem'}}>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px 16px' }}>

      {activeTab === 'details' && (
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          {/* Settings chip grid */}
          <div className="sporty-card" style={{padding: 16}}>
            <div className="flex-between" style={{ marginBottom: 12 }}>
              <h3 style={{fontSize: '1rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)'}}>⚙️ Tournament Settings</h3>
              {userRole === 'admin' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => {
                      setEditTourName(tournament.name);
                      setEditTourFormat(tournament.format || 'Knockout');
                      setEditMaxTeams(settings.maxTeams || 8);
                      setEditMaxPlayers(settings.maxPlayers || 11);
                      setEditOvers(settings.overs || 8);
                      setEditEntryFee(settings.entryFee || 1000);
                      setEditRegType(settings.registrationType || 'open');
                      setEditPhone(settings.contactPhone || '');
                      setEditInsta(settings.instagramUrl || '');
                      setEditTerms(settings.termsText || 'By registering, you agree to comply with all tournament rules...');
                      setShowEditTourModal(true);
                    }}
                    className="btn-outlined"
                    style={{ padding: '4px 8px', fontSize: '0.68rem', width: 'auto', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={async () => {
                      const confirm = await showConfirm('Delete Tournament', `Are you sure you want to delete "${tournament.name}"? This will delete all matches, standings, and history!`);
                      if (confirm) {
                        deleteTournament(tournament.id);
                        await showAlert('Deleted', 'Tournament deleted successfully.');
                        setCurrentScreen('bracket');
                      }
                    }}
                    className="btn-outlined"
                    style={{ padding: '4px 8px', fontSize: '0.68rem', width: 'auto', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
              {[
                { icon:'🏅', label:'Format', value: tournament.format },
                { icon:'⚽', label:'Sport', value: tournament.sport },
                { icon:'👥', label:'Max Teams', value: settings.maxTeams },
                { icon:'👤', label:'Players/Team', value: settings.maxPlayers },
                { icon:'📋', label:'Registration', value: settings.registrationType === 'open' ? 'Open Online' : 'Invite Only' },
                { icon:'💰', label:'Entry Fee', value: settings.registrationType === 'open' ? `₹${settings.entryFee}` : 'Free/Contact' },
                { icon:'🏏', label:'Overs', value: `${settings.overs || 8} overs` },
              ].map((chip, i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:20,
                  backgroundColor:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)'
                }}>
                  <span style={{fontSize:'0.85rem'}}>{chip.icon}</span>
                  <div>
                    <div style={{fontSize:'0.58rem', color:'var(--text-muted)', lineHeight:1}}>{chip.label}</div>
                    <div style={{fontSize:'0.75rem', fontWeight:'600', color:'var(--text-primary)'}}>{chip.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {settings.registrationType === 'contact' && (
              <div style={{marginTop: 14, padding: '10px 12px', background:'rgba(59,130,246,0.06)', border:'1px solid rgba(59,130,246,0.2)', borderRadius: 10, fontSize: '0.8rem'}}>
                <p style={{fontWeight: '700', marginBottom: 6, color:'#60A5FA'}}>📬 Organizer Contact</p>
                {settings.contactPhone && <div style={{color:'var(--text-secondary)', marginBottom:2}}>📞 {settings.contactPhone}</div>}
                {settings.instagramUrl && <div style={{color:'var(--text-secondary)'}}>📸 {settings.instagramUrl}</div>}
              </div>
            )}
          </div>

          <div className="sporty-card" style={{padding: 16}}>
            <div className="flex-between">
              <h3 style={{fontSize: '1.1rem'}}>Teams Registration ({registeredCount} / {settings.maxTeams})</h3>
              {userRole === 'admin' && !isStarted && (
                <button 
                  onClick={handleStartTournament}
                  className="btn-neon" 
                  style={{padding: '6px 12px', fontSize: '0.75rem'}}
                >
                  Start Tournament 🏁
                </button>
              )}
            </div>

            {/* Glowing progress bar */}
            <div style={{marginTop: 12, marginBottom: 14}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
                <span style={{fontSize:'0.7rem', color:'var(--text-muted)'}}>Registration Progress</span>
                <span style={{fontSize:'0.7rem', fontWeight:'700', color: registeredCount >= settings.maxTeams ? '#EF4444' : 'var(--primary)'}}>
                  {registeredCount} / {settings.maxTeams} Teams
                </span>
              </div>
              <div style={{height:8, backgroundColor:'rgba(255,255,255,0.08)', borderRadius:4, overflow:'hidden', position:'relative'}}>
                <div style={{
                  width:`${Math.min(100,(registeredCount/settings.maxTeams)*100)}%`,
                  height:'100%',
                  background: registeredCount >= settings.maxTeams
                    ? 'linear-gradient(90deg,#EF4444,#F97316)'
                    : 'linear-gradient(90deg, var(--primary), #00e5ff)',
                  borderRadius:4,
                  boxShadow: '0 0 8px rgba(170,255,0,0.4)',
                  transition:'width 0.4s ease'
                }} />
              </div>
            </div>

            {!isStarted ? (
              <div style={{display: 'flex', gap: 10}}>
                {settings.registrationType === 'open' ? (
                  registeredCount < settings.maxTeams ? (
                    <button 
                      onClick={() => {
                        setTeamName('');
                        setRoster([userName || 'Yaksh']);
                        setAgreeTerms(false);
                        setShowPayment(false);
                        setRegStep(1);
                        setShowRegModal(true);
                      }}
                      className="btn-neon" 
                      style={{width: '100%'}}
                    >
                      Register My Team (₹{settings.entryFee}) ⚽
                    </button>
                  ) : (
                    <button className="btn-neon" style={{width: '100%', opacity: 0.6}} disabled>
                      Registration Full
                    </button>
                  )
                ) : (
                  <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: 6}}>
                    <p style={{fontSize: '0.78rem', color: 'var(--text-muted)'}}>
                      This tournament is Invite Only. To register your team, contact the venue owner:
                    </p>
                    <div style={{display: 'flex', gap: 10, marginTop: 4}}>
                      {settings.contactPhone && (
                        <a 
                          href={`tel:${settings.contactPhone}`} 
                          className="btn-neon" 
                          style={{flex: 1, textDecoration: 'none', textAlign: 'center', padding: '10px 0', fontSize: '0.8rem'}}
                        >
                          📞 Call Owner
                        </a>
                      )}
                      {settings.instagramUrl && (
                        <a 
                          href={settings.instagramUrl.startsWith('http') ? settings.instagramUrl : `https://instagram.com/${settings.instagramUrl.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="btn-neon" 
                          style={{flex: 1, textDecoration: 'none', textAlign: 'center', padding: '10px 0', fontSize: '0.8rem', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', borderColor: '#cc2366'}}
                        >
                          📸 Instagram
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {userRole === 'admin' && registeredCount < settings.maxTeams && (
                  <button 
                    onClick={() => {
                      setTeamName('');
                      setRoster([]);
                      setAgreeTerms(true);
                      setShowPayment(false);
                      setRegStep(1);
                      setShowRegModal(true);
                    }}
                    style={{
                      backgroundColor: 'var(--bg-surface)', 
                      color: 'var(--text-primary)', 
                      border: '1px solid var(--border-light)',
                      borderRadius: 8,
                      padding: '10px 14px',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    + Add Team Manually
                  </button>
                )}
              </div>
            ) : (
              <div style={{padding: 10, backgroundColor: 'rgba(170,255,0,0.05)', border: '1px solid rgba(170,255,0,0.2)', borderRadius: 6, textAlign: 'center', fontSize: '0.8rem', color: 'var(--primary)'}}>
                🔒 Tournament in Progress. Registrations closed.
              </div>
            )}
          </div>

          <div className="sporty-card" style={{padding: 16}}>
            <h3 style={{fontSize: '1.1rem', marginBottom: 12}}>Registered Teams</h3>
            {settings.teamsRegistered && settings.teamsRegistered.length > 0 ? (
              <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                {settings.teamsRegistered.map((t, idx) => (
                  <TeamRosterExpandableCard 
                    key={idx} 
                    team={t} 
                    index={idx} 
                    maxPlayers={settings.maxPlayers}
                    userRole={userRole}
                    onEdit={() => {
                      setEditingTeamIndex(idx);
                      setEditTeamName(t.teamName);
                      setEditTeamCaptain(t.captainName);
                      setEditTeamPhone(t.captainPhone || '');
                      setEditTeamRoster(t.players || []);
                    }}
                    onDelete={async () => {
                      const confirm = await showConfirm('Remove Team', `Are you sure you want to remove team "${t.teamName}" from the tournament?`);
                      if (confirm) {
                        const updatedTeams = settings.teamsRegistered.filter((_, i) => i !== idx);
                        const updatedTournament = {
                          ...tournament,
                          bracket: {
                            ...(tournament.bracket || {}),
                            settings: {
                              ...(settings || {}),
                              teamsRegistered: updatedTeams
                            },
                            history: [
                              ...(tournament.bracket?.history || []),
                              { timestamp: new Date().toLocaleString(), text: `Team "${t.teamName}" removed by administrator.` }
                            ]
                          }
                        };
                        updateTournament(updatedTournament);
                        await showAlert('Removed', `Team "${t.teamName}" removed successfully.`);
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: 20}}>
                No teams registered yet. Be the first to join!
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'bracket' && (
        <div style={{...styles.bracketContainer, alignItems:'flex-start'}}>

          {/* Stage header color map */}
          {(() => {
            const stageConfig = [
              { key:'octafinals', data: tournament.bracket?.octafinals, label:'Round of 16', emoji:'⚡', color:'#6366F1' },
              { key:'quarterFinals', data: tournament.bracket?.quarterFinals, label:'Quarterfinals', emoji:'🔥', color:'#F97316' },
              { key:'semiFinals', data: tournament.bracket?.semiFinals, label:'Semifinals', emoji:'⭐', color:'#EAB308' },
              { key:'final', data: tournament.bracket?.final ? [tournament.bracket.final] : null, label:'Grand Final', emoji:'🏆', color:'#EF4444' },
            ].filter(s => s.data && (Array.isArray(s.data) ? s.data.length > 0 : true));

            return stageConfig.map((stage, si) => (
              <div key={stage.key} style={{...styles.bracketColumn, position:'relative'}}>
                {/* Stage header chip */}
                <div style={{
                  display:'flex', alignItems:'center', gap:6, padding:'6px 12px',
                  borderRadius: 20, marginBottom: 4, width:'fit-content',
                  background: stage.color + '18',
                  border: `1px solid ${stage.color}44`
                }}>
                  <span style={{fontSize:'0.75rem'}}>{stage.emoji}</span>
                  <span style={{fontSize:'0.68rem', fontWeight:'800', color: stage.color, textTransform:'uppercase', letterSpacing:0.5}}>{stage.label}</span>
                </div>

                <div style={{display:'flex', flexDirection:'column', gap:12}}>
                  {(Array.isArray(stage.data) ? stage.data : [stage.data]).map(m => renderMatchNode(m))}
                </div>

                {/* Champion card */}
                {stage.key === 'final' && tournament.bracket?.final?.winner && (
                  <div style={{
                    marginTop: 16, textAlign:'center', padding:'16px 12px',
                    background:'linear-gradient(135deg, rgba(234,179,8,0.15), rgba(251,146,60,0.08))',
                    border:'1px solid rgba(234,179,8,0.35)', borderRadius:14,
                    boxShadow:'0 0 24px rgba(234,179,8,0.15)'
                  }}>
                    <div style={{fontSize:'2rem', marginBottom:4}}>🏆</div>
                    <div style={{fontSize:'0.6rem', fontWeight:'800', letterSpacing:2, textTransform:'uppercase', color:'var(--text-muted)', marginBottom:4}}>Champion</div>
                    <div style={{fontSize:'1rem', fontWeight:'900', color:'#F59E0B'}}>{tournament.bracket.final.winner}</div>
                    <div style={{fontSize:'0.65rem', color:'var(--text-muted)', marginTop:4}}>🎉 Tournament Winners!</div>
                  </div>
                )}
              </div>
            ));
          })()}

          {!isStarted && (
            <div style={{textAlign:'center', padding:'40px 20px', width:'100%'}}>
              <div style={{fontSize:'3rem', marginBottom:12}}>🗺️</div>
              <p style={{fontSize:'0.9rem', fontWeight:'600', color:'var(--text-primary)', marginBottom:4}}>Roadmap Not Generated</p>
              <p style={{fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:20}}>Register at least 2 teams, then generate the bracket.</p>
              {userRole === 'admin' && (
                <button onClick={handleStartTournament} className="btn-neon" style={{padding:'10px 24px'}}>
                  🚀 Generate Bracket
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'standings' && (
        <div>
          {/* Header */}
          <div style={{marginBottom:12, display:'flex', alignItems:'center', gap:8}}>
            <span style={{fontSize:'1.1rem'}}>📊</span>
            <h3 style={{fontSize:'1rem', fontWeight:'700', color:'var(--text-primary)'}}>Points Table</h3>
          </div>
          {standings.length > 0 ? (
            <div style={{overflowX:'auto', borderRadius:12, border:'1px solid rgba(255,255,255,0.06)', overflow:'hidden'}}>
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:'0.8rem', color:'var(--text-primary)'}}>
                <thead>
                  <tr style={{background:'linear-gradient(90deg, rgba(170,255,0,0.08), rgba(0,229,255,0.05))', borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                    <th style={{padding:'10px 12px', textAlign:'left', color:'var(--text-muted)', fontWeight:'700', fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:0.8, width:36}}>#</th>
                    <th style={{padding:'10px 8px', textAlign:'left', color:'var(--text-muted)', fontWeight:'700', fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:0.8}}>Team</th>
                    <th style={{padding:'10px 6px', textAlign:'center', color:'var(--text-muted)', fontWeight:'700', fontSize:'0.65rem', width:30}}>M</th>
                    <th style={{padding:'10px 6px', textAlign:'center', color:'#22C55E', fontWeight:'700', fontSize:'0.65rem', width:30}}>W</th>
                    <th style={{padding:'10px 6px', textAlign:'center', color:'#EF4444', fontWeight:'700', fontSize:'0.65rem', width:30}}>L</th>
                    <th style={{padding:'10px 6px', textAlign:'center', color:'var(--text-muted)', fontWeight:'700', fontSize:'0.65rem', width:30}}>NR</th>
                    <th style={{padding:'10px 8px', textAlign:'center', color:'var(--primary)', fontWeight:'800', fontSize:'0.7rem', width:40}}>PTS</th>
                    <th style={{padding:'10px 12px', textAlign:'right', color:'var(--text-muted)', fontWeight:'700', fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:0.8}}>NRR</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((t, idx) => {
                    const medalBg = idx === 0
                      ? 'rgba(234,179,8,0.07)'
                      : idx === 1 ? 'rgba(148,163,184,0.06)'
                      : idx === 2 ? 'rgba(180,100,50,0.06)' : 'transparent';
                    const medalBorder = idx === 0
                      ? '2px solid rgba(234,179,8,0.3)'
                      : idx === 1 ? '2px solid rgba(148,163,184,0.2)'
                      : idx === 2 ? '2px solid rgba(180,100,50,0.2)' : '2px solid transparent';
                    const posLabel = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : t.pos;
                    const teamColor = getTeamColor(t.team);
                    const nrrVal = parseFloat(t.nrr);
                    const nrrPositive = nrrVal >= 0;
                    const nrrBarWidth = Math.min(100, Math.abs(nrrVal) * 25);
                    return (
                      <tr key={idx} style={{
                        borderBottom:'1px solid rgba(255,255,255,0.04)',
                        backgroundColor: medalBg,
                        borderLeft: medalBorder
                      }}>
                        <td style={{padding:'11px 12px', fontSize: idx < 3 ? '1rem' : '0.8rem', textAlign:'center'}}>{posLabel}</td>
                        <td style={{padding:'11px 8px'}}>
                          <div style={{display:'flex', alignItems:'center', gap:8}}>
                            <div style={{
                              width:26, height:26, borderRadius:7, flexShrink:0,
                              backgroundColor: teamColor + '20', border:`2px solid ${teamColor}55`,
                              display:'flex', alignItems:'center', justifyContent:'center',
                              fontSize:'0.6rem', fontWeight:'800', color: teamColor
                            }}>{t.team.slice(0,2)}</div>
                            <div>
                              <div style={{fontWeight:'700', fontSize:'0.8rem', color:'var(--text-primary)'}}>{t.team}</div>
                              <div style={{display:'flex', gap:3, marginTop:2}}>
                                {Array.from({length: t.won}).map((_,i) => <span key={i} style={{fontSize:'0.5rem', padding:'1px 4px', borderRadius:3, backgroundColor:'rgba(34,197,94,0.15)', color:'#22C55E', fontWeight:'700'}}>W</span>)}
                                {Array.from({length: t.lost}).map((_,i) => <span key={i} style={{fontSize:'0.5rem', padding:'1px 4px', borderRadius:3, backgroundColor:'rgba(239,68,68,0.15)', color:'#EF4444', fontWeight:'700'}}>L</span>)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{textAlign:'center', padding:'11px 6px', color:'var(--text-muted)', fontSize:'0.8rem'}}>{t.played}</td>
                        <td style={{textAlign:'center', padding:'11px 6px', color:'#22C55E', fontWeight:'700', fontSize:'0.8rem'}}>{t.won}</td>
                        <td style={{textAlign:'center', padding:'11px 6px', color:'#EF4444', fontWeight:'700', fontSize:'0.8rem'}}>{t.lost}</td>
                        <td style={{textAlign:'center', padding:'11px 6px', color:'var(--text-muted)', fontSize:'0.8rem'}}>{t.nr}</td>
                        <td style={{textAlign:'center', padding:'11px 8px'}}>
                          <span style={{
                            fontWeight:'800', fontSize:'0.9rem',
                            color: idx < 2 ? 'var(--primary)' : 'var(--text-primary)'
                          }}>{t.points}</span>
                        </td>
                        <td style={{padding:'11px 12px'}}>
                          <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:3}}>
                            <span style={{fontSize:'0.75rem', fontWeight:'700', color: nrrPositive ? '#10B981' : '#EF4444'}}>
                              {nrrPositive ? `+${t.nrr}` : t.nrr}
                            </span>
                            <div style={{width:40, height:3, borderRadius:2, backgroundColor:'rgba(255,255,255,0.08)', overflow:'hidden'}}>
                              <div style={{
                                width:`${nrrBarWidth}%`, height:'100%', borderRadius:2,
                                backgroundColor: nrrPositive ? '#10B981' : '#EF4444'
                              }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{textAlign:'center', padding:'32px 20px', border:'1px dashed rgba(255,255,255,0.08)', borderRadius:12}}>
              <div style={{fontSize:'2.5rem', marginBottom:8}}>📊</div>
              <p style={{fontSize:'0.85rem', fontWeight:'600', color:'var(--text-primary)', marginBottom:4}}>No Standings Yet</p>
              <p style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>Register teams and play matches to build the points table.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          <div style={{marginBottom:14, display:'flex', alignItems:'center', gap:8}}>
            <span style={{fontSize:'1.1rem'}}>📜</span>
            <h3 style={{fontSize:'1rem', fontWeight:'700', color:'var(--text-primary)'}}>Tournament Timeline</h3>
          </div>
          {getTourHistory(tournament).length === 0 ? (
            <div style={{textAlign:'center', padding:'32px 20px', border:'1px dashed rgba(255,255,255,0.08)', borderRadius:12}}>
              <p style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>No events recorded yet.</p>
            </div>
          ) : (
            <div style={{display:'flex', flexDirection:'column', gap:0, position:'relative'}}>
              <div style={{position:'absolute', left:16, top:20, bottom:20, width:2, background:'linear-gradient(to bottom, var(--primary), rgba(170,255,0,0.1))', zIndex:0}} />
              {getTourHistory(tournament).map((h, hidx) => {
                const isChamp = h.text && h.text.includes('champion');
                const isStart = h.text && (h.text.includes('started') || h.text.includes('bracket'));
                const isReg = h.text && h.text.includes('registered');
                const dotColor = isChamp ? '#F59E0B' : isStart ? '#3B82F6' : isReg ? '#22C55E' : 'var(--primary)';
                const bgColor = isChamp ? 'rgba(245,158,11,0.06)' : isStart ? 'rgba(59,130,246,0.05)' : isReg ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.02)';
                return (
                  <div key={hidx} style={{display:'flex', gap:16, alignItems:'flex-start', paddingBottom:16, position:'relative', zIndex:1}}>
                    <div style={{
                      width:32, height:32, borderRadius:'50%', flexShrink:0,
                      backgroundColor: dotColor + '20', border:`2px solid ${dotColor}`,
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem'
                    }}>
                      {isChamp ? '🏆' : isStart ? '🚀' : isReg ? '✅' : '📌'}
                    </div>
                    <div style={{
                      flex:1, padding:'10px 14px', borderRadius:10,
                      backgroundColor: bgColor,
                      border:`1px solid ${dotColor}22`
                    }}>
                      <div style={{fontSize:'0.65rem', color:'var(--text-muted)', marginBottom:3}}>{h.timestamp}</div>
                      <div style={{fontSize:'0.82rem', color:'var(--text-primary)', lineHeight:1.4}}>{h.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      </div>{/* end padding wrapper */}

      {/* Registration Modal Overlay */}
      {showRegModal && (() => {
        const totalSteps = (settings.entryFee > 0 && userRole !== 'admin') ? 3 : 2;
        const modalTitle = regStep === 1 
          ? `Register Team (Step 1/${totalSteps})` 
          : regStep === 2 
            ? `Terms & Conditions (Step 2/${totalSteps})` 
            : `Payment Verification (Step 3/3)`;

        const renderRegStepIndicators = () => {
          const steps = [
            { num: 1, label: 'Roster' },
            { num: 2, label: 'Terms' },
            ...(settings.entryFee > 0 && userRole !== 'admin' ? [{ num: 3, label: 'Payment' }] : [])
          ];
          return (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              position: 'relative',
              padding: '0 10px'
            }}>
              <div style={{
                position: 'absolute',
                top: 12,
                left: 20,
                right: 20,
                height: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                zIndex: 1
              }} />
              <div style={{
                position: 'absolute',
                top: 12,
                left: 20,
                width: `${steps.length > 1 ? ((regStep - 1) / (steps.length - 1)) * 90 : 0}%`,
                height: 2,
                backgroundColor: 'var(--primary)',
                transition: 'width 0.3s ease',
                zIndex: 2
              }} />
              {steps.map(s => {
                const isActive = regStep === s.num;
                const isCompleted = regStep > s.num;
                return (
                  <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3 }}>
                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? 'var(--primary)' : (isActive ? 'var(--bg-surface-solid)' : 'var(--bg-secondary)'),
                      border: isActive || isCompleted ? '2px solid var(--primary)' : '2px solid var(--border-light)',
                      color: isCompleted ? '#000' : (isActive ? 'var(--primary)' : 'var(--text-muted)'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      transition: 'all 0.3s ease',
                      boxShadow: isActive ? '0 0 8px rgba(170, 255, 0, 0.25)' : 'none'
                    }}>
                      {isCompleted ? '✓' : s.num}
                    </div>
                    <span style={{ fontSize: '0.65rem', color: isActive ? 'var(--primary)' : 'var(--text-muted)', marginTop: 4 }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        };

        const renderSimulatedQRCode = () => {
          return (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              padding: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-light)',
              borderRadius: 12,
              margin: '8px 0',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative scan line overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '3px',
                backgroundColor: 'var(--primary)',
                boxShadow: '0 0 8px var(--primary)',
                animation: 'scanAnimation 2.5s infinite linear',
                zIndex: 10
              }} />

              <div style={{
                width: 130,
                height: 130,
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}>
                {/* Mock QR corners */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ width: 26, height: 26, border: '5px solid #0f172a', borderRadius: 4 }} />
                  <div style={{ width: 26, height: 26, border: '5px solid #0f172a', borderRadius: 4 }} />
                </div>
                {/* Middle mock graphics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '6px 0', alignItems: 'center' }}>
                  <div style={{ width: '85%', height: 5, backgroundColor: '#0f172a', borderRadius: 2 }} />
                  <div style={{ width: '65%', height: 5, backgroundColor: '#0f172a', borderRadius: 2 }} />
                  <div style={{ width: '75%', height: 5, backgroundColor: '#0f172a', borderRadius: 2 }} />
                  <div style={{ width: '55%', height: 5, backgroundColor: '#0f172a', borderRadius: 2 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ width: 26, height: 26, border: '5px solid #0f172a', borderRadius: 4 }} />
                  <div style={{ width: 14, height: 14, backgroundColor: '#0f172a', borderRadius: 2 }} />
                </div>
              </div>
              
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                UPI ID: <span style={{ color: 'var(--primary)' }}>playfinity@upi</span>
              </span>
            </div>
          );
        };

        return (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}>
            <style>{`
              @keyframes scanAnimation {
                0% { top: 0%; }
                50% { top: 100%; }
                100% { top: 0%; }
              }
            `}</style>
            <div className="sporty-card" style={{
              width: '100%',
              maxWidth: 420,
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              border: '1px solid var(--border-light)'
            }}>
              <div className="flex-between">
                <h3 style={{fontSize: '1.2rem', color: 'var(--text-primary)'}}>
                  {modalTitle}
                </h3>
                <button 
                  onClick={() => setShowRegModal(false)}
                  style={{background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer'}}
                >
                  ✕
                </button>
              </div>

              {renderRegStepIndicators()}

              {regStep === 1 && (
                <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                  {myTeams && myTeams.length > 0 && (
                    <div className="form-group" style={{ marginBottom: 4 }}>
                      <label className="form-label" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>⚡ Auto-fill from My Teams</label>
                      <select
                        className="form-input"
                        style={{ backgroundColor: 'rgba(170,255,0,0.04)', borderColor: 'var(--primary)', color: 'var(--text-primary)' }}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!val) return;
                          const selected = myTeams.find(t => t.id === val);
                          if (selected) {
                            setTeamName(selected.name);
                            setCaptainName(selected.captain || userName);
                            const playerNames = selected.players ? selected.players.map(p => p.name) : [];
                            if (selected.captain && !playerNames.includes(selected.captain)) {
                              playerNames.unshift(selected.captain);
                            }
                            setRoster(playerNames.length > 0 ? playerNames : [selected.captain || userName]);
                          }
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled style={{ color: '#000' }}>-- Select a team to load --</option>
                        {myTeams.map(team => (
                          <option key={team.id} value={team.id} style={{ color: '#000' }}>
                            {team.name} ({team.players?.length || 0} players)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Team Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Kopar Kings" 
                      className="form-input"
                      value={teamName}
                      onChange={e => setTeamName(e.target.value.toUpperCase())}
                    />
                  </div>

                  <div style={{display: 'flex', gap: 10}}>
                    <div className="form-group" style={{flex: 1}}>
                      <label className="form-label">Captain Name</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={captainName}
                        disabled={userRole !== 'admin'}
                        onChange={e => setCaptainName(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{flex: 1}}>
                      <label className="form-label">Captain Phone</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={captainPhone}
                        disabled={userRole !== 'admin'}
                        onChange={e => setCaptainPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Team Roster ({roster.length} / {settings.maxPlayers} players)</label>
                    <div style={{display: 'flex', gap: 8, marginBottom: 8}}>
                      <input 
                        type="text" 
                        placeholder="Enter Player Name" 
                        className="form-input" 
                        value={newPlayer}
                        onChange={e => setNewPlayer(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newPlayer.trim()) {
                              if (roster.length >= settings.maxPlayers) {
                                showError('Player Limit', `Maximum player limit is ${settings.maxPlayers}!`);
                                return;
                              }
                              setRoster([...roster, newPlayer.trim()]);
                              setNewPlayer('');
                            }
                          }
                        }}
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          if (newPlayer.trim()) {
                            if (roster.length >= settings.maxPlayers) {
                              showError('Player Limit', `Maximum player limit is ${settings.maxPlayers}!`);
                              return;
                            }
                            setRoster([...roster, newPlayer.trim()]);
                            setNewPlayer('');
                          }
                        }}
                        className="btn-neon" 
                        style={{padding: '0 14px', fontSize: '0.8rem'}}
                      >
                        Add
                      </button>
                    </div>
                    
                    {/* Player chips */}
                    <div style={{display:'flex', flexWrap:'wrap', gap:6, minHeight:44, border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, padding:8, backgroundColor:'rgba(0,0,0,0.12)'}}>
                      {roster.length === 0 && <span style={{fontSize:'0.75rem', color:'var(--text-muted)', alignSelf:'center'}}>No players added yet...</span>}
                      {roster.map((player, idx) => {
                        const chipColor = getTeamColor(player);
                        return (
                          <div key={idx} style={{
                            display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:20,
                            backgroundColor: chipColor + '18', border:`1px solid ${chipColor}44`
                          }}>
                            <span style={{width:16, height:16, borderRadius:'50%', backgroundColor: chipColor+'33', border:`1.5px solid ${chipColor}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.5rem', fontWeight:'800', color:chipColor, flexShrink:0}}>
                              {idx+1}
                            </span>
                            <span style={{fontSize:'0.75rem', fontWeight:'600', color:'var(--text-primary)'}}>{player}</span>
                            {idx === 0 && <span style={{fontSize:'0.55rem', fontWeight:'700', color:'var(--primary)', backgroundColor:'rgba(170,255,0,0.1)', padding:'1px 4px', borderRadius:4}}>C</span>}
                            {idx > 0 && (
                              <button type="button" onClick={() => setRoster(roster.filter((_,rIdx) => rIdx !== idx))}
                                style={{background:'none', border:'none', color:'rgba(239,68,68,0.7)', cursor:'pointer', fontSize:'0.7rem', padding:0, lineHeight:1, marginLeft:2}}>✕</button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => {
                      if (!teamName.trim()) {
                        showError('Registration Error', 'Please enter your team name!');
                        return;
                      }
                      if (roster.length === 0) {
                        showError('Registration Error', 'Please add at least 1 player to your team roster!');
                        return;
                      }
                      setRegStep(2);
                    }}
                    className="btn-neon" 
                    style={{marginTop: 10, width: '100%', padding: '12px 0'}}
                  >
                    Continue to Terms ⚡
                  </button>
                </div>
              )}

              {regStep === 2 && (
                <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                  <div className="form-group">
                    <label className="form-label">Terms & Conditions</label>
                    <div style={{
                      maxHeight: 160, 
                      overflowY: 'auto', 
                      fontSize: '0.75rem', 
                      color: 'var(--text-muted)', 
                      border: '1px solid rgba(255,255,255,0.06)', 
                      borderRadius: 6, 
                      padding: 8, 
                      backgroundColor: 'rgba(0,0,0,0.15)',
                      lineHeight: '1.4'
                    }}>
                      {settings.termsText}
                    </div>
                  </div>

                  <div style={{display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 4}}>
                    <input 
                      type="checkbox" 
                      id="agreeTerms" 
                      checked={agreeTerms} 
                      onChange={e => setAgreeTerms(e.target.checked)} 
                      style={{marginTop: 3}}
                    />
                    <label htmlFor="agreeTerms" style={{fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer'}}>
                      I agree to the tournament Terms & Conditions and understand all guidelines.
                    </label>
                  </div>

                  <div style={{display: 'flex', gap: 10, marginTop: 10}}>
                    <button 
                      type="button"
                      onClick={() => setRegStep(1)}
                      style={{
                        flex: 1, 
                        backgroundColor: 'var(--bg-surface)', 
                        color: 'var(--text-primary)', 
                        border: '1px solid var(--border-light)',
                        borderRadius: 8,
                        cursor: 'pointer',
                        padding: '12px 0'
                      }}
                    >
                      Back
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        if (!agreeTerms) {
                          showError('Registration Error', 'You must agree to the Terms & Conditions!');
                          return;
                        }
                        
                        if (userRole === 'admin' || settings.entryFee === 0) {
                          handleCompleteRegistration('N/A');
                        } else {
                          setRegStep(3);
                        }
                      }}
                      className="btn-neon" 
                      style={{flex: 2, padding: '12px 0'}}
                    >
                      {userRole === 'admin' || settings.entryFee === 0 ? 'Register Team 🏁' : 'Proceed to Payment 💳'}
                    </button>
                  </div>
                </div>
              )}

              {regStep === 3 && (
                <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
                  <div style={{textAlign: 'center', padding: '5px 0'}}>
                    <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>ENTRY FEE AMOUNT</span>
                    <h2 className="text-gold" style={{fontSize: '2rem', margin: '4px 0'}}>₹{settings.entryFee}</h2>
                    <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Registering: "{teamName}"</p>
                  </div>

                  {renderSimulatedQRCode()}

                  <div className="form-group">
                    <label className="form-label">Transaction Reference ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. txn-12345 or UPI Ref" 
                      className="form-input" 
                      value={payUpi}
                      onChange={e => setPayUpi(e.target.value)}
                    />
                    <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 4, display: 'block'}}>
                      Enter the transaction verification ID from your UPI app.
                    </span>
                  </div>

                  {isRegistering ? (
                    <div style={{textAlign: 'center', padding: 10}}>
                      <span style={{fontSize: '0.8rem', color: 'var(--primary)'}}>⏳ Verifying Payment & Completing Registration...</span>
                    </div>
                  ) : (
                    <div style={{display: 'flex', gap: 10}}>
                      <button 
                        type="button" 
                        onClick={() => setRegStep(2)}
                        style={{
                          flex: 1, 
                          backgroundColor: 'var(--bg-surface)', 
                          color: 'var(--text-primary)', 
                          border: '1px solid var(--border-light)',
                          borderRadius: 8,
                          cursor: 'pointer',
                          padding: '12px 0'
                        }}
                      >
                        Back
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          if (!payUpi.trim()) {
                            showError('Payment Error', 'Please enter your UPI reference or transaction ID!');
                            return;
                          }
                          handleCompleteRegistration(payUpi.trim());
                        }}
                        className="btn-neon" 
                        style={{flex: 2, padding: '12px 0'}}
                      >
                        Verify & Pay 🏁
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Admin Edit Tournament Modal Overlay */}
      {showEditTourModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16
        }}>
          <div className="sporty-card" style={{
            width: '100%',
            maxWidth: 420,
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            border: '2px solid var(--primary)',
            backgroundColor: 'var(--bg-surface)'
          }}>
            <div className="flex-between">
              <h3 style={{fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: '800'}}>
                ⚙️ Edit Tournament
              </h3>
              <button 
                onClick={() => setShowEditTourModal(false)}
                style={{background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer'}}
              >
                ✕
              </button>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
              <div className="form-group">
                <label className="form-label">Tournament Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={editTourName}
                  onChange={e => setEditTourName(e.target.value)}
                />
              </div>

              <div style={{display: 'flex', gap: 10}}>
                <div className="form-group" style={{flex: 1}}>
                  <label className="form-label">Format</label>
                  <select 
                    className="form-input" 
                    value={editTourFormat}
                    onChange={e => setEditTourFormat(e.target.value)}
                    style={{ color: '#000' }}
                  >
                    <option value="Knockout">Knockout</option>
                    <option value="League">League</option>
                    <option value="Round Robin">Round Robin</option>
                  </select>
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label className="form-label">Max Teams</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={editMaxTeams}
                    onChange={e => setEditMaxTeams(parseInt(e.target.value) || 8)}
                  />
                </div>
              </div>

              <div style={{display: 'flex', gap: 10}}>
                <div className="form-group" style={{flex: 1}}>
                  <label className="form-label">Players per Team</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={editMaxPlayers}
                    onChange={e => setEditMaxPlayers(parseInt(e.target.value) || 11)}
                  />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label className="form-label">Overs</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={editOvers}
                    onChange={e => setEditOvers(parseInt(e.target.value) || 8)}
                  />
                </div>
              </div>

              <div style={{display: 'flex', gap: 10}}>
                <div className="form-group" style={{flex: 1}}>
                  <label className="form-label">Entry Fee (₹)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={editEntryFee}
                    onChange={e => setEditEntryFee(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label className="form-label">Registration Type</label>
                  <select 
                    className="form-input" 
                    value={editRegType}
                    onChange={e => setEditRegType(e.target.value)}
                    style={{ color: '#000' }}
                  >
                    <option value="open">Open Online</option>
                    <option value="contact">Invite/Contact Only</option>
                  </select>
                </div>
              </div>

              <div style={{display: 'flex', gap: 10}}>
                <div className="form-group" style={{flex: 1}}>
                  <label className="form-label">Organizer Phone</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label className="form-label">Instagram Profile</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editInsta}
                    onChange={e => setEditInsta(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Rules & Terms</label>
                <textarea 
                  className="form-input" 
                  style={{ minHeight: 80, fontSize: '0.75rem', fontFamily: 'inherit' }}
                  value={editTerms}
                  onChange={e => setEditTerms(e.target.value)}
                />
              </div>

              <button 
                type="button"
                onClick={async () => {
                  if (!editTourName.trim()) {
                    showError('Input Error', 'Please enter a tournament name!');
                    return;
                  }

                  const updatedTournament = {
                    ...tournament,
                    name: editTourName.trim(),
                    format: editTourFormat,
                    bracket: {
                      ...(tournament.bracket || {}),
                      settings: {
                        ...(settings || {}),
                        maxTeams: editMaxTeams,
                        maxPlayers: editMaxPlayers,
                        overs: editOvers,
                        entryFee: editEntryFee,
                        registrationType: editRegType,
                        contactPhone: editPhone.trim(),
                        instagramUrl: editInsta.trim(),
                        termsText: editTerms.trim()
                      },
                      history: [
                        ...(tournament.bracket?.history || []),
                        { timestamp: new Date().toLocaleString(), text: 'Tournament settings updated by organizer.' }
                      ]
                    }
                  };

                  updateTournament(updatedTournament);
                  setShowEditTourModal(false);
                  await showAlert('Success', 'Tournament settings updated!');
                }}
                className="btn-neon" 
                style={{marginTop: 10, width: '100%', padding: '12px 0'}}
              >
                Save Settings ⚡
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Edit Team Modal Overlay */}
      {editingTeamIndex !== null && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16
        }}>
          <div className="sporty-card" style={{
            width: '100%',
            maxWidth: 420,
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            border: '2px solid var(--primary)',
            backgroundColor: 'var(--bg-surface)'
          }}>
            <div className="flex-between">
              <h3 style={{fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: '800'}}>
                ✏️ Edit Registered Team
              </h3>
              <button 
                onClick={() => setEditingTeamIndex(null)}
                style={{background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer'}}
              >
                ✕
              </button>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
              <div className="form-group">
                <label className="form-label">Team Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={editTeamName}
                  onChange={e => setEditTeamName(e.target.value.toUpperCase())}
                />
              </div>

              <div style={{display: 'flex', gap: 10}}>
                <div className="form-group" style={{flex: 1}}>
                  <label className="form-label">Captain Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editTeamCaptain}
                    onChange={e => setEditTeamCaptain(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label className="form-label">Captain Phone</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editTeamPhone}
                    onChange={e => setEditTeamPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Roster Editing */}
              <div className="form-group">
                <label className="form-label">Roster / Players ({editTeamRoster.length} registered)</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input 
                    type="text" 
                    placeholder="Player Name"
                    className="form-input"
                    value={editTeamNewPlayer}
                    onChange={e => setEditTeamNewPlayer(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!editTeamNewPlayer.trim()) return;
                      if (editTeamRoster.includes(editTeamNewPlayer.trim())) {
                        showError('Duplicate', 'Player already in roster.');
                        return;
                      }
                      setEditTeamRoster([...editTeamRoster, editTeamNewPlayer.trim()]);
                      setEditTeamNewPlayer('');
                    }}
                    className="btn-neon"
                    style={{ padding: '0 16px', fontSize: '0.8rem', width: 'auto' }}
                  >
                    Add
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 120, overflowY: 'auto', padding: 4, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 6 }}>
                  {editTeamRoster.map((player, pidx) => (
                    <span 
                      key={pidx} 
                      style={{ 
                        fontSize: '0.75rem', 
                        padding: '2px 6px', 
                        backgroundColor: 'var(--bg-card)', 
                        color: 'var(--text-primary)', 
                        borderRadius: 4,
                        border: '1px solid var(--border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      👤 {player}
                      <span 
                        onClick={() => setEditTeamRoster(editTeamRoster.filter((_, i) => i !== pidx))}
                        style={{ color: 'var(--danger)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem', marginLeft: 2 }}
                      >
                        ×
                      </span>
                    </span>
                  ))}
                  {editTeamRoster.length === 0 && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: 4 }}>Roster is empty.</span>
                  )}
                </div>
              </div>

              <button 
                type="button"
                onClick={async () => {
                  if (!editTeamName.trim()) {
                    showError('Input Error', 'Please enter a team name!');
                    return;
                  }
                  if (!editTeamCaptain.trim()) {
                    showError('Input Error', 'Please enter a captain name!');
                    return;
                  }

                  const updatedTeams = [...settings.teamsRegistered];
                  updatedTeams[editingTeamIndex] = {
                    ...updatedTeams[editingTeamIndex],
                    teamName: editTeamName.trim(),
                    captainName: editTeamCaptain.trim(),
                    captainPhone: editTeamPhone.trim(),
                    players: editTeamRoster
                  };

                  const updatedTournament = {
                    ...tournament,
                    bracket: {
                      ...(tournament.bracket || {}),
                      settings: {
                        ...(settings || {}),
                        teamsRegistered: updatedTeams
                      },
                      history: [
                        ...(tournament.bracket?.history || []),
                        { timestamp: new Date().toLocaleString(), text: `Team "${editTeamName}" details updated by organizer.` }
                      ]
                    }
                  };

                  updateTournament(updatedTournament);
                  setEditingTeamIndex(null);
                  await showAlert('Success', 'Team details updated!');
                }}
                className="btn-neon" 
                style={{marginTop: 10, width: '100%', padding: '12px 0'}}
              >
                Save Changes ⚡
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Match Score Modal Overlay */}
      {editingMatch && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16
        }}>
          <div className="sporty-card" style={{
            width: '100%',
            maxWidth: 440,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            backgroundColor: 'var(--bg-surface)',
            border: '2px solid var(--primary)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), var(--primary-glow-hover)',
            borderRadius: 16,
            transform: 'none'
          }}>
            <div className="flex-between">
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Scorecard Entry
                </span>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: '4px 0 0 0', fontWeight: '800' }}>
                  {editingMatch.team1} vs {editingMatch.team2}
                </h3>
              </div>
              <button 
                onClick={() => setEditingMatch(null)}
                style={{
                  background: 'rgba(0, 0, 0, 0.04)', 
                  border: 'none', 
                  color: 'var(--text-muted)', 
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.04)'}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Scorecard Layout */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Team 1 Scorecard */}
                <div style={{
                  padding: 16,
                  borderRadius: 12,
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  border: `1px solid ${winner === editingMatch.team1 ? getTeamColor(editingMatch.team1) : 'var(--border-light)'}`,
                  boxShadow: winner === editingMatch.team1 ? `0 0 12px ${getTeamColor(editingMatch.team1)}15` : 'none',
                  transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', 
                      background: `linear-gradient(135deg, ${getTeamColor(editingMatch.team1)} 0%, rgba(255,255,255,0.8) 100%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', border: '1px solid rgba(0,0,0,0.08)'
                    }}>
                      👕
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {editingMatch.team1}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1.5 }}>
                      <label className="form-label" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Score (Runs)</label>
                      <input 
                        type="number" 
                        placeholder="Runs" 
                        className="form-input" 
                        value={score1}
                        onChange={e => setScore1(e.target.value)}
                        style={{ height: 38, fontSize: '0.9rem' }}
                      />
                    </div>
                    <div style={{ flex: 1.5 }}>
                      <label className="form-label" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Overs (e.g. 7.4)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 7.4" 
                        className="form-input" 
                        value={overs1}
                        onChange={e => setOvers1(e.target.value)}
                        style={{ height: 38, fontSize: '0.9rem' }}
                      />
                    </div>
                    <div style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 18 }}>
                      <label style={{ 
                        fontSize: '0.7rem', 
                        color: allOut1 ? 'var(--danger)' : 'var(--text-muted)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 6, 
                        cursor: 'pointer', 
                        userSelect: 'none',
                        padding: '6px 8px',
                        borderRadius: 6,
                        backgroundColor: allOut1 ? 'rgba(220, 38, 38, 0.1)' : 'rgba(0,0,0,0.03)',
                        border: `1px solid ${allOut1 ? 'rgba(220, 38, 38, 0.3)' : 'var(--border-light)'}`,
                        transition: 'all 0.2s',
                        width: '100%',
                        justifyContent: 'center',
                        fontWeight: '700'
                      }}>
                        <input 
                          type="checkbox" 
                          checked={allOut1}
                          onChange={e => setAllOut1(e.target.checked)}
                          style={{ display: 'none' }}
                        />
                        {allOut1 ? '💀 ALL OUT' : 'ALL OUT'}
                      </label>
                    </div>
                  </div>
                </div>

                {/* VS Divider */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', margin: '4px 0' }}>
                  <div style={{ position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'var(--border-light)' }} />
                  <div style={{ 
                    position: 'relative', 
                    zIndex: 1, 
                    backgroundColor: 'var(--bg-surface)', 
                    padding: '3px 12px', 
                    borderRadius: 20, 
                    fontSize: '0.7rem', 
                    fontWeight: 'bold', 
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-light)',
                    letterSpacing: '0.1em'
                  }}>
                    VS
                  </div>
                </div>

                {/* Team 2 Scorecard */}
                <div style={{
                  padding: 16,
                  borderRadius: 12,
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  border: `1px solid ${winner === editingMatch.team2 ? getTeamColor(editingMatch.team2) : 'var(--border-light)'}`,
                  boxShadow: winner === editingMatch.team2 ? `0 0 12px ${getTeamColor(editingMatch.team2)}15` : 'none',
                  transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', 
                      background: `linear-gradient(135deg, ${getTeamColor(editingMatch.team2)} 0%, rgba(255,255,255,0.8) 100%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', border: '1px solid rgba(0,0,0,0.08)'
                    }}>
                      👕
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {editingMatch.team2}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1.5 }}>
                      <label className="form-label" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Score (Runs)</label>
                      <input 
                        type="number" 
                        placeholder="Runs" 
                        className="form-input" 
                        value={score2}
                        onChange={e => setScore2(e.target.value)}
                        style={{ height: 38, fontSize: '0.9rem' }}
                      />
                    </div>
                    <div style={{ flex: 1.5 }}>
                      <label className="form-label" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Overs (e.g. 8)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 8" 
                        className="form-input" 
                        value={overs2}
                        onChange={e => setOvers2(e.target.value)}
                        style={{ height: 38, fontSize: '0.9rem' }}
                      />
                    </div>
                    <div style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 18 }}>
                      <label style={{ 
                        fontSize: '0.7rem', 
                        color: allOut2 ? 'var(--danger)' : 'var(--text-muted)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 6, 
                        cursor: 'pointer', 
                        userSelect: 'none',
                        padding: '6px 8px',
                        borderRadius: 6,
                        backgroundColor: allOut2 ? 'rgba(220, 38, 38, 0.1)' : 'rgba(0,0,0,0.03)',
                        border: `1px solid ${allOut2 ? 'rgba(220, 38, 38, 0.3)' : 'var(--border-light)'}`,
                        transition: 'all 0.2s',
                        width: '100%',
                        justifyContent: 'center',
                        fontWeight: '700'
                      }}>
                        <input 
                          type="checkbox" 
                          checked={allOut2}
                          onChange={e => setAllOut2(e.target.checked)}
                          style={{ display: 'none' }}
                        />
                        {allOut2 ? '💀 ALL OUT' : 'ALL OUT'}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '12px', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Match Schedule
                </span>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1.5 }}>
                    <label className="form-label" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 4 }}>Date & Time</label>
                    <input 
                      type="datetime-local" 
                      className="form-input" 
                      value={matchDateInput}
                      onChange={e => setMatchDateInput(e.target.value)}
                      style={{ height: 36, fontSize: '0.78rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-light)' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 4 }}>Court / Turf</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Court 1" 
                      className="form-input" 
                      value={matchCourtInput}
                      onChange={e => setMatchCourtInput(e.target.value)}
                      style={{ height: 36, fontSize: '0.78rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-light)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Tappable Winner Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label className="form-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select Winner (if match is played)</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setWinner(winner === editingMatch.team1 ? '' : editingMatch.team1)}
                    style={{
                      flex: 1,
                      padding: '12px 10px',
                      borderRadius: 10,
                      cursor: 'pointer',
                      border: `1.5px solid ${winner === editingMatch.team1 ? getTeamColor(editingMatch.team1) : 'var(--border-light)'}`,
                      backgroundColor: winner === editingMatch.team1 ? getTeamColor(editingMatch.team1) + '12' : 'var(--bg-surface)',
                      color: winner === editingMatch.team1 ? getTeamColor(editingMatch.team1) : 'var(--text-muted)',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      boxShadow: winner === editingMatch.team1 ? `0 0 10px ${getTeamColor(editingMatch.team1)}15` : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    🏆 {editingMatch.team1}
                  </button>
                  <button
                    type="button"
                    onClick={() => setWinner(winner === editingMatch.team2 ? '' : editingMatch.team2)}
                    style={{
                      flex: 1,
                      padding: '12px 10px',
                      borderRadius: 10,
                      cursor: 'pointer',
                      border: `1.5px solid ${winner === editingMatch.team2 ? getTeamColor(editingMatch.team2) : 'var(--border-light)'}`,
                      backgroundColor: winner === editingMatch.team2 ? getTeamColor(editingMatch.team2) + '12' : 'var(--bg-surface)',
                      color: winner === editingMatch.team2 ? getTeamColor(editingMatch.team2) : 'var(--text-muted)',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      boxShadow: winner === editingMatch.team2 ? `0 0 10px ${getTeamColor(editingMatch.team2)}15` : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    🏆 {editingMatch.team2}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <button 
                type="button"
                onClick={async () => {
                  const score1Num = score1 !== '' ? parseInt(score1) : '';
                  const score2Num = score2 !== '' ? parseInt(score2) : '';

                  const updatedBracket = updateMatchInBracket(
                    tournament.bracket, 
                    editingMatch.id, 
                    score1Num, 
                    score2Num, 
                    winner,
                    overs1,
                    overs2,
                    allOut1,
                    allOut2,
                    matchDateInput,
                    matchCourtInput
                  );
                  
                  let historyText = '';
                  if (winner) {
                    historyText = `Match [${editingMatch.team1} vs ${editingMatch.team2}] completed. Score: ${score1Num}-${score2Num}. Winner: ${winner}.`;
                  } else {
                    historyText = `Match [${editingMatch.team1} vs ${editingMatch.team2}] scheduled/updated. Date: ${matchDateInput ? new Date(matchDateInput).toLocaleString() : 'TBA'} • Court: ${matchCourtInput || 'TBA'}.`;
                  }
                  
                  let tournamentWinnerAnnounce = '';
                  if (editingMatch.id === 'f-1' && winner) {
                    tournamentWinnerAnnounce = ` Tournament finished! ${winner} crowned overall champions! 👑🏆`;
                  }

                  const updatedTournament = {
                    ...tournament,
                    bracket: {
                      ...tournament.bracket,
                      ...updatedBracket,
                      history: [
                        ...(tournament.bracket?.history || []),
                        { timestamp: new Date().toLocaleString(), text: historyText + tournamentWinnerAnnounce }
                      ]
                    }
                  };

                  updateTournament(updatedTournament);
                  setEditingMatch(null);
                  await showAlert('Success', winner ? 'Match details updated!' : 'Match schedule updated!');
                }}
                className="btn-neon"
                style={{
                  width: '100%', 
                  marginTop: 10,
                  padding: '12px 0',
                  borderRadius: 10,
                  fontSize: '0.9rem',
                  fontWeight: '800',
                  boxShadow: 'var(--primary-glow)',
                  transition: 'all 0.2s'
                }}
              >
                {winner ? `✅ Save Match Results — ${winner} Wins!` : '📅 Update Match Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   10. TEAM & PLAYER REGISTRATION
   ========================================================================== */
function TeamsView() {
  const { teams, addTeam, updateTeam, addPlayerToTeam, showAlert, showError, authFetch, showPrompt, loadData, isDataLoading } = useAppState();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);

  // New team form state
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamCaptain, setNewTeamCaptain] = useState('');
  const [newTeamSport, setNewTeamSport] = useState('Box Cricket');

  // New player form state
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerRole, setPlayerRole] = useState('batsman');
  const [jersey, setJersey] = useState('-');

  // Player search & manual phone states
  const [searchQuery, setSearchQuery] = useState('');
  const [appUsers, setAppUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [playerPhone, setPlayerPhone] = useState('');

  // Helper to render player avatar/profile picture
  const renderPlayerAvatar = (player) => {
    let pic = null;
    if (player.phone && appUsers && appUsers.length > 0) {
      const u = appUsers.find(user => user.phone && user.phone.trim() === player.phone.trim());
      if (u) {
        pic = localStorage.getItem('bcp_profile_pic_' + u.playerId);
      }
    }
    if (!pic && player.id) {
      pic = localStorage.getItem('bcp_profile_pic_' + player.id);
    }

    if (pic) {
      return (
        <div style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '1.5px solid var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F3F4F6',
          flexShrink: 0
        }}>
          <img src={pic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      );
    }

    // Fallback: Initials with gradient background
    const initials = player.name ? player.name.trim().charAt(0).toUpperCase() : '?';
    return (
      <div 
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          flexShrink: 0,
          border: '1px solid rgba(255,255,255,0.1)'
        }}
        title={player.name}
      >
        {initials}
      </div>
    );
  };

  // Fetch registered player app accounts on mount
  React.useEffect(() => {
    authFetch('http://localhost:3001/api/users')
      .then(res => res.ok ? res.json() : [])
      .then(data => setAppUsers(data))
      .catch(err => console.error("Error loading app users:", err));
  }, []);

  // Clean up states on close of form
  React.useEffect(() => {
    if (!showAddForm) {
      setSearchQuery('');
      setSelectedUser(null);
      setPlayerPhone('');
      setPlayerName('');
      setJersey('-');
    }
  }, [showAddForm]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    const hasCaptain = SPORTS_WITH_CAPTAINS.includes(newTeamSport);
    if (!newTeamName || (hasCaptain && !newTeamCaptain)) {
      await showError('Validation Error', 'Please fill out all fields!');
      return;
    }
    addTeam(newTeamName, hasCaptain ? newTeamCaptain : '', newTeamSport);
    await showAlert('Success', 'Team Registered Successfully!');
    setNewTeamName('');
    setNewTeamCaptain('');
    setNewTeamSport('Box Cricket');
    setShowTeamForm(false);
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    if (!selectedTeamId || !playerName) {
      await showError('Validation Error', 'Please fill out all required fields!');
      return;
    }
    if (!selectedUser && !playerPhone) {
      await showError('Validation Error', 'Please enter a Phone Number for manual registration or select an app player!');
      return;
    }

    addPlayerToTeam(selectedTeamId, {
      name: playerName,
      role: playerRole,
      jersey: jersey || '-',
      phone: playerPhone || (selectedUser ? selectedUser.phone : null)
    });
    await showAlert('Success', 'Player Registered to Team!');
    setPlayerName('');
    setJersey('-');
    setPlayerPhone('');
    setSelectedUser(null);
    setSearchQuery('');
    setShowAddForm(false);
  };

  const handleImportSharedTeam = async () => {
    const code = await showPrompt("Import Shared Team", "Enter the Share Code / Team ID to import the team:", "e.g. team-12345");
    if (!code || !code.trim()) return;

    try {
      const res = await authFetch('http://localhost:3001/api/teams/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareCode: code.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        await showError('Error', data.error || 'Failed to import team');
      } else {
        await showAlert('Success', 'Team imported successfully!');
        await loadData();
      }
    } catch (err) {
      await showError('Error', 'Failed to connect to server');
    }
  };

  const handleShareTeam = async (team) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(team.id);
        await showAlert('Copied!', `Share Code "${team.id}" copied to clipboard! Share it with others to let them view/use this team.`);
      } else {
        await showAlert('Share Code', `Team Share Code: ${team.id}\n\nCopy this code to share with other users.`);
      }
    } catch (err) {
      await showAlert('Share Code', `Team Share Code: ${team.id}\n\nCopy this code to share with other users.`);
    }
  };

  return (
    <div style={{...styles.container, padding: 16}}>
      <div className="flex-between" style={{marginBottom: 16}}>
        <h3>TEAMS & ROSTERS</h3>
        <div style={{display: 'flex', gap: 6}}>
          <button onClick={handleImportSharedTeam} className="btn-outlined" style={{padding: '4px 10px', fontSize: '0.75rem', width: 'auto', borderColor: 'var(--primary)', color: 'var(--primary)'}}>
            📥 Import Team
          </button>
          <button onClick={() => { setShowTeamForm(!showTeamForm); setShowAddForm(false); }} className="btn-outlined" style={{padding: '4px 10px', fontSize: '0.75rem', width: 'auto'}}>
            + Add Team
          </button>
          {teams.length > 0 && (
            <button onClick={() => { setShowAddForm(!showAddForm); setShowTeamForm(false); }} className="btn-outlined" style={{padding: '4px 10px', fontSize: '0.75rem', width: 'auto'}}>
              + Add Player
            </button>
          )}
        </div>
      </div>

      {isDataLoading ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          {[1, 2].map(i => (
            <div key={i} className="sporty-card" style={{padding: 16, display: 'flex', flexDirection: 'column', gap: 12}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div className="shimmer" style={{height: 22, width: '40%', borderRadius: 6}} />
                <div className="shimmer" style={{height: 24, width: 60, borderRadius: 6}} />
              </div>
              <div className="shimmer" style={{height: 14, width: '30%', borderRadius: 4}} />
              <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8}}>
                {[1, 2, 3].map(j => (
                  <div key={j} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0'}}>
                    <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                      <div className="shimmer" style={{width: 24, height: 24, borderRadius: '50%'}} />
                      <div className="shimmer" style={{height: 16, width: 80, borderRadius: 4}} />
                    </div>
                    <div className="shimmer" style={{height: 16, width: 50, borderRadius: 10}} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* CREATE TEAM FORM */}
      {showTeamForm && (
        <form onSubmit={handleCreateTeam} className="sporty-card glow-green" style={{marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10}}>
          <h4 style={{fontSize: '0.9rem', color: 'var(--primary)'}}>REGISTER NEW TEAM</h4>
          <div className="form-group">
            <label className="form-label">Team Name</label>
            <input 
              type="text" 
              placeholder="e.g. THUNDER XI" 
              className="form-input" 
              value={newTeamName}
              maxLength={50}
              onChange={e => setNewTeamName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Sport</label>
            <select
              value={newTeamSport}
              onChange={e => {
                setNewTeamSport(e.target.value);
                if (!SPORTS_WITH_CAPTAINS.includes(e.target.value)) {
                  setNewTeamCaptain('');
                }
              }}
              className="form-input"
            >
              {REGISTERABLE_SPORTS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          {SPORTS_WITH_CAPTAINS.includes(newTeamSport) && (
            <div className="form-group">
              <label className="form-label">Team Captain</label>
              <input 
                type="text" 
                placeholder="Captain Name" 
                className="form-input" 
                value={newTeamCaptain}
                maxLength={50}
                onChange={e => setNewTeamCaptain(e.target.value)}
              />
            </div>
          )}
          <button type="submit" className="btn-neon">CREATE TEAM ⚡</button>
        </form>
      )}

      {/* ADD PLAYER FORM */}
      {showAddForm && (
        <form onSubmit={handleAddPlayer} className="sporty-card glow-green" style={{marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10}}>
          <h4 style={{fontSize: '0.9rem', color: 'var(--primary)'}}>ADD PLAYER TO ROSTER</h4>
          
          <div className="form-group">
            <label className="form-label">Select Team</label>
            <select 
              value={selectedTeamId} 
              onChange={e => setSelectedTeamId(e.target.value)} 
              className="form-input"
              required
            >
              <option value="">-- Choose Team --</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Search App Player Accounts */}
          <div className="form-group">
            <label className="form-label">🔍 Search Registered App Users</label>
            <div style={{display: 'flex', gap: 6}}>
              <input 
                type="text" 
                placeholder="🔍 Enter phone number to search..." 
                className="form-input" 
                value={searchQuery}
                maxLength={15}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  if (!e.target.value) {
                    setSelectedUser(null);
                    setPlayerName('');
                    setPlayerPhone('');
                  }
                }}
              />
              {searchQuery && /^[0-9+\-\s]+$/.test(searchQuery.trim()) && (
                <button
                  type="button"
                  onClick={() => {
                    setPlayerPhone(searchQuery.trim());
                    setSelectedUser(null);
                    setSearchQuery('');
                    setPlayerName('');
                  }}
                  className="btn-neon"
                  style={{padding: '0 12px', fontSize: '0.8rem', width: 'auto', flexShrink: 0}}
                  title="Add as new player"
                >
                  ➕
                </button>
              )}
            </div>
            {searchQuery && !selectedUser && (
              <div style={{
                maxHeight: 150, overflowY: 'auto', background: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)', borderRadius: 8, marginTop: 6
              }}>
                {(() => {
                  const isPhone = /^[0-9+\-\s]+$/.test(searchQuery.trim());
                  const filtered = appUsers.filter(u => 
                    (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (u.phone && u.phone.includes(searchQuery))
                  );
                  return (
                    <>
                      {isPhone && (
                        <div 
                          onClick={() => {
                            setPlayerPhone(searchQuery.trim());
                            setSelectedUser(null);
                            setSearchQuery('');
                            setPlayerName('');
                          }}
                          style={{
                            padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)',
                            cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', fontSize: '0.8rem', color: 'var(--primary)',
                            fontWeight: 'bold', background: 'rgba(170,255,0,0.03)'
                          }}
                        >
                          <span>➕ Add "{searchQuery}" as a new player</span>
                          <span style={{fontSize: '0.72rem'}}>MANUAL ➕</span>
                        </div>
                      )}
                      {filtered.length === 0 ? (
                        !isPhone && (
                          <div style={{padding: 8, fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center'}}>
                            No matching app accounts found. Fill details manually below!
                          </div>
                        )
                      ) : (
                        filtered.map(u => (
                          <div 
                            key={u.playerId} 
                            onClick={() => {
                              setSelectedUser(u);
                              setPlayerName(u.username || u.email.split('@')[0]);
                              setPlayerPhone(u.phone || '');
                              setSearchQuery(u.username || u.email);
                            }}
                            style={{
                              padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)',
                              cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                              alignItems: 'center', fontSize: '0.8rem'
                            }}
                          >
                            <div>
                              <div style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{u.username || '—'}</div>
                              <div style={{fontSize: '0.7rem', color: 'var(--text-muted)'}}>{u.email}</div>
                            </div>
                            <span style={{fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 'bold'}}>SELECT ➕</span>
                          </div>
                        ))
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Selected linked user card */}
          {selectedUser && (
            <div style={{
              padding: 10, background: 'rgba(170,255,0,0.05)', border: '1px solid var(--primary)',
              borderRadius: 8, marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <span style={{fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 'bold', display: 'block'}}>LINKED ACCOUNT</span>
                <span style={{fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 'bold'}}>{selectedUser.username || selectedUser.email}</span>
              </div>
              <button 
                type="button" 
                onClick={() => { setSelectedUser(null); setSearchQuery(''); setPlayerName(''); setPlayerPhone(''); }}
                style={{background: 'transparent', border: 'none', color: '#EF4444', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold'}}
              >
                Unlink ✖️
              </button>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Player Name</label>
            <input 
              type="text" 
              placeholder="e.g. Suresh R." 
              className="form-input" 
              value={playerName}
              maxLength={50}
              onChange={e => setPlayerName(e.target.value)}
              disabled={!!selectedUser}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input 
              type="text" 
              placeholder="Manual entry phone number" 
              className="form-input" 
              value={playerPhone}
              maxLength={15}
              onChange={e => setPlayerPhone(e.target.value)}
              disabled={!!selectedUser}
              required={!selectedUser}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Playing Role</label>
            <select 
              value={playerRole} 
              onChange={e => setPlayerRole(e.target.value)} 
              className="form-input"
              required
            >
              <option value="batsman">Batsman</option>
              <option value="bowler">Bowler</option>
              <option value="allrounder">All-Rounder</option>
            </select>
          </div>

          <button type="submit" className="btn-neon">SAVE PLAYER ⚡</button>
        </form>
      )}

      {/* TEAMS LIST */}
      {teams.length === 0 ? (
        <div className="sporty-card" style={{padding: 24, textAlign: 'center'}}>
          <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>No teams registered yet.</p>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          {teams.map(t => (
            <div key={t.id} className="sporty-card">
              <div className="flex-between" style={{marginBottom: 8}}>
                <h4 style={{
                  color: "var(--text-primary)", 
                  fontSize: '1.2rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: '700',
                  letterSpacing: '0.2px',
                  lineHeight: 1.3,
                  margin: 0
                }}>
                  {t.name}{' '}
                  <span style={{fontSize: '0.72rem', fontWeight: '400', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', letterSpacing: '0.2px'}}>({t.sport || 'Box Cricket'})</span>
                </h4>
                <div style={{display: 'flex', gap: 6, alignItems: 'center'}}>
                  {SPORTS_WITH_CAPTAINS.includes(t.sport || 'Box Cricket') && t.captain && (
                    <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: 6}}>C: {t.captain}</span>
                  )}
                  <button 
                    onClick={() => handleShareTeam(t)}
                    style={{
                      background: 'rgba(220, 38, 38, 0.08)',
                      border: 'none',
                      borderRadius: 6,
                      padding: '4px 8px',
                      color: 'var(--primary)',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                    title="Share Team"
                  >
                    🔗 Share
                  </button>
                </div>
              </div>
              <p style={{fontSize: '0.75rem', color: 'var(--primary)', marginBottom: 12}}>{t.players.length} Registered Players</p>
              
              {t.players.length > 0 ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                  {t.players.map(p => {
                    const isCaptain = SPORTS_WITH_CAPTAINS.includes(t.sport || 'Box Cricket') && t.captain === p.name;
                    return (
                      <div key={p.id} style={styles.miniPlayerRow}>
                        <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                          {SPORTS_WITH_CAPTAINS.includes(t.sport || 'Box Cricket') && (
                            <input 
                              type="radio" 
                              name={`teams-captain-${t.id}`}
                              checked={isCaptain}
                              onChange={() => updateTeam(t.id, { captain: p.name })}
                              style={{
                                accentColor: 'var(--primary)',
                                cursor: 'pointer',
                                width: 14,
                                height: 14,
                                marginRight: 2
                              }}
                              title="Set as Captain"
                            />
                          )}
                          {renderPlayerAvatar(p)}
                          <span style={{fontSize: '0.85rem'}}>
                            {p.name}
                          </span>
                          {isCaptain && (
                            <span style={{
                              fontSize: '0.7rem',
                              backgroundColor: 'rgba(234, 179, 8, 0.15)',
                              color: '#EAB308',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 3
                            }}>
                              👑 Captain
                            </span>
                          )}
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                          <span className={`role-badge ${p.role}`} style={{fontSize: '0.6rem', padding: '2px 6px'}}>{p.role}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic'}}>No players added. Click "+ Add Player" to register roster.</p>
              )}
            </div>
          ))}
        </div>
      )}
        </>
      )}
    </div>
  );
}

/* ==========================================================================
   11. PLAYER PROFILE & CAREER STATS
   ========================================================================== */
function PlayerProfileView() {
  const { 
    userName, 
    userEmail, 
    userPhone, 
    playerId, 
    matchesPlayedCount, 
    apiKey, 
    checkUsernameUnique, 
    updateProfileOnBackend, 
    logoutUser,
    userRole,
    venues,
    playerSportsInterests,
    updateSportsInterestsOnBackend,
    setSelectedSportFilter,
    playerSpecialties,
    updateSpecialtiesOnBackend,
    permissions,
    setPermissions,
    showConfirm,
    teams,
    completedMatches,
    selectedCompletedMatch,
    setSelectedCompletedMatch,
    authFetch
  } = useAppState();
  const [showSportsModal, setShowSportsModal] = useState(false);
  const [showSpecialtiesModal, setShowSpecialtiesModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [draftUsername, setDraftUsername] = useState('');
  const [draftPhone, setDraftPhone] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [saving, setSaving] = useState(false);

  const fileInputRef = React.useRef(null);
  const [profilePic, setProfilePic] = useState(() => {
    return localStorage.getItem('bcp_profile_pic_' + playerId) || '';
  });

  const [allUsers, setAllUsers] = useState([]);
  const [playerSearchQuery, setPlayerSearchQuery] = useState('');
  const [playerSearchResults, setPlayerSearchResults] = useState([]);
  const [selectedViewedPlayer, setSelectedViewedPlayer] = useState(null);

  React.useEffect(() => {
    authFetch('http://localhost:3001/api/users')
      .then(res => res.ok ? res.json() : [])
      .then(data => setAllUsers(data))
      .catch(err => console.error("Error loading users for search:", err));
  }, []);

  const handlePlayerSearchChange = (e) => {
    const val = e.target.value;
    setPlayerSearchQuery(val);
    if (!val.trim()) {
      setPlayerSearchResults([]);
      return;
    }
    const queryLower = val.toLowerCase();
    const filtered = allUsers.filter(u => {
      if (u.playerId === playerId) return false;
      const matchesUsername = u.username && u.username.toLowerCase().includes(queryLower);
      const matchesPlayerId = u.playerId && u.playerId.toLowerCase().includes(queryLower);
      const matchesPhone = u.phone && u.phone.includes(queryLower);
      return matchesUsername || matchesPlayerId || matchesPhone;
    });
    setPlayerSearchResults(filtered);
  };

  const handleSelectPlayer = (user) => {
    setSelectedViewedPlayer(user);
    setPlayerSearchQuery('');
    setPlayerSearchResults([]);
  };

  const getDisplayedSportsInterests = () => {
    if (selectedViewedPlayer) {
      let sports = selectedViewedPlayer.sports_interests;
      if (typeof sports === 'string') {
        try { sports = JSON.parse(sports); } catch (e) { sports = []; }
      }
      return Array.isArray(sports) ? sports : [];
    }
    return playerSportsInterests || [];
  };

  const getDisplayedSpecialties = () => {
    if (selectedViewedPlayer) {
      let specs = selectedViewedPlayer.specialties;
      if (typeof specs === 'string') {
        try { specs = JSON.parse(specs); } catch (e) { specs = {}; }
      }
      return (typeof specs === 'object' && specs !== null) ? specs : {};
    }
    return playerSpecialties || {};
  };

  const displayedName = selectedViewedPlayer ? (selectedViewedPlayer.username || '—') : (userName || '—');
  const displayedEmail = selectedViewedPlayer ? (selectedViewedPlayer.email || '—') : (userEmail || '—');
  const displayedPhone = selectedViewedPlayer ? (selectedViewedPlayer.phone || '—') : (userPhone || '—');
  const displayedId = selectedViewedPlayer ? selectedViewedPlayer.playerId : playerId;
  const displayedRole = selectedViewedPlayer ? (selectedViewedPlayer.role || 'viewer') : (userRole || 'viewer');
  const displayedSportsInterests = getDisplayedSportsInterests();
  const displayedSpecialties = getDisplayedSpecialties();
  const displayedProfilePic = localStorage.getItem('bcp_profile_pic_' + displayedId) || '';

  React.useEffect(() => {
    setProfilePic(localStorage.getItem('bcp_profile_pic_' + playerId) || '');
  }, [playerId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 250;
        const MAX_HEIGHT = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        localStorage.setItem('bcp_profile_pic_' + playerId, compressedBase64);
        setProfilePic(compressedBase64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const openEditModal = () => {
    setDraftUsername(userName || '');
    setDraftPhone(userPhone || '');
    setUsernameError('');
    setPhoneError('');
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    const trimmedUser = draftUsername.trim();
    const trimmedPhone = draftPhone.trim();
    let hasError = false;

    if (!trimmedUser) {
      setUsernameError('Username cannot be empty.');
      hasError = true;
    } else if (trimmedUser.length < 3) {
      setUsernameError('Minimum 3 characters required.');
      hasError = true;
    } else if (trimmedUser.length > 20) {
      setUsernameError('Maximum 20 characters allowed.');
      hasError = true;
    } else if (!/^[a-zA-Z0-9_]+$/.test(trimmedUser)) {
      setUsernameError('Only letters, numbers and underscores allowed.');
      hasError = true;
    } else {
      setUsernameError('');
    }

    if (!trimmedPhone) {
      setPhoneError('Phone number cannot be empty.');
      hasError = true;
    } else if (!/^[0-9+ ]{8,15}$/.test(trimmedPhone)) {
      setPhoneError('Please enter a valid phone number (8–15 digits).');
      hasError = true;
    } else {
      setPhoneError('');
    }

    if (hasError) return;

    setSaving(true);

    try {
      if (trimmedUser.toLowerCase() !== (userName || '').toLowerCase()) {
        const isUnique = await checkUsernameUnique(trimmedUser);
        if (!isUnique) {
          setUsernameError('This username is already taken by another user.');
          setSaving(false);
          return;
        }
      }

      if (trimmedPhone !== (userPhone || '')) {
        const checkRes = await fetch(`${API_BASE}/api/auth/check-phone?phone=${encodeURIComponent(trimmedPhone)}`);
        const checkData = await checkRes.json();
        if (checkData.taken) {
          setPhoneError('This phone number is already registered by another user.');
          setSaving(false);
          return;
        }
      }

      await updateProfileOnBackend(trimmedUser, trimmedPhone);
      setShowEditModal(false);
    } catch (err) {
      setUsernameError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const ownerVenues = venues.filter(v => v.ownerId === playerId);

  return (
    <div style={{...styles.container, padding: 16}}>

      {/* EDIT USERNAME & PHONE MODAL */}
      {showEditModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
        }}>
          <div style={{
            background: 'var(--bg-primary)', border: '2px solid var(--primary)',
            borderRadius: 16, padding: 28, width: '100%', maxWidth: 380,
            boxShadow: '0 8px 32px rgba(220,20,60,0.18)'
          }}>
            <div style={{textAlign: 'center', marginBottom: 20}}>
              <span style={{fontSize: '2rem'}}>✏️</span>
              <h2 style={{fontSize: '1.3rem', color: 'var(--text-primary)', marginTop: 8}}>Edit Profile Details</h2>
              <p style={{fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5}}>
                Update your display name and mobile number below.
              </p>
            </div>
            
            {/* Username Input */}
            <div style={{marginBottom: 16}}>
              <label style={{fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6}}>
                Username
              </label>
              <input
                className="input-field"
                placeholder="e.g. SixHitter99"
                value={draftUsername}
                maxLength={20}
                onChange={e => { setDraftUsername(e.target.value); setUsernameError(''); }}
                style={{width: '100%', boxSizing: 'border-box'}}
              />
              {usernameError && (
                <p style={{color: '#dc143c', fontSize: '0.78rem', marginTop: 6, fontWeight: 600}}>⚠ {usernameError}</p>
              )}
              <p style={{fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6}}>
                3–20 chars · letters, numbers, underscores only
              </p>
            </div>

            {/* Phone Input */}
            <div style={{marginBottom: 20}}>
              <label style={{fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6}}>
                Mobile Number
              </label>
              <input
                className="input-field"
                type="tel"
                placeholder="e.g. +919876543210"
                value={draftPhone}
                maxLength={15}
                onChange={e => { setDraftPhone(e.target.value); setPhoneError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleSaveProfile()}
                style={{width: '100%', boxSizing: 'border-box'}}
              />
              {phoneError && (
                <p style={{color: '#dc143c', fontSize: '0.78rem', marginTop: 6, fontWeight: 600}}>⚠ {phoneError}</p>
              )}
            </div>

            <div style={{display: 'flex', gap: 10}}>
              <button
                onClick={() => setShowEditModal(false)}
                style={{flex: 1, padding: '11px 0', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem'}}
                disabled={saving}
              >
                Cancel
              </button>
              <button className="btn-neon" style={{flex: 2, padding: '11px 0'}} onClick={handleSaveProfile} disabled={saving}>
                {saving ? 'SAVING...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PLAYER SEARCH BAR & CONDITIONAL BACK BUTTON */}
      {!selectedViewedPlayer ? (
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search other players by name..."
            style={{
              width: '100%',
              background: '#F3F4F6',
              border: '1px solid #E5E7EB',
              borderRadius: 25,
              padding: '11px 16px 11px 40px',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-body)',
              color: 'var(--text-primary)',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            value={playerSearchQuery}
            onChange={handlePlayerSearchChange}
          />
          {playerSearchResults.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: 'var(--bg-primary)', border: '1px solid var(--border-light)',
              borderRadius: 12, marginTop: 4, zIndex: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              maxHeight: 200, overflowY: 'auto'
            }}>
              {playerSearchResults.map(user => (
                <div 
                  key={user.playerId} 
                  onClick={() => handleSelectPlayer(user)}
                  style={{
                    padding: '10px 14px', borderBottom: '1px solid var(--border-light)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10
                  }}
                  className="search-item"
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', overflow: 'hidden',
                    border: '1.5px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#F3F4F6', flexShrink: 0
                  }}>
                    {localStorage.getItem('bcp_profile_pic_' + user.playerId) ? (
                      <img 
                        src={localStorage.getItem('bcp_profile_pic_' + user.playerId)} 
                        alt="" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <span style={{ fontSize: '1.1rem' }}>🏃</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.username || 'No Username'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {user.role === 'admin' ? 'VENUE PARTNER' : 'PLAYER'} · {user.playerId}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button 
          onClick={() => setSelectedViewedPlayer(null)}
          style={{
            background: 'var(--primary)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 8,
            padding: '10px 16px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 16,
            alignSelf: 'flex-start',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)'
          }}
        >
          ← Back to My Profile
        </button>
      )}

      {/* PROFILE HEADER */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      />
      <div className="sporty-card glow-green" style={styles.profileHeaderCard}>
        <div style={styles.profileAvatarSection}>
          <div 
            onClick={() => !selectedViewedPlayer && fileInputRef.current && fileInputRef.current.click()}
            style={{
              position: 'relative',
              width: 60,
              height: 60,
              borderRadius: '50%',
              cursor: selectedViewedPlayer ? 'default' : 'pointer',
              backgroundColor: '#F3F4F6',
              border: '2px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
              transition: 'all 0.3s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              if (!selectedViewedPlayer) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.25)';
              }
            }}
            onMouseLeave={(e) => {
              if (!selectedViewedPlayer) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.15)';
              }
            }}
          >
            {displayedProfilePic ? (
              <img 
                src={displayedProfilePic} 
                alt="Profile" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }} 
              />
            ) : (
              <span style={{fontSize: '2rem', userSelect: 'none'}}>🏃</span>
            )}
            
            {/* Edit Overlay Indicator */}
            {!selectedViewedPlayer && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                fontSize: '0.55rem',
                fontWeight: 'bold',
                transition: 'background-color 0.2s',
                gap: 2
              }}>
                <Camera size={9} color="#FFF" />
                <span>EDIT</span>
              </div>
            )}
          </div>
          <div style={{flex: 1, minWidth: 0}}>
            <h2 style={{
              fontSize: '1.4rem', 
              color: 'var(--text-primary)', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              margin: 0,
              lineHeight: 1.2
            }} title={displayedName}>
              {displayedName}
            </h2>
            <span className="role-badge batsman" style={{fontSize: '0.65rem', padding: '2px 8px', marginTop: 4, display: 'inline-block'}}>
              {displayedRole === 'admin' ? 'VENUE PARTNER' : 'PLAYER'}
            </span>
          </div>
          {!selectedViewedPlayer && (
            <button
              onClick={openEditModal}
              title="Edit username"
              style={{
                background: 'transparent', border: '1px solid var(--primary)',
                borderRadius: 8, padding: '6px 10px', cursor: 'pointer',
                color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              ✏️ Edit
            </button>
          )}
        </div>
      </div>

      {/* UNIQUE PLAYER ID BADGE */}
      <div className="sporty-card glow-gold" style={{margin: '16px 0', padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <span style={{fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>{displayedRole === 'admin' ? 'Unique Owner ID' : 'Unique Player ID'}</span>
          <h4 style={{fontSize: '1.25rem', color: 'var(--primary)', fontFamily: 'var(--font-condensed)', fontWeight: 'bold'}}>{displayedId}</h4>
        </div>
        <span style={{fontSize: '0.65rem', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '4px 8px', borderRadius: 4, fontWeight: 'bold'}}>VERIFIED</span>
      </div>

      {/* CONTACT INFORMATION */}
      {!selectedViewedPlayer && (
        <div className="sporty-card" style={{padding: 14, marginBottom: 16}}>
          <h4 style={{color: 'var(--primary)', fontSize: '0.85rem', marginBottom: 10, textTransform: 'uppercase'}}>Contact Details</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem'}}>
            <div className="flex-between">
              <span style={{color: 'var(--text-muted)'}}>Gmail Address:</span>
              <span style={{color: "var(--text-primary)"}}>{displayedEmail}</span>
            </div>
            <div className="flex-between">
              <span style={{color: 'var(--text-muted)'}}>Mobile Number:</span>
              <span style={{color: "var(--text-primary)"}}>{displayedPhone}</span>
            </div>
          </div>
        </div>
      )}

      {/* APP SETTINGS & PERMISSIONS */}
      {!selectedViewedPlayer && (
        <div className="sporty-card" style={{padding: 14, marginBottom: 16}}>
          <h4 style={{color: 'var(--primary)', fontSize: '0.85rem', marginBottom: 12, textTransform: 'uppercase'}}>⚙️ App Settings & Permissions</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            {/* Notifications Toggle */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <div style={{fontWeight: 'bold', fontSize: '0.85rem', color: "var(--text-primary)"}}>🔔 Push Notifications</div>
                <div style={{fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2}}>Get match alerts & booking updates</div>
              </div>
              <div 
                onClick={() => setPermissions(prev => ({ ...prev, notifications: !prev.notifications }))}
                style={{
                  width: 48,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: permissions.notifications ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  backgroundColor: '#000000',
                  position: 'absolute',
                  top: 2,
                  left: permissions.notifications ? 26 : 2,
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.4)'
                }} />
              </div>
            </div>

            <div style={{height: 1, backgroundColor: 'rgba(255,255,255,0.06)'}} />

            {/* Location Toggle */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <div style={{fontWeight: 'bold', fontSize: '0.85rem', color: "var(--text-primary)"}}>📍 Location Services</div>
                <div style={{fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2}}>Find and sort closest arenas automatically</div>
              </div>
              <div 
                onClick={() => setPermissions(prev => ({ ...prev, location: !prev.location }))}
                style={{
                  width: 48,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: permissions.location ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  backgroundColor: '#000000',
                  position: 'absolute',
                  top: 2,
                  left: permissions.location ? 26 : 2,
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.4)'
                }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROLE-SPECIFIC VIEWS */}
      {displayedRole === 'admin' ? (
        <div className="sporty-card" style={{padding: 14, marginBottom: 16}}>
          <div className="flex-between" style={{marginBottom: 12}}>
            <h4 style={{color: 'var(--primary)', fontSize: '0.85rem', textTransform: 'uppercase', margin: 0}}>Owned Arenas</h4>
            <span style={{
              fontSize: '0.75rem', 
              color: 'var(--bg-primary)', 
              backgroundColor: 'var(--primary)', 
              padding: '2px 8px', 
              borderRadius: 12, 
              fontWeight: 'bold'
            }}>
              {ownerVenues.length} {ownerVenues.length === 1 ? 'Arena' : 'Arenas'}
            </span>
          </div>
          {ownerVenues.length > 0 ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
              {ownerVenues.map(venue => (
                <div key={venue.id} style={{
                  padding: 10, 
                  background: 'var(--bg-secondary)', 
                  borderRadius: 8, 
                  border: '1px solid var(--border-light)'
                }}>
                  <h5 style={{fontSize: '0.92rem', color: 'var(--text-primary)', margin: 0}}>{venue.name}</h5>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, margin: 0}}>📍 {venue.address}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', margin: 0, padding: '10px 0'}}>
              No arenas registered yet. Go to the "My Arena" tab to add one! 🏟️
            </p>
          )}
        </div>
      ) : (
        <>
          {/* SPORTS INTERESTS */}
          <div className="sporty-card" style={{padding: 14, marginBottom: 16}}>
            <div className="flex-between" style={{marginBottom: 10}}>
              <h4 style={{color: 'var(--primary)', fontSize: '0.85rem', textTransform: 'uppercase', margin: 0}}>{selectedViewedPlayer ? 'Sports Interests' : 'My Sports'}</h4>
              {!selectedViewedPlayer && (
                <button
                  onClick={() => setShowSportsModal(true)}
                  style={{
                    background: 'transparent', border: '1px solid var(--primary)',
                    borderRadius: 6, padding: '3px 10px', cursor: 'pointer',
                    color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 700
                  }}
                >
                  ✏️ Edit
                </button>
              )}
            </div>
            {displayedSportsInterests.length > 0 ? (
              <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
                {displayedSportsInterests.map(sport => {
                  const sportDef = ALL_SPORTS.find(s => s.id === sport);
                  return (
                    <span
                      key={sport}
                      style={{
                        fontSize: '0.72rem', padding: '3px 10px', borderRadius: 20,
                        background: sportDef ? `${sportDef.color}22` : 'rgba(170,255,0,0.1)',
                        color: sportDef?.color || 'var(--primary)',
                        border: `1px solid ${sportDef?.color || 'var(--primary)'}`,
                        fontWeight: 700, cursor: selectedViewedPlayer ? 'default' : 'pointer'
                      }}
                      onClick={() => !selectedViewedPlayer && setSelectedSportFilter(sport)}
                    >
                      {sportDef?.label || sport}
                    </span>
                  );
                })}
              </div>
            ) : (
              <p style={{color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0}}>
                {selectedViewedPlayer ? 'No sports interests listed.' : 'No sports selected yet. Tap Edit to add your interests! 🏟️'}
              </p>
            )}
          </div>

          {showSportsModal && <SportsInterestModal onClose={() => setShowSportsModal(false)} />}

          {/* SPORTS SPECIALTIES */}
          <div className="sporty-card" style={{padding: 14, marginBottom: 16}}>
            <div className="flex-between" style={{marginBottom: 10}}>
              <h4 style={{color: 'var(--primary)', fontSize: '0.85rem', textTransform: 'uppercase', margin: 0}}>{selectedViewedPlayer ? 'Specialties & Roles' : 'My Specialties / Roles'}</h4>
              {!selectedViewedPlayer && playerSportsInterests.length > 0 && (
                <button
                  onClick={() => setShowSpecialtiesModal(true)}
                  style={{
                    background: 'transparent', border: '1px solid var(--primary)',
                    borderRadius: 6, padding: '3px 10px', cursor: 'pointer',
                    color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 700
                  }}
                >
                  ✏️ Edit
                </button>
              )}
            </div>
            {Object.keys(displayedSpecialties).length > 0 ? (
              <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                {Object.keys(displayedSpecialties).map(sport => {
                  const sportDef = ALL_SPORTS.find(s => s.id === sport);
                  const specialty = displayedSpecialties[sport];
                  return (
                    <div key={sport} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '6px 10px', background: 'var(--bg-secondary)', borderRadius: 8,
                      border: '1px solid var(--border-light)'
                    }}>
                      <span style={{fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 'bold'}}>
                        {sportDef?.label || sport}
                      </span>
                      <span style={{
                        fontSize: '0.75rem', color: sportDef?.color || 'var(--primary)',
                        fontWeight: 'bold', padding: '2px 8px', borderRadius: 4,
                        background: sportDef ? `${sportDef.color}11` : 'rgba(170,255,0,0.05)'
                      }}>
                        {specialty}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0}}>
                {selectedViewedPlayer 
                  ? 'No specialties listed.' 
                  : (playerSportsInterests.length > 0 
                      ? 'No specialties selected yet. Tap Edit to set your playing roles!' 
                      : 'Select your sports interests first to choose playing roles.')}
              </p>
            )}
          </div>

          {showSpecialtiesModal && <SportSpecialtiesModal onClose={() => setShowSpecialtiesModal(false)} />}

          {/* CAREER STATS */}
          {(() => {
            const matchingPlayer = teams
              ? teams
                  .flatMap(t => t.players || [])
                  .find(p => 
                    (p.phone && p.phone === displayedPhone) || 
                    (p.name && displayedName && p.name.trim().toLowerCase() === displayedName.trim().toLowerCase())
                  )
              : null;

            let displayMatches = matchingPlayer ? (matchingPlayer.matches ?? 0) : (selectedViewedPlayer ? 0 : matchesPlayedCount);
            let displayRuns = matchingPlayer ? (matchingPlayer.runs ?? 0) : 0;
            let displayAvg = matchingPlayer ? (matchingPlayer.avg !== undefined && matchingPlayer.avg !== null ? Number(matchingPlayer.avg).toFixed(2) : '0.00') : '0.00';
            let displaySR = matchingPlayer ? (matchingPlayer.sr !== undefined && matchingPlayer.sr !== null ? Number(matchingPlayer.sr).toFixed(2) : '0.00') : '0.00';
            let displayWickets = matchingPlayer ? (matchingPlayer.wickets ?? 0) : 0;
            let displayEco = matchingPlayer ? (matchingPlayer.eco !== undefined && matchingPlayer.eco !== null ? Number(matchingPlayer.eco).toFixed(2) : '0.00') : '0.00';

            // Aggregate career stats from completedMatches where user played
            let aggregatedMatchesCount = 0;
            let aggregatedRuns = 0;
            let aggregatedBalls = 0;
            let aggregatedWickets = 0;
            let aggregatedRunsConceded = 0;
            let aggregatedOversBowledNum = 0;
            let aggregatedDismissals = 0;

            completedMatches.forEach(m => {
              if (m.sport && m.sport !== 'Cricket') return;
              const state = m.matchState;
              if (!state) return;

              const allBatting = [
                ...(state.firstInningsBatting || []),
                ...(state.batting || [])
              ];
              const allBowling = [
                ...(state.firstInningsBowling || []),
                ...(state.bowling || [])
              ];

              const batsmanEntry = allBatting.find(b => 
                (b.id && matchingPlayer && b.id === matchingPlayer.id) ||
                (b.name && displayedName && b.name.trim().toLowerCase() === displayedName.trim().toLowerCase())
              );
              const bowlerEntry = allBowling.find(b => 
                (b.id && matchingPlayer && b.id === matchingPlayer.id) ||
                (b.name && displayedName && b.name.trim().toLowerCase() === displayedName.trim().toLowerCase())
              );

              if (batsmanEntry || bowlerEntry) {
                aggregatedMatchesCount++;
                if (batsmanEntry) {
                  aggregatedRuns += batsmanEntry.runs || 0;
                  aggregatedBalls += batsmanEntry.balls || 0;
                  if (batsmanEntry.balls > 0) {
                    aggregatedDismissals++; 
                  }
                }
                if (bowlerEntry) {
                  aggregatedWickets += bowlerEntry.wickets || 0;
                  aggregatedRunsConceded += bowlerEntry.runs || 0;
                  const oversStr = bowlerEntry.overs || '0.0';
                  const parts = oversStr.toString().split('.');
                  const ov = parseInt(parts[0]) || 0;
                  const bl = parseInt(parts[1]) || 0;
                  aggregatedOversBowledNum += ov + (bl / 6);
                }
              }
            });

            if (aggregatedMatchesCount > 0) {
              displayMatches = Math.max(displayMatches, aggregatedMatchesCount);
              displayRuns = Math.max(displayRuns, aggregatedRuns);
              displayWickets = Math.max(displayWickets, aggregatedWickets);
              
              if (aggregatedDismissals > 0) {
                displayAvg = (aggregatedRuns / aggregatedDismissals).toFixed(2);
              } else if (displayRuns > 0) {
                displayAvg = displayRuns.toFixed(2);
              }
              if (aggregatedBalls > 0) {
                displaySR = ((aggregatedRuns / aggregatedBalls) * 100).toFixed(2);
              }
              if (aggregatedOversBowledNum > 0) {
                displayEco = (aggregatedRunsConceded / aggregatedOversBowledNum).toFixed(2);
              }
            }

            return (
              <div className="sporty-card" style={{padding: 14}}>
                <h4 style={{color: 'var(--primary)', fontSize: '0.85rem', marginBottom: 10, textTransform: 'uppercase'}}>Career Statistics</h4>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, textAlign: 'center'}}>
                  <div style={{padding: 8, background: 'var(--bg-secondary)', borderRadius: 6}}>
                    <span style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>MATCHES</span>
                    <h4 style={{color: 'var(--text-primary)', fontSize: '1.1rem', marginTop: 4}}>{displayMatches}</h4>
                  </div>
                  <div style={{padding: 8, background: 'var(--bg-secondary)', borderRadius: 6}}>
                    <span style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>RUNS</span>
                    <h4 style={{color: 'var(--primary)', fontSize: '1.1rem', marginTop: 4}}>{displayRuns}</h4>
                  </div>
                  <div style={{padding: 8, background: 'var(--bg-secondary)', borderRadius: 6}}>
                    <span style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>AVERAGE</span>
                    <h4 style={{color: 'var(--text-primary)', fontSize: '1.1rem', marginTop: 4}}>{displayAvg}</h4>
                  </div>
                  <div style={{padding: 8, background: 'var(--bg-secondary)', borderRadius: 6}}>
                    <span style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>STRIKE RATE</span>
                    <h4 style={{color: 'var(--text-primary)', fontSize: '1.1rem', marginTop: 4}}>{displaySR}</h4>
                  </div>
                  <div style={{padding: 8, background: 'var(--bg-secondary)', borderRadius: 6}}>
                    <span style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>WICKETS</span>
                    <h4 style={{color: 'var(--primary)', fontSize: '1.1rem', marginTop: 4}}>{displayWickets}</h4>
                  </div>
                  <div style={{padding: 8, background: 'var(--bg-secondary)', borderRadius: 6}}>
                    <span style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>ECONOMY</span>
                    <h4 style={{color: 'var(--text-primary)', fontSize: '1.1rem', marginTop: 4}}>{displayEco}</h4>
                  </div>
                </div>
                <p style={{fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 10}}>
                  Stats will update as you play matches 🏆
                </p>
              </div>
            );
          })()}


        </>
      )}

      {/* LOGOUT BUTTON */}
      <button 
        onClick={async () => {
          const confirmLogout = await showConfirm('Confirm Logout', 'Are you sure you want to log out of your session?');
          if (confirmLogout) {
            logoutUser();
          }
        }}
        className="btn-outlined" 
        style={{
          width: '100%',
          marginTop: 20,
          padding: '12px 0',
          borderColor: 'var(--error, #dc143c)',
          color: 'var(--error, #dc143c)',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}
      >
        LOG OUT 🛑
      </button>
    </div>
  );
}

/* ==========================================================================
   12. MY BOOKINGS & REWARDS
   ========================================================================== */
function RewardsView() {
  const { bookings, loyaltyVisits, cancelBooking, showConfirm, userName, userRole, isDataLoading } = useAppState();

  const currentVisits = loyaltyVisits['venue-1'] || 0;
  const targetVisits = 7;

  const displayedBookingsRaw = (userRole === 'viewer' || userRole === 'scorer') ? bookings.filter(b => b.customerName === userName) : bookings;

  const parseStartHour = (timeSlotStr) => {
    if (!timeSlotStr || !timeSlotStr.includes(' - ')) return 0;
    const startStr = timeSlotStr.split(' - ')[0].trim();
    const parts = startStr.split(' ');
    if (parts.length < 2) return 0;
    const [time, ampm] = parts;
    const [hourStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    if (ampm === 'PM' && hour !== 12) {
      hour += 12;
    } else if (ampm === 'AM' && hour === 12) {
      hour = 0;
    }
    return hour;
  };

  const parseEndHour = (timeSlotStr) => {
    if (!timeSlotStr || !timeSlotStr.includes(' - ')) return 0;
    const endStr = timeSlotStr.split(' - ')[1].trim();
    const parts = endStr.split(' ');
    if (parts.length < 2) return 0;
    const [time, ampm] = parts;
    const [hourStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    if (ampm === 'PM' && hour !== 12) {
      hour += 12;
    } else if (ampm === 'AM' && hour === 12) {
      hour = 0;
    }
    if (hour === 0 && timeSlotStr.includes('12:00 AM') && timeSlotStr.startsWith('11:00 PM')) {
      hour = 24;
    }
    return hour;
  };

  const getGroupedBookings = (bookingsList) => {
    const groups = {};
    bookingsList.forEach(b => {
      const key = `${b.venueId}_${b.date}_${b.customerName}_${b.status}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(b);
    });

    const mergedBookings = [];

    Object.keys(groups).forEach(key => {
      const group = groups[key];
      group.sort((a, b) => parseStartHour(a.timeSlot) - parseStartHour(b.timeSlot));

      let currentMerge = null;

      group.forEach(booking => {
        const startHour = parseStartHour(booking.timeSlot);
        const endHour = parseEndHour(booking.timeSlot);

        if (!currentMerge) {
          currentMerge = {
            ...booking,
            startHour,
            endHour,
            originalBookings: [booking],
            amountPaid: booking.amountPaid
          };
        } else {
          if (startHour === currentMerge.endHour) {
            currentMerge.endHour = endHour;
            currentMerge.originalBookings.push(booking);
            currentMerge.amountPaid += booking.amountPaid;
          } else {
            mergedBookings.push(currentMerge);
            currentMerge = {
              ...booking,
              startHour,
              endHour,
              originalBookings: [booking],
              amountPaid: booking.amountPaid
            };
          }
        }
      });

      if (currentMerge) {
        mergedBookings.push(currentMerge);
      }
    });

    mergedBookings.forEach(mb => {
      if (mb.originalBookings.length > 1) {
        const formatHourDisplay = (h) => {
          const displayH = h % 12 === 0 ? 12 : h % 12;
          const ampm = h >= 12 && h < 24 ? 'PM' : 'AM';
          return `${displayH.toString().padStart(2, '0')}:00 ${ampm}`;
        };
        const startTimeStr = formatHourDisplay(mb.startHour);
        const endTimeStr = formatHourDisplay(mb.endHour);
        mb.timeSlot = `${startTimeStr} - ${endTimeStr}`;
        mb.duration = `${mb.originalBookings.length} Hours`;
      }
    });

    return mergedBookings;
  };

  const displayedBookings = getGroupedBookings(displayedBookingsRaw);

  return (
    <div style={{...styles.container, padding: 16}}>
      {isDataLoading ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
          {/* Rewards card skeleton */}
          <div className="sporty-card glow-gold" style={{marginBottom: 0, display: 'flex', flexDirection: 'column', gap: 12}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div className="shimmer" style={{height: 18, width: 120, borderRadius: 4}} />
              <div className="shimmer" style={{height: 14, width: 60, borderRadius: 4}} />
            </div>
            <div style={{height: 8, background: 'var(--border-light)', borderRadius: 4, overflow: 'hidden'}} className="shimmer" />
            <div className="shimmer" style={{height: 12, width: '90%', borderRadius: 4}} />
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            <div className="shimmer" style={{height: 18, width: 140, borderRadius: 4, marginBottom: 8}} />
            {[1, 2].map(i => (
              <div key={i} className="sporty-card glow-green" style={{display: 'flex', flexDirection: 'column', gap: 10, padding: 16}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div className="shimmer" style={{height: 16, width: '45%', borderRadius: 4}} />
                  <div className="shimmer" style={{height: 18, width: 60, borderRadius: 10}} />
                </div>
                <div className="shimmer" style={{height: 13, width: '60%', borderRadius: 4}} />
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8}}>
                  <div className="shimmer" style={{height: 14, width: 80, borderRadius: 4}} />
                  <div className="shimmer" style={{height: 16, width: 60, borderRadius: 4}} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="sporty-card glow-gold" style={{marginBottom: 20}}>
        <div className="flex-between">
          <h3 style={{fontSize: '1.1rem', color: 'var(--primary)'}}>🏆 VENUE REWARDS</h3>
          <span style={{fontSize: '0.85rem', color: "var(--text-primary)"}}>{currentVisits} / {targetVisits} visits</span>
        </div>
        <div style={styles.progressTrackBar}>
          <div style={{...styles.progressIndicator, width: `${(currentVisits / targetVisits) * 100}%`}} />
        </div>
        <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8}}>
          Complete 7 bookings at Smash Box Arena to earn ₹250 cashback off your next hourly booking!
        </p>
      </div>

      <h3>MY BOOKINGS ({displayedBookings.length})</h3>
      <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8}}>
        {displayedBookings.length > 0 ? (
          displayedBookings.map(b => (
            <div key={b.id} className="sporty-card glow-green">
              <div className="flex-between">
                <h4 style={{color: "var(--text-primary)"}}>{b.venueName}</h4>
                <span className="role-badge batsman">{b.status}</span>
              </div>
              <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4}}>{b.date} | {b.timeSlot}</p>
              
              <div style={{marginTop: 12}} className="flex-between">
                <span style={{fontSize: '0.85rem', color: 'var(--primary)', cursor: 'pointer'}}>Get QR Code 📲</span>
                <span style={{fontSize: '0.9rem', color: "var(--text-primary)", fontWeight: 'bold'}}>Paid: ₹{b.amountPaid}</span>
              </div>

              {b.status !== 'CANCELLED' && (
                <div style={{marginTop: 10, display: 'flex', justifyContent: 'flex-end'}}>
                  <button
                    onClick={async () => {
                      const confirm = await showConfirm(
                        'Cancel Booking',
                        `Are you sure you want to cancel your booking at ${b.venueName} for ${b.date} (${b.timeSlot})?`
                      );
                      if (confirm) {
                        if (b.originalBookings) {
                          b.originalBookings.forEach(ob => {
                            cancelBooking(ob.id);
                          });
                        } else {
                          cancelBooking(b.id);
                        }
                      }
                    }}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: 'transparent',
                      border: '1px solid #EF4444',
                      color: '#EF4444',
                      borderRadius: 6,
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Cancel Booking ❌
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="sporty-card" style={{textAlign: 'center', padding: 16}}>
            No active bookings found. Go to home and search to book.
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}

/* ==========================================================================
   12b. PLAYSTATION GAMING HUB VIEW
   ========================================================================== */
function GamingHubView() {
  const { setCurrentScreen, bookings, bookSlot, userName, venues, selectedVenueId, setSelectedVenueId, showAlert, showError } = useAppState();

  const [activeVenueId, setActiveVenueId] = React.useState(selectedVenueId);
  const [selectedDate, setSelectedDate] = React.useState('');
  const [selectedStationId, setSelectedStationId] = React.useState('');
  const [selectedSlotTimes, setSelectedSlotTimes] = React.useState([]);
  const [showPayment, setShowPayment] = React.useState(false);
  const [paymentLoading, setPaymentLoading] = React.useState(false);
  const [isMultiplayer, setIsMultiplayer] = React.useState(false);
  const [playerCount, setPlayerCount] = React.useState(2); // 2, 3, 4
  const [hubImgIdx, setHubImgIdx] = React.useState(0);

  // Find all venues offering Gaming
  const gamingArenas = venues.filter(v => 
    v.id === 'gaming-hub' || 
    v.sport === 'Gaming' || 
    (Array.isArray(v.sports) && v.sports.includes('Gaming'))
  );

  // Sync with AppState selectedVenueId
  React.useEffect(() => {
    setActiveVenueId(selectedVenueId);
  }, [selectedVenueId]);

  const currentVenue = venues.find(v => v.id === activeVenueId);

  // Helper to parse gaming details
  const getVenueGamingDetails = (v) => {
    if (!v) return null;
    if (v.id === 'gaming-hub' && !v.gamingDetails) {
      return {
        ps5Count: 3,
        ps4Count: 1,
        pcCount: 2,
        availableGames: "FIFA 24, Tekken 8, Spider-Man 2, GTA V, Valorant",
        ps5SinglePrice: 150,
        ps5MultiPrice: 100,
        ps4SinglePrice: 100,
        ps4MultiPrice: 80,
        pcSinglePrice: 120,
        pcMultiPrice: 120
      };
    }
    return v.gamingDetails ? (typeof v.gamingDetails === 'string' ? JSON.parse(v.gamingDetails) : v.gamingDetails) : null;
  };

  // Generate dynamic stations
  const gd = React.useMemo(() => getVenueGamingDetails(currentVenue), [currentVenue]);
  const dynamicStations = React.useMemo(() => {
    if (!currentVenue) return [];
    
    // If venue doesn't have custom details set, default to some fallback
    const config = gd || {
      ps5Count: 1,
      ps4Count: 0,
      pcCount: 0,
      availableGames: "Various Games Available",
      ps5SinglePrice: currentVenue.pricePerHour || 150,
      ps5MultiPrice: 100,
    };

    const stations = [];
    
    // PS5
    if (config.ps5Count > 0) {
      stations.push({
        id: 'ps5',
        name: 'PS5',
        displayName: `PS5 × ${config.ps5Count}`,
        type: 'ps5',
        specs: '4K HDR · DualSense · 120fps · 55" OLED',
        singlePrice: config.ps5SinglePrice || 150,
        multiPrice: config.ps5MultiPrice || 250,
        icon: '🎮',
        count: config.ps5Count,
        isFeatured: true
      });
    }

    // PS4
    if (config.ps4Count > 0) {
      stations.push({
        id: 'ps4',
        name: 'PS4 Pro',
        displayName: `PS4 Pro × ${config.ps4Count}`,
        type: 'ps4',
        specs: '4K Gaming · DualShock 4 · VR Ready',
        singlePrice: config.ps4SinglePrice || 100,
        multiPrice: config.ps4MultiPrice || 180,
        icon: '🎮',
        count: config.ps4Count
      });
    }

    // PC
    if (config.pcCount > 0) {
      stations.push({
        id: 'pc',
        name: 'Gaming PC',
        displayName: `Gaming PC × ${config.pcCount}`,
        type: 'pc',
        specs: 'RTX 4070 · 240Hz · Mechanical KB',
        singlePrice: config.pcSinglePrice || 120,
        multiPrice: config.pcMultiPrice || 120,
        icon: '🖥️',
        count: config.pcCount
      });
    }

    // Ultimate fallback
    if (stations.length === 0) {
      stations.push({
        id: 'gaming-station-default',
        name: 'General Gaming Station',
        displayName: 'General Gaming Station',
        type: 'ps5',
        specs: 'Console / PC Station',
        singlePrice: currentVenue.pricePerHour || 100,
        multiPrice: (currentVenue.pricePerHour || 100) * 1.5,
        icon: '🎮',
        count: 1
      });
    }

    return stations;
  }, [currentVenue, gd]);

  const getSelectableDates = () => {
    const today = new Date();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const list = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const label = i === 0 ? 'Today' : daysOfWeek[d.getDay()];
      const dateVal = `${d.getDate()} ${months[d.getMonth()]}`;
      list.push({ label, date: dateVal, year: d.getFullYear() });
    }
    return list;
  };

  const selectableDates = React.useMemo(() => getSelectableDates(), []);

  // Initialize selected station and date
  React.useEffect(() => {
    if (selectableDates.length > 0 && !selectedDate) {
      setSelectedDate(selectableDates[0].date);
    }
  }, [selectableDates, selectedDate]);

  React.useEffect(() => {
    if (dynamicStations.length > 0) {
      setSelectedStationId(dynamicStations[0].id);
    }
    setSelectedSlotTimes([]);
  }, [activeVenueId, dynamicStations.length]);

  const selectedDateItem = selectableDates.find(d => d.date === selectedDate);
  const selectedYear = selectedDateItem ? selectedDateItem.year : new Date().getFullYear();
  const selectedStation = dynamicStations.find(s => s.id === selectedStationId) || dynamicStations[0];

  React.useEffect(() => {
    setIsMultiplayer(false);
  }, [selectedStationId]);

  const formattedFullDate = `${selectedDate} ${selectedYear}`;

  const isSlotInPast = (dateStr, slotTimeRange) => {
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const todayStr = `${today.getDate()} ${months[today.getMonth()]}`;
    
    if (dateStr !== todayStr) {
      return false;
    }
    
    const startStr = slotTimeRange.split(' - ')[0];
    const [timePart, ampm] = startStr.split(' ');
    let [hourStr, minStr] = timePart.split(':');
    let hour = parseInt(hourStr);
    const minutes = parseInt(minStr) || 0;
    
    if (ampm === 'PM' && hour !== 12) {
      hour += 12;
    } else if (ampm === 'AM' && hour === 12) {
      hour = 0;
    }
    
    const slotDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, minutes);
    return slotDateTime < today;
  };

  const areAllKeyStationsOccupied = (dateStr, slotTime) => {
    if (!currentVenue) return false;
    const ps5Station = dynamicStations.find(s => s.type === 'ps5');
    const pcStation = dynamicStations.find(s => s.type === 'pc');
    
    const ps5Exists = !!ps5Station;
    const pcExists = !!pcStation;
    
    if (!ps5Exists && !pcExists) return false;

    const isSingleStationBooked = (station) => {
      if (!station) return true;
      const count = station.count || 1;
      const searchPattern = station.type === 'ps5' ? 'PS5' : (station.type === 'ps4' ? 'PS4' : 'Gaming PC');
      const bookedCount = bookings.filter(b => 
        b.venueId === currentVenue.id &&
        (b.venueName.includes(searchPattern) || 
         (b.customerName && b.customerName.includes(searchPattern)) || 
         b.venueName === currentVenue.name) &&
        b.date === dateStr &&
        b.timeSlot === slotTime &&
        b.status !== 'CANCELLED'
      ).length;
      return bookedCount >= count;
    };

    const ps5Occupied = ps5Exists ? isSingleStationBooked(ps5Station) : true;
    const pcOccupied = pcExists ? isSingleStationBooked(pcStation) : true;

    return ps5Occupied && pcOccupied;
  };

  const isSlotBooked = (station, dateStr, slotTime) => {
    if (!currentVenue || !station) return false;

    // If both PS5 and Gaming PC are occupied at this slot, block any booking
    if (areAllKeyStationsOccupied(dateStr, slotTime)) {
      return true;
    }

    const count = station.count || 1;
    const searchPattern = station.type === 'ps5' ? 'PS5' : (station.type === 'ps4' ? 'PS4' : 'Gaming PC');
    const bookedCount = bookings.filter(b => 
      b.venueId === currentVenue.id &&
      (b.venueName.includes(searchPattern) || 
       (b.customerName && b.customerName.includes(searchPattern)) || 
       b.venueName === currentVenue.name) &&
      b.date === dateStr &&
      b.timeSlot === slotTime &&
      b.status !== 'CANCELLED'
    ).length;
    return bookedCount >= count;
  };

  const generate24HourSlots = () => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      const startHourNum = i;
      const endHourNum = (i + 1) % 24;
      const formatHour = (h) => {
        const displayHour = h === 0 || h === 12 ? 12 : h % 12;
        const ampm = h >= 12 ? 'PM' : 'AM';
        return `${displayHour.toString().padStart(2, '0')}:00 ${ampm}`;
      };
      slots.push(`${formatHour(startHourNum)} - ${formatHour(endHourNum)}`);
    }
    return slots;
  };

  const allSlots = React.useMemo(() => generate24HourSlots(), []);

  const handleSlotClick = (slotTime) => {
    if (!selectedStation) return;
    const booked = isSlotBooked(selectedStation, formattedFullDate, slotTime);
    const passed = isSlotInPast(selectedDate, slotTime);
    if (booked || passed) return;

    setSelectedSlotTimes(prev => 
      prev.includes(slotTime) ? prev.filter(t => t !== slotTime) : [...prev, slotTime]
    );
  };

  const hourlyPrice = selectedStation ? (isMultiplayer ? selectedStation.multiPrice * playerCount : selectedStation.singlePrice) : 0;
  const calculatedTotal = hourlyPrice * selectedSlotTimes.length;

  const hasConflict = selectedSlotTimes.some(slotTime => 
    selectedStation && (
      isSlotBooked(selectedStation, formattedFullDate, slotTime) ||
      isSlotInPast(selectedDate, slotTime)
    )
  );

  const handleBooking = async () => {
    if (selectedSlotTimes.length === 0) {
      await showError('Booking Error', 'Please select at least one slot!');
      return;
    }
    if (hasConflict) {
      await showError('Conflict Error', 'Conflict! One or more selected slots are already booked.');
      return;
    }
    setShowPayment(true);
  };

  const confirmPayment = async (e) => {
    e.preventDefault();
    // kept for compatibility but replaced by handleRazorpayPayment below
  };

  const handleRazorpayPayment = async () => {
    setPaymentLoading(true);
    try {
      const orderRes = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: calculatedTotal * 100, // paise
          receipt: `gaming_${currentVenue?.id}_${Date.now()}`,
          notes: {
            venue: currentVenue?.name,
            station: selectedStation?.name,
            date: formattedFullDate,
            slots: selectedSlotTimes.join(', ')
          }
        })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Order creation failed');

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Playfinity Gaming',
        description: `${currentVenue?.name} — ${selectedStation?.name} (${selectedSlotTimes.length} hr)`,
        order_id: orderData.orderId,
        handler: async (response) => {
          const verifyRes = await fetch(`${API_BASE}/api/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            const gameModeSuffix = isMultiplayer ? `(Multiplayer - ${playerCount} Players)` : `(Single Player)`;
            const bookingVenueName = `${currentVenue.name} - ${selectedStation.name} ${gameModeSuffix}`;
            bookSlot(currentVenue.id, formattedFullDate, selectedSlotTimes, calculatedTotal, false, userName, bookingVenueName);
            await showAlert('Booking Confirmed 🎉', `Yes, your booking is confirmed! ${selectedStation.name} reserved at ${currentVenue.name} for ${formattedFullDate}. Payment ID: ${response.razorpay_payment_id}.`);
            setShowPayment(false);
            setSelectedSlotTimes([]);
            setCurrentScreen('rewards');
          } else {
            await showError('Payment Failed', 'Payment verification failed. Please contact support.');
          }
        },
        prefill: {},
        theme: { color: '#00D4FF' },
        modal: { ondismiss: () => setPaymentLoading(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async (resp) => {
        setPaymentLoading(false);
        await showError('Payment Failed', resp.error?.description || 'Payment was not completed.');
      });
      rzp.open();
    } catch (err) {
      setPaymentLoading(false);
      await showError('Payment Error', err.message || 'Could not initiate payment.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleBackToDirectory = () => {
    setActiveVenueId(null);
    setSelectedVenueId(null);
    setSelectedSlotTimes([]);
  };

  // 1. DIRECTORY VIEW
  if (!currentVenue) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        paddingBottom: 24,
        background: '#F9FAFB',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)'
      }}>
        {/* Header */}
        <div style={{
          padding: '32px 16px 24px',
          background: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          textAlign: 'center',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            backgroundColor: '#FFE4E6', // soft pink background
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
            boxShadow: '0 4px 12px rgba(225, 29, 72, 0.12)'
          }}>
            <Gamepad2 size={30} color="#E11D48" />
          </div>
          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: 800,
            color: '#111827',
            margin: '0 0 6px 0',
            fontFamily: 'var(--font-label)',
            letterSpacing: '-0.3px',
            lineHeight: 1.2
          }}>Gaming Hub Directory</h2>
          <p style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: 4, fontFamily: 'var(--font-body)' }}>
            Book premium PlayStation consoles and High-End Gaming PCs
          </p>
        </div>

        {/* Directory List */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {gamingArenas.length > 0 ? (
            gamingArenas.map(v => {
              const details = getVenueGamingDetails(v);
              const minPrice = details ? Math.min(
                details.ps5Count > 0 ? details.ps5SinglePrice : 9999,
                details.ps4Count > 0 ? details.ps4SinglePrice : 9999,
                details.pcCount > 0 ? details.pcSinglePrice : 9999
              ) : v.pricePerHour;
              
              const finalMinPrice = minPrice === 9999 ? v.pricePerHour : minPrice;

              return (
                <div 
                  key={v.id} 
                  style={{
                    padding: 0,
                    borderRadius: 16,
                    border: '1px solid #E5E7EB',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    position: 'relative'
                  }}
                >
                  {/* Image Container with overlays */}
                  <div style={{ position: 'relative', width: '100%', height: 200 }}>
                    <img 
                      src={v.images && v.images.length > 0 ? v.images[0] : 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3'} 
                      alt={v.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    
                    {/* Esports Arena Badge - Top Left */}
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      backgroundColor: '#FFFFFF',
                      color: '#1F2937',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      fontFamily: 'var(--font-label)',
                      padding: '5px 12px',
                      borderRadius: 20,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}>
                      <Gamepad2 size={13} color="#EF4444" fill="#EF4444" style={{ flexShrink: 0 }} />
                      Esports Arena
                    </div>

                    {/* Rating Badge - Top Right */}
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: 'rgba(15, 23, 42, 0.65)',
                      backdropFilter: 'blur(4px)',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      fontFamily: 'var(--font-label)',
                      padding: '4px 10px',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <span style={{ color: '#FBBF24', fontSize: '0.8rem' }}>★</span>
                      {v.rating || '4.8'}
                    </div>

                    {/* Open Now Badge - Bottom Left */}
                    <div style={{
                      position: 'absolute',
                      bottom: 12,
                      left: 12,
                      backgroundColor: 'rgba(15, 23, 42, 0.65)',
                      backdropFilter: 'blur(4px)',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      fontFamily: 'var(--font-label)',
                      padding: '4px 10px',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <span style={{
                        display: 'inline-block',
                        width: 6,
                        height: 6,
                        backgroundColor: '#10B981',
                        borderRadius: '50%'
                      }} />
                      Open now
                    </div>
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: 16 }}>
                    {/* Title & Reviews Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                      <h4 style={{ 
                        fontSize: '1.15rem',
                        fontFamily: 'var(--font-label)',
                        fontWeight: '800',
                        color: '#111827',
                        margin: 0,
                        lineHeight: 1.3,
                        letterSpacing: '-0.1px'
                      }}>{v.name}</h4>
                      <span style={{
                        fontSize: '0.8rem',
                        color: '#6B7280',
                        fontWeight: '500',
                        fontFamily: 'var(--font-body)'
                      }}>{v.reviews?.length || 156} reviews</span>
                    </div>

                    {/* Location Row (MapPin + Address & Distance) */}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        fontSize: '0.85rem',
                        color: '#6B7280',
                        textDecoration: 'none',
                        marginTop: 4,
                        marginBottom: 12
                      }}
                    >
                      <MapPin size={14} color="#EF4444" fill="#EF4444" style={{ flexShrink: 0 }} />
                      <span>{v.address}{v.distance ? ` • ${v.distance} km` : ''}</span>
                    </a>

                    {/* Facility Chips Row (6x Gaming PC & 2x PS5 style) */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        backgroundColor: '#E0F2FE', // soft sky blue background
                        color: '#1E293B',          // slate-800
                        padding: '6px 14px',
                        borderRadius: 20,
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        fontFamily: 'var(--font-label)'
                      }}>
                        <Monitor size={14} color="#EF4444" style={{ flexShrink: 0 }} />
                        {details && details.pcCount > 0 ? `${details.pcCount}x Gaming PC` : '6x Gaming PC'}
                      </span>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        backgroundColor: '#E0F2FE', // soft sky blue background
                        color: '#1E293B',          // slate-800
                        padding: '6px 14px',
                        borderRadius: 20,
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        fontFamily: 'var(--font-label)'
                      }}>
                        <Gamepad2 size={14} color="#EF4444" style={{ flexShrink: 0 }} />
                        {details && details.ps5Count > 0 ? `${details.ps5Count}x PS5` : '2x PS5'}
                      </span>
                    </div>

                    {/* Popular Games Section */}
                    <div style={{
                      backgroundColor: '#F3F4F6',
                      padding: '12px 16px',
                      borderRadius: 12,
                      marginTop: 14,
                      marginBottom: 16
                    }}>
                      <div style={{
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        color: '#4B5563',
                        fontFamily: 'var(--font-label)',
                        letterSpacing: '0.5px',
                        marginBottom: 6,
                        textTransform: 'uppercase'
                      }}>
                        POPULAR GAMES
                      </div>
                      <div style={{
                        fontSize: '0.82rem',
                        color: '#1F2937',
                        fontWeight: '500',
                        fontFamily: 'var(--font-body)',
                        lineHeight: 1.4
                      }}>
                        {details ? details.availableGames.split(', ').join(' • ') : 'Valorant • CS2 • League of Legends • Apex Legends'}
                      </div>
                    </div>
                    
                    {/* Divider */}
                    <div style={{ height: 1, background: '#E5E7EB', marginBottom: 14 }} />

                    {/* Price & Book Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                        <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#111827', fontFamily: 'var(--font-label)' }}>
                          ₹{finalMinPrice}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#6B7280', fontFamily: 'var(--font-body)' }}>/hr</span>
                      </div>
                      <button
                        onClick={() => {
                          setActiveVenueId(v.id);
                          setSelectedVenueId(v.id);
                        }}
                        style={{
                          background: '#DC2626', // solid red
                          color: '#fff',
                          border: 'none',
                          borderRadius: 25,
                          padding: '10px 22px',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          fontFamily: 'var(--font-label)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          boxShadow: '0 4px 12px rgba(220,38,38,0.35)',
                          transition: 'transform 0.15s, box-shadow 0.15s',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(220,38,38,0.45)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(220,38,38,0.35)'; }}
                      >
                        Book Slot <Zap size={14} color="#FFF" fill="#FFF" style={{ flexShrink: 0 }} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="sporty-card" style={{ textAlign: 'center', padding: 32 }}>
              <span style={{ fontSize: '2.5rem' }}>🎮</span>
              <h4 style={{ color: '#FFF', fontSize: '1.1rem', marginTop: 12 }}>No Registered Gaming Arenas</h4>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: 6 }}>
                Switch to owner mode and register a venue with 'Gaming' sport selected to see it here.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. ACTIVE BOOKING VIEW FOR SELECTED VENUE
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      paddingBottom: 24,
      background: '#F9FAFB',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-body)'
    }}>
      
      {/* HERO IMAGE GALLERY */}
      {currentVenue.images && currentVenue.images.length > 0 ? (
        <div style={{ position: 'relative' }}>
          <img
            src={currentVenue.images[hubImgIdx] || currentVenue.images[0]}
            alt={currentVenue.name}
            style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
          />
          {/* Dark gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)'
          }} />
          {/* Back button */}
          <button
            onClick={handleBackToDirectory}
            style={{
              position: 'absolute', top: 14, left: 14,
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
              border: 'none', borderRadius: 10, padding: '6px 12px',
              color: '#FFF', fontSize: '0.8rem', fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            ← Back
          </button>
          {/* Image count badge */}
          {currentVenue.images.length > 1 && (
            <div style={{
              position: 'absolute', top: 14, right: 14,
              background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
              color: '#FFF', fontSize: '0.72rem', fontWeight: 700,
              padding: '4px 10px', borderRadius: 12
            }}>
              {hubImgIdx + 1} / {currentVenue.images.length}
            </div>
          )}
          {/* Venue name overlay */}
          <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Gamepad2 size={18} color="#FFF" />
              </div>
              <h2 style={{
                fontSize: '1.3rem', fontWeight: 800, color: '#FFF',
                fontFamily: 'var(--font-label)', letterSpacing: '-0.2px',
                margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.4)'
              }}>{currentVenue.name}</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={12} color="#FDA4AF" fill="rgba(253,164,175,0.3)" />
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)' }}>{currentVenue.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={12} color="#FBBF24" fill="#FBBF24" />
                <span style={{ fontSize: '0.75rem', color: '#FFF', fontWeight: 700 }}>{currentVenue.rating || '5.0'}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '32px 16px 24px',
          background: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            backgroundColor: '#FFE4E6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 12, boxShadow: '0 4px 12px rgba(225, 29, 72, 0.12)'
          }}>
            <Gamepad2 size={30} color="#E11D48" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', margin: '0 0 6px 0', fontFamily: 'var(--font-label)' }}>{currentVenue.name}</h2>
          <button onClick={handleBackToDirectory} style={{ fontSize: '0.82rem', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}>← Back to Directory</button>
        </div>
      )}
      {/* THUMBNAIL STRIP */}
      {currentVenue.images && currentVenue.images.length > 1 && (
        <div style={{
          display: 'flex', gap: 8, padding: '10px 16px',
          overflowX: 'auto', backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          scrollbarWidth: 'none', msOverflowStyle: 'none'
        }}>
          {currentVenue.images.map((imgUrl, idx) => (
            <div
              key={idx}
              onClick={() => setHubImgIdx(idx)}
              style={{
                flexShrink: 0, width: 72, height: 52, borderRadius: 8,
                overflow: 'hidden', cursor: 'pointer',
                border: idx === hubImgIdx ? '2.5px solid #E11D48' : '2px solid transparent',
                opacity: idx === hubImgIdx ? 1 : 0.55,
                transition: 'all 0.2s'
              }}
            >
              <img src={imgUrl} alt={`Photo ${idx+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: 16 }}>
        
        {/* Phone No Section */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8, 
          marginBottom: 16, 
          padding: '8px 12px', 
          background: 'var(--bg-surface)', 
          borderRadius: 10, 
          border: '1px solid rgba(255,255,255,0.07)', 
          alignSelf: 'flex-start',
          width: 'fit-content'
        }}>
          <Phone size={14} color="#E11D48" />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Phone No:</span>
          <span 
            onClick={() => { window.location.href = `tel:${currentVenue.caretakerPhone || currentVenue.phone}`; }}
            style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 700, cursor: 'pointer' }}
          >
            {currentVenue.caretakerPhone || currentVenue.phone}
          </span>
        </div>
        
        {/* DATE SELECTOR */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{
            fontSize: '0.78rem',
            color: '#4B5563',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: 12,
            fontFamily: 'var(--font-label)',
            fontWeight: '800'
          }}>Select Date</h4>
          <div style={{
            display: 'flex',
            gap: 10,
            overflowX: 'auto',
            paddingBottom: 6,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}>
            {selectableDates.map(d => {
              const isActive = selectedDate === d.date;
              const [dayNum, monthStr] = d.date.split(' ');
              return (
                <button
                  key={d.date}
                  onClick={() => {
                    setSelectedDate(d.date);
                    setSelectedSlotTimes([]);
                  }}
                  style={{
                    flexShrink: 0,
                    width: 72,
                    height: 96,
                    padding: '12px 6px',
                    borderRadius: 16,
                    border: '1.5px solid',
                    borderColor: isActive ? '#FDA4AF' : '#E5E7EB',
                    background: isActive ? '#FFF1F2' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s',
                    boxShadow: isActive ? '0 4px 12px rgba(244,63,94,0.06)' : 'none'
                  }}
                >
                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    color: isActive ? '#E11D48' : '#9CA3AF',
                    fontFamily: 'var(--font-label)'
                  }}>{d.label}</div>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: '800',
                    color: isActive ? '#E11D48' : '#111827',
                    fontFamily: 'var(--font-label)',
                    lineHeight: 1
                  }}>{dayNum}</div>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    color: isActive ? '#E11D48' : '#9CA3AF',
                    fontFamily: 'var(--font-body)'
                  }}>{monthStr}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STATIONS SECTION */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{
            fontSize: '0.78rem',
            color: '#4B5563',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: 12,
            fontFamily: 'var(--font-label)',
            fontWeight: '800'
          }}>Select Gaming Station</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {dynamicStations.map(station => {
              const isSelected = selectedStationId === station.id;
              return (
                <div
                  key={station.id}
                  onClick={() => {
                    setSelectedStationId(station.id);
                    setSelectedSlotTimes([]);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: 16,
                    borderRadius: 16,
                    border: '1.5px solid',
                    borderColor: isSelected ? '#F43F5E' : '#E5E7EB',
                    background: '#FFFFFF',
                    boxShadow: isSelected ? '0 4px 14px rgba(244, 63, 94, 0.06)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    background: isSelected ? '#FCE7F3' : '#F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {station.type === 'pc' ? (
                      <Monitor size={24} color={isSelected ? '#E11D48' : '#4B5563'} />
                    ) : (
                      <Gamepad2 size={24} color={isSelected ? '#E11D48' : '#4B5563'} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', fontFamily: 'var(--font-label)' }}>
                        {station.name} × {station.count}
                      </span>
                      {station.isFeatured && (
                        <span style={{
                          fontSize: '0.62rem',
                          background: '#FFE4E6',
                          color: '#E11D48',
                          padding: '2px 8px',
                          borderRadius: 6,
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          fontFamily: 'var(--font-label)',
                          letterSpacing: '0.3px'
                        }}>Featured</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: 4, fontFamily: 'var(--font-body)', fontWeight: '500' }}>
                      {station.specs}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: 4, fontFamily: 'var(--font-body)' }}>
                      {station.type === 'pc' ? (
                        <span>Single: ₹{station.singlePrice}/hr</span>
                      ) : (
                        <span>Single: ₹{station.singlePrice}/hr • Multiplayer: ₹{station.multiPrice}/hr</span>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#E11D48', fontFamily: 'var(--font-label)' }}>
                      ₹{station.singlePrice}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#6B7280', fontFamily: 'var(--font-body)', marginTop: 2 }}>/ hour</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MULTIPLAYER / GAME MODE SELECTOR */}
        {selectedStation && selectedStation.type !== 'pc' && (
          <div style={{ marginBottom: 24 }}>
            <h4 style={{
              fontSize: '0.78rem',
              color: '#4B5563',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              marginBottom: 12,
              fontFamily: 'var(--font-label)',
              fontWeight: '800'
            }}>Select Game Mode</h4>
            <div style={{ display: 'flex', gap: 12, marginBottom: isMultiplayer ? 16 : 0 }}>
              <button
                onClick={() => {
                  setIsMultiplayer(false);
                  setSelectedSlotTimes([]);
                }}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 14,
                  border: '1.5px solid',
                  borderColor: !isMultiplayer ? '#F43F5E' : '#E5E7EB',
                  background: !isMultiplayer ? '#FFF1F2' : '#FFFFFF',
                  color: !isMultiplayer ? '#E11D48' : '#4B5563',
                  fontSize: '0.85rem',
                  fontWeight: !isMultiplayer ? '800' : '600',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-label)',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
              >
                Single Player
              </button>
              <button
                onClick={() => {
                  setIsMultiplayer(true);
                  setSelectedSlotTimes([]);
                }}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 14,
                  border: '1.5px solid',
                  borderColor: isMultiplayer ? '#F43F5E' : '#E5E7EB',
                  background: isMultiplayer ? '#FFF1F2' : '#FFFFFF',
                  color: isMultiplayer ? '#E11D48' : '#4B5563',
                  fontSize: '0.85rem',
                  fontWeight: isMultiplayer ? '800' : '600',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-label)',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
              >
                Multiplayer
              </button>
            </div>

            {/* Number of Players Selection Row */}
            {isMultiplayer && (
              <div style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 16,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.85rem', color: '#374151', fontWeight: '600', fontFamily: 'var(--font-body)' }}>
                    Number of Players:
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[2, 3, 4].map(num => {
                        const isActive = playerCount === num;
                        return (
                          <button
                            key={num}
                            onClick={() => {
                              setPlayerCount(num);
                              setSelectedSlotTimes([]);
                            }}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              border: 'none',
                              background: isActive ? '#E11D48' : '#F3F4F6',
                              color: isActive ? '#FFFFFF' : '#4B5563',
                              fontSize: '0.85rem',
                              fontWeight: '800',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s'
                            }}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>or</span>
                    <input
                      type="number"
                      min={2}
                      placeholder="Custom"
                      value={playerCount}
                      onChange={e => {
                        const val = Math.max(2, parseInt(e.target.value) || 2);
                        setPlayerCount(val);
                        setSelectedSlotTimes([]);
                      }}
                      style={{
                        width: 60,
                        height: 36,
                        padding: '0 8px',
                        borderRadius: 10,
                        border: '1px solid #E5E7EB',
                        background: '#FFFFFF',
                        color: '#111827',
                        fontSize: '0.85rem',
                        fontWeight: '800',
                        textAlign: 'center',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Rate & Split Info Row */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.78rem',
                  color: '#E11D48',
                  fontWeight: '700',
                  fontFamily: 'var(--font-body)',
                  borderTop: '1px dashed #E5E7EB',
                  paddingTop: 10,
                  marginTop: 4
                }}>
                  <span>Total Rate: ₹{(selectedStation.multiPrice || 100) * playerCount}/hr</span>
                  <span>Split: ₹{selectedStation.multiPrice || 100}/hr per player</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TIME SLOTS GRID */}
        {selectedStation && (
          <div style={{ marginBottom: 24 }}>
            <h4 style={{
              fontSize: '0.78rem',
              color: '#4B5563',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              marginBottom: 12,
              fontFamily: 'var(--font-label)',
              fontWeight: '800'
            }}>
              Available Slots ({selectedDate})
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10
            }}>
              {allSlots.map(slotTime => {
                const booked = isSlotBooked(selectedStation, formattedFullDate, slotTime);
                const passed = isSlotInPast(selectedDate, slotTime);
                const active = selectedSlotTimes.includes(slotTime);

                let bgColor = '#FFFFFF';
                let borderCol = '#E5E7EB';
                let textColor = '#111827';
                let statusText = 'Available';

                if (booked) {
                  bgColor = '#F3F4F6';
                  borderCol = 'transparent';
                  textColor = '#9CA3AF';
                  statusText = 'Booked';
                } else if (passed) {
                  bgColor = '#F3F4F6';
                  borderCol = 'transparent';
                  textColor = '#9CA3AF';
                  statusText = 'Passed';
                } else if (active) {
                  bgColor = '#FFF1F2';
                  borderCol = '#F43F5E';
                  textColor = '#E11D48';
                  statusText = 'Selected';
                }

                return (
                  <button
                    key={slotTime}
                    onClick={() => handleSlotClick(slotTime)}
                    disabled={booked || passed}
                    style={{
                      padding: '12px 6px',
                      borderRadius: 12,
                      border: '1.5px solid',
                      borderColor: borderCol,
                      background: bgColor,
                      color: textColor,
                      cursor: (booked || passed) ? 'not-allowed' : 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s',
                      fontFamily: 'var(--font-body)',
                      boxShadow: active ? '0 2px 8px rgba(244,63,94,0.04)' : 'none'
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', fontWeight: '800', fontFamily: 'var(--font-label)' }}>
                      {slotTime.split(' - ')[0]}
                    </div>
                    <div style={{
                      fontSize: '0.6rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      marginTop: 4,
                      opacity: 0.8,
                      color: active ? '#E11D48' : booked ? '#9CA3AF' : '#6B7280'
                    }}>
                      {statusText}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* BOOKING SUMMARY PANEL */}
        {selectedSlotTimes.length > 0 && selectedStation && (
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #F43F5E',
            borderRadius: 16,
            padding: 16,
            marginTop: 16,
            boxShadow: '0 4px 20px rgba(225, 29, 72, 0.06)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: '0.65rem', color: '#E11D48', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '800' }}>Selected Station</span>
                <h4 style={{ fontSize: '1rem', color: '#111827', margin: '2px 0', fontFamily: 'var(--font-label)', fontWeight: '800' }}>{selectedStation.name}</h4>
                <span style={{ fontSize: '0.72rem', color: '#6B7280', display: 'block', fontFamily: 'var(--font-body)', fontWeight: '500' }}>
                  {formattedFullDate} · {selectedSlotTimes.length} Hour{selectedSlotTimes.length > 1 ? 's' : ''}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#E11D48', fontWeight: '800', marginTop: 4, display: 'inline-block', fontFamily: 'var(--font-label)' }}>
                  Mode: {isMultiplayer ? `Multiplayer (${playerCount} Players)` : 'Single Player'}
                </span>
              </div>
              <button
                onClick={() => setSelectedSlotTimes([])}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#E11D48',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontFamily: 'var(--font-body)'
                }}
              >
                Clear
              </button>
            </div>

            <div style={{
              borderTop: '1px dashed #E5E7EB',
              paddingTop: 12,
              marginBottom: 14,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline'
            }}>
              <span style={{ fontSize: '0.82rem', color: '#4B5563', fontFamily: 'var(--font-body)', fontWeight: '600' }}>Total Amount:</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#E11D48', fontFamily: 'var(--font-label)' }}>₹{calculatedTotal}</span>
            </div>

            <button
              onClick={handleBooking}
              style={{
                width: '100%',
                padding: '14px 0',
                borderRadius: 50,
                border: 'none',
                background: '#E11D48',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(225,29,72,0.25)',
                transition: 'transform 0.15s',
                fontFamily: 'var(--font-label)'
              }}
            >
              CONFIRM RESERVATION ⚡
            </button>
          </div>
        )}

      </div>

      {/* RAZORPAY PAYMENT MODAL */}
      {showPayment && selectedStation && (
        <div style={styles.modalOverlay}>
          <div
            style={{
              width: '90%',
              maxWidth: 380,
              padding: 24,
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              border: '2px solid #F43F5E',
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>💳</div>
            <h3 style={{ color: '#111827', marginBottom: 4, fontFamily: 'var(--font-label)', fontWeight: '800' }}>Confirm Payment</h3>
            <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: 20, fontFamily: 'var(--font-body)' }}>
              Secure payment powered by Razorpay
            </p>

            <div style={{
              backgroundColor: '#F9FAFB',
              borderRadius: 10,
              padding: 16,
              marginBottom: 20,
              textAlign: 'left',
              border: '1px solid #E5E7EB'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: '#6B7280', fontFamily: 'var(--font-body)' }}>Station</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827', fontFamily: 'var(--font-label)' }}>{selectedStation.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: '#6B7280', fontFamily: 'var(--font-body)' }}>Date</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827', fontFamily: 'var(--font-label)' }}>{formattedFullDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: '#6B7280', fontFamily: 'var(--font-body)' }}>Duration</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827', fontFamily: 'var(--font-label)' }}>{selectedSlotTimes.length} hour(s)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', color: '#6B7280', fontFamily: 'var(--font-body)' }}>Mode</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#E11D48', fontFamily: 'var(--font-label)' }}>{isMultiplayer ? `Multiplayer (${playerCount}P)` : 'Single Player'}</span>
              </div>
              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 10, marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#4B5563', fontFamily: 'var(--font-body)' }}>Total</span>
                <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#E11D48', fontFamily: 'var(--font-label)' }}>₹{calculatedTotal}</span>
              </div>
            </div>

            <button
              onClick={handleRazorpayPayment}
              disabled={paymentLoading}
              style={{
                width: '100%',
                padding: '13px 0',
                marginBottom: 10,
                borderRadius: 50,
                border: 'none',
                background: paymentLoading ? '#E5E7EB' : '#E11D48',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                fontWeight: '800',
                cursor: paymentLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(225,29,72,0.25)',
                fontFamily: 'var(--font-label)',
                textTransform: 'uppercase'
              }}
            >
              {paymentLoading ? 'Processing...' : `Pay ₹${calculatedTotal} via Razorpay`}
            </button>
            <button
              onClick={() => setShowPayment(false)}
              disabled={paymentLoading}
              style={{
                width: '100%',
                padding: '11px 0',
                borderRadius: 50,
                border: '1px solid #E5E7EB',
                background: 'none',
                color: '#6B7280',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: paymentLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-label)'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


/* ==========================================================================
   REACT APP STYLING OBJECTS
   ========================================================================== */
const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: 16,
    backdropFilter: 'blur(4px)'
  },
  appWrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  mainContent: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: 'var(--bg-primary)'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    paddingBottom: 24
  },
  splashHeader: {
    textAlign: 'center',
    marginBottom: 40
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 22,
    overflow: 'hidden',
    border: '1px solid var(--border-light)',
    backgroundColor: '#efeff4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    marginLeft: 'auto',
    marginRight: 'auto',
    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.05)'
  },
  logoBadgeImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  brandTitle: {
    fontFamily: "'Teko', sans-serif",
    fontSize: '3.2rem',
    color: "var(--text-primary)",
    fontWeight: '600',
    letterSpacing: '1px'
  },
  brandTagline: {
    fontFamily: 'var(--font-heading)',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    letterSpacing: '3px',
    marginTop: 2
  },
  roleSelectionGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  roleCard: {
    cursor: 'pointer',
    padding: 20,
    textAlign: 'left'
  },
  roleHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8
  },
  roleIcon: {
    fontSize: '1.5rem'
  },
  roleTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: "var(--text-primary)",
    letterSpacing: '0.5px'
  },
  roleSub: {
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    lineHeight: '1.4'
  },
  footerLink: {
    textAlign: 'center',
    marginTop: 40,
    color: 'var(--text-muted)',
    fontSize: '0.85rem'
  },
  authHeader: {
    textAlign: 'center',
    margin: '12px 0 24px 0'
  },
  phoneFlag: {
    position: 'absolute',
    left: 14,
    top: 12,
    fontSize: '0.9rem',
    color: 'var(--text-muted)'
  },
  permissionCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12
  },
  googleBtn: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    color: "var(--text-primary)",
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    padding: '12px 0',
    fontFamily: 'inherit',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 12
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    top: 13
  },
  chipScrollContainer: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    paddingBottom: 8,
    marginBottom: 16,
    whiteSpace: 'nowrap'
  },
  chipButton: {
    padding: '6px 14px',
    borderRadius: '999px',
    border: '1px solid',
    fontSize: '0.75rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  liveBannerCard: {
    cursor: 'pointer',
    padding: 16,
    borderLeft: '4px solid var(--primary)'
  },
  liveBallsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingTop: 10
  },
  ballCircle: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 'bold'
  },
  venueImageHeader: {
    width: '100%',
    height: 140,
    objectFit: 'cover'
  },
  ratingBadge: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    color: 'var(--primary)',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    border: '1px solid rgba(255,215,0,0.25)'
  },
  infoBadge: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  heroImage: {
    width: '100%',
    height: 200,
    objectFit: 'cover'
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60px',
    background: 'linear-gradient(to top, var(--bg-primary), transparent)'
  },
  phoneSection: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 6
  },
  progressTrackBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden'
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: 'var(--primary)',
    borderRadius: 3,
    transition: 'width 0.3s'
  },
  dateChip: {
    flex: 1,
    padding: '8px 4px',
    border: '1px solid',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'center'
  },
  slotGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 8
  },
  slotButton: {
    padding: '10px 4px',
    border: '1px solid',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  summaryRow: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginBottom: 6
  },
  advanceAlert: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    margin: '12px 0'
  },
  scorerDashboard: {
    display: 'flex',
    flexDirection: 'column'
  },
  scorerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 10
  },
  scoreButton: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    color: "var(--text-primary)",
    fontSize: '1.25rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: '600',
    padding: '16px 0',
    cursor: 'pointer',
    transition: 'all 0.1s'
  },
  statsCardGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12
  },
  calendarDayGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 4,
    textAlign: 'center'
  },
  calendarWeekday: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    padding: '4px 0',
    fontWeight: 'bold'
  },
  calendarDayCell: {
    padding: '6px 0',
    fontSize: '0.8rem',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 34
  },
  calendarDot: {
    width: 4,
    height: 4,
    borderRadius: '50%',
    position: 'absolute',
    bottom: 2
  },
  bracketContainer: {
    display: 'flex',
    gap: 20,
    overflowX: 'auto',
    paddingBottom: 16
  },
  bracketColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    minWidth: 150
  },
  bracketStageHeader: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    paddingBottom: 4
  },
  matchNode: {
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: 80
  },
  miniPlayerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    borderBottom: '1px solid rgba(255,255,255,0.02)'
  },
  miniJersey: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: 'rgba(170,255,0,0.1)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  profileAvatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    width: '100%'
  }
};

function CompletedMatchDetailModal() {
  const { selectedCompletedMatch, setSelectedCompletedMatch, teams } = useAppState();
  const [activeTab, setActiveTab] = useState('summary');

  if (!selectedCompletedMatch) return null;

  const m = selectedCompletedMatch;
  const state = m.matchState;
  const sport = m.sport || 'Cricket';
  const t1Captain = state?.team1Captain || '';
  const t2Captain = state?.team2Captain || '';

  // Sport color map
  const sportColors = {
    'Cricket': '#AAFF00',
    'Box Cricket': '#AAFF00',
    'Football': '#00FFFF',
    'Volleyball': '#FFD700',
    'Basketball': '#FF4500',
    'Pickleball': '#ADFF2F',
    'Golf': '#32CD32',
    'Hockey': '#FF1493',
    'Ice Hockey': '#00BFFF',
    'Skating': '#DA70D6'
  };
  const themeColor = sportColors[sport] || 'var(--primary)';

  // Dedicated high-contrast text color map for light mode backgrounds
  const textColors = {
    'Cricket': '#15803D',
    'Box Cricket': '#15803D',
    'Football': '#0E7490',
    'Volleyball': '#B45309',
    'Basketball': '#C2410C',
    'Pickleball': '#BE185D',
    'Golf': '#047857',
    'Hockey': '#1D4ED8',
    'Ice Hockey': '#0369A1',
    'Skating': '#6D28D9',
    'Badminton': '#B45309',
    'Tennis': '#4D7C0F',
    'Table Tennis': '#6D28D9',
    'Snooker': '#047857',
    'Pool': '#1D4ED8'
  };
  const labelColor = textColors[sport] || 'var(--primary)';

  // Helper to close modal
  const handleClose = () => {
    setSelectedCompletedMatch(null);
  };

  // Helper to calculate awards for Cricket
  const getAwards = () => {
    if (!state || sport !== 'Cricket') {
      return { bestBatsman: null, bestBowler: null, manOfTheMatch: null };
    }
    const allBatting = [];
    const allBowling = [];
    
    if (state.firstInningsBatting) {
      allBatting.push(...state.firstInningsBatting);
    }
    if (state.firstInningsBowling) {
      allBowling.push(...state.firstInningsBowling);
    }
    if (state.batting) {
      allBatting.push(...state.batting);
    }
    if (state.bowling) {
      allBowling.push(...state.bowling);
    }
    
    let bestBatsman = null;
    allBatting.forEach(b => {
      if (b.runs > 0) {
        const sr = b.balls > 0 ? (b.runs / b.balls) * 100 : 0;
        if (!bestBatsman || b.runs > bestBatsman.runs || (b.runs === bestBatsman.runs && sr > bestBatsman.sr)) {
          bestBatsman = { ...b, sr };
        }
      }
    });

    let bestBowler = null;
    allBowling.forEach(b => {
      const oversParts = (b.overs || '0.0').toString().split('.');
      const oversNum = parseInt(oversParts[0]) || 0;
      const ballsNum = parseInt(oversParts[1]) || 0;
      const totalBalls = (oversNum * 6) + ballsNum;
      if (b.wickets > 0 || totalBalls > 0) {
        const eco = totalBalls > 0 ? (b.runs / (totalBalls / 6)) : 99;
        if (!bestBowler) {
          bestBowler = { ...b, eco };
        } else if (b.wickets > bestBowler.wickets) {
          bestBowler = { ...b, eco };
        } else if (b.wickets === bestBowler.wickets && eco < bestBowler.eco) {
          bestBowler = { ...b, eco };
        }
      }
    });

    let manOfTheMatch = null;
    if (bestBatsman && bestBowler) {
      if (bestBowler.wickets >= 3) {
        manOfTheMatch = bestBowler.name;
      } else {
        manOfTheMatch = bestBatsman.name;
      }
    } else if (bestBatsman) {
      manOfTheMatch = bestBatsman.name;
    } else if (bestBowler) {
      manOfTheMatch = bestBowler.name;
    }

    return { bestBatsman, bestBowler, manOfTheMatch };
  };

  const awards = getAwards();

  // Scorecards / tabs according to sport
  const tabs = ['summary'];
  if (state) {
    if (sport === 'Cricket') {
      tabs.push('innings1', 'innings2', 'overs');
    } else if (['Football', 'Basketball', 'Hockey', 'Ice Hockey'].includes(sport)) {
      tabs.push('timeline');
    } else if (['Volleyball', 'Pickleball'].includes(sport)) {
      tabs.push('sets');
    } else if (sport === 'Golf') {
      tabs.push('scorecard');
    }
  }

  const renderTabContent = () => {
    if (activeTab === 'summary') {
      return (
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          {/* Main Info */}
          <div className="sporty-card" style={{padding: 16, borderLeft: `4px solid ${themeColor}`}}>
            <div className="flex-between" style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 10}}>
              <span>🏟️ Venue: <strong>{m.venue || 'Local Arena'}</strong></span>
              <span>📅 Date: <strong>{m.date || 'Today'}</strong></span>
            </div>
            {m.tossText && (
              <p style={{fontSize: '0.82rem', color: labelColor, margin: '8px 0', fontStyle: 'italic'}}>
                🪙 {m.tossText}
              </p>
            )}
            {m.scorerName && (
              <p style={{fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0 0'}}>
                ✍️ Scored by: <strong>{m.scorerName}</strong>
              </p>
            )}
          </div>

          {/* Cricket-specific Summary Awards */}
          {sport === 'Cricket' && state && (
            <div className="sporty-card glow-gold" style={{padding: 14}}>
              <h4 style={{color: '#FFD700', fontSize: '0.85rem', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                🏆 MATCH AWARDS
              </h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem'}}>
                {awards.bestBatsman && (
                  <div className="flex-between">
                    <span style={{color: 'var(--text-muted)'}}>🔥 Best Batter:</span>
                    <span style={{color: 'var(--text-primary)', fontWeight: 'bold'}}>
                      {awards.bestBatsman.name} ({awards.bestBatsman.runs} runs off {awards.bestBatsman.balls} balls)
                    </span>
                  </div>
                )}
                {awards.bestBowler && (
                  <div className="flex-between">
                    <span style={{color: 'var(--text-muted)'}}>🎯 Best Bowler:</span>
                    <span style={{color: 'var(--text-primary)', fontWeight: 'bold'}}>
                      {awards.bestBowler.name} ({awards.bestBowler.wickets} wkts, Eco: {Number(awards.bestBowler.eco).toFixed(1)})
                    </span>
                  </div>
                )}
                {awards.manOfTheMatch && (
                  <div className="flex-between" style={{borderTop: '1px solid rgba(255,215,0,0.15)', paddingTop: 8, marginTop: 4}}>
                    <span style={{color: '#FFD700', fontWeight: 'bold'}}>⭐ MVP / Match Hero:</span>
                    <span style={{color: 'var(--text-primary)', fontWeight: 'bold'}}>{awards.manOfTheMatch}</span>
                  </div>
                )}
                {!awards.bestBatsman && !awards.bestBowler && (
                  <p style={{fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', margin: 0}}>
                    No performance awards logged.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Non-cricket overview stats */}
          {sport !== 'Cricket' && state && (
            <div className="sporty-card" style={{padding: 14}}>
              <h4 style={{color: labelColor, fontSize: '0.85rem', marginBottom: 12, textTransform: 'uppercase'}}>Match Overview</h4>
              
              {sport === 'Skating' && (
                <div style={{display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem'}}>
                  <div className="flex-between" style={{fontWeight: 'bold', borderBottom: '1px solid var(--border-light)', paddingBottom: 6}}>
                    <span>Participant</span>
                    <span>Technical</span>
                    <span>Artistic</span>
                    <span>Total</span>
                  </div>
                  <div className="flex-between">
                    <span style={{fontWeight: 'bold'}}>{m.team1}</span>
                    <span>{(state.technicalScore1 || 0).toFixed(1)}</span>
                    <span>{(state.artisticScore1 || 0).toFixed(1)}</span>
                    <span className="text-gold" style={{fontWeight: 'bold'}}>{(state.totalScore1 || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex-between">
                    <span style={{fontWeight: 'bold'}}>{m.team2}</span>
                    <span>{(state.technicalScore2 || 0).toFixed(1)}</span>
                    <span>{(state.artisticScore2 || 0).toFixed(1)}</span>
                    <span className="text-gold" style={{fontWeight: 'bold'}}>{(state.totalScore2 || 0).toFixed(2)}</span>
                  </div>
                </div>
              )}

              {sport === 'Golf' && (
                <div className="flex-between" style={{fontSize: '0.85rem'}}>
                  <div>
                    <div style={{color: 'var(--text-muted)'}}>Total Holes:</div>
                    <div style={{fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: 4}}>{state.totalHoles || 9}</div>
                  </div>
                  <div>
                    <div style={{color: 'var(--text-muted)'}}>{m.team1} Strokes:</div>
                    <div style={{fontSize: '1rem', fontWeight: 'bold', color: labelColor, marginTop: 4}}>
                      {state.strokes1?.reduce((a,b)=>a+b,0)}
                    </div>
                  </div>
                  <div>
                    <div style={{color: 'var(--text-muted)'}}>{m.team2} Strokes:</div>
                    <div style={{fontSize: '1rem', fontWeight: 'bold', color: labelColor, marginTop: 4}}>
                      {state.strokes2?.reduce((a,b)=>a+b,0)}
                    </div>
                  </div>
                </div>
              )}

              {['Volleyball', 'Pickleball'].includes(sport) && (
                <div className="flex-between" style={{fontSize: '0.85rem'}}>
                  <div>
                    <div style={{color: 'var(--text-muted)'}}>Sets Won ({m.team1}):</div>
                    <div style={{fontSize: '1rem', fontWeight: 'bold', color: labelColor, marginTop: 4}}>{state.sets1}</div>
                  </div>
                  <div>
                    <div style={{color: 'var(--text-muted)'}}>Sets Won ({m.team2}):</div>
                    <div style={{fontSize: '1rem', fontWeight: 'bold', color: labelColor, marginTop: 4}}>{state.sets2}</div>
                  </div>
                </div>
              )}

              {['Football', 'Basketball', 'Hockey', 'Ice Hockey'].includes(sport) && (
                <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                  <div className="flex-between" style={{fontSize: '0.85rem'}}>
                    <span style={{color: 'var(--text-muted)'}}>Total Score:</span>
                    <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{m.runs} - {m.wickets}</span>
                  </div>
                  <div className="flex-between" style={{fontSize: '0.85rem'}}>
                    <span style={{color: 'var(--text-muted)'}}>Fouls logged:</span>
                    <span>{(state.fouls1 || 0)} vs {(state.fouls2 || 0)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'innings1' || activeTab === 'innings2') {
      const isInn1 = activeTab === 'innings1';
      return isInn1 ? (
        renderProfessionalScorecard({
          battingList: state.firstInningsBatting || [],
          bowlingList: state.firstInningsBowling || [],
          fallOfWickets: state.firstInningsFallOfWickets || [],
          extras: state.firstInningsExtras || { wides: 0, noBalls: 0, legByes: 0, byes: 0, total: 0 },
          runs: state.firstInningsScore || 0,
          wickets: state.firstInningsWickets || 0,
          totalBalls: state.firstInningsBalls || 0,
          teamName: state.team1,
          isLive: false,
          captainName: t1Captain
        })
      ) : (
        renderProfessionalScorecard({
          battingList: state.batting || [],
          bowlingList: state.bowling || [],
          fallOfWickets: state.fallOfWickets || [],
          extras: state.extras || { wides: 0, noBalls: 0, legByes: 0, byes: 0, total: 0 },
          runs: state.runs || 0,
          wickets: state.wickets || 0,
          totalBalls: state.balls || 0,
          teamName: state.team2,
          isLive: false,
          captainName: t2Captain
        })
      );
    }

    if (activeTab === 'overs') {
      const inn1Overs = state.firstInningsOversHistory || [];
      const inn2Overs = state.oversHistory || [];

      return (
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          {/* Innings 1 Overs */}
          <div className="sporty-card" style={{padding: 12}}>
            <h4 style={{fontSize: '0.88rem', color: labelColor, marginBottom: 10, textTransform: 'uppercase'}}>
              1ST INNINGS OVERS LIST
            </h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '200px', overflowY: 'auto'}} className="scroll-elegant">
              {inn1Overs.map((o, idx) => (
                <div key={idx} style={{padding: '8px 10px', background: 'var(--bg-secondary)', borderRadius: 6, border: '1px solid var(--border-light)'}}>
                  <div className="flex-between" style={{fontSize: '0.8rem', fontWeight: 'bold', marginBottom: 4}}>
                    <span style={{color: 'var(--text-primary)'}}>Over {o.overNumber} - {o.bowlerName}</span>
                    <span style={{color: 'var(--text-secondary)'}}>
                      <strong style={{color: 'var(--text-primary)'}}>{o.runs}</strong> runs · <strong style={{color: o.wickets > 0 ? '#EF4444' : 'var(--text-primary)'}}>{o.wickets}</strong> wkts
                    </span>
                  </div>
                  <div style={{display: 'flex', gap: 6, flexWrap: 'wrap'}}>
                    {o.balls?.map((b, bIdx) => {
                      const isW = b === 'W';
                      const isBoundary = ['4','6'].includes(b);
                      return (
                        <span 
                          key={bIdx} 
                          style={{
                            fontSize: '0.72rem', 
                            padding: '2px 6px', 
                            borderRadius: 4, 
                            background: isW ? '#EF4444' : (isBoundary ? '#16A34A' : 'rgba(255,255,255,0.06)'),
                            color: (isW || isBoundary) ? '#FFFFFF' : 'var(--text-primary)',
                            border: `1px solid ${isW ? '#DC2626' : (isBoundary ? '#15803D' : 'rgba(255,255,255,0.1)')}`,
                            fontWeight: 'bold'
                          }}
                        >
                          {b}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
              {inn1Overs.length === 0 && (
                <p style={{fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center'}}>No overs recorded in 1st Innings.</p>
              )}
            </div>
          </div>

          {/* Innings 2 Overs */}
          <div className="sporty-card" style={{padding: 12}}>
            <h4 style={{fontSize: '0.88rem', color: labelColor, marginBottom: 10, textTransform: 'uppercase'}}>
              2ND INNINGS OVERS LIST
            </h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '200px', overflowY: 'auto'}} className="scroll-elegant">
              {inn2Overs.map((o, idx) => (
                <div key={idx} style={{padding: '8px 10px', background: 'var(--bg-secondary)', borderRadius: 6, border: '1px solid var(--border-light)'}}>
                  <div className="flex-between" style={{fontSize: '0.8rem', fontWeight: 'bold', marginBottom: 4}}>
                    <span style={{color: 'var(--text-primary)'}}>Over {o.overNumber} - {o.bowlerName}</span>
                    <span style={{color: 'var(--text-secondary)'}}>
                      <strong style={{color: 'var(--text-primary)'}}>{o.runs}</strong> runs · <strong style={{color: o.wickets > 0 ? '#EF4444' : 'var(--text-primary)'}}>{o.wickets}</strong> wkts
                    </span>
                  </div>
                  <div style={{display: 'flex', gap: 6, flexWrap: 'wrap'}}>
                    {o.balls?.map((b, bIdx) => {
                      const isW = b === 'W';
                      const isBoundary = ['4','6'].includes(b);
                      return (
                        <span 
                          key={bIdx} 
                          style={{
                            fontSize: '0.72rem', 
                            padding: '2px 6px', 
                            borderRadius: 4, 
                            background: isW ? '#EF4444' : (isBoundary ? '#16A34A' : 'rgba(255,255,255,0.06)'),
                            color: (isW || isBoundary) ? '#FFFFFF' : 'var(--text-primary)',
                            border: `1px solid ${isW ? '#DC2626' : (isBoundary ? '#15803D' : 'rgba(255,255,255,0.1)')}`,
                            fontWeight: 'bold'
                          }}
                        >
                          {b}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
              {inn2Overs.length === 0 && (
                <p style={{fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center'}}>No overs recorded in 2nd Innings.</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'timeline') {
      const events = state.events || [];
      return (
        <div className="sporty-card" style={{padding: 14}}>
          <h4 style={{fontSize: '0.9rem', color: labelColor, marginBottom: 10, textTransform: 'uppercase'}}>
            Match Timeline
          </h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '300px', overflowY: 'auto'}} className="scroll-elegant">
            {events.slice().reverse().map((ev, index) => (
              <div key={index} className="flex-between" style={{fontSize: '0.8rem', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)'}}>
                <span style={{color: 'var(--text-secondary)'}}>{ev.time} - {ev.team} {ev.type}</span>
                <span style={{fontWeight: 'bold', color: 'var(--text-primary)'}}>{ev.detail}</span>
              </div>
            ))}
            {events.length === 0 && (
              <p style={{fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center'}}>No events logged during the match.</p>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'sets') {
      const setScores = state.setScores || [];
      return (
        <div className="sporty-card" style={{padding: 12}}>
          <h4 style={{fontSize: '0.9rem', color: labelColor, marginBottom: 8, textTransform: 'uppercase'}}>Sets History</h4>
          <table className="stats-table" style={{fontSize: '0.8rem'}}>
            <thead>
              <tr>
                <th>Set</th>
                <th style={{textAlign: 'center'}}>{m.team1}</th>
                <th style={{textAlign: 'center'}}>{m.team2}</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
              {setScores.map((s, idx) => (
                <tr key={idx}>
                  <td>Set {s.set}</td>
                  <td style={{textAlign: 'center'}}>{s.score1}</td>
                  <td style={{textAlign: 'center'}}>{s.score2}</td>
                  <td style={{color: labelColor, fontWeight: 'bold'}}>{s.winner}</td>
                </tr>
              ))}
              {setScores.length === 0 && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', color: 'var(--text-muted)'}}>No sets completed yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'scorecard') {
      const totalStrokes1 = state.strokes1?.reduce((a, b) => a + b, 0) || 0;
      const totalStrokes2 = state.strokes2?.reduce((a, b) => a + b, 0) || 0;
      const totalPar = state.parValues?.reduce((a, b) => a + b, 0) || 0;

      return (
        <div className="sporty-card" style={{overflowX: 'auto', padding: 12}}>
          <h4 style={{fontSize: '0.9rem', color: labelColor, marginBottom: 8, textTransform: 'uppercase'}}>Golf Scorecard</h4>
          <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', color: 'var(--text-primary)'}}>
            <thead>
              <tr style={{borderBottom: '1px solid var(--border-light)'}}>
                <th style={{padding: 4, textAlign: 'left'}}>Hole</th>
                {state.strokes1?.map((_, idx) => (
                  <th key={idx} style={{padding: 4, textAlign: 'center'}}>{idx + 1}</th>
                ))}
                <th style={{padding: 4, textAlign: 'center', fontWeight: 'bold'}}>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{borderBottom: '1px solid var(--border-light)'}}>
                <td style={{padding: 4, fontWeight: '500'}}>Par</td>
                {state.parValues?.map((p, idx) => (
                  <td key={idx} style={{padding: 4, textAlign: 'center'}}>{p}</td>
                ))}
                <td style={{padding: 4, textAlign: 'center', fontWeight: 'bold'}}>{totalPar}</td>
              </tr>
              <tr style={{borderBottom: '1px solid var(--border-light)'}}>
                <td style={{padding: 4, fontWeight: '500', color: labelColor}}>{m.team1}</td>
                {state.strokes1?.map((s, idx) => (
                  <td key={idx} style={{padding: 4, textAlign: 'center'}}>{s || '-'}</td>
                ))}
                <td style={{padding: 4, textAlign: 'center', fontWeight: 'bold', color: labelColor}}>{totalStrokes1}</td>
              </tr>
              <tr>
                <td style={{padding: 4, fontWeight: '500', color: 'var(--secondary)'}}>{m.team2}</td>
                {state.strokes2?.map((s, idx) => (
                  <td key={idx} style={{padding: 4, textAlign: 'center'}}>{s || '-'}</td>
                ))}
                <td style={{padding: 4, textAlign: 'center', fontWeight: 'bold', color: 'var(--secondary)'}}>{totalStrokes2}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(10, 15, 30, 0.65)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      zIndex: 9999,
      animation: 'fadeIn 0.25s ease-out'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface-solid, #111827)',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '88vh',
        borderRadius: 20,
        padding: '24px 20px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6)',
        border: `2px solid ${themeColor}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div className="flex-between" style={{borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12, flexShrink: 0}}>
          <div>
            <h3 style={{fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-condensed)', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0}}>
              📊 COMPLETED SCORECARD
            </h3>
            <span style={{fontSize: '0.72rem', color: labelColor, fontWeight: 'bold'}}>
              {sport.toUpperCase()} MATCH
            </span>
          </div>
          <button 
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '1.6rem',
              lineHeight: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4
            }}
          >
            &times;
          </button>
        </div>

        {/* Big Match Score summary card */}
        <div className="sporty-card glow-green" style={{padding: 16, textAlign: 'center', flexShrink: 0}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{flex: 1}}>
              <h4 style={{fontSize: '1.15rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{m.team1}</h4>
              {SPORTS_WITH_CAPTAINS.includes(sport) && t1Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {t1Captain}</div>
              )}
            </div>
            <div style={{padding: '0 12px'}}>
              <span style={{fontSize: '1.8rem', color: '#FFD700', fontFamily: 'var(--font-condensed)', fontWeight: 'bold'}}>
                {sport === 'Cricket' ? `${m.runs}/${m.wickets}` : `${m.runs} - ${m.wickets}`}
              </span>
            </div>
            <div style={{flex: 1}}>
              <h4 style={{fontSize: '1.15rem', fontFamily: 'var(--font-condensed)', margin: 0}}>{m.team2}</h4>
              {SPORTS_WITH_CAPTAINS.includes(sport) && t2Captain && (
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2}}>C: {t2Captain}</div>
              )}
            </div>
          </div>
          <p style={{fontSize: '0.85rem', color: '#FFD700', margin: '10px 0 0 0', fontWeight: 'bold'}}>
            {m.isAbandoned ? '🔴 MATCH ABANDONED' : `🏆 ${m.result || 'Match Completed'}`}
          </p>
        </div>

        {/* Tabs */}
        {tabs.length > 1 && (
          <div className="tabs-container" style={{marginBottom: 4, flexShrink: 0}}>
            {tabs.map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  borderBottom: activeTab === tab ? `2px solid ${labelColor}` : 'none',
                  color: activeTab === tab ? labelColor : 'var(--text-muted)'
                }}
              >
                {tab === 'innings1' ? 'Inn 1' : (tab === 'innings2' ? 'Inn 2' : tab)}
              </button>
            ))}
          </div>
        )}

        {/* Tab Content scroll area */}
        <div className="scroll-elegant" style={{flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 4}}>
          {renderTabContent()}
        </div>

        {/* Close footer button */}
        <button 
          className="btn-outlined" 
          onClick={handleClose}
          style={{borderColor: labelColor, color: labelColor, padding: '10px 0', width: '100%', fontWeight: 'bold', flexShrink: 0}}
        >
          CLOSE SCORECARD
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   MY SPORTS VIEW (Matches, Tournaments, Teams, Stats, Highlights)
   ========================================================================== */
function MySportsView() {
  const { 
    completedMatches, 
    allLiveMatches, 
    liveMatch,
    selectedSportFilter, 
    setCurrentScreen, 
    setSelectedCompletedMatch,
    setSelectedLiveMatch,
    tournaments,
    teams,
    userName,
    userPhone,
    playerId,
    playerSportsInterests,
    setSelectedTournamentId,
    isDataLoading
  } = useAppState();

  const [activeSubTab, setActiveSubTab] = React.useState('Matches'); // Matches, Tournaments, Teams, Stats
  const [matchFilter, setMatchFilter] = React.useState('All'); // Your matches, Played, Network, All

  const activeSportName = selectedSportFilter === 'All' ? 'Sports' : selectedSportFilter;

  // Filter completed matches by sport
  const sportCompletedMatches = completedMatches.filter(m => {
    const matchSport = m.sport || 'Cricket';
    return selectedSportFilter === 'All' || matchSport.toLowerCase() === selectedSportFilter.toLowerCase();
  });

  // Filter live matches by sport
  const sportLiveMatches = (allLiveMatches || []).filter(m => {
    const matchSport = m.sport || 'Cricket';
    return selectedSportFilter === 'All' || matchSport.toLowerCase() === selectedSportFilter.toLowerCase();
  });

  // If there are no live matches, we inject one realistic mock live match for high-fidelity experience!
  // If there are no live matches, we inject one realistic mock live match for high-fidelity experience!
  const getMockLiveMatch = () => {
    if (activeSportName === 'Cricket' || activeSportName === 'Box Cricket') {
      return {
        id: 'mock-live-cricket',
        sport: activeSportName,
        team1: 'SUN SKY CRICKET ACADEMY',
        team2: 'CLUB07 CRICKET ACADEMY',
        runs: 116,
        wickets: 4,
        balls: 137, // 22.5 Overs
        innings: 1,
        venue: 'Ahmedabad, Club07 Naroda',
        toss: { text: 'SUN SKY CRICKET ACADEMY won the toss and elected to bat' },
        isCompleted: false,
        crr: '5.07',
        lastBalls: ['1', '4', 'W', '0', '6', '1']
      };
    } else if (activeSportName === 'Football') {
      return {
        id: 'mock-live-football',
        sport: 'Football',
        team1: 'Real Madrid',
        team2: 'Barcelona',
        goals1: 2,
        goals2: 1,
        fouls1: 4,
        fouls2: 6,
        venue: 'GMDC Turf, Ahmedabad',
        isCompleted: false,
        half: '2nd Half',
        time: '75 min'
      };
    } else if (['Badminton', 'Table Tennis', 'Volleyball', 'Pickleball'].includes(activeSportName)) {
      return {
        id: 'mock-live-racquet',
        sport: activeSportName,
        team1: 'LINA ZHANG',
        team2: 'SARA CONNOR',
        points1: 18,
        points2: 19,
        sets1: 1,
        sets2: 0,
        currentSet: 2,
        bestOfSets: 3,
        targetPoints: activeSportName === 'Table Tennis' ? 11 : (activeSportName === 'Badminton' ? 21 : 25),
        venue: 'Playfinity Court 1',
        isCompleted: false
      };
    } else if (activeSportName === 'Tennis') {
      return {
        id: 'mock-live-tennis',
        sport: 'Tennis',
        team1: 'ROGER FEDERER',
        team2: 'RAFAEL NADAL',
        points1: '30',
        points2: '40',
        games1: 4,
        games2: 3,
        sets1: 1,
        sets2: 0,
        currentSet: 2,
        bestOfSets: 3,
        venue: 'Center Court, Wimbledon',
        isCompleted: false
      };
    } else if (['Snooker', 'Pool'].includes(activeSportName)) {
      return {
        id: 'mock-live-cue',
        sport: activeSportName,
        team1: 'PANKAJ ADVANI',
        team2: 'ADITYA MEHTA',
        points1: 67,
        points2: 43,
        frames1: 2,
        frames2: 1,
        currentFrame: 4,
        bestOfFrames: 5,
        venue: 'Cue Club Arena',
        isCompleted: false
      };
    } else if (activeSportName === 'Basketball') {
      return {
        id: 'mock-live-basketball',
        sport: 'Basketball',
        team1: 'LAKERS',
        team2: 'CELTICS',
        points1: 88,
        points2: 84,
        period: 4,
        venue: 'Sardar Patel Stadium',
        isCompleted: false
      };
    } else if (activeSportName === 'Golf') {
      return {
        id: 'mock-live-golf',
        sport: 'Golf',
        team1: 'ANIRBAN LAHIRI',
        team2: 'SSP CHAWRASIA',
        strokes1: [4, 3, 5, 4, 0, 0, 0, 0, 0],
        strokes2: [4, 4, 4, 5, 0, 0, 0, 0, 0],
        currentHole: 5,
        totalHoles: 9,
        venue: 'Kensville Golf Club',
        isCompleted: false
      };
    } else if (activeSportName === 'Skating') {
      return {
        id: 'mock-live-skating',
        sport: 'Skating',
        team1: 'ARIA PATEL',
        team2: 'KABIR MEHTA',
        technicalScore1: 8.5,
        artisticScore1: 8.2,
        totalScore1: 16.7,
        technicalScore2: 8.1,
        artisticScore2: 8.4,
        totalScore2: 16.5,
        venue: 'Skate City Rink',
        isCompleted: false
      };
    } else if (activeSportName === 'Gaming') {
      return {
        id: 'mock-live-gaming',
        sport: 'Gaming',
        team1: 'TEAM LIQUID',
        team2: 'SENTINELS',
        points1: 12,
        points2: 9,
        rounds1: 1,
        rounds2: 1,
        currentRound: 3,
        bestOfRounds: 3,
        venue: 'PlayStation Arena',
        isCompleted: false
      };
    } else {
      return {
        id: 'mock-live-generic',
        sport: activeSportName,
        team1: 'Phoenix Strikers',
        team2: 'Titan Gladiators',
        goals1: 3,
        goals2: 2,
        venue: 'Local Arena',
        isCompleted: false
      };
    }
  };

  const getMockCompletedMatches = () => {
    if (activeSportName === 'Cricket' || activeSportName === 'Box Cricket') {
      return [
        {
          id: 'mock-comp-1',
          sport: activeSportName,
          team1: 'AWS Ahmedabad Warriors',
          team2: 'United Gladiators',
          runs: 189,
          wickets: 11,
          balls: 148,
          team2Runs: 153,
          team2Wickets: 8,
          team2Balls: 125,
          venue: 'Somnath Cricket Grounds',
          result: 'Ahmedabad Warriors won by 36 runs',
          date: '12-Jun-2026'
        },
        {
          id: 'mock-comp-2',
          sport: activeSportName,
          team1: 'Capture Test A',
          team2: 'Capture Test B',
          runs: 14,
          wickets: 0,
          balls: 6,
          team2Runs: 15,
          team2Wickets: 1,
          team2Balls: 5,
          venue: 'GMDC Cricket Ground',
          result: 'Capture Test B won by 9 wickets',
          date: '09-Jun-2026'
        }
      ];
    } else if (activeSportName === 'Football' || activeSportName === 'Hockey' || activeSportName === 'Ice Hockey') {
      return [
        {
          id: 'mock-comp-football-1',
          sport: activeSportName,
          team1: 'REAL MADRID',
          team2: 'BARCELONA',
          runs: 3, // goals1
          wickets: 1, // goals2
          balls: 0,
          venue: 'GMDC Turf, Ahmedabad',
          result: 'Real Madrid won 3 - 1',
          date: '10-Jun-2026'
        }
      ];
    } else if (activeSportName === 'Basketball') {
      return [
        {
          id: 'mock-comp-bball-1',
          sport: 'Basketball',
          team1: 'LAKERS',
          team2: 'CELTICS',
          runs: 98, // points1
          wickets: 94, // points2
          balls: 0,
          venue: 'Sardar Patel Stadium',
          result: 'Lakers won 98 - 94',
          date: '08-Jun-2026'
        }
      ];
    } else if (['Badminton', 'Table Tennis', 'Volleyball', 'Pickleball'].includes(activeSportName)) {
      return [
        {
          id: 'mock-comp-racquet-1',
          sport: activeSportName,
          team1: 'LINA ZHANG',
          team2: 'SARA CONNOR',
          runs: 2, // sets1
          wickets: 1, // sets2
          balls: 0,
          venue: 'Playfinity Court 1',
          result: `Lina Zhang won 2 - 1 in ${activeSportName}`,
          date: '11-Jun-2026'
        }
      ];
    } else if (activeSportName === 'Tennis') {
      return [
        {
          id: 'mock-comp-tennis-1',
          sport: 'Tennis',
          team1: 'ROGER FEDERER',
          team2: 'RAFAEL NADAL',
          runs: 2, // sets1
          wickets: 0, // sets2
          balls: 0,
          venue: 'Center Court, Wimbledon',
          result: 'Federer won 2 - 0 (6-4, 7-5)',
          date: '09-Jun-2026'
        }
      ];
    } else if (['Snooker', 'Pool'].includes(activeSportName)) {
      return [
        {
          id: 'mock-comp-cue-1',
          sport: activeSportName,
          team1: 'PANKAJ ADVANI',
          team2: 'ADITYA MEHTA',
          runs: 3, // frames1
          wickets: 1, // frames2
          balls: 0,
          venue: 'Cue Club Arena',
          result: 'Pankaj Advani won 3 - 1 frames',
          date: '05-Jun-2026'
        }
      ];
    } else if (activeSportName === 'Golf') {
      return [
        {
          id: 'mock-comp-golf-1',
          sport: 'Golf',
          team1: 'ANIRBAN LAHIRI',
          team2: 'SSP CHAWRASIA',
          runs: 32, // strokes1 total
          wickets: 35, // strokes2 total
          balls: 0,
          venue: 'Kensville Golf Club',
          result: 'Anirban Lahiri won by 3 strokes',
          date: '03-Jun-2026'
        }
      ];
    } else if (activeSportName === 'Skating') {
      return [
        {
          id: 'mock-comp-skating-1',
          sport: 'Skating',
          team1: 'JOHN SMITH',
          team2: 'ELENA ROSTOVA',
          runs: 18,
          wickets: 17,
          balls: 0,
          venue: 'Ice Palace Rink',
          result: 'John Smith won by 1.25 points',
          date: '04-Jun-2026'
        }
      ];
    }
    return [];
  };

  const liveMatchesToShow = sportLiveMatches;
  const completedMatchesToShow = sportCompletedMatches;

  const sportTournaments = tournaments.filter(t => {
    if (selectedSportFilter === 'All') return true;
    const tSport = (t.sport || 'Box Cricket').toLowerCase();
    const activeSport = activeSportName.toLowerCase();
    if (activeSport === 'cricket' || activeSport === 'box cricket') {
      return tSport === 'cricket' || tSport === 'box cricket';
    }
    return tSport === activeSport;
  });

  const sportTeams = teams.filter(t => {
    if (selectedSportFilter === 'All') return true;
    const tSport = (t.sport || 'Box Cricket').toLowerCase();
    const activeSport = activeSportName.toLowerCase();
    if (activeSport === 'cricket' || activeSport === 'box cricket') {
      return tSport === 'cricket' || tSport === 'box cricket';
    }
    return tSport === activeSport;
  });

  const userSportMatches = sportCompletedMatches.filter(m => {
    const normalizedUser = (userName || '').trim().toLowerCase();
    const state = m.matchState;
    if (!state) return false;
    const allPlayers = [
      ...(state.firstInningsBatting || []),
      ...(state.firstInningsBowling || []),
      ...(state.batting || []),
      ...(state.bowling || [])
    ];
    return allPlayers.some(p => p.name?.trim().toLowerCase() === normalizedUser);
  });

  const matchesCount = userSportMatches.length || Math.floor(Math.random() * 5 + 3);
  const winRate = '65%';

  const getStatsLabels = () => {
    if (activeSportName === 'Cricket' || activeSportName === 'Box Cricket') {
      return { label3: 'Total Runs', val3: '284', label4: 'Wickets Taken', val4: '9' };
    }
    if (['Football', 'Hockey', 'Ice Hockey'].includes(activeSportName)) {
      return { label3: 'Goals Scored', val3: '6', label4: 'Assists Logged', val4: '4' };
    }
    if (activeSportName === 'Basketball') {
      return { label3: 'Points Scored', val3: '74', label4: 'Assists Logged', val4: '18' };
    }
    if (['Volleyball', 'Pickleball', 'Badminton', 'Table Tennis', 'Tennis'].includes(activeSportName)) {
      return { label3: 'Sets Won', val3: '8', label4: 'Points Scored', val4: '142' };
    }
    if (activeSportName === 'Golf') {
      return { label3: 'Avg Strokes', val3: '36.5', label4: 'Holes Played', val4: '27' };
    }
    if (activeSportName === 'Skating') {
      return { label3: 'Top Score', val3: '18.4', label4: 'Podiums', val4: '3' };
    }
    if (['Snooker', 'Pool'].includes(activeSportName)) {
      return { label3: 'Frames Won', val3: '9', label4: 'Highest Break', val4: '42' };
    }
    if (activeSportName === 'Gaming') {
      return { label3: 'Rounds Won', val3: '15', label4: 'Top Score', val4: '280' };
    }
    return { label3: 'Points Won', val3: '45', label4: 'Wins', val4: '6' };
  };

  const statsLabels = getStatsLabels();

  const renderLiveMatchScore = (m, teamNum) => {
    const sport = m.sport || 'Cricket';
    if (sport === 'Cricket' || sport === 'Box Cricket') {
      if (teamNum === 1) {
        return `${m.runs || 0}/${m.wickets || 0} (${Math.floor((m.balls || 0)/6)}.${(m.balls || 0)%6} Ov)`;
      } else {
        return m.team2Runs !== undefined 
          ? `${m.team2Runs}/${m.team2Wickets || 0} (${Math.floor((m.team2Balls || 0)/6)}.${(m.team2Balls || 0)%6} Ov)`
          : 'Yet to Bat';
      }
    }
    if (['Football', 'Hockey', 'Ice Hockey'].includes(sport)) {
      return teamNum === 1 ? `${m.goals1 || 0} Goals` : `${m.goals2 || 0} Goals`;
    }
    if (sport === 'Basketball') {
      return teamNum === 1 ? `${m.points1 || 0} Pts` : `${m.points2 || 0} Pts`;
    }
    if (['Volleyball', 'Pickleball', 'Badminton', 'Table Tennis'].includes(sport)) {
      return teamNum === 1 
        ? `${m.sets1 || 0} Sets (${m.points1 || 0} pts)` 
        : `${m.sets2 || 0} Sets (${m.points2 || 0} pts)`;
    }
    if (sport === 'Tennis') {
      return teamNum === 1
        ? `${m.sets1 || 0} Sets (Gm: ${m.games1 || 0}, Pt: ${m.points1 || '0'})`
        : `${m.sets2 || 0} Sets (Gm: ${m.games2 || 0}, Pt: ${m.points2 || '0'})`;
    }
    if (sport === 'Golf') {
      const totalStrokes = (strokes) => Array.isArray(strokes) ? strokes.reduce((a, b) => a + b, 0) : 0;
      return teamNum === 1 
        ? `${totalStrokes(m.strokes1)} Str (Hole ${m.currentHole || 1})` 
        : `${totalStrokes(m.strokes2)} Str`;
    }
    if (['Snooker', 'Pool'].includes(sport)) {
      return teamNum === 1 
        ? `${m.frames1 || 0} Frm (${m.points1 || 0} pts)` 
        : `${m.frames2 || 0} Frm (${m.points2 || 0} pts)`;
    }
    if (sport === 'Skating') {
      return teamNum === 1 ? `${m.totalScore1 || 0.0} pts` : `${m.totalScore2 || 0.0} pts`;
    }
    if (sport === 'Gaming') {
      return teamNum === 1 
        ? `${m.rounds1 || 0} Rnds (${m.points1 || 0} pts)` 
        : `${m.rounds2 || 0} Rnds (${m.points2 || 0} pts)`;
    }
    return teamNum === 1 ? `${m.points1 || 0}` : `${m.points2 || 0}`;
  };

  const renderCompletedMatchScore = (m, teamNum) => {
    const sport = m.sport || 'Cricket';
    const state = m.matchState;
    if (sport === 'Cricket' || sport === 'Box Cricket') {
      if (teamNum === 1) {
        return `${m.runs}/${m.wickets || 0} (${Math.floor(m.balls/6)}.${m.balls%6} Ov)`;
      } else {
        const t2runs = state?.team2Runs !== undefined ? state.team2Runs : (m.team2Runs !== undefined ? m.team2Runs : 0);
        const t2wickets = state?.team2Wickets !== undefined ? state.team2Wickets : (m.team2Wickets !== undefined ? m.team2Wickets : 0);
        const t2balls = state?.team2Balls !== undefined ? state.team2Balls : (m.team2Balls !== undefined ? m.team2Balls : 0);
        return `${t2runs}/${t2wickets} (${Math.floor(t2balls/6)}.${t2balls%6} Ov)`;
      }
    }
    if (teamNum === 1) {
      if (['Football', 'Hockey', 'Ice Hockey'].includes(sport)) return `${m.runs} Goals`;
      if (sport === 'Basketball') return `${m.runs} Pts`;
      if (['Volleyball', 'Pickleball', 'Badminton', 'Table Tennis'].includes(sport)) return `${m.runs} Sets`;
      if (sport === 'Golf') return `${m.runs} Strokes`;
      if (sport === 'Skating') return `${m.runs} Pts`;
      if (['Snooker', 'Pool'].includes(sport)) return `${m.runs} Frames`;
      if (sport === 'Gaming') return `${m.runs} Rounds`;
      return `${m.runs}`;
    } else {
      if (['Football', 'Hockey', 'Ice Hockey'].includes(sport)) return `${m.wickets} Goals`;
      if (sport === 'Basketball') return `${m.wickets} Pts`;
      if (['Volleyball', 'Pickleball', 'Badminton', 'Table Tennis'].includes(sport)) return `${m.wickets} Sets`;
      if (sport === 'Golf') return `${m.wickets} Strokes`;
      if (sport === 'Skating') return `${m.wickets} Pts`;
      if (['Snooker', 'Pool'].includes(sport)) return `${m.wickets} Frames`;
      if (sport === 'Gaming') return `${m.wickets} Rounds`;
      return `${m.wickets}`;
    }
  };

  const getSportEmoji = (sportName) => {
    const sName = sportName || '';
    if (sName.toLowerCase() === 'sports') return '🏆';
    if (sName.includes('Cricket')) return '🏏';
    if (sName.includes('Football')) return '⚽';
    if (sName.includes('Badminton')) return '🏸';
    if (sName.includes('Tennis')) return '🎾';
    if (sName.includes('Table Tennis')) return '🏓';
    if (sName.includes('Snooker')) return '🎱';
    if (sName.includes('Pool')) return '🔵';
    if (sName.includes('Basketball')) return '🏀';
    if (sName.includes('Volleyball')) return '🏐';
    if (sName.includes('Pickleball')) return '🏓';
    if (sName.includes('Golf')) return '⛳';
    if (sName.includes('Hockey')) return '🏑';
    if (sName.includes('Ice Hockey')) return '🏒';
    if (sName.includes('Skating')) return '🛼';
    return '🎮';
  };

  return (
    <div style={{...styles.container, padding: 16, backgroundColor: 'var(--bg-secondary)', overflowY: 'auto'}}>
      
      {/* Sub-tabs selector */}
      <div style={{
        display: 'flex', 
        justifyContent: 'space-around', 
        backgroundColor: '#FFFFFF',
        borderRadius: 8, 
        padding: '4px',
        border: '1px solid var(--border-light)',
        marginBottom: 16,
        flexShrink: 0
      }}>
        {['Matches', 'Tournaments', 'Teams', 'Stats'].map(t => {
          const isActive = activeSubTab === t;
          return (
            <button
              key={t}
              onClick={() => setActiveSubTab(t)}
              style={{
                flex: 1,
                padding: '8px 4px',
                border: 'none',
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                borderRadius: 6,
                fontWeight: 'bold',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-heading)'
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* ---- SKELETON LOADER ---- */}
      {isDataLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Banner skeleton */}
          <div className="shimmer" style={{ height: 68, borderRadius: 12 }} />
          {/* Sub-filter chips skeleton */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[80, 70, 90, 60].map((w, i) => (
              <div key={i} className="shimmer" style={{ height: 30, width: w, borderRadius: 20, flexShrink: 0 }} />
            ))}
          </div>
          {/* Match card skeletons */}
          {[1, 2, 3].map(i => (
            <div key={i} style={{ background: '#FFFFFF', borderRadius: 14, padding: 16, border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="shimmer" style={{ height: 14, width: '35%', borderRadius: 6 }} />
                <div className="shimmer" style={{ height: 22, width: 70, borderRadius: 20 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start', flex: 1 }}>
                  <div className="shimmer" style={{ height: 13, width: '70%', borderRadius: 5 }} />
                  <div className="shimmer" style={{ height: 22, width: '55%', borderRadius: 5 }} />
                </div>
                <div className="shimmer" style={{ height: 30, width: 30, borderRadius: '50%' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', flex: 1 }}>
                  <div className="shimmer" style={{ height: 13, width: '70%', borderRadius: 5 }} />
                  <div className="shimmer" style={{ height: 22, width: '55%', borderRadius: 5 }} />
                </div>
              </div>
              <div className="shimmer" style={{ height: 12, width: '60%', borderRadius: 5 }} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {activeSubTab === 'Matches' && (
            <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
          
          {/* Want to start a match? BANNER */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: '14px 16px',
            border: '1px solid var(--border-light)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            flexShrink: 0
          }}>
            <div>
              <h4 style={{fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--text-primary)'}}>Want to start a match?</h4>
              <p style={{fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2}}>
                {(activeSportName === 'Cricket' || activeSportName === 'Box Cricket')
                  ? 'Setup teams, select overs & score live ball-by-ball'
                  : 'Setup teams, select rules/format & score live matches'}
              </p>
            </div>
            <button 
              onClick={() => setCurrentScreen('scorer_panel')}
              style={{
                backgroundColor: '#10B981', // Emerald green
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)'
              }}
            >
              Start {getSportEmoji(activeSportName)}
            </button>
          </div>

          {/* Sub filters */}
          <div style={{display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, flexShrink: 0}}>
            {['Your matches', 'Played', 'Network', 'All'].map(f => {
              const isActive = matchFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setMatchFilter(f)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 20,
                    border: isActive ? 'none' : '1px solid var(--border-light)',
                    backgroundColor: isActive ? 'var(--text-primary)' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>

          {/* Matches List */}
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            
            {/* Live Matches Section */}
            {matchFilter !== 'Played' && (
              <>
                <h4 style={{fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2}}>
                  🔴 Live Matches
                </h4>
                {liveMatchesToShow.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 16px', backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid var(--border-light)', marginBottom: 16 }}>
                    <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: 6 }}>{getSportEmoji(activeSportName)}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      No active live matches. Start A Match from the menu drawer to score and go live!
                    </span>
                  </div>
                ) : (
                  liveMatchesToShow.map(m => (
                  <div 
                    key={m.id}
                    className="sporty-card glow-green"
                    style={{padding: 16, cursor: 'pointer', backgroundColor: '#FFFFFF'}}
                    onClick={() => {
                      setSelectedLiveMatch(m);
                      setCurrentScreen('live_scorecard');
                    }}
                  >
                    <div className="flex-between" style={{borderBottom: '1px solid #F3F4F6', paddingBottom: 8, marginBottom: 8}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                        <span style={{
                          backgroundColor: '#DC2626', 
                          color: '#FFFFFF', 
                          fontSize: '0.55rem', 
                          fontWeight: 'bold', 
                          padding: '2px 6px', 
                          borderRadius: 4,
                          letterSpacing: 0.5
                        }}>LIVE</span>
                        <span style={{fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500}}>
                          {m.sport || 'Cricket'} · {m.venue}
                        </span>
                      </div>
                      <span style={{fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 'bold'}}>
                        {m.crr && (m.sport === 'Cricket' || m.sport === 'Box Cricket') ? `CRR: ${m.crr}` : 'Live'}
                      </span>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0'}}>
                      <div className="flex-between">
                        <span style={{fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-primary)'}}>
                          {m.team1} {m.innings === 1 ? '*' : ''}
                        </span>
                        <span style={{fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-primary)'}}>
                          {renderLiveMatchScore(m, 1)}
                        </span>
                      </div>
                      <div className="flex-between">
                        <span style={{fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-primary)'}}>
                          {m.team2} {m.innings === 2 ? '*' : ''}
                        </span>
                        <span style={{fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-primary)'}}>
                          {renderLiveMatchScore(m, 2)}
                        </span>
                      </div>
                    </div>

                    {m.toss && (
                      <p style={{fontSize: '0.68rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 4}}>
                        🪙 {m.toss.text}
                      </p>
                    )}

                    {m.lastBalls && m.lastBalls.length > 0 && (
                      <div style={{display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, borderTop: '1px dashed #F3F4F6', paddingTop: 8}}>
                        <span style={{fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Recent:</span>
                        {m.lastBalls.map((b, idx) => (
                          <span 
                            key={idx}
                            style={{
                              width: 18, height: 18, borderRadius: '50%',
                              backgroundColor: b === 'W' ? 'var(--danger)' : (b === '6' || b === '4' ? 'var(--primary)' : 'var(--border-light)'),
                              color: b === 'W' || b === '6' || b === '4' ? '#FFFFFF' : 'var(--text-primary)',
                              fontSize: '0.58rem', fontWeight: 'bold',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{display: 'flex', gap: 12, marginTop: 10, borderTop: '1px solid #F3F4F6', paddingTop: 8, fontSize: '0.7rem', fontWeight: 'bold', color: '#1F2937'}}>
                      <span style={{color: 'var(--primary)'}}>Insights</span>
                      <span>Squads</span>
                      <span>Leaderboard</span>
                    </div>
                  </div>
                ))
              )}
              </>
            )}

            {/* Completed Matches Section */}
            {matchFilter !== 'Your matches' && matchFilter !== 'Network' && (
              <>
                <h4 style={{fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2, marginTop: 8}}>
                  🏆 Completed Matches
                </h4>
                {completedMatchesToShow.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 16px', backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: 6 }}>🏆</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      No completed matches yet. Played matches will be listed here.
                    </span>
                  </div>
                ) : (
                  completedMatchesToShow.map(m => (
                  <div 
                    key={m.id}
                    className="sporty-card"
                    style={{padding: 16, cursor: 'pointer', backgroundColor: '#FFFFFF'}}
                    onClick={() => {
                      setSelectedCompletedMatch(m);
                      setCurrentScreen('live_scorecard');
                    }}
                  >
                    <div className="flex-between" style={{borderBottom: '1px solid #F3F4F6', paddingBottom: 8, marginBottom: 8}}>
                      <span style={{fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500}}>
                        {m.sport || 'Cricket'} · {m.venue || 'Local Arena'}
                      </span>
                      <span style={{fontSize: '0.68rem', color: 'var(--text-muted)'}}>{m.date || 'Completed'}</span>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0'}}>
                      <div className="flex-between">
                        <span style={{fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)'}}>{m.team1}</span>
                        <span style={{fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)'}}>
                          {renderCompletedMatchScore(m, 1)}
                        </span>
                      </div>
                      <div className="flex-between">
                        <span style={{fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)'}}>{m.team2}</span>
                        <span style={{fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)'}}>
                          {renderCompletedMatchScore(m, 2)}
                        </span>
                      </div>
                    </div>

                    {m.result && (
                      <p style={{fontSize: '0.72rem', color: '#10B981', fontWeight: 'bold', marginTop: 4}}>
                        🏆 {m.result}
                      </p>
                    )}

                    <div style={{display: 'flex', gap: 12, marginTop: 10, borderTop: '1px solid #F3F4F6', paddingTop: 8, fontSize: '0.7rem', fontWeight: 'bold', color: '#1F2937'}}>
                      <span>Insights</span>
                      <span>Squads</span>
                      <span>Gallery</span>
                    </div>
                  </div>
                ))
              )}
              </>
            )}

          </div>

        </div>
      )}

      {activeSubTab === 'Tournaments' && (
        <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
          {sportTournaments.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px 16px', backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid var(--border-light)'}}>
              <span style={{fontSize: '2.5rem'}}>🏆</span>
              <h4 style={{fontSize: '1rem', color: 'var(--text-primary)', marginTop: 10}}>No Active Tournaments</h4>
              <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4}}>Register slots or look up local tournament leagues.</p>
            </div>
          ) : (
            sportTournaments.map(t => {
              const tSettings = getTourSettings(t);
              const hasJoined = tSettings.teamsRegistered?.some(team => {
                const isCaptain = team.captainName?.toLowerCase() === userName?.toLowerCase() || team.captainPhone === userPhone;
                const isPlayer = team.players?.some(p => p.toLowerCase() === userName?.toLowerCase());
                return isCaptain || isPlayer;
              });

              return (
                <div key={t.id} className="sporty-card" style={{backgroundColor: '#FFFFFF', padding: 16}}>
                  <div className="flex-between" style={{marginBottom: 8}}>
                    <h4 style={{fontSize: '1rem', fontWeight: 800}}>{t.name}</h4>
                    <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                      {hasJoined && <span className="role-badge" style={{fontSize: '0.62rem', background: 'rgba(170,255,0,0.12)', color: 'var(--primary)', border: '1px solid var(--primary)'}}>💎 JOINED</span>}
                      <span className="role-badge batsman" style={{fontSize: '0.62rem', background: 'rgba(220,38,38,0.1)', color: 'var(--primary)'}}>{t.format}</span>
                    </div>
                  </div>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12}}>Organized by premium arena partners. Matches start this weekend!</p>
                  <button 
                    onClick={() => { setSelectedTournamentId(t.id); setCurrentScreen('tournament_detail'); }}
                    className="btn-neon" 
                    style={{padding: '8px 16px', fontSize: '0.78rem', width: 'auto'}}
                  >
                    View Tournament Brackets ⚡
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeSubTab === 'Teams' && (
        <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
          
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0}}>
            <h4 style={{fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)'}}>Rosters &amp; Captains</h4>
            <button 
              onClick={() => setCurrentScreen('teams')}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--primary)',
                color: 'var(--primary)',
                padding: '4px 10px',
                borderRadius: 4,
                fontSize: '0.7rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              + Create Team
            </button>
          </div>

          {sportTeams.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px 16px', backgroundColor: '#FFFFFF', borderRadius: 12, border: '1px solid var(--border-light)'}}>
              <span style={{fontSize: '2.5rem'}}>👥</span>
              <h4 style={{fontSize: '1rem', color: 'var(--text-primary)', marginTop: 10}}>No Teams Created Yet</h4>
              <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4}}>Create teams, add players with phone numbers, and manage captains.</p>
            </div>
          ) : (
            sportTeams.map(t => (
              <div key={t.id} className="sporty-card" style={{backgroundColor: '#FFFFFF', padding: 16}}>
                <h4 style={{fontSize: '0.92rem', fontWeight: 'bold'}}>{t.name}</h4>
                <p style={{fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2}}>Sport: {t.sport} · Captain: {t.captain}</p>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10, borderTop: '1px solid #F3F4F6', paddingTop: 8}}>
                  {t.players && t.players.map(p => (
                    <span 
                      key={p.id}
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        fontSize: '0.62rem',
                        padding: '3px 8px',
                        borderRadius: 12,
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-light)'
                      }}
                    >
                      {p.name} ({p.role})
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeSubTab === 'Stats' && (
        <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
          {(() => {
            const getStatsForSport = (sportName) => {
              const sportMatches = completedMatches.filter(m => {
                const matchSport = m.sport || 'Cricket';
                return matchSport.toLowerCase() === sportName.toLowerCase();
              });

              const userSportMatches = sportMatches.filter(m => {
                const normalizedUser = (userName || '').trim().toLowerCase();
                const state = m.matchState;
                if (!state) return false;
                
                const allPlayers = [];
                if (state.firstInningsBatting) allPlayers.push(...state.firstInningsBatting);
                if (state.firstInningsBowling) allPlayers.push(...state.firstInningsBowling);
                if (state.batting) allPlayers.push(...state.batting);
                if (state.bowling) allPlayers.push(...state.bowling);
                
                const t1 = teams.find(t => t.id === m.team1Id);
                const t2 = teams.find(t => t.id === m.team2Id);
                const allTeamPlayers = [...(t1?.players || []), ...(t2?.players || [])];
                
                return allPlayers.some(p => p.name?.trim().toLowerCase() === normalizedUser) ||
                       allTeamPlayers.some(p => p.name?.trim().toLowerCase() === normalizedUser);
              });

              const count = userSportMatches.length;
              let matches = count || 2;
              let winRate = count > 0 ? '65%' : '65%';
              let label3 = 'Points Won';
              let val3 = count > 0 ? (count * 15).toString() : '45';
              let label4 = 'Wins';
              let val4 = count > 0 ? count.toString() : '6';

              if (sportName === 'Box Cricket' || sportName === 'Cricket') {
                matches = count || 2;
                winRate = '65%';
                label3 = 'Total Runs';
                val3 = count > 0 ? (count * 28).toString() : '284';
                label4 = 'Wickets Taken';
                val4 = count > 0 ? (count * 1.5).toFixed(0) : '9';
              } else if (['Football', 'Hockey', 'Ice Hockey'].includes(sportName)) {
                matches = count || 3;
                winRate = '60%';
                label3 = 'Goals Scored';
                val3 = count > 0 ? (count * 1.2).toFixed(0) : '6';
                label4 = 'Assists Logged';
                val4 = count > 0 ? (count * 0.8).toFixed(0) : '4';
              } else if (sportName === 'Basketball') {
                matches = count || 1;
                winRate = '100%';
                label3 = 'Points Scored';
                val3 = count > 0 ? (count * 18).toString() : '74';
                label4 = 'Assists Logged';
                val4 = count > 0 ? (count * 4).toString() : '18';
              } else if (['Volleyball', 'Pickleball', 'Badminton', 'Table Tennis', 'Tennis'].includes(sportName)) {
                matches = count || 4;
                winRate = '75%';
                label3 = 'Sets Won';
                val3 = count > 0 ? (count * 2).toString() : '8';
                label4 = 'Points Scored';
                val4 = count > 0 ? (count * 35).toString() : '142';
              }

              return { matches, winRate, label3, val3, label4, val4 };
            };

            const sportsList = playerSportsInterests.length > 0 ? playerSportsInterests : ['Box Cricket', 'Football', 'Badminton'];
            return sportsList.map(sportName => {
              const stats = getStatsForSport(sportName);
              const sportColor = ALL_SPORTS.find(s => s.id === sportName)?.color || 'var(--primary)';
              return (
                <div key={sportName} className="sporty-card glow-green" style={{backgroundColor: '#FFFFFF', padding: 16, borderLeft: `4px solid ${sportColor}`}}>
                  <h4 style={{fontSize: '0.95rem', fontWeight: 'bold', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6}}>
                    <span>{getSportEmoji(sportName)}</span>
                    <span style={{color: 'var(--text-primary)'}}>{sportName} Stats</span>
                  </h4>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
                    <div style={{backgroundColor: 'var(--bg-secondary)', padding: 10, borderRadius: 8, textAlign: 'center'}}>
                      <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Matches</span>
                      <h3 style={{fontSize: '1.5rem', color: 'var(--text-primary)', marginTop: 4}}>{stats.matches}</h3>
                    </div>
                    <div style={{backgroundColor: 'var(--bg-secondary)', padding: 10, borderRadius: 8, textAlign: 'center'}}>
                      <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>Win Rate</span>
                      <h3 style={{fontSize: '1.5rem', color: 'var(--primary)', marginTop: 4}}>{stats.winRate}</h3>
                    </div>
                    <div style={{backgroundColor: 'var(--bg-secondary)', padding: 10, borderRadius: 8, textAlign: 'center'}}>
                      <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>{stats.label3}</span>
                      <h3 style={{fontSize: '1.5rem', color: 'var(--text-primary)', marginTop: 4}}>{stats.val3}</h3>
                    </div>
                    <div style={{backgroundColor: 'var(--bg-secondary)', padding: 10, borderRadius: 8, textAlign: 'center'}}>
                      <span style={{fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase'}}>{stats.label4}</span>
                      <h3 style={{fontSize: '1.5rem', color: 'var(--text-primary)', marginTop: 4}}>{stats.val4}</h3>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}
        </>
      )}

    </div>
  );
}

/* ==========================================================================
   COMMUNITY VIEW (Certified Scorers, Umpires, Commentators, Grounds grid)
   ========================================================================== */
function CommunityView() {
  const { selectedSportFilter, selectedRegion, setSelectedRegion, setCurrentScreen } = useAppState();
  const activeSportName = selectedSportFilter === 'All' ? 'Sports' : selectedSportFilter;
  const [selectedService, setSelectedService] = React.useState(null);

  const getDynamicServices = (sport) => {
    const isCricket = sport === 'Cricket' || sport === 'Box Cricket';
    const isFootball = sport === 'Football';
    const isBadminton = sport === 'Badminton';
    const isTennis = sport === 'Tennis';
    const isBasketball = sport === 'Basketball';
    const isVolleyball = sport === 'Volleyball';
    const isGolf = sport === 'Golf';
    const isSkating = sport === 'Skating';
    const isSnooker = sport === 'Snooker';
    const isGaming = sport === 'Gaming';

    let officialLabel = 'Umpires';
    let officialDesc = 'Professional game officials';
    if (isFootball || sport === 'Hockey' || sport === 'Ice Hockey' || isBasketball) {
      officialLabel = 'Referees';
    } else if (isBadminton || isTennis || sport === 'Table Tennis' || sport === 'Pickleball') {
      officialLabel = 'Officials / Referees';
    } else if (isGaming) {
      officialLabel = 'Admins / Referees';
    } else if (sport === 'All' || sport === 'Sports') {
      officialLabel = 'Officials & Referees';
    }

    let facilityLabel = 'Box Cricket & Nets';
    let facilityDesc = 'Indoor cages & turf nets';
    let facilityIcon = '🥅';
    if (isFootball) {
      facilityLabel = 'Futsal & Turf Fields';
      facilityDesc = 'Indoor & outdoor futsal turfs';
      facilityIcon = '⚽';
    } else if (isBadminton) {
      facilityLabel = 'Badminton Courts';
      facilityDesc = 'Premium indoor wooden & synthetic courts';
      facilityIcon = '🏸';
    } else if (isTennis) {
      facilityLabel = 'Tennis Courts';
      facilityDesc = 'Clay, synthetic & hard court rentals';
      facilityIcon = '🎾';
    } else if (isBasketball) {
      facilityLabel = 'Basketball Courts';
      facilityDesc = 'Indoor & outdoor hoops and courts';
      facilityIcon = '🏀';
    } else if (isVolleyball) {
      facilityLabel = 'Volleyball Courts';
      facilityDesc = 'Sand & indoor court facilities';
      facilityIcon = '🏐';
    } else if (isGolf) {
      facilityLabel = 'Golf Courses';
      facilityDesc = '9-hole & 18-hole courses and ranges';
      facilityIcon = '⛳';
    } else if (isSkating) {
      facilityLabel = 'Skating Rinks';
      facilityDesc = 'Roller & ice skating rinks';
      facilityIcon = '🛼';
    } else if (isSnooker) {
      facilityLabel = 'Cue Clubs & Saloons';
      facilityDesc = 'Snooker, pool & billiards table spaces';
      facilityIcon = '🎱';
    } else if (isGaming) {
      facilityLabel = 'Gaming Cafes & Hubs';
      facilityDesc = 'PC bang, PS5 lounge & console rooms';
      facilityIcon = '🎮';
    } else if (sport === 'All' || sport === 'Sports') {
      facilityLabel = 'Sports Facilities & Nets';
      facilityDesc = 'Indoor turf cages, courts & table rentals';
      facilityIcon = '🥅';
    }

    return [
      { id: 'scorers', label: 'Scorers', icon: '📝', description: 'Certified match scorers' },
      { id: 'umpires', label: officialLabel, icon: '🤠', description: officialDesc },
      { id: 'commentators', label: 'Commentators', icon: '🎙️', description: 'Live speakers & mic experts' },
      { id: 'streamers', label: 'Streamers', icon: '🎥', description: 'Video broadcast partners' },
      { id: 'organisers', label: 'Organisers', icon: '👤', description: 'Tournament planners' },
      { id: 'academies', label: 'Academies', icon: '🏢', description: 'Coaching centers & schools' },
      { id: 'box_nets', label: facilityLabel, icon: facilityIcon, description: facilityDesc }
    ];
  };

  const getDynamicCommunityData = (sport, serviceId) => {
    if (serviceId === 'scorers') {
      return [
        { name: 'Ramesh Patel', rating: '4.9 ⭐', matches: `142 ${sport === 'Sports' ? 'sports' : sport} matches scored`, phone: '98765 43210', status: 'Available' },
        { name: 'Amit Shah', rating: '4.8 ⭐', matches: `98 ${sport === 'Sports' ? 'sports' : sport} matches scored`, phone: '98250 12345', status: 'Booked' },
        { name: 'Sunil Gupta', rating: '4.7 ⭐', matches: `76 ${sport === 'Sports' ? 'sports' : sport} matches scored`, phone: '91234 56789', status: 'Available' }
      ];
    }

    if (serviceId === 'umpires') {
      const officialTitle = ['Football', 'Basketball', 'Volleyball', 'Hockey', 'Ice Hockey'].includes(sport) ? 'Referee' : (['Badminton', 'Tennis', 'Table Tennis'].includes(sport) ? 'Umpire' : 'Official');
      return [
        { name: 'Vijay Shekhawat', rating: '4.9 ⭐', level: `State Level Certified ${officialTitle}`, phone: '90001 23456', status: 'Available' },
        { name: 'Rajesh Sharma', rating: '4.7 ⭐', level: `Club Level Certified ${officialTitle}`, phone: '97771 88822', status: 'Booked' }
      ];
    }

    if (serviceId === 'commentators') {
      return [
        { name: 'Harsha B.', rating: '5.0 ⭐', languages: 'Hindi, English', phone: '98888 77777', status: 'Available' },
        { name: 'Siddharth Roy', rating: '4.8 ⭐', languages: 'Gujarati, Hindi', phone: '91112 22233', status: 'Available' }
      ];
    }

    if (serviceId === 'streamers') {
      return [
        { name: 'SportLive Ahmedabad', rating: '4.8 ⭐', gear: 'HD Camera, Overlay, Multi-Sport Support', phone: '99221 13344', status: 'Available' },
        { name: 'SportStream Pro', rating: '4.7 ⭐', gear: '4K Stream, Custom HUD & Scores Overlay', phone: '98444 55566', status: 'Booked' }
      ];
    }

    if (serviceId === 'organisers') {
      return [
        { name: 'Royal Sports Management', rating: '4.9 ⭐', tournaments: '34 Tournaments hosted', phone: '99000 88888' },
        { name: 'Ahmedabad Turf Organisers', rating: '4.8 ⭐', tournaments: '18 Tournaments hosted', phone: '97777 66666' }
      ];
    }

    if (serviceId === 'academies') {
      if (sport === 'Football') {
        return [
          { name: 'Gujarat Football Academy', rating: '4.9 ⭐', focus: 'Under-15 & Under-18 Football Training', location: 'Navrangpura' },
          { name: 'Ahmedabad Soccer Club', rating: '4.8 ⭐', focus: 'Youth development & futsal drills', location: 'Bodakdev' }
        ];
      }
      if (sport === 'Badminton') {
        return [
          { name: 'Pullela Badminton School', rating: '4.9 ⭐', focus: 'Elite badminton coaching', location: 'Thaltej' },
          { name: 'ShuttleMasters Club', rating: '4.7 ⭐', focus: 'Amateur & kids training', location: 'Satellite' }
        ];
      }
      if (sport === 'Tennis') {
        return [
          { name: 'Ahmedabad Tennis Academy', rating: '4.8 ⭐', focus: 'Junior development & adult clinics', location: 'Drive-In' },
          { name: 'Sardar Patel Tennis School', rating: '4.7 ⭐', focus: 'Professional clay court training', location: 'Navrangpura' }
        ];
      }
      return [
        { name: 'Gujarat Cricket Academy', rating: '4.9 ⭐', focus: 'Under 16 & Under 19 net practice', location: 'Navrangpura' },
        { name: 'Playfinity Multi-Sport Academy', rating: '4.8 ⭐', focus: 'Multi-sport kids training', location: 'Bodakdev' }
      ];
    }

    if (serviceId === 'grounds') {
      if (sport === 'Football') {
        return [
          { name: 'Arena Football Turf', rating: '4.8 ⭐', address: 'Bodakdev, Ahmedabad', price: '₹1500/hr' },
          { name: 'Kickoff Futsal Ground', rating: '4.7 ⭐', address: 'Satellite, Ahmedabad', price: '₹1200/hr' }
        ];
      }
      if (sport === 'Badminton') {
        return [
          { name: 'Devarsh Badminton Arena', rating: '4.9 ⭐', address: 'Ghatlodia, Ahmedabad', price: '₹350/hr' },
          { name: 'Shuttle Dome Stadium', rating: '4.8 ⭐', address: 'Thaltej, Ahmedabad', price: '₹400/hr' }
        ];
      }
      if (sport === 'Tennis') {
        return [
          { name: 'Ahmedabad Gymkhana Courts', rating: '4.8 ⭐', address: 'Cantonment, Ahmedabad', price: '₹500/hr' },
          { name: 'SP Ring Road Clay Courts', rating: '4.7 ⭐', address: 'South Bopal, Ahmedabad', price: '₹600/hr' }
        ];
      }
      return [
        { name: 'Somnath Cricket Grounds', rating: '4.8 ⭐', address: 'Somnath, Ahmedabad', price: '₹1200/hr' },
        { name: 'Club07 Turf Ground', rating: '4.7 ⭐', address: 'Naroda, Ahmedabad', price: '₹1000/hr' }
      ];
    }

    if (serviceId === 'box_nets') {
      if (sport === 'Football') {
        return [
          { name: 'Evolve 5-a-side Cage', rating: '4.9 ⭐', cages: 'FIFA certified artificial grass', price: '₹1400/hr' },
          { name: 'GoalStrike Indoor Futsal', rating: '4.8 ⭐', cages: 'Netted indoor futsal court', price: '₹1100/hr' }
        ];
      }
      if (sport === 'Badminton') {
        return [
          { name: 'Smash Indoor Court 1 & 2', rating: '4.8 ⭐', cages: 'Non-marking premium mat courts', price: '₹350/hr' },
          { name: 'Velocity Badminton Club', rating: '4.7 ⭐', cages: '4 Air-conditioned courts', price: '₹500/hr' }
        ];
      }
      if (sport === 'Tennis') {
        return [
          { name: 'Aces Indoor Tennis Court', rating: '4.8 ⭐', cages: 'Synthetic hard court with floodlights', price: '₹650/hr' }
        ];
      }
      return [
        { name: 'Smash Box Arena', rating: '4.9 ⭐', cages: '4 Nets with Bowling Machine', price: '₹800/hr' },
        { name: 'CricZone Indoor Nets', rating: '4.8 ⭐', cages: '2 Cages, automated feeder', price: '₹600/hr' }
      ];
    }

    return [];
  };

  const services = getDynamicServices(activeSportName);

  return (
    <div style={{...styles.container, padding: 16, backgroundColor: '#FFFFFF', overflowY: 'auto'}}>
      <div style={{marginBottom: 16}}>
        <h4 style={{fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5}}>
          {activeSportName} Community in
        </h4>
        <select 
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            border: 'none',
            background: 'none',
            outline: 'none',
            cursor: 'pointer',
            padding: 0,
            marginTop: 2,
            fontFamily: 'var(--font-heading)'
          }}
        >
          {['Ahmedabad', 'Gandhinagar', 'Vadodara', 'Rajkot', 'Surat', 'Mumbai', 'Delhi', 'Bengaluru'].map(r => (
            <option key={r} value={r} style={{ fontSize: '1rem', color: '#000000' }}>{r}</option>
          ))}
        </select>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        marginTop: 16
      }}>
        {services.map(s => (
          <div 
            key={s.id}
            onClick={() => setSelectedService(s)}
            style={{
              border: '1px solid var(--border-light)',
              borderRadius: 12,
              padding: 16,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
            className="sporty-card"
          >
            <span style={{fontSize: '2rem', display: 'block', marginBottom: 8}}>{s.icon}</span>
            <h4 style={{fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)'}}>{s.label}</h4>
            <p style={{fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 4}}>{s.description}</p>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL DRAWER */}
      {selectedService && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'flex-end', justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            width: '100%', maxWidth: 420,
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
            padding: 20, maxHeight: '80vh', overflowY: 'auto',
            boxShadow: '0 -4px 24px rgba(0,0,0,0.15)'
          }}>
            <div className="flex-between" style={{borderBottom: '1px solid var(--border-light)', paddingBottom: 12, marginBottom: 16}}>
              <h3 style={{fontSize: '1.2rem'}}>{selectedService.icon} Certified {selectedService.label}</h3>
              <button 
                onClick={() => setSelectedService(null)}
                style={{
                  background: 'none', border: 'none', fontSize: '1.3rem', 
                  cursor: 'pointer', color: 'var(--text-muted)'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
              {getDynamicCommunityData(activeSportName, selectedService.id).length > 0 ? (
                getDynamicCommunityData(activeSportName, selectedService.id).map((item, idx) => (
                  <div 
                    key={idx}
                    style={{
                      border: '1px solid var(--border-light)',
                      borderRadius: 10,
                      padding: 12,
                      backgroundColor: 'var(--bg-secondary)'
                    }}
                  >
                    <div className="flex-between">
                      <h4 style={{fontSize: '0.9rem', fontWeight: 'bold'}}>{item.name}</h4>
                      <span style={{fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--primary)'}}>{item.rating}</span>
                    </div>
                    
                    {item.status && (
                      <span style={{
                        display: 'inline-block',
                        fontSize: '0.6rem',
                        backgroundColor: item.status === 'Available' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: item.status === 'Available' ? '#10B981' : '#EF4444',
                        padding: '2px 6px', borderRadius: 4, marginTop: 4, fontWeight: 'bold'
                      }}>
                        {item.status}
                      </span>
                    )}

                    <p style={{fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6}}>
                      {item.matches || item.level || item.languages || item.gear || item.focus || item.address || item.cages}
                    </p>

                    {item.phone && (
                      <div className="flex-between" style={{marginTop: 8, borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 6}}>
                        <span style={{fontSize: '0.72rem', color: 'var(--text-muted)'}}>📞 {item.phone}</span>
                        <button 
                          onClick={() => alert(`Contacting ${item.name}...`)}
                          style={{
                            backgroundColor: 'var(--primary)', color: '#FFFFFF',
                            border: 'none', borderRadius: 4, padding: '3px 8px',
                            fontSize: '0.68rem', fontWeight: 'bold', cursor: 'pointer'
                          }}
                        >
                          Connect
                        </button>
                      </div>
                    )}

                    {item.price && (
                      <div className="flex-between" style={{marginTop: 8, borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: 6}}>
                        <span style={{fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-primary)'}}>{item.price}</span>
                        <button 
                          onClick={() => { setSelectedService(null); setCurrentScreen('player_home'); }}
                          style={{
                            backgroundColor: '#10B981', color: '#FFFFFF',
                            border: 'none', borderRadius: 4, padding: '4px 10px',
                            fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer'
                          }}
                        >
                          Book Slot
                        </button>
                      </div>
                    )}

                  </div>
                ))
              ) : (
                <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>No active members listed.</p>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

/* ==========================================================================
   LOOKING VIEW (Binoculars screen for finding slots/teams)
   ========================================================================== */
function LookingView() {
  const [filterType, setFilterType] = React.useState('Players'); // Players, Teams

  const mockPlayers = [
    { name: 'Karan Sharma', role: 'Hard Hitter Batsman', area: 'Naroda', time: 'Weekends', img: '🏏' },
    { name: 'Samir Khan', role: 'Fast Pace Bowler', area: 'GMDC Area', time: 'Every evening', img: '⚡' },
    { name: 'Rohan Mehta', role: 'All Rounder (Spin)', area: 'Satellite', time: 'Saturdays', img: '🔄' }
  ];

  const mockTeams = [
    { name: 'Ahmedabad Warriors', sport: 'Box Cricket', slots: 'Needs 2 players', date: 'Tomorrow 6 PM', arena: 'Somnath Grounds' },
    { name: 'GMDC Soccer Club', sport: 'Football', slots: 'Needs Goalkeeper', date: 'Sunday 8 AM', arena: 'GMDC Turf' }
  ];

  return (
    <div style={{...styles.container, padding: 16, backgroundColor: 'var(--bg-secondary)', overflowY: 'auto'}}>
      <div style={{marginBottom: 16}}>
        <h2 style={{fontSize: '1.4rem', fontWeight: 800}}>Looking for Games</h2>
        <p style={{fontSize: '0.78rem', color: 'var(--text-muted)'}}>Find slot sharing players or teams looking for opponents.</p>
      </div>

      <div style={{
        display: 'flex',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        padding: 4,
        marginBottom: 14,
        border: '1px solid var(--border-light)',
        flexShrink: 0
      }}>
        {['Players', 'Teams'].map(t => {
          const isActive = filterType === t;
          return (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              style={{
                flex: 1, padding: '8px 0', border: 'none',
                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                fontWeight: 'bold', fontSize: '0.85rem', borderRadius: 6,
                cursor: 'pointer', fontFamily: 'var(--font-heading)'
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
        {filterType === 'Players' ? (
          mockPlayers.map((p, idx) => (
            <div key={idx} className="sporty-card" style={{backgroundColor: '#FFFFFF', padding: 14}}>
              <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                <span style={{fontSize: '2rem'}}>{p.img}</span>
                <div style={{flex: 1}}>
                  <h4 style={{fontSize: '0.9rem', fontWeight: 'bold'}}>{p.name}</h4>
                  <p style={{fontSize: '0.72rem', color: 'var(--text-muted)'}}>{p.role}</p>
                  <p style={{fontSize: '0.68rem', color: 'var(--primary)', marginTop: 4}}>📍 {p.area} · ⏰ {p.time}</p>
                </div>
                <button 
                  onClick={() => alert(`Connect request sent to ${p.name}!`)}
                  style={{
                    backgroundColor: 'var(--primary)', color: '#FFFFFF',
                    border: 'none', padding: '6px 12px', borderRadius: 6,
                    fontSize: '0.72rem', fontWeight: 'bold', cursor: 'pointer'
                  }}
                >
                  Invite
                </button>
              </div>
            </div>
          ))
        ) : (
          mockTeams.map((t, idx) => (
            <div key={idx} className="sporty-card" style={{backgroundColor: '#FFFFFF', padding: 14}}>
              <div className="flex-between">
                <div>
                  <h4 style={{fontSize: '0.95rem', fontWeight: 'bold'}}>{t.name}</h4>
                  <p style={{fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2}}>Sport: {t.sport} · {t.slots}</p>
                  <p style={{fontSize: '0.68rem', color: 'var(--primary)', marginTop: 6}}>🏟️ {t.arena} · 📅 {t.date}</p>
                </div>
                <button 
                  onClick={() => alert(`Request to join ${t.name} sent!`)}
                  style={{
                    backgroundColor: '#10B981', color: '#FFFFFF',
                    border: 'none', padding: '8px 14px', borderRadius: 6,
                    fontSize: '0.72rem', fontWeight: 'bold', cursor: 'pointer'
                  }}
                >
                  Join
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

function GearImage({ name }) {
  const n = (name || '').toLowerCase();
  
  let imgSrc = '';
  if (n.includes('leather cricket ball')) {
    imgSrc = '/images/gear/cricket_ball.jpg';
  } else if (n.includes('english willow')) {
    imgSrc = '/images/gear/cricket_bat.jpg';
  } else if (n.includes('soccer football')) {
    imgSrc = '/images/gear/soccer_football.jpg';
  } else if (n.includes('badminton racket')) {
    imgSrc = '/images/gear/badminton_racket.jpg';
  } else if (n.includes('shuttlecocks')) {
    imgSrc = '/images/gear/shuttlecocks.jpg';
  } else if (n.includes('tennis racket')) {
    imgSrc = '/images/gear/tennis_racket.jpg';
  } else if (n.includes('tennis balls')) {
    imgSrc = '/images/gear/tennis_balls.jpg';
  } else if (n.includes('table tennis bats')) {
    imgSrc = '/images/gear/table_tennis.jpg';
  } else if (n.includes('snooker cue')) {
    imgSrc = '/images/gear/snooker_cue.jpg';
  } else if (n.includes('pool cue')) {
    imgSrc = '/images/gear/pool_cue.jpg';
  } else if (n.includes('keyboard')) {
    imgSrc = '/images/gear/keyboard.jpg';
  } else if (n.includes('headset')) {
    imgSrc = '/images/gear/headset.jpg';
  } else if (n.includes('basketball')) {
    imgSrc = '/images/gear/basketball.jpg';
  } else if (n.includes('volleyball')) {
    imgSrc = '/images/gear/volleyball.jpg';
  } else if (n.includes('golf balls')) {
    imgSrc = '/images/gear/golf_balls.jpg';
  } else if (n.includes('hockey stick')) {
    imgSrc = '/images/gear/hockey_stick.jpg';
  } else if (n.includes('skates')) {
    imgSrc = '/images/gear/skates.jpg';
  }

  if (imgSrc) {
    return (
      <img 
        src={imgSrc} 
        alt={name} 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }} 
      />
    );
  }
  return <span style={{fontSize: '1.8rem'}}>🏆</span>;
}

/* ==========================================================================
   STORE VIEW (Sports gear shop & upgrade portal)
   ========================================================================== */
function StoreView() {
  const { paymentStatus, setPaymentStatus, setSubscriptionExpiry } = useAppState();

  const mockGear = [
    { name: 'Leather Cricket Ball (Pack of 3)', price: '₹450', original: '₹600', img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=120&auto=format&fit=crop&q=60', desc: 'Premium club grade alumpanned leather', sport: 'Cricket' },
    { name: 'English Willow Short Handle Bat', price: '₹2,400', original: '₹3,200', img: 'https://images.unsplash.com/photo-1531415080290-bc9e8d32be75?w=120&auto=format&fit=crop&q=60', desc: 'Super Grade 3 light weight', sport: 'Cricket' },
    { name: 'All Weather Soccer Football Size 5', price: '₹850', original: '₹1,200', img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&auto=format&fit=crop&q=60', desc: 'High grip, bladder-lined leather', sport: 'Football' },
    { name: 'Carbon Fiber Yonex Badminton Racket', price: '₹1,499', original: '₹1,999', img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=120&auto=format&fit=crop&q=60', desc: 'Pre-strung, lightweight graphite frame', sport: 'Badminton' },
    { name: 'Nylon Shuttlecocks (Pack of 6)', price: '₹399', original: '₹550', img: 'https://images.unsplash.com/photo-1558497257-82502de57582?w=120&auto=format&fit=crop&q=60', desc: 'Durable yellow nylon shuttlecocks', sport: 'Badminton' },
    { name: 'Pro Tour Graphite Tennis Racket', price: '₹3,200', original: '₹4,500', img: 'https://images.unsplash.com/photo-1617083934555-ac7d4fee8909?w=120&auto=format&fit=crop&q=60', desc: 'Midplus headsize, optimal power and control', sport: 'Tennis' },
    { name: 'Championship Tennis Balls (Can of 3)', price: '₹349', original: '₹450', img: 'https://images.unsplash.com/photo-1592709823125-a191f07a2a5e?w=120&auto=format&fit=crop&q=60', desc: 'Extra duty felt for all court surfaces', sport: 'Tennis' },
    { name: 'Table Tennis Bats (Pair) + 3 Balls', price: '₹799', original: '₹1,100', img: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?w=120&auto=format&fit=crop&q=60', desc: 'High elasticity rubber with comfortable grip', sport: 'Table Tennis' },
    { name: '57-inch Ash Wood Snooker Cue', price: '₹1,850', original: '₹2,500', img: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=120&auto=format&fit=crop&q=60', desc: 'Hand-crafted ash wood shaft with 10mm tip', sport: 'Snooker' },
    { name: 'Standard 8-Ball Pool Cue Stick', price: '₹1,250', original: '₹1,800', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=120&auto=format&fit=crop&q=60', desc: 'Fiberglass cue with medium-hard tip', sport: 'Pool' },
    { name: 'RGB Mechanical Gaming Keyboard & Mouse', price: '₹1,999', original: '₹2,999', img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=120&auto=format&fit=crop&q=60', desc: 'Tactile blue switches and high precision mouse', sport: 'Gaming' },
    { name: 'Surround Sound Gaming Headset', price: '₹1,499', original: '₹2,200', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=120&auto=format&fit=crop&q=60', desc: '50mm drivers with noise-canceling mic', sport: 'Gaming' },
    { name: 'Composite Leather Basketball Size 7', price: '₹950', original: '₹1,400', img: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=120&auto=format&fit=crop&q=60', desc: 'Deep channel design for maximum grip', sport: 'Basketball' },
    { name: 'Soft Touch Indoor/Outdoor Volleyball', price: '₹690', original: '₹950', img: 'https://images.unsplash.com/photo-1592656094267-764a450285b6?w=120&auto=format&fit=crop&q=60', desc: 'Machine stitched 18-panel construction', sport: 'Volleyball' },
    { name: 'Premium Golf Balls (Pack of 12)', price: '₹1,200', original: '₹1,600', img: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=120&auto=format&fit=crop&q=60', desc: 'Soft feel with long distance trajectory', sport: 'Golf' },
    { name: 'Composite Field Hockey Stick', price: '₹1,150', original: '₹1,600', img: 'https://images.unsplash.com/photo-1589801258579-18e0ae1f7ad8?w=120&auto=format&fit=crop&q=60', desc: 'Standard bend wood & glass fiber composite', sport: 'Hockey' },
    { name: 'Professional Inline Skates', price: '₹2,800', original: '₹3,800', img: 'https://images.unsplash.com/photo-1564982743477-83210741c497?w=120&auto=format&fit=crop&q=60', desc: 'Adjustable size with smooth ABEC-7 bearings', sport: 'Skating' }
  ];

  const handlePurchasePro = () => {
    setPaymentStatus('active');
    setSubscriptionExpiry('13-Jul-2026');
    alert('Thank you for purchasing Playfinity PRO! Premium features are now active.');
  };

  return (
    <div style={{...styles.container, padding: 16, backgroundColor: 'var(--bg-secondary)', overflowY: 'auto'}}>
      
      {/* PRO MEMBERSHIP UPGRADE BANNER */}
      <div 
        className="sporty-card"
        style={{
          background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
          border: '2.5px solid var(--primary)',
          padding: 20,
          color: '#FFFFFF',
          borderRadius: 14,
          marginBottom: 16,
          boxShadow: '0 4px 20px rgba(220,38,38,0.2)',
          flexShrink: 0
        }}
      >
        <div className="flex-between">
          <span style={{
            backgroundColor: 'var(--primary)', color: '#FFFFFF', fontSize: '0.62rem',
            fontWeight: 'bold', padding: '3px 8px', borderRadius: 4, letterSpacing: 1
          }}>RECOMMENDED</span>
          <span style={{fontSize: '1.2rem'}}>🛡️ PRO</span>
        </div>
        <h3 style={{fontSize: '1.3rem', color: '#FFFFFF', marginTop: 10, fontWeight: 800}}>Playfinity PRO</h3>
        <p style={{fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', marginTop: 4, lineHeight: 1.4}}>
          Get 15% booking discounts on all turfs, ad-free experience, priority matchmaking, and a premium crown badge on your profile.
        </p>
        
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12}}>
          <div>
            <span style={{fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through'}}>₹299/mo</span>
            <h3 style={{fontSize: '1.4rem', color: '#FFFFFF', margin: 0}}>₹199 <span style={{fontSize: '0.78rem', fontWeight: 'normal'}}> / month</span></h3>
          </div>
          <button 
            onClick={handlePurchasePro}
            style={{
              backgroundColor: '#FFFFFF', color: '#111827', border: 'none',
              padding: '8px 16px', borderRadius: 8, fontSize: '0.8rem',
              fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {paymentStatus === 'active' ? 'ACTIVE MEMBER' : 'UPGRADE NOW ⚡'}
          </button>
        </div>
      </div>

      <h4 style={{fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5, flexShrink: 0}}>
        🛍️ Sports Gear &amp; Equipment
      </h4>

      <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
        {mockGear.map((g, idx) => (
          <div key={idx} className="sporty-card" style={{backgroundColor: '#FFFFFF', padding: 14}}>
            <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
              <div className="gear-image-wrapper">
                <GearImage name={g.name} />
              </div>
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                  <h4 style={{fontSize: '0.88rem', fontWeight: 'bold', color: '#111827'}}>{g.name}</h4>
                  <span style={{fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4, backgroundColor: '#E5E7EB', color: '#374151', fontWeight: 'bold'}}>{g.sport}</span>
                </div>
                <p style={{fontSize: '0.68rem', color: '#4B5563', marginTop: 2}}>{g.desc}</p>
                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 6}}>
                  <span style={{fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--primary)'}}>{g.price}</span>
                  <span style={{fontSize: '0.68rem', color: '#9CA3AF', textDecoration: 'line-through'}}>{g.original}</span>
                </div>
              </div>
              <button 
                onClick={() => window.open("https://www.amazon.in/s?k=" + encodeURIComponent(g.name), "_blank")}
                style={{
                  background: 'linear-gradient(135deg, #FF9900 0%, #FFB240 100%)',
                  color: '#111827',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  whiteSpace: 'nowrap'
                }}
              >
                Buy on Amazon 🛒
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
}
