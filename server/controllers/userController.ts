import { User } from "../Models/User";
import AppDataSource from "../index";
import * as bcrypt from 'bcryptjs';
import { Application } from "../Models/Application";
import { Resume } from "../Models/Resume";

export async function registerUser(username: string, email: string, password: string, role: string): Promise<{status: boolean, userData: any}>{
    try{
        const newUser = new User();
        newUser.email = email;
        newUser.username = username;
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt);
        newUser.password = password;
        newUser.role = role;
        const userRepository = AppDataSource.getRepository(User);
        userRepository.save(newUser);
        return {status: true, userData: userRepository};
    }catch(Error){
        return {status: false, userData: null};
    }
   
    
}

export async function loginUser(email: string, password: string): Promise<{ status: boolean, userData: any }>{
    try {
        // Find user by email
        const user = AppDataSource.getRepository(User);
        const userData = await user.findOneBy({email: email});

        // Check password
        if (!userData || !bcrypt.compareSync(password, userData.password)) {
            return {status: false, userData: "Invalid credentials"};
        }
        return {status: true, userData: userData};
    }catch(Error){
        return {status: false, userData: Error};
    } 
}

export async function applyForJob(status: boolean, userID: number, jobId: number, resumeData: {name: string, contactInfo: string, education: string, workExperience: string, skills: string, filename: string }) {
    try{
        const resume = newResume(resumeData, userID);

        
        // const application = AppDataSource.getRepository(Application).create({
        //     status: status,
        //     // job: {
        //     //     id: jobId,
        //     // },
        //     // resume: {id: resumeID}
        // });


    }catch(Error){

    }
}


async function newResume(resume: {name: string, contactInfo: string, education: string, workExperience: string, skills: string, filename: string }, userID: number) {
    try{
        const newResume = AppDataSource.getRepository(Resume).create({
            name: resume.name,
            contactInfo: resume.contactInfo,
            education: resume.education,
            skills: resume.skills,
            user: {
                id: userID,
            },
            filename: __filename,
            
        });


        // return {status: true, data: }
    }catch(Error){
        return {status: false, userData: "Unable to create new Resume"};
    }
}






