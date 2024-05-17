const HttpsProxyAgent = require('https-proxy-agent');

class DataExtractor {
  constructor(proxyUrl = null) {
    this.apiEndpoint = 'https://portal.grab.com/foodweb/v2/search';
    this.requestHeaders = {
      accept: 'application/json, text/plain, /',
      'accept-language': 'en',
      'content-type': 'application/json;charset=UTF-8',
      origin: 'https://food.grab.com',
      priority: 'u=1, i',
      referer: 'https://food.grab.com/',
      'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'x-country-code': 'SG',
      'x-gfc-country': 'SG',
      'x-grab-web-app-version': '~OYFo45UHckSfgUM6xfyV',
    };
    this.proxyAgent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : null;
  }

  async fetch_data(offset) {
    const restaurantsData = [];
    try {
      const payload = JSON.stringify({
        // latlng: '1.396364,103.747462',           //      PT Singapore location
        latlng: '1.367239,103.858652',        // Chong Boon location
        keyword: '',
        offset: offset,
        pageSize: 32,
        countryCode: 'SG',
      });

      console.info('Fetching data');

      const fetchOptions = {
        method: 'POST',
        headers: this.requestHeaders,
        body: payload,
      };
      
      if (this.proxyAgent) {
        fetchOptions.agent = this.proxyAgent;
      }
      
      // fetching data
      const response = await fetch(this.apiEndpoint, fetchOptions);
      const res_json = await response.json();


      if (!res_json.searchResult?.searchMerchants) {
        console.log("---Unable to fetch Data.---");
        return restaurantsData;
      }

      console.log("---Data Fetched---", res_json);

      // Extract data for each restaurant if searchMerchants exists

      for (const restaurant of res_json.searchResult.searchMerchants) {
        try {
          const restaurant_name = restaurant.merchantBrief.displayInfo.primaryText;
          const restaurant_cuisine = restaurant.merchantBrief.cuisine.join(', ');
          const restaurant_rating = restaurant.merchantBrief.rating;
          const restaurant_est_delivery_time = restaurant.estimatedDeliveryTime ? `${restaurant.estimatedDeliveryTime} mins` : 'Not Available';
          const restaurant_distance = restaurant.merchantBrief.distanceInKm
            ? `${restaurant.merchantBrief.distanceInKm} km`
            : 'Not Available';
          const restaurant_promos = restaurant.merchantBrief.promo?.description;
          const restaurant_notice = restaurant.merchantBrief.closedText;
          const restaurant_photo = restaurant.merchantBrief.photoHref;
          const restaurant_promo_available = restaurant.merchantBrief.promo?.hasPromo ?? false;
          const restaurant_id = restaurant.id;
          const restaurant_lat_long = [restaurant.latlng.latitude, restaurant.latlng.longitude];
          const restaurant_est_delivery_fee = restaurant.estimatedDeliveryFee?.priceDisplay;

          restaurantsData.push({
            'Restaurant Name': restaurant_name,
            'Restaurant Cuisine': restaurant_cuisine ? restaurant_cuisine : "Not Available",
            'Restaurant Rating': restaurant_rating ? restaurant_rating : "Not Available",
            'Estimated time of Delivery': restaurant_est_delivery_time,
            'Restaurant Distance from Delivery Location': restaurant_distance,
            'Promotional Offers': restaurant_promos ? restaurant_promos : "Not Available",
            'Restaurant Notice': restaurant_notice ? restaurant_notice : "Not Available",
            'Image Link': restaurant_photo ? restaurant_photo : "Not Available",
            'Is promo available': restaurant_promo_available ? restaurant_promo_available : "Not Available",
            'Restaurant ID': restaurant_id ? restaurant_id : "Not Available",
            'Restaurant latitude and longitude': restaurant_lat_long ? restaurant_lat_long : "Not Available",
            'Estimated Delivery Fee': restaurant_est_delivery_fee ? restaurant_est_delivery_fee : "Not Available",
          });
        } catch (e) {
          console.error(`Error in fetching restaurant detail of: ${e}`);
        }
      }
    } catch (e) {
      console.error(`Error fetching data: ${e}`);
    }

    // console.log("---restaurantsData---", restaurantsData);

    return restaurantsData;
  }

}

module.exports = DataExtractor;