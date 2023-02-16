const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const routers = require('./routes/index');
const addressRouters = require('./routes/address')

require('dotenv').config();
const config = require('./constants/config');
// const routes = require('./routes');

const app = express();
const port = process.env.PORT || config.SERVER_PORT;

app.use(morgan('dev'));

mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' mongoose database connected....');
  })
  .catch(err => {
    console.log('err ===', err);
  });

app.use(express.json());


app.use('/api', routers);
app.use('/address/api', addressRouters)

app.listen(port, () => {
  console.log(`server started at the port localhost:${port}/api/v1/user`);
});
