const User = require('../models/user');

// Log in user
exports.loginUser = async (req, res) => {
  try {
    const { username, password} = req.body;
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log(user);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { username, password } = req.body;
  // TO DO: Add Logic to make sure a user doesnt already exists
  const user = await User.findById(({username: username}));
  if(user){
    res.status(500).json({error: 'This user already exists'});
  }
  try { 
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};