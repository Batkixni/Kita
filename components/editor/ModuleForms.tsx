'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";
import { ArrowUp, Loader2 } from "lucide-react";
import { SyntaxGuideDialog } from "./SyntaxGuideDialog";

interface FormProps {
    onAdd: (type: string, content: any, w?: number, h?: number) => void;
    isLoading?: boolean;
    themeConfig?: any;
    initialData?: any;
}


export function ProjectForm({ onAdd, isLoading, initialData }: FormProps) {
    // Default to at least one empty project if none provided
    const [projects, setProjects] = useState<any[]>(initialData?.projects || [{ title: "", desc: "", link: "", image: "" }]);
    const [activeIndex, setActiveIndex] = useState(0);

    const updateProject = (index: number, field: string, value: string) => {
        const newProjects = [...projects];
        newProjects[index] = { ...newProjects[index], [field]: value };
        setProjects(newProjects);
    };

    const addProject = () => {
        setProjects([...projects, { title: "", desc: "", link: "", image: "" }]);
        setActiveIndex(projects.length);
    };

    const removeProject = (index: number) => {
        const newProjects = projects.filter((_, i) => i !== index);
        setProjects(newProjects.length ? newProjects : [{ title: "", desc: "", link: "", image: "" }]);
        setActiveIndex(0);
    };

    const handleSubmit = () => {
        if (projects.some(p => !p.title)) return; // Simple validation: all must have titles

        const shortcode = projects.map(p =>
            `{{project title="${p.title}" desc="${p.desc}" link="${p.link || '#'}" image="${p.image}"}}`
        ).join('\n');

        onAdd('custom', { text: shortcode }, 4, (projects.length > 2) ? 2 : 1);
    };

    return (
        <div className="w-[340px] p-1 flex flex-col gap-3">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
                {projects.map((p, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`flex-shrink-0 snap-start px-3 py-1 text-xs rounded-full border transition-all ${activeIndex === i ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground hover:border-primary/50'}`}
                    >
                        {p.title || `Project ${i + 1}`}
                    </button>
                ))}
                <button
                    onClick={addProject}
                    className="flex-shrink-0 px-2 py-1 text-xs rounded-full border border-dashed border-muted-foreground/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                    title="Add another project"
                >
                    +
                </button>
            </div>

            {projects[activeIndex] && (
                <div className="space-y-3 border p-3 rounded-xl bg-secondary/20 relative animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="absolute top-2 right-2">
                        {projects.length > 1 && (
                            <button onClick={() => removeProject(activeIndex)} className="text-muted-foreground hover:text-destructive transition-colors">
                                <span className="sr-only">Delete</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs">Project Title</Label>
                        <Input
                            value={projects[activeIndex].title}
                            onChange={e => updateProject(activeIndex, 'title', e.target.value)}
                            placeholder="My Cool Project"
                            className="h-8 text-xs"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Description</Label>
                        <Textarea
                            value={projects[activeIndex].desc}
                            onChange={e => updateProject(activeIndex, 'desc', e.target.value)}
                            placeholder="Short description..."
                            className="h-16 text-xs resize-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Link (Optional)</Label>
                        <Input
                            value={projects[activeIndex].link}
                            onChange={e => updateProject(activeIndex, 'link', e.target.value)}
                            placeholder="https://..."
                            className="h-8 text-xs"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Thumbnail (16:9 Recommended)</Label>
                        <div className="h-24">
                            <ImageUpload
                                value={projects[activeIndex].image}
                                onChange={(val) => updateProject(activeIndex, 'image', val)}
                                className="h-full"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-muted-foreground">{projects.length} project{projects.length > 1 ? 's' : ''}</span>
                <Button size="sm" onClick={handleSubmit} disabled={isLoading || projects.some(p => !p.title)}>
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : initialData ? "Save Changes" : "Create List"}
                </Button>
            </div>
        </div>
    );
}

export function ProjectCardForm({ onAdd, isLoading, initialData }: FormProps) {
    // Default to at least one empty project if none provided
    // Structure: { projects: [ { title, desc, link, image } ] }
    const initialProjects = initialData?.projects || [{ title: "", desc: "", link: "", image: "" }];
    const [projects, setProjects] = useState<any[]>(initialProjects);
    const [activeIndex, setActiveIndex] = useState(0);

    const updateProject = (index: number, field: string, value: string) => {
        const newProjects = [...projects];
        newProjects[index] = { ...newProjects[index], [field]: value };
        setProjects(newProjects);
    };

    const addProject = () => {
        setProjects([...projects, { title: "", desc: "", link: "", image: "" }]);
        setActiveIndex(projects.length);
    };

    const removeProject = (index: number) => {
        const newProjects = projects.filter((_, i) => i !== index);
        setProjects(newProjects.length ? newProjects : [{ title: "", desc: "", link: "", image: "" }]);
        setActiveIndex(0);
    };

    const handleSubmit = () => {
        if (projects.some(p => !p.title)) return; // Simple validation: all must have titles

        // Save as 'project-card' type with structured content
        onAdd('project-card', { projects }, 4, 3);
    };

    return (
        <div className="w-[340px] p-1 flex flex-col gap-3">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
                {projects.map((p, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`flex-shrink-0 snap-start px-3 py-1 text-xs rounded-full border transition-all ${activeIndex === i ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground hover:border-primary/50'}`}
                    >
                        {p.title || `Project ${i + 1}`}
                    </button>
                ))}
                <button
                    onClick={addProject}
                    className="flex-shrink-0 px-2 py-1 text-xs rounded-full border border-dashed border-muted-foreground/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                    title="Add another project"
                >
                    +
                </button>
            </div>

            {projects[activeIndex] && (
                <div className="space-y-3 border p-3 rounded-xl bg-secondary/20 relative animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="absolute top-2 right-2">
                        {projects.length > 1 && (
                            <button onClick={() => removeProject(activeIndex)} className="text-muted-foreground hover:text-destructive transition-colors">
                                <span className="sr-only">Delete</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs">Project Title</Label>
                        <Input
                            value={projects[activeIndex].title}
                            onChange={e => updateProject(activeIndex, 'title', e.target.value)}
                            placeholder="My Cool Project"
                            className="h-8 text-xs"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Description</Label>
                        <Textarea
                            value={projects[activeIndex].desc}
                            onChange={e => updateProject(activeIndex, 'desc', e.target.value)}
                            placeholder="Short description..."
                            className="h-16 text-xs resize-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Link (Optional)</Label>
                        <Input
                            value={projects[activeIndex].link}
                            onChange={e => updateProject(activeIndex, 'link', e.target.value)}
                            placeholder="https://..."
                            className="h-8 text-xs"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Thumbnail (16:9 Recommended)</Label>
                        <div className="h-24">
                            <ImageUpload
                                value={projects[activeIndex].image}
                                onChange={(val) => updateProject(activeIndex, 'image', val)}
                                className="h-full"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-muted-foreground">{projects.length} project{projects.length > 1 ? 's' : ''}</span>
                <Button size="sm" onClick={handleSubmit} disabled={isLoading || projects.some(p => !p.title)}>
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : initialData ? "Save Changes" : "Create Card"}
                </Button>
            </div>
        </div>
    );
}

export function MetricForm({ onAdd, isLoading, initialData }: FormProps) {
    const [label, setLabel] = useState(initialData?.label || "");
    const [value, setValue] = useState(initialData?.value || "");
    const [unit, setUnit] = useState(initialData?.unit || "");

    const handleSubmit = () => {
        if (!label || !value) return;
        const shortcode = `{{metric label="${label}" value="${value}" unit="${unit}"}}`;
        onAdd('custom', { text: shortcode }, 2, 2);
    };

    return (
        <div className="w-[240px] p-1 flex flex-col gap-3">
            <div className="space-y-1">
                <Label className="text-xs">Label</Label>
                <Input value={label} onChange={e => setLabel(e.target.value)} placeholder="Revenue" className="h-8 text-xs" />
            </div>
            <div className="flex gap-2">
                <div className="space-y-1 flex-1">
                    <Label className="text-xs">Value</Label>
                    <Input value={value} onChange={e => setValue(e.target.value)} placeholder="$10k" className="h-8 text-xs" />
                </div>
                <div className="space-y-1 w-16">
                    <Label className="text-xs">Unit</Label>
                    <Input value={unit} onChange={e => setUnit(e.target.value)} placeholder="+10%" className="h-8 text-xs" />
                </div>
            </div>
            <div className="flex justify-end pt-2">
                <Button size="sm" onClick={handleSubmit} disabled={isLoading || !label || !value}>
                    {initialData ? "Save Changes" : "Add Metric"}
                </Button>
            </div>
        </div>
    );
}

export function BadgeForm({ onAdd, isLoading, initialData }: FormProps) {
    const [text, setText] = useState(initialData?.text || "");
    const [color, setColor] = useState(initialData?.color || "stone");

    const handleSubmit = () => {
        if (!text) return;
        const shortcode = `{{badge text="${text}" color="${color}"}}`;
        onAdd('custom', { text: shortcode }, 2, 1);
    };

    return (
        <div className="w-[240px] p-1 flex flex-col gap-3">
            <div className="space-y-1">
                <Label className="text-xs">Badge Text</Label>
                <Input value={text} onChange={e => setText(e.target.value)} placeholder="Open Source" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
                <Label className="text-xs">Color</Label>
                <Select value={color} onValueChange={setColor}>
                    <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="stone">Default (Stone)</SelectItem>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="yellow">Yellow</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-end pt-2">
                <Button size="sm" onClick={handleSubmit} disabled={isLoading || !text}>
                    {initialData ? "Save Changes" : "Add Badge"}
                </Button>
            </div>
        </div>
    );
}



export function ImageForm({ onAdd, isLoading, initialData }: FormProps) {
    const [url, setUrl] = useState(initialData?.url || "");

    const handleSubmit = () => {
        if (!url) return;
        onAdd('image', { src: url, alt: 'Image' }, 2, 2);
    };

    return (
        <div className="w-[300px] p-1 flex flex-col gap-3">
            <Label className="text-xs">Upload Image</Label>
            <div className="h-32">
                <ImageUpload value={url} onChange={setUrl} className="h-full" />
            </div>
            <div className="flex justify-end pt-2">
                <Button size="sm" onClick={handleSubmit} disabled={isLoading || !url}>
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : initialData ? "Save Changes" : "Add Image"}
                </Button>
            </div>
        </div>
    );
}

export function LinkForm({ onAdd, isLoading, initialData }: FormProps) {
    const [url, setUrl] = useState(initialData?.url || "");

    const handleSubmit = () => {
        if (!url) return;
        onAdd('link', { url }, 2, 2);
    };

    return (
        <div className="w-[300px] flex items-center gap-2">
            <Input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Paste link here..."
                className="h-9 text-xs flex-1 border-border focus-visible:ring-ring bg-muted text-foreground"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                autoFocus
            />
            <Button size="sm" onClick={handleSubmit} disabled={isLoading || !url} className="h-9 w-9 p-0 shrink-0 rounded-xl">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
            </Button>
        </div>
    );
}

export function TextForm({ onAdd, isLoading, initialData }: FormProps) {
    const [text, setText] = useState(initialData?.text || "");

    const handleSubmit = () => {
        if (!text) return;
        onAdd('text', { text }, 2, 1);
    };

    return (
        <div className="w-[300px] flex items-center gap-2">
            <Input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Enter text..."
                className="h-9 text-xs flex-1 border-border focus-visible:ring-ring bg-muted text-foreground"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                autoFocus
            />
            <Button size="sm" onClick={handleSubmit} disabled={isLoading || !text} className="h-9 w-9 p-0 shrink-0 rounded-xl">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
            </Button>
        </div>
    );
}

export function SectionForm({ onAdd, isLoading, initialData }: FormProps) {
    const [text, setText] = useState(initialData?.text || "");

    const handleSubmit = () => {
        if (!text) return;
        onAdd('section-title', { text }, 8, 1);
    };

    return (
        <div className="w-[300px] flex items-center gap-2">
            <Input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Section Title..."
                className="h-9 text-xs flex-1 border-border focus-visible:ring-ring bg-muted text-foreground"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                autoFocus
            />
            <Button size="sm" onClick={handleSubmit} disabled={isLoading || !text} className="h-9 w-9 p-0 shrink-0 rounded-xl">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
            </Button>
        </div>
    );
}

export function CustomForm({ onAdd, isLoading, themeConfig, initialData }: FormProps) {
    const [text, setText] = useState(initialData?.text || "");

    const handleSubmit = () => {
        if (!text) return;
        onAdd('custom', { text }, 4, 2);
    };

    return (
        <div className="w-[400px] p-1 flex flex-col gap-2">
            <div className="flex justify-between items-end mb-2">
                <Label className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">Custom Code</Label>
                <div className="scale-75 origin-right">
                    <SyntaxGuideDialog themeConfig={themeConfig} />
                </div>
            </div>
            <Textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={`{{project ...}}\n<div class="bg-red-500">...</div>`}
                className="h-48 text-xs font-mono resize-none focus-visible:ring-ring bg-muted text-foreground border-border"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleSubmit();
                    }
                }}
            />
            <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-muted-foreground">Ctrl + Enter to submit</span>
                <Button size="sm" onClick={handleSubmit} disabled={isLoading || !text}>
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : initialData ? "Save Changes" : "Add Code"}
                </Button>
            </div>
        </div>
    );
}


export function InfoCardForm({ onAdd, isLoading, initialData }: FormProps) {
    const [name, setName] = useState(initialData?.name || "Kita User");
    const [bio, setBio] = useState(initialData?.bio || "Digital creator building cool things.");
    const [badges, setBadges] = useState(initialData?.badges || "Pro, Dev");
    const [twitter, setTwitter] = useState(initialData?.twitter || "");
    const [github, setGithub] = useState(initialData?.github || "");
    const [portfolio, setPortfolio] = useState(initialData?.link || "");
    const [linkText, setLinkText] = useState(initialData?.linkText || "View Portfolio");

    // Initialize twitter/github from socials if editing and not explicitly passed separate
    useState(() => {
        if (initialData?.socials) {
            const parts = initialData.socials.split(",").map((s: string) => s.trim());
            const tw = parts.find((s: string) => s.includes("twitter") || s.includes("x.com"));
            const gh = parts.find((s: string) => s.includes("github"));
            if (tw && !initialData.twitter) setTwitter(tw);
            if (gh && !initialData.github) setGithub(gh);
        }
    });

    const handleSubmit = () => {
        if (!name) return;

        let socials = "";
        if (twitter) socials += `${twitter},`;
        if (github) socials += `${github},`;

        const shortcode = `{{profile name="${name}" bio="${bio}" badges="${badges}" socials="${socials}" link="${portfolio}" linkText="${linkText}"}}`;
        onAdd('custom', { text: shortcode }, 4, 3); // 4x3 Grid (Large Card)
    };

    return (
        <div className="w-[320px] p-1 flex flex-col gap-3">
            <div className="space-y-1">
                <Label className="text-xs">Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
                <Label className="text-xs">Badges (comma separated)</Label>
                <Input value={badges} onChange={e => setBadges(e.target.value)} placeholder="Pro, Designer, Indie" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
                <Label className="text-xs">Bio</Label>
                <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Short bio..." className="h-16 text-xs resize-none" />
            </div>
            <div className="space-y-1">
                <Label className="text-xs">Twitter / GitHub (URLs)</Label>
                <div className="flex gap-2">
                    <Input value={twitter} onChange={e => setTwitter(e.target.value)} placeholder="Twitter URL" className="h-8 text-xs" />
                    <Input value={github} onChange={e => setGithub(e.target.value)} placeholder="GitHub URL" className="h-8 text-xs" />
                </div>
            </div>
            <div className="space-y-1">
                <Label className="text-xs">Portfolio Link & Text</Label>
                <div className="flex gap-2">
                    <Input value={portfolio} onChange={e => setPortfolio(e.target.value)} placeholder="https://..." className="h-8 text-xs flex-[2]" />
                    <Input value={linkText} onChange={e => setLinkText(e.target.value)} placeholder="Label" className="h-8 text-xs flex-1" />
                </div>
            </div>
            <div className="flex justify-end pt-2">
                <Button size="sm" onClick={handleSubmit} disabled={isLoading || !name}>
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : initialData ? "Save Changes" : "Add Info Card"}
                </Button>
            </div>
        </div>
    );
}

export function SocialForm({ onAdd, isLoading, initialData }: FormProps) {
    const [platform, setPlatform] = useState(initialData?.platform || "github");

    // Github Props
    const [user, setUser] = useState(initialData?.user || "");
    const [title, setTitle] = useState(initialData?.title || "");

    // YouTube Props
    const [channel, setChannel] = useState(initialData?.user || "");
    const [subs, setSubs] = useState(initialData?.subs || "100k");
    const [videos, setVideos] = useState(initialData?.videos || "");

    const handleSubmit = () => {
        if (platform === 'github') {
            if (!user) return;
            const shortcode = `{{social platform="github" user="${user}" title="${title}"}}`;
            onAdd('custom', { text: shortcode }, 4, 2);
        } else if (platform === 'youtube') {
            if (!channel) return;
            const shortcode = `{{social platform="youtube" user="${channel}" subs="${subs}" videos="${videos}"}}`;
            onAdd('custom', { text: shortcode }, 4, 2);
        }
    };

    return (
        <div className="w-[300px] p-1 flex flex-col gap-3">
            <div className="space-y-1">
                <Label className="text-xs">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="github">GitHub Contribution Graph</SelectItem>
                        <SelectItem value="youtube">YouTube Channel Loop</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {platform === 'github' && (
                <>
                    <div className="space-y-1">
                        <Label className="text-xs">GitHub Username</Label>
                        <Input value={user} onChange={e => setUser(e.target.value)} placeholder="shadcn" className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Custom Title (Optional)</Label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="My Contributions" className="h-8 text-xs" />
                    </div>
                </>
            )}

            {platform === 'youtube' && (
                <>
                    <div className="space-y-1">
                        <Label className="text-xs">Channel Name</Label>
                        <Input value={channel} onChange={e => setChannel(e.target.value)} placeholder="My Channel" className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Subscribers</Label>
                        <Input value={subs} onChange={e => setSubs(e.target.value)} placeholder="2.5M" className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Video Thumbnails (Comma sep URLs)</Label>
                        <Textarea value={videos} onChange={e => setVideos(e.target.value)} placeholder="https://img1..., https://img2..." className="h-16 text-xs resize-none" />
                    </div>
                </>
            )}

            <div className="flex justify-end pt-2">
                <Button size="sm" onClick={handleSubmit} disabled={isLoading || (platform === 'github' ? !user : !channel)}>
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : initialData ? "Save Changes" : "Add Embed"}
                </Button>
            </div>
        </div>
    );
}
export function SpotifyPlaylistForm({ onAdd, isLoading, initialData }: FormProps) {
    const [url, setUrl] = useState(initialData?.url || "");

    const handleSubmit = () => {
        if (!url) return;
        onAdd('spotify-playlist', { url }, 4, 3); // Default 4x3 size for better list view
    };

    return (
        <div className="w-[300px] flex items-center gap-2">
            <Input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Spotify Playlist/Album URL..."
                className="h-9 text-xs flex-1 border-border focus-visible:ring-ring bg-muted text-foreground"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                autoFocus
            />
            <Button size="sm" onClick={handleSubmit} disabled={isLoading || !url} className="h-9 w-9 p-0 shrink-0 rounded-xl bg-[#1DB954] hover:bg-[#1DB954]/90">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
            </Button>
        </div>
    );
}
