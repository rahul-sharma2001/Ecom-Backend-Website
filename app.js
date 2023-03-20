const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const routers = require('./routes/index');
require('dotenv').config();
const config = require('./constants/config');

const app = express();
const port = process.env.PORT || config.SERVER_PORT;

const options = {
  origin: '*',
  methods:['GET','POST','PUT','PATCH'],
  Credential:true,
}
app.use(cors())
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

app.listen(port, () => {
  console.log(`server started at the port localhost:${port}`);
});

