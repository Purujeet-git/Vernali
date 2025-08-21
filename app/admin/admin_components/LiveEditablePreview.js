'use client'
import React from "react";

const LiveEditablePreview = () => {
  return(
      <div className="w-full border rounded-lg overflow-hidden shadow-md bg-white">
      {/* Simulated Homepage Preview */}
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-xl text-gray-600">
        🖼️ Homepage Banner Image
      </div>

      <div className="w-full h-48 bg-gray-100 mt-4 flex items-center justify-center text-lg text-gray-500">
        🛍️ Featured Product Image
      </div>

      <div className="w-full h-48 bg-gray-100 mt-4 flex items-center justify-center text-lg text-gray-500">
        📰 Promotional Image
      </div>
    </div>
  );
};

export default LiveEditablePreview;