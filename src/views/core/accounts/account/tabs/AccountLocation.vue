<script setup>
import { nextTick, onMounted, ref } from 'vue'
import CardLayout from '@/views/layouts/CardLayout.vue'
import { shApis, shRepo, useAppStore } from '@iankibetsh/shframework'
import { useStreamline } from '@iankibetsh/vue-streamline'
import { storeToRefs } from 'pinia'
import SkeletonFull from '@/views/layouts/skeletons/SkeletonFull.vue'

const props = defineProps(['sharedData'])
const account = ref(props.sharedData.account)

const { getActionUrl, service: usersService, loading } = useStreamline('accounts')
const { getActionUrl: statsGetActionUrl, service: statsService } = useStreamline('appStats')

const appStore = useAppStore();
const { refreshKey } = storeToRefs(appStore)

const searchQuery = ref('')
const map = ref(null)
const marker = ref(null)
const latitude = ref(null)
const longitude = ref(null)
const location = ref('')

const geocoder = new google.maps.Geocoder()

// Function to get fine-grained location address
const searchLocation = () => {
  geocoder.geocode({ address: searchQuery.value }, (results, status) => {
    if (status === 'OK') {
      const loc = results[0].geometry.location
      const addressComponents = results[0].address_components

      const street = addressComponents.find(c => c.types.includes('route'))?.long_name || ''
      const city = addressComponents.find(c => c.types.includes('locality'))?.long_name || ''
      const postalCode = addressComponents.find(c => c.types.includes('postal_code'))?.long_name || ''
      location.value = searchQuery.value

      map.value.setCenter(loc)
      marker.value.setPosition(loc)
      latitude.value = loc.lat()
      longitude.value = loc.lng()
    } else {
      alert('Location not found')
    }
  })
}

// Function to get location based on marker's new position
const updateLocationFromMarker = async () => {
  await shApis.doPost(statsGetActionUrl('updateAppStats', 'marker_moves', 1))
  const latLng = {
    lat: marker.value.getPosition().lat(),
    lng: marker.value.getPosition().lng(),
  }

  geocoder.geocode({ location: latLng }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const addressComponents = results[0].address_components

      const street = addressComponents.find(c => c.types.includes('route'))?.long_name || ''
      const city = addressComponents.find(c => c.types.includes('locality'))?.long_name || ''
      const postalCode = addressComponents.find(c => c.types.includes('postal_code'))?.long_name || ''

      location.value = `${street}, ${city}, ${postalCode}`
      searchQuery.value = location.value

      latitude.value = latLng.lat
      longitude.value = latLng.lng

      console.log('Updated location details from marker drag:', { street, city, postalCode })
    } else {
      alert('Unable to determine new location')
    }
  })
}

// Function to save user location (logs to console for now)
const saveAccountLocation = async () => {
  const accountData = {
    latitude: latitude.value,
    longitude: longitude.value,
    location: location.value,
    account_id: account.value.id
  }
  const res = await shApis.doPost(getActionUrl('saveAccountLocation'), accountData)
  if (res) {
    shRepo.showToast(res.message)
    refreshKey.value++
  }
}

const mapLoaded = ref(false)

const loadMap = async () => {
  if (mapLoaded.value) return;
  mapLoaded.value = true;

  await shApis.doPost(statsGetActionUrl('updateAppStats', 'map_loads', 1))
  await nextTick()
  const mapElement = document.getElementById('map')

  if (mapElement) {
    const defaultLat = -1.4291825;
    const defaultLng = 36.6859208;

    // Convert to numbers explicitly and check if finite
    const lat = isFinite(Number(latitude.value)) ? Number(latitude.value) : defaultLat;
    const lng = isFinite(Number(longitude.value)) ? Number(longitude.value) : defaultLng;

    // Log latitude and longitude before initializing the map
    console.log('Latitude:', lat, 'Longitude:', lng);

    // Initialize the map
    map.value = new google.maps.Map(mapElement, {
      center: { lat, lng },
      zoom: 17,
    })

    // Initialize the marker
    marker.value = new google.maps.Marker({
      position: { lat, lng },
      map: map.value,
      draggable: true,
    })

    google.maps.event.addListener(marker.value, 'dragend', updateLocationFromMarker)
  } else {
    console.error('Map element not found!')
  }
}

// Load user coordinates on update button click
const updateLocation = () => {
  if (account.value) {
    latitude.value = isFinite(account.value.latitude) ? account.value.latitude : null;
    longitude.value = isFinite(account.value.longitude) ? account.value.longitude : null;
    location.value = account.value.location;

    console.log('User Latitude:', latitude.value, 'User Longitude:', longitude.value); // Log user coordinates
    loadMap();
  } else {
    // If no user data, initialize map with default coordinates
    latitude.value = -1.4291825;
    longitude.value = 36.6859208;
    console.log('Using default coordinates'); // Log default coordinates
    loadMap();
  }
}

onMounted(() => {
  // Initialize values, do not load the map here
  if (account.value) {
    latitude.value = isFinite(account.value.latitude) ? account.value.latitude : null;
    longitude.value = isFinite(account.value.longitude) ? account.value.longitude : null;
    location.value = account.value.location;
  }
})

</script>

<template>
  <CardLayout v-if="!loading && account">
    <div class="row mt-3 ">
      <div class="col-md-6" v-if-user-can="'accounts.location.write'">
        <label>Search Location</label>
        <div class="input-group mb-3">
          <input class="form-control" type="text" v-model="searchQuery" @click="loadMap" placeholder="Search for a location" />
          <button class="btn btn-secondary" @click="searchLocation">
            <i class="bi bi-search"></i>Search
          </button>
        </div>
      </div>
      <div class="col-md-3">
        <label>Latitude</label>
        <input class="form-control" required type="text" v-model="latitude"  />
      </div>
      <div class="col-md-3">
        <label>Longitude</label>
        <input class="form-control" required type="text" v-model="longitude"  />
      </div>
    </div>

    <div>
      <div class="py-4 mx-auto text-center mt-2 rounded bg-opacity-10" v-if="!mapLoaded">
        <a :href="`https://maps.google.com/?q=${latitude},${longitude}&z=8`" target="_blank" class="btn btn-success btn-lg mb-3 me-3 text-center"> View Client Location</a>
        <button class="btn btn-dark btn-lg mb-3 text-center" v-if-user-can="'accounts.location.write'" @click="updateLocation"> Update Client Location </button>
      </div>

      <div v-if="mapLoaded" id="map" class="rounded p-3 shadow border-1 w-90 m-3" style="height: 500px"></div>
    </div>

    <div class="row align-items-end " v-if-user-can="'accounts.location.write'">
      <div class="form-group col-md-6">
        <label class="mb-2" > Exact Location Name</label>
        <input class="form-control " type="text" v-model="location" />
      </div>
      <div class="col-md-3">
        <label></label>
        <button class="btn btn-primary d-block " @click="saveAccountLocation">
          Save User Location
        </button>
      </div>
    </div>
  </CardLayout>
  <SkeletonFull v-else />
</template>
