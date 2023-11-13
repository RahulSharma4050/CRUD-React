const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");



const app = express();

app.use(express.json())
app.use(cors());

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password: '',
    database:'crud',
    port: 3307
})

app.get("/", (req, res) => {
    const sql = "SELECT * FROM student";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.status(200).json(data);
    });
});


app.post('/create', (req, res) => {
    const sql = "INSERT INTO student (Name, email) VALUES (?, ?)";
    const values = [
        req.body.name,
        req.body.email
    ];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.status(200).json({ message: "Student created successfully", result });
    });
});

app.put('/update/:id', (req, res) => {
    const sql = "UPDATE student SET Name = ?, email = ? WHERE id = ?";
    const values = [
        req.body.name,
        req.body.email,
        req.params.id
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.status(200).json({ message: "Student updated successfully", result });
    });
});


app.delete('/delete/:id', (req, res) => {
    const sql = "DELETE FROM student WHERE id = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
            // No rows were affected, meaning there is no student with the given ID
            return res.status(404).json({ error: "Student not found" });
        }

        return res.status(200).json({ message: "Student deleted successfully", result });
    });
});


app.listen(8081,() =>{
    console.log("listening");
})

