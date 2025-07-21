#!/usr/bin/env node

/**
 * InstaBoost.ai Client Setup Script
 * Helps resolve React Native dependency conflicts
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 InstaBoost.ai Client Setup');
console.log('===============================');

// Check if we're in the right directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json not found. Please run this script from the client directory.');
  process.exit(1);
}

try {
  console.log('📦 Installing dependencies with legacy peer deps...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  
  console.log('✅ Dependencies installed successfully!');
  console.log('');
  console.log('🎉 Setup complete! You can now start the client with:');
  console.log('   npm start');
  console.log('   # or');
  console.log('   npx expo start');
  
} catch (error) {
  console.error('❌ Error during installation:', error.message);
  console.log('');
  console.log('🔧 Try these solutions:');
  console.log('1. Clear npm cache: npm cache clean --force');
  console.log('2. Delete node_modules: rm -rf node_modules');
  console.log('3. Delete package-lock.json: rm package-lock.json');
  console.log('4. Run this script again');
  process.exit(1);
}
