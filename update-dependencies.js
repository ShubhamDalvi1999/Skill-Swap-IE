// This script adds the Spline dependency to package.json
const fs = require('fs');
const path = require('path');

// Read the package.json file
const packageJsonPath = path.join(process.cwd(), 'package.json');
let packageJson;

try {
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  packageJson = JSON.parse(packageJsonContent);
} catch (error) {
  console.error('Error reading package.json:', error);
  process.exit(1);
}

// Add the Spline dependency if it doesn't exist
if (!packageJson.dependencies['@splinetool/react-spline']) {
  packageJson.dependencies['@splinetool/react-spline'] = '^2.2.6';
  console.log('Added @splinetool/react-spline dependency');
} else {
  console.log('@splinetool/react-spline dependency already exists');
}

// Ensure React types are in devDependencies
if (!packageJson.devDependencies['@types/react']) {
  packageJson.devDependencies['@types/react'] = '^18';
  console.log('Added @types/react dependency');
}

if (!packageJson.devDependencies['@types/react-dom']) {
  packageJson.devDependencies['@types/react-dom'] = '^18';
  console.log('Added @types/react-dom dependency');
}

// Write the updated package.json
try {
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Successfully updated package.json');
} catch (error) {
  console.error('Error writing package.json:', error);
  process.exit(1);
} 