# Home Assistant Sensor Widget for iOS

This is a simple sensor widget for iOS using [Scriptable](https://scriptable.app/). It will provide a relativly simple way to add you sensor in a widget.

![Example widget](example_widget.jpeg)

## Instructions

Downlaod the Scriptable app and add the [script file](home-assistant-widget.js) as a script. You can then edit the config and add a small scriptable widget to your screen.

When added the widget edit the widget and choose the script as widget. Voila!

## Home assistant prerequisits

1. Find your home assistant base URL (typicallly something like `https://myinstance.ui.nabu.casa` or `http://192.168.1.32:8123`)
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
  "My Title",
  "sensor.solar_power",
  "sensor.solar_yield_today"
  ]
```

