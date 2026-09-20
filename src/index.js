// import cors from "cors";
const express = require('express');
const authRoutes = require('./routes/auth.routes');
const cameraRoutes = require("./routes/camera.routes");
const reportRoutes = require("./routes/report.routes");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

const path = require("path");

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors());
app.use(
    "/streams",
    express.static(
        path.join(process.cwd(), "streams")
    )
);
// app.use(
//   cors({
//     origin: [
//       "https://myapp.com",
//       "https://admin.myapp.com",
//     ],
//   })
// );

// Everything in auth.routes.js is now prefixed with /api/auth
// So your URLs will be: /api/auth/login, /api/auth/register, /api/auth/admin
app.use('/api/auth', authRoutes);

app.use("/api/cameras", cameraRoutes);
app.use(
    "/api/reports",
    reportRoutes
);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));