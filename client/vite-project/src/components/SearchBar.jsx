

const SearchBar = ({setSearch, setCategory, handleSearch}) => {

  
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition duration-150">
        
        {/* Category Dropdown */}
        <div className="w-full sm:w-48 relative border-b sm:border-b-0 sm:border-r border-gray-200 pb-2 sm:pb-0 sm:pr-2">
          <select
            defaultValue=""
            className="w-full bg-transparent text-gray-700 font-medium text-sm px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
            onChange={(e)=> setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Books">Books</option>
            <option value="Home">Home</option>
          </select>
        </div>

        {/* Search Input Area */}
        <div className="flex-1 flex items-center w-full px-3">
          <input
            type="text"
            placeholder="Search products..."
            onChange={(e)=> setSearch(e.target.value)}
            className="w-full bg-transparent text-gray-900 placeholder-gray-400 text-sm focus:outline-none py-2"
          />
        </div>

        {/* Search Action Button */}
        <button
          type="button"
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-6 py-2.5 rounded-xl transition duration-150 ease-in-out shadow-sm"
          onClick={handleSearch}
        >
          Search
        </button>

      </div>
    </div>
  );
};

export default SearchBar;