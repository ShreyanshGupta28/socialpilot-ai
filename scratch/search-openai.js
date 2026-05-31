const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const EXCLUDE_DIRS = ['node_modules', '.next', '.git', 'scratch'];
const TARGET_PATTERNS = [/OPENAI_API_KEY/i, /gpt-4o/i, /OpenAI-only/i];

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (!EXCLUDE_DIRS.includes(f)) {
        walkDir(dirPath, callback);
      }
    } else {
      callback(dirPath);
    }
  });
}

const matches = [];

walkDir(ROOT_DIR, (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      TARGET_PATTERNS.forEach(pattern => {
        if (pattern.test(line)) {
          matches.push({
            file: path.relative(ROOT_DIR, filePath),
            line: idx + 1,
            content: line.trim(),
            pattern: pattern.source
          });
        }
      });
    });
  } catch (err) {
    // Ignore binary/uncaught files
  }
});

console.log(JSON.stringify(matches, null, 2));
