"use client";

import { useEffect, useRef } from "react";
import { clearDeadSessionAction } from "../actions";

/**
 * Rendered by the login page when it was reached because the session expired
 * (and the API confirmed nobody is signed in): removes the dead cookie, so the
 * header stops showing a signed-in state. Renders nothing.
 */
export function ClearDeadSession() {
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    void clearDeadSessionAction();
  }, []);

  return null;
}
