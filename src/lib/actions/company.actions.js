import { ID } from "appwrite";
import { databases, storage } from "../appwrite"


const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;
const COMPANY_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COMPANY_COLLECTION_ID

export const fetchCompanyDetails = async (companyId) => {
  try {
    const company = await databases.getDocument(
      DATABASE_ID,
      COMPANY_COLLECTION_ID,
      companyId
    );

    if (company.companyLogo) {
      const doc = {
        ...company,
        companyLogo: storage.getFileView(BUCKET_ID, company.companyLogo), // fixed field
      };
      return doc;
    }
    if(!company) throw new Error('Comapny not fetch')
    return company;
  } catch (error) {
    console.error("Error fetching company details:", error);
    throw new Error(error.message || "Fetching company failed. Try again.");
  }
};


export const updateCompanyInfo = async (companyId, imgFile, name) => {
    try {
      if(name && imgFile){
        const uploded = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          imgFile
        )
        const imgUrl = uploded.$id
        const uptCompany = await databases.updateDocument(
            DATABASE_ID,
            COMPANY_COLLECTION_ID,
            companyId,
            {companyLogo: imgUrl, name}
        )

       if(uptCompany) return {success: true, message: 'Company Logo and Name Updated'}

      }else if(imgFile && !name){
        const uploded = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          imgFile
        )
        const imgUrl = uploded.$id
        const uptComapny = await databases.updateDocument(
            DATABASE_ID,
            COMPANY_COLLECTION_ID,
            companyId,
            {comapanyLogo: imgUrl}
        )
        if(uptComapny) return {success: true, message: 'Company Name Uplaoded'}
      }else{
         const uptComapny = await databases.updateDocument(
            DATABASE_ID,
            COMPANY_COLLECTION_ID,
            companyId,
            {companyLogo: imgUrl, name}
        )
        if(uptComapny) return {success: true, message: 'Company Logo Uplaoded'}
      } 
    } catch (error) {
       console.log(error)
       throw new Error("Updateing Conpany Failed, Try Agin") 
    }
}