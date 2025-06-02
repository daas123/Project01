const express = require('express');
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;
const fs = require('fs');
const { json } = require('stream/consumers');

//middelwhere - plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    fs.appendFile("log.text", `${Date.now()} : ${req.method} : ${req.path} : ${req.ip}\n`,
        (err, data) => {
            next();
        }
    );
});

app.use((req, res, next) => {
    req.userFirstName = "Saad";
    next();
});
app.use((req, res, next) => {
    console.log("ehello form middle wahere 2", req.userFirstName);
    next();
});

app.get('/users', (req, res) => {
    const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html)
});

// routes
app.get("/api/users", (req, res) => {
    res.setHeader("X-serverowner","Saad")
    console.log(req.userFirstName)
    return res.json(users)
});

//creating new users
app.post("/api/users", (req, res) => {
    const body = req.body;
    if (!body || !body.first_name || !body.last_name || !body.email || !body.gender){
        return res.status(400).json({ status : "Eneter valid parameter"});
    }
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        return res.status(201).json({ stauts: "Success", id: users.length });
    })
});

///dynamic path Parameter (:id)
app.route('/api/users/:id')
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        if (!user){
            return res.status(404).json({ msg: "No User Found"})
        }
        return res.json(user);
    })
    .patch((req, res) => {

        return res.json({ status: "pending" });
    })
    .delete((req, res) => {
        // delete user
        return res.json({ status: "pending" });
    })


app.listen(PORT, () => console.log(`server start at port ${PORT}`));