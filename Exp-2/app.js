const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;



// ✅ Static files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ View engine setup
app.engine('hbs', require('express-handlebars').engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
// ✅ Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// ✅ Temp store
let tempStudent = {};

app.post('/test', (req, res) => {
    console.log("✅ TEST route hit:", req.body);
    res.send("Test OK");
});


// Step 1 - show form
app.get('/', (req, res) => {
    res.render('step1');
});

// Step 2 - handle form data
app.post('/step2', (req, res) => {
    console.log("🟡 DEBUG req.body =", req.body);  // should print when Step 1 form is submitted

    const { name, roll } = req.body;

    tempStudent.name = name;
    tempStudent.roll = roll;

    res.render('step2');
});

// Step 3 - submit marks
app.post('/submit', (req, res) => {
    tempStudent.marks = {
        math: req.body.math,
        science: req.body.science,
        english: req.body.english
    };

    const filePath = path.join(__dirname, 'data', 'student.json');
    fs.writeFileSync(filePath, JSON.stringify(tempStudent, null, 4));
    res.redirect('/student');
});

// Show student
app.get('/student', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'student.json');
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        const student = JSON.parse(data);
        res.render('student', { student });
    } else {
        res.send("No student data found.");
    }
});

// Start
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
