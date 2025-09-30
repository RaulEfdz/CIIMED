import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing({
  errorFormatter: (err) => {
    console.log("UploadThing Error:", err.message, err.code);
    return { message: err.message };
  },
});

// FileRouter para la aplicación
export const ourFileRouter = {
  // Uploader para imágenes de equipo
  teamAvatars: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      console.log("UploadThing middleware - starting");
      
      // For now, allow all uploads for debugging
      // TODO: Add proper authentication later
      return { userId: "admin" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Este código se ejecuta en el servidor después de que la subida se complete
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file details:", { name: file.name, size: file.size, key: file.key });

      // Return metadata about the uploaded file
      return { uploadedBy: metadata.userId, fileKey: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;