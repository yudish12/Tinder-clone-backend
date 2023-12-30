// importUsers.js

const fs = require('fs');
const mongoose = require('mongoose');

// Connection URI. Update this with your connection string.
const uri = 'mongodb://your_username:your_password@your_cluster_url/your_database_name?retryWrites=true&w=majority';

// Read the JSON file
const rawData = fs.readFileSync('path/to/your/users.json');
const usersData = JSON.parse(rawData);

// Define the User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  height: String,
  weight: Number,
  age: Number,
  gender: String,
  preference: String,
  date_type: String,
  photos: Array,
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [Number],
    address: String,
  },
  createdAt: Date,
  updatedAt: Date,
  __v: Number,
});

async function insertUsers() {
  try {
    // Connect to the database
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to the database');

    // Create the User model
    const User = mongoose.model('User', userSchema);

    // Insert the users data into the 'users' collection
    const result = await User.insertMany(usersData);
    console.log(`${result.length} users inserted successfully.`);
  } finally {
    // Disconnect from the database
    await mongoose.connection.close();
    console.log('Connection closed.');
  }
}

// Call the function to insert users
insertUsers();
