import { Link } from 'react-router-dom';
import Menu from './Menu';

const decks = [
  {
    route: 'fundamentals',
    title: 'React Fundamentals',
    description: 'Your first steps with React',
    language: 'en',
  },
  {
    route: 'fundamentals',
    title: 'Fondements de React',
    description: 'Vos premiers pas en React',
    language: 'fr',
  },
  {
    route: 'remix',
    title: 'Intro à Remix',
    description: 'Intro éclair à Remix',
    language: 'fr',
  },

  {
    route: 'react-router',
    title: 'React Router',
    description: 'Introducing React Router',
    language: 'en',
  },
  {
    route: 'react-router',
    title: 'Routage React',
    description: 'Introduction à React Router',
    language: 'fr',
  },
  {
    route: 'react-pdf',
    title: 'Générer pdf avec React',
    description: "C'est possible de générer des pdf avec React",
    language: 'fr',
  },
];

const languages = [
  { language: 'Français', shortName: 'fr' },
  { language: 'English', shortName: 'en' },
];

export default function Home() {
  document.documentElement.lang = 'en';
  return (
    <>
      <Menu />
      <h1 className='my-5'>React Slides</h1>
      {languages.map((lang) => (
        <>
          <div>
            <h3>{lang.language}</h3>
            {decks
              .filter((deck) => deck.language === lang.shortName)
              .map((deck) => (
                <>
                  <h5>
                    <Link to={`decks/${lang.shortName}/${deck.route}`}>
                      {deck.title}
                    </Link>
                  </h5>
                  <p>{deck.description}</p>
                </>
              ))}
          </div>
          <hr className='my-5' />
        </>
      ))}

      <p>
        Please visit: <a href='https://www.reactacademy.live'>React Academy</a>
      </p>
    </>
  );
}
