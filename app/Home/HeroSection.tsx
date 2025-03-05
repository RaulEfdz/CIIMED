import HeroBanner from "@/components/customs/Heros/HeroBanner";
import { SiInstagram, SiLinkedin, SiSpotify, SiYoutube } from "react-icons/si";
import { motion } from "framer-motion"; // Importación de Framer Motion
const HIGHLIGHT_COLOR = "#ffffff";

export const HeroSection = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <HeroBanner
          imageUrl={"ozy6ruruqgqnxgcaqjwh"}
          imageAlt={"CIIMED Banner"}
          imgW={2080}
          imgH={1365}
          title={"CIIMED | Centro de Investigación e Innovación Médica"}
          subtitle={"Un referente en investigación y desarrollo en salud en Panamá"}
          actions={<></>}
          socialLinks={[
            {
              icon: <SiInstagram />, url: "https://www.instagram.com/ciimedpanama/",
              label: ""
            },
            {
              icon: <SiLinkedin />, url: "https://www.linkedin.com/company/ciimed/posts/?feedView=all",
              label: ""
            },
            {
              icon: <SiYoutube />, url: "https://www.youtube.com/channel/UCw525jjoG_HssaCxp4XJRow",
              label: ""
            },
            {
              icon: <SiSpotify />, url: "https://open.spotify.com/show/6rPGtfqkc8iOK80k6KtyHD",
              label: ""
            },
          ]}
          overlayColor={HIGHLIGHT_COLOR}
        />
      </motion.div>
    );
  };
