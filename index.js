import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import projectRouter from './routes/projects.route.js';
import skillRouter from './routes/skills.route.js';
import blogRouter from './routes/blogs.route.js'
import experiancesRouter from './routes/experiances.route.js';
import certificatesRouter from './routes/certificates.route.js'
import contactsRouter from './routes/contactMessage.route.js'
import ProfileInfoRouter from './routes/ProfileInfo.route.js';
import cors from 'cors'


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/profileinfo', ProfileInfoRouter)
app.use('/projects', projectRouter)
app.use('/skills', skillRouter)
app.use('/blogs', blogRouter)
app.use('/experiances', experiancesRouter)
app.use('/certificates', certificatesRouter)
app.use('/contacts', contactsRouter)




mongoose.connect('mongodb+srv://portfolio:portfoliopassword@portfolio-dev.nfru9hr.mongodb.net/?appName=portfolio-dev')
    .then((val) => {
        console.log('connected to DB successfully')
    })
    .catch((error) => {
        console.error('Database connection error:', error);
        process.exit(1);
    });

app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500)
        .json({ status: error.statusText || 'rejected', message: error.message || 'internal server error' })
})


app.listen(process.env.PORT, (error) => {
    if (error) {
        console.log('error', error)
    }
    console.log(`Server is running on ${process.env.PORT}`)
})

