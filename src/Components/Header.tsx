import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-gray-100 p-4 shadow-md">
      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
};

export default Header;