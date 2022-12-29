import { HelpObject } from 'lib/types/help'

export function filterHelps({ helps, page, view, search }: any) {
  if (!helps) return []
  if (search)
    return helps.filter((help: HelpObject) => {
      let res = false
      let terms = search.split(' ')
      let helpMatch = `${
        help?.tags?.toLowerCase() || ''
      } ${help?.title?.toLowerCase()}`
      terms.forEach((term: string) => {
        if (helpMatch?.includes(term.toLowerCase())) res = true
      })
      return res
    })
  else return helps
}
