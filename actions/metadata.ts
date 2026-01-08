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
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', // Imitate real browser
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!res.ok) throw new Error('Failed to fetch URL');

        const html = await res.text();
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        const getMeta = (prop: string) =>
            doc.querySelector(`meta[property="${prop}"]`)?.getAttribute('content') ||
            doc.querySelector(`meta[name="${prop}"]`)?.getAttribute('content');

        const title = getMeta('og:title') || doc.title;
        const description = getMeta('og:description') || getMeta('description');
        const image = getMeta('og:image');

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
