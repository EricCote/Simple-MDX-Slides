// This creates a "goto" popup when the user presses the letter G.
// The popup prompts a slide number, and navigates to it.
import {
  ChangeEvent,
  FormEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import DarkModeMenu from '../dark-mode/DarkModeMenu';
import { useLanguage } from './LanguageProvider';

interface TranslationObject {
  [key: string]: translationTable;
}

interface translationTable {
  [key: string]: string;
}

const textes: TranslationObject = {
  fr: {
    dark: 'Mode dark',
    slideNum: 'Numéro de Diapositive',
    cancel: 'Annuler',
    goto: 'Aller à la diapositive',
    of: ' de ',
    full: 'Mode plein écran',
  },
  en: {
    dark: 'Dark Mode',
    slideNum: 'Slide Number',
    cancel: 'Cancel',
    goto: 'Go to Slide',
    of: ' of ',
    full: 'Full Screen Mode',
  },
};

//this flag will only register the event handler once when in StrictMode (dev mode)
let isEventRegistered = false;

const options = { capture: true };

function GotoPopup() {
  const [show, setShow] = useState<boolean>(false);
  const [num, setNum] = useState<number>(+location.hash?.slice(2) || 1);
  const [maxPages, setMaxPages] = useState<number>(100);
  const txtNombre = useRef<HTMLInputElement>(undefined);
  let [lang] = useLanguage();

  function handleClose() {
    setShow(false);
  }

  function GotoPage(evt: FormEvent) {
    evt.preventDefault();
    //get the page number
    const page = num;
    setShow(false); // hide modal
    if (!Number.isInteger(+page)) return;
    // we need to change the page only once the fade animation
    // is done. A delay of 500 ms is good enough
    setTimeout(() => changePage(`#s${page}`), 500);
  }

  const t = useCallback(
    (str: string) => {
      return textes[lang!][str];
    },
    [lang]
  );

  function changePage(page: string) {
    location.assign(page);
  }

  function changeHandler(evt: ChangeEvent<HTMLInputElement>) {
    setNum(+evt.target.value);
  }

  function handleKeyDown(evt: KeyboardEvent) {
    if ((evt.metaKey || evt.ctrlKey) && evt.key == 'g') {
      evt.stopImmediatePropagation();
      evt.stopPropagation();
      evt.preventDefault();

      setShow(!txtNombre.current);
    }
  }

  useEffect(() => {
    if (!isEventRegistered) {
      window.removeEventListener('keydown', handleKeyDown, options);
      window.addEventListener('keydown', handleKeyDown, options);
      isEventRegistered = true;
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown, options);
      isEventRegistered = false;
    };
  }, []);

  useEffect(() => {
    //This will add slide numbers, from 1 to x
    let results = document.querySelectorAll('article>*');
    if (results[0].id == 's1') return;
    results.forEach((slide, idx) => {
      slide.id = 's' + (idx + 1).toString();
      (slide as HTMLFormElement).tabIndex = 0;
      let div = document.createElement('div');
      div.innerHTML = (idx + 1).toString();
      div.className = 'corner-number';
      div.title = (idx + 1).toString() + t('of') + results.length;
      slide.appendChild(div);
      div.onclick = () => {
        setShow(true);
      };
    });
    setMaxPages(results.length);

    //Get the page number
    let pageRef: string = 's1';
    if (location.hash) {
      pageRef = location.hash.slice(1);
    }

    const focusedPage: HTMLFormElement = document.querySelector(`#${pageRef}`)!;
    if (focusedPage) {
      focusedPage.scrollIntoView({ behavior: 'instant' });
      focusedPage.focus();
    } else {
      location.hash = '';
    }
  }, [t]);

  //If we've just started re-rendering after starting to show the popup, set the focus.
  useEffect(() => {
    if (show) {
      const article = document.querySelector('article')!;
      setNum(Math.round(article.scrollLeft / article.clientWidth) + 1);
      txtNombre.current!.focus();
      txtNombre.current!.select();
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      autoFocus={false}
      restoreFocus={false}
    >
      <Form onSubmit={GotoPage}>
        <Modal.Header closeButton>
          <Modal.Title>Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex flex-row'>
            <Button
              variant='secondary'
              onClick={() => {
                document.documentElement.requestFullscreen();
              }}
            >
              {t('full')}
            </Button>
            <div className='ms-auto align-self-center d-flex flex-row'>
              {t('dark')}
              <DarkModeMenu className='ms-3' onChanged={handleClose} />
            </div>
          </div>
          <hr />
          <Form.Control
            type='number'
            ref={txtNombre as RefObject<HTMLInputElement | null>}
            placeholder={t('slideNum')}
            //defaultValue={location.hash?.slice(2) || '1'}
            value={num}
            onChange={changeHandler}
          />
          <Form.Range
            min={1}
            max={maxPages}
            value={num}
            onChange={changeHandler}
          ></Form.Range>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            {t('cancel')}
          </Button>
          <Button type='submit' variant='primary'>
            {t('goto')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default GotoPopup;
