import express, {Express, Request, Response} from "express";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./Models/User";
import { Resume } from "./Models/Resume";
import { Job } from "./Models/Job";
import { Company } from "./Models/Company";
import { Application } from "./Models/Application";
import { createClientRouter } from "./routes/clientRoutes";
import cors from 'cors';

// import * as jwt from "jsonwebtoken";
// import * as bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config()

const port: number = 8000;

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: '*'
}));
app.use('/api/user', createClientRouter);

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "zip_recruit",
    entities: [User, Company, Job, Resume, Application],
    synchronize: true,
});

AppDataSource.initialize()
    .then(() => {

    })
    .catch((error) => console.log(error));

export default AppDataSource;


try{
    app.listen(port, () => {
        console.log(`now listening to port ${port}`);
    });

}catch(Error ){
    console.log(Error);
    
}
