import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { Maximize2, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const ChatHeader: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
    } else {
      navigate("/auth");
    }
  };

  return (
    <header className="flex justify-between items-baseline p-4 bg-chat-darker backdrop-blur-sm border-b border-gray-800/20 shadow-sm">
      <div className="flex items-center">
        <Logo size={40} />
        <span className="flex items-start flex-col ml-2 font-bold text-white text-lg tracking-wider">
          CLAI
          <span className="text-xs text-gray-400  text-right">
            Finanzas | Peluquería
          </span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAuthAction}
          className="text-white/70 hover:text-white hover:bg-gray-700/40 transition-all duration-300"
        >
          {user ? (
            <>
              <LogOut size={16} className="mr-2" />
              <span className="text-sm">Salir</span>
            </>
          ) : (
            <>
              <LogIn size={16} className="mr-2" />
              <span className="text-sm">Entrar</span>
            </>
          )}
        </Button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-chat-accent/70 transition-colors duration-300 shadow-sm">
          <Maximize2 size={16} className="text-white/80" />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
