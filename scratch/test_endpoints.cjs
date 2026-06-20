async function run() {
  try {
    console.log("Testing POST /api/auth/direct-google with valid gmail...");
    let res = await fetch('http://localhost:3001/api/auth/direct-google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'yakshbarot597@gmail.com', role: 'viewer' })
    });
    console.log("Status:", res.status);
    console.log("Content-Type:", res.headers.get('content-type'));
    let text = await res.text();
    console.log("Response text (first 200 chars):", text.slice(0, 200));

    console.log("\nTesting POST /api/auth/direct-google with non-gmail...");
    res = await fetch('http://localhost:3001/api/auth/direct-google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@yahoo.com', role: 'viewer' })
    });
    console.log("Status:", res.status);
    console.log("Content-Type:", res.headers.get('content-type'));
    text = await res.text();
    console.log("Response text:", text);
  } catch (err) {
    console.error("Error running test:", err);
  }
}

run();
