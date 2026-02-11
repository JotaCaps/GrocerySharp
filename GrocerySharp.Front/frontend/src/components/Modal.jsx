export default function Modal({ title, onClose, children, maxWidth = "max-w-2xl" }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className={`w-full ${maxWidth} bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden`}>
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm"
          >
            Fechar
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
