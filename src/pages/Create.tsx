
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

type BodyPart = 'head' | 'torso' | 'legs';

const Create = () => {
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const navigate = useNavigate();

  const clothingTypes = {
    head: ['Chapéu', 'Boné', 'Gorro', 'Bandana'],
    torso: ['Camiseta', 'Camisa', 'Blusa', 'Jaqueta', 'Moletom'],
    legs: ['Calça', 'Short', 'Saia', 'Bermuda']
  };

  const clothingSubtypes = {
    'Camiseta': ['Básica', 'Regata', 'Manga Longa', 'Cropped'],
    'Camisa': ['Social', 'Casual', 'Flanela', 'Polo'],
    'Calça': ['Jeans', 'Social', 'Legging', 'Moletom'],
    'Short': ['Jeans', 'Tactel', 'Moletom', 'Social']
  };

  const handlePartClick = (part: BodyPart) => {
    setSelectedPart(part);
    setSelectedType(null);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };

  const handleSubtypeSelect = (subtype: string) => {
    // Navegar para página de criação com os parâmetros
    navigate(`/creation?part=${selectedPart}&type=${selectedType}&subtype=${subtype}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="pt-24 container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Escolha o que criar
          </h1>
          <p className="text-lg text-gray-600">
            Clique na parte do corpo para ver as opções disponíveis
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Silhueta Humana */}
          <div className="relative">
            <svg width="300" height="500" viewBox="0 0 300 500" className="mx-auto">
              {/* Cabeça */}
              <circle 
                cx="150" 
                cy="80" 
                r="50" 
                fill={selectedPart === 'head' ? '#8B5CF6' : '#E5E7EB'}
                className="cursor-pointer transition-all duration-300 hover:fill-purple-400"
                onClick={() => handlePartClick('head')}
              />
              
              {/* Tronco */}
              <rect 
                x="100" 
                y="130" 
                width="100" 
                height="180" 
                rx="20"
                fill={selectedPart === 'torso' ? '#8B5CF6' : '#E5E7EB'}
                className="cursor-pointer transition-all duration-300 hover:fill-purple-400"
                onClick={() => handlePartClick('torso')}
              />
              
              {/* Pernas */}
              <rect 
                x="110" 
                y="310" 
                width="35" 
                height="160" 
                rx="15"
                fill={selectedPart === 'legs' ? '#8B5CF6' : '#E5E7EB'}
                className="cursor-pointer transition-all duration-300 hover:fill-purple-400"
                onClick={() => handlePartClick('legs')}
              />
              <rect 
                x="155" 
                y="310" 
                width="35" 
                height="160" 
                rx="15"
                fill={selectedPart === 'legs' ? '#8B5CF6' : '#E5E7EB'}
                className="cursor-pointer transition-all duration-300 hover:fill-purple-400"
                onClick={() => handlePartClick('legs')}
              />
            </svg>
          </div>

          {/* Área de Seleção */}
          <div className="w-full max-w-lg">
            {selectedPart && !selectedType && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  Tipos de {selectedPart === 'head' ? 'Acessórios' : selectedPart === 'torso' ? 'Parte Superior' : 'Parte Inferior'}
                </h3>
                
                <Carousel className="w-full">
                  <CarouselContent>
                    {clothingTypes[selectedPart].map((type, index) => (
                      <CarouselItem key={index} className="basis-1/2">
                        <Button
                          onClick={() => handleTypeSelect(type)}
                          variant="outline"
                          className="w-full h-24 text-lg font-medium border-2 hover:border-purple-500 hover:bg-purple-50 transition-all duration-300"
                        >
                          {type}
                        </Button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            )}

            {selectedType && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  Subtipos de {selectedType}
                </h3>
                
                <Carousel className="w-full">
                  <CarouselContent>
                    {(clothingSubtypes[selectedType as keyof typeof clothingSubtypes] || ['Básico']).map((subtype, index) => (
                      <CarouselItem key={index} className="basis-1/2">
                        <Button
                          onClick={() => handleSubtypeSelect(subtype)}
                          className="w-full h-24 text-lg font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 transform hover:scale-105"
                        >
                          {subtype}
                        </Button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
                
                <Button
                  onClick={() => setSelectedType(null)}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Voltar
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Create;
