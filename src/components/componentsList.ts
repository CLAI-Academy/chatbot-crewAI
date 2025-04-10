import ChatInterface from "./ChatInterface";
import WelcomeMessage from "./WelcomeMessage";

export const components = {
  "chat-interface": ChatInterface,
  // Otros componentes que quieras usar directamente en la estructura...
  div: "div" as unknown as React.ComponentType,
};
export const structure = [
  { "welcome-message": WelcomeMessage },
  {
    id: "chat-interface",
  },
];
