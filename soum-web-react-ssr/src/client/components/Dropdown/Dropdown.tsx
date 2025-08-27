import React, { JSX, useState } from "react";

export type DropdownProps = {
  children: React.ReactNode;
};

export const Dropdown = ({ children }: DropdownProps): JSX.Element => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      {children}
      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute left-0 mt-0 w-48 bg-white border rounded-md shadow-lg z-10 pt-3">
          <button
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
            onMouseEnter={() => setIsSubmenuOpen(true)}
            onMouseLeave={() => setIsSubmenuOpen(false)}
          >
            Option 1
          </button>

          {/* Submenu */}
          {isSubmenuOpen && (
            <div className="absolute top-0 left-full mt-0 ml-2 w-48 bg-white border rounded-md shadow-lg z-20">
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                Submenu 1
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                Submenu 2
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                Submenu 3
              </button>
            </div>
          )}

          <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
            Option 2
          </button>
          <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
            Option 3
          </button>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
