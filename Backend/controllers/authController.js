const User = require('../models/user');



// Log in user
exports.loginUser = async (req, res) => {
  try {
    console.log("Login request:", req.body);
    const { username, password} = req.body;
    const user = await User.findOne({username : username});
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log(user);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { username, password } = req.body;
  console.log("Create user request:", req.body);
  // TO DO: Add Logic to make sure a user doesnt already exists
  console.log(User);
  const user = await User.findOne({username : username});
  if(user){
    res.status(500).json({message: 'This user already exists'});
  }
  try { 
    const newUser = new User({ username: username, password: password});
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};