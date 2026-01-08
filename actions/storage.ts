'use server';

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

export async function getPresignedUploadUrl(type: string, size: number) {
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_BUCKET_NAME) {
        throw new Error("R2 storage is not configured");
    }

    // Limit size to 3MB
    if (size > 3 * 1024 * 1024) throw new Error("File too large (max 3MB)");

    const key = `uploads/${randomUUID()}-${type.replace('/', '.')}`;

    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        ContentType: type,
        ContentLength: size,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return { uploadUrl: url, publicUrl, key };
}
