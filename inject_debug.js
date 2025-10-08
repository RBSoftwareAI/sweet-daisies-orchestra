const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto('https://8000-im2h1vrujfguuqhsguvll-6532622b.e2b.dev');
    await page.waitForSelector('.hero-description');
    
    const result = await page.evaluate(() => {
        const heroEl = document.querySelector('.hero-description');
        if (!heroEl) return { error: 'Élément non trouvé' };
        
        const computed = getComputedStyle(heroEl);
        
        return {
            marginBottom: computed.marginBottom,
            margin: computed.margin,
            screenWidth: window.innerWidth,
            textContent: heroEl.textContent.slice(0, 100),
            mediaQueries: {
                mobile480: window.matchMedia('(max-width: 480px)').matches,
                tablet768: window.matchMedia('(max-width: 768px)').matches,
                desktop1024: window.matchMedia('(max-width: 1024px)').matches
            }
        };
    });
    
    console.log('🔍 Résultats du debug:', JSON.stringify(result, null, 2));
    
    await browser.close();
})();
