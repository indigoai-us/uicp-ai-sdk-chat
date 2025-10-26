"use client";

import { motion } from "framer-motion";
import { BotIcon, UserIcon } from "./icons";
import { ReactNode } from "react";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { Markdown } from "./markdown";
import { ToolInvocation } from "ai";
import { Orders } from "./orders";
import { Tracker } from "./tracker";
import { parseUICPContent, hasUICPBlocks } from "@/lib/uicp/parser";

export const TextStreamMessage = ({
  content,
}: {
  content: StreamableValue;
}) => {
  const [text] = useStreamableValue(content);

  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
        <BotIcon />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
          {text && hasUICPBlocks(text) ? (
            <>
              {parseUICPContent(text).map((parsedItem) => {
                if (parsedItem.type === 'component') {
                  return <div key={parsedItem.key}>{parsedItem.content}</div>;
                }
                return <Markdown key={parsedItem.key}>{parsedItem.content as string}</Markdown>;
              })}
            </>
          ) : (
            <Markdown>{text}</Markdown>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const Message = ({
  role,
  content,
  toolInvocations,
}: {
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
}) => {
  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-6 w-full">
        {content && (
          <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
            {typeof content === 'string' && hasUICPBlocks(content) ? (
              <>
                {parseUICPContent(content).map((parsedItem) => {
                  if (parsedItem.type === 'component') {
                    return <div key={parsedItem.key}>{parsedItem.content}</div>;
                  }
                  return <Markdown key={parsedItem.key}>{parsedItem.content as string}</Markdown>;
                })}
              </>
            ) : (
              <Markdown>{content as string}</Markdown>
            )}
          </div>
        )}

        {toolInvocations && (
          <div className="flex flex-col gap-4">
            {toolInvocations.map((toolInvocation) => {
              const { toolName, toolCallId, state } = toolInvocation;

              // Show status message while tool is being called
              if (state === "call") {
                const { args } = toolInvocation;
                
                // Generate status message based on tool type
                let statusMessage = "Working...";
                
                if (toolName === "GoogleSearch_Search" && args.query) {
                  statusMessage = `Searching for "${args.query}"...`;
                } else if (toolName.includes("Search")) {
                  statusMessage = args.query 
                    ? `Searching for "${args.query}"...`
                    : "Searching...";
                }

                return (
                  <div 
                    key={toolCallId}
                    className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 italic"
                  >
                    <span>{statusMessage}</span>
                  </div>
                );
              }

              if (state === "result") {
                const { result } = toolInvocation;

                return (
                  <div key={toolCallId}>
                    {toolName === "listOrders" ? (
                      <Orders orders={result} />
                    ) : toolName === "viewTrackingInformation" ? (
                      <div key={toolCallId}>
                        <Tracker trackingInformation={result} />
                      </div>
                    ) : null}
                  </div>
                );
              }
              
              return null;
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
