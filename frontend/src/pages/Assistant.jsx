import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  Send,
  Trash2,
  Shield,
  Sparkles,
} from "lucide-react";
import api from "../api/api";

const Assistant = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Guardian AI Assistant. 🛡️\n\nI can help you understand phishing, scam messages, suspicious URLs, QR-code threats, online fraud, and account-security risks.\n\nHow can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async (event) => {
    event?.preventDefault();

    const trimmedMessage = input.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      content: trimmedMessage,
    };

    const previousConversation = messages
      .filter(
        (message) =>
          message.role === "user" ||
          message.role === "assistant"
      )
      .slice(-10);

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await api.post(
        "/assistant/chat",
        {
          message: trimmedMessage,
          conversation_history: previousConversation,
        }
      );

      const data = response.data;

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            data.response ||
            "I couldn't generate a response. Please try again.",
        },
      ]);
    } catch (error) {
      console.error(
        "Guardian AI Assistant error:",
        error
      );

      let errorMessage =
        "Something went wrong while contacting Guardian AI.";

      if (error.response?.status === 401) {
        errorMessage =
          "Your session is no longer valid. Please log in again.";
      } else if (error.response?.status === 503) {
        errorMessage =
          error.response?.data?.detail ||
          "Guardian AI is temporarily unavailable.";
      } else if (error.response?.data?.detail) {
        errorMessage =
          error.response.data.detail;
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: errorMessage,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Chat cleared. 🛡️\n\nHow can Guardian AI help you?",
      },
    ]);
  };

  const quickQuestions = [
    "What is phishing?",
    "How can I identify a scam SMS?",
    "What should I do after clicking a suspicious link?",
    "How can I protect my online accounts?",
  ];

  const useQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F7FAF8] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#C7E4D2] bg-[#E5F4EC]">
              <Bot
                size={25}
                className="text-[#159A62]"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#17231D] sm:text-2xl">
                Guardian AI Assistant
              </h1>

              <p className="mt-1 text-xs text-[#7D8A83] sm:text-sm">
                Your intelligent digital safety companion
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={clearChat}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-[#D8E3DD] bg-white px-3 py-2 text-xs font-semibold text-[#526158] transition hover:bg-[#F0F5F2] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          >
            <Trash2 size={15} />
            <span className="hidden sm:inline">
              Clear Chat
            </span>
          </button>
        </div>

        {messages.length === 1 && (
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#65736C]">
              <Sparkles
                size={14}
                className="text-[#159A62]"
              />
              Try asking
            </div>

            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() =>
                    useQuickQuestion(question)
                  }
                  className="rounded-full border border-[#CFE3D7] bg-white px-3 py-2 text-left text-xs font-medium text-[#526158] transition hover:border-[#A9CEB8] hover:bg-[#EAF6EF] hover:text-[#159A62]"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-[#D8E3DD] bg-white shadow-[0_8px_30px_rgba(23,35,29,0.06)]">
          <div className="h-[55vh] min-h-[420px] max-h-[620px] overflow-y-auto p-4 sm:p-6">
            {messages.map((message, index) => {
              const isUser =
                message.role === "user";

              return (
                <div
                  key={`${message.role}-${index}`}
                  className={`mb-5 flex items-end gap-2.5 ${
                    isUser
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#C7E4D2] bg-[#EAF6EF]">
                      <Shield
                        size={15}
                        className="text-[#159A62]"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] whitespace-pre-wrap px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[75%] ${
                      isUser
                        ? "rounded-2xl rounded-br-md bg-[#159A62] text-white"
                        : "rounded-2xl rounded-bl-md bg-[#F3F7F4] text-[#26332C]"
                    } ${
                      message.isError
                        ? "border border-[#F1B7B7] bg-[#FFF4F4] text-[#A43B3B]"
                        : ""
                    }`}
                  >
                    {message.content}
                  </div>

                  {isUser && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E1F2E8] text-xs font-bold text-[#159A62]">
                      U
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="mb-5 flex items-end gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C7E4D2] bg-[#EAF6EF]">
                  <Shield
                    size={15}
                    className="text-[#159A62]"
                  />
                </div>

                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-[#F3F7F4] px-4 py-4">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#159A62]" />
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#159A62]"
                    style={{
                      animationDelay: "150ms",
                    }}
                  />
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#159A62]"
                    style={{
                      animationDelay: "300ms",
                    }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="border-t border-[#E3EBE6] bg-[#FAFCFB] p-3 sm:p-4"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                placeholder="Ask Guardian AI about online safety..."
                disabled={loading}
                maxLength={4000}
                className="min-w-0 flex-1 rounded-xl border border-[#D5E0DA] bg-white px-4 py-3 text-sm text-[#26332C] outline-none placeholder:text-[#9AA69F] focus:border-[#159A62] focus:ring-2 focus:ring-[#159A62]/10 disabled:bg-[#F1F4F2]"
              />

              <button
                type="submit"
                disabled={
                  loading || !input.trim()
                }
                className="flex items-center gap-2 rounded-xl bg-[#159A62] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#10784C] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={16} />
                <span className="hidden sm:inline">
                  Send
                </span>
              </button>
            </div>

            <p className="mt-2 text-center text-[10px] text-[#8A9690]">
              Guardian AI provides security guidance and
              does not replace professional cybersecurity
              or financial advice.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Assistant;