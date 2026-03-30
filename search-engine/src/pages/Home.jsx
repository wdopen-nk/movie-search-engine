import MovieCard from "../components/MovieCard";
import { useEffect, useState } from "react";
import { getPopularMovies, searchMovies } from "../services/api";
import '../css/Home.css';

function Home() {

    const [searchTerm, setSearchTerm] = useState('');
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPopularMovies = async () => {
            setLoading(true);
            try {
                const popularMovies = await getPopularMovies();
                setMovies(popularMovies);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPopularMovies();
    }, []);

    const handleSearchSubmit = async (e) => 
    {
        e.preventDefault();
        
        if (!searchTerm.trim()) {
            return;
        }

        if (loading) {
            return;
        }

        setLoading(true);

        try {
            const searchResults = await searchMovies(searchTerm);
            setMovies(searchResults);
            setError(null);
        }

        catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }

        setSearchTerm('');
    }

    return (
        <div className="home">
            <form onSubmit={handleSearchSubmit} className="search-form">
                <input 
                    type="text" 
                    placeholder="Search for movies..." className="search-input" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-button">Search</button>
            </form>

            {error && <div className="error">Error: {error}</div>}

            {loading ? (
                <div className="loading">Loading...</div> 
            ) : (
                <div className="movie-grid">
                    {movies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;