/**
 * Uploads a product image file to the backend
 * @param file - Image file to upload
 * @returns Promise with the image URL from the backend
 */
export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/products/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = "Failed to upload image";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Invalid response from server. Expected JSON with imageUrl.");
    }

    // Backend returns { imageUrl: "..." }
    if (!data.imageUrl) {
      throw new Error("No image URL returned from server");
    }

    return data.imageUrl;
  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
}
