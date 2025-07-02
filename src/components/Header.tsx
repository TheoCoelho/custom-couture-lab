
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-purple-600 transition-colors">
          StyleCraft
        </Link>

        {/* Centro - Botão Criar */}
        <Button 
          onClick={() => navigate("/create")}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
        >
          Criar
        </Button>

        {/* Direita - Login/Perfil */}
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => navigate("/login")}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-6"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate("/register")}
                className="bg-gray-800 hover:bg-gray-900 text-white rounded-full px-6"
              >
                Registrar
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              onClick={() => navigate("/profile")}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <User className="w-8 h-8 text-gray-600" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
