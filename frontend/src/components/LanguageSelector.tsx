"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, Sparkles } from "lucide-react";
import useMounted from "@/hooks/useMounted";
import { LANGUAGE_CONFIG } from "@/constants";

function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const mounted = useMounted();

  const { language, setLanguage } = useCodeEditorStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLanguageObj = LANGUAGE_CONFIG[language];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (langId: string) => {
    setLanguage(langId);
    setIsOpen(false);
  };

  if (!mounted) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center gap-3 rounded-lg border border-gray-800/50 bg-[#1e1e2e]/80 px-4 py-2.5 transition-all duration-200 hover:border-gray-700`}
      >
        {/* Decoration */}
        <div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        />

        <div className="size-6 rounded-md bg-gray-800/50 p-0.5 transition-transform group-hover:scale-110">
          <img
            src={currentLanguageObj.logoPath}
            alt="programming language logo"
            width={24}
            height={24}
            className="relative z-10 h-full w-full object-contain"
          />
        </div>

        <span className="min-w-[80px] text-left text-gray-200 transition-colors group-hover:text-white">
          {currentLanguageObj.label}
        </span>

        <ChevronDownIcon
          className={`size-4 text-gray-400 transition-all duration-300 group-hover:text-gray-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 z-50 mt-2 w-64 rounded-xl border border-[#313244] bg-[#1e1e2e]/95 py-2 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-2 border-b border-gray-800/50 px-3 pb-2">
              <p className="text-xs font-medium text-gray-400">
                Select Language
              </p>
            </div>

            <div className="max-h-[280px] overflow-x-hidden overflow-y-auto">
              {Object.values(LANGUAGE_CONFIG).map((lang, index) => {
                return (
                  <motion.div
                    key={lang.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative px-2"
                  >
                    <button
                      className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${language === lang.id ? "bg-blue-500/10 text-blue-400" : "text-gray-300"} hover:bg-[#262637]`}
                      onClick={() => handleLanguageSelect(lang.id)}
                    >
                      {/* decorator */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />

                      <div
                        className={`relative size-8 rounded-lg p-1.5 transition-transform group-hover:scale-110 ${language === lang.id ? "bg-blue-500/10" : "bg-gray-800/50"} `}
                      >
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
                        <img
                          width={24}
                          height={24}
                          src={lang.logoPath}
                          alt={`${lang.label} logo`}
                          className="relative z-10 h-full w-full object-contain"
                        />
                      </div>

                      <span className="flex-1 text-left transition-colors group-hover:text-white">
                        {lang.label}
                      </span>

                      {/* selected language border */}
                      {language === lang.id && (
                        <motion.div
                          className="absolute inset-0 rounded-lg border-2 border-blue-500/30"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}

                      {language === lang.id && (
                        <Sparkles className="h-4 w-4 animate-pulse text-blue-400" />
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default LanguageSelector;
