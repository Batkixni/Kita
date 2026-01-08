'use server';

import { JSDOM } from 'jsdom';

export async function getLinkMetadata(url: string) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        const title = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || doc.title;
        const description = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
        const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');

        return { title, description, image };
    } catch (error) {
        console.error("Error fetching link metadata", error);
        return { title: null, description: null, image: null };
    }
}
