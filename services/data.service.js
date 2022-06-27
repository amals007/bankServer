// import jsonwebtoken
const jwt = require('jsonwebtoken')

// import db.js
const db = require('./db')

// DATABASE
// db = {
//   1000: { "acno": 1000, "username": "Neer", "password": 1000, "balance": 5000, transactions: [] },
//   1001: { "acno": 1001, "username": "Laisha", "password": 1001, "balance": 5000, transactions: [] },
//   1002: { "acno": 1002, "username": "Vipin", "password": 1002, "balance": 3000, transactions: [] }
// }

//register
const register = (username, acno, password) => {
  // asynchronous
  return db.User.findOne({
    acno
  }).then(user => {
    console.log(user);
    if(user){
      return {
        status: false,
        message: "Already registered.. Please Login",
        statusCode: 401
      }
    }
    else{
      const newUser = new db.User({
        acno,
        username,
        password,
        balance: 0,
        transaction: []
      })
    newUser.save()
      return {
        status: true,
        message: "Registered Successfully",
        statusCode: 200
      }
    }
  })
}
 



const login = (acno, pswd) =>  {

  return db.User.findOne({
    acno,
    password:pswd
  }).then(user =>{
    if(user){
      
      currentUser = user.username
      currentAcno =acno
         // token generation
         token = jwt.sign({ 
          // store account number inside token
          currentAcno:acno
        },'supersecretkey12345')
        return{
          status: true,
          message: "Login successful",
          statusCode: 200,
          currentUser,
          currentAcno,
          token
        }
    }
    else {
      return {
        status: false,
        message: "Invalid Account Number or Password",
        statusCode: 401
      }
    }

  })
}





//deposit
const deposit = (acno, password, amt) => {

  var amount = parseInt(amt)

  return db.User.findOne({
    acno,password
  }).then(user => {
    if(user){
      user.balance += amount
      user.transaction.push({
        type: "CREDIT",
        amount: amount
    })
    user.save()
    return{
      status: true,
      message: amount + " credited successfully... New balance is " + user.balance,
      statusCode: 200

    }
  }
  else{
    return{
      status: false,
      message: "Invalid Account Number or Password!!",
      statusCode: 401
    }
  }
  })
}



const withdraw = (acno, password, amt) => {
  var amount = parseInt(amt)

  if (acno in db) {
    if (password == db[acno]["password"]) {
      if (db[acno]["balance"] > amount) {
        db[acno]["balance"] -= amount
        db[acno].transaction.push({
          type: "DEBIT",
          amount: amount
        })

        return {
          status: true,
          message: amount + " debited... your balance is " + db[acno]["balance"],
          statusCode: 200
        }
      }
      else {
        return {
          status: false,
          message: "insufficient balance",
          statusCode: 422
        }
      }
    }
    else {

      return {
        status: false,
        message: "Incorrect Password",
        statusCode: 401
      }
    }
  }
  else {

    return {
      status: false,
      message: "User does not exist ",
      statusCode: 401
    }
  }
}
// transaction
const getTransaction = (acno) => {
  if (acno in db) {

    return {
      status: true,
      statusCode: 200,
      transaction: db[acno].transaction
    }
  }
  else {
    return {
      status: false,
      statusCode: 401,
      message: "user does not exist"
    }

  }
}


//export
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction

}