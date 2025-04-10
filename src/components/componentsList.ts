import ChatInterface from "./ChatInterface";
import WelcomeMessage from "./WelcomeMessage";

export const components = {
  "chat-interface": ChatInterface,
  // Another components to render directly in the structure...
  div: "div" as unknown as React.ComponentType,
};
export const structure = [
  { "welcome-message": WelcomeMessage },
  {
    id: "chat-interface",
  },
];
