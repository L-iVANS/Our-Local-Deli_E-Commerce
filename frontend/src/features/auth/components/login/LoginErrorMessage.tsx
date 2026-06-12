import { AlertCircle } from "lucide-react";

interface LoginErrorMessageProps {
  error: string;
  mutationError: any;
}

export const LoginErrorMessage = ({ error, mutationError }: LoginErrorMessageProps) => {
  if (!error && !mutationError) return null;

  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm mb-5">
      <AlertCircle size={16} />
      <span>
        {error ||
          mutationError?.response?.data?.message ||
          mutationError?.message ||
          "Login failed. Please try again."}
      </span>
    </div>
  );
};
