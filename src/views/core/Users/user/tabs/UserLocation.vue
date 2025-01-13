<script setup>
import { ref, onMounted } from 'vue'
import CardLayout from '@/views/layouts/CardLayout.vue'
import L from 'leaflet'
import debounce from 'lodash/debounce' // Import debounce for throttling

const props = defineProps(['sharedData'])
const user = ref(props.sharedData)

const searchQuery = ref('')
const latitude = ref(null)
const longitude = ref(null)
const locationDetails = ref('') // To store location details
const predictions = ref([]) // To store the location predictions
let map = null
let marker = null

// Function to handle reverse geocoding (fetch address from coordinates)
const getAddressFromCoords = async (lat, lon) => {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
  const data = await response.json()
  if (data && data.display_name) {
    locationDetails.value = data.display_name
  } else {
    locationDetails.value = 'Unknown location'
  }
}

// Function to search for a location based on query
const searchLocation = async () => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery.value}&limit=1`
  )
  const data = await response.json()
  if (data.length > 0) {
    const { lat, lon } = data[0]
    map.setView([lat, lon], 14)
    marker.setLatLng([lat, lon])
    latitude.value = lat
    longitude.value = lon
    await getAddressFromCoords(lat, lon) // Get address details for precise location
  } else {
    alert('Location not found')
  }
}

// Function to fetch predictions as the user types (debounced)
const fetchPredictions = debounce(async () => {
  if (searchQuery.value.length > 2) { // Start fetching after 3 characters
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery.value}&limit=5`
    )
    predictions.value = await response.json()
  } else {
    predictions.value = [] // Clear predictions if input is less than 3 characters
  }
}, 300) // Delay the API request by 300ms

// Function to handle prediction selection
const selectPrediction = async (lat, lon, display_name) => {
  map.setView([lat, lon], 14)
  marker.setLatLng([lat, lon])
  latitude.value = lat
  longitude.value = lon
  locationDetails.value = display_name
  predictions.value = [] // Clear predictions after selection
}

onMounted(() => {
  map = L.map('map').setView([-1.2921, 36.8219], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  marker = L.marker([-1.2921, 36.8219], { draggable: true }).addTo(map)

  marker.on('dragend', async function(e) {
    const { lat, lng } = e.target.getLatLng()
    latitude.value = lat
    longitude.value = lng
    await getAddressFromCoords(lat, lng) // Get address when marker is moved
  })
})
</script>

<template>
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />

  <CardLayout>
    <div>

      <input
        type="text"
        v-model="searchQuery"
        @input="fetchPredictions"
        placeholder="Search for a location"
      />
      <button @click="searchLocation">Search</button>

      <!-- Display location predictions -->
      <ul v-if="predictions.length" class="predictions-list">
        <li
          v-for="(prediction, index) in predictions"
          :key="index"
          @click="selectPrediction(prediction.lat, prediction.lon, prediction.display_name)"
        >
          {{ prediction.display_name }}
        </li>
      </ul>

      <div id="map" style="height: 400px; width: 100%"></div>
      <p>Latitude: {{ latitude }}</p>
      <p>Longitude: {{ longitude }}</p>
      <p>Location Details: {{ locationDetails }}</p> <!-- Display location details -->
    </div>
  </CardLayout>
</template>

<style scoped>
#map {
  height: 400px;
  width: 100%;
}

.predictions-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ddd;
  max-height: 150px;
  overflow-y: auto;
  background-color: #fff;
  position: absolute;
  z-index: 10;
  width: 100%;
}

.predictions-list li {
  padding: 10px;
  cursor: pointer;
}

.predictions-list li:hover {
  background-color: #f0f0f0;
}
</style>
