'use server'

export interface GitHubData {
    type: 'github-profile';
    username: string;
    contributionRows: number[][]; // 7 rows x ~53 cols
    totalContributions?: number;
}

export async function getGitHubData(url: string): Promise<GitHubData | null> {
    try {
        if (!url.includes('github.com/')) return null;

        const usernameMap = url.match(/github\.com\/([^\/]+)/);
        if (!usernameMap) return null;
        const username = usernameMap[1];

        const targetUrl = `https://github.com/users/${username}/contributions`;

        const res = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: { revalidate: 3600 }
        });

        if (!res.ok) return null;
        const html = await res.text();

        // Parse Rows (tr)
        // Regex is tricky for nested, but the structure is <tr>...</tr>.
        // We can split by <tr
        const rows: number[][] = [];

        // Find the calendar graph container to be safe
        const calendarStart = html.indexOf('js-calendar-graph');
        if (calendarStart === -1) return null;

        const graphHtml = html.substring(calendarStart);

        // Split by <tr>. The first split might be garbage before first tr.
        const trs = graphHtml.split('<tr').slice(1);

        // We expect 7 rows.
        for (let i = 0; i < Math.min(trs.length, 7); i++) {
            const tr = trs[i];
            const levels: number[] = [];

            // Regex for data-level="X"
            // global match
            const matches = tr.matchAll(/data-level="(\d+)"/g);
            for (const m of matches) {
                levels.push(parseInt(m[1], 10));
            }

            if (levels.length > 0) {
                rows.push(levels);
            }
        }

        if (rows.length === 0) return null;

        // Optional: Extract total contributions
        // Usually found in h2 class="f4 text-normal mb-2"
        // "3,157 contributions in the last year"
        const totalMatch = html.match(/([\d,]+)\s+contributions/);
        const totalContributions = totalMatch ? parseInt(totalMatch[1].replace(/,/g, ''), 10) : 0;

        return {
            type: 'github-profile',
            username,
            contributionRows: rows,
            totalContributions
        };

    } catch (e) {
        console.error('GitHub fetch error:', e);
        return null;
    }
}
