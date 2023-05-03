const express = require('express');
var bodyParser = require('body-parser')
const axios = require('axios')

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const app = express()

app.use(urlencodedParser)
app.use(jsonParser)

const port = 3000

const users = []

// API
app.get('/joke', async (req, res) => {
    
    try {
        let jokeFromAPI = await axios.get('https://api.chucknorris.io/jokes/random')
        console.log(jokeFromAPI)
        res.send(`<h1 >${jokeFromAPI?.data.value}</h1>`)  
    } catch (error) {
        res.status(400).send(error)
    }
    
})

app.get('/users', async (req, res) => {

    res.status(200).send({users: users})

})

app.post('/addUser', async (req, res) => {

    let {name, phone, age, email} = req.body

    // name validation,
    if (name.length < 3){
        res.status(400).send('Username must be at least 5 characters long')
        return
    }

    //unique email 
    let emailExiest = users.some(user =>{
        return user.email == email
    }) 
    if (emailExiest){
        res.status(400).send('This email is already registered')
        return
    }

    // check username in the sys 
    let user = users.find(user => {
        return user.name == name
    })
    if (user != undefined) {
        res.status(400).send("this username not available")
    } else{
        users.push({name, phone, age, email})
        res.status(201).send({name, phone, age, email})
    }

})

app.get('/users/:username', async( req, res) => {

    let {username} = req.params
    let user = users.find(user => {
        return user.name == username
    })

    res.send(user != undefined)
})
app.delete('/users/:username',async(req,res)=>{
    let {username} = req.params
    let userIndex = users.findIndex(user => {
        return user.name == username
    })
    if (userIndex != -1){
        users.splice(userIndex,1)
        res.send(`User ${username} has been deleted`)
    } else{
        res.status(400).send(`User ${username} not found`)
    }
})
app.get('/users/age/:age', async( req, res) => {

    let {age} = req.params
    let user = users.find(user => {
        return user.age == age
    })

    res.send(user != undefined)
  })

app.get('/emails', async(req,res)=>{
    let emailList = users.map(emailList =>{
        return emailList.email
    })
    res.send(emailList)
})

app.get('/all/users', async(req,res)=>{
    let userName = users.map(userName =>{
        return userName.name
    })
    res.send(userName)
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
