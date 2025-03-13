// src/Labs/TOC.tsx
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";

export default function TOC() {
  const { pathname } = useLocation();

  return (
    <Nav variant="pills" id="wd-toc">
      <Nav.Item>
        <Nav.Link as={Link} to="Lab1" id="wd-a1" active={pathname.includes("Lab1")}>
          Lab 1
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="Lab2" id="wd-a2" active={pathname.includes("Lab2")}>
          Lab 2
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="Lab3" id="wd-a3" active={pathname.includes("Lab3")}>
          Lab 3
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="Lab4" id="wd-a4" active={pathname.includes("Lab4")}>
          Lab 4
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="Lab5" id="wd-a5" active={pathname.includes("Lab5")}>
          Lab 5
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/Kambaz" id="wd-a3">
          Kambaz
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="https://github.com/katerinex/kambaz-react-web-app" target="_blank" rel="noopener noreferrer">
          My GitHub
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}