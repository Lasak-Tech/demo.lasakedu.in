const { execSync } = require('child_process');

console.log('[Auto-Git-Sync] Active! Watching for any file changes...');

let isSyncing = false;

function checkAndSync() {
  if (isSyncing) return;
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    if (status.length > 0) {
      isSyncing = true;
      console.log(`[Auto-Git-Sync] Changes detected at ${new Date().toLocaleTimeString('en-IN')}:`);
      console.log(status);
      
      // Debounce 2.5 seconds to let file writes complete
      setTimeout(() => {
        try {
          execSync('git add -A', { stdio: 'inherit' });
          const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
          execSync(`git commit -m "auto: sync updates [${timestamp}]"`, { stdio: 'inherit' });
          console.log('[Auto-Git-Sync] Pushing changes to GitHub origin/main...');
          execSync('git push origin main', { stdio: 'inherit' });
          console.log('[Auto-Git-Sync] Push successful! Everything is up to date on GitHub.');
        } catch (err) {
          console.error('[Auto-Git-Sync] Notice during commit/push:', err.message);
        } finally {
          isSyncing = false;
        }
      }, 2500);
    }
  } catch (err) {
    isSyncing = false;
  }
}

// Check every 8 seconds
setInterval(checkAndSync, 8000);
checkAndSync();
