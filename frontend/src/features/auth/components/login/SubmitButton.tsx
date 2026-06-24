import { ArrowRight } from "lucide-react";

interface SubmitButtonProps {
  loading: boolean;
}

export const SubmitButton = ({ loading }: SubmitButtonProps) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full bg-[#0A3A2B] text-[#F4F4F0] py-3 rounded-xl font-semibold text-sm hover:bg-[#165a45] active:bg-[#0d4434] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-sm"
  >
    {loading ? (
      <span className="w-4 h-4 border-2 border-[#F4F4F0]/30 border-t-[#F4F4F0] rounded-full animate-spin" />
    ) : (
      <>
        Sign In <ArrowRight size={16} />
      </>
    )}
  </button>
);