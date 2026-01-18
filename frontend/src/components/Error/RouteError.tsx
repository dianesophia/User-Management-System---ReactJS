import { useRouteError } from 'react-router-dom';

export const RouteError = () => {
  const error: any = useRouteError();

  return (
    <div className="relative  z-0 h-screen overflow-hidden w-full font-sans text-gray-900 bg-light dark:bg-dark dark:text-white ">
      <div className="relative z-20 flex justify-center h-full items-center">
        <div className="container relative flex flex-col items-center justify-between px-6 py-4 mx-auto">
          <div className="flex flex-col">
            <p className="mb-6 text-2xl text-center text-gray-800 font-medium dark:text-gray-400">
              Oops! ☹️
            </p>
            <p className="max-w-3xl py-2 mx-auto text-xl font-semibold text-center ">
              Sorry, an unexpected error has occurred.
            </p>
            <h2 className="max-w-3xl font- p-2 mx-auto text-center text-status-error font-medium">
              {error.statusText || error.message}
            </h2>
            <div className="flex flex-col items-center gap-2 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 mt-8 text-center uppercase bg-transparent border dark:border-gray-400 border-gray-800 md:mt-16 text-gray-800 dark:text-gray-400 text-base"
              >
                Try Again
              </button>
              <a
                href="/"
                className="px-4 py-1 mt-2 text-center bg-transparent font-medium text-blue-600 dark:text-blue-400 text-sm"
              >
                Return Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};