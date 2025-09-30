import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-jwt-super-seguro'

const f = createUploadthing();

// FileRouter para la aplicación
export const ourFileRouter = {
  // Uploader para imágenes de equipo
  teamAvatars: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // Simplificar - quitar autenticación por ahora para debug
      return { userId: "admin" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Este código se ejecuta en el servidor después de que la subida se complete
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      // Aquí podrías guardar la información del archivo en tu base de datos
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;