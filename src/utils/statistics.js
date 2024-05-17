// generate statistics for extracted data

function generateStatistics(data) {
    const totalCount = data.length;
    const mandatoryFields = [
      'Restaurant Name', 'Restaurant Cuisine', 'Restaurant Rating', 'Estimated time of Delivery',
      'Restaurant Distance from Delivery Location', 'Promotional Offers', 'Image Link',
      'Is promo available', 'Restaurant ID', 'Restaurant latitude and longitude', 'Estimated Delivery Fee'
    ];
  
    const stats = { totalCount };
    mandatoryFields.forEach(field => {
      const nonNullCount = data.filter(restaurant => restaurant[field] !== "Not Available").length;
      const nullCount = totalCount - nonNullCount;
      stats[field] = { nonNullCount, nullCount };
    });
  
    console.log("Statistics of extracted data:");
    console.log(stats);
  }
  
  module.exports = { generateStatistics };
  