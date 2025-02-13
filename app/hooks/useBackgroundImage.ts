import { useState, useCallback } from "react";

interface UseBackgroundImageProps {
  sessionId: string;
  onImageUpdate?: (url: string) => void;
}

export function useBackgroundImage({
  sessionId,
  onImageUpdate,
}: UseBackgroundImageProps) {
  const [backgroundImage, setBackgroundImage] = useState<string>(
    `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1734466989/${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/${sessionId}/background.jpg`
  );

  const uploadToCloudinary = useCallback(
    async (file: File): Promise<string> => {
      if (file.size > 4 * 1024 * 1024) {
        alert("File size exceeds 4MB limit. Please choose a smaller file.");
        throw new Error("File size exceeds 4MB limit");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("sessionId", sessionId);

      const response = await fetch("/api/upload_background_image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    },
    [sessionId]
  );

  const handleImageUpload = useCallback(
    async (file: File) => {
      try {
        const cloudinaryUrl = await uploadToCloudinary(file);
        setBackgroundImage(cloudinaryUrl);
        onImageUpdate?.(cloudinaryUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    },
    [onImageUpdate, uploadToCloudinary]
  );

  return {
    backgroundImage,
    setBackgroundImage,
    handleImageUpload,
  };
}
