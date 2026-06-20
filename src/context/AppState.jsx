import React, { createContext, useState, useContext, useEffect } from 'react';

const AppStateContext = createContext(null);

export const useAppState = () => useContext(AppStateContext);

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

    const startStr = formatHour(startHourNum);
    const endStr = formatHour(endHourNum);
    slots.push({ time: `${startStr} - ${endStr}`, status: 'available' });
  }
  return slots;
};

const API_BASE = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001'
    : '');

const defaultMockTournaments = [];

export const AppStateProvider = ({ children }) => {
  // Modal dialog states
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'alert', // 'alert' | 'error' | 'confirm' | 'prompt'
    title: '',
    message: '',
    defaultValue: '',
    placeholder: '',
    onConfirm: null,
    onCancel: null
  });

  const showAlert = (title, message) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type: 'alert',
        title,
        message,
        defaultValue: '',
        placeholder: '',
        onConfirm: () => {
          setModalState(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setModalState(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  };

  const showError = (title, message) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type: 'error',
        title,
        message,
        defaultValue: '',
        placeholder: '',
        onConfirm: () => {
          setModalState(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setModalState(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  };

  const showConfirm = (title, message) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type: 'confirm',
        title,
        message,
        defaultValue: '',
        placeholder: '',
        onConfirm: () => {
          setModalState(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setModalState(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  };

  const showPrompt = (title, message, placeholder = '', defaultValue = '') => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        type: 'prompt',
        title,
        message,
        defaultValue,
        placeholder,
        onConfirm: (val) => {
          setModalState(prev => ({ ...prev, isOpen: false }));
          resolve(val);
        },
        onCancel: () => {
          setModalState(prev => ({ ...prev, isOpen: false }));
          resolve(null);
        }
      });
    });
  };

  // Navigation states
  const [currentScreen, _setCurrentScreen] = useState(() => {
    const token = localStorage.getItem('bcp_auth_token');
    if (!token) return 'login';
    const savedScreen = localStorage.getItem('bcp_current_screen');
    return savedScreen || 'login';
  });

  const [isDataLoading, setDataLoading] = useState(() => {
    return !!localStorage.getItem('bcp_auth_token');
  });

  const setCurrentScreen = (screen) => {
    if (window.history.state?.screen !== screen) {
      window.history.pushState({ screen }, '', `#${screen}`);
    }
    _setCurrentScreen(screen);
  };

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.screen) {
        _setCurrentScreen(event.state.screen);
      } else {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
          _setCurrentScreen(hash);
        } else {
          const token = localStorage.getItem('bcp_auth_token');
          _setCurrentScreen(token ? 'player_home' : 'login');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Initial setup on mount: check URL hash or fallback to state
    const token = localStorage.getItem('bcp_auth_token');
    const initialScreen = window.location.hash.replace('#', '') || (token ? (localStorage.getItem('bcp_current_screen') || 'player_home') : 'login');
    
    window.history.replaceState({ screen: initialScreen }, '', `#${initialScreen}`);
    if (initialScreen !== currentScreen) {
      _setCurrentScreen(initialScreen);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  const [paymentStatus, setPaymentStatus] = useState(localStorage.getItem('bcp_payment_status') || 'unpaid');
  const [subscriptionExpiry, setSubscriptionExpiry] = useState(localStorage.getItem('bcp_subscription_expiry') || '');
  const [subscriptionPlan, setSubscriptionPlan] = useState(localStorage.getItem('bcp_subscription_plan') || '');
  const [showPayModal, setShowPayModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [onboardingViewMode, setOnboardingViewMode] = useState('list');
  const [userRole, setUserRole] = useState(localStorage.getItem('bcp_user_role') || 'viewer'); // 'admin', 'scorer', 'viewer'
  const [userName, setUserName] = useState(localStorage.getItem('bcp_username') || '');
  const [playerSpecialty, setPlayerSpecialty] = useState(localStorage.getItem('bcp_player_specialty') || '');
  const [playerSpecialties, setPlayerSpecialties] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bcp_player_specialties') || '{}'); } catch(e) { return {}; }
  });
  const [playerSportsInterests, setPlayerSportsInterests] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bcp_sports_interests') || '[]'); } catch(e) { return []; }
  });
  const [selectedSportFilter, setSelectedSportFilter] = useState('All');

  // Player specific stats & login data
  const [userEmail, setUserEmail] = useState(localStorage.getItem('bcp_email') || '');
  const [userPhone, setUserPhone] = useState(localStorage.getItem('bcp_phone') || '');
  const [playerId, setPlayerId] = useState(localStorage.getItem('bcp_player_id') || ('BCP-PL-' + Math.floor(1000 + Math.random() * 9000)));
  const [matchesPlayedCount, setMatchesPlayedCount] = useState(0);

  // Authentication states
  const [authToken, setAuthToken] = useState(localStorage.getItem('bcp_auth_token') || '');
  const [apiKey, setApiKey] = useState(localStorage.getItem('bcp_api_key') || '');

  // Authenticated fetch wrapper
  const authFetch = async (url, options = {}) => {
    const finalUrl = url.replace('http://localhost:3001', API_BASE);
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    const token = authToken || localStorage.getItem('bcp_auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(finalUrl, {
      ...options,
      headers
    });
    
    if (response.status === 401) {
      logoutUser();
    }
    
    return response;
  };

  const signupUser = async (email, phone, password, role) => {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone, password, role })
    });
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Signup failed');
    }
    
    const { token, user } = data;
    
    setAuthToken(token);
    setApiKey(user.apiKey || '');
    setPlayerId(user.playerId);
    setUserName(user.username || '');
    setUserEmail(user.email || '');
    setUserPhone(user.phone || '');
    setUserRole(user.role || 'viewer');
    setPaymentStatus(user.paymentStatus || 'unpaid');
    setSubscriptionExpiry(user.subscriptionExpiry || '');
    setSubscriptionPlan(user.subscriptionPlan || '');
    setPlayerSpecialty(user.specialty || '');
    const specs = typeof user.specialties === 'object' && user.specialties !== null ? user.specialties : (user.specialties ? JSON.parse(user.specialties) : {});
    setPlayerSpecialties(specs);
    const sportsArr = Array.isArray(user.sports_interests) ? user.sports_interests : [];
    setPlayerSportsInterests(sportsArr);
    setSelectedSportFilter('All');
    
    localStorage.setItem('bcp_auth_token', token);
    localStorage.setItem('bcp_api_key', user.apiKey || '');
    localStorage.setItem('bcp_player_id', user.playerId);
    localStorage.setItem('bcp_username', user.username || '');
    localStorage.setItem('bcp_email', user.email || '');
    localStorage.setItem('bcp_phone', user.phone || '');
    localStorage.setItem('bcp_user_role', user.role || 'viewer');
    localStorage.setItem('bcp_payment_status', user.paymentStatus || 'unpaid');
    localStorage.setItem('bcp_subscription_expiry', user.subscriptionExpiry || '');
    localStorage.setItem('bcp_subscription_plan', user.subscriptionPlan || '');
    localStorage.setItem('bcp_player_specialty', user.specialty || '');
    localStorage.setItem('bcp_player_specialties', JSON.stringify(specs));
    localStorage.setItem('bcp_sports_interests', JSON.stringify(sportsArr));
    
    return user;
  };

  const loginUser = async (emailOrPhone, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrPhone, password })
    });
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
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
    setSelectedSportFilter('All');
    
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
    
    return user;
  };

  const logoutUser = () => {
    setAuthToken('');
    setApiKey('');
    setPlayerId('BCP-PL-' + Math.floor(1000 + Math.random() * 9000));
    setUserName('');
    setUserEmail('');
    setUserPhone('');
    setUserRole('viewer');
    setPaymentStatus('unpaid');
    setSubscriptionExpiry('');
    setSubscriptionPlan('');
    setPlayerSpecialty('');
    setPlayerSpecialties({});
    setPlayerSportsInterests([]);
    setSelectedSportFilter('All');
    setMatchesPlayedCount(0);
    setCompletedMatches([]);
    setLoyaltyVisits({});
    setBookings([]);
    setVenues([]);
    setSelectedVenueId(null);
    setLiveMatch(null);
    setMatchHistory([]);
    setTournaments([]);
    setTeams([]);
    
    localStorage.removeItem('bcp_auth_token');
    localStorage.removeItem('bcp_api_key');
    localStorage.removeItem('bcp_player_id');
    localStorage.removeItem('bcp_username');
    localStorage.removeItem('bcp_email');
    localStorage.removeItem('bcp_phone');
    localStorage.removeItem('bcp_user_role');
    localStorage.removeItem('bcp_payment_status');
    localStorage.removeItem('bcp_subscription_expiry');
    localStorage.removeItem('bcp_subscription_plan');
    localStorage.removeItem('bcp_player_specialty');
    localStorage.removeItem('bcp_player_specialties');
    localStorage.removeItem('bcp_sports_interests');
    localStorage.removeItem('bcp_live_match');
    localStorage.removeItem('bcp_match_history');
    localStorage.removeItem('bcp_current_screen');
    
    setCurrentScreen('login');
  };

  const checkUsernameUnique = async (username) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/check-username?username=${encodeURIComponent(username)}&playerId=${playerId}`);
      if (res.ok) {
        const data = await res.json();
        return data.unique;
      }
      return false;
    } catch (e) {
      console.error("Check username unique failed:", e.message);
      return false;
    }
  };

  const updateUsernameOnBackend = async (newUsername) => {
    try {
      const res = await authFetch('http://localhost:3001/api/users', {
        method: 'POST',
        body: JSON.stringify({
          playerId,
          username: newUsername,
          email: userEmail || null,
          phone: userPhone || null,
          role: userRole,
          specialty: playerSpecialty || null
        })
      });
      if (res.ok) {
        setUserName(newUsername);
        localStorage.setItem('bcp_username', newUsername);
        return true;
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update username');
      }
    } catch (e) {
      console.error("Username save failed:", e.message);
      throw e;
    }
  };

  const updatePhoneOnBackend = async (newPhone) => {
    try {
      const res = await authFetch('http://localhost:3001/api/users', {
        method: 'POST',
        body: JSON.stringify({
          playerId,
          username: userName,
          email: userEmail || null,
          phone: newPhone,
          role: userRole,
          specialty: playerSpecialty || null,
          specialties: playerSpecialties,
          sports_interests: playerSportsInterests
        })
      });
      if (res.ok) {
        setUserPhone(newPhone);
        localStorage.setItem('bcp_phone', newPhone);
        return true;
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update phone number');
      }
    } catch (e) {
      console.error("Phone number save failed:", e.message);
      throw e;
    }
  };

  const updateProfileOnBackend = async (newUsername, newPhone) => {
    try {
      const res = await authFetch('http://localhost:3001/api/users', {
        method: 'POST',
        body: JSON.stringify({
          playerId,
          username: newUsername,
          email: userEmail || null,
          phone: newPhone,
          role: userRole,
          specialty: playerSpecialty || null,
          specialties: playerSpecialties,
          sports_interests: playerSportsInterests
        })
      });
      if (res.ok) {
        setUserName(newUsername);
        setUserPhone(newPhone);
        localStorage.setItem('bcp_username', newUsername);
        localStorage.setItem('bcp_phone', newPhone);
        return true;
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (e) {
      console.error("Profile save failed:", e.message);
      throw e;
    }
  };

  const updateSpecialtyOnBackend = async (newSpecialty) => {
    try {
      const res = await authFetch('http://localhost:3001/api/users', {
        method: 'POST',
        body: JSON.stringify({
          playerId,
          username: userName,
          email: userEmail || null,
          phone: userPhone || null,
          role: userRole,
          specialty: newSpecialty || null
        })
      });
      if (res.ok) {
        setPlayerSpecialty(newSpecialty);
        localStorage.setItem('bcp_player_specialty', newSpecialty || '');
        return true;
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update specialty');
      }
    } catch (e) {
      console.error("Specialty save failed:", e.message);
      throw e;
    }
  };

  const updateSpecialtiesOnBackend = async (newSpecialties) => {
    try {
      const res = await authFetch('http://localhost:3001/api/users', {
        method: 'POST',
        body: JSON.stringify({
          playerId,
          username: userName,
          email: userEmail || null,
          phone: userPhone || null,
          role: userRole,
          specialties: newSpecialties
        })
      });
      if (res.ok) {
        setPlayerSpecialties(newSpecialties);
        localStorage.setItem('bcp_player_specialties', JSON.stringify(newSpecialties));
        return true;
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update specialties');
      }
    } catch (e) {
      console.error("Specialties save failed:", e.message);
      throw e;
    }
  };

  const updateSportsInterestsOnBackend = async (sports) => {
    try {
      const res = await authFetch('http://localhost:3001/api/users', {
        method: 'POST',
        body: JSON.stringify({
          playerId,
          username: userName,
          email: userEmail || null,
          phone: userPhone || null,
          role: userRole,
          specialty: playerSpecialty || null,
          sports_interests: sports
        })
      });
      if (res.ok) {
        setPlayerSportsInterests(sports);
        localStorage.setItem('bcp_sports_interests', JSON.stringify(sports));
        setSelectedSportFilter('All');
        return true;
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update sports interests');
      }
    } catch (e) {
      console.error("Sports interests save failed:", e.message);
      throw e;
    }
  };

  // Completed matches history
  const [completedMatches, setCompletedMatches] = useState([]);
  const [selectedCompletedMatch, setSelectedCompletedMatch] = useState(null);
  const [allLiveMatches, setAllLiveMatches] = useState([]);
  const [selectedLiveMatch, setSelectedLiveMatch] = useState(null);

  const saveCompletedMatch = (matchData) => {
    const newMatch = {
      id: 'match-comp-' + Math.floor(Math.random() * 10000),
      date: 'Today',
      ...matchData
    };
    setCompletedMatches(prev => [newMatch, ...prev]);

    // Send to MySQL DB
    authFetch('http://localhost:3001/api/matches', {
      method: 'POST',
      body: JSON.stringify(newMatch)
    }).catch(e => console.error("Matches save failed:", e.message));
  };

  // Default time slots used when venues are loaded from DB (DB does not store timeSlots)
  const defaultTimeSlots = generate24HourSlots();

  // SQL Data synchronization on mount
  // - Parallel Data Fetching: Used Promise.all to fetch 7 endpoints concurrently, eliminating waterfall latency.
  // - Performance Tuning: Optimized timeouts for instant UI feedback (registration/payments).
  // - Compilation Fixes: Destructured missing context hooks to resolve linter reference errors.
  const loadData = async () => {
    try {
      const token = authToken || localStorage.getItem('bcp_auth_token');
      if (!token) return;

      setDataLoading(true);

      const endpoints = [
        'http://localhost:3001/api/venues',
        'http://localhost:3001/api/bookings',
        'http://localhost:3001/api/teams',
        'http://localhost:3001/api/matches/live',
        'http://localhost:3001/api/matches',
        'http://localhost:3001/api/tournaments',
        'http://localhost:3001/api/loyalty'
      ];

      // Fetch all endpoints concurrently
      const responses = await Promise.all(
        endpoints.map(url => authFetch(url).catch(err => {
          console.error(`Failed to fetch ${url}:`, err.message);
          return { ok: false };
        }))
      );

      const [resV, resB, resT, resLive, resM, resTours, resLoyalty] = responses;

      if (resV && resV.ok) {
        const dataV = await resV.json();
        // Inject default timeSlots & safe defaults for fields not stored in DB
        const enrichedVenues = dataV.map(v => ({
          pitchType: 'Premium Turf',
          floodlit: 'Yes',
          capacity: 14,
          distance: 1.5,
          ...v,
          images: Array.isArray(v.images) ? v.images : [],
          sports: Array.isArray(v.sports) ? v.sports : (v.sport ? [v.sport] : ['Box Cricket']),
          reviews: Array.isArray(v.reviews) ? v.reviews : [],
          timeSlots: Array.isArray(v.timeSlots) && v.timeSlots.length > 0
            ? v.timeSlots
            : defaultTimeSlots
        }));
        setVenues(enrichedVenues);
        const currentRole = userRole || localStorage.getItem('bcp_user_role');
        const currentPlayerId = playerId || localStorage.getItem('bcp_player_id');
        if (currentRole === 'admin') {
          const owned = enrichedVenues.filter(v => v.ownerId === currentPlayerId);
          if (owned.length > 0) {
            setSelectedVenueId(owned[0].id);
          } else {
            setSelectedVenueId(null);
          }
        } else if (enrichedVenues.length > 0) {
          setSelectedVenueId(enrichedVenues[0].id);
        }
      }
      
      if (resB && resB.ok) {
        const dataB = await resB.json();
        setBookings(dataB);
      }

      if (resT && resT.ok) {
        const dataT = await resT.json();
        setTeams(dataT);
      }

      if (resLive && resLive.ok) {
        const dataLive = await resLive.json();
        setAllLiveMatches(dataLive);
      }

      if (resM && resM.ok) {
        const dataM = await resM.json();
        const parsed = dataM.map(m => {
          let parsedState = null;
          if (m.matchState) {
            try {
              parsedState = typeof m.matchState === 'string' ? JSON.parse(m.matchState) : m.matchState;
            } catch (err) {
              console.error("Failed to parse matchState JSON:", err);
            }
          }
          return {
            ...m,
            matchState: parsedState
          };
        });
        setCompletedMatches(parsed);
      }

      if (resTours && resTours.ok) {
        const dataTours = await resTours.json();
        setTournaments(dataTours.length > 0 ? dataTours : defaultMockTournaments);
      }

      if (resLoyalty && resLoyalty.ok) {
        const dataLoyalty = await resLoyalty.json();
        setLoyaltyVisits(dataLoyalty);
      }
    } catch (e) {
      console.warn("SQL Server connection bypassed. Operating in local state fallback mode:", e.message);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [authToken]);
  
  // Permissions
  const [permissions, setPermissions] = useState(() => {
    try {
      const stored = localStorage.getItem('bcp_permissions');
      return stored ? JSON.parse(stored) : { notifications: false, location: false, asked: false };
    } catch {
      return { notifications: false, location: false, asked: false };
    }
  });

  useEffect(() => {
    localStorage.setItem('bcp_permissions', JSON.stringify(permissions));
  }, [permissions]);

  // Rewards: counts of visits at venues (Starts clean at 0 visits)
  const [loyaltyVisits, setLoyaltyVisits] = useState({});

  // Bookings list (starts clean at empty [])
  const [bookings, setBookings] = useState([]);

  // Nearby Venues (Starts clean at empty list!)
  const [venues, setVenues] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState(null);

  const [selectedRegion, setSelectedRegion] = useState('Ahmedabad');
  const [gpsStatus, setGpsStatus] = useState('inactive'); // 'inactive' | 'acquiring' | 'active' | 'denied' | 'unavailable'
  const [gpsCoords, setGpsCoords] = useState(null);

  const requestGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('unavailable');
      return;
    }
    setGpsStatus('acquiring');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setGpsCoords(coords);
        setGpsStatus('active');

        // Coordinates map of supported cities
        const cityCoords = {
          Ahmedabad: { lat: 23.0225, lng: 72.5714 },
          Gandhinagar: { lat: 23.2156, lng: 72.6369 },
          Vadodara: { lat: 22.3072, lng: 73.1812 },
          Rajkot: { lat: 22.3039, lng: 70.8022 },
          Surat: { lat: 21.1702, lng: 72.8311 },
          Mumbai: { lat: 19.0760, lng: 72.8777 },
          Delhi: { lat: 28.6139, lng: 77.2090 },
          Bengaluru: { lat: 12.9716, lng: 77.5946 }
        };

        // Find closest city
        let closestCity = 'Ahmedabad';
        let minDistance = Infinity;

        Object.keys(cityCoords).forEach(city => {
          const cityLat = cityCoords[city].lat;
          const cityLng = cityCoords[city].lng;
          // Simple Euclidean distance approximation
          const dist = Math.sqrt(
            Math.pow(coords.lat - cityLat, 2) + 
            Math.pow(coords.lng - cityLng, 2)
          );
          if (dist < minDistance) {
            minDistance = dist;
            closestCity = city;
          }
        });

        // Auto select closest city by default
        setSelectedRegion(closestCity);

        // Update distances to realistic GPS coordinates
        setVenues(prev => prev.map(v => {
          const computedDist = Math.round((0.8 + Math.random() * 3.5) * 10) / 10;
          return { ...v, distance: computedDist };
        }));
      },
      (error) => {
        console.warn("GPS retrieval failed:", error.message);
        setGpsStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    requestGpsLocation();
  }, []);

  // Live Match State (Starts clean at null)
  const [liveMatch, setLiveMatch] = useState(() => {
    const saved = localStorage.getItem('bcp_live_match');
    return saved ? JSON.parse(saved) : null;
  });
  const [matchHistory, setMatchHistory] = useState(() => {
    const saved = localStorage.getItem('bcp_match_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (liveMatch && !liveMatch.isCompleted) {
      const syncLive = async () => {
        try {
          await authFetch('http://localhost:3001/api/matches/live', {
            method: 'POST',
            body: JSON.stringify({
              id: liveMatch.id,
              sport: liveMatch.sport || 'Cricket',
              data: JSON.stringify(liveMatch)
            })
          });
        } catch (e) {
          console.warn("Failed to sync live match:", e.message);
        }
      };
      syncLive();
      localStorage.setItem('bcp_live_match', JSON.stringify(liveMatch));
    } else {
      localStorage.removeItem('bcp_live_match');
      localStorage.removeItem('bcp_match_history');
    }
  }, [liveMatch, authToken]);

  useEffect(() => {
    if (matchHistory && matchHistory.length > 0) {
      localStorage.setItem('bcp_match_history', JSON.stringify(matchHistory));
    } else {
      localStorage.removeItem('bcp_match_history');
    }
  }, [matchHistory]);

  useEffect(() => {
    if (currentScreen) {
      localStorage.setItem('bcp_current_screen', currentScreen);
    } else {
      localStorage.removeItem('bcp_current_screen');
    }
  }, [currentScreen]);

  // Tournaments list (initialized with defaults)
  const [tournaments, setTournaments] = useState(defaultMockTournaments);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);

  // Teams & Players Roster (Starts clean at empty [])
  const [teams, setTeams] = useState([]);

  // Register a Box Cricket Venue (Onboarding)
  const registerVenue = async (venueData) => {
    const defaultSlots = generate24HourSlots();

    const newVenue = {
      id: 'venue-' + Math.floor(Math.random() * 10000),
      ownerId: playerId,
      rating: 4.8,
      reviewsCount: 2,
      pitchType: 'Premium Turf',
      floodlit: 'Yes',
      capacity: 14,
      distance: Math.round((1 + Math.random() * 4) * 10) / 10, // random distance 1-5km
      timeSlots: defaultSlots,
      upiId: 'smashbox@upi',
      reviews: [
        { id: 1, user: 'Amit G.', rating: 5, comment: 'Great turf, highly recommend for night matches!' },
        { id: 2, user: 'Karan Malhotra', rating: 4, comment: 'Excellent bounce and lighting. Phone bookings are smooth.' }
      ],
      ...venueData
    };

    const res = await authFetch('http://localhost:3001/api/venues', {
      method: 'POST',
      body: JSON.stringify(newVenue)
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to save venue on server');
    }

    setVenues(prev => [...prev, newVenue]);
    return newVenue.id;
  };

  const updateVenue = async (venueData) => {
    const res = await authFetch('http://localhost:3001/api/venues', {
      method: 'POST',
      body: JSON.stringify(venueData)
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to update venue on server');
    }

    setVenues(prev => prev.map(v => v.id === venueData.id ? { ...v, ...venueData } : v));
    return true;
  };

  const deleteVenue = async (venueId) => {
    setVenues(prev => prev.filter(v => v.id !== venueId));
    const res = await authFetch(`http://localhost:3001/api/venues/${venueId}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to delete venue');
    }
    return true;
  };

  const addVenueReview = (venueId, review) => {
    const newReview = {
      id: 'rev-' + Math.floor(Math.random() * 10000),
      user: userName || 'Anonymous',
      date: 'Today',
      ...review
    };

    setVenues(prev => {
      return prev.map(v => {
        if (v.id === venueId) {
          const updatedReviews = [newReview, ...(v.reviews || [])];
          const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const avgRating = Math.round((totalRating / updatedReviews.length) * 10) / 10;
          return {
            ...v,
            reviews: updatedReviews,
            rating: avgRating,
            reviewsCount: updatedReviews.length
          };
        }
        return v;
      });
    });

    // Send to MySQL DB
    authFetch(`http://localhost:3001/api/venues/${venueId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(newReview)
    }).catch(e => console.error("Review save failed:", e.message));
  };

  // Admin initiates/creates a match from registered teams
  const createNewMatch = (teamAId, teamBId, config, sport = 'Cricket', venueName = '') => {
    const t1 = teams.find(t => t.id === teamAId);
    const t2 = teams.find(t => t.id === teamBId);
    
    if (!t1 || !t2) return;

    let initialMatch = {
      id: 'match-' + Math.floor(Math.random() * 10000),
      sport: sport,
      venue: venueName || 'Local Arena',
      team1: t1.name,
      team2: t2.name,
      team1Id: t1.id,
      team2Id: t2.id,
      team1Captain: t1.captain || '',
      team2Captain: t2.captain || '',
      scorerId: playerId,
      scorerName: userName,
      isCompleted: false,
      result: '',
      date: 'Today'
    };

    if (sport === 'Cricket') {
      // Load registered players into batting list
      const battingList = t1.players.map((p, idx) => ({
        id: p.id,
        name: p.name,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isActive: idx < 2, // First two are active
        isStriking: idx === 0 // First player on strike
      }));

      const bowlingList = t2.players.map(p => ({
        id: p.id,
        name: p.name,
        overs: '0.0',
        maidens: 0,
        runs: 0,
        wickets: 0,
        economy: '0.0',
        isActive: false
      }));

      if (bowlingList.length > 0) {
        bowlingList[0].isActive = true;
      }

      initialMatch = {
        ...initialMatch,
        innings: 1,
        runs: 0,
        wickets: 0,
        balls: 0,
        maxOvers: parseInt(config.overs) || 8,
        maxBowlerOvers: parseInt(config.maxBowlerOvers) || 3,
        maxBowlerOversLimitCount: parseInt(config.maxBowlerOversLimitCount) || 2,
        crr: '0.00',
        lastBalls: [],
        oversHistory: [],
        firstInningsOversHistory: [],
        batting: battingList,
        bowling: bowlingList,
        extras: { wides: 0, noBalls: 0, legByes: 0, byes: 0, total: 0 },
        fallOfWickets: [],
        partnership: { runs: 0, balls: 0, batter1: battingList[0]?.name || 'Batter 1', batter2: battingList[1]?.name || 'Batter 2' },
        toss: config.toss || null
      };
    } else if (sport === 'Football') {
      initialMatch = {
        ...initialMatch,
        goals1: 0,
        goals2: 0,
        fouls1: 0,
        fouls2: 0,
        yellowCards1: 0,
        yellowCards2: 0,
        redCards1: 0,
        redCards2: 0,
        events: [],
        maxDuration: parseInt(config.duration) || 90
      };
    } else if (sport === 'Volleyball') {
      initialMatch = {
        ...initialMatch,
        points1: 0,
        points2: 0,
        sets1: 0,
        sets2: 0,
        currentSet: 1,
        setScores: [],
        bestOfSets: parseInt(config.sets) || 3
      };
    } else if (sport === 'Basketball') {
      initialMatch = {
        ...initialMatch,
        points1: 0,
        points2: 0,
        period: 1,
        fouls1: 0,
        fouls2: 0,
        timeouts1: 0,
        timeouts2: 0,
        periodDuration: parseInt(config.duration) || 10
      };
    } else if (sport === 'Pickleball') {
      initialMatch = {
        ...initialMatch,
        points1: 0,
        points2: 0,
        sets1: 0,
        sets2: 0,
        currentSet: 1,
        setScores: [],
        bestOfSets: parseInt(config.sets) || 3,
        targetPoints: parseInt(config.targetPoints) || 11
      };
    } else if (sport === 'Golf') {
      const totalHoles = parseInt(config.holes) || 9;
      initialMatch = {
        ...initialMatch,
        currentHole: 1,
        totalHoles: totalHoles,
        parValues: Array(totalHoles).fill(4),
        strokes1: Array(totalHoles).fill(0),
        strokes2: Array(totalHoles).fill(0)
      };
    } else if (sport === 'Hockey' || sport === 'Ice Hockey') {
      initialMatch = {
        ...initialMatch,
        goals1: 0,
        goals2: 0,
        shots1: 0,
        shots2: 0,
        penalties1: 0,
        penalties2: 0,
        period: 1,
        events: []
      };
    } else if (sport === 'Skating') {
      initialMatch = {
        ...initialMatch,
        technicalScore1: 0.0,
        artisticScore1: 0.0,
        totalScore1: 0.0,
        technicalScore2: 0.0,
        artisticScore2: 0.0,
        totalScore2: 0.0
      };
    } else if (sport === 'Badminton') {
      initialMatch = {
        ...initialMatch,
        points1: 0,
        points2: 0,
        sets1: 0,
        sets2: 0,
        currentSet: 1,
        setScores: [],
        bestOfSets: parseInt(config.sets) || 3,
        targetPoints: 21
      };
    } else if (sport === 'Table Tennis') {
      initialMatch = {
        ...initialMatch,
        points1: 0,
        points2: 0,
        sets1: 0,
        sets2: 0,
        currentSet: 1,
        setScores: [],
        bestOfSets: parseInt(config.sets) || 5,
        targetPoints: 11
      };
    } else if (sport === 'Tennis') {
      initialMatch = {
        ...initialMatch,
        points1: '0',
        points2: '0',
        games1: 0,
        games2: 0,
        sets1: 0,
        sets2: 0,
        currentSet: 1,
        setScores: [],
        bestOfSets: parseInt(config.sets) || 3
      };
    } else if (sport === 'Snooker') {
      initialMatch = {
        ...initialMatch,
        points1: 0,
        points2: 0,
        frames1: 0,
        frames2: 0,
        currentFrame: 1,
        frameScores: [],
        bestOfFrames: parseInt(config.frames) || 5
      };
    } else if (sport === 'Pool') {
      initialMatch = {
        ...initialMatch,
        points1: 0,
        points2: 0,
        frames1: 0,
        frames2: 0,
        currentFrame: 1,
        frameScores: [],
        bestOfFrames: parseInt(config.frames) || 5
      };
    } else if (sport === 'Gaming') {
      initialMatch = {
        ...initialMatch,
        points1: 0,
        points2: 0,
        rounds1: 0,
        rounds2: 0,
        currentRound: 1,
        roundScores: [],
        bestOfRounds: parseInt(config.rounds) || 3
      };
    }

    setMatchHistory([]);
    setLiveMatch(initialMatch);
  };

  const updateFootballScore = (teamIndex, goalType) => {
    if (!liveMatch) return;
    setMatchHistory(prev => [...prev, JSON.parse(JSON.stringify(liveMatch))]);
    setLiveMatch(prev => {
      const updated = { ...prev };
      const eventTime = "Min " + Math.floor(Math.random() * 90 + 1);
      const teamName = teamIndex === 1 ? updated.team1 : updated.team2;
      
      if (teamIndex === 1) {
        if (goalType === 'Own Goal') {
          updated.goals2 += 1;
        } else {
          updated.goals1 += 1;
        }
      } else {
        if (goalType === 'Own Goal') {
          updated.goals1 += 1;
        } else {
          updated.goals2 += 1;
        }
      }

      updated.events.push({
        time: eventTime,
        type: 'Goal',
        team: teamName,
        detail: goalType
      });

      return updated;
    });
  };

  const updateFootballStats = (teamIndex, stat, change) => {
    if (!liveMatch) return;
    setMatchHistory(prev => [...prev, JSON.parse(JSON.stringify(liveMatch))]);
    setLiveMatch(prev => {
      const updated = { ...prev };
      const teamKey = teamIndex === 1 ? '1' : '2';
      const teamName = teamIndex === 1 ? updated.team1 : updated.team2;
      
      if (stat === 'foul') {
        updated[`fouls${teamKey}`] = Math.max(0, updated[`fouls${teamKey}`] + change);
      } else if (stat === 'yellow') {
        updated[`yellowCards${teamKey}`] = Math.max(0, updated[`yellowCards${teamKey}`] + change);
        if (change > 0) {
          updated.events.push({ time: 'Event', type: 'Yellow Card', team: teamName, detail: 'Yellow Card' });
        }
      } else if (stat === 'red') {
        updated[`redCards${teamKey}`] = Math.max(0, updated[`redCards${teamKey}`] + change);
        if (change > 0) {
          updated.events.push({ time: 'Event', type: 'Red Card', team: teamName, detail: 'Red Card' });
        }
      }
      return updated;
    });
  };

  const updateVolleyballScore = (teamIndex, pointsChange) => {
    if (!liveMatch) return;
    setMatchHistory(prev => [...prev, JSON.parse(JSON.stringify(liveMatch))]);
    setLiveMatch(prev => {
      const updated = { ...prev };
      const ptsKey = teamIndex === 1 ? 'points1' : 'points2';
      updated[ptsKey] = Math.max(0, updated[ptsKey] + pointsChange);

      const deciderSetIndex = updated.bestOfSets;
      const targetPoints = updated.currentSet === deciderSetIndex ? 15 : 25;
      
      const p1 = updated.points1;
      const p2 = updated.points2;
      
      if ((p1 >= targetPoints || p2 >= targetPoints) && Math.abs(p1 - p2) >= 2) {
        const setWinner = p1 > p2 ? 1 : 2;
        const setWinnerName = setWinner === 1 ? updated.team1 : updated.team2;
        
        updated.setScores.push({
          set: updated.currentSet,
          score1: p1,
          score2: p2,
          winner: setWinnerName
        });

        if (setWinner === 1) {
          updated.sets1 += 1;
        } else {
          updated.sets2 += 1;
        }

        updated.points1 = 0;
        updated.points2 = 0;
        
        const setsNeeded = Math.ceil(updated.bestOfSets / 2);
        if (updated.sets1 >= setsNeeded) {
          updated.isCompleted = true;
          updated.result = `${updated.team1} won the Volleyball match ${updated.sets1} - ${updated.sets2}!`;
        } else if (updated.sets2 >= setsNeeded) {
          updated.isCompleted = true;
          updated.result = `${updated.team2} won the Volleyball match ${updated.sets2} - ${updated.sets1}!`;
        } else {
          updated.currentSet += 1;
        }
      }

      return updated;
    });
  };

  const updateBasketballScore = (teamIndex, points) => {
    if (!liveMatch) return;
    setMatchHistory(prev => [...prev, JSON.parse(JSON.stringify(liveMatch))]);
    setLiveMatch(prev => {
      const updated = { ...prev };
      const ptsKey = teamIndex === 1 ? 'points1' : 'points2';
      updated[ptsKey] = Math.max(0, updated[ptsKey] + points);
      return updated;
    });
  };

  const updateBasketballStats = (teamIndex, stat, change) => {
    if (!liveMatch) return;
    setMatchHistory(prev => [...prev, JSON.parse(JSON.stringify(liveMatch))]);
    setLiveMatch(prev => {
      const updated = { ...prev };
      const teamKey = teamIndex === 1 ? '1' : '2';
      
      if (stat === 'foul') {
        updated[`fouls${teamKey}`] = Math.max(0, updated[`fouls${teamKey}`] + change);
      } else if (stat === 'timeout') {
        updated[`timeouts${teamKey}`] = Math.max(0, updated[`timeouts${teamKey}`] + change);
      } else if (stat === 'period') {
        updated.period = Math.max(1, updated.period + change);
      }
      return updated;
    });
  };

  const updatePickleballScore = (teamIndex, pointsChange) => {
    if (!liveMatch) return;
    setMatchHistory(prev => [...prev, JSON.parse(JSON.stringify(liveMatch))]);
    setLiveMatch(prev => {
      const updated = { ...prev };
      const ptsKey = teamIndex === 1 ? 'points1' : 'points2';
      updated[ptsKey] = Math.max(0, updated[ptsKey] + pointsChange);

      const deciderSetIndex = updated.bestOfSets;
      const targetPoints = updated.targetPoints || 11;
      const p1 = updated.points1;
      const p2 = updated.points2;

      if ((p1 >= targetPoints || p2 >= targetPoints) && Math.abs(p1 - p2) >= 2) {
        const setWinner = p1 > p2 ? 1 : 2;
        const setWinnerName = setWinner === 1 ? updated.team1 : updated.team2;

        updated.setScores.push({
          set: updated.currentSet,
          score1: p1,
          score2: p2,
          winner: setWinnerName
        });

        if (setWinner === 1) {
          updated.sets1 += 1;
        } else {
          updated.sets2 += 1;
        }

        updated.points1 = 0;
        updated.points2 = 0;

        const setsNeeded = Math.ceil(updated.bestOfSets / 2);
        if (updated.sets1 >= setsNeeded) {
          updated.isCompleted = true;
          updated.result = `${updated.team1} won the Pickleball match ${updated.sets1} - ${updated.sets2}!`;
        } else if (updated.sets2 >= setsNeeded) {
          updated.isCompleted = true;
          updated.result = `${updated.team2} won the Pickleball match ${updated.sets2} - ${updated.sets1}!`;
        } else {
          updated.currentSet += 1;
        }
      }
      return updated;
    });
  };

  const updateGolfStrokes = (teamIndex, change) => {
    if (!liveMatch) return;
    setMatchHistory(prev => [...prev, JSON.parse(JSON.stringify(liveMatch))]);
    setLiveMatch(prev => {
      const updated = { ...prev };
      const holeIdx = updated.currentHole - 1;
      if (teamIndex === 1) {
        const currentStrokes = updated.strokes1[holeIdx] || 0;
        updated.strokes1[holeIdx] = Math.max(0, currentStrokes + change);
      } else {
        const currentStrokes = updated.strokes2[holeIdx] || 0;
        updated.strokes2[holeIdx] = Math.max(0, currentStrokes + change);
      }
      return updated;
    });
  };

  const changeGolfHole = (direction) => {
    if (!liveMatch) return;
    setLiveMatch(prev => {
      const updated = { ...prev };
      const nextHole = updated.currentHole + direction;
      if (nextHole >= 1 && nextHole <= updated.totalHoles) {
        updated.currentHole = nextHole;
      }
      return updated;
    });
  };

  const updateHockeyScore = (teamIndex, change) => {
    if (!liveMatch) return;
    setMatchHistory(prev => [...prev, JSON.parse(JSON.stringify(liveMatch))]);
    setLiveMatch(prev => {
      const updated = { ...prev };
      const eventTime = "Period " + updated.period + " - " + Math.floor(Math.random() * 20 + 1) + "m";
      const teamName = teamIndex === 1 ? updated.team1 : updated.team2;
      if (teamIndex === 1) {
        updated.goals1 = Math.max(0, updated.goals1 + change);
      } else {
        updated.goals2 = Math.max(0, updated.goals2 + change);
      }
      if (change > 0) {
        updated.events.push({
          time: eventTime,
          type: 'Goal',
          team: teamName,
          detail: 'Goal Scored'
        });
      }
      return updated;
    });
  };

  const updateHockeyStats = (teamIndex, stat, change) => {
    if (!liveMatch) return;
    setMatchHistory(prev => [...prev, JSON.parse(JSON.stringify(liveMatch))]);
    setLiveMatch(prev => {
      const updated = { ...prev };
      const teamKey = teamIndex === 1 ? '1' : '2';
      const teamName = teamIndex === 1 ? updated.team1 : updated.team2;

      if (stat === 'shot') {
        updated[`shots${teamKey}`] = Math.max(0, (updated[`shots${teamKey}`] || 0) + change);
      } else if (stat === 'penalty') {
        updated[`penalties${teamKey}`] = Math.max(0, (updated[`penalties${teamKey}`] || 0) + change);
        if (change > 0) {
          updated.events.push({
            time: "Period " + updated.period,
            type: 'Penalty',
            team: teamName,
            detail: 'Penalty Logged'
          });
        }
      } else if (stat === 'period') {
        updated.period = Math.max(1, Math.min(3, updated.period + change));
      }
      return updated;
    });
  };

  const updateSkatingScore = (teamIndex, category, change) => {
    if (!liveMatch) return;
    setMatchHistory(prev => [...prev, JSON.parse(JSON.stringify(liveMatch))]);
    setLiveMatch(prev => {
      const updated = { ...prev };
      if (teamIndex === 1) {
        if (category === 'technical') {
          updated.technicalScore1 = Math.max(0, Math.min(10.0, parseFloat(((updated.technicalScore1 || 0) + change).toFixed(1))));
        } else {
          updated.artisticScore1 = Math.max(0, Math.min(10.0, parseFloat(((updated.artisticScore1 || 0) + change).toFixed(1))));
        }
        updated.totalScore1 = parseFloat(((updated.technicalScore1 || 0) + (updated.artisticScore1 || 0)).toFixed(2));
      } else {
        if (category === 'technical') {
          updated.technicalScore2 = Math.max(0, Math.min(10.0, parseFloat(((updated.technicalScore2 || 0) + change).toFixed(1))));
        } else {
          updated.artisticScore2 = Math.max(0, Math.min(10.0, parseFloat(((updated.artisticScore2 || 0) + change).toFixed(1))));
        }
        updated.totalScore2 = parseFloat(((updated.technicalScore2 || 0) + (updated.artisticScore2 || 0)).toFixed(2));
      }
      return updated;
    });
  };

  const updateBadmintonScore = (teamIndex, change) => {
    if (!liveMatch) return;
    setMatchHistory(prev => [...prev, JSON.parse(JSON.stringify(liveMatch))]);
    setLiveMatch(prev => {
      const updated = { ...prev };
      const ptsKey = teamIndex === 1 ? 'points1' : 'points2';
      updated[ptsKey] = Math.max(0, updated[ptsKey] + change);

      const target = updated.targetPoints || 21;
      const p1 = updated.points1;
      const p2 = updated.points2;

      // Set is won when reaching 21 with a 2-point margin, or capped at 30
      const isSetOver = (p1 >= target || p2 >= target) && (Math.abs(p1 - p2) >= 2 || p1 === 30 || p2 === 30);

      if (isSetOver) {
        const setWinner = p1 > p2 ? 1 : 2;
        const setWinnerName = setWinner === 1 ? updated.team1 : updated.team2;
        
        updated.setScores.push({
          set: updated.currentSet,
          score1: p1,
          score2: p2,
          winner: setWinnerName
        });

        if (setWinner === 1) {
          updated.sets1 += 1;
        } else {
          updated.sets2 += 1;
        }

        updated.points1 = 0;
        updated.points2 = 0;

        const setsNeeded = Math.ceil(updated.bestOfSets / 2);
        if (updated.sets1 >= setsNeeded) {
          updated.isCompleted = true;
          updated.result = `${updated.team1} won the Badminton match ${updated.sets1} - ${updated.sets2}!`;
        } else if (updated.sets2 >= setsNeeded) {
          updated.isCompleted = true;
          updated.result = `${updated.team2} won the Badminton match ${updated.sets2} - ${updated.sets1}!`;
        } else {
          updated.currentSet += 1;
        }
      }
      return updated;
    });
  };

  const updateTableTennisScore = (teamIndex, change) => {
    if (!liveMatch) return;
    setMatchHistory(prev => [...prev, JSON.parse(JSON.stringify(liveMatch))]);
    setLiveMatch(prev => {
      const updated = { ...prev };
      const ptsKey = teamIndex === 1 ? 'points1' : 'points2';
      updated[ptsKey] = Math.max(0, updated[ptsKey] + change);

      const target = updated.targetPoints || 11;
      const p1 = updated.points1;
      const p2 = updated.points2;

      const isSetOver = (p1 >= target || p2 >= target) && Math.abs(p1 - p2) >= 2;

      if (isSetOver) {
        const setWinner = p1 > p2 ? 1 : 2;
        const setWinnerName = setWinner === 1 ? updated.team1 : updated.team2;
        
        updated.setScores.push({
          set: updated.currentSet,
          score1: p1,
          score2: p2,
          winner: setWinnerName
        });

        if (setWinner === 1) {
          updated.sets1 += 1;
        } else {
          updated.sets2 += 1;
        }

        updated.points1 = 0;
        updated.points2 = 0;

        const setsNeeded = Math.ceil(updated.bestOfSets / 2);
        if (updated.sets1 >= setsNeeded) {
          updated.isCompleted = true;
          updated.result = `${updated.team1} won the Table Tennis match ${updated.sets1} - ${updated.sets2}!`;
        } else if (updated.sets2 >= setsNeeded) {
          updated.isCompleted = true;
          updated.result = `${updated.team2} won the Table Tennis match ${updated.sets2} - ${updated.sets1}!`;
        } else {
          updated.currentSet += 1;
        }
      }
      return updated;
    });
  };

  const updateTennisScore = (teamIndex, change) => {
    if (!liveMatch) return;
    setMatchHistory(prev => [...prev, JSON.parse(JSON.stringify(liveMatch))]);
    setLiveMatch(prev => {
      const updated = { ...prev };
      
      let p1 = updated.points1.toString();
      let p2 = updated.points2.toString();
      
      let gameWinner = 0;
      
      if (teamIndex === 1) {
        if (p1 === '0') p1 = '15';
        else if (p1 === '15') p1 = '30';
        else if (p1 === '30') p1 = '40';
        else if (p1 === '40') {
          if (p2 === '40') p1 = 'Ad';
          else if (p2 === 'Ad') p2 = '40';
          else gameWinner = 1;
        } else if (p1 === 'Ad') {
          gameWinner = 1;
        }
      } else {
        if (p2 === '0') p2 = '15';
        else if (p2 === '15') p2 = '30';
        else if (p2 === '30') p2 = '40';
        else if (p2 === '40') {
          if (p1 === '40') p2 = 'Ad';
          else if (p1 === 'Ad') p1 = '40';
          else gameWinner = 2;
        } else if (p2 === 'Ad') {
          gameWinner = 2;
        }
      }
      
      updated.points1 = p1;
      updated.points2 = p2;
      
      if (gameWinner > 0) {
        updated.points1 = '0';
        updated.points2 = '0';
        
        if (gameWinner === 1) {
          updated.games1 += 1;
        } else {
          updated.games2 += 1;
        }
        
        const g1 = updated.games1;
        const g2 = updated.games2;
        let setWinner = 0;
        
        if (g1 >= 6 && (g1 - g2 >= 2 || (g1 === 7 && g2 === 6))) {
          setWinner = 1;
        } else if (g2 >= 6 && (g2 - g1 >= 2 || (g2 === 7 && g1 === 6))) {
          setWinner = 2;
        }
        
        if (setWinner > 0) {
          updated.setScores.push({
            set: updated.currentSet,
            games1: g1,
            games2: g2,
            winner: setWinner === 1 ? updated.team1 : updated.team2
          });
          
          if (setWinner === 1) {
            updated.sets1 += 1;
          } else {
            updated.sets2 += 1;
          }
          
          updated.games1 = 0;
          updated.games2 = 0;
          
          const setsNeeded = Math.ceil(updated.bestOfSets / 2);
          if (updated.sets1 >= setsNeeded) {
            updated.isCompleted = true;
            updated.result = `${updated.team1} won the Tennis match ${updated.sets1} - ${updated.sets2}!`;
          } else if (updated.sets2 >= setsNeeded) {
            updated.isCompleted = true;
            updated.result = `${updated.team2} won the Tennis match ${updated.sets2} - ${updated.sets1}!`;
          } else {
            updated.currentSet += 1;
          }
        }
      }
      return updated;
    });
  };

  const updateCueMatchScore = (teamIndex, change, isSnooker = true) => {
    if (!liveMatch) return;
    setMatchHistory(prev => [...prev, JSON.parse(JSON.stringify(liveMatch))]);
    setLiveMatch(prev => {
      const updated = { ...prev };
      const ptsKey = teamIndex === 1 ? 'points1' : 'points2';
      updated[ptsKey] = Math.max(0, updated[ptsKey] + change);
      
      if (!isSnooker) {
        // In Pool, points are balls potted (max 8)
        if (updated[ptsKey] >= 8) {
          const frameWinner = teamIndex;
          const frameWinnerName = frameWinner === 1 ? updated.team1 : updated.team2;
          
          updated.frameScores.push({
            frame: updated.currentFrame,
            score1: updated.points1,
            score2: updated.points2,
            winner: frameWinnerName
          });
          
          if (frameWinner === 1) {
            updated.frames1 += 1;
          } else {
            updated.frames2 += 1;
          }
          
          updated.points1 = 0;
          updated.points2 = 0;
          
          const framesNeeded = Math.ceil(updated.bestOfFrames / 2);
          if (updated.frames1 >= framesNeeded) {
            updated.isCompleted = true;
            updated.result = `${updated.team1} won the Pool match ${updated.frames1} - ${updated.frames2}!`;
          } else if (updated.frames2 >= framesNeeded) {
            updated.isCompleted = true;
            updated.result = `${updated.team2} won the Pool match ${updated.frames2} - ${updated.frames1}!`;
          } else {
            updated.currentFrame += 1;
          }
        }
      }
      return updated;
    });
  };

  const endCueFrame = (winnerIndex, isSnooker = true) => {
    if (!liveMatch) return;
    setMatchHistory(prev => [...prev, JSON.parse(JSON.stringify(liveMatch))]);
    setLiveMatch(prev => {
      const updated = { ...prev };
      const frameWinnerName = winnerIndex === 1 ? updated.team1 : updated.team2;
      
      updated.frameScores.push({
        frame: updated.currentFrame,
        score1: updated.points1,
        score2: updated.points2,
        winner: frameWinnerName
      });
      
      if (winnerIndex === 1) {
        updated.frames1 += 1;
      } else {
        updated.frames2 += 1;
      }
      
      updated.points1 = 0;
      updated.points2 = 0;
      
      const framesNeeded = Math.ceil(updated.bestOfFrames / 2);
      if (updated.frames1 >= framesNeeded) {
        updated.isCompleted = true;
        updated.result = `${updated.team1} won the ${isSnooker ? 'Snooker' : 'Pool'} match ${updated.frames1} - ${updated.frames2}!`;
      } else if (updated.frames2 >= framesNeeded) {
        updated.isCompleted = true;
        updated.result = `${updated.team2} won the ${isSnooker ? 'Snooker' : 'Pool'} match ${updated.frames2} - ${updated.frames1}!`;
      } else {
        updated.currentFrame += 1;
      }
      
      return updated;
    });
  };

  const updateGamingScore = (teamIndex, change) => {
    if (!liveMatch) return;
    setMatchHistory(prev => [...prev, JSON.parse(JSON.stringify(liveMatch))]);
    setLiveMatch(prev => {
      const updated = { ...prev };
      const ptsKey = teamIndex === 1 ? 'points1' : 'points2';
      updated[ptsKey] = Math.max(0, updated[ptsKey] + change);
      return updated;
    });
  };

  const winGamingRound = (winnerIndex) => {
    if (!liveMatch) return;
    setMatchHistory(prev => [...prev, JSON.parse(JSON.stringify(liveMatch))]);
    setLiveMatch(prev => {
      const updated = { ...prev };
      const roundWinnerName = winnerIndex === 1 ? updated.team1 : updated.team2;
      
      updated.roundScores.push({
        round: updated.currentRound,
        score1: updated.points1,
        score2: updated.points2,
        winner: roundWinnerName
      });
      
      if (winnerIndex === 1) {
        updated.rounds1 += 1;
      } else {
        updated.rounds2 += 1;
      }
      
      updated.points1 = 0;
      updated.points2 = 0;
      
      const roundsNeeded = Math.ceil(updated.bestOfRounds / 2);
      if (updated.rounds1 >= roundsNeeded) {
        updated.isCompleted = true;
        updated.result = `${updated.team1} won the Gaming match ${updated.rounds1} - ${updated.rounds2}!`;
      } else if (updated.rounds2 >= roundsNeeded) {
        updated.isCompleted = true;
        updated.result = `${updated.team2} won the Gaming match ${updated.rounds2} - ${updated.rounds1}!`;
      } else {
        updated.currentRound += 1;
      }
      
      return updated;
    });
  };

  // Ball event scoring logic
  const logBall = (type, runsValue, wicketType = null, fielderName = null) => {
    if (!liveMatch) return;
    
    // Save to history before modifying
    setMatchHistory(prev => [...prev, JSON.parse(JSON.stringify(liveMatch))]);
    
    setLiveMatch(prev => {
      let tempMatch = JSON.parse(JSON.stringify(prev));
      let isWicket = type === 'W';
      let isExtra = type === 'WD' || type === 'NB';
      let runsScored = runsValue || 0;
      
      // Clear previous over's balls when a new over starts
      if (prev.balls > 0 && prev.balls % 6 === 0 && prev.lastBalls && prev.lastBalls.length >= 6) {
        tempMatch.lastBalls = [];
      }
      
      // Update overall score & balls
      if (type === 'WD') {
        tempMatch.runs += 1;
        tempMatch.extras.wides += 1;
        tempMatch.extras.total += 1;
        tempMatch.lastBalls.push('WD');
      } else if (type === 'NB') {
        tempMatch.runs += (1 + runsScored);
        tempMatch.extras.noBalls += 1;
        tempMatch.extras.total += (1 + runsScored);
        tempMatch.lastBalls.push('NB+' + runsScored);
      } else if (type === 'W') {
        tempMatch.wickets += 1;
        tempMatch.balls += 1;
        tempMatch.lastBalls.push('W');
      } else {
        tempMatch.runs += runsScored;
        tempMatch.balls += 1;
        tempMatch.lastBalls.push(runsScored.toString());
      }

      // Record over history
      if (!tempMatch.oversHistory) {
        tempMatch.oversHistory = [];
      }
      let overNumber = Math.floor(prev.balls / 6) + 1;
      let overIndex = overNumber - 1;
      if (!tempMatch.oversHistory[overIndex]) {
        let activeBowler = tempMatch.bowling.find(b => b.isActive);
        let bowlerName = activeBowler ? activeBowler.name : 'Unknown Bowler';
        tempMatch.oversHistory[overIndex] = {
          overNumber: overNumber,
          bowlerId: activeBowler ? activeBowler.id : null,
          bowlerName: bowlerName,
          balls: [],
          runs: 0,
          wickets: 0
        };
      }
      let ballRep = tempMatch.lastBalls[tempMatch.lastBalls.length - 1];
      let ballRuns = (type === 'WD' ? 1 : (type === 'NB' ? 1 + runsScored : (type === 'W' ? 0 : runsScored)));
      tempMatch.oversHistory[overIndex].balls.push(ballRep);
      tempMatch.oversHistory[overIndex].runs += ballRuns;
      if (type === 'W') {
        tempMatch.oversHistory[overIndex].wickets += 1;
      }

      // Find current active batsman who is striking
      let striker = tempMatch.batting.find(b => b.isStriking && b.isActive);
      let nonStriker = tempMatch.batting.find(b => !b.isStriking && b.isActive);
      
      // Update current batsman stats
      if (striker && !isExtra) {
        striker.balls += 1;
        if (type !== 'W') {
          striker.runs += runsScored;
          if (runsScored === 4) striker.fours += 1;
          if (runsScored === 6) striker.sixes += 1;
        } else {
          striker.isActive = false; // Out!
          
          let bowlerName = 'Bowler';
          let activeBowler = tempMatch.bowling.find(b => b.isActive);
          if (activeBowler) bowlerName = activeBowler.name;
          
          let dismissalStr = 'Out';
          if (wicketType) {
            if (wicketType === 'Bowled') {
              dismissalStr = `Bowled by ${bowlerName}`;
            } else if (wicketType === 'Caught') {
              dismissalStr = fielderName
                ? `Caught by ${fielderName} (bowl: ${bowlerName})`
                : `Caught & Bowled by ${bowlerName}`;
            } else if (wicketType === 'LBW') {
              dismissalStr = `LBW — ${bowlerName}`;
            } else if (wicketType === 'Stumped') {
              dismissalStr = `Stumped — ${bowlerName}`;
            } else if (wicketType === 'Run Out') {
              dismissalStr = fielderName ? `Run Out (${fielderName})` : 'Run Out';
            } else if (wicketType === 'Caught Behind') {
              dismissalStr = fielderName
                ? `Caught Behind by ${fielderName} (bowl: ${bowlerName})`
                : `Caught Behind — ${bowlerName}`;
            }
          }
          striker.dismissal = dismissalStr;

          // Fall of wicket
          let ov = Math.floor(tempMatch.balls / 6) + '.' + (tempMatch.balls % 6);
          tempMatch.fallOfWickets.push({
            score: tempMatch.runs.toString(),
            overs: ov,
            batter: striker.name,
            howOut: dismissalStr
          });
          
          // Bring in next batsman if available
          let nextBat = tempMatch.batting.find(b => !b.isActive && !b.dismissal && b.id !== striker.id && b.id !== nonStriker?.id);
          if (nextBat) {
            nextBat.isActive = true;
            nextBat.isStriking = true;
          } else if (nonStriker) {
            nonStriker.isStriking = true;
          }
        }
      }

      // Single/Three run switches strike
      if ((runsScored === 1 || runsScored === 3) && !isWicket && striker && nonStriker) {
        striker.isStriking = false;
        nonStriker.isStriking = true;
      }

      // Update current bowler stats
      let bowler = tempMatch.bowling.find(b => b.isActive);
      if (bowler) {
        if (!isExtra) {
          let balls = parseInt(bowler.overs.split('.')[1]) || 0;
          let overs = Math.floor(parseInt(bowler.overs.split('.')[0]));
          balls += 1;
          if (balls === 6) {
            overs += 1;
            balls = 0;
          }
          bowler.overs = overs + '.' + balls;
        }
        
        if (type === 'WD') {
          bowler.runs += 1;
        } else if (type === 'NB') {
          bowler.runs += (1 + runsScored);
        } else if (type === 'W') {
          if (wicketType !== 'Run Out') {
            bowler.wickets += 1;
          }
        } else {
          bowler.runs += runsScored;
        }
        
        let oFloat = parseFloat(bowler.overs) || 0.1;
        let oVal = Math.floor(oFloat) + (oFloat % 1) * (10/6);
        bowler.economy = (bowler.runs / (oVal || 1)).toFixed(1);
      }

      // Re-calculate partnership
      if (type !== 'W') {
        tempMatch.partnership.runs += (isExtra ? 1 : runsScored);
        if (!isExtra) tempMatch.partnership.balls += 1;
      } else {
        tempMatch.partnership = { runs: 0, balls: 0, batter1: nonStriker ? nonStriker.name : 'TBD', batter2: 'New Batter' };
      }

      // Current Run Rate
      let oversElapsed = (tempMatch.balls / 6) || 0.1;
      tempMatch.crr = (tempMatch.runs / oversElapsed).toFixed(2);

      // Rotate strike at the end of the over (if valid ball completed the over)
      if (!isExtra && tempMatch.balls > 0 && tempMatch.balls % 6 === 0) {
        let activeStriker = tempMatch.batting.find(b => b.isStriking && b.isActive);
        let activeNonStriker = tempMatch.batting.find(b => !b.isStriking && b.isActive);
        if (activeStriker && activeNonStriker) {
          activeStriker.isStriking = false;
          activeNonStriker.isStriking = true;
        }
        
        // Deactivate active bowler at end of over to prompt scorer for selection
        tempMatch.bowling = tempMatch.bowling.map(b => ({ ...b, isActive: false }));
      }

      // Check if 1st innings finishes
      // battingTeamAllOut triggers only when NO active batsmen remain
      // (a single last batsman can still bat alone)
      if (tempMatch.innings === 1) {
        let activeCount = tempMatch.batting.filter(b => b.isActive).length;
        let battingTeamAllOut = activeCount === 0;
        let oversCompleted = tempMatch.balls >= tempMatch.maxOvers * 6;
        if (battingTeamAllOut || oversCompleted) {
          tempMatch.firstInningsCompleted = true;
        }
      }

      // Check if 2nd innings finishes
      // battingTeamAllOut triggers only when NO active batsmen remain
      // (a single last batsman can still bat alone)
      if (tempMatch.innings === 2) {
        let activeCount = tempMatch.batting.filter(b => b.isActive).length;
        let battingTeamAllOut = activeCount === 0;
        let oversCompleted = tempMatch.balls >= tempMatch.maxOvers * 6;
        
        if (tempMatch.runs >= tempMatch.target) {
          tempMatch.isCompleted = true;
          let wicketsLeft = tempMatch.batting.filter(b => b.isActive).length;
          tempMatch.result = `${tempMatch.team2} won by ${wicketsLeft} wickets!`;
        } else if (battingTeamAllOut || oversCompleted) {
          tempMatch.isCompleted = true;
          if (tempMatch.runs === tempMatch.firstInningsScore) {
            tempMatch.result = `Match Tied!`;
          } else {
            let runsDiff = tempMatch.firstInningsScore - tempMatch.runs;
            tempMatch.result = `${tempMatch.team1} won by ${runsDiff} runs!`;
          }
        }
      }

      return tempMatch;
    });
  };

  // Undo last ball using state history
  const undoLastBall = () => {
    if (matchHistory.length === 0) return;
    setLiveMatch(prev => {
      const prevHistory = [...matchHistory];
      const previousState = prevHistory.pop();
      setMatchHistory(prevHistory);
      return previousState;
    });
  };

  // Start the 2nd Innings
  const endFirstInnings = () => {
    if (!liveMatch || liveMatch.innings !== 1) return;
    
    // Save to history before modifying
    setMatchHistory(prev => [...prev, JSON.parse(JSON.stringify(liveMatch))]);
    
    setLiveMatch(prev => {
      const t1Id = prev.team1Id;
      const t2Id = prev.team2Id;
      const t1 = teams.find(t => t.id === t1Id);
      const t2 = teams.find(t => t.id === t2Id);
      
      if (!t1 || !t2) return prev;

      const firstInningsRuns = prev.runs;
      const firstInningsWickets = prev.wickets;
      const firstInningsBalls = prev.balls;
      const firstInningsBatting = prev.batting;
      const firstInningsBowling = prev.bowling;
      const target = firstInningsRuns + 1;

      // Swap roles: team2 bats, team1 bowls
      const battingList = t2.players.map((p, idx) => ({
        id: p.id,
        name: p.name,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isActive: idx < 2,
        isStriking: idx === 0
      }));

      const bowlingList = t1.players.map(p => ({
        id: p.id,
        name: p.name,
        overs: '0.0',
        maidens: 0,
        runs: 0,
        wickets: 0,
        economy: '0.0',
        isActive: false
      }));

      if (bowlingList.length > 0) {
        bowlingList[0].isActive = true;
      }

      return {
        ...prev,
        innings: 2,
        target: target,
        firstInningsScore: firstInningsRuns,
        firstInningsWickets: firstInningsWickets,
        firstInningsBalls: firstInningsBalls,
        firstInningsBatting: firstInningsBatting,
        firstInningsBowling: firstInningsBowling,
        firstInningsFallOfWickets: prev.fallOfWickets || [],
        firstInningsOversHistory: prev.oversHistory || [],
        firstInningsExtras: prev.extras || { wides: 0, noBalls: 0, legByes: 0, byes: 0, total: 0 },
        firstInningsCompleted: false,
        runs: 0,
        wickets: 0,
        balls: 0,
        lastBalls: [],
        oversHistory: [],
        batting: battingList,
        bowling: bowlingList,
        extras: { wides: 0, noBalls: 0, legByes: 0, byes: 0, total: 0 },
        fallOfWickets: [],
        partnership: { runs: 0, balls: 0, batter1: battingList[0]?.name || 'Batter 1', batter2: battingList[1]?.name || 'Batter 2' }
      };
    });
  };

  // Booking slots & loyalty (supports multi-hour arrays)
  const bookSlot = (venueId, date, timeSlots, price, discountApplied, customerName, customVenueName) => {
    const finalPrice = discountApplied ? price - 250 : price;
    const cName = customerName || userName;
    
    // Support single timeSlot strings or arrays of strings
    const slotsArray = Array.isArray(timeSlots) ? timeSlots : [timeSlots];
    const pricePerSlot = Math.round(finalPrice / slotsArray.length);

    const newBookings = slotsArray.map(slot => ({
      id: 'book-' + Math.floor(Math.random() * 10000),
      venueId,
      venueName: customVenueName || (venues.find(v => v.id === venueId)?.name || 'Venue'),
      date,
      timeSlot: slot,
      duration: '1 Hour',
      amountPaid: pricePerSlot,
      status: 'CONFIRMED',
      customerName: cName
    }));

    setBookings(prev => [...newBookings, ...prev]);

    // Send to MySQL DB
    authFetch('http://localhost:3001/api/bookings', {
      method: 'POST',
      body: JSON.stringify(newBookings)
    }).catch(e => console.error("Bookings save failed:", e.message));

    setLoyaltyVisits(prev => {
      const current = prev[venueId] || 0;
      const nextCount = current + slotsArray.length;
      const finalCount = nextCount >= 7 ? 0 : nextCount;

      // Save to MySQL DB
      authFetch('http://localhost:3001/api/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venueId, visitCount: finalCount })
      }).catch(e => console.error("Loyalty save failed:", e.message));

      return {
        ...prev,
        [venueId]: finalCount
      };
    });

    setVenues(prev => {
      return prev.map(v => {
        if (v.id === venueId) {
          return {
            ...v,
            timeSlots: v.timeSlots.map(slot => {
              if (slotsArray.includes(slot.time)) {
                return { ...slot, status: 'booked', bookedBy: cName };
              }
              return slot;
            })
          };
        }
        return v;
      });
    });
  };

  const cancelBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Only allow players to cancel their own bookings
    if (userRole === 'viewer' && booking.customerName !== userName) {
      showError('Authorization Error', 'You can only cancel bookings that you have booked.');
      return;
    }

    setBookings(prev => prev.filter(b => b.id !== bookingId));

    // Send to MySQL DB
    authFetch(`http://localhost:3001/api/bookings/${bookingId}`, {
      method: 'DELETE'
    }).catch(e => console.error("Booking cancellation failed:", e.message));

    // Release slot status
    setVenues(prev => {
      return prev.map(v => {
        if (v.id === booking.venueId) {
          return {
            ...v,
            timeSlots: v.timeSlots.map(slot => {
              if (slot.time === booking.timeSlot) {
                return { ...slot, status: 'available', bookedBy: null };
              }
              return slot;
            })
          };
        }
        return v;
      });
    });
  };

  // Tournament creation
  const addTournament = (newTour) => {
    const maxTeamsNum = parseInt(newTour.maxTeams) || 8;
    const entryFeeNum = parseInt(newTour.entryFee) || 0;
    
    const settings = {
      maxTeams: maxTeamsNum,
      maxPlayers: parseInt(newTour.maxPlayers) || 11,
      registrationType: newTour.registrationType || 'contact',
      entryFee: entryFeeNum,
      contactPhone: newTour.contactPhone || '',
      instagramUrl: newTour.instagramUrl || '',
      termsText: newTour.termsText || 'By registering, you agree to comply with all tournament rules, safety policies, and decisions of the organizers. Players must play in a sportsmanlike manner. Entry fees are non-refundable.',
      teamsRegistered: [],
      format: newTour.format || 'Knockout',
      overs: parseInt(newTour.overs) || 8
    };
    
    let initialBracket = {
      octafinals: [],
      quarterFinals: [],
      semiFinals: [],
      final: { id: 'f-1', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' }
    };
    
    if (maxTeamsNum === 16) {
      initialBracket.octafinals = [
        { id: 'o-1', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
        { id: 'o-2', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
        { id: 'o-3', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
        { id: 'o-4', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
        { id: 'o-5', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
        { id: 'o-6', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
        { id: 'o-7', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
        { id: 'o-8', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
      ];
      initialBracket.quarterFinals = [
        { id: 'q-1', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
        { id: 'q-2', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
        { id: 'q-3', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
        { id: 'q-4', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
      ];
      initialBracket.semiFinals = [
        { id: 's-1', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
        { id: 's-2', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
      ];
    } else if (maxTeamsNum === 8) {
      initialBracket.quarterFinals = [
        { id: 'q-1', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
        { id: 'q-2', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
        { id: 'q-3', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
        { id: 'q-4', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
      ];
      initialBracket.semiFinals = [
        { id: 's-1', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
        { id: 's-2', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
      ];
    } else if (maxTeamsNum === 4) {
      initialBracket.semiFinals = [
        { id: 's-1', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
        { id: 's-2', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
      ];
    }
    
    const freshTournament = {
      id: 'tour-' + Math.floor(Math.random() * 10000),
      name: newTour.name,
      sport: newTour.sport || 'Box Cricket',
      date: newTour.date || new Date().toLocaleDateString(),
      format: newTour.format || 'Knockout',
      overs: parseInt(newTour.overs) || 8,
      standings: [],
      bracket: {
        ...initialBracket,
        settings,
        history: [
          { timestamp: new Date().toLocaleString(), text: `Tournament "${newTour.name}" launched by Venue Owner.` }
        ]
      }
    };
    
    setTournaments(prev => [freshTournament, ...prev]);

    // Send to MySQL DB
    authFetch('http://localhost:3001/api/tournaments', {
      method: 'POST',
      body: JSON.stringify(freshTournament)
    }).catch(e => console.error("Tournament save failed:", e.message));

    return freshTournament;
  };

  const updateTournament = (updatedTour) => {
    setTournaments(prev => prev.map(t => t.id === updatedTour.id ? updatedTour : t));
    
    authFetch('http://localhost:3001/api/tournaments', {
      method: 'POST',
      body: JSON.stringify(updatedTour)
    }).catch(e => console.error("Tournament update failed:", e.message));
  };

  const deleteTournament = (tourId) => {
    setTournaments(prev => prev.filter(t => t.id !== tourId));
    
    authFetch(`http://localhost:3001/api/tournaments/${tourId}`, {
      method: 'DELETE'
    }).catch(e => console.error("Tournament delete failed:", e.message));
  };

  // Add team
  const addTeam = (teamName, captainName, sport) => {
    const newTeam = {
      id: 'team-' + Math.floor(Math.random() * 10000),
      name: teamName.toUpperCase(),
      captain: captainName,
      sport: sport || 'Box Cricket',
      creatorId: playerId || localStorage.getItem('bcp_player_id') || 'BCP-PL-0000',
      players: []
    };
    setTeams(prev => [...prev, newTeam]);

    // Send to MySQL DB
    authFetch('http://localhost:3001/api/teams', {
      method: 'POST',
      body: JSON.stringify(newTeam)
    }).catch(e => console.error("Team save failed:", e.message));
  };

  // Update team
  const updateTeam = (teamId, updatedData) => {
    setTeams(prev => {
      return prev.map(t => {
        if (t.id === teamId) {
          return {
            ...t,
            ...updatedData,
            name: updatedData.name ? updatedData.name.toUpperCase() : t.name
          };
        }
        return t;
      });
    });

    // Send PUT request to MySQL DB
    authFetch(`http://localhost:3001/api/teams/${teamId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData)
    }).catch(e => console.error("Team update failed:", e.message));
  };

  // Add player to team
  const addPlayerToTeam = (teamId, player) => {
    const newPlayer = {
      id: 'p-' + Math.floor(Math.random() * 1000),
      matches: 0, runs: 0, avg: 0.0, sr: 0.0, high: '0', fifties: 0, fours: 0, sixes: 0, wickets: 0, eco: 0.0, best: '-',
      ...player
    };

    setTeams(prev => {
      return prev.map(t => {
        if (t.id === teamId) {
          return {
            ...t,
            players: [...t.players, newPlayer]
          };
        }
        return t;
      });
    });

    // Send to MySQL DB
    authFetch(`http://localhost:3001/api/teams/${teamId}/players`, {
      method: 'POST',
      body: JSON.stringify(newPlayer)
    }).catch(e => console.error("Player save failed:", e.message));
  };

  // Edit player in team
  const editPlayerInTeam = (teamId, playerId, updatedPlayer) => {
    setTeams(prev => {
      return prev.map(t => {
        if (t.id === teamId) {
          return {
            ...t,
            players: t.players.map(p => p.id === playerId ? { ...p, ...updatedPlayer } : p)
          };
        }
        return t;
      });
    });

    authFetch(`http://localhost:3001/api/players/${playerId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedPlayer)
    }).catch(e => console.error("Player update failed:", e.message));
  };

  // Delete player from team
  const deletePlayerFromTeam = (teamId, playerId) => {
    setTeams(prev => {
      return prev.map(t => {
        if (t.id === teamId) {
          return {
            ...t,
            players: t.players.filter(p => p.id !== playerId)
          };
        }
        return t;
      });
    });

    authFetch(`http://localhost:3001/api/players/${playerId}`, {
      method: 'DELETE'
    }).catch(e => console.error("Player delete failed:", e.message));
  };

  return (
    <AppStateContext.Provider value={{
      currentScreen, setCurrentScreen,
      isDataLoading,
      onboardingViewMode, setOnboardingViewMode,
      userRole, setUserRole,
      userName, setUserName,
      userEmail, setUserEmail,
      userPhone, setUserPhone,
      playerId, setPlayerId,
      matchesPlayedCount, setMatchesPlayedCount,
      completedMatches, saveCompletedMatch,
      selectedCompletedMatch, setSelectedCompletedMatch,
      permissions, setPermissions,
      loyaltyVisits, setLoyaltyVisits,
      bookings, setBookings, bookSlot, cancelBooking,
      venues, setVenues, registerVenue, deleteVenue, addVenueReview, updateVenue,
      selectedVenueId, setSelectedVenueId,
      liveMatch, setLiveMatch, logBall, undoLastBall, createNewMatch,
      updateFootballScore, updateFootballStats, updateVolleyballScore, updateBasketballScore, updateBasketballStats,
      updatePickleballScore, updateGolfStrokes, changeGolfHole, updateHockeyScore, updateHockeyStats, updateSkatingScore,
      updateBadmintonScore, updateTableTennisScore, updateTennisScore, updateCueMatchScore, endCueFrame, updateGamingScore, winGamingRound,
      tournaments, addTournament, updateTournament, deleteTournament,
      teams, addTeam, updateTeam, addPlayerToTeam, editPlayerInTeam, deletePlayerFromTeam,
      endFirstInnings, matchHistory,
      modalState, setModalState, showAlert, showError, showConfirm, showPrompt,
      authToken, setAuthToken, apiKey, setApiKey, authFetch,
      signupUser, loginUser, logoutUser, checkUsernameUnique, updateUsernameOnBackend, updatePhoneOnBackend, updateProfileOnBackend,
      playerSpecialty, setPlayerSpecialty, updateSpecialtyOnBackend,
      playerSportsInterests, setPlayerSportsInterests, updateSportsInterestsOnBackend,
      playerSpecialties, setPlayerSpecialties, updateSpecialtiesOnBackend,
      selectedSportFilter, setSelectedSportFilter,
      paymentStatus, setPaymentStatus, subscriptionExpiry, setSubscriptionExpiry, subscriptionPlan, setSubscriptionPlan, loadData,
      showPayModal, setShowPayModal,
      isDrawerOpen, setIsDrawerOpen,
      selectedTournamentId, setSelectedTournamentId,
      selectedRegion, setSelectedRegion,
      gpsStatus, setGpsStatus, gpsCoords, setGpsCoords, requestGpsLocation,
      allLiveMatches, setAllLiveMatches, selectedLiveMatch, setSelectedLiveMatch
    }}>
      {children}
    </AppStateContext.Provider>
  );
};
