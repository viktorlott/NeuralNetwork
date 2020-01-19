//my first NN

const { LCG } = require("./utils")

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
            if(i < this.full.length - 1) text.push("],\n ")
        }
        const constructedText = `\nOutput: [
 ${text.join("")}]\n]`

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
    multiply(b) {
        const multiply = (a, b) => a * b
        return this.add(b, multiply)
    }
    addition(b) {
        const addition = (a, b) => a + b
        return this.add(b, addition)
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
    get sigmoid() {
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




module.exports = Matrix
















