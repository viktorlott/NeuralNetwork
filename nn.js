const chalk = require("chalk")
const Matrix = require("./lib/matrix")

/**
 * 
 *  Sigmoid
 */
const S = (x) => 1 / (1 + Math.exp(-x))

/**
 * 
 * Sigmoid Derivative 
 * 
 * Took awhile to get this.
 */
const Sder = (x) => (S(x) * (1 - S(x)))

/**
 * 
 * Error Margin for backward propagation
 * 
 */
const errorMargin = (result, target) => (target - result)

/**
 * 
 * Operators
 * 
 */
const addition = (a, b) => a + b
const multiply = (a, b) => a * b
const sub = (a, b) => a - b


/**
 * 
 * I didnt implement Bias to this NN
 * 
 */
const ib = Matrix.from([[1,1]])
let bias = x => y => y + x
let biasOutput = Matrix.randoms([1,1])

/**
 *
 * Non linear regression
 * 
 * I didnt use this in this NN
 * 
 */
const nonlin = (x, deriv=false) => {
    if(deriv == true)
        return x*(1-x)
    return 1 / (1 + Math.exp(-x))
}


/**
 * 
 * @param {array} input 1d array
 * @param {number} target number
 * @param {number} lr float
 * 
 */

function feed_backward(input, target, lr) {
	
    const learningRateF = (x) => x * lr
    // Matrix.from() -> creates a 2d matrix
    // Matrix.dot() -> multiplies matricies by row*column
    // Matrix.apply() -> adds a function to all elements in the matrix
    // Matrix.add() -> adds two matricies together using a function modifier 
    //         L_ Matrix.multiply() and Matrix.addition()
    // Matrix.T -> Transposes the matrix - inverting the shape row*column -> column*row
    // Matrix.sigmoid acts like apply but with a pre-set function

    //Forward Feed

    input = Matrix.from(input)

    const hidden = Matrix.dot(input, w1).sigmoid

    const output = Matrix.dot(hidden, w2.T)

    const result = output.sigmoid

    //Backward Feed

    const error = errorMargin(result.sum[0][0], target)

    const deriOutput = Sder(output.sum[0][0])

    const deltaOutputSum = Matrix.from([[deriOutput * error]])

    // Wants input * weights after activation -- So the hidden layers result
    const deltaW2 = Matrix.dot(deltaOutputSum, hidden) // <-- the last piece 

    // Wants input * weights before the activation -- So the hidden layers pre true output 
    const deltaHiddenSum = deltaOutputSum.dot(w2).multiply(
            input.dot(w1).apply(Sder)
        )

    const deltaW1 = input.T.dot(deltaHiddenSum)

    // Uppdate our Weigths

    let newW1 = w1.addition(deltaW1.apply(learningRateF))
    let newW2 = w2.addition(deltaW2.apply(learningRateF))

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

function feed_forward(inpu, targ) {
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
            e1 = feed_backward([[1,1]], 0, lr)
            e2 = feed_backward([[0,1]], 1, lr)
            e3 = feed_backward([[1,0]], 1, lr)
            e4 = feed_backward([[0,0]], 0, lr)
            if(m % 100 === 0) {
                logError(e1,e2,e3,e4)
            }
    }
}


let w1 = Matrix.randoms([2,5])
let w2 = Matrix.randoms([1,5])

const iterations = 10000
const lr = 0.3
TrainNN(iterations, lr)

console.log(chalk.blue("\nMy Weights\n"))
console.log("- Weigths 1", w1.view)
console.log("")
console.log("- Weigths 2", w2.view)
console.log("\n")

console.log("  My Inputs and results")
feed_forward([1,1],0)
feed_forward([0,1],1)
feed_forward([1,0],1)
feed_forward([0,0],0)




