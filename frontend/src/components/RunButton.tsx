import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import React from "react";

interface RunButtonProps {
  onClick: () => Promise<void> | void;
  isLoading?: boolean;
  label: string;
  icon?: React.ReactNode;
}

function RunButton({ onClick, isLoading, label, icon }: RunButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={isLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative inline-flex items-center gap-2.5 px-5 py-2.5 focus:outline-none disabled:cursor-not-allowed`}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 opacity-100 transition-opacity group-hover:opacity-90" />
      <div className="relative flex items-center gap-2.5">
        {isLoading ? (
          <>
            <div className="relative">
              <Loader2 className="h-4 w-4 animate-spin text-white/70" />
              <div className="absolute inset-0 animate-pulse blur" />
            </div>
            <span className="text-sm font-medium text-white/90">
              Processing...
            </span>
          </>
        ) : (
          <>
            <div className="relative flex h-4 w-4 items-center justify-center">
              {icon}
            </div>
            <span className="text-sm font-medium text-white/90 group-hover:text-white">
              {label}
            </span>
          </>
        )}
      </div>
    </motion.button>
  );
}

export default RunButton;
