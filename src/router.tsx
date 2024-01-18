import Home from './homepage/Home';

import Sandpack from './components/Sandpack';
import Diagram from './components/slides/Diagram';
import Illustration from './components/slides/Illustration';
import { createBrowserRouter, Outlet, useParams } from 'react-router-dom';
import { lazy, Suspense, useEffect, useMemo } from 'react';
import GotoPopup from './components/slides/GotoPopup';

import Status from './decks/AspNetWebApi/api1.fr.mdx';

const components = {
  Sandpack,
  Diagram,
  Illustration,
  TwoColumns({ className, children, style }: any) {
    return (
      <aside
        className={className}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          columnGap: 10,
          ...style,
        }}
      >
        {children}
      </aside>
    );
  },
  wrapper({ children }: any) {
    //layout function for mdx.
    useEffect(() => {
      //This will add slide numbers, from 1 to x
      let results = document.querySelectorAll('article>*');
      results.forEach((slide, idx) => {
        slide.id = (idx + 1).toString();
      });
      if (location.hash) {
        location.assign(location.hash);
      }
    });
    return (
      <>
        <GotoPopup />
        <>{children}</>
      </>
    );
  },

  Hint({ toggle, children }: any) {
    let { lang } = useParams();
    lang = lang ?? 'en';
    toggle = toggle ?? lang === 'fr' ? 'Indice' : 'Hint';
    return (
      <details>
        <summary className='btn-link link-info'>{toggle}</summary>
        {children}
      </details>
    );
  },
};

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Outlet />
      </>
    ),
    //errorElement: <ErrorBoundary />,

    children: [
      { index: true, element: <Home /> },
      {
        index: false,
        element: (
          <article>
            <Outlet />
          </article>
        ),
        children: [
          {
            path: 'status',
            element: <Status components={components} />,
          },
          {
            path: 'decks/:lang/',
            element: <Language />,
            children: [
              {
                path: ':doc',
                element: <MyLoader />,
              },
              {
                path: ':subject/:doc',
                element: <MyLoader />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;

function MyLoader() {
  const { subject, doc, lang } = useParams();

  const MyMdx = useMemo(
    () =>
      lazy(() => {
        if (subject) {
          return import(`./decks/${subject}/${doc}.${lang}.mdx`);
        } else {
          return import(`./decks/${doc}.${lang}.mdx`);
        }
      }),
    [subject, doc, lang]
  );

  return (
    <Suspense fallback={<div>Page is Loading...</div>}>
      <MyMdx components={components} />
    </Suspense>
  );
}

function Language() {
  // Get the lang param from the URL.
  let { lang } = useParams();
  lang = lang ?? 'en';
  document.documentElement.lang = lang;
  return (
    <>
      <Outlet />
    </>
  );
}
