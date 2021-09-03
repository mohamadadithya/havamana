const weather = document.querySelector('.weather')
const weatherEl = {
  icon: weather.querySelector('.icon'),
  temperature: weather.querySelector('.temperature'),
  condition: weather.querySelector('.condition')
}

const headerEl = {
  location: document.querySelector('.location'),
  day: document.querySelector('.day'),
  time: document.querySelector('.time')
}

const additionalEl = {
  title: document.querySelector('.title'),
  wind: document.querySelector('.wind'),
  visibility: document.querySelector('.visibility'),
  humidity: document.querySelector('.humidity'),
  pressure: document.querySelector('.pressure')
}

const additionalLabels = {
  wind: document.querySelector('.wind-label'),
  visibility: document.querySelector('.vis-label'),
  humidity: document.querySelector('.hum-label'),
  pressure: document.querySelector('.press-label')
}

let langConfig = {
  lang: `en`,
  localeLang: `en-US`
}

const toggle = document.querySelector('.toggle-lang')

const bahasaIndonesia = () => {
  langConfig.lang = `id`
  langConfig.localeLang = `id-ID`
  additionalEl.title.innerText = `Info Tambahan`
  additionalLabels.wind.innerText = `Angin`
  additionalLabels.visibility.innerText = `Visibilitas`
  additionalLabels.humidity.innerText = `Kelembaban`
  additionalLabels.pressure.innerText = `Tekanan`
  toggle.innerText = `🇬🇧`
}

const english = () => {
  langConfig.lang = `en`
  langConfig.localeLang = `en-US`
  additionalEl.title.innerText = `Additional Info`
  additionalLabels.wind.innerText = `Wind`
  additionalLabels.visibility.innerText = `Visibility`
  additionalLabels.humidity.innerText = `Humidity`
  additionalLabels.pressure.innerText = `Pressure`
  toggle.innerText = `🇲🇨`
}

toggle.onclick = () => {
  toggle.classList.toggle('id')
  localStorage.setItem('lang', 'id')
  checkLanguage()
}

const checkStorage = () => {
  let storageLang = localStorage.getItem('lang')
  if (storageLang) {
    toggle.classList.add(storageLang)
  }
  checkLanguage()
}

const getLocation = () => {
  if (navigator.geolocation) {
    let nav = navigator.geolocation.getCurrentPosition(getCity, error)
  } else {
    alert(`Geolocation is not supported by this browser.`)
  }
}

const error = (err) => {
  if (err.code === err.PERMISSION_DENIED) {
    alert(err.message)
  }
}

const getCity = async (position) => {
  let latitude = position.coords.latitude
  let longitude = position.coords.longitude
  const APIKey = `pk.e2df40699e69748cabc14a18004342e3`
  let url = `https://us1.locationiq.com/v1/reverse.php?key=${APIKey}&lat=${latitude}&lon=${longitude}&format=json`
  const response = await fetch(url)
  const result = await response.json()
  const data = await result
  getWeather(data.address)
}

const getWeather = async (address) => {
  const APIKey = `475766e69fadac7e9d6ff3c26cf3ccaa`
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${address.city}&units=metric&lang=${langConfig.lang}&appid=${APIKey}`
  const response = await fetch(url)
  const result = await response.json()
  const data = await result
  showWeather(data, address)
}

const showWeather = (data, address) => {
  headerEl.location.innerText = `${address.city}, ${address.country_code.toUpperCase()}`
  let dataIcon = data.weather[0].icon
  let dataDesc = data.weather[0].description
  let iconClass
  if (dataDesc.includes('clear')) {
    iconClass = `fa-sun`
  }
  if (dataDesc.includes(`few`)) {
    iconClass = `fa-cloud-sun`
  }
  if (dataDesc.includes('overcast') || dataDesc.includes('broken')) {
    iconClass = `fa-clouds`
  }
  if (dataDesc.includes('scattered')) {
    iconClass = `fa-cloud`
  }
  if (dataIcon.includes('50')) {
    iconClass = `fa-fog`
  }
  if (dataIcon.includes('13')) {
    iconClass = `fa-snowflake`
  }
  if (dataIcon.includes('09')) {
    iconClass = `fa-cloud-showers`
  }
  if (dataIcon.includes('10')) {
    iconClass = `fa-cloud-sun-rain`
  }
  if (dataIcon.includes('11')) {
    iconClass = `fa-thunderstorm`
  }
  weatherEl.icon.classList.add(iconClass)
  weatherEl.temperature.innerText = `${data.main.temp}°c`
  weatherEl.condition.innerText = data.weather[0].description
  additionalInfo(data)
  console.log(data)
}

const additionalInfo = (data) => {
  additionalEl.wind.innerText = `${data.wind.speed}m/s`
  additionalEl.visibility.innerText = `${data.visibility.toString()[0]}km`
  additionalEl.humidity.innerText = data.main.humidity
  additionalEl.pressure.innerText = `${data.main.pressure}hPa`
}

const getTime = () => {
  let dateObj = new Date()
  let timeNow = dateObj.toLocaleString(langConfig.localeLang, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })

  let dateNow = dateObj.toLocaleString(langConfig.localeLang, {
    weekday: 'long',
  })

  headerEl.time.innerText = timeNow
  headerEl.day.innerText = dateNow
}

setInterval(getTime, 1000)

const changeBackground = () => {
  let dateObj = new Date()
  let hours = dateObj.getHours()
  const body = document.body
  let bgColor
  let textColor

  if (hours >= 4 && hours <= 10) {
    bgColor = `#F3ECD0`
  }
  if (hours >= 10 && hours <= 16) {
    bgColor = `#87CEEB`
  }
  if (hours >= 16 && hours <= 19) {
    bgColor = `#ff9200`
  }
  if (hours > 19 || hours < 4) {
    bgColor = `#272652`
    textColor = `#FFFFFF`
  }

  body.style.backgroundColor = bgColor
  body.style.color = textColor
}

const checkLanguage = () => {
  if (toggle.classList.contains('id')) {
    bahasaIndonesia()
  } else {
    english()
    localStorage.removeItem('lang')
  }
  getLocation()
}

checkStorage()

changeBackground()
