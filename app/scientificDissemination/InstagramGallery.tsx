import React from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface InstagramPost {
  id: string;
  caption: string;
  postUrl: string;
}

interface InstagramGalleryProps {
  posts?: InstagramPost[];
}

export const InstagramEmbed: React.FC<{ postUrl: string }> = ({ postUrl }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <div className="relative w-full h-[600px] md:h-[500px] lg:h-[400px] bg-[#285C4D]/5 rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#285C4D]/5">
          <Loader2 className="w-8 h-8 animate-spin text-[#F4633A]" />
        </div>
      )}
      <iframe
        src={`https://www.instagram.com/reel/${
          postUrl.split("/reel/")[1]?.split("/")[0]
        }/embed`}
        width="100%"
        height="100%"
        allowFullScreen
        className="rounded-lg"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export const InstagramGallery: React.FC<InstagramGalleryProps> = ({
  posts = mockPosts,
}) => {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#285C4D] text-white font-medium text-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-[#F4633A]"></span>
          Síguenos en Instagram
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-[#212322] mb-6">
          Últimas Publicaciones
        </h2>

        <p className="text-[#212322]/70 max-w-2xl mx-auto">
          Mantente al día con nuestras últimas actividades, eventos y novedades
          siguiéndonos en Instagram.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="overflow-hidden border-[#285C4D]/10 hover:border-[#285C4D]/20 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <InstagramEmbed postUrl={post.postUrl} />
            <div className="p-4">
              <p className="text-[#212322]/80 line-clamp-2">{post.caption}</p>
              <a
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center text-[#F4633A] hover:text-[#F4633A]/80 font-medium"
              >
                Ver en Instagram
              </a>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export const mockPosts: InstagramPost[] = [
  {
    id: "1",
    caption: "¡Nueva publicación en nuestro Instagram! 📸✨",
    postUrl:
      "https://www.instagram.com/reel/DBjTpwERplD/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  },

  {
    id: "3",
    caption: "Síguenos para más contenido exclusivo. 🚀",
    postUrl:
      "https://www.instagram.com/reel/DFOXWQUpSUP/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==",
  },

  {
    id: "2",
    caption: "Síguenos para más contenido exclusivo. 🚀",
    postUrl:
      "https://www.instagram.com/reel/DBzc8MLpDlW/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==",
  },

];

export default InstagramGallery;
