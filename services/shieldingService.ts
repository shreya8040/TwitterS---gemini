
/**
 * ShieldingService.ts
 * Implements "Source-Level Protection".
 * Since we cannot control the official X app's code, we transform the 
 * content itself before posting so it carries its protection everywhere.
 */

export const shieldImage = async (imageSrc: string, username: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(imageSrc);

      canvas.width = img.width;
      canvas.height = img.height;

      // 1. Draw original image
      ctx.drawImage(img, 0, 0);

      // 2. Add subtle "Noise Pattern" to defeat AI OCR and scrapers
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      for (let i = 0; i < canvas.width; i += 4) {
        for (let j = 0; j < canvas.height; j += 4) {
          if (Math.random() > 0.5) ctx.fillRect(i, j, 1, 1);
        }
      }

      // 3. Add Forensic Watermarking (visible but elegant)
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 4);
      ctx.font = `${Math.max(12, canvas.width / 40)}px monospace`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.textAlign = "center";
      
      const spacing = canvas.width / 4;
      for (let x = -canvas.width; x < canvas.width; x += spacing) {
        for (let y = -canvas.height; y < canvas.height; y += spacing) {
          ctx.fillText(`PROTECTED BY TWITTERS - @${username}`, x, y);
        }
      }
      ctx.restore();

      // 4. Add "Safety Border" banner at the bottom
      const bannerHeight = canvas.height * 0.05;
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${bannerHeight * 0.5}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("🛡️ VIEWING RESTRICTED - SECURE SOCIAL CLIENT REQUIRED", canvas.width / 2, canvas.height - (bannerHeight / 3));

      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = imageSrc;
  });
};

export const shieldText = (text: string): string => {
  // We can't stop people from reading, but we can append a safety notice 
  // that discourages scraping and warns users in other apps.
  const safetyFooter = "\n\n[🛡️ Protected by TwitterS]";
  return text + safetyFooter;
};