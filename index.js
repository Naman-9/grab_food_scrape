
import('node-fetch').then(({ default: fetch }) => {
  
  const saveDataToGzip = require('./src/utils/ZlibHelper');
  const { generateStatistics } = require('./src/utils/statistics');
  const DataExtractor = require('./src/api/dataExtractor');

    // Proxy URL (if needed  )
    const proxyUrl = '';


  // Start the extraction process
  async function startExtraction() {
    const extractor = proxyUrl ? new DataExtractor(proxyUrl) : new DataExtractor();
    const num_pages = 10;
    const extractedData = [];

    // Generate an array of promises for fetching data concurrently
    const promises = Array.from({ length: num_pages }, (_, i) => i * 32).map(offset => extractor.fetch_data(offset));

    try {
      const results = await Promise.all(promises);
      results.forEach(result => extractedData.push(...result));

      // save the extracted data
      // await saveDataToGzip(extractedData, 'data/Pt_Singapore_restaurant_data.gz');    // Pt_Singapore_restaurant_data
      await saveDataToGzip(extractedData, 'data/chong_boon_restaurant_data.gz');   // chong_boon_restaurant_data

      // Call the statistics function after extraction
      generateStatistics(extractedData);
      
    } catch (e) {
      console.error(`Error in extraction function: ${e}`);
    }
  }

  startExtraction();
}).catch(err => {
  console.error('Error importing node-fetch:', err);
});
