export type Resistor = {
  value: number
  complexity: number
  type: "resistor" | "parallel" | "chain"
  subResistors: Array<Resistor>
}

Array.prototype.pushSorted = function(el: any, compareFn: (a: any, b: any) => number) {
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

function compareFn(a: Resistor, b: Resistor, desiredResistance: number): number {
  let dist: number = Math.abs(a.value - desiredResistance) - Math.abs(b.value - desiredResistance)
  if (dist === 0) {
    dist = a.complexity - b.complexity
  }
  return dist
}

export class ResistanceGenerator {
  resistorQueue: Array<Resistor>
  resistors: Array<Resistor>
  desiredResistance: number
  maxComplexity: number

  constructor(collection: Array<Resistor>, desiredResistance: number, maxComplexity: number) {
    this.resistorQueue = collection.slice(0)
    this.resistors = []
    this.desiredResistance = desiredResistance
    this.maxComplexity = maxComplexity
  }

  generateStep(): boolean {
    if (this.resistorQueue.length === 0) return false
    const resistor1 = this.resistorQueue.shift()
    this.resistors.pushSorted(resistor1, (a: Resistor, b: Resistor) => compareFn(a, b, this.desiredResistance))
    if (resistor1.complexity >= this.maxComplexity) return true
    const allowedComplexity = this.maxComplexity - resistor1.complexity
    perm: for (const resistor2 of this.resistors) {
      if (resistor2.complexity > allowedComplexity) continue

      // reduce duplicates
      if (resistor1.subResistors.includes(resistor2)) {
        console.log("sim", resistor2, resistor1)
        for (const subResistor of resistor1.subResistors) {
          if (subResistor !== resistor2) continue perm
        }
      }

      if (resistor1.type !== 'chain' || resistor2.type !== 'chain') {
        let chainResistor = chain(resistor1, resistor2)
        this.resistorQueue.pushSorted(chainResistor, (a: Resistor, b: Resistor) => compareFn(a, b, this.desiredResistance))
      }
      if (resistor1.type !== 'parallel' || resistor2.type !== 'parallel') {
        let parallelResistor = parallel(resistor1, resistor2)
        this.resistorQueue.pushSorted(parallelResistor, (a: Resistor, b: Resistor) => compareFn(a, b, this.desiredResistance))
      }
    }
    return true
  }

  generate(): Array<Resistor> {
    let result
    do {
      result = this.generateStep()
    } while (result)
    return this.resistors
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

  return {
    value: resistor1.value + resistor2.value,
    complexity: resistor1.complexity + resistor2.complexity,
    type: "chain",
    subResistors,
  }
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

  return {
    value: (resistor1.value * resistor2.value) / (resistor1.value + resistor2.value),
    complexity: resistor1.complexity + resistor2.complexity,
    type: "parallel",
    subResistors,
  }
}
