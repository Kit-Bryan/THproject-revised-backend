class Simulator {
  constructor(start, step, min, max, decimal = 1) {
    this.point = start;
    this.step = step;
    this.min = min;
    this.max = max;
    this.decimal = decimal;
  }

  round(value) {
    const factor = 10 ** this.decimal;
    return Math.round(value * factor) / factor;
  }

  generate() {
    let nextMax = this.point + this.step;
    let nextMin = this.point - this.step;

    if (this.upTrend > 0) {
      this.upTrend -= 1;
      nextMin = this.point;
      nextMax = nextMin + this.step;
    }

    if (this.downTrend > 0) {
      this.downTrend -= 1;
      nextMax = this.point;
      nextMin = nextMax - this.step;
    }

    if (nextMax >= this.max) {
      nextMax = this.max;
      nextMin = this.max - this.step;
      // hit bottom - time to go up
      this.downTrend = 3 + Math.round(Math.random() * 5);
    } else if (nextMin <= this.min) {
      nextMin = this.min;
      nextMax = this.min + this.step;
      this.upTrend = 3 + Math.round(Math.random() * 5);
    }

    this.point = this.round(nextMin + Math.random() * (nextMax - nextMin));
    return this.point;
  }
}

module.exports = Simulator;
