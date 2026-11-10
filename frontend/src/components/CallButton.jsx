import { VideoIcon, SparklesIcon } from "lucide-react";

function CallButton({ handleVideoCall, onToggleIcebreaker, isIcebreakerOpen }) {
  return (
    <div className="p-3 border-b flex items-center justify-end gap-2 max-w-7xl mx-auto w-full absolute top-0 z-10 pointer-events-auto">
      {onToggleIcebreaker && (
        <button
          onClick={onToggleIcebreaker}
          className={`btn btn-sm gap-1.5 shadow-sm ${
            isIcebreakerOpen ? "btn-secondary" : "btn-outline bg-base-100/90 backdrop-blur"
          }`}
          title="Daily Immersion & Icebreakers"
        >
          <SparklesIcon className="size-4 text-warning animate-pulse" />
          <span className="hidden sm:inline text-xs font-semibold">Daily Spark</span>
        </button>
      )}

      <button
        onClick={handleVideoCall}
        className="btn btn-success btn-sm text-white shadow-sm"
        title="Start Video Call"
      >
        <VideoIcon className="size-5" />
      </button>
    </div>
  );
}

export default CallButton;
