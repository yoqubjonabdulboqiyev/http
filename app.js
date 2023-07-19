
const http = require("http");
const bodyParser = require('./utils/bodyParse')
const Oi = require("./utils/oi")
const User = require("./model/user")
const Users = new Oi("./database/user.json")

http
    .createServer(async (req, res) => {
        res.setHeader("Content-Type", "application/json");
        if (req.method === "POST" && req.url === "/users/login") {
            req.body = await bodyParser(req);

            const userName = req.body.userName;
            const password = req.body.password;

            if (!userName || !password) {
                return res.end(JSON.stringify("Malumotni toliq kiriting"))
            }

            const users = await Users.read("./database/user.json")

            const findUser = users.find((user) => user.userName == userName)
            if (!findUser) {
                return res.end(JSON.stringify("UserName Xato"))
            }
            else if (findUser && findUser.password != password) {
                return res.end(JSON.stringify("Password Xato"))
            }
            res.end(JSON.stringify(findUser))
        }
        if (req.method === "POST" && req.url === "/users/register") {
            req.body = await bodyParser(req);


            const userName = req.body.userName;
            const password = req.body.password;

            if (!userName || !password) {
                return res.end(JSON.stringify("Malumotni toliq kiriting"))
            }

            const users = await Users.read()
            const findUser = users.find((user) => user.userName == userName)

            if (findUser) {
                return res.end(JSON.stringify("UserName already exists"))
            }
            const id = (users[users.length - 1]?.id || 0) + 1;
            const person = new User(id, userName, password)
            await Users.write(users.length ? [...users, person] : [person])
            res.end(JSON.stringify(person))
        }
    }).listen(4000, "0.0.0.0", () => {
        console.log("server started");
    })

