import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getDailyImmersion, getRandomImmersion } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import {
  SparklesIcon,
  Volume2Icon,
  CopyIcon,
  CheckIcon,
  RefreshCwIcon,
  MessageCircleIcon,
  BookOpenIcon,
  FlameIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { getLanguageFlag } from "./FriendCard";
import { LANGUAGES } from "../constants";

const DailyImmersionCard = ({ initialLanguage, onInsertPrompt }) => {
  const { authUser } = useAuthUser();
  const defaultLanguage =
    initialLanguage || authUser?.learningLanguage || "Spanish";

  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // TanStack query with 1-hour staleTime to prevent unnecessary backend calls
  const {
    data: immersionData,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["immersion", selectedLanguage],
    queryFn: () => getDailyImmersion(selectedLanguage),
    staleTime: 60 * 60 * 1000,
  });

  // Shuffle mutation for exploring more idioms
  const { mutate: fetchRandom, isPending: isRandomPending } = useMutation({
    mutationFn: () => getRandomImmersion(selectedLanguage),
    onSuccess: (data) => {
      // Temporarily update data
      toast.success("Loaded another cultural spark! ✨");
    },
  });

  const word = immersionData?.wordOfTheDay;
  const idiom = immersionData?.culturalIdiom;
  const slang = immersionData?.slang;
  const starter = immersionData?.conversationStarter;

  // Audio pronunciation handler
  const playPronunciation = () => {
    if (!word?.word) return;

    if (word?.audioUrl) {
      const audio = new Audio(word.audioUrl);
      setIsPlayingAudio(true);
      audio.play().catch(() => playSpeechSynthesis());
      audio.onended = () => setIsPlayingAudio(false);
    } else {
      playSpeechSynthesis();
    }
  };

  const playSpeechSynthesis = () => {
    if ("speechSynthesis" in window) {
      setIsPlayingAudio(true);
      const utterance = new SpeechSynthesisUtterance(word.word);
      const langMap = {
        spanish: "es-ES",
        french: "fr-FR",
        german: "de-DE",
        japanese: "ja-JP",
        italian: "it-IT",
        korean: "ko-KR",
        mandarin: "zh-CN",
        hindi: "hi-IN",
        english: "en-US",
        portuguese: "pt-PT",
        russian: "ru-RU",
      };
      const langCode = langMap[selectedLanguage.toLowerCase()] || "en-US";
      utterance.lang = langCode;
      utterance.rate = 0.85; // slightly slower for language learners
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Audio playback not supported on this browser.");
    }
  };

  // Copy icebreaker to clipboard
  const handleCopyIcebreaker = () => {
    const textToCopy = starter?.prompt || starter?.question || idiom?.example || word?.example;
    if (!textToCopy) return;

    if (onInsertPrompt) {
      onInsertPrompt(textToCopy);
      toast.success("Icebreaker inserted into your chat! 🚀");
      return;
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Copied icebreaker! Paste it into your chat 🎉");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="card bg-base-200 border border-base-300 shadow-md overflow-hidden transition-all duration-300">
      {/* CARD HEADER */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/5 p-4 border-b border-base-300 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
            <SparklesIcon className="size-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-base tracking-tight flex items-center gap-1.5">
              Daily Immersion Spark
            </h3>
            <p className="text-xs opacity-70">Word & Idiom of the Day</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="select select-bordered select-xs text-xs font-medium max-w-[120px]"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="p-6 flex flex-col items-center justify-center space-y-3">
          <span className="loading loading-spinner loading-md text-primary" />
          <p className="text-xs opacity-70">Fetching cultural insights...</p>
        </div>
      ) : (
        <div className="card-body p-4 sm:p-5 space-y-4">
          {/* WORD OF THE DAY SECTION */}
          {word && (
            <div className="bg-base-100 p-3.5 rounded-xl border border-base-300/80 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">{word.word}</span>
                    {word.partOfSpeech && (
                      <span className="badge badge-sm badge-outline opacity-80 lowercase">
                        {word.partOfSpeech}
                      </span>
                    )}
                  </div>
                  {word.phonetic && (
                    <p className="text-xs font-mono opacity-60 mt-0.5">{word.phonetic}</p>
                  )}
                </div>

                {/* Pronounce Button */}
                <button
                  onClick={playPronunciation}
                  disabled={isPlayingAudio}
                  className="btn btn-circle btn-ghost btn-xs text-primary"
                  title="Listen to pronunciation"
                >
                  <Volume2Icon
                    className={`size-4 ${isPlayingAudio ? "animate-bounce text-secondary" : ""}`}
                  />
                </button>
              </div>

              <p className="text-sm text-base-content/90 font-medium">{word.meaning}</p>

              {word.example && (
                <div className="bg-base-200/60 p-2.5 rounded-lg border-l-2 border-primary text-xs space-y-1">
                  <p className="italic font-medium text-base-content">"{word.example}"</p>
                  {word.exampleTranslation && (
                    <p className="opacity-70 text-[11px]">{word.exampleTranslation}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CULTURAL IDIOM SECTION */}
          {idiom && (
            <div className="bg-base-100 p-3.5 rounded-xl border border-base-300/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-secondary uppercase tracking-wider">
                <BookOpenIcon className="size-3.5" />
                <span>Cultural Idiom</span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-base-content">"{idiom.phrase}"</h4>
                {idiom.literalTranslation && (
                  <p className="text-xs opacity-60 italic mt-0.5">
                    Lit: "{idiom.literalTranslation}"
                  </p>
                )}
              </div>

              <p className="text-xs opacity-90">
                <span className="font-semibold text-primary">Meaning: </span>
                {idiom.actualMeaning}
              </p>

              {idiom.example && (
                <div className="text-xs bg-base-200/50 p-2 rounded border border-base-300/40">
                  <p className="italic">"{idiom.example}"</p>
                  {idiom.exampleTranslation && (
                    <p className="opacity-70 text-[11px] mt-0.5">{idiom.exampleTranslation}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SLANG SNIPPET (IF PRESENT) */}
          {slang && (
            <div className="flex items-center justify-between text-xs bg-base-300/30 px-3 py-2 rounded-lg border border-base-300">
              <span className="flex items-center gap-1 font-semibold text-warning">
                <FlameIcon className="size-3.5" />
                Slang: <span className="text-base-content font-bold">{slang.term}</span>
              </span>
              <span className="opacity-80 text-[11px] truncate max-w-[170px]" title={slang.meaning}>
                {slang.meaning}
              </span>
            </div>
          )}

          {/* CONVERSATION STARTER & USE IN CHAT BUTTON */}
          {starter && (
            <div className="space-y-2 pt-1 border-t border-base-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold opacity-70 flex items-center gap-1">
                  <MessageCircleIcon className="size-3.5 text-primary" />
                  Today's Icebreaker
                </span>
              </div>

              <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 text-xs space-y-1.5">
                <p className="font-medium text-base-content">"{starter.question}"</p>
                {starter.translation && (
                  <p className="opacity-60 text-[11px] italic">{starter.translation}</p>
                )}
              </div>

              {/* Action Button: Use in Chat / Copy */}
              <button
                onClick={handleCopyIcebreaker}
                className="btn btn-primary btn-sm w-full gap-2 shadow-sm font-semibold mt-1"
              >
                {copied ? (
                  <>
                    <CheckIcon className="size-4 text-white" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <CopyIcon className="size-4" />
                    Use as Icebreaker
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyImmersionCard;
