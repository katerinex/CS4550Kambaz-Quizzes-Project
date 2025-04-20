//src/Labs/Lab2/BootstrapGrids.tsx
import { Row, Col } from 'react-bootstrap';
import "./index.css";
export default function BootstrapGrids() {
  return (     
<div id="wd-bs-responsive-dramatic">
  <h2>Responsive grid system</h2>
  <Row>
    <Col xs={12} sm={6} md={4} lg={3} xl={2} xxl={1} 
         className="bg-warning">
         <h4>1</h4></Col>
    <Col xs={12} sm={6} md={4} lg={3} xl={2} xxl={1}
         className="bg-primary text-white">
         <h4>2</h4></Col>
    <Col xs={12} sm={6} md={4} lg={3} xl={2} xxl={1}
         className="bg-danger text-white">
         <h4>3</h4></Col>
    <Col xs={12} sm={6} md={4} lg={3} xl={2} xxl={1}
         className="bg-success text-white">
         <h4>4</h4></Col>
    <Col xs={12} sm={6} md={4} lg={3} xl={2} xxl={1}
         className="bg-warning">
         <h4>5</h4></Col>
    <Col xs={12} sm={6} md={4} lg={3} xl={2} xxl={1}
         className="bg-primary text-white">
         <h4>6</h4></Col>
    <Col xs={12} sm={6} md={4} lg={3} xl={2} xxl={1}
         className="bg-danger text-white">
         <h4>7</h4></Col>
    <Col xs={12} sm={6} md={4} lg={3} xl={2} xxl={1}
         className="bg-success text-white">
         <h4>8</h4></Col>
    <Col xs={12} sm={6} md={4} lg={3} xl={2} xxl={1}
         className="bg-warning">
         <h4>9</h4></Col>
    <Col xs={12} sm={6} md={4} lg={3} xl={2} xxl={1}
         className="bg-primary text-white">
         <h4>10</h4></Col>
    <Col xs={12} sm={6} md={4} lg={3} xl={2} xxl={1}
         className="bg-danger text-white">
         <h4>11</h4></Col>
   <Col  xs={12} sm={6} md={4} lg={3} xl={2} xxl={1}
         className="bg-success text-white">
         <h4>12</h4></Col>
   </Row>
</div>

  );
}



