import React from 'react';
import { Home, Trophy, Calendar, User, Layout, Edit, Award, MapPin, Users, ShoppingBag } from 'lucide-react';
import { useAppState } from '../context/AppState';

export default function BottomNav() {
  const { currentScreen, setCurrentScreen, userRole, selectedSportFilter } = useAppState();

  const getTabs = () => {
    const sportLabel = selectedSportFilter === 'All' ? 'My Sports' : `My ${selectedSportFilter}`;
    switch (userRole) {
      case 'scorer':
        return [
          { id: 'player_home', label: 'Home', icon: Home },
          { id: 'profile', label: 'My Career', icon: User },
          { id: 'rewards', label: 'My Booking', icon: Calendar }
        ];
      case 'admin':
        return [
          { id: 'owner_dashboard', label: 'Dashboard', icon: Layout },
          { id: 'venue_onboarding', label: 'My Arena', icon: MapPin },
          { id: 'bracket', label: 'Brackets', icon: Trophy }
        ];
      case 'viewer':
      default:
        return [
          { id: 'player_home', label: 'Home', icon: Home },
          { id: 'my_sports_screen', label: sportLabel, icon: Trophy },
          { id: 'rewards', label: 'My Booking', icon: Calendar },
          { id: 'store_screen', label: 'Store', icon: ShoppingBag }
        ];
    }
  };

  const tabs = getTabs();

  return (
    <div style={styles.navContainer}>
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = currentScreen === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentScreen(tab.id)}
            style={{
              ...styles.tabButton,
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)'
            }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span style={{
              ...styles.tabLabel,
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: isActive ? '600' : '400'
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const styles = {
  navContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'var(--bg-surface-solid)',
    borderTop: '1px solid var(--border-light)',
    padding: '8px 4px 16px 4px', // safe area margin for mobile
    position: 'sticky',
    bottom: 0,
    width: '100%',
    zIndex: 1000
  },
  tabButton: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    cursor: 'pointer',
    flex: 1,
    transition: 'all 0.2s'
  },
  tabLabel: {
    fontSize: '0.68rem',
    fontFamily: "'Inter', system-ui, sans-serif",
    textTransform: 'none',
    letterSpacing: '0.3px',
    fontWeight: '500'
  }
};
