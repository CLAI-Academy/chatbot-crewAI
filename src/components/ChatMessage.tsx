import React from "react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import ReactMarkdown from "react-markdown";
import ChatApp from "./DynamicBuilder";

export type MessageType = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
};

const ChatMessage: React.FC<{ message: MessageType }> = ({ message }) => {
  const isAi = message.sender === "ai";

  return (
    <div
      className={cn(
        "flex my-4 animate-fade-in",
        isAi ? "justify-start flex" : "justify-end"
      )}
    >
      {isAi && (
        <div className="flex-shrink-0 mt-1">
          <Logo size={30} />
        </div>
      )}

      <div
        className={cn(
          "rounded-xl p-4 max-w-[80%] overflow-hidden",
          isAi
            ? "text-white" // Sin fondo para mensajes del bot
            : "bg-chat-accent/90 text-white border border-chat-accent/50 shadow-md backdrop-blur-sm"
        )}
      >
        {isAi ? (
          <div className="prose prose-invert prose-sm md:prose-base max-w-none overflow-x-auto">
            <ReactMarkdown
              components={{
                // Custom rendering para tablas con mejor soporte para tablas extensas
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-4 w-full border border-gray-700/30 rounded-md">
                    <table
                      className="min-w-full w-max border-collapse text-sm"
                      {...props}
                    />
                  </div>
                ),
                thead: ({ node, ...props }) => (
                  <thead className="bg-gray-800/50" {...props} />
                ),
                tbody: ({ node, ...props }) => (
                  <tbody className="divide-y divide-gray-700/30" {...props} />
                ),
                tr: ({ node, ...props }) => (
                  <tr className="border-b border-gray-700/30" {...props} />
                ),
                th: ({ node, ...props }) => (
                  <th
                    className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider break-words whitespace-nowrap"
                    {...props}
                  />
                ),
                td: ({ node, ...props }) => (
                  <td
                    className="px-3 py-2 break-words whitespace-nowrap"
                    {...props}
                  />
                ),
                // Mejora para elementos code
                code: ({ node, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  return !className ? (
                    <code
                      className="bg-gray-800 px-1 py-0.5 rounded text-sm font-mono break-words"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <code
                      className="block bg-gray-800/70 p-3 rounded-md overflow-x-auto text-sm font-mono my-4 break-words"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                // Mantenemos las mejoras para otros elementos
                p: ({ node, ...props }) => (
                  <p className="mb-4 break-words" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-blue-400 hover:underline break-words"
                    {...props}
                  />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-gray-700 pl-4 italic text-gray-300 my-4 break-words"
                    {...props}
                  />
                ),
                pre: ({ node, ...props }) => (
                  <pre
                    className="bg-gray-800/70 p-0 rounded-md overflow-x-auto my-4 break-words"
                    {...props}
                  />
                ),
                ul: ({ node, ...props }) => (
                  <ul
                    className="list-disc pl-5 space-y-1 my-4 break-words"
                    {...props}
                  />
                ),
                ol: ({ node, ...props }) => (
                  <ol
                    className="list-decimal pl-5 space-y-1 my-4 break-words"
                    {...props}
                  />
                ),
                li: ({ node, ...props }) => (
                  <li className="ml-4 break-words" {...props} />
                ),
                h1: ({ node, ...props }) => (
                  <h1
                    className="text-2xl font-bold mt-6 mb-4 break-words"
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-xl font-bold mt-5 mb-3 break-words"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className="text-lg font-bold mt-4 mb-2 break-words"
                    {...props}
                  />
                ),
                hr: ({ node, ...props }) => (
                  <hr className="my-6 border-gray-700/50" {...props} />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm md:text-base break-words">
            {message.content}
          </p>
        )}
        <div className="text-xs text-gray-400 mt-2 text-right">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
