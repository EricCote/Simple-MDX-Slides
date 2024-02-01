import { Link } from 'react-router-dom';
import Menu from './Menu';
import { Fragment } from 'react';
import slidedecks from '../slidedecks.json';

const decks = slidedecks;

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
        <Fragment key={lang.shortName}>
          <div>
            <h3>{lang.language}</h3>
            {decks
              .filter((deck) => deck.language === lang.shortName)
              .map((deck) => (
                <Fragment key={deck.route}>
                  <h5 className='my-0'>
                    <Link to={`decks/${lang.shortName}/${deck.route}`}>
                      {deck.title}
                    </Link>
                  </h5>
                  <p>{deck.description}</p>
                </Fragment>
              ))}
          </div>
          <hr className='my-5' />
        </Fragment>
      ))}

      <p>
        Please visit: <a href='https://www.reactacademy.live'>React Academy</a>
      </p>
    </>
  );
}
