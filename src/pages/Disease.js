import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const Diseases = () => {
  const [diseases, setDiseases] = useState([]);
  const [categories, setCategories] = useState([]); // Cache categories
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '', // _id from select
    overview: '',
    symptoms: [], // Array
    causes: '',
    diagnosis: '',
    treatment: '',
    prevention: '',
    seo: { metaTitle: '', metaDescription: '', keywords: [] },
    tags: [],
    isPublished: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDiseases();
    fetchCategories(); // Fetch once and cache
  }, []);

  const fetchDiseases = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://pharmacy-backend-2onl.onrender.com/api/diseases');
      setDiseases(res.data);
    } catch (err) {
      setError('Failed to fetch diseases');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      const res = await axios.get('https://pharmacy-backend-2onl.onrender.com/api/categories');
      setCategories(res.data);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleAddSymptom = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      setFormData({
        ...formData,
        symptoms: [...formData.symptoms, e.target.value],
      });
      e.target.value = '';
    }
  };

  const handleRemoveSymptom = (index) => {
    const newSymptoms = formData.symptoms.filter((_, i) => i !== index);
    setFormData({ ...formData, symptoms: newSymptoms });
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      setFormData({
        ...formData,
        tags: [...formData.tags, e.target.value],
      });
      e.target.value = '';
    }
  };

  const handleRemoveTag = (index) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: newTags });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (selectedDisease) {
        const res = await axios.put(`https://pharmacy-backend-2onl.onrender.com/api/diseases/${selectedDisease._id}`, formData);
        setDiseases(diseases.map(d => d._id === selectedDisease._id ? res.data : d));
      } else {
        const res = await axios.post('https://pharmacy-backend-2onl.onrender.com/api/diseases', formData);
        setDiseases([...diseases, res.data]);
      }
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedDisease(null);
      setFormData({
        name: '',
        category: '',
        overview: '',
        symptoms: [],
        causes: '',
        diagnosis: '',
        treatment: '',
        prevention: '',
        seo: { metaTitle: '', metaDescription: '', keywords: [] },
        tags: [],
        isPublished: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving disease');
    }
  };

  const handleEdit = (disease) => {
    setFormData({
      ...disease,
      category: disease.category?._id || disease.category || '',
    });
    setSelectedDisease(disease);
    setShowEditModal(true);
  };

  const handleView = (disease) => {
    setSelectedDisease(disease);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this disease?')) {
      try {
        await axios.delete(`https://pharmacy-backend-2onl.onrender.com/api/diseases/${id}`);
        setDiseases(diseases.filter(d => d._id !== id));
      } catch (err) {
        setError('Failed to delete disease');
      }
    }
  };

  if (loading || categoryLoading) {
    return <div className="text-center p-5"><Spinner animation="border" /></div>;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="fas fa-disease me-2"></i>Manage Diseases</h2>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus me-2"></i>Add New Disease
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Table responsive hover>
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Published Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {diseases.map(disease => (
                <tr key={disease._id}>
                  <td>{disease.name}</td>
                  <td>{disease.category?.name || 'Uncategorized'}</td>
                  <td>{new Date(disease.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Badge bg={disease.isPublished ? 'success' : 'warning'}>
                      {disease.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleView(disease)}>
                      <i className="fas fa-eye"></i> View
                    </Button>
                    <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEdit(disease)}>
                      <i className="fas fa-edit"></i> Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(disease._id)}>
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
          setSelectedDisease(null);
        }} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>{selectedDisease ? 'Edit Disease' : 'Add New Disease'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
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
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Overview (Rich Editor)</Form.Label>
                    <ReactQuill
                      theme="snow"
                      value={formData.overview}
                      onChange={(val) => setFormData({ ...formData, overview: val })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Symptoms (Enter to add)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Press Enter to add symptom"
                      onKeyDown={handleAddSymptom}
                    />
                    <div className="mt-2">
                      {formData.symptoms.map((symptom, index) => (
                        <Badge key={index} bg="warning" className="me-1 mb-1">
                          {symptom} <Button variant="link" size="sm" onClick={() => handleRemoveSymptom(index)}>×</Button>
                        </Badge>
                      ))}
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Causes (Rich Editor)</Form.Label>
                    <ReactQuill
                      theme="snow"
                      value={formData.causes}
                      onChange={(val) => setFormData({ ...formData, causes: val })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Diagnosis (Rich Editor)</Form.Label>
                    <ReactQuill
                      theme="snow"
                      value={formData.diagnosis}
                      onChange={(val) => setFormData({ ...formData, diagnosis: val })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Treatment (Rich Editor)</Form.Label>
                    <ReactQuill
                      theme="snow"
                      value={formData.treatment}
                      onChange={(val) => setFormData({ ...formData, treatment: val })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Prevention (Rich Editor)</Form.Label>
                    <ReactQuill
                      theme="snow"
                      value={formData.prevention}
                      onChange={(val) => setFormData({ ...formData, prevention: val })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Tags (Enter to add)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Press Enter to add tag"
                      onKeyDown={handleAddTag}
                    />
                    <div className="mt-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} bg="secondary" className="me-1 mb-1">
                          {tag} <Button variant="link" size="sm" onClick={() => handleRemoveTag(index)}>×</Button>
                        </Badge>
                      ))}
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Published"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    />
                  </Form.Group>
                  {/* SEO */}
                  <h5>SEO</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Meta Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.seo.metaTitle}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaTitle: e.target.value } })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Meta Description</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.seo.metaDescription}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaDescription: e.target.value } })}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowAddModal(false);
              setShowEditModal(false);
              setSelectedDisease(null);
            }}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Save</Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* View Detail Modal */}
      {showViewModal && selectedDisease && (
        <Modal show={true} onHide={() => setShowViewModal(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>View Disease: {selectedDisease.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{selectedDisease.name}</h4>
            <p><strong>Category:</strong> {selectedDisease.category?.name || 'Uncategorized'}</p>
            <p><strong>Published:</strong> {new Date(selectedDisease.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {selectedDisease.isPublished ? 'Published' : 'Draft'}</p>
            <div className="mb-3">
              <h5>Overview</h5>
              <div dangerouslySetInnerHTML={{ __html: selectedDisease.overview || '' }} />
            </div>
            {selectedDisease.symptoms?.length > 0 && (
              <div className="mb-3">
                <h5>Symptoms</h5>
                <ul>
                  {selectedDisease.symptoms.map((symptom, index) => <li key={index}>{symptom}</li>)}
                </ul>
              </div>
            )}
            <div className="mb-3">
              <h5>Causes</h5>
              <div dangerouslySetInnerHTML={{ __html: selectedDisease.causes || '' }} />
            </div>
            <div className="mb-3">
              <h5>Diagnosis</h5>
              <div dangerouslySetInnerHTML={{ __html: selectedDisease.diagnosis || '' }} />
            </div>
            <div className="mb-3">
              <h5>Treatment</h5>
              <div dangerouslySetInnerHTML={{ __html: selectedDisease.treatment || '' }} />
            </div>
            <div className="mb-3">
              <h5>Prevention</h5>
              <div dangerouslySetInnerHTML={{ __html: selectedDisease.prevention || '' }} />
            </div>
            <p><strong>Tags:</strong> {selectedDisease.tags?.join(', ') || 'None'}</p>
            <p><strong>SEO Meta Title:</strong> {selectedDisease.seo?.metaTitle || 'N/A'}</p>
            <p><strong>SEO Meta Description:</strong> {selectedDisease.seo?.metaDescription || 'N/A'}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Diseases;