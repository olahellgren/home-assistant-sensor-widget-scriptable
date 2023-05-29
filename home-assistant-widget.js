//  Home Assistant Sensor Widget
//
//  Copyright 2023 @olahellgren
//
//
//  INSTRUCTIONS
//  
//  Start by adding the URL (IP/host and port) e.g.
//  https://myinstance.ui.nabu.casa or
//  http://192.168.1.101:8123.
//
//  Make sure you have craeted a long lived token
//  for one you your users, preferably a separete
//  user with no admin rights. Your token will be
//  used to access your home assistant.
//
 
const hassUrl = "<hass base url>"
const hassToken = "<your long lived Bearer token>"

const subtitleText = "Solar Energy"
const hassSensors = [
  "sensor.kostal_inverter_output_power",
  "sensor.kostal_inverter_yield_today"
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

const titleText = "Home Assistant"

const backgroundColorStart = '#049cdb'
const backgroundColorEnd = '#0180c8'
const textColor = '#ffffff'
const fontAndImageSize = 16
const padding = 12
const maxNoOfSensors = 4

const states = await fetchAllStates()
const widget = new ListWidget()

const iconSymbolMap = {
  "mdi:calendar": "calendar"
}

const unitSymbolMap = {
  "power": "bolt.fill",
  "energy": "bolt.fill",
  "temperature": "thermometer.medium",
  "humidity": "humidity.fill",
  "battery": "battery.75",
  "moisture": "drop.fill",
  "timestamp": "clock.fill"
}

setupBackground(widget)
const mainLayout = widget.addStack()
mainLayout.layoutVertically()
const titleStack = mainLayout.addStack()
titleStack.topAlignContent()
setupTitle(titleStack, titleText, "house.fill")
mainLayout.addSpacer()
const sensorStack = mainLayout.addStack()
sensorStack.layoutVertically()
sensorStack.bottomAlignContent()
setupTitle(sensorStack, subtitleText)
addSensorValues(sensorStack, hassSensors)

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
  titleStack.setPadding(0, 0, 0, 25)
  if (icon) {
   let wImage = titleStack.addImage(SFSymbol.named(icon).image)
    wImage.imageSize = new Size(12, 12)  
    titleStack.addSpacer(5)
  }
  let wTitle = titleStack.addText(titleText)
  wTitle.font = Font.semiboldRoundedSystemFont(12)
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
  } else if (unitSymbolMap[sensor.attributes.device_class]) {
    return unitSymbolMap[sensor.attributes.device_class]
  } else {
    return "house.fill"
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
  imageNode.imageSize = new Size(16, 16)
  
  const value = row.addStack()
  value.setPadding(0, 0, 0, 4)
  const valueText = value.addText(sensor.state)
  valueText.font = Font.mediumRoundedSystemFont(16)
  valueText.textColor = new Color(textColor)
  
  if (sensor.attributes.unit_of_measurement) {
    const unit = row.addStack()
    const unitText = unit.addText(sensor.attributes.unit_of_measurement)
    unitText.font = Font.mediumSystemFont(16)  
    unitText.textColor = new Color(textColor)
  }

}

function addEmptyRow() {
  const row = widget.addStack()
  row.layoutHorizontally()
  const t = row.addText(' ')
   t.font = Font.mediumSystemFont(16)
}

// Fetch all states from Home Assistant
async function fetchAllStates() {
  let req = new Request(`${hassUrl}/api/states`)
  req.headers = { 
    "Authorization": `Bearer ${hassToken}`, 
    "content-type": "application/json" 
  }
  return await req.loadJSON();
}

// Retrieve requested entity from states
function getState(states, entityId) {
  return states.filter(state => state.entity_id === entityId)[0]
}
