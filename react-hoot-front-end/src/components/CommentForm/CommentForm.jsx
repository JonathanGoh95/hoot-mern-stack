import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import * as hootService from "../../services/hootService"

const CommentForm = ({ handleAddComment }) => {
  const navigate = useNavigate()
  const {hootId, commentId} = useParams()
  const [formData, setFormData] = useState({ text: "" });

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (hootId && commentId){
      await hootService.updateComment(hootId, commentId, formData)
      navigate(`hoots/${hootId}`)
    }else{
      handleAddComment(formData);
    }
    // Clears Form Data upon form submission
    setFormData({ text: "" });
  };

  useEffect(()=>{
    const fetchHoot = async () => {
      const hootData = await hootService.show(hootId)
      // Find comment in fetched hoot data
      setFormData(hootData.comment.find((comment) => comment._id === commentId))
    }
    // Only run the function when hootId and commentId are present
    if (hootId && commentId) fetchHoot()
  },[hootId, commentId])

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="text-input">Your comment:</label>
      <textarea
        required
        type="text"
        name="text"
        id="text-input"
        value={formData.text}
        onChange={handleChange}
      />
      <button type="submit">SUBMIT COMMENT</button>
    </form>
  );
};

export default CommentForm;
