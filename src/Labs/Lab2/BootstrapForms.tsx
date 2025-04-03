//src/Labs/Lab2/BootstrapForms.tsx
import { useState } from 'react';
import {
  Form,
  FormGroup,
  FormControl,
  FormLabel,
  FormSelect,
  InputGroup,
  Col,
  Row,
  Button,
} from 'react-bootstrap';
import "./index.css";

export default function BootstrapForms() {
  // Add state to manage form values
  const [formState, setFormState] = useState({
    email: 'email@example.com',
    switchOne: false,
    switchTwo: true,
    radioSelection: '1'
  });

  // General change handler for all controls
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, name, value, type, checked } = e.target;
    const fieldName = name || id;
    
    setFormState(prev => ({
      ...prev,
      [fieldName]: type === 'checkbox' || type === 'switch' ? checked : value
    }));
  };

  return (
    <div id="wd-css-styling-forms">
      <h2>Forms</h2>
      <FormGroup className="mb-3" controlId="wd-email">
        <FormLabel>Email address</FormLabel>
        <FormControl type="email" placeholder="name@example.com" />
      </FormGroup>
      <FormGroup className="mb-3" controlId="wd-textarea">
        <FormLabel>Example textarea</FormLabel>
        <FormControl as="textarea" rows={3} />
      </FormGroup>

      <div id="wd-css-styling-dropdowns">
        <h3>Dropdowns</h3>
        {/* Fixed: Use defaultValue instead of selected */}
        <FormSelect defaultValue="Open this select menu">
          <option>Open this select menu</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </FormSelect>
      </div>

      <div id="wd-css-styling-switches">
        <h3>Switches</h3>
        {/* Fixed: Added onChange handlers to checked controls */}
        <Form.Check 
          type="switch" 
          checked={formState.switchOne} 
          onChange={handleChange} 
          id="wd-switch-1" 
          name="switchOne"
          label="Unchecked switch checkbox input" 
        />
        <Form.Check 
          type="switch" 
          checked={formState.switchTwo} 
          onChange={handleChange} 
          id="wd-switch-2" 
          name="switchTwo"
          label="Checked switch checkbox input" 
        />
        {/* Disabled controls don't need onChange handlers */}
        <Form.Check 
          type="switch" 
          defaultChecked={false} 
          disabled 
          id="switch-disabled-1" 
          label="Unchecked disabled switch checkbox input" 
        />
        <Form.Check 
          type="switch" 
          defaultChecked={true} 
          disabled 
          id="switch-disabled-2" 
          label="Checked disabled switch checkbox input" 
        />
      </div>

      <div id="wd-css-styling-range-and-sliders">
        <h3>Range</h3>
        <FormGroup controlId="wd-range1">
          <FormLabel>Example range</FormLabel>
          <Form.Control type="range" min="0" max="5" step="0.5" />
        </FormGroup>
      </div>

      <div id="wd-css-styling-addons">
        <h3>Addons</h3>
        <InputGroup className="mb-3">
          <InputGroup.Text>$</InputGroup.Text>
          <InputGroup.Text>0.00</InputGroup.Text>
          <FormControl />
        </InputGroup>
        <InputGroup>
          <FormControl />
          <InputGroup.Text>$</InputGroup.Text>
          <InputGroup.Text>0.00</InputGroup.Text>
        </InputGroup>
      </div>

      <div id="wd-css-responsive-forms-1">
        <h3>Responsive forms</h3>
        <Form.Group as={Row} className="mb-3" controlId="email1">
          <Form.Label column sm={2}>Email</Form.Label>
          <Col sm={10}>
            {/* Fixed: Added onChange handler for value prop */}
            <Form.Control 
              type="email" 
              value={formState.email} 
              onChange={handleChange} 
              name="email"
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="password1">
          <Form.Label column sm={2}>Password</Form.Label>
          <Col sm={10}>
            <Form.Control type="password" />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="textarea2">
          <Form.Label column sm={2}>Bio</Form.Label>
          <Col sm={10}>
            <Form.Control as="textarea" style={{ height: "100px" }} />
          </Col>
        </Form.Group>
      </div>

      <div id="wd-css-responsive-forms-2">
        <h3>Responsive forms</h3>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>Email</Form.Label>
            <Col sm={10}>
              <Form.Control type="email" placeholder="Email" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>Password</Form.Label>
            <Col sm={10}>
              <Form.Control type="password" placeholder="Password" />
            </Col>
          </Form.Group>
          <fieldset>
            <Form.Group as={Row} className="mb-3">
              <Form.Label as="legend" column sm={2}>Radios</Form.Label>
              <Col sm={10}>
                {/* Fixed: Added onChange handler and used controlled component pattern */}
                <Form.Check 
                  type="radio" 
                  label="first radio" 
                  checked={formState.radioSelection === '1'} 
                  onChange={() => setFormState(prev => ({...prev, radioSelection: '1'}))}
                  id="radio-1"
                  name="formHorizontalRadios" 
                />
                <Form.Check 
                  type="radio" 
                  label="second radio" 
                  checked={formState.radioSelection === '2'} 
                  onChange={() => setFormState(prev => ({...prev, radioSelection: '2'}))}
                  id="radio-2"
                  name="formHorizontalRadios" 
                />
                <Form.Check 
                  type="radio" 
                  label="third radio" 
                  checked={formState.radioSelection === '3'} 
                  onChange={() => setFormState(prev => ({...prev, radioSelection: '3'}))}
                  id="radio-3"
                  name="formHorizontalRadios" 
                />
              </Col>
            </Form.Group>
          </fieldset>
          <Form.Group as={Row} className="mb-3">
            <Col sm={{ span: 10, offset: 2 }}>
              {/* Fixed: Added onChange handler */}
              <Form.Check 
                label="Remember me" 
                id="remember-me"
                name="rememberMe"
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Col>
              <Button type="submit">Sign in</Button>
            </Col>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}