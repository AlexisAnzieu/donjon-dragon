"use client";

import { useState, useRef, useEffect } from "react";
import { HiFolder, HiEye, HiUpload, HiRefresh } from "react-icons/hi";
import { UIElementsKey } from "./Gameboard";
import { SessionSwitcher } from "./SessionSwitcher";

interface NavBarProps {
  sessionId: string;
  onImageUpload: (file: File) => void;
  onToggleElements: (element: UIElementsKey) => void;
  showElements: { [key: string]: boolean };
}

function MenuButton({
  icon: Icon,
  label,
  menuItems,
}: {
  icon: React.ElementType;
  label: string;
  menuItems: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative group">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`
          opacity-70
          flex items-center gap-2  px-4 py-2.5
          bg-gray-700 hover:bg-gray-700 hover:opacity-90
          text-white rounded-lg shadow-lg
          transition-all duration-200 ease-in-out
          ${isMenuOpen ? "bg-gray-700 opacity-90" : ""}
        `}
      >
        <Icon className="text-xl" />
        <span>{label}</span>
      </button>
      {isMenuOpen && (
        <div
          className="text-white absolute top-full left-0 mt-2 bg-gray-800 rounded-lg
                     shadow-xl w-48 transform opacity-100 scale-100
                     transition-all duration-200 ease-in-out "
        >
          {menuItems}
        </div>
      )}
    </div>
  );
}

export function NavBar({
  sessionId,
  onImageUpload,
  onToggleElements,
  showElements,
}: NavBarProps) {
  const [isSessionSwitcherOpen, setIsSessionSwitcherOpen] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const fileMenuItems = (
    <>
      <button
        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-700 cursor-pointer rounded-lg
                            transition-colors duration-150"
        onClick={() => setIsSessionSwitcherOpen(true)}
      >
        <HiRefresh className="text-xl text-blue-400" />
        <span>Switch Session</span>
      </button>
      <label
        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 cursor-pointer  rounded-lg
                            transition-colors duration-150"
      >
        <HiUpload className="text-xl text-blue-400" />
        <span>Import a map</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </label>
      <SessionSwitcher
        currentSessionId={sessionId}
        isOpen={isSessionSwitcherOpen}
        onClose={() => setIsSessionSwitcherOpen(false)}
      />
    </>
  );

  const viewMenuItems = (
    <>
      <button
        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-700 
                             transition-colors duration-150 rounded-lg"
        onClick={() => onToggleElements("HitPointControls")}
      >
        <HiEye
          className={`text-xl ${
            showElements.HitPointControls ? "text-green-400" : "text-gray-600"
          }`}
        />
        <span>Hit points</span>
      </button>
      <button
        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-700 
                             transition-colors duration-150 rounded-lg"
        onClick={() => onToggleElements("FogControls")}
      >
        <HiEye
          className={`text-xl ${
            showElements.FogControls ? "text-green-400" : "text-gray-600"
          }`}
        />
        <span>Fog</span>
      </button>
      <button
        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-700 
                             transition-colors duration-150 rounded-lg"
        onClick={() => onToggleElements("VFXControls")}
      >
        <HiEye
          className={`text-xl ${
            showElements.VFXControls ? "text-green-400" : "text-gray-600"
          }`}
        />
        <span>Sounds</span>
      </button>
    </>
  );

  return (
    <div className="absolute left-1 top-4 z-50 flex gap-3">
      <MenuButton icon={HiFolder} label="Session" menuItems={fileMenuItems} />
      <MenuButton icon={HiEye} label="View" menuItems={viewMenuItems} />
    </div>
  );
}
