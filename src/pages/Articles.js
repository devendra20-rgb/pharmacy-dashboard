import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Form, Badge, Alert, Row, Col, Spinner } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]); // New state for categories
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true); // Separate loading for categories
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: { name: '', specialization: '', qualification: '' },
    category: '', // Will be _id from select
    type: 'article',
    sections: [{ heading: '', content: '', bullets: [], image: { url: '', alt: '' } }],
    image: { url: '', alt: '', caption: '' },
    seo: { metaTitle: '', metaDescription: '', keywords: [] },
    tags: [],
    isPublished: true,
  });
  const [error, setError] = useState('');
  const [sectionIndex, setSectionIndex] = useState(0); // For editing specific section

  useEffect(() => {
    fetchArticles();
    fetchCategories(); // Fetch categories once
  }, []);

  // Fetch articles (unchanged)
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/articles');
      setArticles(res.data);
    } catch (err) {
      setError('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  // New: Fetch categories once and cache in state (no repeated calls)
  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data); // Cache in state
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleAddSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { heading: '', content: '', bullets: [], image: { url: '', alt: '' } }],
    });
  };

  const handleUpdateSection = (index, field, value) => {
    const newSections = [...formData.sections];
    if (field === 'bullets') {
      newSections[index].bullets = value;
    } else if (field.startsWith('image.')) {
      const imgField = field.split('.')[1];
      newSections[index].image[imgField] = value;
    } else {
      newSections[index][field] = value;
    }
    setFormData({ ...formData, sections: newSections });
  };

  const handleRemoveSection = (index) => {
    const newSections = formData.sections.filter((_, i) => i !== index);
    setFormData({ ...formData, sections: newSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (selectedArticle) {
        const res = await axios.put(`http://localhost:5000/api/articles/${selectedArticle._id}`, formData);
        setArticles(articles.map(a => a._id === selectedArticle._id ? res.data : a));
      } else {
        const res = await axios.post('http://localhost:5000/api/articles', formData);
        setArticles([...articles, res.data]);
      }
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedArticle(null);
      setFormData({
        title: '',
        author: { name: '', specialization: '', qualification: '' },
        category: '', // Reset to empty
        type: 'article',
        sections: [{ heading: '', content: '', bullets: [], image: { url: '', alt: '' } }],
        image: { url: '', alt: '', caption: '' },
        seo: { metaTitle: '', metaDescription: '', keywords: [] },
        tags: [],
        isPublished: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving article');
    }
  };

  const handleEdit = (article) => {
    setFormData({
      ...article,
      category: article.category?._id || article.category || '', // Set _id for select
    });
    setSelectedArticle(article);
    setShowEditModal(true);
  };

  const handleView = (article) => {
    setSelectedArticle(article);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this article?')) {
      try {
        await axios.delete(`http://localhost:5000/api/articles/${id}`);
        setArticles(articles.filter(a => a._id !== id));
      } catch (err) {
        setError('Failed to delete article');
      }
    }
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

  if (loading || categoryLoading) {
    return <div className="text-center p-5"><Spinner animation="border" /></div>;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="fas fa-newspaper me-2"></i>Manage Articles</h2>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus me-2"></i>Add New Article
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Table responsive hover>
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Published Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article._id}>
                  <td>{article.title}</td>
                  <td>{article.author?.name}</td>
                  <td>{article.category?.name || 'Uncategorized'}</td>
                  <td>{new Date(article.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Badge bg={article.isPublished ? 'success' : 'warning'}>
                      {article.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleView(article)}>
                      <i className="fas fa-eye"></i> View
                    </Button>
                    <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEdit(article)}>
                      <i className="fas fa-edit"></i> Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(article._id)}>
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
          setSelectedArticle(null);
        }} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>{selectedArticle ? 'Edit Article' : 'Add New Article'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Author Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.author.name}
                      onChange={(e) => setFormData({ ...formData, author: { ...formData.author, name: e.target.value } })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Author Specialization</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.author.specialization}
                      onChange={(e) => setFormData({ ...formData, author: { ...formData.author, specialization: e.target.value } })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Author Qualification</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.author.qualification}
                      onChange={(e) => setFormData({ ...formData, author: { ...formData.author, qualification: e.target.value } })}
                    />
                  </Form.Group>
                  {/* New: Category Select from API */}
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
                    <Form.Label>Featured Image URL</Form.Label>
                    <Form.Control
                      type="url"
                      value={formData.image.url}
                      onChange={(e) => setFormData({ ...formData, image: { ...formData.image, url: e.target.value } })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Image Alt Text</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.image.alt}
                      onChange={(e) => setFormData({ ...formData, image: { ...formData.image, alt: e.target.value } })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Image Caption</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.image.caption}
                      onChange={(e) => setFormData({ ...formData, image: { ...formData.image, caption: e.target.value } })}
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
                  {/* Sections */}
                  <h5>Sections</h5>
                  {formData.sections.map((section, index) => (
                    <div key={index} className="border p-3 mb-3">
                      <h6>Section {index + 1}</h6>
                      <Form.Group className="mb-2">
                        <Form.Label>Heading</Form.Label>
                        <Form.Control
                          type="text"
                          value={section.heading}
                          onChange={(e) => handleUpdateSection(index, 'heading', e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Content (Rich Editor)</Form.Label>
                        <ReactQuill
                          theme="snow"
                          value={section.content}
                          onChange={(val) => handleUpdateSection(index, 'content', val)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Bullets (comma-separated)</Form.Label>
                        <Form.Control
                          type="text"
                          value={section.bullets.join(', ')}
                          onChange={(e) => handleUpdateSection(index, 'bullets', e.target.value.split(', ').filter(b => b.trim()))}
                        />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Section Image URL</Form.Label>
                        <Form.Control
                          type="url"
                          value={section.image.url}
                          onChange={(e) => handleUpdateSection(index, 'image.url', e.target.value)}
                        />
                      </Form.Group>
                      <Button variant="outline-danger" size="sm" onClick={() => handleRemoveSection(index)}>
                        Remove Section
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline-secondary" size="sm" onClick={handleAddSection}>
                    Add Section
                  </Button>
                  {/* SEO */}
                  <h5 className="mt-4">SEO</h5>
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
              setSelectedArticle(null);
            }}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Save</Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* View Detail Modal */}
      {showViewModal && selectedArticle && (
        <Modal show={true} onHide={() => setShowViewModal(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>View Article: {selectedArticle.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{selectedArticle.title}</h4>
            <p><strong>Author:</strong> {selectedArticle.author?.name} ({selectedArticle.author?.specialization})</p>
            <p><strong>Category:</strong> {selectedArticle.category?.name || 'Uncategorized'}</p>
            <p><strong>Published:</strong> {new Date(selectedArticle.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {selectedArticle.isPublished ? 'Published' : 'Draft'}</p>
            {selectedArticle.image.url && (
              <img src={selectedArticle.image.url} alt={selectedArticle.image.alt} className="img-fluid mb-3" style={{ maxHeight: '200px' }} />
            )}
            {selectedArticle.sections.map((section, index) => (
              <div key={index} className="mb-4">
                <h5>{section.heading}</h5>
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
                {section.bullets.length > 0 && (
                  <ul>
                    {section.bullets.map((bullet, bIndex) => <li key={bIndex}>{bullet}</li>)}
                  </ul>
                )}
                {section.image.url && (
                  <img src={section.image.url} alt={section.image.alt} className="img-fluid" style={{ maxHeight: '200px' }} />
                )}
              </div>
            ))}
            <p><strong>Tags:</strong> {selectedArticle.tags.join(', ')}</p>
            <p><strong>SEO Meta Title:</strong> {selectedArticle.seo.metaTitle}</p>
            <p><strong>SEO Meta Description:</strong> {selectedArticle.seo.metaDescription}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Articles;