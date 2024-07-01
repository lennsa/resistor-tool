export type Resistor = {
  value: number
  complexity: number
  type: "resistor" | "parallel" | "chain"
  subResistors?: Array<Resistor>
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

let initialResistors: Resistor[] = [
  {
    value: 10,
    complexity: 1,
    type: "resistor"
  },
  {
    value: 1,
    complexity: 1,
    type: "resistor"
  },
  {
    value: 200,
    complexity: 1,
    type: "resistor"
  },
]

export function generateResistors(resistors: Array<Resistor>, desiredResistance: number, maxComplexity: number): Array<Resistor> {
  let resistorQueue: Array<Resistor> = initialResistors.slice(0)

  while (resistorQueue.length) {
    const resistor1: Resistor = resistorQueue.shift()
    resistors.push(resistor1)
    if (resistor1.complexity >= maxComplexity) {
      continue
    }
    const allowedComplexity = maxComplexity - resistor1.complexity

    for (const resistor2 of resistors) {
      if (resistor2.complexity > allowedComplexity) {
        continue
      }
      
      if (resistor1.type != "chain" || resistor2.type != "chain") {
        resistorQueue.push(chain(resistor1, resistor2))
      }
      if (resistor1.type != "parallel" || resistor2.type != "parallel") {
        resistorQueue.push(parallel(resistor1, resistor2))
      }
    }
  }

  resistors.sort((a, b) => Math.abs(a.value - desiredResistance) - Math.abs(b.value - desiredResistance))
}

function chain(resistor1: Resistor, resistor2: Resistor): Resistor {
  let subResistors: Array<Resistor> = []
  if (resistor1.type == "chain") {
    subResistors = subResistors.concat(resistor1.subResistors)
  } else {
    subResistors.push(resistor1)
  }
  if (resistor2.type == "chain") {
    subResistors = subResistors.concat(resistor2.subResistors)
  } else {
    subResistors.push(resistor2)
  }

  const newResistor: Resistor = {
    value: resistor1.value + resistor2.value,
    complexity: resistor1.complexity + resistor2.complexity,
    type: "chain",
    subResistors,
  }
  return newResistor
}

function parallel(resistor1: Resistor, resistor2: Resistor): Resistor {
  let subResistors: Array<Resistor> = []
  if (resistor1.type == "parallel") {
    subResistors = subResistors.concat(resistor1.subResistors)
  } else {
    subResistors.push(resistor1)
  }
  if (resistor2.type == "parallel") {
    subResistors = subResistors.concat(resistor2.subResistors)
  } else {
    subResistors.push(resistor2)
  }

  const newResistor: Resistor = {
    value: (resistor1.value * resistor2.value) / (resistor1.value + resistor2.value),
    complexity: resistor1.complexity + resistor2.complexity,
    type: "parallel",
    subResistors,
  }
  return newResistor
}
