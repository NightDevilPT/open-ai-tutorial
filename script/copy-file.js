import fs from 'fs';
import path from 'path';

// Hardcoded directory path
const rootDir = 'C:/Users/Pawan/Desktop/Langchain-Langgraph/src';
const outputFile = 'output.txt';

// Function to traverse and process files
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach(entry => {
    const entryPath = path.join(dir, entry.name);

    // Skip "_pycache_" and "env" directories
    if (entry.isDirectory() && (entry.name === '_pycache_' || entry.name === 'env')) {
      return;
    }

    if (entry.isDirectory()) {
      processDirectory(entryPath);
    } else if (entry.isFile()) {
      try {
        const content = fs.readFileSync(entryPath, 'utf-8');

        fs.appendFileSync(outputFile, `File Path: ${entryPath}\n`);
        fs.appendFileSync(outputFile, 'Contents:\n');
        fs.appendFileSync(outputFile, content);
        fs.appendFileSync(outputFile, '\n' + '-'.repeat(50) + '\n\n');
      } catch (error) {
        fs.appendFileSync(outputFile, `Could not read ${entryPath}: ${error}\n`);
        fs.appendFileSync(outputFile, '-'.repeat(50) + '\n\n');
      }
    }
  });
}

// Clear output file if it already exists
fs.writeFileSync(outputFile, '');

// Start processing
processDirectory(rootDir);

console.log(`All file paths and contents have been stored in ${outputFile}.`);
