import React, { useState, useCallback } from "react";
import "./Form.css";

function AddMovieForm() {
  const [title, setTitle] = useState("");
  const [openingText, setOpeningText] = useState("");
  const [releaseDate, setReleaseDate] = useState("");

  const submitHandler = useCallback(
    (e) => {
      e.preventDefault();
      const newMovie = {
        title,
        openingText,
        releaseDate,
      };
      console.log(newMovie);
      setTitle("");
      setOpeningText("");
      setReleaseDate("");
    },
    [title, openingText, releaseDate]
  );

  return (
    <form className="form" onSubmit={submitHandler}>
      <div className="inCls">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="inCls">
        <label>Opening Text</label>
        <input
          type="text"
          value={openingText}
          onChange={(e) => setOpeningText(e.target.value)}
        />
      </div>
      <div className="inCls">
        <label>Release Date</label>
        <input
          type="text"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
        />
      </div>
      <button type="submit">Add Movie</button>
    </form>
  );
}

export default React.memo(AddMovieForm);
