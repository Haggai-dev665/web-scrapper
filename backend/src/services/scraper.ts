import { Browser } from 'puppeteer';
import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { URL } from 'url';
import {
  ScrapedData,
  NetworkResource,
  ConsoleLog,
  SecurityReport
} from '../models';

// Add stealth plugin to avoid detection
puppeteerExtra.use(StealthPlugin());

export class ScraperService {
  private browser: Browser | null = null;

  async initialize(): Promise<void> {
    if (!this.browser) {
      console.log('🚀 Launching Puppeteer browser...');
      this.browser = await puppeteerExtra.launch({
        headless: 'new',
        protocolTimeout: 180000,  // 3 minutes for protocol operations
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
      console.log('✅ Puppeteer browser launched');
    }
  }

  async scrapeUrl(url: string): Promise<ScrapedData> {
    const startTime = Date.now();
    console.log('🔍 Starting advanced scrape for URL:', url);

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch (error) {
      throw new Error('Invalid URL format');
    }

    // Ensure browser is initialized
    await this.initialize();

    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    // Create new page with timeout protection
    let page;
    try {
      page = await Promise.race([
        this.browser.newPage(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Page creation timed out after 30s')), 30000)
        )
      ]) as any;
    } catch (error) {
      console.error('❌ Failed to create new page:', error);
      throw new Error('Failed to create browser page. The browser may be overloaded. Please try again.');
    }

    try {
      // Set default timeout for all operations on this page
      page.setDefaultTimeout(120000);  // 2 minutes for all operations
      page.setDefaultNavigationTimeout(120000);  // 2 minutes for navigation
      
      // Set viewport to full HD
      await page.setViewport({ width: 1920, height: 1080 });

      // Set realistic user agent
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      // Enable request interception for detailed tracking
      await page.setRequestInterception(true);

      // Track network resources with ADVANCED detailed information
      const networkResources: NetworkResource[] = [];
      const consoleLogs: ConsoleLog[] = [];
      const responseHeaders: { [key: string]: string } = {};
      const requestTimings = new Map<string, number>();
      const requestHeaders = new Map<string, any>();
      const requestPostData = new Map<string, string>();
      const responseData = new Map<string, any>();
      const cookiesCollected: any[] = [];
      const performanceMetrics: any = {};

      // Track all requests with FULL interception details
      page.on('request', (request) => {
        const requestUrl = request.url();
        requestTimings.set(requestUrl, Date.now());
        
        // Capture request headers
        requestHeaders.set(requestUrl, request.headers());
        
        // Capture POST data if available
        const postData = request.postData();
        if (postData) {
          requestPostData.set(requestUrl, postData);
        }
        
        request.continue();
      });

      // Listen to network responses with COMPLETE detailed information
      page.on('response', async (response) => {
        try {
          const request = response.request();
          const requestUrl = request.url();
          const timing = response.timing();
          const startReqTime = requestTimings.get(requestUrl);
          const actualTiming = startReqTime ? Date.now() - startReqTime : 0;

          // Get response headers
          const resHeaders = response.headers();
          
          // Get response size and body
          let transferSize: number | undefined;
          let responseBody: string | undefined;
          try {
            const buffer = await response.buffer();
            transferSize = buffer.length;
            
            // Try to get text content for analysis (limit to 1MB)
            if (transferSize < 1000000) {
              const contentType = resHeaders['content-type'] || '';
              if (contentType.includes('text') || contentType.includes('json') || contentType.includes('javascript')) {
                responseBody = buffer.toString('utf-8').substring(0, 10000); // Limit to 10KB for storage
              }
            }
          } catch (e) {
            // Some responses can't be buffered
            transferSize = undefined;
          }
          
          // Advanced network resource tracking
          networkResources.push({
            name: requestUrl,
            initiatorType: request.resourceType(),
            startTimeMs: timing ? timing.requestTime * 1000 : startReqTime || 0,
            durationMs: actualTiming,
            transferSize,
            encodedBodySize: transferSize,
            method: request.method(),
            status: response.status(),
            statusText: response.statusText(),
            mimeType: resHeaders['content-type'] || '',
            requestHeaders: requestHeaders.get(requestUrl) || {},
            responseHeaders: resHeaders,
            postData: requestPostData.get(requestUrl),
            cached: response.fromCache(),
            serviceWorker: response.fromServiceWorker(),
            remoteAddress: response.remoteAddress().ip || '',
            protocol: (response as any).protocol || 'unknown',
            priority: request.resourceType() === 'document' ? 'high' : 
                     request.resourceType() === 'script' ? 'medium' : 'low'
          });

          // Store response data for main page
          if (requestUrl === url) {
            Object.keys(resHeaders).forEach(key => {
              responseHeaders[key] = resHeaders[key];
            });
          }
          
          // Collect cookies from responses
          const setCookieHeader = resHeaders['set-cookie'];
          if (setCookieHeader) {
            cookiesCollected.push({
              url: requestUrl,
              cookie: setCookieHeader
            });
          }
        } catch (error) {
          // Log but don't fail on network tracking errors
          console.error('Error tracking network resource:', error);
        }
      });

      // Listen to console messages with COMPLETE details including stack traces
      page.on('console', async (msg) => {
        try {
          const args = await Promise.all(
            msg.args().map(arg => arg.jsonValue().catch(() => arg.toString()))
          );
          
          consoleLogs.push({
            level: msg.type(),
            message: msg.text(),
            args: args.length > 0 ? args : undefined,
            location: msg.location() ? `${msg.location().url}:${msg.location().lineNumber}` : undefined,
            stackTrace: msg.stackTrace() ? msg.stackTrace().map(frame => 
              `${frame.url}:${frame.lineNumber}:${frame.columnNumber}`
            ).join('\n') : undefined
          });
        } catch (error) {
          consoleLogs.push({
            level: msg.type(),
            message: msg.text()
          });
        }
      });

      // Listen to JavaScript errors with full stack traces
      page.on('pageerror', (error) => {
        consoleLogs.push({
          level: 'error',
          message: `JavaScript error: ${error.message}`,
          stackTrace: error.stack
        });
      });

      // Listen to request failures with detailed reasons
      page.on('requestfailed', (request) => {
        const failure = request.failure();
        consoleLogs.push({
          level: 'error',
          message: `Failed to load: ${request.url()}`,
          errorText: failure?.errorText || 'Unknown error',
          method: request.method(),
          resourceType: request.resourceType()
        });
      });

      // Listen to dialog events (alerts, confirms, prompts)
      page.on('dialog', async (dialog) => {
        consoleLogs.push({
          level: 'info',
          message: `Dialog (${dialog.type()}): ${dialog.message()}`
        });
        await dialog.dismiss();
      });

      // Navigate to page with extended timeout for slow websites
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',  // Changed to be less strict - waits for DOM instead of all network
        timeout: 120000  // Increased to 120 seconds (2 minutes)
      });

      if (!response) {
        throw new Error('Failed to load page');
      }

      const status = response.status();
      if (status < 200 || status >= 400) {
        throw new Error(`HTTP error: ${status}`);
      }

      // Wait for dynamic content and JavaScript execution (increased for heavy sites)
      await page.waitForTimeout(5000);  // Increased to 5 seconds

      // Collect PERFORMANCE METRICS using Performance API
      const metrics = await page.evaluate(() => {
        const perfData = (window as any).performance;
        const navigation = perfData?.getEntriesByType?.('navigation')?.[0] || {};
        const paint = perfData?.getEntriesByType?.('paint') || [];
        const resources = perfData?.getEntriesByType?.('resource') || [];
        
        return {
          // Navigation timing
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          domInteractive: navigation.domInteractive,
          domComplete: navigation.domComplete,
          // DNS and connection
          dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcpConnection: navigation.connectEnd - navigation.connectStart,
          tlsNegotiation: navigation.secureConnectionStart > 0 ? 
            navigation.connectEnd - navigation.secureConnectionStart : 0,
          // Request/Response
          requestTime: navigation.responseStart - navigation.requestStart,
          responseTime: navigation.responseEnd - navigation.responseStart,
          // Paint timing
          firstPaint: paint.find((p: any) => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find((p: any) => p.name === 'first-contentful-paint')?.startTime || 0,
          // Transfer sizes
          transferSize: navigation.transferSize || 0,
          encodedBodySize: navigation.encodedBodySize || 0,
          decodedBodySize: navigation.decodedBodySize || 0,
          // Resource counts
          totalResources: resources.length
        };
      });
      
      Object.assign(performanceMetrics, metrics);

      // Collect COOKIES and LOCAL STORAGE
      const cookies = await page.cookies();
      const localStorage = await page.evaluate(() => {
        const items: { [key: string]: string } = {};
        for (let i = 0; i < (window as any).localStorage.length; i++) {
          const key = (window as any).localStorage.key(i);
          if (key) {
            items[key] = (window as any).localStorage.getItem(key) || '';
          }
        }
        return items;
      });
      
      const sessionStorage = await page.evaluate(() => {
        const items: { [key: string]: string } = {};
        for (let i = 0; i < (window as any).sessionStorage.length; i++) {
          const key = (window as any).sessionStorage.key(i);
          if (key) {
            items[key] = (window as any).sessionStorage.getItem(key) || '';
          }
        }
        return items;
      });

      // Extract page data
      // Note: Code inside page.evaluate() runs in browser context, not Node.js
      // @ts-ignore comments are necessary as TypeScript doesn't recognize browser globals (document, window)
      const pageData = await page.evaluate(() => {
        // @ts-ignore - Running in browser context
        // Extract title
        const title = document.title || 'No title found';

        // @ts-ignore - Running in browser context
        // Extract meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        const description = metaDesc?.getAttribute('content') || 'No description found';

        // Extract headings
        const headings: string[] = [];
        for (let i = 1; i <= 6; i++) {
          // @ts-ignore - Running in browser context
          const elements = document.querySelectorAll(`h${i}`);
          elements.forEach((el: any) => {
            const text = el.textContent?.trim();
            if (text) {
              headings.push(`H${i}: ${text}`);
            }
          });
        }

        // Extract links
        const links: Array<{ text: string; href: string; isExternal: boolean }> = [];
        // @ts-ignore - Running in browser context
        document.querySelectorAll('a[href]').forEach((el: any) => {
          const anchor = el as any;
          const href = anchor.href;
          const text = anchor.textContent?.trim() || href;
          // @ts-ignore - Running in browser context
          const isExternal = !href.startsWith(window.location.origin) && 
                           (href.startsWith('http://') || href.startsWith('https://'));
          links.push({ text, href, isExternal });
        });

        // Extract images
        const images: Array<{ alt: string; src: string; width?: string; height?: string }> = [];
        // @ts-ignore - Running in browser context
        document.querySelectorAll('img').forEach((el: any) => {
          const img = el as any;
          images.push({
            alt: img.alt || '',
            src: img.src,
            width: img.width ? img.width.toString() : undefined,
            height: img.height ? img.height.toString() : undefined
          });
        });

        // Extract all meta tags including OG and Twitter cards
        const metaTags: { [key: string]: string } = {};
        // @ts-ignore - Running in browser context
        document.querySelectorAll('meta').forEach((el: any) => {
          const name = el.getAttribute('name') || el.getAttribute('property') || el.getAttribute('http-equiv');
          const content = el.getAttribute('content');
          if (name && content) {
            metaTags[name] = content;
          }
        });

        // Extract text content
        // @ts-ignore - Running in browser context
        const body = document.body;
        const textContent = body ? body.innerText : '';

        // Extract FORMS with detailed field information
        const forms: any[] = [];
        // @ts-ignore - Running in browser context
        document.querySelectorAll('form').forEach((form: any) => {
          const inputs: any[] = [];
          form.querySelectorAll('input, select, textarea, button').forEach((field: any) => {
            inputs.push({
              type: field.type || field.tagName.toLowerCase(),
              name: field.name || '',
              id: field.id || '',
              placeholder: field.placeholder || '',
              required: field.required || false,
              value: field.value || ''
            });
          });
          
          forms.push({
            action: form.action || '',
            method: form.method || 'get',
            id: form.id || '',
            className: form.className || '',
            enctype: form.enctype || '',
            fields: inputs,
            fieldCount: inputs.length
          });
        });

        // Extract SCRIPTS (both external and inline)
        const scripts: any[] = [];
        // @ts-ignore - Running in browser context
        document.querySelectorAll('script').forEach((script: any) => {
          if (script.src) {
            scripts.push({
              type: 'external',
              src: script.src,
              async: script.async || false,
              defer: script.defer || false
            });
          } else if (script.textContent && script.textContent.trim()) {
            scripts.push({
              type: 'inline',
              content: script.textContent.substring(0, 500), // First 500 chars
              length: script.textContent.length
            });
          }
        });

        // Extract STYLESHEETS (both external and inline)
        const stylesheets: any[] = [];
        // @ts-ignore - Running in browser context
        document.querySelectorAll('link[rel="stylesheet"]').forEach((link: any) => {
          stylesheets.push({
            type: 'external',
            href: link.href,
            media: link.media || 'all'
          });
        });
        
        // @ts-ignore - Running in browser context
        document.querySelectorAll('style').forEach((style: any) => {
          if (style.textContent && style.textContent.trim()) {
            stylesheets.push({
              type: 'inline',
              content: style.textContent.substring(0, 500),
              length: style.textContent.length
            });
          }
        });

        // Extract IFRAMES
        const iframes: any[] = [];
        // @ts-ignore - Running in browser context
        document.querySelectorAll('iframe').forEach((iframe: any) => {
          iframes.push({
            src: iframe.src || '',
            width: iframe.width || '',
            height: iframe.height || '',
            sandbox: iframe.sandbox ? iframe.sandbox.toString() : '',
            loading: iframe.loading || ''
          });
        });

        // Extract ALL INPUT FIELDS (for security analysis)
        const inputFields: any[] = [];
        // @ts-ignore - Running in browser context
        document.querySelectorAll('input').forEach((input: any) => {
          inputFields.push({
            type: input.type || 'text',
            name: input.name || '',
            id: input.id || '',
            autocomplete: input.autocomplete || '',
            pattern: input.pattern || '',
            maxLength: input.maxLength || 0
          });
        });

        // Extract BUTTONS
        const buttons: any[] = [];
        // @ts-ignore - Running in browser context
        document.querySelectorAll('button, input[type="button"], input[type="submit"]').forEach((btn: any) => {
          buttons.push({
            text: btn.textContent?.trim() || btn.value || '',
            type: btn.type || '',
            id: btn.id || '',
            className: btn.className || ''
          });
        });

        // Detect TECHNOLOGIES used on the page
        const technologies: string[] = [];
        // @ts-ignore - Running in browser context
        if ((window as any).jQuery) technologies.push('jQuery');
        // @ts-ignore - Running in browser context
        if ((window as any).React) technologies.push('React');
        // @ts-ignore - Running in browser context
        if ((window as any).Vue) technologies.push('Vue.js');
        // @ts-ignore - Running in browser context
        if ((window as any).angular) technologies.push('Angular');
        // @ts-ignore - Running in browser context
        if ((document as any).querySelector('[data-react-root]') || 
            (document as any).querySelector('[data-reactroot]')) technologies.push('React (detected)');
        // @ts-ignore - Running in browser context
        if ((document as any).querySelector('[ng-app], [data-ng-app]')) technologies.push('AngularJS');
        // @ts-ignore - Running in browser context
        if ((document as any).querySelector('[v-cloak]')) technologies.push('Vue.js (detected)');
        
        // Extract JSON-LD structured data
        const structuredData: any[] = [];
        // @ts-ignore - Running in browser context
        document.querySelectorAll('script[type="application/ld+json"]').forEach((script: any) => {
          try {
            const data = JSON.parse(script.textContent);
            structuredData.push(data);
          } catch (e) {
            // Invalid JSON
          }
        });

        return {
          title,
          description,
          headings,
          links,
          images,
          metaTags,
          textContent,
          forms,
          scripts,
          stylesheets,
          iframes,
          inputFields,
          buttons,
          technologies,
          structuredData,
          // @ts-ignore - Running in browser context
          htmlContent: document.documentElement.outerHTML,
          // @ts-ignore - Running in browser context
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio || 1
          }
        };
      });

      // Take FULL PAGE screenshot
      const screenshotBuffer = await page.screenshot({
        encoding: 'base64',
        fullPage: true,  // Changed to capture entire page
        type: 'png'
      });
      const screenshot = `data:image/png;base64,${screenshotBuffer}`;

      // Calculate metrics
      const wordCount = pageData.textContent.split(/\s+/).filter((w: string) => w.length > 0).length;
      const readingTimeMinutes = wordCount / 200; // Average reading speed
      
      // Calculate word frequency
      const wordFrequency = this.calculateWordFrequency(pageData.textContent);
      
      // Calculate readability score
      const readabilityScore = this.calculateReadabilityScore(pageData.textContent);
      
      // Detect language
      const language = this.detectLanguage(pageData.textContent);
      
      // Filter social media links
      const socialMediaLinks = pageData.links.filter(link => 
        this.isSocialMediaLink(link.href)
      );
      
      // Calculate page size
      const pageSizeKb = Buffer.byteLength(pageData.htmlContent, 'utf8') / 1024;

      // Generate security report
      const securityReport = this.generateSecurityReport(
        parsedUrl,
        responseHeaders,
        pageData.htmlContent,
        networkResources
      );

      // DEBUG: Log collected data
      console.log(`📊 Network Resources Collected: ${networkResources.length}`);
      console.log(`📊 Console Logs Collected: ${consoleLogs.length}`);
      console.log(`📊 Response Headers Collected: ${Object.keys(responseHeaders).length}`);
      console.log(`� Performance Metrics:`, performanceMetrics);
      console.log(`�🔒 Security Report Generated:`, {
        isHttps: securityReport.isHttps,
        missingHeaders: securityReport.missingSecurityHeaders.length,
        notes: securityReport.notes.length
      });

      // CRAWL INTERNAL LINKS for deeper analysis
      console.log('🔗 Analyzing internal links...');
      const crawledLinks = await this.crawlInternalLinks(url, pageData.links, 5);

      const responseTime = Date.now() - startTime;

      const scrapedData: ScrapedData = {
        url,
        title: pageData.title,
        description: pageData.description,
        headings: pageData.headings,
        links: pageData.links,
        images: pageData.images,
        metaTags: pageData.metaTags,
        screenshot,
        wordCount,
        responseTimeMs: responseTime,
        textContent: pageData.textContent,
        wordFrequency,
        readingTimeMinutes,
        readabilityScore,
        language,
        socialMediaLinks,
        pageSizeKb,
        renderedHtml: pageData.htmlContent,
        networkResources,
        responseHeaders,
        consoleLogs,
        securityReport,
        // NEW ADVANCED FIELDS
        forms: pageData.forms,
        scripts: pageData.scripts,
        stylesheets: pageData.stylesheets,
        iframes: pageData.iframes || [],
        inputFields: pageData.inputFields || [],
        buttons: pageData.buttons || [],
        technologies: pageData.technologies || [],
        structuredData: pageData.structuredData || [],
        cookies: cookies || [],
        localStorage: localStorage || {},
        sessionStorage: sessionStorage || {},
        performanceMetrics: performanceMetrics || {},
        viewport: pageData.viewport || {},
        crawledLinks: crawledLinks || []
      };

      console.log('✅ Scraping completed successfully');
      return scrapedData;

    } finally {
      await page.close();
    }
  }

  private calculateWordFrequency(text: string): { [key: string]: number } {
    const frequency: { [key: string]: number } = {};
    
    const stopWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at'
    ]);

    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    
    words.forEach(word => {
      if (!stopWords.has(word)) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });

    // Return top 50 words
    return Object.fromEntries(
      Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50)
    );
  }

  private calculateReadabilityScore(text: string): number {
    if (!text || text.length === 0) return 0;

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    
    if (sentences.length === 0 || words.length === 0) return 0;

    const syllableCount = words.reduce((sum, word) => sum + this.countSyllables(word), 0);
    
    // Flesch Reading Ease formula
    const score = 206.835 - 
                  (1.015 * (words.length / sentences.length)) - 
                  (84.6 * (syllableCount / words.length));
    
    return Math.max(0, Math.min(100, score));
  }

  private countSyllables(word: string): number {
    word = word.toLowerCase();
    const vowels = /[aeiouy]/g;
    const matches = word.match(vowels);
    let count = matches ? matches.length : 0;
    
    // Adjust for silent e
    if (word.endsWith('e') && count > 1) {
      count--;
    }
    
    return Math.max(1, count);
  }

  private detectLanguage(text: string): string {
    const englishWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had'];
    const spanishWords = ['el', 'la', 'de', 'que', 'y', 'en', 'un', 'es', 'se', 'no'];
    const frenchWords = ['le', 'de', 'et', 'à', 'un', 'il', 'être', 'en', 'avoir', 'que'];

    const textLower = text.toLowerCase();
    
    const englishCount = englishWords.filter(word => textLower.includes(word)).length;
    const spanishCount = spanishWords.filter(word => textLower.includes(word)).length;
    const frenchCount = frenchWords.filter(word => textLower.includes(word)).length;

    if (englishCount >= spanishCount && englishCount >= frenchCount) {
      return 'English';
    } else if (spanishCount >= frenchCount) {
      return 'Spanish';
    } else if (frenchCount > 0) {
      return 'French';
    }
    
    return 'Unknown';
  }

  private isSocialMediaLink(href: string): boolean {
    const socialDomains = [
      'facebook.com', 'twitter.com', 'x.com', 'instagram.com', 'linkedin.com',
      'youtube.com', 'tiktok.com', 'pinterest.com', 'snapchat.com', 'reddit.com'
    ];
    
    return socialDomains.some(domain => href.includes(domain));
  }

  private generateSecurityReport(
    url: URL,
    headers: { [key: string]: string },
    html: string,
    resources: NetworkResource[]
  ): SecurityReport {
    const isHttps = url.protocol === 'https:';
    
    // Check for missing security headers
    const expectedHeaders = [
      'strict-transport-security',
      'content-security-policy',
      'x-frame-options',
      'x-content-type-options',
      'referrer-policy',
      'permissions-policy',
      'x-xss-protection'
    ];
    
    const missingSecurityHeaders = expectedHeaders.filter(
      header => !Object.keys(headers).some(h => h.toLowerCase() === header)
    );

    // Check for mixed content
    let mixedContent = false;
    const mixedContentUrls: string[] = [];
    if (isHttps) {
      // Check HTML for insecure resources
      const insecurePattern = /http:\/\/[^"'\s]+/g;
      const matches = html.match(insecurePattern);
      if (matches && matches.length > 0) {
        mixedContent = true;
        mixedContentUrls.push(...matches.slice(0, 10)); // Limit to 10
      }
      
      // Check network resources
      resources.forEach(res => {
        if (res.name.startsWith('http://')) {
          mixedContent = true;
          if (mixedContentUrls.length < 10) {
            mixedContentUrls.push(res.name);
          }
        }
      });
    }

    // Get CSP header
    const csp = headers['content-security-policy'] || 
                headers['Content-Security-Policy'];

    // Advanced vulnerability detection
    const notes: string[] = [];
    
    // Check for common vulnerabilities
    if (html.toLowerCase().includes('jquery')) {
      const jqueryMatch = html.match(/jquery[\/.-]?([\d.]+)/i);
      const version = jqueryMatch ? jqueryMatch[1] : 'unknown';
      notes.push(`Detected jQuery version ${version}; check for known vulnerabilities`);
    }
    
    if (html.toLowerCase().includes('wordpress')) {
      notes.push('WordPress site detected; verify plugins and themes are up to date');
    }
    
    if (html.toLowerCase().includes('angular')) {
      notes.push('AngularJS detected; check for XSS vulnerabilities in older versions');
    }
    
    if (html.toLowerCase().includes('react')) {
      notes.push('React detected; ensure no dangerouslySetInnerHTML misuse');
    }
    
    // Check for inline scripts (potential XSS risk)
    const inlineScripts = (html.match(/<script(?![^>]*src=)[^>]*>/gi) || []).length;
    if (inlineScripts > 5) {
      notes.push(`Found ${inlineScripts} inline scripts; consider CSP to mitigate XSS risks`);
    }
    
    // Check for forms without CSRF protection indicators
    const forms = html.match(/<form[^>]*>/gi) || [];
    if (forms.length > 0 && !html.includes('csrf') && !html.includes('_token')) {
      notes.push(`Found ${forms.length} form(s) with no obvious CSRF protection`);
    }
    
    // Check for outdated protocols
    if (!isHttps) {
      notes.push('CRITICAL: Site not using HTTPS; data transmitted in plain text');
    }
    
    // Check security headers
    if (!headers['strict-transport-security']) {
      notes.push('Missing HSTS header; connections could be downgraded to HTTP');
    }
    
    if (!headers['x-frame-options'] && !csp?.includes('frame-ancestors')) {
      notes.push('Missing X-Frame-Options and CSP frame-ancestors; vulnerable to clickjacking');
    }
    
    if (!headers['x-content-type-options']) {
      notes.push('Missing X-Content-Type-Options; vulnerable to MIME-sniffing attacks');
    }
    
    // Check for exposed sensitive information
    if (html.includes('api_key') || html.includes('apikey') || html.includes('access_token')) {
      notes.push('WARNING: Possible API keys or tokens exposed in HTML source');
    }
    
    // Check for development/debug indicators
    if (html.includes('localhost') || html.includes('127.0.0.1') || html.includes('.local')) {
      notes.push('Development references detected in production code');
    }

    // ADVANCED SECURITY CHECKS
    
    // Check for SQL injection vulnerabilities in URLs
    const sqlPatterns = ['select ', 'union ', 'insert ', 'delete ', 'drop ', 'update '];
    const foundSqlPatterns = sqlPatterns.filter(pattern => 
      html.toLowerCase().includes(pattern + 'from') || 
      html.toLowerCase().includes(pattern + 'where')
    );
    if (foundSqlPatterns.length > 0) {
      notes.push(`WARNING: Potential SQL keywords found in HTML: ${foundSqlPatterns.join(', ')}`);
    }

    // Check for password fields without HTTPS
    if (!isHttps && html.includes('type="password"')) {
      notes.push('CRITICAL: Password fields detected on non-HTTPS page - credentials at risk!');
    }

    // Check for autocomplete on sensitive fields
    if (html.includes('type="password"') && !html.includes('autocomplete="off"')) {
      notes.push('Password fields allow autocomplete; consider disabling for security');
    }

    // Check for outdated/vulnerable libraries
    const vulnerableLibs = [
      { name: 'jQuery 1.x', pattern: /jquery[\/.-]?1\./i, risk: 'HIGH - known XSS vulnerabilities' },
      { name: 'jQuery 2.x', pattern: /jquery[\/.-]?2\./i, risk: 'MEDIUM - security patches needed' },
      { name: 'Angular 1.x', pattern: /angular[\/.-]?1\./i, risk: 'HIGH - AngularJS reached end of life' },
      { name: 'Bootstrap 3.x', pattern: /bootstrap[\/.-]?3\./i, risk: 'MEDIUM - outdated version' }
    ];

    vulnerableLibs.forEach(lib => {
      if (lib.pattern.test(html)) {
        notes.push(`${lib.name} detected - ${lib.risk}`);
      }
    });

    // Check for clickjacking protection
    const xFrameOptions = headers['x-frame-options'];
    if (!xFrameOptions && !csp) {
      notes.push('No clickjacking protection (X-Frame-Options or CSP frame-ancestors)');
    }

    // Check cookie security
    let insecureCookies = false;
    const cookieHeader = headers['set-cookie'];
    if (cookieHeader) {
      const cookieStr = Array.isArray(cookieHeader) ? cookieHeader.join(';') : cookieHeader;
      if (isHttps && !cookieStr.includes('Secure')) {
        notes.push('Cookies missing Secure flag on HTTPS site');
        insecureCookies = true;
      }
      if (!cookieStr.includes('HttpOnly')) {
        notes.push('Cookies missing HttpOnly flag; vulnerable to XSS attacks');
        insecureCookies = true;
      }
      if (!cookieStr.includes('SameSite')) {
        notes.push('Cookies missing SameSite attribute; vulnerable to CSRF');
        insecureCookies = true;
      }
    }

    // Check for server information disclosure
    const serverHeader = headers['server'];
    const xPoweredBy = headers['x-powered-by'];
    if (serverHeader && serverHeader !== 'cloudflare') {
      notes.push(`Server header exposed: ${serverHeader} - consider hiding for security`);
    }
    if (xPoweredBy) {
      notes.push(`X-Powered-By header exposed: ${xPoweredBy} - remove to prevent info disclosure`);
    }

    // Check for CORS misconfigurations
    const accessControlOrigin = headers['access-control-allow-origin'];
    if (accessControlOrigin === '*') {
      notes.push('CORS set to wildcard (*); may expose sensitive data to any origin');
    }

    // Check for subresource integrity
    const hasExternalScripts = (html.match(/<script[^>]+src=["']https?:\/\//gi) || []).length;
    const hasIntegrity = (html.match(/integrity=/gi) || []).length;
    if (hasExternalScripts > 0 && hasIntegrity === 0) {
      notes.push(`${hasExternalScripts} external script(s) without Subresource Integrity (SRI)`);
    }

    return {
      isHttps,
      mixedContent,
      missingSecurityHeaders,
      insecureCookies,
      csp,
      notes
    };
  }

  /**
   * Crawl internal links from the main page
   * This analyzes up to maxLinks internal links from the scraped page
   */
  async crawlInternalLinks(
    baseUrl: string, 
    links: Array<{ text: string; href: string; isExternal: boolean }>,
    maxLinks: number = 5
  ): Promise<any[]> {
    console.log(`🔗 Starting to crawl internal links (max: ${maxLinks})...`);
    
    const crawledLinks: any[] = [];
    const parsedBase = new URL(baseUrl);
    
    // Filter internal links only
    const internalLinks = links.filter(link => {
      try {
        const linkUrl = new URL(link.href, baseUrl);
        return linkUrl.origin === parsedBase.origin && !link.isExternal;
      } catch {
        return false;
      }
    }).slice(0, maxLinks);

    if (!this.browser) {
      console.log('❌ Browser not initialized for crawling');
      return crawledLinks;
    }

    for (const link of internalLinks) {
      try {
        console.log(`  📄 Crawling: ${link.href}`);
        
        // Create page with timeout protection
        const page = await Promise.race([
          this.browser.newPage(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Page creation timeout')), 20000)
          )
        ]) as any;
        
        // Set timeouts for crawling operations
        page.setDefaultTimeout(60000);
        page.setDefaultNavigationTimeout(60000);
        
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );

        const startTime = Date.now();
        const response = await page.goto(link.href, {
          waitUntil: 'domcontentloaded',  // Less strict for faster crawling
          timeout: 60000  // Increased to 60 seconds for internal links
        });

        const loadTime = Date.now() - startTime;

        if (response) {
          const status = response.status();
          const headers = response.headers();
          
          // Wait a bit for page to render
          await page.waitForTimeout(2000);
          
          // CAPTURE SCREENSHOT of the crawled page
          const screenshotBuffer = await page.screenshot({
            encoding: 'base64',
            fullPage: true,
            type: 'png'
          });
          const screenshot = `data:image/png;base64,${screenshotBuffer}`;
          
          // Get page title and meta description
          const pageInfo = await page.evaluate(() => {
            return {
              title: document.title || 'No title',
              description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
              h1: Array.from(document.querySelectorAll('h1')).map(h => h.textContent?.trim() || '').filter(t => t),
              wordCount: document.body?.innerText.split(/\s+/).filter(w => w.length > 0).length || 0
            };
          });

          crawledLinks.push({
            url: link.href,
            linkText: link.text,
            status: status,
            statusText: response.statusText(),
            contentType: headers['content-type'] || 'unknown',
            loadTimeMs: loadTime,
            title: pageInfo.title,
            description: pageInfo.description,
            h1Tags: pageInfo.h1,
            wordCount: pageInfo.wordCount,
            isHttps: link.href.startsWith('https'),
            screenshot: screenshot  // ADDED SCREENSHOT
          });
        }

        await page.close();
      } catch (error: any) {
        console.log(`  ❌ Error crawling ${link.href}:`, error.message);
        crawledLinks.push({
          url: link.href,
          linkText: link.text,
          error: error.message,
          status: 0
        });
      }
    }

    console.log(`✅ Crawled ${crawledLinks.length} internal links`);
    return crawledLinks;
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log('🔒 Puppeteer browser closed');
    }
  }
}
