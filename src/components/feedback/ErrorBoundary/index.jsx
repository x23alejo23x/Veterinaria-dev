import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

/**
 * Error Boundary global — captura errores de render en cualquier hijo.
 * Wrappea AppShell completo en main.jsx.
 */
export class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Aquí conectar a Sentry / LogRocket cuando haya monitoring
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  reset = () => this.setState({ hasError: false, error: null })

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-[var(--bg)] p-8 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
          <AlertTriangle size={26} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[var(--text)]">Algo salió mal</h2>
          <p className="mt-1 max-w-sm text-sm text-[var(--text-3)]">
            {this.state.error?.message ?? 'Error inesperado en la aplicación'}
          </p>
        </div>
        <button
          onClick={this.reset}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <RefreshCw size={14} /> Reintentar
        </button>
        {import.meta.env.DEV && (
          <pre className="mt-2 max-w-lg overflow-auto rounded-xl bg-[var(--surface-2)] p-4 text-left text-[10px] text-rose-600">
            {this.state.error?.stack}
          </pre>
        )}
      </div>
    )
  }
}
