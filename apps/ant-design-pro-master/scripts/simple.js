/**
 * Simplify script - reduces the full version down to a simple version
 * Run `npm run simple` to execute this script
 *
 * This operation is irreversible and deletes the following:
 * - Page directories: dashboard, form, list/basic-list, list/card-list, list/search, profile, result, exception, account, user/register, user/register-result
 * - Replaces the route configuration with the simple version
 * - Removes dependencies that are no longer needed: @ant-design/plots, d3, topojson-client
 */

const fs = require('node:fs');
const path = require('node:path');

// Page directories to delete
const pageDirsToDelete = [
  'src/pages/dashboard',
  'src/pages/form',
  'src/pages/list/basic-list',
  'src/pages/list/card-list',
  'src/pages/list/search',
  'src/pages/profile',
  'src/pages/result',
  'src/pages/account',
  'src/pages/user/register',
  'src/pages/user/register-result',
];

// Mock files to delete
const mockFilesToDelete = [];

// Dependencies to remove from package.json
const depsToRemove = ['@ant-design/plots', 'd3', 'topojson-client'];

const devDepsToRemove = [
  '@types/d3',
  '@types/topojson-client',
  '@types/topojson-specification',
  'geojson',
];

// Recursively delete a directory
function deleteDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✓ Deleted directory: ${dirPath}`);
  } else {
    console.log(`- Directory does not exist, skipping: ${dirPath}`);
  }
}

// Delete a file
function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`✓ Deleted file: ${filePath}`);
  } else {
    console.log(`- File does not exist, skipping: ${filePath}`);
  }
}

// Replace the route configuration
function replaceRoutes() {
  const simpleRoutesPath = 'config/routes.simple.ts';
  const routesPath = 'config/routes.ts';

  if (fs.existsSync(simpleRoutesPath)) {
    // Read the simple version of the routes
    const simpleRoutes = fs.readFileSync(simpleRoutesPath, 'utf-8');
    // Write it to routes.ts
    fs.writeFileSync(routesPath, simpleRoutes);
    console.log(`✓ Replaced route configuration: ${routesPath}`);
    // Delete the simple routes backup file
    fs.unlinkSync(simpleRoutesPath);
    console.log(`✓ Deleted backup file: ${simpleRoutesPath}`);
  } else {
    console.log(`- Simple route configuration does not exist, skipping: ${simpleRoutesPath}`);
  }
}

// Update package.json
function updatePackageJson() {
  const pkgPath = 'package.json';
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  let modified = false;

  // Remove dependencies
  if (pkg.dependencies) {
    for (const dep of depsToRemove) {
      if (pkg.dependencies[dep]) {
        delete pkg.dependencies[dep];
        console.log(`✓ Removed dependency: ${dep}`);
        modified = true;
      }
    }
  }

  // Remove devDependencies
  if (pkg.devDependencies) {
    for (const dep of devDepsToRemove) {
      if (pkg.devDependencies[dep]) {
        delete pkg.devDependencies[dep];
        console.log(`✓ Removed dev dependency: ${dep}`);
        modified = true;
      }
    }
  }

  // Remove the simple script
  if (pkg.scripts?.simple) {
    delete pkg.scripts.simple;
    console.log('✓ Removed the simple script');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
    console.log('✓ Updated package.json');
  } else {
    console.log('- No changes needed in package.json');
  }
}

// Main function
function main() {
  console.log('========================================');
  console.log('  Starting the simplify script');
  console.log('========================================\n');

  console.log('>>> Deleting page directories...');
  for (const dir of pageDirsToDelete) {
    deleteDir(dir);
  }

  console.log('\n>>> Deleting mock files...');
  for (const file of mockFilesToDelete) {
    deleteFile(file);
  }

  console.log('\n>>> Replacing route configuration...');
  replaceRoutes();

  console.log('\n>>> Updating package.json...');
  updatePackageJson();

  // Delete this script itself
  console.log('\n>>> Cleaning up the simplify script...');
  fs.unlinkSync(__filename);
  console.log('✓ Deleted scripts/simple.js');

  // Try to delete the scripts directory if it's empty
  const scriptsDir = path.dirname(__filename);
  if (fs.readdirSync(scriptsDir).length === 0) {
    fs.rmdirSync(scriptsDir);
    console.log('✓ Deleted the empty scripts directory');
  }

  console.log('\n========================================');
  console.log('  Simplification complete!');
  console.log('  Please run npm install to update dependencies');
  console.log('========================================');
}

main();
