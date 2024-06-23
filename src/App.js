import React, { useState, useRef, useEffect, useCallback } from "react";
import MoviesList from "./components/MoviesList";
import Loader from "./components/Loader";
import AddMovieForm from "./Form/Form";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(false);
  const retryTimeout = useRef(null);

  const fetchMovieHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetch(
        "https://react-http-e1bb9-default-rtdb.firebaseio.com/movies.json"
      );
      if (!data.ok) {
        throw new Error("Something went wrong... Retrying");
      }
      const MovieList = await data.json();
      const loadedMovies = [];
      console.log(MovieList);
      for (const key in MovieList) {
        console.log(key);
        loadedMovies.push({
          id: key,
          title: MovieList[key].title,
          openingText: MovieList[key].openingText,
          releaseDate: MovieList[key].releaseDate,
        });
      }
      setMovies(loadedMovies);
      setError(null);
    } catch (error) {
      setError(error.message);
      retryTimeout.current = setTimeout(fetchMovieHandler, 5000);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMovieHandler();
  }, []);

  useEffect(() => {
    if (retry) {
      fetchMovieHandler();
    }
    return () => clearTimeout(retryTimeout.current);
  }, [retry]);

  const cancelRetryHandler = useCallback(() => {
    clearTimeout(retryTimeout.current);
    setRetry(false);
    setError("Retry cancelled");
  }, []);

  const addMovieHandler = async (movie) => {
    const response = await fetch(
      "https://react-http-e1bb9-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to add movie.");
    }
    const data = await response.json();

    // console.log(data);
  };
  const deleteHandler = (id) => {
    console.log(id);
    fetch(
      `https://react-http-e1bb9-default-rtdb.firebaseio.com/movies/${id}.json`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  return (
    <React.Fragment>
      <section>
        <AddMovieForm addMovie={addMovieHandler} />
      </section>
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
        {!isLoading && movies && movies.length > 0 && (
          <MoviesList movies={movies} onDelete={deleteHandler} />
        )}
        {!isLoading && error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default React.memo(App);
