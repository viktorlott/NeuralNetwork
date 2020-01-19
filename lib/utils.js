class LCG {
	constructor(seed = 42) {
		this.seed = seed
		this.m = 139968.0
		this.a = 3877.0
        this.c = 29573.0
    }
    seed(seed) {
        this.seed = seed
    }
	random() {
		this.lastnumber = (this.lastnumber * this.a + this.c) % this.m
		return this.lastnumber / this.m
	}
}

module.exports = {
	LCG
}