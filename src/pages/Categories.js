import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (selectedCategory) {
        const res = await axios.put(`http://localhost:5000/api/categories/${selectedCategory._id}`, formData);
        setCategories(categories.map(c => c._id === selectedCategory._id ? res.data : c));
      } else {
        const res = await axios.post('http://localhost:5000/api/categories', formData);
        setCategories([...categories, res.data]);
      }
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedCategory(null);
      setFormData({
        name: '',
        description: '',
        isActive: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving category');
    }
  };

  const handleEdit = (category) => {
    setFormData(category);
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleView = (category) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await axios.delete(`http://localhost:5000/api/categories/${id}`);
        setCategories(categories.filter(c => c._id !== id));
      } catch (err) {
        setError('Failed to delete category');
      }
    }
  };

  if (loading) {
    return <div className="text-center p-5"><Spinner animation="border" /></div>;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="fas fa-tags me-2"></i>Manage Categories</h2>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus me-2"></i>Add New Category
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Table responsive hover>
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.description?.substring(0, 50)}...</td>
                  <td>
                    <Badge bg={category.isActive ? 'success' : 'secondary'}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleView(category)}>
                      <i className="fas fa-eye"></i> View
                    </Button>
                    <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEdit(category)}>
                      <i className="fas fa-edit"></i> Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(category._id)}>
                      <i className="fas fa-trash"></i> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <Modal show={true} onHide={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          setSelectedCategory(null);
        }}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedCategory ? 'Edit Category' : 'Add New Category'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Active"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowAddModal(false);
              setShowEditModal(false);
              setSelectedCategory(null);
            }}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Save</Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* View Detail Modal */}
      {showViewModal && selectedCategory && (
        <Modal show={true} onHide={() => setShowViewModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>View Category: {selectedCategory.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Name:</strong> {selectedCategory.name}</p>
            <p><strong>Description:</strong> {selectedCategory.description}</p>
            <p><strong>Status:</strong> {selectedCategory.isActive ? 'Active' : 'Inactive'}</p>
            <p><strong>Created:</strong> {new Date(selectedCategory.createdAt).toLocaleDateString()}</p>
            <p><strong>Updated:</strong> {new Date(selectedCategory.updatedAt).toLocaleDateString()}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Categories;