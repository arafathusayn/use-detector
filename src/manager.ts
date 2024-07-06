/**
 * The `useDetector` hook allows components to observe changes to a value and triggers re-rendering when the value changes.
 * The `ObserverManager` class provides a mechanism to register, update, and unregister observers efficiently.
 */

import type { Dispatch, MutableRefObject, SetStateAction } from "react"

const f = requestAnimationFrame

/**
 * Manages observers, allowing registration, update, and unregistration.
 *
 * @template T The type of the value being observed.
 */
class ObserverManager<T> {
  private observers = new Map<string, ObserverEntry<T>>()
  private animationId: number | null = null
  private idCounter = 0

  /**
   * Updates all registered observers, triggering re-renders as necessary.
   */
  private update = () => {
    for (const {
      getNewValue,
      compare,
      trigger,
      prevRef,
    } of this.observers.values()) {
      const newValue = getNewValue()
      if (!compare(prevRef.current, newValue)) {
        prevRef.current = newValue
        trigger((prev) => !prev)
      }
    }
    this.animationId = f(this.update)
  }

  /**
   * Registers an observer with the manager.
   *
   * @param {string} key The unique key identifying the observer.
   * @param {GetNewValue<T>} getNewValue Function to get the new value.
   * @param {Comparator<T>} compare Function to compare old and new values.
   * @param {Trigger} trigger Function to trigger a re-render.
   * @param {MutableRefObject<T>} prevRef Reference to the previous value.
   */
  register(
    key: string,
    getNewValue: GetNewValue<T>,
    compare: Comparator<T>,
    trigger: Trigger,
    prevRef: MutableRefObject<T>,
  ) {
    this.observers.set(key, { getNewValue, compare, trigger, prevRef })
    if (this.animationId === null) {
      this.animationId = f(this.update)
    }
  }

  /**
   * Unregisters an observer from the manager.
   *
   * @param {string} key The unique key identifying the observer to be unregistered.
   */
  unregister(key: string) {
    this.observers.delete(key)
    this.idCounter--
    if (this.observers.size === 0 && this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  /**
   * Generates a unique key for an observer.
   *
   * @returns {string} A unique key.
   */
  generateKey(): string {
    return `observer_${this.idCounter++}`
  }
}

/**
 * Retrieves the singleton instance of the ObserverManager.
 *
 * @template T The type of the value being observed.
 * @returns {ObserverManager<T>} The singleton instance of the ObserverManager.
 */
export function getObserverManager<T>(): ObserverManager<T> {
  return observerManager as ObserverManager<T>
}

export type Comparator<T> = (oldValue: T, newValue: T) => boolean
export type GetNewValue<T> = () => T
export type Trigger = Dispatch<SetStateAction<boolean>>

type ObserverEntry<T> = {
  getNewValue: GetNewValue<T>
  compare: Comparator<T>
  trigger: Trigger
  prevRef: MutableRefObject<T>
}

// Singleton-like instance
const observerManager = new ObserverManager()
