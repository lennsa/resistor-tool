export type Resistor = {
  value: number
  complexity: number
  type: "resistor" | "parallel" | "chain"
  subResistors?: Array<Resistor>
}

Array.prototype.pushSorted = function(el, compareFn) {
  let index = (function(arr) {
    var m = 0;
    var n = arr.length - 1;

    while(m <= n) {
      var k = (n + m) >> 1;
      var cmp = compareFn(el, arr[k]);

      if(cmp > 0) m = k + 1
      else if(cmp < 0) n = k - 1
      else return k
    }
    return -m - 1;
  })(this);

  if (index >= 0)
    this.splice(index, 0, el);
  else if (index < 0)
    this.splice((index * -1) - 1, 0, el);

  return this.length;
};

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

export async function generateResistors(resistors: Array<Resistor>, desiredResistance: number, maxComplexity: number) {
  let resistorQueue: Array<Resistor> = initialResistors.slice(0)

  while (resistorQueue.length) {
    const resistor1: Resistor = resistorQueue.shift()
    resistors.pushSorted(resistor1, (a, b) => Math.abs(a.value - desiredResistance) - Math.abs(b.value - desiredResistance))
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
