import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, FileImage, Type, Brush, Image } from "lucide-react";

interface ExpandableSidebarProps {
  projectName: string;
  setProjectName: (value: string) => void;
  baseColor: string;
  setBaseColor: (value: string) => void;
  size: string;
  setSize: (value: string) => void;
  fabric: string;
  setFabric: (value: string) => void;
  onExpandChange?: (isExpanded: boolean) => void;
}

const ExpandableSidebar = ({
  projectName,
  setProjectName,
  baseColor,
  setBaseColor,
  size,
  setSize,
  fabric,
  setFabric,
  onExpandChange,
}: ExpandableSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('settings');

  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
  ];

  const sidebarSections = [
    {
      id: 'settings',
      icon: Settings,
      label: 'Configurações',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Configurações</h3>
          
          <div>
            <Label htmlFor="project-name">Nome do Projeto</Label>
            <Input 
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Minha criação"
            />
          </div>
          
          <div>
            <Label htmlFor="base-color">Cor Base</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                id="base-color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input value={baseColor} readOnly className="flex-1" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="size">Tamanho</Label>
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="PP">PP</option>
              <option value="P">P</option>
              <option value="M">M</option>
              <option value="G">G</option>
              <option value="GG">GG</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="fabric">Tipo de Tecido</Label>
            <select
              id="fabric"
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="algodao">100% Algodão</option>
              <option value="poliester">Poliéster</option>
              <option value="misto">Misto</option>
              <option value="linho">Linho</option>
            </select>
          </div>
        </div>
      )
    },
    {
      id: 'upload',
      icon: FileImage,
      label: 'Upload',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Upload de Imagens</h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer">
            <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Clique para fazer upload</p>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded cursor-pointer hover:bg-gray-300 transition-colors flex items-center justify-center">
                <Image className="w-6 h-6 text-gray-500" />
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'text',
      icon: Type,
      label: 'Texto',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Ferramentas de Texto</h3>
          
          <div>
            <Label htmlFor="text-input">Texto</Label>
            <Textarea id="text-input" placeholder="Digite seu texto aqui" />
          </div>
          
          <div>
            <Label htmlFor="font-size">Tamanho da Fonte</Label>
            <Input type="range" min="12" max="72" defaultValue="24" />
          </div>
          
          <div>
            <Label>Cor do Texto</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'brush',
      icon: Brush,
      label: 'Pincel',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Ferramentas de Pincel</h3>
          
          <div>
            <Label>Tipo de Pincel</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button variant="outline" size="sm">Normal</Button>
              <Button variant="outline" size="sm">Spray</Button>
              <Button variant="outline" size="sm">Marca-texto</Button>
              <Button variant="outline" size="sm">Lápis</Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="brush-size">Tamanho do Pincel</Label>
            <Input type="range" min="1" max="20" defaultValue="5" />
          </div>
          
          <div>
            <Label>Cores</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleSectionClick = (sectionId: string) => {
    if (activeSection === sectionId && isExpanded) {
      setIsExpanded(false);
    } else {
      setActiveSection(sectionId);
      setIsExpanded(true);
    }
  };

  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded, onExpandChange]);

  return (
    <aside 
      className={`bg-white shadow-lg overflow-hidden transition-all duration-300 flex h-[calc(100vh-5rem)] ${
        isExpanded ? 'w-80' : 'w-16'
      }`}
    >
      {/* Coluna dos Ícones - Sempre fixa à esquerda */}
      <div className="w-16 flex flex-col bg-gray-50 border-r border-gray-200">
        {sidebarSections.map((section) => {
          const IconComponent = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`w-16 h-16 flex items-center justify-center border-b border-gray-200 transition-colors hover:bg-gray-100 ${
                isActive && isExpanded ? 'bg-purple-50 border-r-2 border-r-purple-500' : ''
              }`}
              title={section.label}
            >
              <IconComponent 
                className={`w-6 h-6 ${
                  isActive && isExpanded ? 'text-purple-600' : 'text-gray-600'
                }`} 
              />
            </button>
          );
        })}
      </div>

      {/* Conteúdo expandido - À direita dos botões */}
      {isExpanded && activeSection && (
        <div className="w-64 h-full overflow-y-auto animate-fade-in">
          <div className="p-6">
            {sidebarSections.find(section => section.id === activeSection)?.content}
          </div>
        </div>
      )}
    </aside>
  );
};

export default ExpandableSidebar;