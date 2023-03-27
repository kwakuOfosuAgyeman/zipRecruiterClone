

import * as bcrypt from 'bcryptjs';
import AppDataSource from '..';
import { User } from '../Models/User';
import { Application } from '../Models/Application';
import { Job } from '../Models/Job';
import { Company } from '../Models/Company';


export async function loginRecruiter(email: string, password: string): Promise<{ status: boolean, userData: any }>{

    try {
        // Find user by email
        const user = AppDataSource.getRepository(User);
        const userData = await user.findOneBy({email: email});

        // Check password
        if (!userData || !bcrypt.compareSync(password, userData.password)) {
            return {status: false, userData: "Invalid Credentials"};
        }
        return {status: true, userData: userData};
    }catch(Error){
        return {status: false, userData: Error};
    } 
}

export async function myJobs(id: number) {
    try{
        const companyRepository = AppDataSource.getRepository(Company).find({
            where: {
                owner: {id: id}
            }
        });

        return {status: true, userData: companyRepository};
        

    }catch(Error){
        return {status: false, userData: Error};
    }
}

export async function applications(jobID: number) {
    try{
        const applicationRepository = AppDataSource.getRepository(Application);
        const applications = await applicationRepository.find({
            where: {
                job: {id: jobID}
            }
        });

        if(applications){
            return {status: true, userData: applications};
        }
        
    }catch(Error){
        return {status: false, userData: Error};
    }
} 


export async function viewApplication(applicationID: number){
    try{
        const application = await AppDataSource.getRepository(Application).findOneByOrFail({id: applicationID});

        return {status: true, userData: application};
    }catch(Error){
        return {status: false, userData: Error};
    }
}

export async function newJob(title: string, description: string, location: string, salary: number, requirements: string, companyID: number) {
    try{
        const jobRepository = AppDataSource.getRepository(Job);

        const companyRepository = await AppDataSource.getRepository(Company).findOneByOrFail({id: companyID});
        

        const newJob = jobRepository.create({
            title: title,
            description: description,
            location: location,
            salary: salary,
            requirements: requirements,
            company: companyRepository,
        });

        return {status: true, userData: "Created Successfully"};
    }catch(Error){
        return {status: false, userData: Error};
    }
}

export async function editJob(jobId: number) {
    try{
        const jobRepository = await AppDataSource.getRepository(Job).findOneByOrFail({id: jobId});

        return {status: true, userData: jobRepository};
    }catch(Error){
        return {status: false, userData: Error};
    }
}

export async function deleteJob(jobID: number) {
    try{
        const jobRepository = await AppDataSource.getRepository(Job).delete({id: jobID});
        return {status: true, userData: "Deleted Successfully"};
    }catch(Error){
        return {status: false, userData: Error};
    }
}