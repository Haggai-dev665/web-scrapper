/**
 * Cross-platform script to copy frontend build to backend/dist/public
 * Works on both Windows and Unix-based systems
 */

const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'frontend', 'dist');
const targetDir = path.join(__dirname, '..', 'backend', 'dist', 'public');

/**
 * Recursively copy directory
 */
function copyRecursive(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectory
      copyRecursive(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Main execution
 */
try {
  console.log('📦 Copying frontend build to backend...');
  console.log('   Source:', sourceDir);
  console.log('   Target:', targetDir);

  // Check if source directory exists
  if (!fs.existsSync(sourceDir)) {
    console.error('❌ Error: Frontend build directory not found!');
    console.error('   Expected at:', sourceDir);
    console.error('   Run "npm run build:frontend" first.');
    process.exit(1);
  }

  // Copy frontend build
  copyRecursive(sourceDir, targetDir);

  // Verify copy
  const copiedFiles = fs.readdirSync(targetDir);
  console.log(`✅ Successfully copied ${copiedFiles.length} items to backend/dist/public`);
  console.log('   Files:', copiedFiles.join(', '));

} catch (error) {
  console.error('❌ Error copying frontend:', error.message);
  process.exit(1);
}
