import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatInterface from "@/components/ChatInterface";
import ChatApp from "@/components/DynamicBuilder";
import { useAuth } from "@/hooks/useAuth";

const Index: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Show nothing while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-chat-darker">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-chat-accent"></div>
      </div>
    );
  }

  // Only render the chat interface if the user is authenticated
  return (
    <div className="flex items-center justify-center min-h-screen bg-chat-darker">
      {/* <div className="w-full max-w-4xl">{user && <ChatApp />}</div> */}
      <div className="w-full max-w-[1200px]">{user && <ChatInterface />}</div>
    </div>
  );
};

export default Index;
