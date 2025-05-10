// This component is used internally by NavBar to render a PART of the desktop menu (left or right).
"use client";

import React from "react";
import Link from "next/link"; // Peer dependency
import { motion, AnimatePresence } from "framer-motion"; // Peer dependency
import clsx from "clsx"; // Direct dependency (bundled)
import type { MenuItem } from "./NavBar"; // Type import from sibling

// --- Animation Variants ---
/**
 * Framer Motion variants for the container of each navigation item.
 * @param direction - The direction from which the item should animate ('left' or 'right').
 */
const navItemContainerVariants = (direction: "left" | "right") => ({
  hidden: { opacity: 0, x: direction === "left" ? -25 : 25, y: -5 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15, restDelta: 0.001 },
  },
});

/**
 * Framer Motion variants for the highlight effect on navigation items.
 */
const highlightVariants = {
  initial: { opacity: 0, scale: 0.9, y: 3 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: "circOut" } },
  exit: { opacity: 0, scale: 0.9, y: 3, transition: { duration: 0.15, ease: "circIn" } },
};
// --- End Animation Variants ---

/**
 * Props for the DesktopMenuPart component.
 * @internal
 */
interface DesktopMenuPartProps {
  /** Array of menu items to display in this part of the menu. */
  menuItems: MenuItem[];
  /** The ID (without '#') of the currently active section, for highlighting. */
  activeSectionId?: string | null;
  /** Optional CSS classes to apply to the link elements. */
  linkClassName?: string;
  /** The direction this menu part represents, affecting alignment and animation. */
  direction: "left" | "right";
}

/**
 * Renders a part (left or right side) of the desktop navigation menu.
 * This component is intended for internal use by the main `NavBar` component.
 *
 * @param props - The props for the DesktopMenuPart.
 * @returns A JSX.Element representing a segment of the desktop menu.
 * @internal
 */
export const DesktopMenuPart: React.FC<DesktopMenuPartProps> = ({
  menuItems,
  activeSectionId,
  linkClassName,
  direction,
}) => {
  return (
    <motion.div
      className={clsx(
        "flex items-center",
        // Consumer's Tailwind provides space utilities (e.g., space-x-1)
        direction === "left"
          ? "space-x-1 lg:space-x-2 justify-end"
          : "space-x-1 lg:space-x-2 justify-start"
      )}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.07, delayChildren: 0.25 }} // Stagger animation for items
      role="menubar"
      aria-label={
        direction === "left"
          ? "Desktop Navigation Menu Left Side"
          : "Desktop Navigation Menu Right Side"
      }
    >
      {menuItems.map((item) => (
        <motion.div
          key={item.name}
          variants={navItemContainerVariants(direction)}
          role="none" // This div is for layout/animation, role is on NavItem's inner elements
        >
          <NavItem
            item={item}
            isActive={activeSectionId ? `#${activeSectionId}` === item.href : false}
            linkClassName={linkClassName}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

/**
 * Props for the individual NavItem component.
 * @internal
 */
interface NavItemProps {
  item: MenuItem;
  isActive: boolean;
  linkClassName?: string;
}

/**
 * Renders an individual navigation item for the desktop menu.
 * Includes hover and active state effects.
 * @param props - The props for the NavItem.
 * @returns A JSX.Element representing a single menu item.
 * @internal
 */
const NavItem: React.FC<NavItemProps> = ({ item, isActive, linkClassName }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative px-0.5 py-0.5" // Padding for highlight to fit correctly
      role="menuitem" // ARIA role for a menu item
      whileHover={{ y: -2.5 }} // Subtle lift effect on hover
      transition={{ type: "spring", stiffness: 350, damping: 18 }}
    >
      <Link
        href={item.href}
        className={clsx(
          // Base styles for link - consumer's Tailwind provides these utilities
          `relative group block px-3 py-2 text-sm lg:text-base font-medium transition-colors duration-150 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900`,
          isActive
            ? "text-indigo-600 dark:text-indigo-400" // Active state text color
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100", // Default & hover text colors
          linkClassName // Allow consumer to pass additional classes
        )}
        aria-current={isActive ? "page" : undefined} // ARIA attribute for current page link
      >
        {item.name}
      </Link>
      {/* Highlight effect - a pill that animates in */}
      <AnimatePresence>
        {(isHovered || isActive) && (
          <motion.div
            // Unique layoutId for smooth animation when moving between items
            layoutId={`desktop-nav-item-highlight-${item.name.replace(/\s+/g, "-")}`}
            variants={highlightVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            // Base styles for highlight - consumer's Tailwind provides these utilities
            className="absolute inset-0 -z-10 bg-gray-100 dark:bg-gray-800/70 rounded-md shadow-sm pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
