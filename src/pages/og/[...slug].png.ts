
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import type { APIRoute } from 'astro';

const pages = [
    {
        slug: undefined,
        title: 'Minecraft Plugin Config Generator',
        description: 'Generate professional-grade configurations for your Minecraft plugins with ease.',
    },
    {
        slug: 'generators/playerkits',
        title: 'PlayerKits 2.x Generator',
        description: 'Create complex survival kits, daily rewards, and starter gear for PlayerKits 2.x.',
    },
    {
        slug: 'generators/vanguardranks',
        title: 'VanguardRanks Generator',
        description: 'Design custom rank progression systems with icons, lore, and requirements.',
    },
];

export function getStaticPaths() {
    return pages.map((page) => ({
        params: { slug: page.slug },
        props: { title: page.title, description: page.description },
    }));
}

export const GET: APIRoute = async ({ props }) => {
    const { title, description } = props;

    // Fetch font with error handling (Using Lato as it's more reliable than Inter on GitHub)
    const fontResponse = await fetch(
        'https://raw.githubusercontent.com/google/fonts/main/ofl/lato/Lato-Bold.ttf'
    );

    if (!fontResponse.ok) {
        throw new Error(`Failed to fetch font: ${fontResponse.statusText}`);
    }

    const fontData = await fontResponse.arrayBuffer();

    const svg = await satori(
        {
            type: 'div',
            props: {
                children: [
                    {
                        type: 'div',
                        props: {
                            children: [
                                {
                                    type: 'div',
                                    props: {
                                        children: 'MC Config Gen',
                                        style: {
                                            fontSize: 32,
                                            fontWeight: 'bold',
                                            color: '#6366f1',
                                        },
                                    },
                                },
                                {
                                    type: 'h1',
                                    props: {
                                        children: title,
                                        style: {
                                            fontSize: 60,
                                            fontWeight: 'bold',
                                            color: '#ffffff',
                                            marginTop: 20,
                                            lineHeight: 1.2,
                                        },
                                    },
                                },
                                {
                                    type: 'p',
                                    props: {
                                        children: description,
                                        style: {
                                            fontSize: 30,
                                            color: '#94a3b8',
                                            marginTop: 20,
                                            lineHeight: 1.4,
                                        },
                                    },
                                },
                            ],
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                padding: '60px',
                                width: '100%',
                                height: '100%',
                            },
                        },
                    },
                    {
                        type: 'div',
                        props: {
                            style: {
                                position: 'absolute',
                                bottom: 40,
                                right: 60,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                            },
                            children: [
                                {
                                    type: 'div',
                                    props: {
                                        children: 'mc-config-gen.hira.im',
                                        style: {
                                            color: '#6366f1',
                                            fontSize: 24,
                                            fontWeight: 'bold'
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ],
                style: {
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    backgroundColor: '#0f172a',
                    position: 'relative',
                    border: '16px solid #1e293b',
                },
            },
        } as any,
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: 'Lato',
                    data: fontData,
                    weight: 700,
                    style: 'normal',
                },
            ],
        }
    );

    const resvg = new Resvg(svg, {
        fitTo: {
            mode: 'width',
            value: 1200,
        },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return new Response(new Uint8Array(pngBuffer), {
        headers: {
            'Content-Type': 'image/png',
        },
    });
};
