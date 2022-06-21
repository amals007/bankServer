// import jsonwebtoken
const jwt = require('jsonwebtoken')
// DATABASE
db = {
  1000: { "acno": 1000, "username": "Neer", "password": 1000, "balance": 5000, transactions: [] },
  1001: { "acno": 1001, "username": "Laisha", "password": 1001, "balance": 5000, transactions: [] },
  1002: { "acno": 1002, "username": "Vipin", "password": 1002, "balance": 3000, transactions: [] }
}

//register
var register = (username, acno, password) => {

  if (acno in db) {
    return {
      status: false,
      message: "Already registered.. Please Login",
      statusCode: 401
    }
  }
  else {
    //insert in db
    db[acno] = {
      acno,
      username,
      password,
      "balance": 0,
      transaction: []
    }
    console.log(db);
    return {
      status: true,
      message: "Registered Successfully",
      statusCode: 200
    }

  }


}
const login = (acno, pswd) => {

  if (acno in db) {
    if (pswd == db[acno]["password"]) {       // if(pswd == db[acno].password)
      currentUser = db[acno]["username"]
      currentAcno = acno
      // token generation
      token = jwt.sign({ 
      // store account number inside token
      currentAcno:acno
    },'supersecretkey12345')

      return {
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
        message: "Incorrect Password",
        statusCode: 401
      }
    }
  }
  else {
    return {
      status: false,
      message: "User does not exit",
      statusCode: 401
    }
  }

}



//deposit
const deposit = (acno, password, amt) => {

  var amount = parseInt(amt)

  if (acno in db) {

    if (password == db[acno]["password"]) {
      db[acno]["balance"] += amount
      db[acno].transaction.push({
        type: "CREDIT",
        amount: amount
      })


      return {
        status: true,
        message: amount + " deposited successfully... New balance is " + db[acno]["balance"],
        statusCode: 200
      }
    }
    else {

      return {
        status: false,
        message: "Incorrect password",
        statusCode: 401
      }
    }
  }
  else {

    return {
      status: false,
      message: "user does not exist",
      statusCode: 401
    }
  }
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