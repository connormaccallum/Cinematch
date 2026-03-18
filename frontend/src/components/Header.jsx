export default function Header({ title, searchTerm }) {
  return (
    <header className="header">
      <h1>{title}</h1>
      <p>Search for your favorite movies and add them to your watchlist!</p>
      {searchTerm && <p className="searchTerm">Current search: {searchTerm}</p>}
    </header>
  );
}
