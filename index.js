const form = document.querySelector("form")
const input = document.querySelector("#weather-search")
const weatherDiv = document.querySelector("#weather")

const API_KEY = "ac07528e9f1764278ac3ec18ad0f3710"
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const searchTerm = input.value.trim()
  if (!searchTerm) return

  // Clear previous weather data and input
  weatherDiv.innerHTML = ""
  input.value = ""

  const URL = `${BASE_URL}?units=imperial&appid=${API_KEY}&q=${searchTerm}`

  try {
    const res = await fetch(URL)
    if (!res.ok) throw new Error("Location Not Found")

    const data = await res.json()
    renderWeather(data)
  } catch (error) {
    // Handle errors
    weatherDiv.innerHTML = ""
    const errorEl = document.createElement("h2")
    errorEl.textContent = "Location not found"
    weatherDiv.appendChild(errorEl)
  }
})

const renderWeather = (data) => {
  // Clear previous content
  weatherDiv.innerHTML = ""

  const {
    name: city,
    coord: { lat, lon },
    sys: { country },
    weather,
    main: { temp, feels_like },
    dt
  } = data

  const { description, icon: iconCode } = weather[0]

  const updatedTime = new Date(dt * 1000)
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit"
    })
    .toLowerCase()

  // City and country code
  const cityEl = document.createElement("h2")
  cityEl.textContent = `${city}, ${country}`

  // Google Maps link
  const mapLink = document.createElement("a")
  mapLink.href = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
  mapLink.target = "_blank"
  mapLink.textContent = "Click to view map"

  // Weather icon
  const iconImg = document.createElement("img")
  iconImg.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  iconImg.alt = description

  // Weather description
  const descEl = document.createElement("p")
  descEl.style.textTransform = "capitalize"
  descEl.textContent = description

  // Current temp
  const tempEl = document.createElement("p")
  tempEl.textContent = `Current: ${temp.toFixed(2)}° F`

  // Feels like
  const feelsEl = document.createElement("p")
  feelsEl.textContent = `Feels like: ${feels_like.toFixed(2)}° F`

  // Last updated
  const updatedEl = document.createElement("p")
  updatedEl.textContent = `Last updated: ${updatedTime}`

  // Append everything to the weather results container
  weatherDiv.appendChild(cityEl)
  weatherDiv.appendChild(mapLink)
  weatherDiv.appendChild(iconImg)
  weatherDiv.appendChild(descEl)
  weatherDiv.appendChild(document.createElement("br"))
  weatherDiv.appendChild(tempEl)
  weatherDiv.appendChild(feelsEl)
  weatherDiv.appendChild(document.createElement("br"))
  weatherDiv.appendChild(updatedEl)
}
