import React from 'react';
import { ArrowLeft, Bell, Share2, Menu, Calendar, User, Search, MapPin } from 'lucide-react';
import { useAppState } from '../context/AppState';

const regions = ['Ahmedabad', 'Gandhinagar', 'Vadodara', 'Rajkot', 'Surat', 'Mumbai', 'Delhi', 'Bengaluru'];

export default function Header() {
  const { 
    currentScreen, setCurrentScreen, 
    onboardingViewMode, setOnboardingViewMode,
    userRole, setUserRole, 
    venues, playerId, showAlert,
    liveMatch,
    selectedVenueId, setSelectedVenueId,
    selectedSportFilter,
    isDrawerOpen, setIsDrawerOpen,
    selectedRegion, setSelectedRegion,
    gpsStatus, requestGpsLocation,
    tournaments, selectedTournamentId
  } = useAppState();

  const handleShareScoring = () => {
    if (!liveMatch) return;
    const shareUrl = `${window.location.origin}?shareScoreMatchId=${liveMatch.id}`;
    const text = `Take over live scoring for the match ${liveMatch.team1} vs ${liveMatch.team2} (${liveMatch.sport || 'Cricket'}): ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'login': return 'Join the Arena';
      case 'venue_onboarding': 
        return onboardingViewMode === 'list' 
          ? 'Manage Arenas' 
          : (onboardingViewMode === 'edit' ? 'Edit Arena' : 'Register Arena');
      case 'player_home': return 'Playfinity';
      case 'venue_detail': return 'Smash Box Arena';
      case 'live_scorecard': return 'Live Scorecard';
      case 'scorer_panel': return 'Ball Scorer';
      case 'owner_dashboard': return 'Venue Dashboard';
      case 'create_tournament': return 'Create Tournament';
      case 'bracket': return 'Tournaments';
      case 'tournament_detail': {
        const t = tournaments?.find(tour => tour.id === selectedTournamentId);
        return t ? t.name : 'Tournament Detail';
      }
      case 'teams': return 'Rosters & Ranks';
      case 'profile': return 'My Career';
      case 'rewards': return 'My Bookings';
      case 'gaming_hub': return 'PlayStation Gaming Hub';
      case 'my_sports_screen': 
        return selectedSportFilter === 'All' ? 'My Sports' : `My ${selectedSportFilter}`;
      case 'store_screen': return 'Playfinity Store';
      default: return 'Playfinity';
    }
  };

  const showBackButton = () => {
    // Show back button on all screens except the main dashboards
    return !['splash', 'login', 'player_home', 'owner_dashboard', 'my_sports_screen', 'store_screen'].includes(currentScreen);
  };

  const handleBack = () => {
    if (currentScreen === 'login') {
      setCurrentScreen('login');
    } else if (currentScreen === 'venue_onboarding') {
      if (onboardingViewMode !== 'list') {
        setOnboardingViewMode('list');
      } else {
        const owned = venues.filter(v => v.ownerId === playerId);
        if (owned.length > 0) {
          setCurrentScreen('owner_dashboard');
        } else {
          setCurrentScreen('login');
        }
      }
    } else if (currentScreen === 'gaming_hub') {
      if (selectedVenueId) {
        setSelectedVenueId(null);
      } else {
        if (userRole === 'admin') {
          setCurrentScreen('owner_dashboard');
        } else {
          setCurrentScreen('player_home');
        }
      }
    } else if (currentScreen === 'tournament_detail') {
      if (userRole === 'admin') {
        setCurrentScreen('bracket');
      } else {
        setCurrentScreen('my_sports_screen');
      }
    } else if (currentScreen === 'live_scorecard') {
      if ((userRole === 'admin' || userRole === 'scorer') && liveMatch && !liveMatch.isCompleted) {
        setCurrentScreen('scorer_panel');
      } else {
        setCurrentScreen('my_sports_screen');
      }
    } else {
      if (userRole === 'admin') {
        setCurrentScreen('owner_dashboard');
      } else {
        setCurrentScreen('player_home');
      }
    }
  };

  const activeSportName = selectedSportFilter === 'All' ? 'Sports' : selectedSportFilter;

  return (
    <div style={styles.headerContainer}>
      <div style={styles.leftSection}>
        {showBackButton() ? (
          <button onClick={handleBack} style={styles.iconButton}>
            <ArrowLeft size={20} color="#FFFFFF" />
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={styles.iconButton} onClick={() => setIsDrawerOpen(true)}>
              <Menu size={22} color="#FFFFFF" />
            </button>
          </div>
        )}
      </div>

      <div style={styles.centerSection}>
        {!showBackButton() && currentScreen === 'player_home' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={styles.communityHeading}>{activeSportName} community in</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                style={styles.locationDropdown}
              >
                {regions.map(r => (
                  <option key={r} value={r} style={{ color: '#000000' }}>
                    {r}
                  </option>
                ))}
              </select>
              <button 
                onClick={requestGpsLocation} 
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center'
                }}
                title={gpsStatus === 'active' ? "GPS Active" : "Click to refresh GPS"}
              >
                <MapPin 
                  size={12} 
                  color={gpsStatus === 'active' ? '#6EE7B7' : (gpsStatus === 'acquiring' ? '#FBBF24' : 'rgba(255,255,255,0.7)')} 
                />
              </button>
            </div>
          </div>
        ) : (
          <h3 className="heading-sporty" style={styles.titleText}>{getScreenTitle()}</h3>
        )}
      </div>

      <div style={styles.rightSection}>
        {currentScreen === 'scorer_panel' && liveMatch && (
          <button style={styles.iconButton} onClick={handleShareScoring} title="Share Scoring Access">
            <Share2 size={18} color="#FFFFFF" />
          </button>
        )}
        
        {/* Profile / User button */}
        <button 
          style={{
            ...styles.iconButton, 
            opacity: currentScreen === 'profile' ? 1 : 0.85,
            borderBottom: currentScreen === 'profile' ? '2px solid #FFFFFF' : 'none',
            paddingBottom: currentScreen === 'profile' ? 2 : 0
          }} 
          onClick={() => setCurrentScreen('profile')}
          title="My Profile"
        >
          <User size={20} color="#FFFFFF" />
        </button>

        {/* Active notifications indicator (aesthetic) */}
        <div style={{ position: 'relative' }}>
          <button 
            style={styles.iconButton} 
            onClick={async () => { await showAlert('Notifications', 'Allow notifications for live match updates!'); }}
            title="Notifications"
          >
            <Bell size={18} color="#FFFFFF" />
          </button>
          <span style={styles.greenNotificationBadge}>1</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#DC2626', // Premium Sporty Red
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    padding: '12px 14px',
    position: 'sticky',
    top: 0,
    width: '100%',
    zIndex: 1000,
    boxShadow: '0 2px 12px rgba(0,0,0,0.12)'
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0
  },
  centerSection: {
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
    minWidth: 0,
    padding: '0 8px'
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    flexShrink: 0
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s',
    outline: 'none',
    padding: 4
  },
  titleText: {
    fontSize: '1.05rem',
    color: '#FFFFFF',
    textAlign: 'center',
    margin: 0,
    fontFamily: "var(--font-heading)",
    fontWeight: '800',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textTransform: 'uppercase'
  },
  communityHeading: {
    fontSize: '0.62rem',
    color: 'rgba(255,255,255,0.75)',
    fontWeight: 500,
    fontFamily: 'var(--font-body)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  locationDropdown: {
    background: 'none',
    border: 'none',
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: '0.78rem',
    fontFamily: 'var(--font-heading)',
    cursor: 'pointer',
    outline: 'none',
    textAlign: 'center',
    padding: '0 2px'
  },
  proBadge: {
    border: '1.5px solid #FFFFFF',
    borderRadius: '4px',
    padding: '2px 6px',
    color: '#FFFFFF',
    fontSize: '0.58rem',
    fontWeight: 800,
    fontFamily: 'var(--font-label)',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap'
  },
  greenNotificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#10B981', // Emerald Green
    color: '#FFFFFF',
    borderRadius: '50%',
    width: 13,
    height: 13,
    fontSize: '0.55rem',
    fontWeight: '900',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1.5px solid #DC2626'
  }
};
