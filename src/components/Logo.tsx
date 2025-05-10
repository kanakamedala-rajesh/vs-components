"use client";

import React from "react";
import Link from "next/link";
import { motion, Target, TargetAndTransition } from "framer-motion"; // Import Target types
import clsx from "clsx";

/**
 * Props for the Logo component.
 */
export interface LogoProps {
  /**
   * The initials or short text to display for the logo.
   * @default "RK"
   */
  initials?: string;
  /**
   * The URL the logo links to when clicked.
   * @default "/"
   */
  href?: string;
  /**
   * Optional additional CSS classes to apply to the outer `<a>` tag (the link wrapper).
   * This allows for custom layout or spacing around the logo component.
   */
  className?: string;
  /**
   * Optional additional CSS classes to apply directly to the inner `<span>` tag containing the initials.
   * Use this for applying custom font families, text sizes, or other text-specific styles
   * that should be provided by the consumer (e.g., `font-serif`, `text-4xl`).
   */
  textClassName?: string;
  /**
   * Optional: Framer Motion `initial` variant props for the logo text span.
   * Allows customization of the entry animation.
   * @see {@link https://www.framer.com/motion/animation/#variants}
   */
  initialVariant?: Target;
  /**
   * Optional: Framer Motion `animate` variant props for the logo text span.
   * Allows customization of the visible state animation.
   */
  animateVariant?: TargetAndTransition;
  /**
   * Optional: Framer Motion `whileHover` variant props for the logo text span.
   * Allows customization of the hover animation.
   */
  hoverVariant?: TargetAndTransition;
  /**
   * Optional: Framer Motion `whileTap` variant props for the logo text span.
   * Allows customization of the tap/click animation.
   */
  tapVariant?: TargetAndTransition;
}

/**
 * A customizable, animated logo component.
 * Displays initials and links to a specified URL.
 * Supports custom styling and Framer Motion animation overrides.
 *
 * @param props - The props for the Logo component.
 * @returns A JSX.Element representing the logo.
 *
 * @example
 * ```tsx
 * <Logo
 *   initials="MySite"
 *   href="/home"
 *   textClassName="font-my-custom-font text-brand-primary"
 *   hoverVariant={{ scale: 1.2, color: "#ff0000" }}
 * />
 * ```
 */
export const Logo: React.FC<LogoProps> = ({
  initials = "RK",
  href = "/",
  className,
  textClassName,
  initialVariant,
  animateVariant,
  hoverVariant,
  tapVariant,
}) => {
  // Define default Framer Motion animations
  const defaultInitial: Target = { y: -20, opacity: 0, scale: 0.9 };
  const defaultAnimate: TargetAndTransition = {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { delay: 0.1, duration: 0.4, type: "spring", stiffness: 100 },
  };
  const defaultHover: TargetAndTransition = {
    scale: 1.15,
    rotate: [0, -3, 3, -3, 0], // Subtle wiggle
    // Using CSS variables for theme-aware filter is tricky with Framer Motion directly.
    // Consumer can apply this through `textClassName` or `hoverVariant` if highly specific filter needed.
    // For simplicity here, we'll use a generic shadow or rely on consumer overrides.
    filter: "drop-shadow(0px 0px 6px rgba(99, 102, 241, 0.5))", // Example indigo-like glow
    transition: { duration: 0.4, type: "spring", stiffness: 200, damping: 10 },
  };
  const defaultTap: TargetAndTransition = { scale: 1.05 };

  return (
    <Link href={href} className={clsx("z-20 flex-shrink-0", className)} aria-label="Homepage Logo">
      <motion.span
        className={clsx(
          // Base styles for text - consumer's Tailwind config provides these utilities
          "text-3xl font-bold text-gray-900 dark:text-gray-100",
          "cursor-pointer transition-colors duration-300 ease-in-out",
          "hover:text-indigo-500 dark:hover:text-indigo-300", // Hover text color change
          "inline-block", // Necessary for some transforms to apply correctly
          textClassName // Consumer-provided classes for font, text color, etc.
        )}
        style={{ fontVariantLigatures: "common-ligatures" }} // Optional stylistic choice
        initial={initialVariant ?? defaultInitial}
        animate={animateVariant ?? defaultAnimate}
        whileHover={hoverVariant ?? defaultHover}
        whileTap={tapVariant ?? defaultTap}
      >
        {initials}
      </motion.span>
    </Link>
  );
};
