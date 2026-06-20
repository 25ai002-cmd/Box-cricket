// Using global fetch

async function run() {
  const apiKey = 'BCP-KEY-47b01a097cb459db8ef5282dd6c45d49';
  const url = 'http://localhost:3001/api/venues';
  
  // Generate a large payload (e.g. 150KB base64 string) to trigger the 100kb limit
  const base64Str = 'data:image/png;base64,' + 'A'.repeat(150000);
  
  const payload = {
    id: 'venue-test-onboarding',
    ownerId: 'BCP-PL-1532',
    name: 'Pitstop Test Arena',
    address: '123 Test Lane, City',
    phone: '9876543210',
    caretakerPhone: '9876543211',
    pricePerHour: 150,
    advancePercent: 20,
    terms: 'Test terms',
    images: [base64Str],
    upiId: 'test@upi',
    sport: 'Gaming',
    sports: ['Gaming'],
    gamingDetails: {
      ps5Count: 2,
      ps4Count: 1,
      pcCount: 2,
      availableGames: 'WWE 2026, Mortal Kombat',
      ps5SinglePrice: 100,
      ps5MultiPrice: 200,
      ps4SinglePrice: 100,
      ps4MultiPrice: 200,
      pcSinglePrice: 100,
      pcMultiPrice: 100
    }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(payload)
    });
    
    console.log("Status Code:", res.status);
    const text = await res.text();
    console.log("Response text:", text.slice(0, 500));
  } catch (error) {
    console.error("Fetch failed:", error.message);
  }
}

run();
