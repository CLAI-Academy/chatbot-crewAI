import ChatInterface from "./ChatInterface";
import WelcomeMessage from "./WelcomeMessage";
import Logo from "./Logo";

export const components = {
  "chat-interface": ChatInterface,
  logoFinanzas: Logo,
  // Another components to render directly in the structure...
  logoPeluqueria: Logo,
  div: "div" as unknown as React.ComponentType,
};
export const structure = [
  // {
  //   id: "chat-interface",
  // },
  {
    id: "logoFinanzas",
    props: {
      size: 50,
    },
  },
  {
    id: "logoPeluqueria",
    props: {
      size: 100,
    },
  },
];
