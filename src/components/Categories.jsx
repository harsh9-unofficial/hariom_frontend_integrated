import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { USER_BASE_URL } from "../config";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${USER_BASE_URL}/api/category`);
        setCategories(res.data); // Ensure res.data is an array
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (cate_id) => {
    navigate(`/subcategory/${cate_id}`);
  };

  if (loading) {
    return <div className="text-center py-10">Loading categories...</div>;
  }

  return (
    <section className="py-8 md:py-12 container mx-auto px-2 md:px-4 lg:px-10 xl:px-8">
      <h2 className="text-3xl font-semibold text-center mb-10">
        Browse Categories
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 xl:gap-6 px-2 xl:px-0 justify-items-center">
        {categories.map((cat, idx) => (
          <div key={cat.id || idx} className="text-center">
            <img
              src={`${USER_BASE_URL}${cat.image}`}
              alt={cat.name}
              className="w-[170px] h-auto md:w-[220px] lg:w-[250px] rounded-xl mx-auto mb-2 hover:scale-105 cursor-pointer transition-transform duration-300"
              onClick={() => handleCategoryClick(cat.id)} // Pass category name
            />
            <p className="text-xl font-medium">{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
