import { useNavigate } from "react-router-dom";
const categories = [
  {
    title: "tablouri",
  },
  {
    title: "candele",
  },
  {
    title: "altele",
  },
];
function HomeContent() {
  const navigate = useNavigate();
  return (
    <div className="home-content">
      <section className="categories">
        <div className="categories__container">
          {categories.map((cat, index) => (
            <div
              onClick={() => navigate(`/${cat.title}`)}
              className="categories__card"
              key={index}
            >
              <img
                className="categories__img"
                src={`/assets/${cat.title}.jpg`}
                alt={cat.title}
              />
              <div className="categories__overlay">
                <h2 className="categories__name">{cat.title}</h2>
                <button className="categories__btn">Vezi Colecția</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomeContent;
