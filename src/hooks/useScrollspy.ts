"use client"; // Indicate client-side hook

import { useState, useEffect, useRef } from "react";

/**
 * Options for configuring the IntersectionObserver in useScrollspy.
 */
export interface ScrollspyOptions {
  /**
   * A string which specifies a set of offsets to add to the root's bounding_box
   * when calculating intersections, effectively shrinking or growing the root
   * for calculation purposes.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin}
   * @default '-20% 0px -80% 0px' (Activates when section is roughly in the middle 60% of the viewport height)
   */
  rootMargin?: string;
  /**
   * Either a single number or an array of numbers which indicate at what percentage
   * of the target's visibility the observer's callback should be executed.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/threshold}
   * @default 0
   */
  threshold?: number | number[];
}

const DEFAULT_ROOT_MARGIN = "-20% 0px -80% 0px"; // Activates when section is roughly in the middle 60%
const DEFAULT_THRESHOLD = 0;

/**
 * A React hook that detects which element ID is currently considered "active"
 * in the viewport based on scroll position. It uses the IntersectionObserver API.
 *
 * @remarks
 * This hook is intended for client-side use only.
 * Target elements must have IDs matching the `itemIds` provided.
 *
 * @param itemIds - An array of element IDs (strings, without the '#' prefix) to observe.
 *                  The hook will determine which of these is currently "active".
 * @param options - Optional configuration for the IntersectionObserver.
 *                  Includes `rootMargin` and `threshold`.
 *
 * @returns The ID (string, without '#') of the currently active element, or `null` if none are active
 *          or if the hook is running in an environment without `document`.
 *
 * @example
 * ```tsx
 * const sectionIds = ['about', 'services', 'contact'];
 * const activeSection = useScrollspy(sectionIds, { rootMargin: '-50% 0px -50% 0px' });
 *
 * useEffect(() => {
 *   if (activeSection) {
 *     console.log(`Active section: ${activeSection}`);
 *   }
 * }, [activeSection]);
 * ```
 */
export function useScrollspy(itemIds: string[], options?: ScrollspyOptions): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  // Using a Map to store refs allows easy addition/removal if itemIds were dynamic
  const observedElementsRef = useRef<Map<string, HTMLElement>>(new Map());

  // Memoize options to prevent unnecessary effect runs if options object is recreated
  const memoizedOptions = JSON.stringify(options);

  useEffect(() => {
    // Ensure this code runs only on the client where `document` is available
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const currentOptions = options || {};
    const { rootMargin = DEFAULT_ROOT_MARGIN, threshold = DEFAULT_THRESHOLD } = currentOptions;

    // Cleanup previous observer and element references
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    observedElementsRef.current.clear();

    // Populate observedElementsRef with current elements
    itemIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observedElementsRef.current.set(id, element);
      } else {
        // Optionally console.warn in development for missing elements
        // console.warn(`[useScrollspy] Element with ID "${id}" not found.`);
      }
    });

    // If no elements to observe, do nothing
    if (observedElementsRef.current.size === 0) {
      setActiveId(null); // Reset if no elements are found or itemIds is empty
      return;
    }

    /**
     * IntersectionObserver callback.
     * @param entries - Array of IntersectionObserverEntry objects.
     */
    const observerCallback: IntersectionObserverCallback = (entries) => {
      // Filter for entries that are currently intersecting
      const intersectingEntries = entries.filter((entry) => entry.isIntersecting);

      if (intersectingEntries.length > 0) {
        // If multiple are intersecting (e.g., due to rootMargin or threshold array),
        // typically the one "most visible" or highest on the page is preferred.
        // Sorting by boundingClientRect.top gives the one closest to the top of viewport.
        intersectingEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActiveId(intersectingEntries[0]!.target.id);
      } else {
        // If nothing is intersecting, and you want to clear activeId:
        // setActiveId(null);
        // Or, to keep the last activeId until a new one intersects (often preferred):
        // No change here, activeId remains as is.
      }
    };

    try {
      observerRef.current = new IntersectionObserver(observerCallback, {
        rootMargin,
        threshold,
      });

      const currentObserver = observerRef.current;
      observedElementsRef.current.forEach((element) => {
        currentObserver.observe(element);
      });
    } catch (e) {
      console.error("[useScrollspy] Failed to create or use IntersectionObserver:", e);
      setActiveId(null); // Reset on error
    }

    // Cleanup function to disconnect the observer when the component unmounts or dependencies change
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
    // Using itemIds.join(',') as a simple way to make the array a dependency.
    // JSON.stringify(options) for options object.
  }, [itemIds.join(","), memoizedOptions]);

  return activeId;
}
