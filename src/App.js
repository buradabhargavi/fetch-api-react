import React, { useState, useRef, useEffect } from "react";

import MoviesList from "./components/MoviesList";
import Loader from "./components/Loader";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(false);
  const retryTimeout = useRef(null);

  useEffect(() => {
    if (retry) {
      fetchMovieHandler();
    }
    return () => clearTimeout(retryTimeout.current);
  }, [retry]);

  const fetchMovieHandler = async () => {
    setIsLoading(true);
    try {
      const data = await fetch("https://swapi.dev/api/film/");
      if (!data.ok) {
        throw new Error("Something went wrong... Retrying");
      }
      const MovieList = await data.json();
      setMovies(MovieList.results);
      setError(null);
    } catch (error) {
      setError(error.message);
      retryTimeout.current = setTimeout(fetchMovieHandler, 5000);
    }
    setIsLoading(false);
  };

  const cancelRetryHandler = () => {
    clearTimeout(retryTimeout.current);
    setRetry(false);
    setError("Retry cancelled");
  };

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
        {error && (
          <button onClick={cancelRetryHandler} style={{ marginLeft: "10px" }}>
            Cancel Retry
          </button>
        )}
      </section>

      <section>
        {isLoading && <Loader />}
        {!isLoading && movies.length === 0 && !error && <p>No Movies Found</p>}
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
