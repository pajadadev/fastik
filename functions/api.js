const express = require('express');
const serverless = require('serverless-http');
const Tiktok = require('@tobyg74/tiktok-api-dl');

const app = express();
const router = express.Router();

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files (like CSS, images) from the "public" folder
app.use(express.static('public'));

router.get('/', (req, res) => {
    res.json({
        "msg": "hello from test"
    });
});

router.post('/', async (req, res) => {
    const { url } = req.body;
  
    if (!url) {
      return res.status(400).json({ error: 'TikTok URL is required' });
    }
  
    try {
      // Menggunakan fungsi Downloader dari @tobyg74/tiktok-api-dl
      const result = await Tiktok.Downloader(url, {
        version: 'v3', // Pilihan versi: v1 | v2 | v3
        proxy: '', // Ganti dengan proxy jika diperlukan
        showOriginalResponse: true, // Hanya untuk v1
      });
  
      console.log('TikTok download result:', JSON.stringify(result, null, 2));

      // Check if result and videoSD (or other videos) exist
      if (result && result.result) {
        const videoUrl = result.result.videoSD;
        const videoHD = result.result.videoHD;
  
        if (videoUrl) {
          res.status(200).json({
            status: 'success',
            videoUrl: videoUrl,
            videoHD: videoHD,
          });
        } else {
          res.status(404).json({ error: 'No video URL found in result.result' });
        }
      } else {
        res.status(404).json({ error: 'Video not found in the result object structure' });
      }
  
    } catch (error) {
      console.error('Error downloading TikTok video:', error);
      res.status(500).json({ error: 'Failed to download TikTok video', details: error.message });
    }
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);
