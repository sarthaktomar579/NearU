import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import DailyImmersionCard from "../components/DailyImmersionCard";
import { SparklesIcon, XIcon } from "lucide-react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showIcebreaker, setShowIcebreaker] = useState(false);

  const { authUser } = useAuthUser();

  const { data: tokenData, isError: isTokenError } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });

  useEffect(() => {
    const initChat = async () => {
      if (isTokenError) {
        setError("Failed to get chat token from backend.");
        setLoading(false);
        return;
      }

      if (!authUser) return;

      if (tokenData && !tokenData.token) {
        setError("Backend failed to generate chat token. Check backend Stream API keys.");
        setLoading(false);
        return;
      }

      if (!tokenData) return; // Still loading tokenData

      try {
        console.log("Initializing stream chat client...");

        if (!STREAM_API_KEY) {
          throw new Error("Stream API key is missing (VITE_STREAM_API_KEY).");
        }

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
        setError(null);
      } catch (error) {
        console.error("Error initializing chat:", error);
        setError(error.message || "Could not connect to chat. Please try again.");
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, isTokenError, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  const handleInsertIcebreaker = (promptText) => {
    if (channel) {
      channel.sendMessage({
        text: `💡 Conversation Starter: ${promptText}`,
      });
      setShowIcebreaker(false);
      toast.success("Icebreaker sent to chat! 🚀");
    }
  };

  if (loading) return <ChatLoader />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[93vh]">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh] relative flex overflow-hidden">
      <div className="flex-1 h-full w-full">
        <Chat client={chatClient}>
          <Channel channel={channel}>
            <div className="w-full relative h-full flex flex-col">
              <CallButton
                handleVideoCall={handleVideoCall}
                onToggleIcebreaker={() => setShowIcebreaker((prev) => !prev)}
                isIcebreakerOpen={showIcebreaker}
              />
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput focus />
              </Window>
            </div>
            <Thread />
          </Channel>
        </Chat>
      </div>

      {/* Slide-over Immersion Drawer */}
      {showIcebreaker && (
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[420px] bg-base-100 z-50 shadow-2xl border-l border-base-300 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-base-300">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <SparklesIcon className="size-4 text-warning" />
              Conversation Spark & Icebreakers
            </h3>
            <button
              onClick={() => setShowIcebreaker(false)}
              className="btn btn-ghost btn-circle btn-sm"
              title="Close drawer"
            >
              <XIcon className="size-4" />
            </button>
          </div>
          <DailyImmersionCard onInsertPrompt={handleInsertIcebreaker} />
        </div>
      )}
    </div>
  );
};

export default ChatPage;
