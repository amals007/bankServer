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
const deposit = (req,acno, password, amt) => {

  var amount = parseInt(amt)

  return db.User.findOne({
    acno,password
  }).then(user => {
    if(user){
      if(acno != req.currentAcno){
        return{
          status: false,
          message: 'Permission Denied',
          statusCode:  '401'
        }
      }


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



const withdraw = (req,acno, password, amt) => {
  var amount = parseInt(amt)

  return db.User.findOne({
    acno,password
  }).then(user => {
    if(user){
      if(acno != req.currentAcno){
        return{
          status: false,
          message: 'Permission Denied',
          statusCode:  '401'
        }
      }

      if(user.balance > amount){ 
      user.balance -= amount
      user.transaction.push({
        type: "DEBIT",
        amount: amount
    })
    user.save()
    return{
      status: true,
      message: amount + " debited successfully... New balance is " + user.balance,
      statusCode: 200

    }
  }
  else{
    return{
      status: false,
      message: "Insufficient Balance",
      statusCode: 401
    }
  }
  }
  else{
  return { 
    status: false,
    message: "Invalid account number or password",
    statusCode: 401}
  }
})

}
// transaction
const getTransaction = (acno) => {

  return db.User.findOne({
    acno
  }).then(user =>{
    if(user){
      return {
        status: true,
        statusCode: 200,
        transaction: user.transaction
      }
    }
    else{
      return{
        status: false,
        message: "User does not exist",
        statusCode: 401
      }
    }
  })
}

// delete
const deleteAcc = (acno) =>{
  return db.User.deleteOne({
    acno
  }).then(user=>{
    if(!user){
      return{
        status: false,
        message:"Operation Failed!!",
        statusCode: 401
      }
    }
    return{
      status:true,
      statusCode:200,
      message:"Successfully deleted"
    }
  })
}




//export
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction,
  deleteAcc

}