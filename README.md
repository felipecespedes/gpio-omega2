# GPIO Omega2
Control Onion Omega2 GPIO pins from NodeJS using fast-gpio.

## Quick start
### Add this module to your project
```bash
npm install --save gpio-omega2
```

## Usage

### Control a Pin
```javascript
'use strict';
const GpioOmega2 = require('gpio-omega2');
const gpio = new GpioOmega2();
const pinNumber = 0;
const pin = gpio.pin({pin: pinNumber, mode: 'output'});
pin.high();
```

### Turn on a led
```javascript
'use strict';
const GpioOmega2 = require('gpio-omega2');
const gpio = new GpioOmega2();
const pinNumber = 0;
const led = gpio.led(pinNumber);
led.on();
```

### Blinking led
```javascript
'use strict';
const GpioOmega2 = require('gpio-omega2');
const gpio = new GpioOmega2();
const pinNumber = 0;
const led = gpio.led(pinNumber);
const delay = 500;
led.blink(delay);
```

## Functions
- pin.high();
- pin.low();
- pin.toggle();
- pin.set(value);
- led.on();
- led.off();
- led.toggle();
- led.blink();
- led.stopBlinking();

## Authors

* **Felipe Céspedes** - *felipecespedespisso@gmail.com* - [felipecespedes](https://github.com/felipecespedes)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
