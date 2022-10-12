const express = require('express')
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

console.log(salt);
const password = "suzana";


const app = express();
const port = 5000

app.use(express.json({limit: '5kb'}))  
app.use(express.urlencoded())

const DB = {
  users:[],
  admin:[]
}

function displayHome (req, res) {
  res.send('Hello World!')
}

//DB get User
function getUser(req,res) {
const users = [{
    name: 'john',
    age: 43
}]

res.status(200).json({status: 'success', data: DB.users})
}

//DB get admin
function getAdmin(req,res) {
  const users = [{
      name: 'john',
      age: 43
  }]
  
  res.status(200).json({status: 'success', data: DB.admin})
  }
  


// function createUser(req,res) {
//   const user = req.body
//   console.log(user)

//   //logic for creating a new user
//   DB.users.push(user)
//   res.status(201).json({status:'success', message:'User created successfully'})
// }

function createAdmin(req,res) {
  const admin = req.body
  console.log(admin)

  //logic for creating a new user
  DB.admin.push(admin)
  res.status(201).json({status:'success', message:'User created successfully'})
}

//Ckecking if user is existing before creating new user
function createUser(req,res){
  const newUser = req.body


  const userIndex = DB.users.findIndex(user => {
    return user.email === newUser.email
  })
  
  if(userIndex > -1){
    res.status(400).json({
      success: false,
      message: "User already exist"
    })
  }else{

    const passwordHash = bcrypt.hashSync(newUser.password, salt);
    newUser.password = passwordHash;

    //create new user
    DB.users.push(newUser)
    res.status(201).json({
      success: true,
      message: "User created successfully"
    })
  }
  
}

// Login user function
const loginUser = (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.send("email or password required");
    }
  
    const userDB = DB.users.filter((user) => user.email === email);
  
    if (userDB.length === 0) return res.send("No users found");
  
    // Comparing passwords
    const isValid = bcrypt.compareSync(password, userDB[0].password);
  
    if (isValid) {
      const token = jwt.sign({ email }, secretKey, {
        expiresIn: "120000ms",
      });
  
      userDB.token = token;
  
      res.status(200).send({
        message: "Authentication successful, User logged in",
        data: userDB,
        token: token,
      });
    } else {
      return res.send("Authentication failed, wrong email or password");
    }
  };



//display the base route
app.get('/', displayHome)

//gets all user
app.get('/user', getUser)

//get admin
app.get('/admin', getAdmin)

//create user
app.post('/create', createUser)

//create admin
app.post('/admin', createAdmin)

//login
app.post('/login', loginUser)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})