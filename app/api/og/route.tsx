import { ImageResponse } from 'next/og';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');

        // Default / Fallback
        if (!username) {
            return new ImageResponse(
                (
                    <div style={{
                        height: '100%', width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#09090b',
                        color: 'white',
                        fontFamily: 'sans-serif'
                    }}>
                        <h1 style={{ fontSize: 60, fontWeight: 'bold' }}>Kita</h1>
                    </div>
                ),
                { width: 1200, height: 630 }
            );
        }

        const user = await db.query.users.findFirst({
            where: eq(users.username, username),
            columns: {
                name: true,
                username: true,
                image: true,
            }
        });

        const displayName = user?.name || user?.username || 'User';
        const displayHandle = user?.username || username;
        const avatar = user?.image;

        return new ImageResponse(
            (
                <div style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    backgroundColor: '#09090b',
                    position: 'relative',
                    fontFamily: 'sans-serif',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* --- BACKGROUND LAYERS --- */}

                    {/* Grid Pattern */}
                    <div style={{
                        display: 'flex',
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundImage: 'linear-gradient(#27272a 1px, transparent 1px), linear-gradient(to right, #27272a 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        opacity: 0.3
                    }} />

                    {/* Top Blob (Primary/Indigo) - Radial Gradient for Satori Support */}
                    <div style={{
                        display: 'flex',
                        position: 'absolute',
                        top: '-200px',
                        left: '200px',
                        width: '800px',
                        height: '800px',
                        backgroundImage: 'radial-gradient(circle, rgba(79, 70, 229, 0.3) 0%, transparent 70%)',
                        opacity: 0.8
                    }} />

                    {/* Bottom Blob (Primary Accent) - Radial Gradient for Satori Support */}
                    <div style={{
                        display: 'flex',
                        position: 'absolute',
                        bottom: '-200px',
                        right: '200px',
                        width: '800px',
                        height: '800px',
                        backgroundImage: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
                        opacity: 0.8
                    }} />


                    {/* --- MAIN CARD --- */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '900px',
                        height: '450px',
                        backgroundColor: '#18181b', // zinc-900 card bg
                        border: '1px solid #3f3f46', // zinc-700 border
                        borderRadius: '40px',
                        padding: '60px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        justifyContent: 'space-between',
                        zIndex: 10
                    }}>
                        {/* Card Header: Avatar + Badge */}
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                            {avatar ? (
                                <img src={avatar} style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '24px', // Squircle-ish
                                    objectFit: 'cover',
                                    border: '1px solid #3f3f46'
                                }} />
                            ) : (
                                <div style={{
                                    width: '100px', height: '100px', borderRadius: '24px', backgroundColor: '#27272a',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '40px', color: 'white', fontWeight: 'bold', border: '1px solid #3f3f46'
                                }}>
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                            )}

                            <div style={{
                                display: 'flex',
                                padding: '8px 20px',
                                backgroundColor: '#27272a',
                                border: '1px solid #3f3f46',
                                borderRadius: '100px',
                                color: '#a1a1aa', // muted foreground
                                fontSize: '20px',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                Kita Page
                            </div>
                        </div>

                        {/* Card Content: Name + Handle */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{
                                display: 'flex',
                                fontSize: '80px',
                                fontWeight: 800,
                                color: 'white',
                                lineHeight: 1.0,
                                letterSpacing: '-2px'
                            }}>
                                {displayName}
                            </div>
                            <div style={{
                                display: 'flex',
                                fontSize: '32px',
                                color: '#a1a1aa',
                                fontWeight: 500,
                                marginTop: '10px'
                            }}>
                                kita.zone/{displayHandle}
                            </div>
                        </div>
                    </div>

                    {/* Floating Decor (Arrow/Icon like Landing) */}
                    <div style={{
                        display: 'flex',
                        position: 'absolute',
                        bottom: '50px',
                        right: '50px',
                        color: '#52525b',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        opacity: 0.5
                    }}>
                        kita.
                    </div>

                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );

    } catch (e: any) {
        console.error("OG Error:", e);
        return new ImageResponse(
            <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', color: 'white', backgroundColor: 'black' }}>
                Failed to generate image
            </div>,
            { width: 1200, height: 630 }
        );
    }
}
