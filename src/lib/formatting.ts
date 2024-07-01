export function numberToPrettyString(n: number, allSign: boolean = false, precision: number = undefined) {
    let e: number = 0
    while (Math.abs(n) > 1000) {
        n /= 1000
        e ++
    }

    let sStr: string
    if (allSign) sStr = (n<0?"":(n===0?"±":"+"))
    else sStr = ""

    let eStr: string
    switch (e) {
        default:
        case 0:
            eStr = ""; break
        case 1:
            eStr = "k"; break
        case 2:
            eStr = "M"; break
        case 3:
            eStr = "G"; break
    }
    if (precision !== undefined) n = parseFloat(n.toFixed(precision))
    return sStr + n.toString() + eStr
}

export function prettyStringToNumber(str: string) {
    let e:number = 1
    if (str.indexOf('k') >= 0) {
      e *= 1000
    } else if (str.indexOf('M') >= 0) {
      e *= 1000000
    } else if (str.indexOf('G') >= 0) {
      e *= 1000000000
    }
    return e * Number(str.replace(/[k,M]/g,''))
}

export function allSign(n: number, precision: number = undefined) {
  if (precision !== undefined) n = parseFloat(n.toFixed(precision))
  return (n<0?"":(n===0?"±":"+")) + n
}
