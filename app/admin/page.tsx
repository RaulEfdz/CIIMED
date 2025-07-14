import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg text-gray-600 mb-8">
        Welcome to the admin dashboard. From here you can manage all the content of the website.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/banners">
          <Button className="w-full h-24 text-xl">Banners</Button>
        </Link>
        <Link href="/admin/documentos">
          <Button className="w-full h-24 text-xl">Documentos</Button>
        </Link>
        <Link href="/admin/faq">
          <Button className="w-full h-24 text-xl">FAQ</Button>
        </Link>
        <Link href="/admin/noticias">
          <Button className="w-full h-24 text-xl">Noticias</Button>
        </Link>
        <Link href="/admin/promociones">
          <Button className="w-full h-24 text-xl">Promociones</Button>
        </Link>
        <Link href="/admin/servicios">
          <Button className="w-full h-24 text-xl">Servicios</Button>
        </Link>
        <Link href="/admin/staff">
          <Button className="w-full h-24 text-xl">Staff</Button>
        </Link>
        <Link href="/admin/sucursales">
          <Button className="w-full h-24 text-xl">Sucursales</Button>
        </Link>
        <Link href="/admin/testimonios">
          <Button className="w-full h-24 text-xl">Testimonios</Button>
        </Link>
      </div>
    </div>
  );
}
