import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import DarkModeMenu from '../components/dark-mode/DarkModeMenu';
import { LocalTheme } from '../components/dark-mode/ThemeProvider';

export default function Menu() {
  let location = useLocation();
  return (
    <LocalTheme theme='auto'>
      <Navbar expand='lg' bg='body' className='mb-4'>
        <Container>
          <Navbar.Brand as='h1'>
            <Link
              to='/'
              className='text-decoration-none'
              style={{ fontSize: '3rem' }}
            >
              React Academy
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav
              activeKey={location.pathname}
              variant='pills'
              className='me-auto'
            >
              <DarkModeMenu />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </LocalTheme>
  );
}
