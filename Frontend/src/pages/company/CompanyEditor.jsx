import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { uploadCompanyMedia } from '../../utils/storageUtils';
import toast from 'react-hot-toast';

export default function CompanyEditor() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMyCompany();
  }, []);

  const fetchMyCompany = async () => {
    try {
      const res = await axiosInstance.get('/companies/me');
      if (res.data.data && res.data.data.length > 0) {
        setCompany(res.data.data[0]);
      }
    } catch (e) {
      toast.error("Failed to fetch company profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    const slug = prompt("Enter a unique company slug (e.g., google):");
    if (!slug) return;
    try {
      const res = await axiosInstance.post('/companies', {
        companySlug: slug.toLowerCase(),
        companyInfo: { name: "New Company" }
      });
      setCompany(res.data.data);
      toast.success("Company initialized!");
    } catch (e) {
      toast.error(e.response?.data?.message || "Creation failed");
    }
  };

  const handleSave = async (updates) => {
    if (!company) return;
    try {
      const payload = { ...company, ...updates };
      const res = await axiosInstance.put(`/companies/${company.companyId}`, payload);
      setCompany(res.data.data);
      toast.success("Saved successfully");
    } catch (e) {
      toast.error("Failed to save changes");
    }
  };

  const handleMediaUpload = async (e, folder) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const toastId = toast.loading(`Uploading ${folder}...`);
    try {
      const url = await uploadCompanyMedia(file, company.companyId, folder);
      
      const newBranding = { ...company.branding };
      if (folder === 'logo' || folder === 'banner') {
        newBranding[`${folder}Url`] = url;
      } else {
        if (!newBranding.media) newBranding.media = {};
        if (!newBranding.media[`${folder}Photos`]) newBranding.media[`${folder}Photos`] = [];
        newBranding.media[`${folder}Photos`].push(url);
      }
      
      await handleSave({ branding: newBranding });
      toast.success("Upload complete!", { id: toastId });
    } catch (error) {
      toast.error("Upload failed", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!company) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">No Company Profile Found</h2>
        <button onClick={handleCreate} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
          Create Employer Profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-6">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">Employer Branding Editor</h1>
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${company.verificationStatus === 'VERIFIED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {company.verificationStatus}
          </span>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={company.isHiring} onChange={e => handleSave({isHiring: e.target.checked})} className="form-checkbox h-5 w-5 text-blue-600"/>
            <span className="font-bold text-gray-700">Actively Hiring</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Basic Info</h3>
          <input className="w-full border p-2 rounded" placeholder="Company Name" value={company.companyInfo?.name || ''} onChange={e => setCompany({...company, companyInfo: {...company.companyInfo, name: e.target.value}})} />
          <input className="w-full border p-2 rounded" placeholder="Industry" value={company.companyInfo?.industry || ''} onChange={e => setCompany({...company, companyInfo: {...company.companyInfo, industry: e.target.value}})} />
          <textarea className="w-full border p-2 rounded" placeholder="About Company" rows="4" value={company.companyInfo?.about || ''} onChange={e => setCompany({...company, companyInfo: {...company.companyInfo, about: e.target.value}})} />
          <button onClick={() => handleSave(company)} className="bg-gray-900 text-white px-4 py-2 rounded font-bold w-full">Save Info</button>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold">Media & Branding</h3>
          
          <div className="border border-dashed border-gray-300 p-4 rounded-lg text-center relative hover:bg-gray-50">
            <p className="font-bold mb-2">Company Logo</p>
            {company.branding?.logoUrl && <img src={company.branding.logoUrl} alt="Logo" className="h-16 mx-auto mb-2" />}
            <input type="file" accept="image/*" onChange={(e) => handleMediaUpload(e, 'logo')} disabled={uploading} className="text-sm cursor-pointer" />
          </div>

          <div className="border border-dashed border-gray-300 p-4 rounded-lg text-center relative hover:bg-gray-50">
            <p className="font-bold mb-2">Company Banner</p>
            {company.branding?.bannerUrl && <img src={company.branding.bannerUrl} alt="Banner" className="h-20 object-cover w-full mb-2 rounded" />}
            <input type="file" accept="image/*" onChange={(e) => handleMediaUpload(e, 'banner')} disabled={uploading} className="text-sm cursor-pointer" />
          </div>

          <div className="border border-dashed border-gray-300 p-4 rounded-lg text-center relative hover:bg-gray-50">
            <p className="font-bold mb-2">Office Photos</p>
            <input type="file" accept="image/*" onChange={(e) => handleMediaUpload(e, 'office')} disabled={uploading} className="text-sm cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}
