import React from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import SuggestionTags from "./SuggestionTags";

// Registro de componentes disponibles por ID
export const components = {
  "chat-header": ChatHeader,
  "chat-input": ChatInput,
  "chat-message": ChatMessage,
  "suggestion-tags": SuggestionTags,
  div: "div" as unknown as React.ComponentType, // Para elementos HTML básicos
};

// Estructura de árbol que define cómo se renderizan los componentes
export const structure = [
  {
    id: "div",
    props: { className: "chat-container flex flex-col h-full" },
    children: [
      {
        id: "chat-header",
      },
      {
        id: "chat-input",
        props: { placeholder: "Escribe un mensaje..." },
      },
    ],
  },
];
