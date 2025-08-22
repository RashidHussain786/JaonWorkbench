import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: null, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex items-center justify-center min-h-screen bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h1>
            <p className="text-lg mb-4">We're sorry for the inconvenience. Please try refreshing the page.</p>
            {this.state.error && (
              <details className="text-sm text-red-600 dark:text-red-300 mt-4 p-2 bg-red-100 dark:bg-red-800 rounded-md">
                <summary className="cursor-pointer">Error Details</summary>
                <pre className="mt-2 text-left whitespace-pre-wrap break-all">
                  {this.state.error.toString()}
                  <br />
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
