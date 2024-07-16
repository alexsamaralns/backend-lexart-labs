require('dotenv').config({ path: `${process.cwd()}/.env` });
const cors = require('cors');
const http = require('http');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger.json');
const authRouter = require('./route/authRoute');
const productRouter = require('./route/productRoute');
const userRouter = require('./route/userRoute');
const dashboardRouter = require('./route/dashboardRoute');
const profileRouter = require('./route/profileRoute');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const WebSocket = require('ws');
const app = express();

const corsOptions ={
  origin: process.env.ORIGIN, 
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// All routes here
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

/* const server = app.listen(PORT, () => {
  console.log('Server up and running', PORT);
}); */

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received:', message);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log('Server up and running', PORT);
});
