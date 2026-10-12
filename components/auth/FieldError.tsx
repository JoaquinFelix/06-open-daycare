// Mensaje compartido de validación de los formularios (auth y alta de niño).
export function FieldError({
  message = "Este campo es obligatorio.",
}: {
  message?: string;
}) {
  return (
    <p className="mt-2 text-[13px] font-bold text-primary-deep">{message}</p>
  );
}
