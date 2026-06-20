import axiosInstance from "./axiosInstance";

/**
 * Uploads a file to Cloudinary via Spring Boot backend.
 * 
 * @param {File} file 
 * @param {String} companyId 
 * @param {String} folder (e.g., 'logos', 'resumes', 'profiles')
 * @returns {Promise<String>} Download URL of the uploaded file
 */
export const uploadCompanyMedia = async (file, companyId, folder) => {
  if (!file) return null;
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  try {
    const response = await axiosInstance.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data.url;
  } catch (error) {
    console.error("File upload failed", error);
    throw error;
  }
};
