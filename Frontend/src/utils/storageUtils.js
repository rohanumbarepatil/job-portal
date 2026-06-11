import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

/**
 * Uploads a file to Firebase Storage under a specific company path.
 * Path format: companies/{companyId}/{folder}/{fileName}
 * 
 * @param {File} file 
 * @param {String} companyId 
 * @param {String} folder (e.g., 'logo', 'banner', 'office', 'culture')
 * @returns {Promise<String>} Download URL of the uploaded file
 */
export const uploadCompanyMedia = async (file, companyId, folder) => {
  if (!file) return null;
  const fileName = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `companies/${companyId}/${folder}/${fileName}`);
  
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};
