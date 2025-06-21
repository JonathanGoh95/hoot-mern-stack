import { useParams } from "react-router";
import { useState, useEffect, useContext } from "react";
import * as hootService from "./services/hootService";
import CommentForm from "../CommentForm/CommentForm";
import { UserContext } from "../../contexts/UserContext";

const HootDetails = ({ handleDeleteHoot }) => {
  const { hootId } = useParams();
  const { user } = useContext(UserContext);
  const [hoot, setHoot] = useState(null);

  const handleAddComment = async (commentFormData) => {
    const newComment = await hootService.createComment(hootId, commentFormData);
    // Updates state: keep original state of hoot, copies the existing comments and adds the newComment at the end
    setHoot({ ...hoot, comments: [...hoot.comments, newComment] });
  };

  // Fetch respective data from database whenever hootId changes
  useEffect(() => {
    const fetchHoot = async () => {
      const hootData = await hootService.show();
      setHoot(hootData);
    };
    fetchHoot();
  }, [hootId]);
  console.log("hoot state:", hoot);

  if (!hoot) return <main>Loading...</main>;

  return (
    <main>
      <section>
        <header>
          <p>{hoot.category.toUpperCase()}</p>
          <h1>{hoot.title}</h1>
          <p>
            {`${hoot.author.username} posted on
            ${new Date(hoot.createdAt).toLocaleDateString()}`}
          </p>
          {/* Only show the delete button if the hoot author is the same as the logged in user */}
          {hoot.author._id === user._id && (
            <>
              <button onClick={() => handleDeleteHoot(hootId)}>Delete</button>
            </>
          )}
        </header>
        <p>{hoot.text}</p>
      </section>
      <section>
        <h2>Comments</h2>
        <CommentForm handleAddComment={handleAddComment} />

        {!hoot.comments.length && (
          <p>There are no comments found for this hoot.</p>
        )}

        {hoot.comments.map((comment) => (
          <article key={comment._id}>
            <header>
              <p>
                {`${comment.author.username} posted on
                ${new Date(comment.createdAt).toLocaleDateString()}`}
              </p>
            </header>
            <p>{comment.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default HootDetails;
