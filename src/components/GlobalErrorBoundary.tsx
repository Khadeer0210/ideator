import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('IDEATOR Error Boundary Caught:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 z-[9999] font-sans text-center">
          <div className="w-12 h-12 mb-6 border-t-2 border-red-500 rounded-full animate-spin" />
          <h1 className="text-white text-xl tracking-[0.3em] uppercase mb-4">Neural Link Disrupted</h1>
          <p className="text-white/50 text-sm max-w-md mb-8 leading-relaxed">
            A critical fault occurred in the visual or operational canvas layer. The system intercepted the crash to prevent data loss.
          </p>
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl max-w-lg overflow-auto mb-8 text-left">
            <code className="text-red-400 text-xs">{this.state.errorMessage}</code>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-white text-black text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-gray-200 transition-colors"
          >
            Re-Initialize System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
