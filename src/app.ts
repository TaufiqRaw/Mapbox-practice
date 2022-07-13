import express from 'express';
import path from 'path';
import methodOverride from 'method-override';
import webRoute from './services/routes/web';
import apiRoute from './services/routes/api';
import 'dotenv/config';
const app: express.Application = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, process.env.NODE_ENV === 'development' ? '..': '', 'dist', 'views'));
app.use(express.static(path.join(__dirname, process.env.NODE_ENV === 'development' ? '..': '', 'dist', "public")))
app.use(express.json())

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.listen(process.env.PORT, ()=>{
    console.log("listening to port", process.env.PORT)
});

app.use("/", webRoute);
app.use("/api", apiRoute);