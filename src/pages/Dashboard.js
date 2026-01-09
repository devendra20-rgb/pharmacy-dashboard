import React, { useState, useEffect } from 'react';
import { Row, Col, Card, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ articles: 0, conditions: 0, wellbeings: 0, doctors: 0 });
  const [activity, setActivity] = useState([]); // Mock for now, API se fetch karo later

  useEffect(() => {
    // Fetch stats from backend (add endpoints like /api/stats if not there)
    const fetchStats = async () => {
      try {
        const [articlesRes, conditionsRes, wellbeingsRes, doctorsRes] = await Promise.all([
          axios.get('/articles'),
          axios.get('/conditions'),
          axios.get('/wellbeings'),
          axios.get('/doctors')
        ]);
        setStats({
          articles: articlesRes.data.length,
          conditions: conditionsRes.data.length,
          wellbeings: wellbeingsRes.data.length,
          doctors: doctorsRes.data.length
        });
      } catch (error) {
        console.error('Stats fetch error:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <h2 className="mb-4"><i className="fas fa-tachometer-alt me-2"></i>Dashboard Overview</h2>

      <Row className="g-4 mb-4">
        <Col md={3} sm={6}>
          <Card className="h-100 shadow-sm border-0 text-center">
            <Card.Body className="d-flex flex-column align-items-center p-4">
              <i className="fas fa-newspaper fa-2x text-primary mb-3"></i>
              <Card.Title className="text-muted mb-2">Total Articles</Card.Title>
              <Card.Text className="text-primary mb-0 h3">{stats.articles}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="h-100 shadow-sm border-0 text-center">
            <Card.Body className="d-flex flex-column align-items-center p-4">
              <i className="fas fa-stethoscope fa-2x text-success mb-3"></i>
              <Card.Title className="text-muted mb-2">Total Conditions</Card.Title>
              <Card.Text className="text-success mb-0 h3">{stats.conditions}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="h-100 shadow-sm border-0 text-center">
            <Card.Body className="d-flex flex-column align-items-center p-4">
              <i className="fas fa-heart fa-2x text-info mb-3"></i>
              <Card.Title className="text-muted mb-2">Well-Being Topics</Card.Title>
              <Card.Text className="text-info mb-0 h3">{stats.wellbeings}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="h-100 shadow-sm border-0 text-center">
            <Card.Body className="d-flex flex-column align-items-center p-4">
              <i className="fas fa-user-md fa-2x text-warning mb-3"></i>
              <Card.Title className="text-muted mb-2">Doctors</Card.Title>
              <Card.Text className="text-warning mb-0 h3">{stats.doctors}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity - Mock, API se replace karo */}
      <Row>
        <Col md={8}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0"><i className="fas fa-chart-line me-2"></i>Recent Activity</h5>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item className="border-0 px-0 py-2">
                <i className="fas fa-plus-circle text-success me-2"></i>New condition added: Diabetes
              </ListGroup.Item>
              {/* Add more from API */}
            </ListGroup>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0"><i className="fas fa-bell me-2"></i>Notifications</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted small">No new notifications.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;