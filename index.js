const express = require("express");
const jwt = require("jsonwebtoken")

const app = express();
app.use(express.json())

const Users = []
const SECRET = "abracadabara"
const PORT_NUMBER = 3000


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
        message: "Hello from the root(/)"
    })
})


app.post(("/signup"), (req, res) => {

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
        const token = jwt.sign({
            username: userFound.username
        }, SECRET);
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
    const token = req.headers.token;
    if(token) { 
        // Now we retrieve the user according to token
        jwt.verify(token, SECRET, function (err, decoded) {
            if(err) {
                res.send({
                    message: "Invalid Request without token"
                })
            }else{
                const userFound = Users.find(u => u.token===token)
                if(userFound) {
                    res.send({
                        message: userFound
                    })
                } else {
                    res.send({
                        message: "Invalid Request without token"
                    })
                }
            }
        })
        
    }else{
        res.send({
            message: "Invalid Request without token"
        })
    }
})

app.listen(PORT_NUMBER, (e)=> {
    console.log(`Server is running bois on : http://localhost:${PORT_NUMBER}`)
});