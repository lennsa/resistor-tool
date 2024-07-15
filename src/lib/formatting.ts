export function numberToPrettyString(n: number, allSign: boolean = false, precision: number | undefined = undefined) {
  if (n === null) n = 0

  let e: number = 0
  while (Math.abs(n) >= 1000 && e < 3) {
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
  if (precision !== undefined) {
    let pN: number
    do {
      pN = parseFloat(n.toFixed(precision))
      precision++
    } while (pN === 0 && precision < 12)
    n = pN
  }
  return sStr + n.toString() + eStr
}

export function prettyStringToNumber(str: string) {
  let e: number = 1
  if (str.endsWith('k')) {
    e *= 1000
    str = str.slice(0, str.lastIndexOf('k'))
  } else if (str.endsWith('M')) {
    e *= 1000000
    str = str.slice(0, str.lastIndexOf('M'))
  } else if (str.endsWith('G')) {
    e *= 1000000000
    str = str.slice(0, str.lastIndexOf('G'))
  }
  return e * Number(str)
}

export function allSign(n: number, precision: number | undefined = undefined) {
  if (precision !== undefined) {
    let pN: number
    do {
      pN = parseFloat(n.toFixed(precision))
      precision++
    } while (pN === 0 && precision < 12)
    n = pN
  }
  return (n<0?"":(n===0?"±":"+")) + n
}
