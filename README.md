# Home Assistant Sensor Widget for iOS

This is a simple sensor widget for iOS using [Scriptable](https://scriptable.app/). It will provide a relatively simple way to add you sensor in a widget.

![Example widget](example_widget.jpeg)

## Instructions

Download the Scriptable app and add the [script file](home-assistant-widget.js) as a script. You can then edit the config and add a **small** scriptable widget to your screen.

When added the widget edit the widget and choose the script as widget. Voila!

## Home assistant prerequisites

1. Find your home assistant base URL (typically something like `https://myinstance.ui.nabu.casa` or `http://192.168.1.32:8123`)
2. Create a long lived token (Bearer token) for your desired user.
3. Find you sensor entity ids (something like `sensor.oregonv1_x080_temp` or `binary_sensor.smart_water_leak_12`)

## Configure the widget

Add your base URL and Bearer token. It should look something like below.
```js
const hassUrl = "http://192.168.1.32:8123"
const hassToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
```

Add titles and sensor to the array. You can add any number of titles and sensors as long as there are room. The widget will automatically recognize titles and sensors. If it does not find the entry in your home assistant states it will diplay it as a title.
```js
const widgetTitlesAndSensors = [
  "Solar",
  "sensor.solar_power",
  "sensor.solar_yield_today",
  "Wind",
  "sensor.wind_now:{percision:2}"
  ]
```

### Configuration options

Extra options can be added to configure your widget. Options are specified after the sensor entity ID using the format `sensor.entity_id:{option1:value1,option2:value2}`.

Currently supported options:

| Option (key) | Description                              | Default                     | Example Value   |
|--------------|------------------------------------------|-----------------------------|-----------------|
| precision    | Number of decimals to show               | N/A (shows all decimals)    | 2               |
| attribute    | Show an attribute value instead of state | N/A (shows entity state)    | 'friendly_name' |
| device_class | Override automatic icon selection        | N/A (auto detection)        | 'person'        |

#### Examples
Simple precision option:
```pseduo
"sensor.wind_now:{precision:2}"
```

Accessing nested attributes:
```pseduo
"skolmat.acme_school:{attribute:calendar.11.2.courses.0,device_class:'food'}"
```

Using an attribute and custom device class:
```pseduo
"person.jane:{attribute:'friendly_name',device_class:'person'}"
```

Available device classes can be found in the `deviceClassSymbolMap` constant in the [script file](home-assistant-widget.js).

Also feel free to add you own by checking symbols in the [SF Symbols app](https://developer.apple.com/sf-symbols/).

### Add link to view in Home Assistant

Long press the widget, choose edit widget, and choose Open URL. Add desired link, as described below.

To add a link you just mimic your web url to a view but use the `homeassistant` scheme together with `navigate`. E.g. to navigate to a lovelace view: `homeassistant://navigate/lovelace-my-home/1`, the digit at the end represent the tab number (starting at `0`).
