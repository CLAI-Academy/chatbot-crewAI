import React from "react";
import RenderTree from "./RenderTree";
import { components, structure } from "./componentsList";

const ChatApp: React.FC = () => {
  return (
    <div className="app-container w-full h-full">
      <RenderTree components={components} structure={structure} />
    </div>
  );
};

export default ChatApp;
