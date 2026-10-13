// Helpers puros del overlay "Vincular padre" (SPEC 05): validación del email y
// generación del código de invitación. Se comparten entre el cliente (validación
// mientras se escribe) y la Server Action (re-validación en servidor). No usan
// APIs de React ni de Next.

export const INVITE_CODE_LENGTH = 5;

// Formato habitual "algo@algo.dominio". No pretende ser una validación RFC.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

const CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// `crypto` existe en el navegador y en Node 18+; la fuente aleatoria importa
// poco acá pero evita usar Math.random para un token.
export function randomInviteCode(): string {
  const bytes = crypto.getRandomValues(
    new Uint8Array(INVITE_CODE_LENGTH),
  );

  let code = "";
  for (const byte of bytes) {
    // Módulo simple: con 62 caracteres el sesgo es despreciable.
    code += CODE_ALPHABET[byte % CODE_ALPHABET.length];
  }

  return code;
}
