console.log("Hey suar. wassup!");


const express = require("express");
const app = express();
app.use(express.json())

const Users = []


const generateToken = function() {
    // Here we have to 32 characters token 

    let inputSpace = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5']

    token = "";

    for (let index = 0; index < inputSpace.length; index++) {
        // Pick a random character from the input space
        let randomIndex = Math.floor(Math.random()*inputSpace.length);

        token += inputSpace[randomIndex]
    }

    return token

}

app.get(("/"),(req, res) => {
    res.send({
        message: "fuck you boi"
    })
})


app.post(("/signup"), (req, res) => {
    console.log("Recieved a post request for signup", req.body);
    // here the user gets pushed on to the user's array


    const username = req.body.username;
    const password = req.body.password;

    if(username && password) {
        Users.push({username, password});
        res.send({
            message: "Signup Complete"
        })
    }else{
        res.send({
            message: "Invalid signup request"
        })
    }

})

app.post(("/signin"), (req, res) => {

    console.log("Recieved a post request for signin")

    const username = req.body.username;
    const password = req.body.password;

    const userFound = Users.find(u => {
        if(u.username == username && u.password == password){
            return true
        }else {
            return false
        }
    }) 

    if(userFound){
        const token = generateToken();
        userFound.token = token;
        res.send({
            message: "Sign in successfull",
            token,
        })
    }else{
        res.send({
            message: "No user found",
        })
    }
})

app.get("/me", (req, res)=> {

    // In the protected request, we need to validate the token

    const token = req.headers.token;

    if(token) { 
        // Now we retrieve the user according to token
        const userFound = Users.find(u => u.token===token)
        if(userFound) {

            res.send({
                message: userFound
            })
        }else {

            res.send({
                message: "Invalid Request without token"
            })
        }
    }else{
        res.send({
            message: "Invalid Request without token"
        })
    }
})

let port_number = 3000

app.listen(3000, (e)=> {
    console.log(`Server is running bois on : http://localhost:${port_number}`)
});