// import { useState, useEffect } from 'react';
// import api from '../api/axios';
// import MenuCard from '../components/MenuCard';

// const Home = () => {
//   const [menu, setMenu] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeCategory, setActiveCategory] = useState(null);

//   useEffect(() => {
//     api.get('/menu').then(({ data }) => {
//       setMenu(data);
//       if (data.length > 0) setActiveCategory(data[0].category._id);
//       setLoading(false);
//     });
//   }, []);

//   if (loading) return (
//     <div className="flex justify-center items-center h-64">
//       <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
//     </div>
//   );

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-6">
//       {/* Hero Banner */}
//       <div className="bg-gradient-to-r from-primary to-orange-400 rounded-2xl p-6 mb-6 text-white">
//         <h1 className="text-3xl font-bold">🍴 Welcome!</h1>
//         <p className="mt-1 opacity-90">Fresh food, delivered to your door</p>
//       </div>

//       {/* Category Tabs */}
//       <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
//         {menu.map(({ category }) => (
//           <button
//             key={category._id}
//             onClick={() => setActiveCategory(category._id)}
//             className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition ${
//               activeCategory === category._id
//                 ? 'bg-primary text-white border-primary'
//                 : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
//             }`}
//           >
//             {category.icon} {category.name}
//           </button>
//         ))}
//       </div>

//       {/* Menu Items */}
//       {menu.map(({ category, items }) => (
//         <div key={category._id} id={`cat-${category._id}`} className="mb-8">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">
//             {category.icon} {category.name}
//           </h2>
//           {items.length === 0 ? (
//             <p className="text-gray-400 text-sm">No items in this category</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//               {items.map((item) => (
//                 <MenuCard key={item._id} item={item} />
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Home;



import { useState, useEffect } from 'react';
import api from '../api/axios';
import MenuCard from '../components/MenuCard';

const Home = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    api.get('/menu').then(({ data }) => {
      setMenu(data);
      if (data.length > 0) setActiveCategory(data[0].category._id);
      setLoading(false);
    });
  }, []);

  // ✅ NEW: Smooth scroll to category section
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    const el = document.getElementById(`cat-${categoryId}`);
    if (el) {
      const offset = 80; // account for sticky navbar height
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary to-purple-400 rounded-2xl p-6 mb-6 text-white">
        <h1 className="text-3xl font-bold">🍴 Welcome!</h1>
        <p className="mt-1 opacity-90">Fresh food, delivered to your door</p>
      </div>

      {/* Category Tabs — sticky below navbar */}
      <div className="sticky top-[60px] z-30 bg-[#fafafa] py-2 mb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {menu.map(({ category }) => (
            <button
              key={category._id}
              onClick={() => handleCategoryClick(category._id)} // ✅ smooth scroll
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition ${
                activeCategory === category._id
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      {menu.map(({ category, items }) => (
        <div key={category._id} id={`cat-${category._id}`} className="mb-10 scroll-mt-24">
          {/* ✅ Category header with image */}
          <div className="flex items-center gap-3 mb-4">
            {category.image && (
              <img
                src={category.image}
                alt={category.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-primary/20"
              />
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {category.icon} {category.name}
              </h2>
              <p className="text-xs text-gray-400">{items.length} item{items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {items.length === 0 ? (
            <p className="text-gray-400 text-sm">No items in this category</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((item) => (
                // ✅ Pass category image as fallback
                <MenuCard key={item._id} item={item} categoryImage={category.image} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Home;