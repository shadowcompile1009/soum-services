import React, { Component, ErrorInfo, ReactNode } from 'react';

import { Button } from '@/components/Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <>
          <h1>There was an irrecoverable error</h1>
          <Button
            variant="outline"
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </Button>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
