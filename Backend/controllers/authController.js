const User = require('../models/user');

const JWT = require("jsonwebtoken");
const Crypto = require("argon2");

const SECRET_KEY = process.env.JWT_SECRET;

// Used as first function before accessing any protected information. Authenticate JWT logic
exports.authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
      req.log.info("No token provided when trying to authenticate JWT");
      return res.status(403).json({ message: "No token provided" });
  }

  JWT.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Unauthorized" });
      req.log.info(decoded, "Decoded token found")
      req.userID = decoded.id;
      next();
  });
};

// Used as a function to use after a failed JWT authentication
exports.refreshToken = (req,res) => {
  const refreshToken = req.cookies.refreshToken;

  // If no refresh token, return error
  if (!refreshToken){
    req.loq.info("No refresh token provided for refreshToken() function");
    return res.status(401).json({message: "No refresh token"})
  }
  // If refresh token, verify that it is valid: if so generate newAccesToken else return error message
  else{
    JWT.verify(refreshToken, SECRET_KEY, (err,decoded) => {
      if (err) { 
        return res.status(403).json({message: "Invalid refresh token"});
      } 
      else{
        const newAccessToken = JWT.sign({id: decoded.id}, SECRET_KEY, { expiresIn: "15m" });
        return res.json({accessToken: newAccessToken});
      }
    })
  }
}

// Log In Logic
exports.loginUser = async (req, res) => {
  // Recieve Request from Front End
  req.log.debug("Request recieved for loginUser function:", req.body);
  // Take the username and password out of the request body
  const { username, password } = req.body;
  req.log.info({username, password}, "Login Attempt for User:");
  
  try {
    // Try and grab the user object if it exists in the Database
    const user = await User.findOne({username : username});

    // const passwordHash = await Crypto.hash(user.password);

    if (!user || !await Crypto.verify(user.password, password)) {
      req.log.info("Invalid Login Attempt for User");
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    else{
      // Return 200 Status Response (OK) and user object as a json
      req.log.info(SECRET_KEY, "Successful Login for User, Generating access and refresh token");
      // Generate access & refresh tokens
      const accessToken = JWT.sign({ id: user._id }, SECRET_KEY, { expiresIn: "15m" });
      const refreshToken = JWT.sign({ id: user._id }, SECRET_KEY, { expiresIn: "7d" });
       
      res.cookie("refeshToken", refreshToken,{ 
        httpOnly: true
      })
      return res.status(200).json({ accessToken });
    }
  } catch (error) {
      // Catch any errors that may have happened while trying to log in
      req.log.error({ error }, 'Error Logging in to User Account'); 
      return res.status(500).json({ message: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  // Receive request from Front End
  req.log.debug("Request received for createUser function:", req.body);
  // Take the username and password out of the request body
  const { username, password, firstName, lastName} = req.body;
  req.log.info({ username, password, firstName, lastName}, "Create User Attempt for User:");
  try{
    // Try to look for a user in the database that has a matching username to request username
    const user = await User.findOne({username : username});
    // If user object is not null (user with that username already exists) Return Invalid Input Code
    if(user !== null){ 
      req.log.info("Invalid Create User Attempt for User");
      return res.status(400).json({message: 'This user already exists, Use another username!'}); 
    }
    else{
      const passHash = await Crypto.hash(password);
      const newUser = await new User({firstName: firstName, lastName: lastName, username: username, password: passHash}).save();
      
      // Create a newUser object with the "User" schema model constructor and save it to the database
      // Return 200 Status Response (OK)
      req.log.info(newUser._id, "Successful User Creation, Generating access and refresh token");

      // Generate access & refresh tokens
      const accessToken = JWT.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: "15m" });
      const refreshToken = JWT.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: "7d" });
      
      res.cookie("refeshToken", refreshToken,{ 
        httpOnly: true
      })
      return res.status(200).json({ accessToken });
    }
  }
  catch (error) {
    // Catch any errors that come up when trying to create a newUser object in the database or look for existing users objects with the request username
    req.log.error({ error }, 'Error creating user account');
    return res.status(400).json({ message: error.message });
  }
};