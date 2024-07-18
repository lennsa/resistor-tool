import type { ResistorMeta } from "./resistor";

const ESCAPE_CHAR = '\\'
const NEW_ROW_CHAR = '\n'

export function parse(text: string, delimiter: string, quote: string, hasHeader: boolean): [string[], ResistorMeta[]] {
    let inQuotes: boolean = false
    let escapeNext: boolean = false
    let data: string[][] = []
    let rowData: string[] = []
    let cellData: string = ""
    for (const char of text) {
        if (escapeNext) {
            cellData += char
            escapeNext = false
            continue
        }
        if (inQuotes) {
            switch (char) {
                case ESCAPE_CHAR:
                    escapeNext = true
                    break
                case quote:
                    inQuotes = false
                    break
                default:
                    cellData += char
                    break
            }
        } else {
            switch (char) {
                case ESCAPE_CHAR:
                    escapeNext = true
                    break
                case NEW_ROW_CHAR:
                    rowData.push(cellData)
                    cellData = ""
                    data.push(rowData)
                    rowData = []
                    break
                case delimiter:
                    rowData.push(cellData)
                    cellData = ""
                    break
                case quote:
                    inQuotes = true
                    break
                default:
                    cellData += char
                    break
            }
        }
    }

    if (data.length === 0) return [[], []]

    // microsoft reeeee
    data = data.map((rowData) => rowData.map((cellData) => cellData.trim()))
    
    // microsoft reeeee
    if (data.length > 1 && data[0].length === 1 && data[1].length > 1) {
        data.splice(0, 1)
    }

    let keys: string[]
    if (hasHeader) {
        keys = data[0]
        data.splice(0, 1)
    } else {
        keys = Array.from({length: data[0].length}, (_, i) => i.toString())
    }

    let metaList: ResistorMeta[] = []
    for (const values of data) {
        // microsoft reeeee
        if (values.length !== keys.length) continue
        let meta: ResistorMeta = {}
        for(let i = 0; i < keys.length; i++) {
            // microsoft reeeee
            if (keys[i] === "") continue
            meta[keys[i]] = values[i]
        }
        metaList.push(meta)
    }

    return [keys, metaList]
}
