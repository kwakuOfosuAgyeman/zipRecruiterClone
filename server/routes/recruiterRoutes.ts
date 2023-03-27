import express from "express";
const router = express.Router();
import { User } from "../Models/User";
import AppDataSource from "..";
import { Company } from "../Models/Company";
import { loginRecruiter } from "../controllers/recruiterController";
// import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { registerUser } from "../controllers/userController";
import { authenticateRecruiter } from "../middleware/userMiddleware";
import { registerCompany } from "../controllers/companyController";


router.post('/register', async(req, res) => {
    console.log(req.body);
    
    const {
        username,
        email,
        password,
        role,
        company_name,
        company_location,
        company_industry,
        company_website,
    } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const companyRepository = AppDataSource.getRepository(Company);
    const existingUser = await userRepository.findOne({where: { email }});

    
  
    if (existingUser) {
        res.status(401).send({ error: "Email already exists in system" });
        return;
    }
    const user = await registerUser(username, email, password, role);
    const company = await registerCompany(company_name, company_location, company_industry, company_website);
    if(user.status === false || company.status == false){
        res.status(401).send({ error: "Unable to register new user, please try again later" });
        return;
    }
    // console.log(user);
    
    res.status(200).send({success: "Created new user"});
    return;
});

router.post('/login', async(req, res) => {
    console.log(req.body);
    
    const { email, password } = req.body;

    const login = await loginRecruiter(email, password);

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
            res.send({"Error": "Error"});
            return;
        }
    }
    res.status(401).send({ error: "Invalid credentials" });
    return;
 
});



router.post('/newJob', authenticateRecruiter, async(req, res) => {

});


router.put('/editJob', authenticateRecruiter, async(req, res) => {

});

router.delete('/deleteJob', authenticateRecruiter, async(req, res) => {

});



export {
    router as createRecruiterRouter
}