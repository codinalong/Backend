const db = require('../../db/knex')
const bcrypt = require('bcrypt')


function getAll(){
  return db('users')
}


//looks up user in database and gives you back entire colomn back in response
function getOneByUserName(username){
    return (
      db('users')
      .where({ username })
      .first()
    )
  }

  function getOne(id){
    return (
      db('users')
      .where({id})
      .first()
    )
  }

 

// Create a user
// 1. Check to see if user already exists
//   a. if so, return a 400 with appropriate error message
// 2. Hash password
// 3. Insert record into database
// 4. strip hashed password away from object
// 5. "return/continue" promise

function createUser(username, password){
    // check to see of user already exists
  return getOneByUserName(username)
  .then(function(data){
    // if user already exists, return 400
    if(data) throw { status: 400, message:'User already exists'}

    // hash password
    return bcrypt.hash(password, 10)
  })
  .then(function(hashedPassword){
  // 3. Insert record into database
    return (
      db('users')
      .insert({ username, password: hashedPassword })
      .returning('*')
    )
  })
  .then(function([ data ]){
    // 4. strip hashed password away from object
    delete data.password
    // 5. "return/continue" promise
    return data
  })

}

module.exports = {
    getAll,
    getOne,
    getOneByUserName,
    createUser,
  }