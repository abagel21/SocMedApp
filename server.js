const express = require('express');
const connectDB = require('./config/db')
const path = require('path')

const app = express();

connectDB();

//Init middleware
app.use(express.json({ extended: false }));

//Define Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/auth', require('./routes/api/auth'))

/*"heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client"*/

//Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    //Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('server started')
})