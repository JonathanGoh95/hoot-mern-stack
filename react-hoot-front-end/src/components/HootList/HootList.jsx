import { Link } from "react-router";
import styles from "./HootList.module.css";
import Icon from "../Icon/Icon";
import AuthorInfo from "../AuthorInfo/AuthorInfo";

const HootList = ({ hoots }) => {
  return (
    <main className={styles.container}>
      {hoots.map((hoot) => (
        // Links to a new route showing details of a specific hoot
        <Link key={hoot._id} to={`/hoots/${hoot._id}`}>
          <article>
            <header>
              <div>
                <h2>{hoot.title}</h2>
                <Icon category={hoot.category} />
              </div>
              <AuthorInfo content={hoot} />
            </header>
            <p>{hoot.text}</p>
          </article>
        </Link>
      ))}
    </main>
  );
};

export default HootList;
