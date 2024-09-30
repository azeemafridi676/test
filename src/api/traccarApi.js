// src/api/traccarApi.js
const axios = require('axios');

/**
 * Traccar API Client
 */
const traccarApi = axios.create({
  baseURL: 'http://192.168.0.103:8082/api', // Replace with your Traccar server IP and port
  auth: {
    username: 'admin',          // Replace with your Traccar username
    password: 'admin'           // Replace with your Traccar password
  },
  timeout: 5000 // 5 seconds timeout
});

/**
 * Fetch the latest position of a specific device.
 * @param {string} deviceId - The unique identifier of the device.
 * @returns {Promise<Object>} - The latest position data.
 */
async function getLatestPosition(deviceId) {
  try {
    const response = await traccarApi.get(`/positions?deviceId=${deviceId}&limit=1`);
    if (response.data.length > 0) {
      return response.data[0];
    } else {
      throw new Error('No position data found for the device.');
    }
  } catch (error) {
    console.error('Error fetching latest position:', error.message);
    throw error;
  }
}

module.exports = {
  getLatestPosition
};