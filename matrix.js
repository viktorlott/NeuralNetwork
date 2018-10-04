
//https://medium.com/@14prakash/back-propagation-is-very-simple-who-made-it-complicated-97b794c97e5c
//https://mattmazur.com/2015/03/17/a-step-by-step-backpropagation-example/
//http://stevenmiller888.github.io/mind-how-to-build-a-neural-network/
const chalk = require("chalk")
const _createEmpty = Symbol("_createEmpty")
const _createWith = Symbol("_createWith")

class Matrix {
    constructor(data, size, full) {
        this.data = data || []
        this.size = size || []
        this.full = full || []
    }
    static get length() {
        return this.full.length
    }
    static getSize(arr) {
        if(arr instanceof Array) {
            return [arr.length].concat(Matrix.getSize(arr[0]))
        } else {
            return []
        }
    }
    static reCreate(data) {
        let temp = []
        const raw = this.getRaw(data)
        const size = this.getSize(data)
        let pivot = 0;
        for (let z = 0; z < size[0]; z++) {
            temp.push([])
        }
        return temp = temp.map((i, item) => {
            let p = []
            for( let i = 0; i < size[1]; i++) {
                p.push(raw[pivot]) 
                pivot++;    
            }
            return p 
        })
    }
    static from(data) {
        this.old = data
        return new Matrix(this.getRaw(data), this.getSize(data), this.reCreate(data))
    }
    get view() {
        const text = []
        for(let i in this.full) {
            text.push("[")
            for( let x in this.full[i]) {
                text.push(" " + this.full[i][x] + " ")
            }
            text.push("]\n ")
        }
        const constructedText = `array(
 ${text.join("")})`

        return constructedText
    }
    static getRaw(arr) {
        const temp = []
        const loop = (data) => {
            for (let d in data) {
                if(!(data[d] instanceof Array)) {
                    temp.push(data[d])
                } else {
                    for (let a in data[d]) {
                        if(!(data[d][a] instanceof Array)) {
                            temp.push(data[d][a])
                        }
                    } 
                }
            }
        }
        loop(arr)
        return temp
    }
    static validCalc(a,b) {
        //console.log("A:", a[a.length - 1], "B", b[0], a, b)
        return (a[a.length - 1] === b[0]) ? false : true
    }

    static randoms(size) {
        return Matrix[_createWith](size, () => Math.random())
    }
    static zeros(size) {
        return Matrix[_createWith](size, () => 0)
    }
    static ones(size) {
        return Matrix[_createWith](size, () => 1)
    }
    static ladder(size) {
        const temp = []
        let val = 0;
        for(let i = 0; i < size[0]; i++) {
            temp.push(Array(size[1]).fill(0).map(i => {
                val += 1
                return val
            }))
        }
        return Matrix.from(temp)         
    }
    static [_createWith](size, filler) {
        const temp = []
        for(let i = 0; i < size[0]; i++) {
            temp.push(Array(size[1]).fill(0).map(i => filler()))
        }
        return Matrix.from(temp)     
    }
    static [_createEmpty](size) {
        const temp = []
        for(let i = 0; i < size[0]; i++) {
            temp.push(Array(size[1]).fill(0))
        }
        return temp
    }
    static createRandom(size) {
        const temp = []
        for(let i = 0; i < size[0] * size[1]; i++) 
            temp.push(Math.random())
        const rec = this.reCreate()
    }
    get T() {
        const trans = Matrix[_createEmpty]([this.size[1], this.size[0]])
        for( let i = 0; i < trans.length; i++) {
            for ( let j = 0; j < trans[0].length; j++) {
                trans[i][j] = this.full[j][i]
            }   
        }
        return Matrix.from(trans)
    }
    add(b, func) {
        const temp = Matrix.reCreate(this.full)
        const B = Matrix.reCreate(b.full)
        for( let row in temp) {
            for(let column in temp[row]) {
                temp[row][column] = func(temp[row][column], B[row][column])
            }
        }
        return Matrix.from(temp)
    }
    sigmoid() {
        const S = (x) => 1 / (1 + Math.exp(-x))
        const temp = Matrix.reCreate(this.full)
        for( let row in temp) {
            for(let column in temp[row]) {
                temp[row][column] = S(temp[row][column])
            }
        }
        return Matrix.from(temp)
    }
    apply(func) {
        const temp = Matrix.reCreate(this.full)
        for( let row in temp) {
            for(let column in temp[row]) {
                temp[row][column] = func(temp[row][column])
            }
        }
        return Matrix.from(temp)
    }
    bias(val) {
        return this.apply(x => x + val)
    }
    static dot(a,b) {
        if(this.validCalc(a.size, b.size))
            return console.log("failed")
        // Row x Col
        let r1,r2,c1,c2;
        const l = a.size.reduce((prev, curr) =>  prev * curr, 1)
        const newSize = [a.size[0], b.size[b.size.length - 1]]
        const nSizeSum = a.size.reduce((prev, curr) =>  prev * curr, 1)
        const newArr = this[_createEmpty](newSize)
        const an = a.full
        const bn = b.full
        r1 = a.size[0]
        r2 = b.size[0]
        c1 = a.size[1]
        c2 = b.size[1]

        for(let i = 0; i < r1; i++) {
            for(let j = 0; j < c2; j++) {
                for(let k = 0; k < c1; k++) {
                    newArr[i][j] += an[i][k] * bn[k][j]
                }
            }
        }
        return Matrix.from(newArr)
    }
    dot(b) {
        if(Matrix.validCalc(this.size, b.size))
            return console.log("---- failed ----")
        // Row x Col
        let r1,r2,c1,c2;
        const l = this.size.reduce((prev, curr) =>  prev * curr, 1)
        const newSize = [this.size[0], b.size[b.size.length - 1]]
        const nSizeSum = this.size.reduce((prev, curr) =>  prev * curr, 1)
        const newArr = Matrix[_createEmpty](newSize)
        const an = this.full
        const bn = b.full
        r1 = this.size[0]
        r2 = b.size[0]
        c1 = this.size[1]
        c2 = b.size[1]

        for(let i = 0; i < r1; i++) {
            for(let j = 0; j < c2; j++) {
                for(let k = 0; k < c1; k++) {
                    newArr[i][j] += an[i][k] * bn[k][j]
                }
            }
        }
        return Matrix.from(newArr)
    }
    divide(b) {
        if(Matrix.validCalc(this.size, b.size))
            return console.log("---- failed ----")
        // Row x Col
        let r1,r2,c1,c2;
        const l = this.size.reduce((prev, curr) =>  prev * curr, 1)
        const newSize = [this.size[0], b.size[b.size.length - 1]]
        const nSizeSum = this.size.reduce((prev, curr) =>  prev * curr, 1)
        const newArr = Matrix[_createEmpty](newSize)
        const an = this.full
        const bn = b.full
        r1 = this.size[0]
        r2 = b.size[0]
        c1 = this.size[1]
        c2 = b.size[1]

        for(let i = 0; i < r1; i++) {
            for(let j = 0; j < c2; j++) {
                for(let k = 0; k < c1; k++) {
                    newArr[i][j] += an[i][k] / bn[k][j]
                }
            }
        }
        return Matrix.from(newArr)
    }
    get sum() {
        return this.full
    }
}

const S = (x) => 1 / (1 + Math.exp(-x))
const Sder = (x) => (S(x) * (1 - S(x)))
const errorMargin = (result, target) => (target - result)
const addition = (a, b) => a + b
const multiply = (a, b) => a * b
const sub = (a, b) => a - b

// const Inputs =       [[1,1],
//                       [1,0],
//                       [0,1],
//                       [0,0]]
// const Targets = [0,1,1,0]




const ib = Matrix.from([[1,1]])
let bias = x => y => y + x
let biasOutput = Matrix.randoms([1,1])

// const nonlin = (x, deriv=false) => {
//     if(deriv == true)
//         return x*(1-x)
//     return 1 / (1 + Math.exp(-x))
// }


function feed_forward(input, target, lr) {
    const learningRateF = (x) => x * lr

    //Forward Feed

    const inp = Matrix.from(input)

    const hidden = Matrix.dot(inp, w1)

    const output = Matrix.dot(hidden.apply(S), w2.T)

    const result = output.apply(S)

    //Backward Feed

    const error = errorMargin(result.sum[0][0], target)

    const deriOutput = Sder(output.sum[0][0])

    const deltaOutputSum = Matrix.from([[deriOutput * error]])

    const deltaW2 = Matrix.dot(deltaOutputSum, hidden.apply(S)) // <-- the last piece 

    const deltaHiddenSum = deltaOutputSum.dot(w2).add(hidden.apply(Sder), multiply)

    const deltaW1 = inp.T.dot(deltaHiddenSum)

    // Uppdate our Weigths

    let newW1 = w1.add(deltaW1.apply(learningRateF), addition)
    let newW2 = w2.add(deltaW2.apply(learningRateF), addition)

    w1 = Matrix.from(newW1.full)
    w2 = Matrix.from(newW2.full)
    return error
}

function logError(e1,e2,e3,e4) {
    console.log("\033c", "\n",)
    console.log("  Errors")
    console.log("-----------------------------------------------------")
    console.log("| Margin of error for 1 o 1:",chalk.red(e1))
    console.log("| Margin of error for 0 o 1:",chalk.red(e2))
    console.log("| Margin of error for 1 o 0:",chalk.red(e3))
    console.log("| Margin of error for 0 o 0:",chalk.red(e4))
    console.log("----------------------------------------------------- \n")

}

function test(inpu, targ) {
    const inputs = Matrix.from([inpu])

    const hidden = inputs.dot(w1)
    const output = hidden.apply(S).dot(w2.T)
    const result = output.apply(S)
    console.log("---------------")
    console.log("Input",inpu)
    console.log("result",result.full[0])
    console.log("target", targ)
    console.log("---------------")

} 
function TrainNN(iterations = 5000, lr) {
    let e1,e2,e3,e4
    for (let m = 0; m < iterations; m++) {
            e1 = feed_forward([[1,1]],0, lr)
            e2 = feed_forward([[0,1]],1, lr)
            e3 = feed_forward([[1,0]],1, lr)
            e4 = feed_forward([[0,0]],0, lr)
            if(m % 100 === 0) {
                logError(e1,e2,e3,e4)
            }
    }
}

let w1 = Matrix.from([[0.1, 0.4, 0.8],[0.3,0.6,0.9]])
let w2 = Matrix.from([[0.56, 0.22, 0.192]])
const iterations = 10000
const lr = 0.3
TrainNN(iterations, lr)

  
console.log("  My Inputs and results")
test([1,1],0)
test([0,1],1)
test([1,0],1)
test([0,0],0)


























