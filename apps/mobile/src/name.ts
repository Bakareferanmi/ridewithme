const capitalise = (w: string) => w.replace(/(^|[-'’])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase());

/**
 * Proper-case a person's name: "wale" and "WALE" become "Wale", "mary-jane" becomes "Mary-Jane".
 * Words that already mix cases ("McDonald", "DeShawn") are kept as typed apart from the first letter.
 */
export function formatName(raw: string): string {
  const words = raw.trim().split(/\s+/).filter(Boolean).map((w) => {
    const flat = w === w.toLowerCase() || w === w.toUpperCase();
    return capitalise(flat ? w.toLowerCase() : w);
  });
  return words.join(' ');
}

/** A readable name from an email address: "wale.bakare96@gmail.com" becomes "Wale Bakare". */
export function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? '';
  return formatName(local.replace(/[._+\-]+/g, ' ').replace(/\d+/g, ' ')) || 'You';
}
