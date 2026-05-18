// import { useState, useEffect } from 'react';
// import api from '../../api/axios';
// import toast from 'react-hot-toast';

// const ManageMenu = () => {
//   const [items, setItems] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editItem, setEditItem] = useState(null);
//   const [form, setForm] = useState({
//     name: '', description: '', category: '', basePrice: '',
//     isVeg: 'false', isAvailable: 'true', tags: '',
//     variants: '[]', addOns: '[]',
//   });
//   const [imageFile, setImageFile] = useState(null);

//   const fetchData = async () => {
//     const [itemsRes, catsRes] = await Promise.all([
//       api.get('/admin/items'),
//       api.get('/admin/categories'),
//     ]);
//     setItems(itemsRes.data);
//     setCategories(catsRes.data);
//   };

//   useEffect(() => { fetchData(); }, []);

//   const openEdit = (item) => {
//     setEditItem(item);
//     setForm({
//       name: item.name, description: item.description || '',
//       category: item.category._id, basePrice: item.basePrice,
//       isVeg: String(item.isVeg), isAvailable: String(item.isAvailable),
//       tags: item.tags?.join(', ') || '',
//       variants: JSON.stringify(item.variants || []),
//       addOns: JSON.stringify(item.addOns || []),
//     });
//     setShowForm(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const fd = new FormData();
//     Object.entries(form).forEach(([k, v]) => fd.append(k, v));
//     if (imageFile) fd.append('image', imageFile);

//     try {
//       if (editItem) {
//         await api.put(`/admin/items/${editItem._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
//         toast.success('Item updated!');
//       } else {
//         await api.post('/admin/items', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
//         toast.success('Item created!');
//       }
//       setShowForm(false); setEditItem(null);
//       fetchData();
//     } catch (err) {
//       toast.error('Error saving item');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Delete this item?')) return;
//     await api.delete(`/admin/items/${id}`);
//     toast.success('Deleted');
//     fetchData();
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-6">
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-2xl font-bold">Manage Menu</h1>
//         <button onClick={() => { setEditItem(null); setForm({ name:'',description:'',category:'',basePrice:'',isVeg:'false',isAvailable:'true',tags:'',variants:'[]',addOns:'[]' }); setShowForm(true); }} className="btn-primary">
//           + Add Item
//         </button>
//       </div>

//       {showForm && (
//         <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
//             <h2 className="font-bold text-lg mb-4">{editItem ? 'Edit' : 'New'} Menu Item</h2>
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <input type="text" placeholder="Item Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded-lg p-2.5 text-sm" required />
//               <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full border rounded-lg p-2.5 text-sm h-16 resize-none" />
//               <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full border rounded-lg p-2.5 text-sm" required>
//                 <option value="">Select Category</option>
//                 {categories.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
//               </select>
//               <input type="number" placeholder="Base Price (₹)" value={form.basePrice} onChange={e=>setForm({...form,basePrice:e.target.value})} className="w-full border rounded-lg p-2.5 text-sm" required />
//               <div className="flex gap-3">
//                 <label className="flex items-center gap-2 text-sm">
//                   <input type="checkbox" checked={form.isVeg==='true'} onChange={e=>setForm({...form,isVeg:String(e.target.checked)})} className="accent-green-500" /> Veg
//                 </label>
//                 <label className="flex items-center gap-2 text-sm">
//                   <input type="checkbox" checked={form.isAvailable==='true'} onChange={e=>setForm({...form,isAvailable:String(e.target.checked)})} className="accent-primary" /> Available
//                 </label>
//               </div>
//               <input type="text" placeholder="Tags (comma separated: Spicy, Bestseller)" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} className="w-full border rounded-lg p-2.5 text-sm" />
//               <div>
//                 <label className="text-xs text-gray-500 mb-1 block">Variants JSON (e.g. [{"{"}"name":"Small","price":99{"}"}])</label>
//                 <textarea value={form.variants} onChange={e=>setForm({...form,variants:e.target.value})} className="w-full border rounded-lg p-2.5 text-xs font-mono h-16 resize-none" />
//               </div>
//               <div>
//                 <label className="text-xs text-gray-500 mb-1 block">Add-ons JSON (e.g. [{"{"}"name":"Extra Cheese","price":20,"isAvailable":true{"}"}])</label>
//                 <textarea value={form.addOns} onChange={e=>setForm({...form,addOns:e.target.value})} className="w-full border rounded-lg p-2.5 text-xs font-mono h-16 resize-none" />
//               </div>
//               <input type="file" accept="image/*" onChange={e=>setImageFile(e.target.files[0])} className="w-full text-sm" />
//               <div className="flex gap-2 pt-2">
//                 <button type="button" onClick={()=>setShowForm(false)} className="flex-1 border rounded-lg py-2 text-sm">Cancel</button>
//                 <button type="submit" className="flex-1 btn-primary py-2 text-sm">Save</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <div className="space-y-3">
//         {items.map(item => (
//           <div key={item._id} className="bg-white border rounded-xl flex items-center gap-3 p-3">
//             <img src={item.image || '/placeholder-food.jpg'} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" alt={item.name} />
//             <div className="flex-1 min-w-0">
//               <p className="font-semibold truncate">{item.name}</p>
//               <p className="text-sm text-gray-500">{item.category?.name} • ₹{item.basePrice}</p>
//               <div className="flex gap-1 mt-0.5">
//                 <span className={`text-xs px-1.5 py-0.5 rounded ${item.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{item.isVeg?'Veg':'Non-Veg'}</span>
//                 <span className={`text-xs px-1.5 py-0.5 rounded ${item.isAvailable ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{item.isAvailable?'Available':'Unavailable'}</span>
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <button onClick={() => openEdit(item)} className="text-sm text-blue-500 hover:underline">Edit</button>
//               <button onClick={() => handleDelete(item._id)} className="text-sm text-red-500 hover:underline">Delete</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ManageMenu;



import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ManageMenu = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showCatForm, setShowCatForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);  // ✅ ADD THIS LINE
  const [catForm, setCatForm] = useState({ name: '', icon: '', order: 0 });
  const [form, setForm] = useState({
    name: '', description: '', category: '', basePrice: '',
    isVeg: 'false', isAvailable: 'true', tags: '',
    variants: '[]', addOns: '[]',
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchData = async () => {
    const [itemsRes, catsRes] = await Promise.all([
      api.get('/admin/items'),
      api.get('/admin/categories'),
    ]);
    setItems(itemsRes.data);
    setCategories(catsRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  // ── CATEGORY HANDLERS ──────────────────────────

  // const handleAddCategory = async (e) => {
  //   e.preventDefault();
  //   if (!catForm.name.trim()) return toast.error('Category name required');
  //   try {
  //     await api.post('/admin/categories', catForm);
  //     toast.success(`Category "${catForm.name}" created!`);
  //     setCatForm({ name: '', icon: '', order: 0 });
  //     setShowCatForm(false);
  //     fetchData();
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || 'Error creating category');
  //   }
  // };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) return toast.error('Category name required');
    try {
      // ✅ Use FormData to support image upload
      const fd = new FormData();
      fd.append('name', catForm.name);
      fd.append('icon', catForm.icon || '');
      fd.append('order', catForm.order);
      if (catForm.imageFile) fd.append('image', catForm.imageFile);

      await api.post('/admin/categories', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(`Category "${catForm.name}" created!`);
      setCatForm({ name: '', icon: '', order: 0, imageFile: null });
      setShowCatForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating category');
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!confirm(`Delete category "${name}"? Items in it won't be deleted.`)) return;
    await api.delete(`/admin/categories/${id}`);
    toast.success('Category deleted');
    fetchData();
  };

  // ── ITEM HANDLERS ──────────────────────────────

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name,
      description: item.description || '',
      category: item.category._id,
      basePrice: item.basePrice,
      isVeg: String(item.isVeg),
      isAvailable: String(item.isAvailable),
      tags: item.tags?.join(', ') || '',
      variants: JSON.stringify(item.variants || []),
      addOns: JSON.stringify(item.addOns || []),
    });
    setImageFile(null);
    setShowForm(true);
  };

  const openNewForm = () => {
    if (categories.length === 0) {
      toast.error('Please create at least one category first!');
      setShowCatForm(true);
      return;
    }
    setEditItem(null);
    setForm({
      name: '', description: '', category: '', basePrice: '',
      isVeg: 'false', isAvailable: 'true', tags: '',
      variants: '[]', addOns: '[]',
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) return toast.error('Please select a category');

    // Validate JSON fields
    try {
      JSON.parse(form.variants);
      JSON.parse(form.addOns);
    } catch {
      return toast.error('Variants or Add-ons JSON is invalid. Use [] if empty.');
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);

    setLoading(true);
    try {
      if (editItem) {
        await api.put(`/admin/items/${editItem._id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Item updated!');
      } else {
        await api.post('/admin/items', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Item created!');
      }
      setShowForm(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving item');
    } finally {
      setLoading(false); 
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    await api.delete(`/admin/items/${id}`);
    toast.success('Deleted');
    fetchData();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      {/* ── CATEGORIES SECTION ── */}
      <div className="bg-white border rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">📂 Categories</h2>
          <button
            onClick={() => setShowCatForm(!showCatForm)}
            className="text-sm btn-primary px-3 py-1.5"
          >
            {showCatForm ? 'Cancel' : '+ Add Category'}
          </button>
        </div>

        {/* Add Category Form */}
        {showCatForm && (
          <form onSubmit={handleAddCategory} className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-3 space-y-2">
            <div className="flex flex-wrap gap-2 items-end">
              <div className="flex-1 min-w-32">
                <label className="text-xs text-gray-500 mb-1 block">Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Starters, Main Course"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="w-24">
                <label className="text-xs text-gray-500 mb-1 block">Icon (emoji)</label>
                <input
                  type="text"
                  placeholder="🍔"
                  value={catForm.icon}
                  onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm text-center focus:outline-none focus:border-primary"
                />
              </div>
              <div className="w-20">
                <label className="text-xs text-gray-500 mb-1 block">Order</label>
                <input
                  type="number"
                  placeholder="0"
                  value={catForm.order}
                  onChange={(e) => setCatForm({ ...catForm, order: Number(e.target.value) })}
                  className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* ✅ NEW: Category image upload */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Category Image <span className="text-gray-400">(used as fallback for items without photos)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCatForm({ ...catForm, imageFile: e.target.files[0] })}
                className="w-full text-sm border rounded-lg p-2"
              />
            </div>

            <button type="submit" className="btn-primary px-4 py-2 text-sm w-full">
              Save Category
            </button>
          </form>
        )}

        {/* Category List */}
        {categories.length === 0 ? (
          <div className="text-center py-4 text-gray-400 text-sm">
            <p className="text-2xl mb-1">📂</p>
            No categories yet. Add one above before adding menu items.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="flex items-center gap-1.5 bg-gray-50 border rounded-full px-3 py-1.5 text-sm"
              >
                <span>{cat.icon}</span>
                <span className="font-medium">{cat.name}</span>
                <button
                  onClick={() => handleDeleteCategory(cat._id, cat.name)}
                  className="text-red-400 hover:text-red-600 ml-1 text-base leading-none"
                  title="Delete category"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MENU ITEMS SECTION ── */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">🍽️ Menu Items</h1>
        <button onClick={openNewForm} className="btn-primary">
          + Add Item
        </button>
      </div>

      {/* Add/Edit Item Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold text-lg mb-4">{editItem ? 'Edit' : 'New'} Menu Item</h2>
            <form onSubmit={handleSubmit} className="space-y-3">

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Item Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Paneer Tikka"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Description</label>
                <textarea
                  placeholder="Short description of the item"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm h-16 resize-none focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary"
                  required
                >
                  <option value="">— Select Category —</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Base Price (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 199"
                  value={form.basePrice}
                  onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isVeg === 'true'}
                    onChange={(e) => setForm({ ...form, isVeg: String(e.target.checked) })}
                    className="accent-green-500 w-4 h-4"
                  />
                  🟢 Veg
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isAvailable === 'true'}
                    onChange={(e) => setForm({ ...form, isAvailable: String(e.target.checked) })}
                    className="accent-primary w-4 h-4"
                  />
                  ✅ Available
                </label>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="Spicy, Bestseller, New"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Variants JSON{' '}
                  <span className="text-gray-400">(leave as [] if no size options)</span>
                </label>
                <textarea
                  value={form.variants}
                  onChange={(e) => setForm({ ...form, variants: e.target.value })}
                  placeholder='[{"name":"Small","price":99},{"name":"Large","price":149}]'
                  className="w-full border rounded-lg p-2.5 text-xs font-mono h-16 resize-none focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Add-ons JSON{' '}
                  <span className="text-gray-400">(leave as [] if none)</span>
                </label>
                <textarea
                  value={form.addOns}
                  onChange={(e) => setForm({ ...form, addOns: e.target.value })}
                  placeholder='[{"name":"Extra Cheese","price":20,"isAvailable":true}]'
                  className="w-full border rounded-lg p-2.5 text-xs font-mono h-16 resize-none focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Item Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full text-sm border rounded-lg p-2"
                />
                {editItem?.image && !imageFile && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-400 mb-1">Current image:</p>
                    <img src={editItem.image} className="h-16 rounded-lg object-cover" alt="current" />
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditItem(null); }}
                  disabled={loading}
                  className="flex-1 border rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 btn-primary py-2.5 text-sm"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    editItem ? 'Update Item' : 'Save Item'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Items List */}
      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white border rounded-2xl">
          <p className="text-4xl mb-2">🍽️</p>
          <p>No menu items yet. Click "+ Add Item" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="bg-white border rounded-xl flex items-center gap-3 p-3 hover:shadow-sm transition">
              <img
                src={item.image || '/placeholder-food.jpg'}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                alt={item.name}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{item.name}</p>
                <p className="text-sm text-gray-500">{item.category?.name} • ₹{item.basePrice}</p>
                <div className="flex gap-1 mt-0.5 flex-wrap">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${item.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${item.isAvailable ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    {item.isAvailable ? '✅ Available' : '❌ Unavailable'}
                  </span>
                  {item.tags?.map((tag) => (
                    <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-orange-50 text-orange-600">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button
                  onClick={() => openEdit(item)}
                  className="text-xs text-blue-500 hover:underline font-medium"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-xs text-red-500 hover:underline font-medium"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageMenu;