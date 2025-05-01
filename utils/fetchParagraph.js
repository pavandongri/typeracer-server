const axios = require('axios');

const fetchParagraph = async () => {
  try {
    const response = await axios.get(process.env.PARAGRAPH_URL);
    return response.data.join(' ');
  } catch (err) {
    console.error('Error fetching paragraph:', err);
    return 'Error loading paragraph.';
  }
};

module.exports = fetchParagraph;
