
import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Image, FileText, Palette, Settings } from "lucide-react";

const Profile = () => {
  const [user] = useState({
    name: "Maria Silva",
    email: "maria@email.com",
    avatar: "",
    createdAt: "Janeiro 2024"
  });

  const [creations] = useState([
    {
      id: 1,
      name: "Camiseta Sunset",
      type: "Camiseta",
      subtype: "Básica",
      color: "#ff6b6b",
      status: "finalizada",
      isPublic: true,
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Moletom Galaxy",
      type: "Moletom",
      subtype: "Com Capuz",
      color: "#4c1d95",
      status: "rascunho",
      isPublic: false,
      createdAt: "2024-01-10"
    },
    {
      id: 3,
      name: "Camisa Floral",
      type: "Camisa",
      subtype: "Casual",
      color: "#10b981",
      status: "producao",
      isPublic: true,
      createdAt: "2024-01-05"
    }
  ]);

  const [savedElements] = useState([
    { id: 1, type: "image", name: "Logo Empresa", preview: "/api/placeholder/100/100" },
    { id: 2, type: "text", name: "Frase Motivacional", content: "Seja a mudança" },
    { id: 3, type: "drawing", name: "Desenho Abstrato", preview: "/api/placeholder/100/100" },
    { id: 4, type: "pattern", name: "Padrão Geométrico", preview: "/api/placeholder/100/100" }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'finalizada':
        return <Badge className="bg-green-100 text-green-800">Finalizada</Badge>;
      case 'rascunho':
        return <Badge variant="secondary">Rascunho</Badge>;
      case 'producao':
        return <Badge className="bg-blue-100 text-blue-800">Em Produção</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'drawing':
        return <Palette className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Header />
      
      <main className="pt-24 container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Cabeçalho do Perfil */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl">
                  <User className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {user.name}
                </h1>
                <p className="text-gray-600 mb-1">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Membro desde {user.createdAt}
                </p>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Editar Perfil
                </Button>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {creations.length}
                  </div>
                  <div className="text-sm text-gray-600">Criações</div>
                </div>
              </div>
            </div>
          </div>

          {/* Abas do Perfil */}
          <Tabs defaultValue="creations" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="creations">Minhas Peças</TabsTrigger>
              <TabsTrigger value="elements">Elementos Salvos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="creations" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Minhas Peças</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Todas</Button>
                  <Button variant="outline" size="sm">Finalizadas</Button>
                  <Button variant="outline" size="sm">Rascunhos</Button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {creations.map((creation) => (
                  <Card key={creation.id} className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{creation.name}</CardTitle>
                        {getStatusBadge(creation.status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {creation.type} - {creation.subtype}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div 
                        className="w-full h-40 rounded-lg mb-4 flex items-center justify-center text-white font-medium shadow-inner"
                        style={{ backgroundColor: creation.color }}
                      >
                        <div className="text-center">
                          <div className="text-lg">{creation.type}</div>
                          <div className="text-sm opacity-75">{creation.subtype}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>
                          {creation.isPublic ? 'Público' : 'Privado'}
                        </span>
                        <span>
                          {new Date(creation.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          Editar
                        </Button>
                        <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                          Ver Detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="elements" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Elementos Salvos</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Todos</Button>
                  <Button variant="outline" size="sm">Imagens</Button>
                  <Button variant="outline" size="sm">Textos</Button>
                  <Button variant="outline" size="sm">Desenhos</Button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {savedElements.map((element) => (
                  <Card key={element.id} className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        {getElementIcon(element.type)}
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {element.type}
                        </span>
                      </div>
                      
                      <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        {element.type === 'text' ? (
                          <span className="text-sm text-gray-600 font-medium">
                            "{element.content}"
                          </span>
                        ) : (
                          <div className="w-16 h-16 bg-gray-300 rounded" />
                        )}
                      </div>
                      
                      <p className="text-sm font-medium text-gray-800 mb-2">
                        {element.name}
                      </p>
                      
                      <Button size="sm" variant="outline" className="w-full">
                        Usar Elemento
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
