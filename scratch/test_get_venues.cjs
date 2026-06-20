// Test GET /api/venues endpoint
async function run() {
  const url = 'http://localhost:3001/api/venues';
  const apiKey = 'BCP-KEY-47b01a097cb459db8ef5282dd6c45d49';

  try {
    const res = await fetch(url, {
      headers: {
        'x-api-key': apiKey
      }
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Returned Venues:");
    data.forEach(v => {
      console.log(`- ID: ${v.id}, Name: ${v.name}, OwnerId: ${v.ownerId}, Sport: ${v.sport}, Sports: ${JSON.stringify(v.sports)}`);
    });
  } catch (error) {
    console.error("Error fetching venues:", error.message);
  }
}
run();
