import React, { useState } from "react";

import MoviesList from "./components/MoviesList";
import Loader from "./components/Loader";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovieHandler = async () => {
    try {
      setIsLoading(true);
      const data = await fetch("https://swapi.dev/api/films/");
      const MovieList = await data.json();
      // console.log(MovieList);

      setMovies(MovieList.results);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  /* const fetchMovieHandler = () => {
    fetch("https://swapi.dev/api/films/")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // console.log(data.results);
        setMovies(data.results);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }; */
  /*  const dummyMovies = [
    {
      id: 1,
      title: 'Some Dummy Movie',
      openingText: 'This is the opening text of the movie',
      releaseDate: '2021-05-18',
    },
    {
      id: 2,
      title: 'Some Dummy Movie 2',
      openingText: 'This is the second opening text of the movie',
      releaseDate: '2021-05-19',
    },
  ]; */

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>

      <section>
        {isLoading && <Loader />}
        {!isLoading && movies.length === 0 && <p>No Movies Found</p>}
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
      </section>
    </React.Fragment>
  );
}

export default App;
