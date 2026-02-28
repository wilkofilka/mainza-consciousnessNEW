import type { PropsWithChildren } from "react";

/**
 * Compatibility wrapper for Apps SDK UI context.
 *
 * The real provider is expected to come from `@openai/apps-sdk-ui`.
 * In environments where that package is not available yet, we keep
 * a no-op provider to preserve the component tree shape.
 */
export function AppsSDKUIProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}
