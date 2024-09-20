const User = require('../models/user');



// Log In Logic
exports.loginUser = async (req, res) => {
  // Recieve Request from Front End
  console.log("Login request:", req.body);
  // Take the username and password out of the request body
  const { username, password} = req.body;
  
  try {
    // Try and grab the usern object if it exists in the Database
    const user = await User.findOne({username : username});
    // If username does not exists in the database or the password does not match what was in the user object referenced by the username
    if (!user || user.password !== password) {
      console.log("Invalid Login, User DNE or Username & Password do not match");
      // Return 401 Status Response and Message: "Invalid Credentials"
      return res.status(500).json({ message: 'Invalid credentials' },);
    }
    else{
      const userData = JSON.stringify(user);
      console.log("User Found and Matched password, user: ", userData);
      // Return 200 Status Response (OK) and Message: "Successful Login" 
      return res.status(200).json(userData);
    }
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { username, password } = req.body;
  console.log("Create user request:", req.body);
  const user = await User.findOne({username : username});
  console.log(user);
  // If user object is not null that means there already exists a user in the database that has that username
  if(user !== null){
    return res.status(500).json({message: 'This user already exists, Use another username!'});
  // Else, user object is null which means that there is no user that exists with that userName
  }else{
    console.log("No User found with that username, gonna try to create a new user object");
    try { 
      // Create a newUser object with the "User" schema model constructor
      const newUser = new User({ username: username, password: password});
      // Save the newUser object to the database and await the response
      await newUser.save();
      // Once newUser is saved return the 201 HTTP status code and the newUser object
      const userData = JSON.stringify(newUser);
      console.log("Returning userData:", userData); 
      return res.status(200).json(userData);
    } catch (error) {
      // Catch any errors that come up when trying to create a newUser object in the database
      return res.status(500).json({ message: error.message });
    }
  }
};