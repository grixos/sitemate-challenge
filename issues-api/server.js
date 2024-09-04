const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');

app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('Request body:', req.body);
    }
    next();
});

app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
        console.log('Response body:', body);
        originalSend.call(this, body);
    };
    next();
});

let issues = [];
let nextId = 1;

app.post('/issues', (req, res) => {
    const newIssue = { id: nextId++, ...req.body };
    issues.push(newIssue);
    res.status(201).json(newIssue);
});

app.get('/issues', (req, res) => {
    res.json(issues);
});

app.put('/issues/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedIssue = req.body;
    const issueIndex = issues.findIndex(issue => issue.id === id);

    if (issueIndex !== -1) {
        issues[issueIndex] = { ...issues[issueIndex], ...updatedIssue };
        res.json(issues[issueIndex]);
    } else {
        res.status(404).send('Issue not found');
    }
});

app.delete('/issues/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const issueIndex = issues.findIndex(issue => issue.id === id);

    if (issueIndex !== -1) {
        issues.splice(issueIndex, 1);
        res.status(204).send(); 
    } else {
        res.status(404).send('Issue not found');
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
