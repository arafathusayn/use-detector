/**
 * The `useDetector` hook allows components to observe changes to a value and triggers re-rendering when the value changes.
 * The `ObserverManager` class provides a mechanism to register, update, and unregister observers efficiently.
 */

import type { Dispatch, MutableRefObject, SetStateAction } from "react"

type LoopFunction<T> = (callback: () => void) => T
type CancelLoopFunction<T> = (id: T) => void

let f = requestAnimationFrame as LoopFunction<unknown>
let c = cancelAnimationFrame as CancelLoopFunction<unknown>

/**
 * Configures the loop functions used by the ObserverManager.
 *
 * @param {loop} loopFunction The function to start the loop.
 * @param {cancelLoop} cancelLoop The function to cancel the loop.
 */
export function configureLoop<T>(
  loopFunction: LoopFunction<T>,
  cancelLoop: CancelLoopFunction<T>,
) {
  f = loopFunction as LoopFunction<unknown>
  c = cancelLoop as CancelLoopFunction<unknown>
}

/**
 * Uses setTimeout instead of requestAnimationFrame and
 * clearTimeout instead of cancelAnimationFrame.
 *
 * @param {number} [interval=1] The interval in milliseconds.
 * @returns {void}
 */
export function configureWithTimeout(interval: number = 1): void {
  configureLoop((callback) => setTimeout(callback, interval), clearTimeout)
}

/**
 * Manages observers, allowing registration, update, and unregistration.
 *
 * @template T The type of the value being observed.
 */
class ObserverManager<T> {
  // Observers
  private os = new Map<string, ObserverEntry<T>>()
  // Animation ID
  private id: unknown | null = null
  // Unique key index
  private i = 0

  /**
   * Updates all registered observers, triggering re-renders as necessary.
   */
  private update = () => {
    for (const { getNewValue, compare, trigger, prevRef } of this.os.values()) {
      const newValue = getNewValue()

      if (!compare(prevRef.current, newValue)) {
        prevRef.current = newValue
        trigger((prev) => !prev)
      }
    }

    if (this.id !== null && this.id !== undefined) {
      c(this.id)
    }

    this.id = f(this.update)
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
  reg(
    key: string,
    getNewValue: GetNewValue<T>,
    compare: Comparator<T>,
    trigger: Trigger,
    prevRef: MutableRefObject<T>,
  ) {
    this.os.set(key, { getNewValue, compare, trigger, prevRef })

    if (this.id === null) {
      this.id = f(this.update)
    }
  }

  /**
   * Unregisters an observer from the manager.
   *
   * @param {string} key The unique key identifying the observer to be unregistered.
   */
  unreg(key: string) {
    this.os.delete(key)

    if (this.os.size === 0 && this.id !== null) {
      c(this.id)
      this.id = null
    }
  }

  /**
   * Generates a unique key for an observer.
   *
   * @returns {string} A unique key.
   */
  key(): string {
    return "" + this.i++
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
