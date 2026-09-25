import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { axiosInstance } from '../axiosCalls/axios';
import SearchBar from '../components/SearchBar';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")

  const handleSearch = async()=>{
    try {
      setError(null)
      setLoading(true)
      const response = await axiosInstance.get('/catalogue/products', {
        params: {
          search: search,
          category: category
        }
      });
      setProducts(response.data.products);
    } catch (error) {
      setError(
          error.response?.data?.message || 'Failed to load products. Please try again later.'
        );
    }finally{
      setLoading(false)
    }

  }

  useEffect(() => {
    const getProd = async () => {
      try {
        const response = await axiosInstance.get('/catalogue/products');
        setProducts(response.data.products);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load products. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };
    getProd();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Explore Products
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Browse through our collection of premium quality items.
          </p>
        </div>

        {/* Search Bar Section */}
        <div className="mb-8">
          <SearchBar search={search} category={category} setSearch={setSearch} setCategory={setCategory} handleSearch={handleSearch}/>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl max-w-md mx-auto text-center">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No products found.
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductPage;