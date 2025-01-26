const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const router = express.Router();

// Load exercise data from JSON file
const exerciseData = require('../data/exercises.json');

// String similarity function
const findMatchingExercise = (searchName) => {
  return exerciseData.exercises.find(exercise => {
    const exerciseName = exercise.name.toLowerCase();
    const searchTerm = searchName.toLowerCase();
    return exerciseName.includes(searchTerm) || searchTerm.includes(exerciseName);
  });
};

router.post('/exercises', async (req, res) => {
  const { exerciseNames } = req.body;
  
  if (!exerciseNames || !Array.isArray(exerciseNames)) {
    return res.status(400).json({ error: 'Invalid exercise names provided' });
  }

  try {
    // Find matching exercises and scrape their pages
    const exercises = await Promise.all(
      exerciseNames.map(async (name) => {
        const match = findMatchingExercise(name);
        
        if (!match) {
          console.log(`No match found for: ${name}`);
          return null;
        }

        try {
          console.log(`Fetching details for: ${match.name}`);
          const response = await axios.get(match.url);
          const $ = cheerio.load(response.data);
          
          // Updated image selection logic
          let gifUrl = $('img.gb-image-69e60ead').attr('data-lazy-src') || // Try lazy-loaded source
                      $('img.gb-image-69e60ead').attr('src') || // Try direct source
                      $('figure img[src*=".webp"]').attr('src') || // Try webp images
                      $('figure img[src*=".gif"]').attr('src'); // Try gif images

          // Filter out SVG placeholders
          if (gifUrl && gifUrl.includes('data:image/svg+xml')) {
            gifUrl = null;
          }

          if (!gifUrl) {
            console.log(`No valid image found for: ${match.name}`);
          } else {
            console.log(`Found image URL: ${gifUrl}`);
          }
          
          return {
            name: match.name,
            gifUrl: gifUrl,
            link: match.url
          };
        } catch (error) {
          console.error(`Error scraping ${match.name}:`, error);
          return null;
        }
      })
    );

    const validExercises = exercises.filter(ex => ex !== null && ex.gifUrl);
    console.log(`Successfully processed ${validExercises.length} exercises`);
    res.json(validExercises);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

// Add GET route
router.get('/exercises', (req, res) => {
  res.json({
    message: 'Exercise API is working',
    availableEndpoints: {
      'POST /api/exercises': 'Get exercise recommendations'
    }
  });
});

module.exports = router;