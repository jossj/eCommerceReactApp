const STEPS = ['Review', 'Shipping', 'Payment', 'Confirm']

export default function CheckoutSteps({ current }) {
  return (
    <ol className="flex items-center w-full mb-8">
      {STEPS.map((label, i) => {
        const stepNum = i + 1
        const done = stepNum < current
        const active = stepNum === current
        return (
          <li key={label} className={`flex items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
            <span
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold shrink-0
                ${done ? 'bg-indigo-600 text-white' : active ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 'bg-gray-200 text-gray-500'}`}
            >
              {done ? '✓' : stepNum}
            </span>
            <span className={`ml-2 text-sm font-medium ${active ? 'text-indigo-600' : done ? 'text-gray-700' : 'text-gray-400'}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 ${done ? 'bg-indigo-600' : 'bg-gray-200'}`} />
            )}
          </li>
        )
      })}
    </ol>
  )
}
