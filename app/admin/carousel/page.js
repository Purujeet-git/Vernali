'use client';

import { useEffect, useState, useRef } from 'react';

export default function CarouselAdminPage() {
  const [groupedSlides, setGroupedSlides] = useState({});
  const [file, setFile] = useState(null);
  const [carouselSection, setCarouselSection] = useState("main");
  const [redirectLink, setRedirectLink] = useState("");
  const fileInputRef = useRef(null);

  const refreshSlides = async () => {
    const res = await fetch('/api/carousel');
    const data = await res.json();


    const grouped = data.reduce((acc, slide) => {
      const section = slide.carouselSection || 'unlabeled';
      if (!acc[section]) acc[section] = [];
      acc[section].push(slide);
      return acc;
    }, {});

    setGroupedSlides(grouped);
  };

  useEffect(() => {
    refreshSlides();
  }, []);

  const handleAddSlide = async () => {
    if (!file) return alert("Please select an image");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(`/api/admin/upload?filename=${Date.now()}-${file.name}`, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload Failed");

      const { url } = await uploadRes.json();

      const saveRes = await fetch("/api/admin/carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: url,
          carouselSection,
          redirectUrl: redirectLink,
        }),
      });

      if (!saveRes.ok) throw new Error("Failed to save to DB");

      alert("Slide added successfully");
      setFile(null);
      setRedirectLink("");
      setCarouselSection("main");
      refreshSlides();
    } catch (err) {
      // console.error("Slide add Failed:", err);
      alert("Something went wrong");
    }
  };

  const handleImageReplace = async (e, slide) => {
    const file = e.target.files[0];
    if (!file) return alert("Please select a file");

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch(`/api/admin/upload?filename=${slide._id}-${file.name}`, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');
      const { url: newImageUrl } = await uploadRes.json();

      const deleteRes = await fetch('/api/admin/blob-delete', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: slide.imageUrl }),
      });

      if (!deleteRes.ok) throw new Error('Old image deletion Failed');

      const updateRes = await fetch(`/api/carousel/update?id=${slide._id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: newImageUrl }),
      });

      if (!updateRes.ok) throw new Error('Failed to update MongoDB');

      alert('Image replaced successfully');
      refreshSlides();
    } catch (err) {
      // console.error("Image upload/update failed:", err);
    }
  };

  const handleDeleteImage = async (imageUrl, slideId) => {
    const confirmDelete = confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) return;

    try {
      const blobRes = await fetch('/api/admin/blob-delete', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl }),
      });

      if (!blobRes.ok) return alert("Failed to delete blob");

      const dbRes = await fetch(`/api/carousel/delete?id=${slideId}`, {
        method: "DELETE",
      });

      if (!dbRes.ok) return alert("Failed to delete from DB");

      alert("Image deleted successfully");
      refreshSlides();
    } catch (err) {
      // console.error("Error deleting image", err);
    }
  };

  return (
    <div className=" flex w-full p-6 space-y-12 text-black">
      <h1 className="text-3xl font-bold mb-6">Carousel Admin Panel</h1>
      <div className='w-1/2 p-6 overflow-y-auto max-h-screen'>
      <div className="p-6 border  rounded-xl bg-white shadow-md max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">Add New Slide</h2>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileInputRef}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition mb-3"
        >
          📁 Choose Image
        </button>

        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="w-full h-48 object-cover rounded mb-4"
          />
        )}

        <label className="block mb-1 text-sm font-medium">Carousel Section</label>
        <select
          value={carouselSection}
          onChange={(e) => setCarouselSection(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded-md"
        >
          <option value="main">Main</option>
          <option value="productGrid">Product Grid</option>
          <option value="promotions">Promotions</option>
          <option value="homePage">Home Page</option>
          <option value="static1">Static 1</option>
          <option value="static2">Static 2</option>
          <option value="static3">Static 3</option>
          <option value="static4">Static 4</option>
          <option value="static5">Static 5</option>
        </select>

        <label className="block mb-1 text-sm font-medium">Redirect URL</label>
        <input
          type="text"
          value={redirectLink}
          onChange={(e) => setRedirectLink(e.target.value)}
          placeholder="https://example.com/page"
          className="w-full border px-3 py-2 rounded-md mb-4"
        />

        <button
          onClick={handleAddSlide}
          className="w-full bg-black text-white font-semibold py-2 rounded-md hover:bg-gray-800 transition"
        >
          Upload Slide
        </button>
      </div>

      {Object.entries(groupedSlides).map(([section, slides]) => (
        <div key={section} className="mb-8">
          <h2 className="text-xl font-semibold mb-2 capitalize">{section}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {slides.map((slide) => (
              <div key={slide._id} className="relative border rounded-lg overflow-hidden shadow">
                <img
                  src={slide.imageUrl}
                  alt={slide.carouselSection}
                  className="w-full h-48 object-cover"
                  onClick={() => document.getElementById(`replace-${slide._id}`).click()}
                />
                <input
                  id={`replace-${slide._id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageReplace(e, slide)}
                />
                <button
                  onClick={() => handleDeleteImage(slide.imageUrl, slide._id)}
                  className="absolute top-2 right-2 bg-red-600 text-white text-sm px-2 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      </div>
      <div className='w-1/2 bg-gray-100 p-6 overflow-y-auto max-h-screen'>
        <h2 className="text-xl font-bold mb-4">Website Live Preview</h2>

    {/* Preview: Home Carousel */}
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Home Carousel</h3>
      <div className="overflow-x-auto whitespace-nowrap">
        {Object.entries(groupedSlides).map(([section, slides]) => (
    <div key={section} className="mb-8">
      <h3 className="text-lg font-semibold mb-2 capitalize">
        {section === "main" ? "Home" : section === "productGrid" ? "Products" : section}
        {" "}Carousel
      </h3>
      {slides.length === 0 ? (
        <p className="text-sm text-gray-500">No slides uploaded.</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto p-2 bg-white rounded border">
          {slides.map((slide) => (
            <a
              key={slide._id}
              href={slide.redirectUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={slide.imageUrl}
                alt="carousel banner"
                className="h-48 w-auto rounded shadow hover:scale-105 transition-transform"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  ))}
      </div>
    </div>
      </div>
    </div>

  );
}
