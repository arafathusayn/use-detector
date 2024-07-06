/**
 * The `useDetector` hook allows components to observe changes to a value and triggers re-rendering when the value changes.
 * The `ObserverManager` class provides a mechanism to register, update, and unregister observers efficiently.
 */

import { useEffect, useRef, useState } from "react"

import {
  type Comparator,
  type GetNewValue,
  getObserverManager,
} from "./manager"

/**
 * Custom hook for observing changes to a value, triggering re-render upon change automatically.
 *
 * @template T The type of the value being observed.
 * @param {T} oldValue The initial value.
 * @param {GetNewValue<T>} getNewValue A function that returns the new value.
 * @param {Comparator<T>} [compare=(o, n) => o === n] An optional function used to compare the old and new values. Defaults to a strict equality check.
 * @param {string} [key] An optional key to identify the observer. If not provided, a unique key will be generated.
 */
export function useDetector<T>(
  oldValue: T,
  getNewValue: GetNewValue<T>,
  compare: Comparator<T> = (o, n) => o === n,
  key?: string,
): void {
  const [, trigger] = useState(false)
  const prevRef = useRef(oldValue)

  useEffect(() => {
    const manager = getObserverManager<T>()
    const observerKey = key ?? manager.generateKey()
    manager.register(observerKey, getNewValue, compare, trigger, prevRef)
    return () => manager.unregister(observerKey)
  }, [key, getNewValue, compare])
}

/**
 * Custom hook for observing changes to a value, triggering re-render upon change automatically.
 *
 * @template T The type of the value being observed.
 * @param {T} oldValue The initial value.
 * @param {GetNewValue<T>} getNewValue A function that returns the new value.
 * @param {Comparator<T>} [compare=(o, n) => o === n] An optional function used to compare the old and new values. Defaults to a strict equality check.
 * @param {string} [key] An optional key to identify the observer. If not provided, a unique key will be generated.
 * @alias useDetector
 */
export const useObserver = useDetector
