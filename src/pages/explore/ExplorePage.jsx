import { Link } from "react-router-dom";
import explore1 from "../../assets/explore-1.png";
import explore2 from "../../assets/explore-2.png";
import explore3 from "../../assets/explore-3.png";
import explore4 from "../../assets/explore-4.png";
import explore5 from "../../assets/explore-5.png";
import explore6 from "../../assets/explore-6.png";
import explore7 from "../../assets/explore-7.png";
import explore8 from "../../assets/explore-8.png";
import explore9 from "../../assets/explore-9.png";
import explore10 from "../../assets/explore-10.png";

const exploreItems = [
  {
    id: 1,
    username: "sashaa",
    image: explore1,
    alt: "Explore post 1",
  },
  {
    id: 2,
    username: "marina",
    image: explore2,
    alt: "Explore post 2",
  },
  {
    id: 3,
    username: "alex",
    image: explore3,
    alt: "Explore post 3",
    tall: true,
  },
  {
    id: 4,
    username: "natalia",
    image: explore4,
    alt: "Explore post 4",
  },
  {
    id: 5,
    username: "egor",
    image: explore5,
    alt: "Explore post 5",
  },
  {
    id: 6,
    username: "david",
    image: explore6,
    alt: "Explore post 6",
    tall: true,
  },
  {
    id: 7,
    username: "anna",
    image: explore7,
    alt: "Explore post 7",
  },
  {
    id: 8,
    username: "max",
    image: explore8,
    alt: "Explore post 8",
  },
  {
    id: 9,
    username: "lena",
    image: explore9,
    alt: "Explore post 9",
  },
  {
    id: 10,
    username: "roman",
    image: explore10,
    alt: "Explore post 10",
  },
];

function ExplorePage() {
  return (
    <main className="explore-page">
      <section className="explore-grid" aria-label="Explore posts">
        {exploreItems.map((item) => (
          <Link
            key={item.id}
            to={`/profile/${item.username}`}
            className={`explore-item ${item.tall ? "explore-item-tall" : ""}`}
            aria-label={`Open ${item.username} profile`}
          >
            <img src={item.image} alt={item.alt} />
          </Link>
        ))}
      </section>
    </main>
  );
}

export default ExplorePage;
