import { ErrorBoundary } from "@/components";
import { Notifications } from "@/components/Notification";
import { queryClient } from "@/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense, type ReactNode } from "react"

type AppProviderProps = {
  children: ReactNode;
}
export const AppProvider = ({ children } : AppProviderProps) => {
  const handleQueryClient = queryClient;
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-screen h-screen">
          <div>Loading...</div>
        </div>
      }
    >
      <ErrorBoundary>
        <QueryClientProvider client={handleQueryClient}>
          <Notifications options={{ duration: 5000 }} />
          { children }
        </QueryClientProvider>
      </ErrorBoundary>
    </Suspense>
  )
}