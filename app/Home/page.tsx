"use client";

import { Microscope, Users } from "lucide-react";
import { SingleImage } from "../../components/customs/Features/SingleImage";
import { HeroBanner } from "../../components/customs/Heros/HeroBanner";
import { SiInstagram, SiLinkedin, SiSpotify, SiYoutube } from "react-icons/si";
import { Button } from "@/components/ui/button";

export default function Home() {
  const HeroSection = () => {

    const ActionsButtons = (
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <Button className="bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-200">
        <SiYoutube className="w-6 h-6" /> Videos
        </Button>
        <Button className="bg-green-800 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-200">
          <SiSpotify className="w-6 h-6" /> Podcast
        </Button>
      </div>
    );

    return (
      <HeroBanner
        imageUrl={"ozy6ruruqgqnxgcaqjwh"}
        imageAlt={"CIIMED Banner"}
        imgW={2080}
        imgH={1365}
        title={"CIIMED | Centro de Investigación e Innovación Médica"}
        subtitle={
          "Un referente en investigación y desarrollo en salud en Panamá"
        }
        actions={ActionsButtons}
        socialLinks={[
          {
            icon: <SiInstagram />,
            url: "https://www.instagram.com/ciimedpanama/",
          },
          {
            icon: <SiLinkedin />,
            url: "https://www.linkedin.com/company/ciimed/posts/?feedView=all",
          },
          {
            icon: <SiYoutube />,
            url: "https://www.youtube.com/channel/UCw525jjoG_HssaCxp4XJRow",
          },
          {
            icon: <SiSpotify />,
            url: "https://open.spotify.com/show/6rPGtfqkc8iOK80k6KtyHD",
          },
        ]}
      />
    );
  };
  const FeatureInit = () => {
    return (
      <SingleImage
        imageUrl={"jcue8atmcjfv9aea2sw0"}
        imageAlt={"medialImage"}
        title={"CIIMED | Centro de Investigación e Innovación Médica"}
        description={
          "El Centro de Investigación e Innovación Médica es una iniciativa clave en Panamá, ubicada en la Ciudad de la Salud, que busca consolidarse como un referente en investigación y desarrollo en el ámbito de la salud. Este centro está diseñado para facilitar la investigación clínica, biomédica y de otros campos relacionados, ofreciendo un entorno adecuado y moderno para médicos e investigadores."
        }
        features={[
          {
            text: "El centro está enfocado en el estudio de nuevas tecnologías, medicamentos, vacunas y dispositivos médicos. Se espera que contribuya significativamente a la generación de evidencia científica que beneficie tanto a la comunidad local como a la salud pública en general",
            bold: "Investigación Avanzada",
            icon: <Microscope />,
          },
          {
            text: "Trabaja de manera conjunta con instituciones como la Secretaría Nacional de Ciencia, Tecnología e Innovación (SENACYT), universidades y otros centros de investigación para potenciar su capacidad investigativa y fomentar estudios multidisciplinarios",
            bold: "Colaboraciones Estratégicas",
            icon: <Users />,
          },
        ]}
      />
    );
  };


  return (
    <div className="w-full h-full">
      <section>
        <HeroSection />
      </section>
      <section className="mt-10">
        <FeatureInit />
      </section>
    </div>
  );
}
