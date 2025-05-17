#!/usr/bin/env node

/**
 * This script cleans up the built HTML file to fix common issues.
 * - Removes duplicate script tags
 * - Fixes path inconsistencies 
 */

const fs = require('fs');
const path = require('path');

// Path to the built index.html
const htmlFilePath = path.join(__dirname, 'dist', 'index.html');

console.log('Post-build script: Cleaning up HTML file...');

try {
  // Read the HTML file
  let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
  
  // Remove the duplicate script tag
  htmlContent = htmlContent.replace(/<script src="js\/app.js"><\/script>/g, '');
  
  // Fix favicon path (change absolute to relative if needed)
  htmlContent = htmlContent.replace(/href="\/favicon.ico"/g, 'href="favicon.ico"');
  htmlContent = htmlContent.replace(/href="\/icon.svg"/g, 'href="icon.svg"');
  
  // Write the fixed HTML back to file
  fs.writeFileSync(htmlFilePath, htmlContent);
  
  console.log('HTML cleanup complete!');
} catch (error) {
  console.error('Error processing HTML file:', error);
  process.exit(1);
}
