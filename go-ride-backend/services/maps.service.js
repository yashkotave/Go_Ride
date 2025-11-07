const axios = require("axios");
const captainModel = require("../models/captain.model");

module.exports.getAddressCoordinates = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === "OK") {
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error("Unable to fetch coordinates");
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching coordinates");
    }
};

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error("Origin and destination are required");
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = "https://routes.googleapis.com/directions/v2:computeRoutes";

    const originC = await this.getAddressCoordinates(origin);
    const destinationC = await this.getAddressCoordinates(destination);

    try {
        const response = await axios.post(
            url,
            {
                origin: { location: { latLng: { latitude: originC.lat, longitude: originC.lng } } },
                destination: { location: { latLng: { latitude: destinationC.lat, longitude: destinationC.lng } } },
                travelMode: "DRIVE",
                computeAlternativeRoutes: false,
                routeModifiers: {
                    avoidTolls: false,
                    avoidHighways: false,
                    avoidFerries: false
                },
                languageCode: "en-US",
                units: "METRIC"
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": apiKey,
                    "X-Goog-FieldMask": "routes.distanceMeters,routes.duration"
                }
            }
        );

        console.log("API Response:", JSON.stringify(response.data, null, 2));

        const route = response.data.routes[0];

        if (!route) {
            throw new Error("No routes found");
        }

        return {
            distance: route.distanceMeters / 1000,
            duration: Math.round(parseInt(route.duration.replace('s', ''))/ 60)
        };
    } catch (error) {
        console.error("Error fetching distance:", error.response?.data || error.message);
        throw new Error("Failed to fetch distance");
    }
};



// async function getAccessToken() {
//     const auth = new GoogleAuth({
//         scopes: ["https://www.googleapis.com/auth/places"],
//     });
//     const client = await auth.getClient();
//     return await client.getAccessToken();
// }

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error("Query is required");
    }

const apiKey = process.env.GOOGLE_MAPS_API;
const url = 'https://places.googleapis.com/v1/places:searchText';

try {
    const response = await axios.post(
        url,
        {
            textQuery: input,
            languageCode: "en",
            regionCode: "IN",
            
            maxResultCount: 5
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.id'
            }
        }
    );

    if (response.data.places) {
        return response.data.places.map(place => ({
            displayName: place.displayName.text,
            description: place.formattedAddress || place.displayName.text
        }));
    } else {
        throw new Error("No suggestions found");
    }
} catch (error) {
    console.error("Error fetching suggestions:", error.response?.data || error.message);
    throw new Error("Failed to fetch suggestions");
}
};

module.exports.getCaptainsInTheRadius = async(lat, lng, radius) => {

    // radius in km
    const captains = await captainModel.find({
        location:{
            $geoWithin:{
                $centerSphere: [ [lat,lng] , radius / 6371]
            }
        }
    })

    return captains;
}