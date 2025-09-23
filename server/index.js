import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {configurePassport} from './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import customerProfileRoutes from './routes/customerProfileRoutes.js';
import adminProfileRoutes from './routes/adminProfileRoutes.js'
import kycRoutes from './routes/kycRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import restaurantsListRoutes from './routes/restaurantsListRoutes.js'
import menuListRoutes from './routes/menuListRoutes.js'
import categoryRoutes from './routes/categoriesRoutes.js'
import foodCourtRoutes from "./routes/foodCourtRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import adminAvailabilityRoutes from "./routes/adminAvailabilityRoutes.js";

const app = express();
const port = 3000;

dotenv.config();

app.use(cors({
  origin: 'http://localhost:5173', // React frontend
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: 'sessionsecret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
configurePassport(passport);

app.use('/api/auth', authRoutes);
app.use('/customer/profile', customerProfileRoutes);
app.use('/admin/profile', adminProfileRoutes);
app.use('/restaurants/data', restaurantsListRoutes);
app.use('/restaurants/menu', menuListRoutes);
app.use('/restaurants/menuCategories', categoryRoutes);

app.use('/api/restaurant/kyc', kycRoutes);

app.use('/api/audit', auditRoutes);

app.use("/api/food-court", foodCourtRoutes);

app.use("/api/reservations/availability", availabilityRoutes);  // public
app.use("/api/admin/availability", adminAvailabilityRoutes);    // admin

app.listen(port, () => {
    console.log(`Server running on port ${3000}`);
})

