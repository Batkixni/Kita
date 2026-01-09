'use server';

import { JSDOM } from 'jsdom';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

function isPrivateIP(hostname: string) {
    return hostname === 'localhost' ||
        hostname.startsWith('127.') ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.endsWith('.local') ||
        hostname === '[::1]';
}

export async function getLinkMetadata(url: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return { title: null, description: null, image: null };
    }

    try {
        const parsedUrl = new URL(url);

        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            return { title: null, description: null, image: null };
        }

        if (isPrivateIP(parsedUrl.hostname)) {
            console.warn("Blocked SSRF attempt:", url);
            return { title: null, description: null, image: null };
        }

        const response = await fetch(url, {
            signal: AbortSignal.timeout(5000) // 5s timeout
        });

        if (!response.ok) return { title: null, description: null, image: null };

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
