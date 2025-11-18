

interface RemoveBackgroundOptions {
  threshold?: number;
  tolerance?: number;
  quality?: number;
}

/**
 * Remove white background from an image URL
 * @param imageUrl - URL of the image to process
 * @param options - Background removal options
 * @returns Promise<string> - Base64 data URL of the processed image with transparent background
 */
export async function removeWhiteBackground(
  imageUrl: string,
  options: RemoveBackgroundOptions = {}
): Promise<string> {
  const {
    threshold = 240,
    tolerance = 30,
    quality = 1,
  } = options;

  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous'; // Enable CORS for external images

      img.onload = () => {
        try {
          // Set canvas dimensions to match image
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw image on canvas
          ctx.drawImage(img, 0, 0);

          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Process each pixel
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Check if pixel is white or near-white
            // A pixel is considered white if all RGB values are above threshold
            if (r >= threshold && g >= threshold && b >= threshold) {
              // Calculate how "white" the pixel is
              const whiteness = (r + g + b) / 3;

              // If very white (within tolerance), make it fully transparent
              if (whiteness >= (255 - tolerance)) {
                data[i + 3] = 0; // Set alpha to 0 (transparent)
              } else {
                // Gradually reduce opacity for near-white pixels
                const opacity = ((255 - tolerance) - whiteness) / tolerance;
                data[i + 3] = Math.max(0, Math.min(255, opacity * 255));
              }
            }
          }

          ctx.putImageData(imageData, 0, 0);

          const dataUrl = canvas.toDataURL('image/png', quality);

          console.log('✅ Background removed successfully');
          resolve(dataUrl);
        } catch (error) {
          console.error('❌ Error processing image:', error);
          reject(error);
        }
      };

      img.onerror = (error) => {
        console.error('❌ Error loading image:', error);
        reject(new Error('Failed to load image'));
      };

      img.src = imageUrl;
    } catch (error) {
      console.error('❌ Error in removeWhiteBackground:', error);
      reject(error);
    }
  });
}

export async function uploadProcessedLogo(
  dataUrl: string,
  filename: string,
  uploadEndpoint: string
): Promise<string> {
  try {
    const blob = dataURLtoBlob(dataUrl);
    const formData = new FormData();
    formData.append('logo', blob, filename);

    const response = await fetch(uploadEndpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.url || result.logo_url || dataUrl; // Fallback to dataUrl if no URL in response
  } catch (error) {
    console.error('❌ Error uploading processed logo:', error);
    throw error;
  }
}

export function dataURLtoBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}

export function dataURLtoFile(dataUrl: string, filename: string): File {
  const blob = dataURLtoBlob(dataUrl);
  return new File([blob], filename, { type: blob.type });
}
