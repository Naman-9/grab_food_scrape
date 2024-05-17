const zlib = require('zlib');
const fs = require('fs');

// Method to save data to a gzip file
function saveDataToGzip(data, file_path) {
  try {
    console.info(`Saving data to: ${file_path}`);
    // Create gzip stream and write data to file
    const gzipStream = zlib.createGzip();
    const writeStream = fs.createWriteStream(file_path);
    gzipStream.pipe(writeStream);

    for (const item of data) {
      writeStream.write(JSON.stringify(item) + '\n');
    }

    gzipStream.end();  // Close gzip stream
    console.info('Data saved successfully!');
  } catch (e) {
    console.error(`Error saving data: ${e}`);
  }
}

module.exports = saveDataToGzip;
