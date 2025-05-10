"use client";

import React from "react";
import { Moon, Sun } from "lucide-react"; // Peer dependency
import { useTheme } from "next-themes"; // Peer dependency
import { motion, AnimatePresence } from "framer-motion"; // Peer dependency
import {
  Tooltip,
  TooltipContent,
  TooltipProvider, // Note: Prefer global TooltipProvider in consuming app
  TooltipTrigger,
} from "@radix-ui/react-tooltip"; // Direct dependency (bundled)

/**
 * A toggle button for switching between light and dark color themes.
 * Relies on `next-themes` for theme management and context.
 * Includes animated icons and a tooltip.
 *
 * @remarks
 * Ensure `ThemeProvider` from `next-themes` is set up in the consuming application.
 * Also, a `TooltipProvider` should ideally wrap the application or a significant portion of it.
 *
 * @returns A JSX.Element representing the dark mode toggle button.
 *
 * @example
 * ```tsx
 * // In a component within a ThemeProvider and TooltipProvider context:
 * <DarkModeToggle />
 * ```
 */
export const DarkModeToggle: React.FC = () => {
  const { setTheme, resolvedTheme } = useTheme(); // `theme` gives user preference, `resolvedTheme` gives actual
  const [mounted, setMounted] = React.useState(false);

  // Effect to ensure component is mounted before using theme, avoids hydration mismatch
  React.useEffect(() => setMounted(true), []);

  /**
   * Toggles the theme between 'light' and 'dark'.
   */
  const toggleTheme = () => {
    if (!mounted) return; // Prevent action before hydration
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  // Render a placeholder or nothing until mounted to prevent hydration errors
  if (!mounted) {
    // Placeholder to maintain layout space and prevent CLS
    return <div className="w-9 h-9" aria-hidden="true" />;
  }

  const tooltipText = resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    // Consider if TooltipProvider should be here or at a higher level in the consuming app.
    // For a library component, it's safer to include it or document its necessity.
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            onClick={toggleTheme}
            aria-label={tooltipText}
            // Base styles - Consumer provides these via their Tailwind setup
            className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full text-gray-700 dark:text-gray-300 bg-gray-200/50 dark:bg-gray-800/50 hover:bg-gray-300/70 dark:hover:bg-gray-700/70 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-gray-950"
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.95, rotate: -5 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {resolvedTheme === "dark" ? (
                <motion.div
                  key="moon"
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-indigo-400" // Icon color - consumer styles
                >
                  <Moon className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ y: -20, opacity: 0, rotate: 90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-yellow-500" // Icon color - consumer styles
                >
                  <Sun className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent
          // Base styles - Consumer provides via Tailwind
          className="bg-gray-900 text-white px-2 py-1 rounded text-xs shadow-lg dark:bg-gray-100 dark:text-gray-900 select-none"
        >
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
