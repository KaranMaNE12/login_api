const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');



app.use(express.json());

// Routes
app.use(authRoutes);
app.use(userRoutes);

// Error Handling
app.use(require('./utils/errorHandler'));

const mongoURI = 'mongodb+srv://karanatworksecound:FNsUVvK89kPjbKko@cluster0.g5f9ldp.mongodb.net/';
mongoose.connect(mongoURI, {

})
.then(() => {
  console.log('MongoDB connected');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

const PORT =  process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});