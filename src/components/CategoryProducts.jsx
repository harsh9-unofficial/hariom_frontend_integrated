import React, { useState, useEffect } from "react";
import { USER_BASE_URL } from "../config";
import { useNavigate, useParams } from "react-router-dom";

const CategoryProducts = () => {
  const navigate = useNavigate();
  const { cate_id } = useParams();

  const [subCate, setSubCate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${USER_BASE_URL}/api/products/subcategory/${cate_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setSubCate(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [cate_id]);

  if (loading) {
    return (
      <section className="container mx-auto py-12 px-2 md:px-4 lg:px-10 xl:px-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
          SubCategory
        </h2>
        <p className="text-lg md:text-xl text-gray-500 mb-6">Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto py-12 px-2 md:px-4 lg:px-10 xl:px-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
          SubCategory
        </h2>
        <p className="text-lg md:text-xl text-red-500 mb-6">Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-12 px-2 md:px-4 lg:px-10 xl:px-8">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
        {subCate?.length > 0 ? subCate[0]?.Category?.name : null}
      </h2>
      <p className="text-lg md:text-xl text-gray-500 mb-6">
        Home / SubCategory
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {subCate?.length === 0 ? (
          <p className="text-lg text-gray-500 col-span-full">
            No subcategory available.
          </p>
        ) : (
          subCate?.map((product) => (
            <div
              key={product?.sub_cate_id}
              className="group relative rounded-xl border border-[#B7B4FF] overflow-hidden transition h-fit cursor-pointer p-4"
              onClick={() => navigate(`/products/${product?.sub_cate_id}`)}
            >
              <img
                src={`${USER_BASE_URL}/uploads/${product.image}`}
                alt={product.name}
                className="w-full bg-blue-100"
                onError={(e) => {
                  e.target.src = "/fallback-image.jpg";
                }}
              />
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-full mt-2">
                  <h4 className="text-sm text-gray-500 font-medium truncate">
                    {product?.Category?.name}
                  </h4>
                  <p className="text-base text-[#1B342F] font-semibold mt-1 truncate">
                    {product?.sub_cate_name}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default CategoryProducts;
