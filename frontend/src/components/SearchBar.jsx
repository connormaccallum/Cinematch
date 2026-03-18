import React, { useState } from "react";
 
export default function SearchBar({ onSearch }) {

  const [inputValue, setInputValue] = useState("");
 
  const handleSubmit = (e) => {
    e.preventDefault();
 
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      onSearch(trimmedValue);
      setInputValue("");
    }
  };
 
  return (
    <form className="searchForm" onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search for movies..."
      />
      <button type="submit" className="primary">Search Movies</button>
    </form>
  );
}
