import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-center items-center">
          <Link to="/" className="text-xl font-bold">
            List Creation
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;