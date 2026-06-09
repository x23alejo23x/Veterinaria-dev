/**
 * FormField — wrapper para react-hook-form + Zod.
 * Muestra el input/select con su error de validación debajo.
 *
 * @example
 *   <FormField label="Nombre" error={errors.name}>
 *     <input {...register('name')} placeholder="Luna" />
 *   </FormField>
 */
export function FormField({ label, error, children, required }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[11px] font-semibold text-[var(--text-2)]">
          {label}{required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
          <span>⚠</span> {error.message}
        </p>
      )}
    </div>
  )
}
