import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

export default function CompanyPublicProfile() {
  const { slug } = useParams();
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axiosInstance.get(`/companies/slug/${slug}`);
        setCompany(res.data.data);
      } catch (e) {
        setError(true);
      }
    };
    fetchCompany();
  }, [slug]);

  if (error) return <div className="text-center mt-20 text-2xl font-bold text-gray-500">Company not found.</div>;
  if (!company) return <div className="text-center mt-20 font-bold">Loading Company Profile...</div>;

  const { companyInfo, branding, isHiring, verificationStatus, rating, followers } = company;

  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        className="h-64 bg-gray-300 bg-cover bg-center" 
        style={{ backgroundImage: `url(${branding?.bannerUrl || ''})` }}
      ></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="bg-white rounded-xl shadow-lg p-6 relative">
          
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-6">
              <div className="w-32 h-32 bg-white rounded-xl shadow-md border-4 border-white overflow-hidden flex items-center justify-center">
                {branding?.logoUrl ? (
                  <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-4xl font-bold text-gray-300">{companyInfo?.name?.charAt(0)}</span>
                )}
              </div>
              
              <div className="pt-16">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
                  {companyInfo?.name}
                  {verificationStatus === 'VERIFIED' && (
                    <svg className="w-6 h-6 text-blue-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.441A2 2 0 018 2h4a2 2 0 011.733 1.441l.192.656A4 4 0 0015.441 5.6l.656.192A2 2 0 0117.54 7.525a4 4 0 00.559 1.475l-.656-.192a4 4 0 00-1.516.484A2 2 0 0116 11H4a2 2 0 01-1.732-1.008A4 4 0 002 9.5a4 4 0 00.46-1.475A2 2 0 013.903 5.79l.656-.192A4 4 0 006.075 4.097l.192-.656zm6.81 7.266l-4.5 4.5a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414l1.293 1.293 3.793-3.793a1 1 0 111.414 1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </h1>
                <p className="text-gray-600 font-medium mt-1">{companyInfo?.industry} • {companyInfo?.location}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm font-bold text-gray-800">{followers} Followers</span>
                  <span className="text-sm font-bold text-yellow-600">★ {rating} / 5.0</span>
                </div>
              </div>
            </div>

            <div className="pt-16 space-x-3">
              <button className="bg-gray-100 text-gray-800 font-bold px-6 py-2 rounded-full hover:bg-gray-200">Follow</button>
              <button className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full hover:bg-blue-700">View Jobs</button>
            </div>
          </div>

          {isHiring && (
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-blue-900">We're actively hiring!</h3>
                <p className="text-sm text-blue-700">Check out our latest open roles and join our team.</p>
              </div>
              <button className="text-blue-600 font-bold hover:underline">See all jobs →</button>
            </div>
          )}

        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold mb-4">About Us</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{companyInfo?.about}</p>
            </div>

            {branding?.media?.officePhotos && branding.media.officePhotos.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Life at {companyInfo?.name}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {branding.media.officePhotos.map((url, i) => (
                    <img key={i} src={url} alt="Office" className="rounded-lg object-cover h-40 w-full hover:opacity-90 cursor-pointer" />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-lg mb-4">Company Details</h3>
              <ul className="space-y-3 text-gray-700">
                <li><span className="font-bold">Size:</span> {companyInfo?.companySize} employees</li>
                <li><span className="font-bold">Founded:</span> {companyInfo?.foundedYear}</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
