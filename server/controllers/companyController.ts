// import { User } from "../Models/User";
import { Company } from '../Models/Company';
import AppDataSource from "../index";
// import { Repository } from "typeorm";
// import * as bcrypt from 'bcryptjs';

export async function registerCompany(name: string, location: string, industry: string, company_website: string): Promise<{status: boolean, userData: any}>{
    try{
        const company = new Company();
        company.name = name;
        company.location = location;
        company.industry = industry;
        company.website = company_website;
        const companyRepository = AppDataSource.getRepository(Company);
        companyRepository.save(company);
        return {status: true, userData: companyRepository};
    }catch(Error){
        return {status: false, userData: null};
    }
   
    
}


export async function viewCompany(companyID: number) {
    const company = await AppDataSource.getRepository(Company);
    const companyData = company.findOneBy({id: companyID});

    return {status: true, userData: companyData};

    
}

export async function update(companyID: number, name: string, location: string, industry: string, company_website: string) {
    try{

        await AppDataSource
            .createQueryBuilder()
            .update(Company)
            .set({ name: name, location: location, industry: industry, website: company_website })
            .where("id = :id", { id: companyID })
            .execute()

        return {status: true, userData: "Successfully updated"};
    }catch(Error){
        return {status: false, userData: null};
    }
}







