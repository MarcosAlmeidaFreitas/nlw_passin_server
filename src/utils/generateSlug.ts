export function generateSlug(text: string): string {
  const separator = "-"

  if (!text) {
    throw new Error("error generating slug")
  }

  // 1) Normaliza e remove diacríticos (acentos)
  // NFD separa letras dos diacríticos; então removemos \p{M} (marks)
  let slug = text.normalize("NFD").replace(/\p{M}/gu, "")

  // 2) Transforma para minúsculas
  slug = slug.toLowerCase()

  // 3) Substitui qualquer sequência de caracteres que não sejam letras/números
  //    por um separador. \p{L} = letra, \p{N} = número (suporta unicode)
  slug = slug.replace(/[^\p{L}\p{N}]+/gu, separator)

  // 4) Remove caracteres no início/fim que sejam separador
  const escSep = separator.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") // escape regex meta-chars
  const trimRegex = new RegExp(`^${escSep}+|${escSep}+$`, "g")
  slug = slug.replace(trimRegex, "")

  // 5) Colapsa múltiplos separadores seguidos em um só
  const collapseRegex = new RegExp(`${escSep}{2,}`, "g")
  slug = slug.replace(collapseRegex, separator)

  return slug
}
