const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const routers = require('./routes/index');
const productRouters = require('./routes/product');
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

// app.get('/hello',(req,res)=>{
//     res.send('hii')
// })

app.use('/api', routers);
app.use('/api/v1/product', productRouters);
app.listen(port, () => {
  console.log(`server started at the port localhost:${port}/api/v1/user`);
});
