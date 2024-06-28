export type Resistor = {
  value: number
  complexity: number
  type: "resistor" | "parallel" | "chain"
  subResistors?: Array<Resistor>
}

export function generateResistors(maxComplexity: number): Array<Resistor> {
  let resistors: Array<Resistor> = []
  let resistorQueue: Array<Resistor> = []

  // TODO: initialize resistorQueue to both lists
  let initResistor1: Resistor = {
    value: 10,
    complexity: 1,
    type: "resistor"
  }
  let initResistor2: Resistor = {
    value: 1,
    complexity: 1,
    type: "resistor"
  }
  resistorQueue.push(initResistor1)
  resistorQueue.push(initResistor2)
  
  while (resistorQueue.length) {
    const resistor1: Resistor = resistorQueue.pop()
    resistors.push(resistor1)

    if (resistor1.complexity === maxComplexity) {
      continue
    }
    let allowedComplexity: number = maxComplexity - resistor1.complexity

    let newResistors: Array<Resistor> = []
    for (const resistor2 of resistors) {

      if (resistor2.complexity > allowedComplexity) {
        continue
      }
      
      if (resistor1.type != "chain" || resistor2.type != "chain") {
        newResistors.push(chain(resistor1, resistor2))
      }
      if (resistor1.type != "parallel" || resistor2.type != "parallel") {
        newResistors.push(parallel(resistor1, resistor2))
      }
    }
    resistorQueue = resistorQueue.concat(newResistors)
  }
  return resistors
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

  let newResistor: Resistor = {
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

  let newResistor: Resistor = {
    value: (resistor1.value * resistor2.value) / (resistor1.value + resistor2.value),
    complexity: resistor1.complexity + resistor2.complexity,
    type: "parallel",
    subResistors,
  }
  return newResistor 
}
