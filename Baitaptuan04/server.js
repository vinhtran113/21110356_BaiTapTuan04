const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/auth');
const sequelize = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/auth', routes);

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
