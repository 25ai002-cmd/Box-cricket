const { execSync } = require('child_process');

try {
  const output = execSync('wmic process where "name=\'node.exe\'" get ProcessId, CommandLine', { encoding: 'utf8' });
  console.log(output);
} catch (err) {
  // Fallback to powershell if wmic fails
  try {
    const psOutput = execSync('powershell -Command "Get-CimInstance Win32_Process -Filter \\"Name = \'node.exe\'\\" | Select-Object ProcessId, CommandLine | Format-Table -AutoSize"', { encoding: 'utf8' });
    console.log(psOutput);
  } catch (psErr) {
    console.error('All methods failed:', psErr.message);
  }
}
