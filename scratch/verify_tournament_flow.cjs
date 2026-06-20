const fs = require('fs');
const path = require('path');

// Helper to copy local function generateKnockoutBracket logic for our API client simulation
const generateKnockoutBracket = (teams, maxTeams = 4) => {
  const bracketTeams = [...teams];
  while (bracketTeams.length < maxTeams) {
    bracketTeams.push({ teamName: 'BYE' });
  }

  const checkBye = (t1, t2) => {
    if (t2 === 'BYE') return t1;
    if (t1 === 'BYE') return t2;
    return '';
  };

  if (maxTeams === 4) {
    const semiFinals = [
      { id: 's-1', team1: bracketTeams[0].teamName, team2: bracketTeams[1].teamName, score1: '', score2: '', winner: checkBye(bracketTeams[0].teamName, bracketTeams[1].teamName) },
      { id: 's-2', team1: bracketTeams[2].teamName, team2: bracketTeams[3].teamName, score1: '', score2: '', winner: checkBye(bracketTeams[2].teamName, bracketTeams[3].teamName) },
    ];
    const final = { id: 'f-1', team1: semiFinals[0].winner || 'TBD', team2: semiFinals[1].winner || 'TBD', score1: '', score2: '', winner: '' };
    return { octafinals: [], quarterFinals: [], semiFinals, final };
  }
  return { octafinals: [], quarterFinals: [], semiFinals: [], final: { id: 'f-1', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' } };
};

const updateMatchInBracket = (bracket, matchId, score1, score2, winner, overs1 = '', overs2 = '', allOut1 = false, allOut2 = false) => {
  const updated = { ...bracket };
  let found = false;

  if (updated.semiFinals) {
    updated.semiFinals = updated.semiFinals.map(m => {
      if (m.id === matchId) {
        found = true;
        return { ...m, score1, score2, winner, overs1, overs2, allOut1, allOut2 };
      }
      return m;
    });
  }
  
  if (!found && updated.final && updated.final.id === matchId) {
    updated.final = { ...updated.final, score1, score2, winner, overs1, overs2, allOut1, allOut2 };
  }
  
  // Propagate winners
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
      const score1 = parseInt(m.score1) || 0;
      const score2 = parseInt(m.score2) || 0;
      
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
        
        stats[t1].totalRunsScored += score1;
        stats[t1].totalBallsFaced += ballsFacedT1;
        stats[t1].totalRunsConceded += score2;
        stats[t1].totalBallsBowled += ballsFacedT2;
        
        stats[t2].totalRunsScored += score2;
        stats[t2].totalBallsFaced += ballsFacedT2;
        stats[t2].totalRunsConceded += score1;
        stats[t2].totalBallsBowled += ballsFacedT1;
      }
    }
  });
  
  return Object.values(stats).map(item => {
    const decimalOversFaced = item.totalBallsFaced / 6;
    const decimalOversBowled = item.totalBallsBowled / 6;
    
    const runRateScored = decimalOversFaced > 0 ? (item.totalRunsScored / decimalOversFaced) : 0;
    const runRateConceded = decimalOversBowled > 0 ? (item.totalRunsConceded / decimalOversBowled) : 0;
    
    const nrrVal = runRateScored - runRateConceded;
    
    return {
      team: item.teamName,
      played: item.played,
      won: item.won,
      lost: item.lost,
      nr: item.nr,
      points: item.points,
      nrr: nrrVal.toFixed(3)
    };
  }).sort((a, b) => b.points - a.points || parseFloat(b.nrr) - parseFloat(a.nrr));
};

async function main() {
  const email = 'testadmin@gmail.com';
  const password = 'Password123';
  
  try {
    console.log("=== 1. Logging in to acquire Token ===");
    let res = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrPhone: email, password })
    });
    let loginData = await res.json();
    if (!loginData.token) {
      throw new Error("Login failed - check if verify_signup ran first.");
    }
    const token = loginData.token;
    console.log("Acquired token successfully.");

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    console.log("\n=== 2. Creating Box Cricket Tournament (4 teams, open, 8 overs) ===");
    const tourId = 'tour-automated-test';
    const tournamentPayload = {
      id: tourId,
      name: "Box Cricket Test Super Cup",
      sport: "Box Cricket",
      date: new Date().toLocaleDateString(),
      format: "Knockout",
      overs: 8,
      standings: [],
      bracket: {
        octafinals: [],
        quarterFinals: [],
        semiFinals: [
          { id: 's-1', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
          { id: 's-2', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' }
        ],
        final: { id: 'f-1', team1: 'TBD', team2: 'TBD', score1: '', score2: '', winner: '' },
        settings: {
          maxTeams: 4,
          maxPlayers: 3,
          registrationType: 'open',
          entryFee: 1000,
          contactPhone: '9876543210',
          instagramUrl: '',
          termsText: 'By registering, you agree to terms.',
          teamsRegistered: [],
          format: "Knockout",
          overs: 8
        },
        history: [
          { timestamp: new Date().toLocaleString(), text: "Tournament launched." }
        ]
      }
    };

    res = await fetch('http://localhost:3001/api/tournaments', {
      method: 'POST',
      headers,
      body: JSON.stringify(tournamentPayload)
    });
    console.log("Create tournament response status:", res.status);

    let tournament = tournamentPayload;

    console.log("\n=== 3. Registering 4 Teams in succession ===");
    const teamsToRegister = [
      { name: "TEAM RED", captain: "Alice", players: ["Alice", "Bob", "Charlie"] },
      { name: "TEAM BLUE", captain: "David", players: ["David", "Eva", "Frank"] },
      { name: "TEAM GREEN", captain: "Grace", players: ["Grace", "Harry", "Ian"] },
      { name: "TEAM YELLOW", captain: "Jack", players: ["Jack", "Kelly", "Leo"] }
    ];

    for (let i = 0; i < teamsToRegister.length; i++) {
      const reg = teamsToRegister[i];
      const newRegisteredTeam = {
        teamName: reg.name,
        captainName: reg.captain,
        captainPhone: "987654000" + i,
        players: reg.players,
        registeredAt: new Date().toLocaleString(),
        paymentStatus: 'paid',
        paymentReference: 'TXN-AUTOMATED-' + i
      };

      console.log(`Registering team: ${reg.name}...`);
      const settings = tournament.bracket.settings;
      const updatedTeamsRegistered = [...(settings.teamsRegistered || []), newRegisteredTeam];
      let updatedBracket = { ...tournament.bracket };
      let bracketHistoryText = `Team "${reg.name}" registered successfully.`;
      const maxTeams = settings.maxTeams || 4;

      if (updatedTeamsRegistered.length === maxTeams) {
        console.log(`Capacity reached (${maxTeams}/${maxTeams}). Auto generating knockout bracket!`);
        const autoBracket = generateKnockoutBracket(updatedTeamsRegistered, maxTeams);
        updatedBracket = {
          ...updatedBracket,
          ...autoBracket
        };
        bracketHistoryText += ` Max teams count reached (${maxTeams}/${maxTeams}). Knockout brackets generated automatically!`;
      }

      tournament = {
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

      res = await fetch('http://localhost:3001/api/tournaments', {
        method: 'POST',
        headers,
        body: JSON.stringify(tournament)
      });
      if (!res.ok) {
        throw new Error("Failed to update tournament after registering team " + reg.name);
      }
    }

    console.log("\n=== 4. Verifying bracket generation ===");
    res = await fetch('http://localhost:3001/api/tournaments', { headers });
    const allTours = await res.json();
    const fetchedTour = allTours.find(t => t.id === tourId);
    console.log("Semifinals generated matchups:");
    console.log(JSON.stringify(fetchedTour.bracket.semiFinals, null, 2));

    if (fetchedTour.bracket.semiFinals[0].team1 !== 'TEAM RED' || fetchedTour.bracket.semiFinals[1].team2 !== 'TEAM YELLOW') {
      throw new Error("Incorrect bracket generation matchups!");
    }
    console.log("✅ Matchups generated correctly: Match 1: TEAM RED vs TEAM BLUE, Match 2: TEAM GREEN vs TEAM YELLOW.");

    console.log("\n=== 5. Scoring Semifinal 1 (TEAM RED vs TEAM BLUE) -> TEAM RED wins ===");
    // TEAM RED: 120 runs in 8 overs (allOut = false)
    // TEAM BLUE: 80 runs all out in 6.2 overs (allOut = true)
    let updatedBracket = updateMatchInBracket(fetchedTour.bracket, 's-1', '120', '80', 'TEAM RED', '8', '6.2', false, true);
    let tournamentUpdates = {
      ...fetchedTour,
      bracket: {
        ...updatedBracket,
        history: [
          ...(updatedBracket.history || []),
          { timestamp: new Date().toLocaleString(), text: "Semifinal 1: TEAM RED (120/0 in 8 ov) beat TEAM BLUE (80/10 in 6.2 ov). TEAM RED advances to Finals." }
        ]
      }
    };

    res = await fetch('http://localhost:3001/api/tournaments', {
      method: 'POST',
      headers,
      body: JSON.stringify(tournamentUpdates)
    });

    console.log("\n=== 6. Scoring Semifinal 2 (TEAM GREEN vs TEAM YELLOW) -> TEAM GREEN wins ===");
    // TEAM GREEN: 100 runs in 8 overs (allOut = false)
    // TEAM YELLOW: 90 runs in 7.3 overs (allOut = false)
    res = await fetch('http://localhost:3001/api/tournaments', { headers });
    let latestTour = (await res.json()).find(t => t.id === tourId);
    updatedBracket = updateMatchInBracket(latestTour.bracket, 's-2', '100', '90', 'TEAM GREEN', '8', '7.3', false, false);
    tournamentUpdates = {
      ...latestTour,
      bracket: {
        ...updatedBracket,
        history: [
          ...(updatedBracket.history || []),
          { timestamp: new Date().toLocaleString(), text: "Semifinal 2: TEAM GREEN (100/0 in 8 ov) beat TEAM YELLOW (90/0 in 7.3 ov). TEAM GREEN advances to Finals." }
        ]
      }
    };

    res = await fetch('http://localhost:3001/api/tournaments', {
      method: 'POST',
      headers,
      body: JSON.stringify(tournamentUpdates)
    });

    console.log("\n=== 7. Verifying Finals Propagation ===");
    res = await fetch('http://localhost:3001/api/tournaments', { headers });
    latestTour = (await res.json()).find(t => t.id === tourId);
    console.log("Finals Matchup:", latestTour.bracket.final);
    if (latestTour.bracket.final.team1 !== 'TEAM RED' || latestTour.bracket.final.team2 !== 'TEAM GREEN') {
      throw new Error("Finals propagation failed!");
    }
    console.log("✅ Finals propagation successfully verified: TEAM RED vs TEAM GREEN.");

    console.log("\n=== 8. Scoring Finals (TEAM RED vs TEAM GREEN) -> TEAM RED wins ===");
    // TEAM RED: 60 runs in 8 overs (allOut = false)
    // TEAM GREEN: 58 runs in 8 overs (allOut = false)
    updatedBracket = updateMatchInBracket(latestTour.bracket, 'f-1', '60', '58', 'TEAM RED', '8', '8', false, false);
    tournamentUpdates = {
      ...latestTour,
      bracket: {
        ...updatedBracket,
        history: [
          ...(updatedBracket.history || []),
          { timestamp: new Date().toLocaleString(), text: "Finals: TEAM RED (60/0 in 8 ov) beat TEAM GREEN (58/0 in 8 ov). TEAM RED crowned Box Cricket Test Super Cup Champions! 🏆" }
        ]
      }
    };

    res = await fetch('http://localhost:3001/api/tournaments', {
      method: 'POST',
      headers,
      body: JSON.stringify(tournamentUpdates)
    });

    console.log("\n=== 9. Verifying Standings Table & Champions Announcement ===");
    res = await fetch('http://localhost:3001/api/tournaments', { headers });
    latestTour = (await res.json()).find(t => t.id === tourId);
    console.log("Final Winner / Champion:", latestTour.bracket.final.winner);
    if (latestTour.bracket.final.winner !== 'TEAM RED') {
      throw new Error("Champion is not TEAM RED!");
    }
    
    const finalStandings = generateStandings(latestTour.bracket.settings.teamsRegistered, latestTour.bracket);
    console.log("Points Standings (Dynamic Calculation):");
    console.log(finalStandings);

    // Let's assert the NRR calculations for TEAM RED
    // TEAM RED:
    // Matches played = 2 (s-1, f-1)
    // Runs Scored = 120 + 60 = 180
    // Balls Faced: s-1: 8 overs (48 balls), f-1: 8 overs (48 balls). Total = 96 balls = 16.0 overs faced.
    // Runs Conceded = 80 + 58 = 138
    // Balls Bowled: s-1: opponent allOut, so taken as 8 overs (48 balls), f-1: 8 overs (48 balls). Total = 96 balls = 16.0 overs bowled.
    // NRR = (180 / 16.0) - (138 / 16.0) = 11.250 - 8.625 = +2.625
    
    // TEAM GREEN:
    // Matches played = 2 (s-2, f-1)
    // Runs Scored = 100 + 58 = 158
    // Balls Faced: s-2: 8 overs (48 balls), f-1: 8 overs (48 balls). Total = 96 balls = 16.0 overs faced.
    // Runs Conceded = 90 + 60 = 150
    // Balls Bowled: s-2: 7.3 overs = 7.5 overs (45 balls), f-1: 8 overs (48 balls). Total = 93 balls = 15.5 overs bowled.
    // NRR = (158 / 16.0) - (150 / 15.5) = 9.875 - 9.6774 = +0.198 (approx)
    
    console.log("\nAssertions:");
    const redStanding = finalStandings.find(t => t.team === 'TEAM RED');
    const greenStanding = finalStandings.find(t => t.team === 'TEAM GREEN');
    
    console.log("TEAM RED NRR expected: 2.625, actual:", redStanding.nrr);
    console.log("TEAM GREEN NRR expected: 0.198, actual:", greenStanding.nrr);
    
    if (redStanding.nrr !== '2.625') {
      throw new Error(`Assert failed for TEAM RED NRR: expected 2.625, got ${redStanding.nrr}`);
    }
    if (parseFloat(greenStanding.nrr) < 0.19 || parseFloat(greenStanding.nrr) > 0.20) {
      throw new Error(`Assert failed for TEAM GREEN NRR: expected ~0.198, got ${greenStanding.nrr}`);
    }
    
    console.log("✅ ALL STANDINGS AND NRR ASSERTIONS VERIFIED SUCCESSFULLY MATCHING IPL RULES!");

  } catch (err) {
    console.error("❌ Verification failed:", err);
  }
}

main();
