'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X } from "lucide-react";
import { getPresignedUploadUrl } from "@/actions/storage";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 3 * 1024 * 1024) {
            alert("File size must be less than 3MB");
            return;
        }

        setUploading(true);
        try {
            // Get presigned URL
            const { uploadUrl, publicUrl } = await getPresignedUploadUrl(file.type, file.size);

            // Upload directly to R2
            const res = await fetch(uploadUrl, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type,
                },
            });

            if (!res.ok) throw new Error("Upload failed");

            onChange(publicUrl);
        } catch (err) {
            console.error(err);
            alert("Upload failed. Check console.");
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <div className="flex items-center gap-2">
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={inputRef}
                    onChange={handleFile}
                />

                {value ? (
                    <div className="relative group w-24 h-24 rounded-xl overflow-hidden border border-stone-200">
                        <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
                        <button
                            onClick={() => onChange('')}
                            className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="w-full h-24 border-dashed"
                    >
                        {uploading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
                        ) : (
                            <div className="flex flex-col items-center gap-1 text-stone-500">
                                <Upload className="w-6 h-6" />
                                <span className="text-xs">Upload Image</span>
                            </div>
                        )}
                    </Button>
                )}
            </div>
            {value && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-stone-500 w-fit"
                    onClick={() => inputRef.current?.click()}
                >
                    Change Image
                </Button>
            )}
        </div>
    );
}
