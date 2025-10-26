"use client";

import { useRef } from "react";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { motion } from "framer-motion";
import { MasonryIcon, VercelIcon, BotIcon } from "@/components/icons";
import Link from "next/link";
import { useChat } from "ai/react";

export default function Home() {
  const { messages, handleSubmit, input, setInput, append, isLoading } = useChat();
  
  // Filter out empty messages and messages with only UICP tool invocations
  const visibleMessages = messages.filter((message) => {
    // Always show user messages
    if (message.role === "user") return true;
    
    // Show assistant messages that have content
    if (message.content && message.content.trim() !== "") return true;
    
    // For messages with tool invocations but no content
    if (message.toolInvocations && message.toolInvocations.length > 0) {
      // Check if there are any non-UICP tools
      const hasVisibleTools = message.toolInvocations.some(tool => {
        // UICP tools are internal - don't show messages that only have these
        const isUICPTool = tool.toolName === 'get_ui_components' || 
                          tool.toolName === 'create_ui_component';
        
        if (isUICPTool) return false;
        
        // Show messages with search tools in "call" state (for status)
        if (tool.state === 'call') return true;
        
        // Show messages with visual tool results
        if (tool.state === 'result') {
          return tool.toolName === 'listOrders' || 
                 tool.toolName === 'viewTrackingInformation';
        }
        
        return false;
      });
      
      return hasVisibleTools;
    }
    
    // Hide empty messages
    return false;
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const suggestedActions = [
    {
      title: "Warriors game score",
      label: "last game",
      action: "What was the score of the last Warriors game?",
    },
    {
      title: "News articles",
      label: "about AI",
      action: "Please find me 3 news articles about AI from the last week.",
    },
  ];

  return (
    <div className="flex flex-row justify-center pb-20 h-dvh bg-white dark:bg-zinc-900">
      <div className="flex flex-col justify-between gap-4">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-6 h-full w-dvw items-center overflow-y-scroll"
        >
          {visibleMessages.length === 0 && (
            <motion.div className="h-[350px] px-4 w-full md:w-[500px] md:px-0 pt-20">
              <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
                <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
                  <VercelIcon size={16} />
                  <span>+</span>
                  <MasonryIcon />
                </p>
                <p>
                  The maxSteps parameter of streamText function allows you to
                  automatically handle multiple tool calls in sequence using the
                  AI SDK in your application.
                </p>
                <p>
                  {" "}
                  Learn more about{" "}
                  <Link
                    className="text-blue-500 dark:text-blue-400"
                    href="https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling#multi-step-calls"
                    target="_blank"
                  >
                    Multiple Tool Steps{" "}
                  </Link>
                  from the Vercel AI SDK.
                </p>
              </div>
            </motion.div>
          )}

          {visibleMessages.map((message) => (
            <Message
              key={message.id}
              role={message.role}
              content={message.content}
              toolInvocations={message.toolInvocations}
            ></Message>
          ))}
          
          {/* Show "Thinking..." when loading and no visible assistant response yet */}
          {isLoading && !visibleMessages.some(m => m.role === 'assistant' && (m.content || m.toolInvocations?.length)) && (
            <motion.div
              className="flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0"
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
                <BotIcon />
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 italic">
                <span>Thinking...</span>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="grid sm:grid-cols-2 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[500px] mb-4">
          {messages.length === 0 &&
            suggestedActions.map((suggestedAction, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                key={index}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <button
                  onClick={async () => {
                    append({
                      role: "user",
                      content: suggestedAction.action,
                    });
                  }}
                  className="w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
                >
                  <span className="font-medium">{suggestedAction.title}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {suggestedAction.label}
                  </span>
                </button>
              </motion.div>
            ))}
        </div>

        <form
          className="flex flex-col gap-2 relative items-center"
          onSubmit={handleSubmit}
        >
          <input
            ref={inputRef}
            className="bg-zinc-100 rounded-md px-2 py-1.5 w-full outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 md:max-w-[500px] max-w-[calc(100dvw-32px)]"
            placeholder="Send a message..."
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />
        </form>
      </div>
    </div>
  );
}
