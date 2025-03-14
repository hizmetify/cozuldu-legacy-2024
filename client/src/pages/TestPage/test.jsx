import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { favoriAction, favoriGet } from "../../api/userApi";
import { MdFavoriteBorder } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
const IlanListesi = () => {
  const [ilanlar, setIlanlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const favoriaciton=async(adId)=>{
    
    const response =await favoriAction({adId:Object(adId)})
    // const response =await favoriGet()
    return response
  }
  useEffect(() => {
    const fetchIlanlar = async () => {
      try {
        const response =await axiosInstance.get('/ads')
        
        setIlanlar(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Veriler alınırken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchIlanlar();
  }, []);
  
  const navigate = useNavigate(); 
  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">İlan Listesi</h1>
      <div className="grid gap-4">
        {ilanlar.map((ilan) => (
          <Link key={ilan._id} className="p-4 border rounded-lg shadow-md" to={`/dashboard/my-ads/${ilan._id}`}>
            <h2 className="text-lg font-semibold">{ilan.title}</h2>
            <p className="text-gray-600">Fiyat: {ilan.price} ₺</p>
            <p className="text-gray-500">Konum: {ilan.city}</p>
            <p className="text-gray-500">category: {ilan?.category?.name}</p>
            <button onClick={(e)=>{favoriaciton(ilan._id)}}><MdFavoriteBorder/></button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default IlanListesi;
