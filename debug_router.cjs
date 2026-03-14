const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen for console events
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`PAGE LOG [${msg.type()}]:`, msg.text());
    }
  });

  // Listen for page errors (uncaught exceptions)
  page.on('pageerror', error => {
    console.log(`PAGE EXCEPTION:`, error.message);
  });

  try {
    console.log('Navigating to login...');
    await page.goto('http://localhost:3000/login');
    
    // Fill credentials and click login
    await page.fill('input[type="email"]', 'demo@akyildiz.com');
    await page.fill('input[type="password"]', 'demo123'); // assuming local demo works or is a fallback
    
    // Just click the login button
    await page.click('button[type="submit"]');
    
    // Wait for navigation to complete
    await page.waitForTimeout(3000);
    
    console.log('Navigating directly to /tenants as user described...');
    await page.goto('http://localhost:3000/tenants', { waitUntil: 'networkidle' });
    
    await page.waitForTimeout(3000); // give it some time to render or crash
    
    console.log('Navigating directly to /owners as user described...');
    await page.goto('http://localhost:3000/owners', { waitUntil: 'networkidle' });
    
    await page.waitForTimeout(3000); 

  } catch (err) {
    console.error('Script error:', err);
  } finally {
    await browser.close();
  }
})();
