import React, { useState } from 'react';
import { 
  X, Trophy, Play, Video, Activity, BarChart3, 
  ShoppingBag, Award, Network, Shield, PhoneCall, 
  Share2, Star, QrCode, ChevronRight, CheckCircle2,
  LogOut 
} from 'lucide-react';
import { useAppState } from '../context/AppState';

export default function MenuDrawer() {
  const { 
    isDrawerOpen, setIsDrawerOpen,
    userName, userPhone, userEmail,
    paymentStatus, setShowPayModal,
    setCurrentScreen, selectedSportFilter,
    showAlert, playerId, logoutUser
  } = useAppState();

  const profilePic = playerId ? localStorage.getItem('bcp_profile_pic_' + playerId) : '';

  const [isVerified, setIsVerified] = useState(false);

  if (!isDrawerOpen) return null;

  // Fallbacks corresponding to the screenshot
  const displayName = userName || 'Yaksh';
  const displayPhone = userPhone || '6353874452';
  const displayEmail = userEmail || 'yakshbarot597@gmail.com';
  const isPro = paymentStatus === 'paid';

  const handleClose = () => {
    setIsDrawerOpen(false);
  };

  const handleVerify = (e) => {
    e.stopPropagation();
    showAlert('Verification', 'OTP sent to your email and phone number! Account verified successfully.');
    setIsVerified(true);
  };

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
    setIsDrawerOpen(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Playfinity App',
        text: 'Join me on Playfinity, the ultimate multi-sports platform!',
        url: window.location.origin
      }).catch(err => console.log(err));
    } else {
      showAlert('Share App', 'Copy this link to share the app: ' + window.location.origin);
    }
  };

  const activeSportName = selectedSportFilter === 'All' ? 'Sports' : selectedSportFilter;

  // Custom SVGs for premium look
  const HelmetAvatar = () => (
    <svg viewBox="0 0 100 100" width="56" height="56" style={styles.avatarSvg}>
      {/* Face/Neck */}
      <path d="M35,65 Q50,75 65,65 L60,80 Q50,85 40,80 Z" fill="#FDBA74" />
      {/* Red Helmet Dome */}
      <circle cx="50" cy="40" r="28" fill="#DC2626" />
      {/* Visor */}
      <path d="M22,40 Q50,30 78,40 L76,46 Q50,38 24,46 Z" fill="#FFFFFF" />
      {/* Ear cover */}
      <circle cx="30" cy="48" r="6" fill="#1E293B" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="70" cy="48" r="6" fill="#1E293B" stroke="#FFFFFF" strokeWidth="1.5" />
      {/* Metal grill */}
      <path d="M30,52 L50,72 L70,52" fill="none" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32,58 L50,76 L68,58" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
      <path d="M50,40 L50,72" fill="none" stroke="#D1D5DB" strokeWidth="2" />
    </svg>
  );

  const YellowJerseyBadge = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#FACC15" style={{ marginLeft: 'auto' }}>
      <path d="M6 4 L9 1 L15 1 L18 4 L20 8 L17 10 L17 22 L7 22 L7 10 L4 8 Z" stroke="#1E3A8A" strokeWidth="1.5" />
      <text x="12" y="16" fontSize="9" fontWeight="900" fill="#1E3A8A" textAnchor="middle">7</text>
    </svg>
  );

  // Pro outline icon similar to CricHeroes logo badge
  const ProBadgeIcon = () => (
    <div style={styles.proCircleOutline}>
      <span style={styles.proCircleText}>PRO</span>
    </div>
  );

  return (
    <>
      {/* Insert keyframe animations directly */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}} />

      <div style={styles.overlay} onClick={handleClose}>
        <div style={styles.drawerContainer} onClick={(e) => e.stopPropagation()}>
          
          {/* Header Block: Dark background */}
          <div style={styles.headerBlock}>
            <div style={styles.profileSection}>
              {profilePic ? (
                <img 
                  src={profilePic} 
                  alt="Profile" 
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    border: '2px solid #0D9488', // Teal border matching the design
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
              ) : (
                <HelmetAvatar />
              )}
              
              <div style={styles.profileDetails}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={styles.profileName}>{displayName}</span>
                  <button 
                    onClick={() => navigateTo('profile')} 
                    style={styles.arrowButton}
                    title="View Profile"
                  >
                    <ChevronRight size={18} color="#FFFFFF" />
                  </button>
                </div>
                
                <span style={styles.profilePhone}>{displayPhone}</span>
                
                <div style={styles.emailRow}>
                  <span style={styles.profileEmail} title={displayEmail}>{displayEmail}</span>
                  {isVerified ? (
                    <span style={styles.verifiedText}>
                      <CheckCircle2 size={12} color="#10B981" style={{ marginRight: 2 }} />
                      Verified
                    </span>
                  ) : (
                    <button onClick={handleVerify} style={styles.verifyLink}>
                      Verify
                    </button>
                  )}
                </div>

                <div style={styles.userBadgeRow}>
                  <span style={isPro ? styles.proUserBadge : styles.freeUserBadge}>
                    {isPro ? 'PRO User' : 'Free User'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Close button inside drawer */}
            <button onClick={handleClose} style={styles.closeButton} title="Close Menu">
              <X size={20} color="#FFFFFF" />
            </button>
          </div>

          {/* Menu Items List */}
          <div style={styles.menuScrollArea}>
            

            {/* Add a Tournament */}
            <div style={styles.menuRow} onClick={() => navigateTo('create_tournament')}>
              <Trophy size={18} color="#6B7280" />
              <span style={styles.menuText}>Add a Tournament/Series</span>
              <span style={styles.freeBadge}>Free</span>
            </div>

            {/* Start A Match */}
            <div style={styles.menuRow} onClick={() => navigateTo('scorer_panel')}>
              <Play size={18} color="#6B7280" />
              <span style={styles.menuText}>Start A Match</span>
              <span style={styles.freeBadge}>Free</span>
            </div>

            {/* Go Live */}
            <div style={styles.menuRow} onClick={() => navigateTo('scorer_panel')}>
              <Video size={18} color="#6B7280" />
              <span style={styles.menuText}>Go Live</span>
            </div>

            {/* My Sport (Cricket/Football/etc.) */}
            <div style={styles.menuRow} onClick={() => navigateTo('my_sports_screen')}>
              <Activity size={18} color="#6B7280" />
              <span style={styles.menuText}>My {activeSportName}</span>
            </div>

            {/* My Performance */}
            <div style={styles.menuRow} onClick={() => navigateTo('profile')}>
              <BarChart3 size={18} color="#6B7280" />
              <span style={styles.menuText}>My Performance</span>
            </div>

            {/* Store */}
            <div style={styles.menuRow} onClick={() => navigateTo('store_screen')}>
              <ShoppingBag size={18} color="#6B7280" />
              <span style={styles.menuText}>Playfinity Store</span>
              <YellowJerseyBadge />
            </div>

            {/* Leaderboards */}
            <div style={styles.menuRow} onClick={() => navigateTo('teams')}>
              <Award size={18} color="#6B7280" />
              <span style={styles.menuText}>Leaderboards</span>
            </div>

            {/* Awards */}
            <div style={styles.menuRow} onClick={() => navigateTo('rewards')}>
              <Trophy size={18} color="#6B7280" />
              <span style={styles.menuText}>Playfinity Awards</span>
            </div>

            {/* Associations */}
            <div style={styles.menuRow} onClick={() => showAlert('Associations', 'Associations features coming soon!')}>
              <Network size={18} color="#6B7280" />
              <span style={styles.menuText}>Associations</span>
            </div>

            {/* Clubs */}
            <div style={styles.menuRow} onClick={() => showAlert('Clubs', 'Clubs directory and registration coming soon!')}>
              <Shield size={18} color="#6B7280" />
              <span style={styles.menuText}>Clubs</span>
            </div>

            {/* Contact */}
            <div style={styles.menuRow} onClick={() => showAlert('Contact Us', 'Support Email: support@playfinity.com\nSupport Helpline: +91 6353874452')}>
              <PhoneCall size={18} color="#6B7280" />
              <span style={styles.menuText}>Contact</span>
            </div>

            {/* Share App */}
            <div style={styles.menuRow} onClick={handleShare}>
              <Share2 size={18} color="#6B7280" />
              <span style={styles.menuText}>Share the app</span>
            </div>

            {/* Rate Us */}
            <div style={styles.menuRow} onClick={() => showAlert('Rate App', 'Thank you for your rating! We are scaling new milestones because of you.')}>
              <Star size={18} color="#6B7280" />
              <span style={styles.menuText}>Rate us</span>
            </div>

            {/* App Code */}
            <div 
              style={styles.menuRow} 
              onClick={() => showAlert('App Code', `Your App Sharing Code: PF-${displayName.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`)}
            >
              <QrCode size={18} color="#6B7280" />
              <span style={styles.menuText}>App code</span>
            </div>

            {/* Logout */}
            <div 
              style={{ ...styles.menuRow, borderBottom: 'none' }} 
              onClick={() => {
                logoutUser();
                setIsDrawerOpen(false);
              }}
            >
              <LogOut size={18} color="#DC2626" />
              <span style={{ ...styles.menuText, color: '#DC2626', fontWeight: '600' }}>Logout</span>
            </div>

          </div>

          {/* Version Footer */}
          <div style={styles.footer}>
            <span>Playfinity v2.4.1</span>
          </div>

        </div>
      </div>
    </>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'flex-start',
    animation: 'fadeIn 0.25s ease-out'
  },
  drawerContainer: {
    width: '305px',
    height: '100%',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '4px 0 16px rgba(0,0,0,0.25)',
    animation: 'slideIn 0.25s cubic-bezier(0.1, 0.8, 0.25, 1)',
    position: 'relative'
  },
  headerBlock: {
    backgroundColor: '#2C2D2F', // CricHeroes dark-grey background
    padding: '24px 16px 16px 16px',
    position: 'relative',
    borderBottom: '1px solid #3F3F46'
  },
  profileSection: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    marginTop: 8
  },
  avatarSvg: {
    borderRadius: '50%',
    border: '2px solid #0D9488', // Teal border
    backgroundColor: '#1E293B',
    flexShrink: 0
  },
  profileDetails: {
    display: 'flex',
    flexDirection: 'column',
    color: '#FFFFFF',
    flex: 1,
    minWidth: 0 // allow text wrapping / ellipsis
  },
  profileName: {
    fontSize: '1.15rem',
    fontWeight: '700',
    letterSpacing: '0.3px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  arrowButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: 22,
    height: 22
  },
  profilePhone: {
    fontSize: '0.8rem',
    color: '#D1D5DB',
    marginTop: 2,
    letterSpacing: '0.5px'
  },
  emailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 2
  },
  profileEmail: {
    fontSize: '0.78rem',
    color: '#9CA3AF',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: 1
  },
  verifyLink: {
    background: 'none',
    border: 'none',
    color: '#FFFFFF',
    textDecoration: 'underline',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    padding: 0
  },
  verifiedText: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.72rem',
    color: '#10B981',
    fontWeight: '600'
  },
  userBadgeRow: {
    marginTop: 8
  },
  freeUserBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '12px',
    border: '1px solid #9CA3AF',
    color: '#E5E7EB',
    fontSize: '0.72rem',
    fontWeight: '500',
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  },
  proUserBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '12px',
    border: '1px solid #F59E0B',
    color: '#FBBF24',
    fontSize: '0.72rem',
    fontWeight: '700',
    backgroundColor: 'rgba(245, 158, 11, 0.1)'
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.1)'
    }
  },
  menuScrollArea: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: '#FFFFFF',
    paddingBottom: 20
  },
  menuRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '14px 18px',
    cursor: 'pointer',
    borderBottom: '1px solid #F3F4F6', // Divider lines
    transition: 'background-color 0.15s ease',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent'
  },
  menuText: {
    fontSize: '0.88rem',
    color: '#374151', // Sleek dark grey text
    fontWeight: '500',
    fontFamily: "'Inter', sans-serif"
  },
  freeBadge: {
    marginLeft: 'auto',
    backgroundColor: '#6B7280',
    color: '#FFFFFF',
    fontSize: '0.68rem',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  },
  proCircleOutline: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    border: '1.5px solid #8B5CF6', // violet color
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  proCircleText: {
    fontSize: '0.5rem',
    fontWeight: '900',
    color: '#8B5CF6'
  },
  footer: {
    padding: '12px 18px',
    borderTop: '1px solid #F3F4F6',
    backgroundColor: '#F9FAFB',
    color: '#9CA3AF',
    fontSize: '0.72rem',
    fontWeight: '500',
    textAlign: 'left'
  }
};
