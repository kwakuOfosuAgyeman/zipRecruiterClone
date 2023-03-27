import express from "express";
const router = express.Router();
import { User } from "../Models/User";
import AppDataSource from "..";
// import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { registerUser, loginUser } from "../controllers/userController";
import { authenticateUser } from "../middleware/userMiddleware";
import { jobFilter, allJobs } from "../controllers/jobController";


// import { Company } from "../Models/Company";


router.post('/register', async(req, res) => {
    console.log(req.body);
    
    const {
        username,
        email,
        password,
        role,
    } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({where: { email }});
  
    if (existingUser) {
        res.status(401).send({ error: "Email already exists in system" });
        return;
    }
    const user = await registerUser(username, email, password, role);
    if(user.status === false){
        res.status(401).send({ error: "Invalid credentials" });
        return;
    }
    // console.log(user);
    
    res.status(201).send({success: "Created new user"});
    return;
});

router.post('/login', async(req, res) => {
    // console.log(req.body);
    
    const { email, password } = req.body;

    const login = await loginUser(email, password);

    // login.
    if(login.status === true){
        let SK = process.env.SECRET_KEY;
        // Create token
        if(SK){
            const token = jwt.sign(
                { userId: login.userData.id, email: login.userData.email },
                SK,
                { expiresIn: "1h" }
            );
            // Return token
            res.send({ userdata: login.userData, token: token });
            return;
        }else{
            res.send({"Error": "Internal Server Error. Please try again later"});
            return;
        }
    }
    res.status(401).send({ error: "Invalid credentials" });
    return;
 
});


router.get('/jobs', authenticateUser, async(req, res) => {
    const jobs = await allJobs();

    if(jobs.status){
        res.status(200).send({userData: jobs.userData});
    }else{
        res.status(401).send({error: "No jobs available. Please come back later"});
    }
    

});

router.post('/jobFilter', authenticateUser, async(req, res) => {
    const {jobName, location, description} = req.body;
    
});

router.post('/apply', authenticateUser, async(req, res) => {

    const {} = req.body;

});


router.post('/jobstatus', authenticateUser, async(req,res) => {

});

// router.post('/job:id', async(req, res))



export {
    router as createClientRouter
}