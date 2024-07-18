import type { ResistorMeta } from "./resistor";

const ESCAPE_CHAR = '\\'
const NEW_ROW_CHAR = '\n'

export function parse(text: string, delimiter: string, quote: string, hasHeader: boolean): [string[], ResistorMeta[]] {
    let inQuotes: boolean = false
    let escapeNext: boolean = false
    let data: string[][] = []
    let rowData: string[] = []
    let current: string = ""
    for (const char of text) {
        if (escapeNext) {
            current += char
            escapeNext = false
            continue
        }
        if (inQuotes) {
            switch (char) {
                case ESCAPE_CHAR:
                    // current += char
                    escapeNext = true
                    break
                case quote:
                    inQuotes = false
                    break
                default:
                    current += char
                    break
            }
        } else {
            switch (char) {
                case ESCAPE_CHAR:
                    escapeNext = true
                    break
                case NEW_ROW_CHAR:
                    if (!(current === "" && rowData.length === 0)) {
                        rowData.push(current)
                        data.push(rowData)
                    }
                    current = ""
                    rowData = []
                    break
                case delimiter:
                    rowData.push(current)
                    current = ""
                    break
                case quote:
                    inQuotes = true
                    break
                default:
                    current += char
                    break
            }
        }
    }

    if (data.length === 0) return [[], []]

    let keys: string[]
    if (hasHeader) {
        keys = data[0]
        data.splice(0, 1)
    } else {
        keys = Array.from({length: data[0].length}, (_, i) => i.toString())
    }

    let metaList: ResistorMeta[] = []
    for (const values of data) {
        let meta: ResistorMeta = {}
        for(let i = 0; i < keys.length; i++) meta[keys[i]] = values[i]
        metaList.push(meta)
    }
    return [keys, metaList]
}
