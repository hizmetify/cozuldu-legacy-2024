 
 import React, { useEffect, useState } from "react";
 import axiosInstance from "../../api/axiosInstance";
 import { favoriAction, favoriGet, favoriIs } from "../../api/userApi";
 import { MdFavoriteBorder } from "react-icons/md";
 import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaHeart } from "react-icons/fa";
const Favories = () => {
   const [ilanlar, setIlanlar] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [favoriBg,setFavoriBg]=useState('bg-red-500')
     const [favoriTxt,setFavoriTxt]=useState('bg-red-500')
     
     const favoriActions=async(adId)=>{
      
        const resul=await favoriAction(adId) 
        // await favoriGet()
        fetchIlanlar(); 
        return
      }
      const fetchIlanlar = async () => {
        try {
          const response =await favoriGet()
          
          setIlanlar(response.data);
          setLoading(false); 
        } catch (err) {
          setError("Veriler alınırken hata oluştu.");
        } finally {
          setLoading(false);
        }
      };
     useEffect(() => {
       
   
       fetchIlanlar();
     }, []);
     

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Favori İlanlarım
          </h2>
           
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resim
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Başlık
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alt Kategori
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                </th>
              </tr>
            </thead>
      <tbody className="divide-y divide-gray-200">
              {ilanlar.map((ad) => (
                <tr

                                  key={ad._id}
                                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                                >
                                  <td className="py-4 px-4">
                                    <img
                                      src={
                                        ad?.adId?.images?.length
                                          ? ad?.adId?.images[0]
                                          : 'https://media.istockphoto.com/id/1324356458/tr/vekt%C3%B6r/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=khO1-2i1TZ67Nak9JQWmDx7Slai72lbl6SEp2gDOaV8='
                                      }
                                      alt={ad?.adId?.title}
                                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md shadow-sm"
                                    />
                                  </td>
                                  <td className="py-4 px-4 text-sm md:text-base text-gray-900">
                                    {ad?.adId?.title}
                                  </td>
                                  <td className="py-4 px-4 text-sm md:text-base text-gray-900">
                                    {ad?.adId?.category?.name}
                                  </td>
                                  <td className="py-4 px-4 text-sm md:text-base text-gray-900">
                                    {ad?.adId?.subCategory?.name}
                                  </td>
                                  <td className="py-4 px-4 text-sm md:text-base text-gray-900">
                                    {ad?.adId?.price ? `${ad?.adId?.price}₺` : 'Fiyat Belirtilmedi'}
                                  </td>
                                  <td  className="py-4 px-4 mt-5 text-sm md:text-base text-gray-900 flex space-between items-center juctify-center"> 
                                    <Link to={`/dashboard/my-ads/${ad?.adId?._id}`}
                                        className="text-blue-600  inline-block   transition duration-150 ease-in-out transition-all duration-300 "
                                        title="Görüntüle">
                                        <FaEye className="text-xl h-5 w-5 " />
                                    </Link>
                                    <button className={`group rounded-lg m-1 p-2 transition-all duration-300 text-red-500`}>
                                        <FaHeart  onClick={()=>favoriActions(ad?.adId?._id)}  className="h-4 w-4 transition-transform group-hover:scale-150" />
                                    </button>
                                  </td>
                                </tr>
              ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Favories;
