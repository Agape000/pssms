const express = require('express');
const cors= require("cors")
const app = express();

app.use(cors())
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/car');
const slotRoutes = require('./routes/slots');
const recordRoutes = require('./routes/records');
const paymentRoutes = require('./routes/payments');

// Mount Routes
app.use('/auth', authRoutes);
app.use('/car', carRoutes);
app.use('/slots', slotRoutes);
app.use('/records', recordRoutes);
app.use('/payments', paymentRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
