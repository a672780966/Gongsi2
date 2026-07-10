import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState;
  public props: ErrorBoundaryProps & { children?: React.ReactNode };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught runtime error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', background: '#fff5f5', color: '#c53030', fontFamily: 'system-ui, -apple-system, sans-serif', margin: '32px auto', maxWidth: '800px', borderRadius: '12px', border: '1px solid #feb2b2', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 700 }}>🚨 系统前端运行时异常 (Runtime Error Detected)</h2>
          <p style={{ fontSize: '14px', margin: '0 0 16px 0', lineHeight: 1.5 }}>
            应用在浏览器渲染时发生了未知错误，这通常是由不兼容的数据格式或错误的组件库导入导致的。
          </p>
          <div style={{ background: '#1a202c', color: '#edf2f7', padding: '16px', borderRadius: '8px', fontSize: '13px', overflowX: 'auto', marginBottom: '20px' }}>
            <p style={{ fontWeight: 'bold', color: '#fc8181', margin: '0 0 8px 0' }}>{this.state.error?.toString()}</p>
            <pre style={{ margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
              {this.state.error?.stack}
            </pre>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => { window.location.reload(); }}
              style={{ padding: '8px 16px', background: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
            >
              刷新页面 (Reload Page)
            </button>
            <button 
              onClick={() => { window.localStorage.clear(); window.location.reload(); }}
              style={{ padding: '8px 16px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
            >
              清理缓存并强刷 (Clear Cache & Reload)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

