import { ArrowRight } from "lucide-react";

interface SubmitButtonProps {
  loading: boolean;
}

export const SubmitButton = ({ loading }: SubmitButtonProps) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
    style={{ backgroundColor: "#bf262f" }}
  >
    {loading ? (
      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    ) : (
      <>
        Sign In <ArrowRight size={16} />
      </>
    )}
  </button>
);
