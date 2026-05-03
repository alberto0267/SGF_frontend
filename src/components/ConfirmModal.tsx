import { AlertTriangle } from 'lucide-react'

interface Props {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  isPending?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isPending = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4">
        {/* Icono */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>

        {/* Texto */}
        <div className="text-center">
          <h2 className="text-base font-semibold text-gray-900 mb-1">{title}</h2>
          <p className="text-sm text-gray-500 leading-snug">{message}</p>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Eliminando…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
