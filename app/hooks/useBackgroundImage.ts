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
      const formData = new FormData();
      formData.append(
        "folder",
        `${process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/${sessionId}`
      );
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );
      formData.append("public_id", "background");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

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
