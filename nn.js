const chalk = require("chalk");
const Matrix = require("./lib/matrix");

/**
 *
 *  Sigmoid
 */
const S = (x) => 1 / (1 + Math.exp(-x));

/**
 *
 * Sigmoid Derivative
 *
 * Took awhile to get this.
 */
const sigDer = (x) => S(x) * (1 - S(x));

/**
 *
 * Error Margin for backward propagation
 *
 */
const loss = (result, target) => 0.5 * (target - result) ** 2;

/**
 *
 * Loss derivative
 *
 */
const lossDer = (result, target) => target - result;

/**
 *
 * @param {array} input 1d array
 * @param {number} target number
 * @param {number} lr float
 *
 */
function feed_backward(input, target, lr, lambda) {
  const learningRateF = (x) => x * lr;
  // Matrix.from() -> creates a 2d matrix
  // Matrix.dot() -> multiplies matricies by row*column
  // Matrix.apply() -> adds a function to all elements in the matrix
  // Matrix.add() -> adds two matricies together using a function modifier
  //         L_ Matrix.multiply() and Matrix.addition()
  // Matrix.T -> Transposes the matrix - inverting the shape row*column -> column*row
  // Matrix.sigmoid acts like apply but with a pre-set function

  //Forward Feed
  input = Matrix.from(input);

  const hidden = input.dot(w1).apply((b) => b + b1);

  const hidden_sig = hidden.sigmoid;

  const output = hidden_sig.dot(w2.T);

  const output_sig = output.sigmoid;

  const error = loss(output_sig.scalar, target);

  // Backpropagation

  // dLoss/dSig2
  const errorDer = lossDer(output_sig.scalar, target);

  // dSig2/dSum2
  const outputDer = sigDer(output.scalar);

  // dLoss/dSig2 * dSig2/dSum2
  const pd = Matrix.from([[errorDer * outputDer]]);

  // dSum2/dW2
  const sumWDer = hidden_sig;

  // dLoss/dW2 =  dLoss/dSig2 * dSig2/dSum2 * dSum2/dW2
  const lossWeight2 = pd.dot(sumWDer);

  // dLoss/dB1 =  dLoss/dSig2 * dSig2/dSum2 * dSum2/dB1
  const lossBias1 = errorDer * outputDer * (b1 >= 0 ? 1 : -1);

  // dSum2/dSig1
  const sumSDer = w2;

  // dSig1/dSum1
  const hiddenDer = hidden.apply(sigDer);

  // dLoss/dW1 = dLoss/dSig2 * dSig2/dSum2 * dSum2/dSig1 * dSig1/dSum1
  const lossWeight1 = input.T.dot(pd.dot(sumSDer).multiply(hiddenDer));

  // This is used in the wrong way. But it gives us amazing results.
  const l2GradientW1 = w1.apply((x) => lambda * x);
  const l2GradientW2 = w2.apply((x) => lambda * x);

  // Gives us really good results
  const lossWeight1WithReg = lossWeight1.addition(l2GradientW1);
  const lossWeight2WithReg = lossWeight2.addition(l2GradientW2);

  // Uppdate our Weigths
  let newW1 = w1.addition(lossWeight1WithReg.apply(learningRateF));
  let newW2 = w2.addition(lossWeight2WithReg.apply(learningRateF));
  let newB1 = b1 + lossBias1 * lr;

  w1 = Matrix.from(newW1.full);
  w2 = Matrix.from(newW2.full);
  b1 = newB1;

  return error;
}

function logError(e1, e2, e3, e4) {
  // console.log("\033c", "\n",)
  console.log("  Errors");
  console.log("-----------------------------------------------------");
  console.log("| Margin of error for 1 o 1:", chalk.red(e1));
  console.log("| Margin of error for 0 o 1:", chalk.red(e2));
  console.log("| Margin of error for 1 o 0:", chalk.red(e3));
  console.log("| Margin of error for 0 o 0:", chalk.red(e4));
  console.log("----------------------------------------------------- \n");
}

function feed_forward(inpu, targ) {
  const inputs = Matrix.from([inpu]);

  const hidden = inputs.dot(w1);
  const output = hidden.apply(S).dot(w2.T);
  const result = output.apply(S);
  console.log("---------------");
  console.log("Input", inpu);
  console.log("result", Math.round(result.full[0]), result.full[0]);
  console.log("target", targ);
  console.log("---------------");
}

function TrainNN(iterations = 5000, lr, lambda) {
  let e1, e2, e3, e4;
  for (let m = 0; m < iterations; m++) {
    e1 = feed_backward([[1, 1]], 0, lr, lambda);
    e2 = feed_backward([[0, 1]], 1, lr, lambda);
    e3 = feed_backward([[1, 0]], 1, lr, lambda);
    e4 = feed_backward([[0, 0]], 0, lr, lambda);
    if (m % 100 === 0) {
      logError(e1, e2, e3, e4);
    }
  }
}

let w1 = Matrix.randoms([2, 5]);
let w2 = Matrix.randoms([1, 5]);
let b1 = Math.random();

const iterations = 10000;
const lr = 0.3;
const lambda = 0.0001;
TrainNN(iterations, lr, lambda);

console.log(chalk.blue("\nMy Weights\n"));
console.log("- Weigths 1", w1.view);
console.log("");
console.log("- Weigths 2", w2.view);
console.log("");
console.log("- Bias\nOutput: \n ", b1);
console.log("\n");

console.log("  My Inputs and results");
feed_forward([1, 1], 0);
feed_forward([0, 1], 1);
feed_forward([1, 0], 1);
feed_forward([0, 0], 0);
