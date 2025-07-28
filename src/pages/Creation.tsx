
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import TShirt3D from "@/components/TShirt3D";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, FileImage, Plus, X } from "lucide-react";

const Creation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const part = searchParams.get('part');
  const type = searchParams.get('type');
  const subtype = searchParams.get('subtype');

  const [projectName, setProjectName] = useState('');
  const [baseColor, setBaseColor] = useState('#ffffff');
  const [size, setSize] = useState('M');
  const [fabric, setFabric] = useState('algodao');
  const [selectedTool, setSelectedTool] = useState('upload');
  const [canvasTabs, setCanvasTabs] = useState([{ id: '3d', name: '3D', type: '3d' }]);
  const [activeCanvasTab, setActiveCanvasTab] = useState('3d');

  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
  ];

  const addNewCanvasTab = () => {
    const newTabId = `2d-${Date.now()}`;
    const newTab = {
      id: newTabId,
      name: `2D - ${canvasTabs.length}`,
      type: '2d'
    };
    setCanvasTabs([...canvasTabs, newTab]);
    setActiveCanvasTab(newTabId);
  };

  const removeCanvasTab = (tabId: string) => {
    if (tabId === '3d') return; // Não permitir remover a tab 3D
    const updatedTabs = canvasTabs.filter(tab => tab.id !== tabId);
    setCanvasTabs(updatedTabs);
    if (activeCanvasTab === tabId) {
      setActiveCanvasTab(updatedTabs[0]?.id || '3d');
    }
  };

  const handleFinalize = () => {
    const projectData = {
      part,
      type,
      subtype,
      projectName,
      baseColor,
      size,
      fabric
    };
    
    // Salvar dados no localStorage ou contexto
    localStorage.setItem('currentProject', JSON.stringify(projectData));
    navigate('/finalize');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 flex">
        {/* Ferramentas Laterais */}
        <aside className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Ferramentas</h2>
          
          <Tabs value={selectedTool} onValueChange={setSelectedTool} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="text">Texto</TabsTrigger>
              <TabsTrigger value="brush">Pincel</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
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
            </TabsContent>
            
            <TabsContent value="text" className="space-y-4">
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
            </TabsContent>
            
            <TabsContent value="brush" className="space-y-4">
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
            </TabsContent>
          </Tabs>

          {/* Configurações do Projeto */}
          <div className="mt-8 space-y-4 border-t pt-6">
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
        </aside>

        {/* Área de Edição 3D */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-2xl shadow-lg h-full min-h-[600px] flex flex-col">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {type} - {subtype}
              </h2>
              <p className="text-gray-600">Personalize sua peça como desejar</p>
            </div>
            
            {/* Gerenciador de Tabs Canvas */}
            <div className="px-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
                  {canvasTabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                        activeCanvasTab === tab.id
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                      }`}
                      onClick={() => setActiveCanvasTab(tab.id)}
                    >
                      <span className="text-sm font-medium whitespace-nowrap">{tab.name}</span>
                      {tab.id !== '3d' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCanvasTab(tab.id);
                          }}
                          className="ml-1 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addNewCanvasTab}
                  className="flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nova Tab 2D</span>
                </Button>
              </div>
            </div>

            {/* Área de Canvas */}
            <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 m-6 rounded-xl flex items-center justify-center relative overflow-hidden">
              {activeCanvasTab === '3d' ? (
                <>
                  {/* Modelo 3D Real da Camiseta */}
                  <div className="w-full h-full min-h-[500px]">
                    <TShirt3D color={baseColor} />
                  </div>
                  
                  {/* Label do tipo */}
                  <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md">
                    <div className="text-sm font-medium text-gray-700">
                      {type} - {subtype}
                    </div>
                    <div className="text-xs text-gray-500">
                      Clique e arraste para rotacionar • Scroll para zoom
                    </div>
                  </div>
                  
                  {/* Controles de Visualização */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button size="sm" variant="outline" className="bg-white">Reset</Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Canvas 2D */}
                  <div className="w-full h-full min-h-[500px] bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="text-2xl font-bold mb-2">Canvas 2D</div>
                      <div className="text-sm">
                        {canvasTabs.find(tab => tab.id === activeCanvasTab)?.name}
                      </div>
                      <div className="text-xs mt-2">
                        Área para desenho e edição 2D
                      </div>
                    </div>
                  </div>
                  
                  {/* Controles Canvas 2D */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button size="sm" variant="outline" className="bg-white">Limpar</Button>
                    <Button size="sm" variant="outline" className="bg-white">Exportar</Button>
                  </div>
                </>
              )}
            </div>
            
            <div className="p-6 border-t flex justify-between items-center">
              <Button variant="outline" onClick={() => navigate('/create')}>
                Voltar
              </Button>
              
              <div className="flex gap-3">
                <Button variant="outline">
                  Salvar Rascunho
                </Button>
                <Button 
                  onClick={handleFinalize}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Finalizar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Creation;
