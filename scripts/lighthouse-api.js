const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  const options = {
    logLevel: 'error',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(url, options);
  await chrome.kill();

  // Ergebnisse speichern
  fs.writeFileSync(
    'lighthouse-result.json', 
    JSON.stringify(runnerResult.lhr, null, 2)
  );

  console.log('\n=== Lighthouse Results ===');
  console.log('Performance:     ', (runnerResult.lhr.categories.performance.score * 100).toFixed(0));
  console.log('Accessibility:   ', (runnerResult.lhr.categories.accessibility.score * 100).toFixed(0));
  console.log('Best Practices:  ', (runnerResult.lhr.categories['best-practices'].score * 100).toFixed(0));
  console.log('SEO:             ', (runnerResult.lhr.categories.seo.score * 100).toFixed(0));
  console.log('\nReport saved to: lighthouse-result.json');
}

const url = process.argv[2];
if (!url) {
  console.log('Bitte URL angeben: node scripts/lighthouse-api.js https://example.com');
  process.exit(1);
}

runLighthouse(url);
