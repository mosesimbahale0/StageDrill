import { useEffect, useRef, useCallback } from "react";
import { Client } from "graphql-ws";

export const useSubscription = (
  wsClient: Client,
  subscriptionQuery: string,
  onNext: (response: any) => void,
  onError?: (error: any) => void
) => {
  const subscriptionRef = useRef<(() => void) | null>(null);

  // Memoize callback functions to avoid unnecessary re-subscriptions
  const handleNext = useCallback(onNext, [onNext]);
  const handleError = useCallback(onError || ((err) => console.error("Subscription error:", err)), [onError]);

  useEffect(() => {
    // Subscribe
    subscriptionRef.current = wsClient.subscribe(
      { query: subscriptionQuery },
      {
        next: (response) => handleNext(response),
        error: (err) => handleError(err),
        complete: () => console.log("Subscription completed."),
      }
    );

    // Cleanup subscription on unmount or dependency changes
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current();
        subscriptionRef.current = null;
      }
    };
  }, [wsClient, subscriptionQuery, handleNext, handleError]);
};
