// This creates a "goto" popup when the user presses the letter G.
// The popup prompts a slide number, and navigates to it.
import { FormEvent, RefObject, useEffect, useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

//this flag will only register the event handler once when in StrictMode (dev mode)
let isEventRegistered = false;

function GotoPopup() {
  const [show, setShow] = useState<boolean>(false);
  const txtNombre = useRef<HTMLInputElement>();

  let options = { capture: true };

  function handleClose() {
    setShow(false);
  }

  function GotoPage(evt: FormEvent) {
    evt.preventDefault();
    //get the page number
    const page = txtNombre.current!.value;
    setShow(false); // hide modal
    // we need to change the page only once the fade animation
    // is done. A delay of 500 ms is good enough
    setTimeout(() => changePage(`#s${page}`), 500);
  }

  function changePage(page: string) {
    location.assign(page);
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
      slide.appendChild(div);
      div.onclick = () => setShow(true);
    });

    //Get the page number
    let pageRef: string = 's1';
    if (location.hash) {
      pageRef = location.hash.slice(1);
    }

    const focusedPage: HTMLFormElement = document.querySelector(`#${pageRef}`)!;
    focusedPage.scrollIntoView({ behavior: 'instant' });
    focusedPage?.focus();
  }, []);

  //If we've just started re-rendering after starting to show the popup, set the focus.
  useEffect(() => {
    if (show) {
      txtNombre.current!.focus();
    } else {
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={GotoPage}>
        <Modal.Header closeButton>
          <Modal.Title>Go to Slide</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            ref={txtNombre as RefObject<HTMLInputElement>}
            placeholder='Slide Number'
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button type='submit' variant='primary'>
            Go to Slide
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default GotoPopup;
