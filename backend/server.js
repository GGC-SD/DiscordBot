require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { getInactiveUsers } = require('./src/functions/inactivity');
const { PurgeHistory } = require('./src/models/purgeHistorySchema');

const app = express();
const port = 3001;

// Connect to MongoDB
mongoose.connect(process.env.databaseToken, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

app.use(cors());

app.get('/api/inactive-users', async (req, res) => {
  console.log('Received request for inactive users');
  try {
    const inactiveUsers = await getInactiveUsers();
    console.log('Sending inactive users:', inactiveUsers);
    res.json(inactiveUsers);
  } catch (error) {
    console.error('Error fetching inactive users:', error);
    res.status(500).json({ error: 'Failed to fetch inactive users' });
  }
});

// app.get('/api/purge-history', async (req, res) => {
//   console.log('Received request for purge history');
//   try {
//     const purgeHistory = await PurgeHistory.find()
//       .sort({ executionDate: -1 })
//       .limit(3)
//       .lean();
    
//     const sanitizedPurgeHistory = purgeHistory.map(entry => ({
//       username: entry.username || 'Unknown user',
//       executionDate: entry.executionDate || new Date(),
//       purgedCount: entry.purgedCount || entry.purgedUsers?.length || 0,
//       purgedUsers: Array.isArray(entry.purgedUsers) ? entry.purgedUsers : []
//     }));

//     console.log('Sending purge history:', sanitizedPurgeHistory);
//     res.json(sanitizedPurgeHistory);
//   } catch (error) {
//     console.error('Error fetching purge history:', error);
//     res.status(500).json({ error: 'Failed to fetch purge history' });
//   }
// });
app.get('/api/purge-history', async (req, res) => {
  console.log('Received request for purge history');
  try {
    const purgeHistory = await PurgeHistory.find()
      .sort({ executionDate: -1 })
      .limit(3)
      .lean({ virtuals: true });  // This ensures virtual properties are included
    
      console.log('Fetched purge history:', purgeHistory);

      const sanitizedPurgeHistory = purgeHistory.map(entry => ({
        username: entry.username || 'Unknown user',
        executionDate: entry.executionDate || new Date(),
        purgedUsers: Array.isArray(entry.purgedUsers) ? entry.purgedUsers : []
      }));
  
      console.log('Sending purge history:', sanitizedPurgeHistory);
      res.json(sanitizedPurgeHistory);
    } catch (error) {
      console.error('Error fetching purge history:', error);
      res.status(500).json({ error: 'Failed to fetch purge history' });
    }
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});