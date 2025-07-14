"use client";
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  initialImageUrl?: string;
}

export default function ImageUpload({ onUpload, initialImageUrl }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.secure_url) {
        onUpload(data.secure_url);
        showToast('Imagen subida con éxito', 'success');
      } else {
        const errorMsg = data.error?.message || 'Error al subir la imagen';
        showToast(errorMsg, 'error');
        setPreview(initialImageUrl || null); 
      }
    } catch (err) {
      showToast('Error de red al subir la imagen', 'error');
      setPreview(initialImageUrl || null);
    } finally {
      setUploading(false);
    }
  }, [onUpload, showToast, initialImageUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
      }`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <div className="relative">
          <img src={preview} alt="Preview" className="mx-auto h-32 rounded-md" />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-1 right-1"
            onClick={(e) => {
              e.stopPropagation();
              setPreview(null);
              onUpload('');
            }}
          >
            X
          </Button>
        </div>
      ) : (
        <div>
          {isDragActive ? (
            <p>Suelta la imagen aquí...</p>
          ) : (
            <p>Arrastra una imagen aquí, o haz clic para seleccionarla</p>
          )}
        </div>
      )}
      {uploading && <p className="mt-2 text-sm text-gray-500">Subiendo...</p>}
    </div>
  );
}
