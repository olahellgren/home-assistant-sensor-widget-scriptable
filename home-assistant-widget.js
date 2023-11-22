//  Home Assistant Sensor Widget
//
//  Copyright 2023 @olahellgren
//  https://github.com/olahellgren/home-assistant-sensor-widget-scriptable
//
//
//  INSTRUCTIONS
//
//  Download Scriptable app and add THIS script to it. This will allow you to 
//  add a small widget to your iOS background.
//  
//  Start by adding the URL (IP/host and port) e.g.
//  https://myinstance.ui.nabu.casa or
//  http://192.168.1.32:8123.
//
//  Make sure you have craeted a long lived token
//  for one you your users, preferably a separete
//  user with no admin rights. Your token will be
//  used to access your home assistant.
//
//  Add titles and sensors in the `widgetTitlesAndSensors` array. All sensors found 
//  will be showed as sensors and sensors not found will be shown as titles. This way
//  it's pretty flexible to add what you want.

// Confguration
// EDIT HERE
 
const hassUrl = "<hass base url>"
const hassToken = "<your long lived Bearer token>"

const widgetTitlesAndSensors = [
  "Solar Energy",
  "sensor.kostal_inverter_output_power",
  "sensor.kostal_inverter_yield_today",
  "Weather",
  "sensor.oregonv1_0080_temp",
  "weather.hem"
  ]

//  The MIT License
//
//  Permission is hereby granted, free of charge, to any person obtaining a 
//  copy of this software and associated documentation files (the "Software"), 
//  to deal in the Software without restriction, including without limitation 
//  the rights to use, copy, modify, merge, publish, distribute, sublicense, 
//  and/or sell copies of the Software, and to permit persons to whom the 
//  Software is furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in 
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
//  OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
//  DEALINGS IN THE SOFTWARE.
//
//  ==========================
//  Don't EDIT below this line
//  ==========================

const titleText = "Home Assistant"

const backgroundColorStart = '#049cdb'
const backgroundColorEnd = '#0180c8'
const textColor = '#ffffff'
const sensorFontAndImageSize = 16
const titleFontAndImageSize = 12
const padding = 12
const maxNoOfSensors = 4

const states = await fetchAllStates()
const widget = new ListWidget()

const iconSymbolMap = {
  "mdi:calendar": "calendar"
}

const deviceClassSymbolMap = {
  "default": "house.fill",
  "battery": "battery.75",
  "energy": "bolt.fill",
  "humidity": "humidity.fill",
  "moisture": "drop.triangle.fill",
  "power": "bolt.fill",
  "precipitation": "cloud.rain.fill",
  "temperature": "thermometer.medium",
  "timestamp": "clock.fill",
  "wind_speed": "wind"
}

setupBackground(widget)
const mainLayout = widget.addStack()
mainLayout.layoutVertically()
const titleStack = mainLayout.addStack()
titleStack.topAlignContent()
setupTitle(titleStack, titleText, deviceClassSymbolMap.default)
mainLayout.addSpacer()
const sensorStack = mainLayout.addStack()
sensorStack.layoutVertically()
sensorStack.bottomAlignContent()
widgetTitlesAndSensors.forEach(entry => {
  if (getState(states, entry)) {
    addSensor(sensorStack, entry)
  } else {
    setupTitle(sensorStack, entry)
  }
})

Script.setWidget(widget)
Script.complete()
widget.presentSmall()


function setupBackground() {
  const bGradient = new LinearGradient()
  bGradient.colors = [new Color(backgroundColorStart), new Color(backgroundColorEnd)]
  bGradient.locations = [0,1]
  widget.backgroundGradient = bGradient
  widget.setPadding(padding, padding, padding, padding)
  widget.spacing = 4
}

function setupTitle(widget, titleText, icon) {
  let titleStack = widget.addStack()
  titleStack.cornerRadius = 4
  titleStack.setPadding(3, 0, 0, 25)
  if (icon) {
   let wImage = titleStack.addImage(SFSymbol.named(icon).image)
    wImage.imageSize = new Size(titleFontAndImageSize, titleFontAndImageSize)  
    titleStack.addSpacer(5)
  }
  let wTitle = titleStack.addText(titleText)
  wTitle.font = Font.semiboldRoundedSystemFont(titleFontAndImageSize)
  wTitle.textColor = Color.white()
}

function addSensorValues(sensorStack, hassSensors) {
  hassSensors.forEach(sensor => {
    addSensor(sensorStack, sensor)
  })
}

function getSymbolForSensor(sensor) {
  if (iconSymbolMap[sensor.attributes.icon]) {
    return iconSymbolMap[sensor.attributes.icon]
  } else if (deviceClassSymbolMap[sensor.attributes.device_class]) {
    return deviceClassSymbolMap[sensor.attributes.device_class]
  } else {
    return deviceClassSymbolMap.default
  }
}

function addSensor(sensorStack, entityId) {
  const sensor = getState(states, entityId)
  
  const row = sensorStack.addStack()
  row.setPadding(0, 0, 0, 0)
  row.layoutHorizontally()
  
  const icon = row.addStack()
  icon.setPadding(0, 0, 0, 3)
  const sfSymbol = getSymbolForSensor(sensor)
  const sf = SFSymbol.named(sfSymbol)
  const imageNode = icon.addImage(sf.image)
  imageNode.imageSize = new Size(sensorFontAndImageSize, sensorFontAndImageSize)
  
  const value = row.addStack()
  value.setPadding(0, 0, 0, 4)
  const valueText = setSensorText(value, sensor)
  valueText.font = Font.mediumRoundedSystemFont(sensorFontAndImageSize)
  valueText.textColor = new Color(textColor)
  
  if (sensor.attributes.unit_of_measurement) {
    const unit = row.addStack()
    const unitText = unit.addText(sensor.attributes.unit_of_measurement)
    unitText.font = Font.mediumSystemFont(sensorFontAndImageSize)  
    unitText.textColor = new Color(textColor)
  }

}

function setSensorText(value, sensor) {
  if (sensor.attributes.device_class === "moisture") {
    return sensor.state === "on" ? value.addText("Wet") : value.addText("Dry") 
  } else {
    return value.addText(sensor.state)
  }
}

function addEmptyRow() {
  const row = widget.addStack()
  row.layoutHorizontally()
  const t = row.addText(' ')
   t.font = Font.mediumSystemFont(sensorFontAndImageSize)
}

async function fetchAllStates() {
  let req = new Request(`${hassUrl}/api/states`)
  req.headers = { 
    "Authorization": `Bearer ${hassToken}`, 
    "content-type": "application/json" 
  }
  return await req.loadJSON();
}

function getState(states, entityId) {
  return states.filter(state => state.entity_id === entityId)[0]
}
