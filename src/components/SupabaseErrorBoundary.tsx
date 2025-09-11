import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Settings } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class SupabaseErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Supabase Error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isSupabaseError = this.state.error?.message?.includes('Supabase');
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {isSupabaseError ? 'Cấu hình thiếu' : 'Có lỗi xảy ra'}
            </h1>
            
            {isSupabaseError ? (
              <div className="text-left space-y-4">
                <p className="text-gray-600">
                  Ứng dụng cần được cấu hình database Supabase để hoạt động.
                </p>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex items-start">
                    <Settings className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">
                        Environment Variables cần thiết:
                      </p>
                      <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                        <li>• VITE_SUPABASE_URL</li>
                        <li>• VITE_SUPABASE_ANON_KEY</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500">
                  Vui lòng kiểm tra file VERCEL_ENV_SETUP.md để biết hướng dẫn cấu hình.
                </p>
              </div>
            ) : (
              <p className="text-gray-600 mb-6">
                {this.state.error?.message || 'Đã xảy ra lỗi không mong muốn'}
              </p>
            )}
            
            <button
              onClick={this.handleRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Thử lại
            </button>
            
            {import.meta.env.DEV && this.state.errorInfo && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Chi tiết lỗi (Dev only)
                </summary>
                <pre className="text-xs text-gray-400 mt-2 whitespace-pre-wrap bg-gray-50 p-2 rounded">
                  {this.state.error?.stack}
                  {this.state.errorInfo.componentStack}
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
