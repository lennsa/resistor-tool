export type Resistor = {
  type: "resistor" | "parallel" | "chain"
  value: number
  subResistors?: Array<Resistor>
}
