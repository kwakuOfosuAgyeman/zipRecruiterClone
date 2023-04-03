import { authenticateUser } from "../middleware/userMiddleware";
import AppDataSource from "..";
import { Job } from "../Models/Job";
import { Application } from "../Models/Application";


export async function allJobs() {
    try{
        const jobRepository = await AppDataSource.manager.find(Job);

        // const jobs =(await jobRepository).toString

        
        return {status: true, userData: jobRepository};
        
    }catch(Error){
        return {status: false, userData: null};
    }
    
    
}

export async function jobFilter(jobName: string, location: string, description: string) {

    try{
        const jobRepository = AppDataSource.getRepository(Job);

        const filter = await jobRepository.findOneBy({title: jobName, location: location, description: description});

        if(filter){
            return {status: true, userData: filter};
        }
    }catch(Error){
        return {status: false, userData: null};
    }
    
    

}

export async function getJob(id: number){
    try{
        const jobRepository = await AppDataSource.getRepository(Job).findOne({
            where: {
                id: id
            },
            relations: {
                company: true,
            }
        });
        // console.log(jobRepository.company.id);
        
        return {status: true, userData: jobRepository};
    }catch(Error){
        return {status: false, userData: null};
    }
}


   