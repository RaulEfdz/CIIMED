import HireUs from "@/components/customs/feedBack/HireUs";
import Hero from "./Hero";
import { participationContent } from "./data"; // Importar datos

const FormContact = () => {
  return <HireUs content={participationContent} />; // Usar datos importados
};

const Page = () => {
  return (
    <>
      <Hero />
      <FormContact />
    </>
  );
};

export default Page;