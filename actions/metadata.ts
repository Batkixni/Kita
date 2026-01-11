'use server';

import { JSDOM } from 'jsdom';

export interface LinkMetadata {
    title?: string;
    description?: string;
    image?: string;
    url: string;
}

export async function getLinkMetadata(url: string): Promise<LinkMetadata> {
    try {
        // Ensure protocol
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }

        const res = await fetch(url, {
            headers: {
                'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)', // Facebook's bot is frequently whitelisted
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!res.ok) {
            // Silently fail for 404/403 to avoid console spam, just return basic URL
            console.warn(`Link Metadata fetch failed for ${url}: ${res.status}`);
            return { url, title: url };
        }

        const html = await res.text();
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        const getMeta = (prop: string) =>
            doc.querySelector(`meta[property="${prop}"]`)?.getAttribute('content') ||
            doc.querySelector(`meta[name="${prop}"]`)?.getAttribute('content');

        const title = getMeta('og:title') || getMeta('twitter:title') || doc.title;
        const description = getMeta('og:description') || getMeta('twitter:description') || getMeta('description');
        const image = getMeta('og:image') || getMeta('twitter:image');

        return {
            title: title || '',
            description: description || '',
            image: image || '',
            url
        };
    } catch (error) {
        console.error("Link Preview Error:", error);
        return { url, title: url };
    }
}
