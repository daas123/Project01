const express = require('express');
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;

//middelwhere - plugin
app.use(express.urlencoded({ extended : false}));
app.get('/users', (req,res) => {
    const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html)
});

// routes
app.get("/api/users", (req,res) => {
    return res.json(users)
});

//creating new users
app.post("/api/users",(req,res) => {
    const body = req.body;
    console.log("body",body)
    return res.json({ stauts : "pending"});
});

///dynamic path Parameter (:id)
app.route('/api/users/:id')
.get((req,res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
})
.patch((req,res) => {
    //edit User
    return res.json({ status: "pending"});
})
.delete((req,res) => {
    // delete user
    return res.json({ status: "pending"});
})


app.listen(PORT,() => console.log(`server start at port ${PORT}`));