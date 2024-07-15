require('dotenv').config({ path: `${process.cwd()}/.env` });
const cors = require('cors');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger.json');
const testApiRouter = require('./route/testApiRoute');
const authRouter = require('./route/authRoute');
const productRouter = require('./route/productRoute');
const userRouter = require('./route/userRoute');
const dashboardRouter = require('./route/dashboardRoute');
const profileRouter = require('./route/profileRoute');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const app = express();

const corsOptions ={
  origin: 'http://localhost:3000', 
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// All routes here
app.use('/api/v1/test', testApiRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/profile', profileRouter);

app.use('*', catchAsync (async (req, res , next) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
}));

app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, () => {
  console.log('Server up and running', PORT);
});
