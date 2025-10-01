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
      console.log("UploadThing middleware - teamAvatars");
      return { userId: "admin", type: "team" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file details:", { name: file.name, size: file.size, key: file.key });
      return { uploadedBy: metadata.userId, fileKey: file.key };
    }),

  // Uploader para imágenes institucionales (logos, hero images, etc.)
  institutionalImages: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async () => {
      console.log("UploadThing middleware - institutionalImages");
      return { userId: "admin", type: "institutional" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Institutional image upload complete:", { name: file.name, key: file.key });
      return { uploadedBy: metadata.userId, fileKey: file.key, url: file.url };
    }),

  // Uploader para imágenes de fondo y componentes
  backgroundImages: f({ image: { maxFileSize: "10MB", maxFileCount: 1 } })
    .middleware(async () => {
      console.log("UploadThing middleware - backgroundImages");
      return { userId: "admin", type: "background" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Background image upload complete:", { name: file.name, key: file.key });
      return { uploadedBy: metadata.userId, fileKey: file.key, url: file.url };
    }),

  // Uploader para galería multimedia
  mediaGallery: f({ 
    image: { maxFileSize: "10MB", maxFileCount: 10 },
    video: { maxFileSize: "50MB", maxFileCount: 5 },
    pdf: { maxFileSize: "10MB", maxFileCount: 5 }
  })
    .middleware(async () => {
      console.log("UploadThing middleware - mediaGallery");
      return { userId: "admin", type: "media" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Media gallery upload complete:", { name: file.name, key: file.key });
      return { uploadedBy: metadata.userId, fileKey: file.key, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;