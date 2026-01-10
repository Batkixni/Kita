'use server';

export interface YouTubeVideo {
    id: string;
    title: string;
    thumbnail: string;
    link: string;
    published: string;
}

export interface YouTubeChannelData {
    type: 'youtube-channel';
    channelId: string;
    title: string;
    avatar: string;
    subscriberCount?: string; // Hard to get without API/complex scraping, might omit or mock
    videos: YouTubeVideo[];
}

async function getChannelIdFromUrl(url: string): Promise<string | null> {
    try {
        const urlObj = new URL(url);
        const path = urlObj.pathname;

        // 1. Direct verify (youtube.com/channel/UC...)
        if (path.startsWith('/channel/')) {
            return path.split('/')[2];
        }

        // 2. Handle (@user) or User (/user/name) or Custom (/c/name)
        // We need to fetch the page and look for channelId
        // YouTube pages usually have <meta itemprop="channelId" content="UC..."> or <meta property="og:url" content=".../channel/UC...">

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        const html = await response.text();

        // Try meta itemprop="channelId"
        const channelIdMatch = html.match(/<meta itemprop="channelId" content="(UC[\w-]+)"/);
        if (channelIdMatch) return channelIdMatch[1];

        // Try og:url
        const ogUrlMatch = html.match(/<meta property="og:url" content="https:\/\/www\.youtube\.com\/channel\/(UC[\w-]+)"/);
        if (ogUrlMatch) return ogUrlMatch[1];

        return null;

    } catch (e) {
        console.error('Error fetching channel ID:', e);
        return null;
    }
}

export async function getYouTubeChannelData(url: string): Promise<YouTubeChannelData | null> {
    // 1. Validate Host
    try {
        const u = new URL(url);
        if (!u.hostname.includes('youtube.com') && !u.hostname.includes('youtu.be')) return null;

        // Ignore single video links (watch?v=) - handled by normal link or specific embed?
        // User asked for "Channel Link" specifically.
        if (u.pathname.startsWith('/watch') || u.pathname.startsWith('/shorts')) return null;

    } catch { return null; }

    const channelId = await getChannelIdFromUrl(url);
    if (!channelId) return null;

    // 2. Fetch RSS Feed
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    try {
        const res = await fetch(rssUrl, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const xml = await res.text();

        // 3. Parse XML (Cheerio/Regex) - using Regex for simplicity/speed without deps
        // Extract Title
        const channelTitleMatch = xml.match(/<title>(.*?)<\/title>/);
        const channelTitle = channelTitleMatch ? channelTitleMatch[1] : 'YouTube Channel';

        // Extract Entries
        const videos: YouTubeVideo[] = [];
        const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
        let match;

        while ((match = entryRegex.exec(xml)) !== null && videos.length < 4) {
            const entryBlock = match[1];

            const vidIdMatch = entryBlock.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
            const titleMatch = entryBlock.match(/<media:title>(.*?)<\/media:title>/);
            const thumbMatch = entryBlock.match(/<media:thumbnail url="(.*?)"/);
            const publishedMatch = entryBlock.match(/<published>(.*?)<\/published>/);

            if (vidIdMatch && titleMatch && thumbMatch) {
                videos.push({
                    id: vidIdMatch[1],
                    title: titleMatch[1],
                    thumbnail: thumbMatch[1],
                    link: `https://www.youtube.com/watch?v=${vidIdMatch[1]}`,
                    published: publishedMatch ? publishedMatch[1] : ''
                });
            }
        }

        // 4. Get Avatar (Hard to get from RSS, reuse thumbnail or fetch page? 
        // RSS does not provide channel avatar. 
        // We might need to rely on the page fetch we did earlier?
        // Let's assume we can live without it or default to YT icon, 
        // OR try to scrape it from the HTML we fetched earlier if we pass it down.
        // For now, let's just return the data. The screenshot showed a Red YT logo mostly? 
        // No, screenshot shows specific avatar "Youtube" (maybe just the name).
        // Screenshot has a red YT logo.

        return {
            type: 'youtube-channel',
            channelId,
            title: channelTitle,
            avatar: '', // TODO: scrape from page if needed
            videos
        };

    } catch (e) {
        console.error('Error fetching RSS:', e);
        return null;
    }
}
