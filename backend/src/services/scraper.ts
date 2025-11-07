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
    console.log('🔍 Starting scrape for URL:', url);

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

    const page = await this.browser.newPage();

    try {
      // Set viewport
      await page.setViewport({ width: 1920, height: 1080 });

      // Set user agent
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      // Track network resources
      const networkResources: NetworkResource[] = [];
      const consoleLogs: ConsoleLog[] = [];
      const responseHeaders: { [key: string]: string } = {};

      // Listen to network requests
      page.on('response', async (response) => {
        try {
          const request = response.request();
          const timing = response.timing();
          
          networkResources.push({
            name: request.url(),
            initiatorType: request.resourceType(),
            startTimeMs: timing ? timing.requestTime : 0,
            durationMs: timing ? timing.receiveHeadersEnd : 0,
            transferSize: undefined,
            encodedBodySize: undefined
          });

          // Capture response headers from main page
          if (request.url() === url) {
            const headers = response.headers();
            Object.keys(headers).forEach(key => {
              responseHeaders[key] = headers[key];
            });
          }
        } catch (error) {
          // Ignore errors in network tracking
        }
      });

      // Listen to console messages
      page.on('console', (msg) => {
        consoleLogs.push({
          level: msg.type(),
          message: msg.text()
        });
      });

      // Navigate to page with timeout
      const response = await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      if (!response) {
        throw new Error('Failed to load page');
      }

      const status = response.status();
      if (status < 200 || status >= 400) {
        throw new Error(`HTTP error: ${status}`);
      }

      // Wait a bit for dynamic content
      await page.waitForTimeout(2000);

      // Extract page data
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

        // Extract meta tags
        const metaTags: { [key: string]: string } = {};
        // @ts-ignore - Running in browser context
        document.querySelectorAll('meta').forEach((el: any) => {
          const name = el.getAttribute('name') || el.getAttribute('property');
          const content = el.getAttribute('content');
          if (name && content) {
            metaTags[name] = content;
          }
        });

        // Extract text content
        // @ts-ignore - Running in browser context
        const body = document.body;
        const textContent = body ? body.innerText : '';

        return {
          title,
          description,
          headings,
          links,
          images,
          metaTags,
          textContent,
          // @ts-ignore - Running in browser context
          htmlContent: document.documentElement.outerHTML
        };
      });

      // Take screenshot
      const screenshotBuffer = await page.screenshot({
        encoding: 'base64',
        fullPage: false,
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
        securityReport
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
      'referrer-policy'
    ];
    
    const missingSecurityHeaders = expectedHeaders.filter(
      header => !Object.keys(headers).some(h => h.toLowerCase() === header)
    );

    // Check for mixed content
    let mixedContent = false;
    if (isHttps) {
      if (html.includes('http://')) {
        mixedContent = true;
      }
      resources.forEach(res => {
        if (res.name.startsWith('http://')) {
          mixedContent = true;
        }
      });
    }

    // Get CSP header
    const csp = headers['content-security-policy'] || 
                headers['Content-Security-Policy'];

    // Generate notes
    const notes: string[] = [];
    if (html.toLowerCase().includes('jquery')) {
      notes.push('Detected jQuery references; consider checking version for known vulnerabilities');
    }
    if (html.toLowerCase().includes('wordpress')) {
      notes.push('WordPress site detected; consider known WP plugin vulnerabilities');
    }

    return {
      isHttps,
      mixedContent,
      missingSecurityHeaders,
      insecureCookies: false, // Will be implemented with cookie parsing
      csp,
      notes
    };
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log('🔒 Puppeteer browser closed');
    }
  }
}
