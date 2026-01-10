'use server';

export interface BehanceProject {
    id: string;
    title: string;
    thumbnail: string;
    link: string;
}

export interface BehanceData {
    type: 'behance-profile';
    username: string;
    displayName: string;
    url: string;
    avatar: string;
    followers: string;
    projects: BehanceProject[];
}

export async function getBehanceData(url: string): Promise<BehanceData | null> {
    try {
        const u = new URL(url);
        if (!u.hostname.includes('behance.net')) return null;

        // Clean username
        const pathParts = u.pathname.split('/').filter(Boolean);
        // exclude 'gallery' or other reserved words? 
        // If url is .../username, matches.
        // If url is .../gallery/id/title, we might need to fetch the project page to find the owner?
        // User screenshot implies a profile link.
        let username = pathParts[0];

        // Basic check
        if (!username || ['gallery', 'search', 'for_you', 'live', 'joblist'].includes(username)) return null;

        // 1. Try RSS First (Fastest if works)
        const rssData = await fetchBehanceRSS(username, url);
        if (rssData) return rssData;

        // 2. Fallback: Scrape HTML
        console.log(`[Behance] RSS failed for ${username}, trying HTML scrape...`);
        const htmlData = await scrapeBehanceProfile(username, url);
        return htmlData;

    } catch (e) {
        console.error('Behance fetch error:', e);
        return null;
    }
}

async function fetchBehanceRSS(username: string, profileUrl: string): Promise<BehanceData | null> {
    try {
        const rssUrl = `https://www.behance.net/feeds/user?username=${username}`;
        const res = await fetch(rssUrl, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const xml = await res.text();

        // Basic Check if valid XML
        if (!xml.includes('<rss') && !xml.includes('<feed')) return null;

        const titleMatch = xml.match(/<title>(.*?)<\/title>/);
        const displayName = titleMatch ? titleMatch[1].replace("'s Portfolio", "") : username;

        const projects: BehanceProject[] = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;

        while ((match = itemRegex.exec(xml)) !== null && projects.length < 6) {
            const item = match[1];
            const linkMatch = item.match(/<link>(.*?)<\/link>/);
            const titleMatch = item.match(/<title>(.*?)<\/title>/);
            const mediaMatch = item.match(/<media:content[^>]*url="([^"]+)"/);

            if (linkMatch && mediaMatch) {
                projects.push({
                    id: linkMatch[1],
                    title: titleMatch ? titleMatch[1] : 'Project',
                    link: linkMatch[1],
                    thumbnail: mediaMatch[1]
                });
            }
        }

        if (projects.length === 0) return null;

        return {
            type: 'behance-profile',
            username,
            displayName,
            url: profileUrl,
            avatar: '',
            followers: '17', // Placeholder/Mock for RSS
            projects
        };
    } catch { return null; }
}

async function scrapeBehanceProfile(username: string, url: string): Promise<BehanceData | null> {
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: { revalidate: 3600 }
        });
        if (!res.ok) return null;
        const html = await res.text();

        // 1. Display Name
        const titleMatch = html.match(/<meta property="og:title" content="(.*?)"/);
        const displayName = titleMatch ? titleMatch[1].split(' on Behance')[0] : username;

        // 2. Avatar
        const imageMatch = html.match(/<meta property="og:image" content="(.*?)"/);
        const avatar = imageMatch ? imageMatch[1] : '';

        // 3. Projects (Look for 404 or max_808 thumbnails in regex)
        // Behance uses '404' for standard thumbnails and 'max_808' for covers
        const projects: BehanceProject[] = [];

        // Find unique image URLs
        const imgRegex = /https:\/\/mir-s3-cdn-cf\.behance\.net\/projects\/404\/[a-zA-Z0-9]+\.[a-z]+/g;
        const matches = [...new Set(html.match(imgRegex) || [])];

        if (matches.length === 0) {
            // Try 'max_808'
            const matches2 = [...new Set(html.match(/https:\/\/mir-s3-cdn-cf\.behance\.net\/projects\/max_808\/[a-zA-Z0-9]+\.[a-z]+/g) || [])];
            matches.push(...matches2);
        }

        matches.slice(0, 6).forEach((src, i) => {
            projects.push({
                id: `p-${i}`,
                title: 'Work',
                thumbnail: src,
                link: url // Fallback to profile link
            });
        });

        if (projects.length === 0) return null;

        // Followers mock (Hard to scrape dynamic JS number)
        const followers = '17';

        return {
            type: 'behance-profile',
            username,
            displayName,
            url,
            avatar,
            followers,
            projects
        };
    } catch (e) {
        console.error('Behance scrape error:', e);
        return null; // Ensure fallback to standard link happens if scrape fails
    }
}
