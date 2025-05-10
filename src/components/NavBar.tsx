'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
    motion, useScroll, useMotionValueEvent, useTransform,
    AnimatePresence
} from 'framer-motion'; // Peer dependency
import clsx from 'clsx'; // Direct dependency (bundled)
import { useTheme } from 'next-themes'; // Peer dependency
import { Menu as MenuIcon } from 'lucide-react'; // Peer dependency
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"; // Bundled dependency

// Import internal components using relative paths
import { Logo, LogoProps } from './Logo';
import { DarkModeToggle } from './DarkModeToggle';
import { DesktopMenuPart } from './DesktopMenu'; // Internal, renamed
import { MobileMenu } from './MobileMenu';       // Internal
// Import hook
import { useScrollspy, ScrollspyOptions } from '../hooks/useScrollspy';

// --- Prop Types ---
/**
 * Defines the structure for a navigation menu item.
 */
export interface MenuItem {
  /** The display name of the menu item. */
  name: string;
  /** The URL or hash link for the menu item (e.g., '/about' or '#contact'). */
  href: string;
}

// Re-export related types for consumer convenience
export type { LogoProps };
export type { ScrollspyOptions };

/**
 * Props for the main NavBar component.
 */
export interface NavBarProps {
  /** Array of menu item objects to display in the navigation. */
  menuItems: MenuItem[];
  /**
   * Optional custom ReactNode to use as the logo.
   * If provided, `logoProps` will be ignored.
   */
  logoComponent?: React.ReactNode;
  /** Props to pass to the default `Logo` component if `logoComponent` is not provided. */
  logoProps?: LogoProps;
  /**
   * Optional custom ReactNode to use as the dark mode toggle.
   */
  darkModeToggleComponent?: React.ReactNode;
   /** Optional CSS class(es) to apply to the main `<header>` element. */
  className?: string;
   /** Optional CSS class(es) to apply to the inner container `div` that centers content. */
  containerClassName?: string;
   /** Optional CSS class(es) to apply to the mobile menu popover `div`. */
  mobilePopoverClassName?: string;
   /** Optional CSS class(es) to apply to desktop menu link (`<a>`) elements. */
  desktopLinkClassName?: string;
   /** Optional CSS class(es) to apply to mobile menu item wrapper `div`s. */
  mobileItemClassName?: string;
   /** Optional CSS class(es) to apply to mobile menu link (`<a>`) elements. */
  mobileLinkClassName?: string;
   /**
    * Scroll Y position (in pixels) at which the navbar background starts its transition to a glassy state.
    * @default 0
    */
  scrollThreshold?: number;
   /**
    * The range (in pixels) over which the navbar background transition occurs.
    * The transition completes at `scrollThreshold + scrollTransitionRange`.
    * @default 100
    */
  scrollTransitionRange?: number;
   /**
    * Whether to enable scrollspy functionality for highlighting active menu items based on scroll position.
    * @default true
    */
  enableScrollspy?: boolean;
   /**
    * Custom options for the `useScrollspy` hook, including `rootMargin` and `threshold`.
    * Overrides `scrollspyRootMargin` if both are provided.
    */
  scrollspyOptions?: ScrollspyOptions;
  /**
   * @deprecated Use `scrollspyOptions.rootMargin` instead.
   * `rootMargin` for the scrollspy IntersectionObserver. Defines the viewport bounds for intersection.
   */
  scrollspyRootMargin?: string;
}

// --- Component Implementation ---

/**
 * A highly customizable, animated, and responsive navigation bar component.
 * Designed for React/Next.js applications using Tailwind CSS and Framer Motion.
 *
 * @param props - The props for the NavBar component.
 * @returns A JSX.Element representing the navigation bar.
 *
 * @example
 * ```tsx
 * const menuItems = [{ name: "Home", href: "#home" }, { name: "About", href: "#about" }];
 * <NavBar menuItems={menuItems} logoProps={{ initials: "MySite" }} />
 * ```
 */
export const NavBar: React.FC<NavBarProps> = ({
  menuItems,
  logoComponent,
  logoProps,
  darkModeToggleComponent,
  className,
  containerClassName,
  mobilePopoverClassName,
  desktopLinkClassName,
  mobileItemClassName,
  mobileLinkClassName,
  scrollThreshold = 0,
  scrollTransitionRange = 100,
  enableScrollspy = true,
  scrollspyOptions,
  scrollspyRootMargin, // Kept for backward compatibility if someone uses it, but options is preferred
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false); // For hide-on-scroll
  const [isAnimating, setIsAnimating] = useState(false); // For mobile menu open/close animation
  const { resolvedTheme } = useTheme(); // From next-themes
  const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null); // Ref for hamburger button
  const { scrollY } = useScroll(); // Framer Motion scroll hook

  // Memoize item IDs for scrollspy to prevent unnecessary re-renders of useScrollspy
  const scrollspyItemIds = useMemo(() =>
    enableScrollspy
      ? menuItems
          .map(item => item.href.startsWith('#') ? item.href.substring(1) : '') // Get ID part
          .filter(id => id) // Filter out empty strings (non-hash links)
      : [],
  [menuItems, enableScrollspy]);

  // Determine scrollspy options, prioritizing the full options object
  const effectiveScrollspyOptions = useMemo(() => {
    if (scrollspyOptions) return scrollspyOptions;
    if (scrollspyRootMargin) return { rootMargin: scrollspyRootMargin };
    return undefined; // Let useScrollspy use its defaults
  }, [scrollspyOptions, scrollspyRootMargin]);

  const activeSectionId = useScrollspy(scrollspyItemIds, effectiveScrollspyOptions);

  // Scroll Hide/Show Logic for the entire NavBar
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;
    // Calculate the point at which hiding can start (after background transition is mostly complete)
    const effectiveHideStartThreshold = scrollThreshold + scrollTransitionRange;
    const scrollDirectionChangeSensitivity = 10; // How many pixels to scroll before changing hide/show state

    if (latest > effectiveHideStartThreshold && diff > scrollDirectionChangeSensitivity) {
        setIsHidden(true); // Scrolling down past threshold
    } else if (diff < -scrollDirectionChangeSensitivity || latest <= effectiveHideStartThreshold) {
        setIsHidden(false); // Scrolling up or near top
    }
  });

  // Smooth Background Transition Logic based on scrollY
  const scrollRangeForBgTransition: [number, number] = [scrollThreshold, scrollThreshold + scrollTransitionRange];
  // Define start/end colors for light and dark themes (using rgba for opacity)
  const lightBgStart = "rgba(255, 255, 255, 0)";
  const lightBgEnd = "rgba(255, 255, 255, 0.75)"; // Glassy white
  const darkBgStart = "rgba(17, 24, 39, 0)";     // Matches Tailwind's gray-900 for dark theme start
  const darkBgEnd = "rgba(17, 24, 39, 0.75)";   // Glassy dark gray

  // Select colors based on the current resolved theme
  const baseBgColor = resolvedTheme === 'dark' ? darkBgStart : lightBgStart;
  const endBgColor = resolvedTheme === 'dark' ? darkBgEnd : lightBgEnd;

  // Framer Motion `useTransform` for smooth style changes
  const backgroundColor = useTransform(scrollY, scrollRangeForBgTransition, [baseBgColor, endBgColor], { clamp: true });
  const backdropFilter = useTransform(scrollY, scrollRangeForBgTransition, ["blur(0px)", "blur(10px)"], { clamp: true }); // Glassmorphism blur
  const borderOpacity = useTransform(scrollY, scrollRangeForBgTransition, [0, 0.08], { clamp: true }); // Subtle border
  const shadowOpacity = useTransform(scrollY, scrollRangeForBgTransition, [0, 1], { clamp: true }); // Shadow for depth

  // Effect to close mobile menu if window resizes to desktop width
   useEffect(() => {
        const handleResize = () => {
            if (typeof window !== 'undefined' && window.innerWidth >= 768 && isMobileMenuOpen) { // Tailwind 'md' breakpoint
                setIsMobileMenuOpen(false);
                setIsAnimating(false); // Reset animation state
            }
        };
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [isMobileMenuOpen]);

  /** Opens the mobile menu if not currently animating. */
  const handleOpenMenu = useCallback(() => {
    if (!isAnimating) {
        setIsMobileMenuOpen(true);
    }
  }, [isAnimating]);

  // Generate a unique ID for ARIA controls (useful if multiple NavBars on a page, though unlikely)
  const mobilePopoverId = React.useId ? React.useId() : 'rk-navbar-mobile-popover-' + Math.random().toString(36).substr(2, 9);

  // Split menu items for the centered logo layout on desktop
  const midPoint = Math.ceil(menuItems.length / 2);
  const leftMenuItems = menuItems.slice(0, midPoint);
  const rightMenuItems = menuItems.slice(midPoint);

  return (
    <TooltipProvider delayDuration={100}> {/* Context for all tooltips within NavBar */}
      <motion.header
        role="navigation" // ARIA role for navigation landmark
        aria-label="Main Navigation"
        variants={{ visible: { y: 0, opacity: 1 }, hidden: { y: "-110%", opacity: 0 } }}
        animate={isHidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        // Base styles - consumer's Tailwind provides these
        className={clsx("fixed top-0 left-0 right-0 z-30", className)}
        // Apply animated styles directly
        style={{
            backgroundColor,
            backdropFilter,
            WebkitBackdropFilter: backdropFilter, // For Safari compatibility
        }}
      >
         {/* Animated Border */}
         <motion.div
             className="absolute inset-x-0 bottom-0 h-px bg-gray-300 dark:bg-gray-700 pointer-events-none" // Prevent interaction
             style={{ opacity: borderOpacity }}
         />
          {/* Animated Shadow */}
         <motion.div
            className="absolute inset-0 -z-10 shadow-md dark:shadow-lg pointer-events-none" // Behind content, no interaction
            style={{ opacity: shadowOpacity }}
         />

        <div className={clsx("container mx-auto px-4 sm:px-6 lg:px-8", containerClassName)}>
          <div className="flex justify-between items-center h-16 md:h-20"> {/* Standard navbar height */}

            {/* === DESKTOP NAVIGATION === */}
            <div className="hidden md:flex flex-1 items-center justify-between w-full">
              {/* Left Menu Section */}
              <div className="flex-1 flex justify-start">
                <DesktopMenuPart
                    menuItems={leftMenuItems}
                    activeSectionId={activeSectionId}
                    linkClassName={desktopLinkClassName}
                    direction="left"
                />
              </div>

              {/* Centered Logo Section */}
              <div className="flex-shrink-0 mx-4 lg:mx-6"> {/* Margins for spacing */}
                {logoComponent ? logoComponent : <Logo {...logoProps} />}
              </div>

              {/* Right Menu Section & Dark Mode Toggle */}
              <div className="flex-1 flex items-center justify-end space-x-6">
                <DesktopMenuPart
                    menuItems={rightMenuItems}
                    activeSectionId={activeSectionId}
                    linkClassName={desktopLinkClassName}
                    direction="right"
                />
                {darkModeToggleComponent ? darkModeToggleComponent : <DarkModeToggle />}
              </div>
            </div>

            {/* === MOBILE NAVIGATION === */}
            <div className="flex md:hidden flex-1 justify-between items-center w-full">
              {/* Logo on Mobile (typically left) */}
              <div className="flex-shrink-0">
                 {logoComponent ? logoComponent : <Logo {...logoProps} />}
              </div>

              {/* Mobile Toggles (Dark Mode & Hamburger) */}
              <div className="flex items-center space-x-3 sm:space-x-4"> {/* Adjusted spacing */}
                {darkModeToggleComponent ? darkModeToggleComponent : <DarkModeToggle />}
                <AnimatePresence initial={false}>
                 {!isMobileMenuOpen && (
                   <Tooltip>
                     <TooltipTrigger asChild>
                        <motion.button
                            ref={mobileMenuTriggerRef} // For focus restoration
                            key="hamburger-button"
                            className={clsx(
                                'relative z-50 p-2 -mr-1 sm:-mr-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500',
                                { 'cursor-not-allowed': isAnimating, 'opacity-50': isAnimating }
                            )}
                            onClick={handleOpenMenu}
                            disabled={isAnimating}
                            aria-label="Open menu"
                            aria-expanded={isMobileMenuOpen} // ARIA state for expanded
                            aria-controls={mobilePopoverId}   // Links to popover ID
                            // Animation for hamburger icon itself
                            animate={{ opacity: isAnimating ? 0.5 : 1, scale: 1, rotate: 0 }}
                            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                            exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                        >
                           <MenuIcon className="h-6 w-6" />
                        </motion.button>
                     </TooltipTrigger>
                     <TooltipContent className="bg-gray-900 text-white px-2 py-1 rounded text-xs shadow-lg dark:bg-gray-100 dark:text-gray-900 select-none">
                       <p>Open Menu</p>
                     </TooltipContent>
                   </Tooltip>
                 )}
               </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.header>

      {/* Mobile Menu Popover Component (Rendered outside header for stacking context) */}
      <MobileMenu
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
          triggerRef={mobileMenuTriggerRef} // Pass ref for focus restoration
          menuItems={menuItems}
          activeSectionId={activeSectionId}
          popoverId={mobilePopoverId} // Pass ID for ARIA linking
          popoverClassName={mobilePopoverClassName}
          itemClassName={mobileItemClassName}
          linkClassName={mobileLinkClassName}
      />
    </TooltipProvider>
  );
};