// Internal component used by NavBar for the mobile popover menu.
"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Peer dependency
import FocusTrap from "focus-trap-react"; // Direct dependency (bundled)
import clsx from "clsx"; // Direct dependency (bundled)
import { X } from "lucide-react"; // Peer dependency
import Link from "next/link"; // Peer dependency

// Import internal components and types
import { DarkModeToggle } from "./DarkModeToggle";
import type { MenuItem } from "./NavBar";

// Import Radix Tooltip components (direct dependency)
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";

/**
 * Props for the MobileMenu component.
 * @internal
 */
interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAnimating: boolean;
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>;
  /** Ref to the button that triggered the mobile menu, for focus restoration. */
  triggerRef: React.RefObject<HTMLButtonElement>;
  menuItems: MenuItem[];
  /** The ID (without '#') of the currently active section. */
  activeSectionId?: string | null;
  /** Unique ID for the popover element, used for ARIA attributes. */
  popoverId: string;
  /** Optional CSS classes for the popover container. */
  popoverClassName?: string;
  /** Optional CSS classes for the wrapper of each menu item. */
  itemClassName?: string;
  /** Optional CSS classes for the link element of each menu item. */
  linkClassName?: string;
}

// --- Animation Variants ---
const ICON_OFFSET_X = "30px"; // Approx distance of icons from edge
const ICON_OFFSET_Y = "30px";

/** Popover animation variants */
const popoverVariants = {
  hidden: (custom: { width: number; height: number }) => ({
    clipPath: `circle(${Math.max(custom.width, custom.height) * 1.5}px at calc(100% - ${ICON_OFFSET_X}) ${ICON_OFFSET_Y})`,
    opacity: 0,
    transition: {
      duration: 0.5,
      opacity: { duration: 0.3, ease: "linear", delay: 0.2 },
      clipPath: { duration: 0.5, ease: "easeIn" },
      when: "beforeChildren",
      staggerChildren: 0.09,
      staggerDirection: -1,
    },
  }),
  visible: (custom: { width: number; height: number }) => ({
    clipPath: `circle(${Math.max(custom.width, custom.height) * 1.5}px at calc(100% - ${ICON_OFFSET_X}) ${ICON_OFFSET_Y})`,
    opacity: 1,
    transition: {
      duration: 0.5,
      opacity: { duration: 0.1, ease: "linear" },
      clipPath: { duration: 0.5, ease: "easeOut" },
      when: "beforeChildren",
      delayChildren: 0.05,
      staggerChildren: 0.09,
    },
  }),
};

/** Default transition for menu items */
const defaultItemTransition = { type: "spring", damping: 15, stiffness: 100 };
/** Diverse animation variants for individual menu items */
const menuItemVariants = [
  {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: defaultItemTransition },
  },
  {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: defaultItemTransition },
  },
  {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: defaultItemTransition },
  },
  {
    hidden: { opacity: 0, rotate: -10, x: -20 },
    visible: { opacity: 1, rotate: 0, x: 0, transition: defaultItemTransition },
  },
  {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: defaultItemTransition },
  },
  {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: defaultItemTransition },
  },
];
// --- End Animation Variants ---

/**
 * Renders the full-screen mobile navigation popover.
 * Includes menu items, dark mode toggle, focus trapping, and animations.
 * This component is intended for internal use by the main `NavBar` component.
 *
 * @param props - The props for the MobileMenu.
 * @returns A JSX.Element representing the mobile menu popover, or null if not open.
 * @internal
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  setIsOpen,
  isAnimating,
  setIsAnimating,
  triggerRef,
  menuItems,
  activeSectionId,
  popoverId,
  popoverClassName,
  itemClassName,
  linkClassName,
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const popoverRef = useRef<HTMLDivElement>(null); // Ref for FocusTrap fallback

  // Effect to get window dimensions for circle animation
  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== "undefined") {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      }
    };
    updateDimensions(); // Initial call
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  // Effect to lock body scroll when menu is open
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = isOpen ? "hidden" : "";
      // Cleanup function
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  // Effect for 'Escape' key to close menu
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !isAnimating) {
        setIsOpen(false);
      }
    },
    [isOpen, isAnimating, setIsOpen]
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [handleKeyDown]);

  /** Handles closing the menu, preventing action if animating. */
  const handleCloseMenu = useCallback(() => {
    if (!isAnimating) {
      setIsOpen(false);
    }
  }, [isAnimating, setIsOpen]);

  /** Sets `isAnimating` to true when popover animation starts. */
  const onAnimationStartCallback = useCallback(() => setIsAnimating(true), [setIsAnimating]);
  /** Sets `isAnimating` to false and restores focus when popover exit animation completes. */
  const onAnimationCompleteCallback = useCallback(() => {
    setIsAnimating(false);
    // Restore focus to the trigger button when the menu is fully closed (after exit animation)
    if (!isOpen && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [isOpen, triggerRef, setIsAnimating]);

  return (
    <AnimatePresence custom={dimensions} mode="wait" onExitComplete={onAnimationCompleteCallback}>
      {isOpen && (
        <FocusTrap
          active={isOpen && !isAnimating} // Activate trap when menu is open and not in the middle of its own open/close animation
          focusTrapOptions={{
            initialFocus: () =>
              popoverRef.current?.querySelector(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
              ) ||
              popoverRef.current ||
              false, // Try to focus first interactive element
            fallbackFocus: popoverRef.current ?? undefined, // Focus popover itself if nothing else
            allowOutsideClick: true, // Allows clicks outside to potentially close menu (if app implements that)
            onDeactivate: () => {
              // When trap deactivates (e.g., menu closes)
              // Focus restoration is handled by onAnimationCompleteCallback for smoother timing
            },
          }}
        >
          <motion.div
            ref={popoverRef}
            key="mobile-menu-popover" // Stable key for AnimatePresence
            id={popoverId} // For aria-controls
            role="dialog" // ARIA role for a dialog
            aria-modal="true" // Indicates it's a modal dialog
            aria-label="Mobile Navigation Menu"
            custom={dimensions} // Pass dimensions for variant calculations
            variants={popoverVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            // Base styles - consumer's Tailwind provides these
            className={clsx(
              "fixed inset-0 z-40 h-[100dvh] w-screen bg-white/90 dark:bg-black/90 backdrop-blur-md overflow-hidden",
              popoverClassName // Consumer-provided classes
            )}
            onAnimationStart={onAnimationStartCallback}
            // onAnimationComplete for *entry* can be set here if needed,
            // but onExitComplete on AnimatePresence handles exit completion.
          >
            {/* Optional Background Flair - Subtle Animated Gradient */}
            <motion.div
              className="absolute inset-0 -z-10 opacity-30 dark:opacity-20 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)",
              }}
              animate={{
                background: [
                  "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)",
                  "linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(236, 72, 153, 0.1) 100%)",
                  "linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)",
                ],
              }}
              transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            />

            {/* Close Button */}
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    className={clsx(
                      "absolute top-4 right-4 z-50 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500",
                      { "cursor-not-allowed": isAnimating, "opacity-50": isAnimating } // Visual cue for disabled state
                    )}
                    onClick={handleCloseMenu}
                    disabled={isAnimating}
                    aria-label="Close menu"
                    // Animation for the X button itself
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1, transition: { delay: 0.2 } }} // Slight delay for X to appear
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }} // Rotate opposite way on exit
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1, rotate: -10 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 text-white px-2 py-1 rounded text-xs shadow-lg dark:bg-gray-100 dark:text-gray-900 select-none">
                  <p>Close Menu</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Menu Items & Toggle Container */}
            <motion.div
              className="flex flex-col items-center justify-center h-full pt-16 pb-20 space-y-4 overflow-y-auto" // Added scroll for many items
              // Staggering of children is handled by popoverVariants
            >
              {menuItems.map((item, index) => {
                const isActive = activeSectionId ? `#${activeSectionId}` === item.href : false;
                return (
                  <motion.div
                    key={item.name}
                    // Apply one of the diverse animation variants cyclically
                    variants={menuItemVariants[index % menuItemVariants.length]}
                    className={clsx("overflow-hidden w-full text-center", itemClassName)}
                  >
                    <Link
                      href={item.href}
                      onClick={handleCloseMenu} // Close menu on item click
                      className={clsx(
                        // Base styles for link - consumer's Tailwind provides these
                        `block px-4 py-3 rounded-md text-2xl font-medium transition-all duration-200 transform hover:scale-105 w-fit mx-auto relative`,
                        isActive
                          ? "text-indigo-600 dark:text-indigo-400 font-semibold" // Active state
                          : "text-gray-800 dark:text-gray-200 hover:bg-indigo-100/30 dark:hover:bg-indigo-900/20", // Default state
                        linkClassName // Consumer classes
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.name}
                      {/* Active indicator dot */}
                      {isActive && (
                        <motion.span
                          layoutId="mobile-active-dot" // Animate dot between items
                          className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 h-2 w-2 bg-indigo-500 rounded-full"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
              {/* Dark mode toggle */}
              <motion.div
                // Apply animation variant similar to menu items
                variants={menuItemVariants[menuItems.length % menuItemVariants.length]}
                className="mt-8 pt-4 border-t border-gray-300/50 dark:border-gray-700/50 w-4/5 sm:w-1/2 flex justify-center"
              >
                <DarkModeToggle />
              </motion.div>
            </motion.div>
          </motion.div>
        </FocusTrap>
      )}
    </AnimatePresence>
  );
};
