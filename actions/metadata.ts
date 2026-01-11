'use server';

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
            // console.warn(`Link Metadata fetch failed for ${url}: ${res.status}`);
            return { url, title: url };
        }

        const html = await res.text();

        // Regex Extraction (Faster than JSDOM)
        const getMetaContent = (prop: string) => {
            const regex = new RegExp(`<meta\\s+(?:property|name)=["']${prop}["']\\s+content=["'](.*?)["']`, 'i');
            const match = html.match(regex);
            return match ? match[1] : null;
        };

        const getTitle = () => {
            const ogTitle = getMetaContent('og:title') || getMetaContent('twitter:title');
            if (ogTitle) return ogTitle;
            const titleMatch = html.match(/<title>(.*?)<\/title>/i);
            return titleMatch ? titleMatch[1] : null;
        };

        const title = getTitle();
        const description = getMetaContent('og:description') || getMetaContent('twitter:description') || getMetaContent('description');
        const image = getMetaContent('og:image') || getMetaContent('twitter:image');

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
