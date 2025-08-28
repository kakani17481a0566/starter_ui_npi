// utils/driveImage.js
export function driveImageUrl(rawUrl, size = 256) {
  const byD = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
  const byQuery = rawUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  const id = byD?.[1] || byQuery?.[1];
  if (!id) return rawUrl; // not a Drive link
  return {
    thumb: `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`,
    view:  `https://drive.google.com/uc?export=view&id=${id}`,
  };
}
