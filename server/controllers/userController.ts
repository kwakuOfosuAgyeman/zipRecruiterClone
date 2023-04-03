import { User } from "../Models/User";
import AppDataSource from "../index";
import * as bcrypt from "bcryptjs";
import { Application } from "../Models/Application";
import { Resume } from "../Models/Resume";

export async function registerUser(
  username: string,
  email: string,
  password: string,
  role: string
): Promise<{ status: boolean; userData: any }> {
  try {
    const newUser = new User();
    newUser.email = email;
    newUser.username = username;
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    newUser.password = password;
    newUser.role = role;
    const userRepository = AppDataSource.getRepository(User);
    userRepository.save(newUser);
    return { status: true, userData: userRepository };
  } catch (Error) {
    return { status: false, userData: null };
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ status: boolean; userData: any }> {
  try {
    // Find user by email
    const user = AppDataSource.getRepository(User);
    const userData = await user.findOneBy({ email: email });

    // Check password
    if (!userData || !bcrypt.compareSync(password, userData.password)) {
      return { status: false, userData: "Invalid credentials" };
    }
    return {
      status: true,
      userData: {
        id: userData.id,
        email: userData.email,
        username: userData.email,
        type: userData.role,
      },
    };
  } catch (Error) {
    return { status: false, userData: Error };
  }
}

export async function applyForJob(
  status: string,
  userID: number,
  jobId: number,
  resumeData: {
    name: string;
    email: string;
    education: string;
    workExperience: string;
    skills: string;
    filename: string;
  }
) {
  try {
    const resume = await newResume(resumeData, userID);
    if (resume.status === false) {
      return { status: false, userData: resume.userData };
    }

    const applicationRepository = AppDataSource.getRepository(
      Application
    ).create({
      status: status,
      job: {
        id: jobId,
      },
      resume: {
        id: resume.userData.id as number,
      },
    });

    const application = await AppDataSource.getRepository(Application).save(applicationRepository);
    if (application) {
      return { status: true, userData: "Applied" };
    }
    return { status: false, userData: "Unable to add new Application" };
  } catch (Error) {
    return { status: false, userData: Error };
  }
}

async function newResume(
  resume: {
    name: string;
    email: string;
    education: string;
    workExperience: string;
    skills: string;
    filename: string;
  },
  userID: number
): Promise<{ status: boolean; userData: any }> {
  try {
    const newResume = AppDataSource.getRepository(Resume).create({
      name: resume.name,
      email: resume.email,
      education: resume.education,
      skills: resume.skills,
      user: {
        id: userID,
      },
      filename: resume.filename,
    });

    const myResume = await AppDataSource.getRepository(Resume).save(newResume);

    return { status: true, userData: newResume };
  } catch (Error) {
    return { status: false, userData: Error };
  }
}

export async function getMyApplications(userId: number) {
  try {
    const applicationRepository = await AppDataSource.getRepository(
      Application
    ).find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        job: true,
        resume: true,
      },
    });
    return { status: true, userData: applicationRepository };
  } catch (Error) {
    return { status: false, userData: false };
  }
}
