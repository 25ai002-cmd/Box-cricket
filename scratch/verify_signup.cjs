const fs = require('fs');
const path = require('path');

async function main() {
  const email = 'testadmin@gmail.com';
  const password = 'Password123';
  const phone = '9876543210';
  
  try {
    console.log("1. Requesting verification code...");
    let res = await fetch('http://localhost:3001/api/auth/request-signup-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    let data = await res.json();
    console.log("Signup verification response:", data);
    
    // Wait for file write
    await new Promise(r => setTimeout(r, 1000));
    
    console.log("2. Reading code from scratch/last_code.txt...");
    const lastCodePath = path.join(__dirname, 'last_code.txt');
    if (!fs.existsSync(lastCodePath)) {
      throw new Error(`Code file not found at ${lastCodePath}`);
    }
    const fileContent = fs.readFileSync(lastCodePath, 'utf8');
    console.log("File content:\n", fileContent);
    const codeMatch = fileContent.match(/CODE:\s*(\d+)/);
    if (!codeMatch) {
      throw new Error("Could not parse code from file content");
    }
    const code = codeMatch[1];
    console.log(`Parsed code: ${code}`);
    
    console.log("3. Verifying signup code...");
    res = await fetch('http://localhost:3001/api/auth/verify-signup-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    data = await res.json();
    console.log("Verification response:", data);
    
    console.log("4. Signing up user as Venue Partner (admin)...");
    res = await fetch('http://localhost:3001/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, phone, password, role: 'admin' })
    });
    data = await res.json();
    console.log("Signup response:", data);
    
    console.log("5. Logging in user...");
    res = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrPhone: email, password })
    });
    data = await res.json();
    console.log("Login response:", data);
    if (data.token) {
      console.log("✅ Registration and login verified successfully!");
    } else {
      console.error("❌ Login failed (no token in response)");
    }
  } catch (err) {
    console.error("Error in verification flow:", err);
  }
}

main();
