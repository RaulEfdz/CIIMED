// Type for a single FAQ item
interface FAQ {
  id: number;
  pregunta: string;
  respuesta: string;
}

// Props for the FAQCard component
interface FAQCardProps {
  faq: FAQ;
}

const FAQCardComponent = ({ faq }: FAQCardProps) => {
  return (
    <details className="bg-gray-50 p-4 rounded-lg shadow-sm cursor-pointer">
      <summary className="font-semibold text-lg">{faq.pregunta}</summary>
      <div className="mt-2 text-gray-700">
        <p>{faq.respuesta}</p>
      </div>
    </details>
  );
};

export default FAQCardComponent;