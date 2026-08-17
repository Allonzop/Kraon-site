/**
 * Soumission de formulaires à Netlify Forms depuis la SPA (AJAX).
 *
 * Netlify détecte les formulaires déclarés statiquement dans `client/index.html`
 * au moment du build ; côté React, on poste les données en
 * `application/x-www-form-urlencoded` vers "/" avec le champ `form-name`.
 */

function encode(data: Record<string, string>): string {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

export async function submitNetlifyForm(
  formName: string,
  fields: Record<string, string | number | boolean | undefined>,
): Promise<void> {
  const data: Record<string, string> = { "form-name": formName, "bot-field": "" };
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null) data[key] = String(value);
  }

  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encode(data),
  });

  if (!res.ok) {
    throw new Error(`Netlify Forms a répondu ${res.status}`);
  }
}
