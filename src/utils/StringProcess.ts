export default function extractPublicId(url: string) {
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    const path = url.substring(uploadIndex + 8);
    const parts = path.split("/");

    const filteredParts = parts.filter(part =>
        !part.startsWith("v") && !part.startsWith("f_")
    );

    if (filteredParts.length === 0) return null;

    const last = filteredParts[filteredParts.length - 1];
    const publicId = last.split(".")[0];

    return publicId;
}
