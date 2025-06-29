import { useState, useEffect } from "react";
import { useParams } from "react-router";
import styles from "./HootForm.module.css";
import * as hootService from "../../services/hootService";

const HootForm = ({ handleAddHoot, handleUpdateHoot }) => {
  const { hootId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    category: "News",
  });
  // Consistent syntax for most form updates via setting of state
  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };
  // Consistent syntax for most form submission
  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (hootId) {
      handleUpdateHoot(hootId, formData);
    } else {
      handleAddHoot(formData);
    }
  };
  // For displaying the values of the current hoot in the edit form
  useEffect(() => {
    const fetchHoot = async () => {
      const hootData = await hootService.show(hootId);
      setFormData(hootData);
    };
    if (hootId) fetchHoot();
    // Cleanup Function (Runs when a component is removed from the DOM or when the hootId changes)
    return () => setFormData({ title: "", text: "", category: "News" });
  }, [hootId]);

  return (
    <main className={styles.container}>
      <h1>{hootId ? "Edit Hoot" : "New Hoot"}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title-input">Title</label>
        <input
          required
          type="text"
          name="title"
          id="title-input"
          value={formData.title}
          onChange={handleChange}
        />
        <label htmlFor="text-input">Text</label>
        <textarea
          required
          type="text"
          name="text"
          id="text-input"
          value={formData.text}
          onChange={handleChange}
        />
        <label htmlFor="category-input">Category</label>
        <select
          required
          name="category"
          id="category-input"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="News">News</option>
          <option value="Games">Games</option>
          <option value="Music">Music</option>
          <option value="Movies">Movies</option>
          <option value="Sports">Sports</option>
          <option value="Television">Television</option>
        </select>
        <button type="submit">SUBMIT</button>
      </form>
    </main>
  );
};

export default HootForm;
