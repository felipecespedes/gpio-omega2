'use strict';
const spawn = require('child-process-promise').spawn;

class GpioOmega2 {
  constructor() {
    this.helper = new GpioOmega2Helper();
  }

  pin(options) {
    return new GpioOmega2Pin(options, this.helper);
  }

  led(pinNumber, options) {
    if (options != null) {
      if (!this.helper.isObject(options)) {
        throw new Error('Invalid options');
      }
    } else {
      options = {};
    }
    options.pin = pinNumber;
    options.mode = 'output';
    const gpioOmega2Pin = this.pin(options);
    return new GpioOmega2Led(gpioOmega2Pin, this.helper);
  }
}

class GpioOmega2Pin {
  /**
   * options:
   * - pin
   * - mode
   * - debug
   */
  constructor(options, helper) {
    this.helper = helper;
    if (this.helper.isObject(options)) {
      if (this._isValidPin(options.pin)) {
        this.pin = options.pin;
      } else {
        throw new Error('Invalid pin number: ' + options.pin);
      }
      if (this._validModes().indexOf(options.mode) > -1) {
        this.mode = options.mode;
      } else if (options.mode == null) {
        this.mode = 'output';
      } else {
        throw new Error('Invalid mode: ' + options.mode);
      }
      if (options.debug != null) {
        if (this.helper.isBoolean(options.debug)) {
          this.debug = options.debug;
        } else  {
          throw new Error('Invalid debug mode: ' + options.debug);
        }
      } else {
        this.debug = false;
      }
    } else {
      throw new Error('Invalid options');
    }
    this.isHigh = false;
    this.debug && console.log(options);
    spawn('fast-gpio', ['set', this.mode, this.pin]);
  }

  set(value) {
    if (this.helper.isBoolean(value)) {
      value = value ? 1 : 0;
    } else if (value !== 1 || value !== 0) {
      throw new Error('Value is not allowed: ' + value);
    }
    this.isHigh = value ? true : false;
    this.debug && console.log('Pin %s write: %s', this.pin, value);
    spawn('fast-gpio', ['set', this.pin, value]);
  }

  low() {
    this.set(false);
  }

  high() {
    this.set(true);
  }

  toggle() {
    if (this.isHigh) {
      this.low();
    } else {
      this.high();
    }
  }

  _validPins() {
    return [0, 1, 2, 3, 7, 8, 9, 11];
  }

  _validModes() {
    // TODO allow 'in' and 'out' values as aliases
    return ['input', 'output'];
  }

  _isValidPin(pinNumber) {
    if (this.helper.isNumber(pinNumber) && this._validPins().indexOf(pinNumber) > -1) {
      return true;
    } else {
      return false;
    }
  }
}

class GpioOmega2Led {
  constructor(gpioOmega2Pin, helper) {
    this.omega2Pin = gpioOmega2Pin;
    this.helper = helper;
    this.blinkInterval = null;
  }

  on() {
    this.omega2Pin.high();
  }

  off() {
    this.omega2Pin.low();
  }

  toggle() {
    this.omega2Pin.toggle();
  }

  blink(delay) {
    if (delay != null) {
      if (!this.helper.isNumber(delay)) {
        throw new Error('Invalid delay: ' + this.delay);
      }
    } else {
      delay = 1000;
    }
    if (this.blinkInterval) {
      this.stopBlinking();
    }
    this.blinkInterval = setInterval(() => {
      this.toggle();
    }, delay);
  }

  stopBlinking() {
    clearInterval(this.blinkInterval);
    this.blinkInterval = null;
    this.off();
  }
}

class GpioOmega2Helper {
  isNumber(number) {
    return !isNaN(parseInt(number, 10));
  }

  isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object;
  }

  isBoolean(value) {
    return typeof value === 'boolean';
  }
}

// TODO
// Add support for inputs
// Add Button class

module.exports = GpioOmega2;
