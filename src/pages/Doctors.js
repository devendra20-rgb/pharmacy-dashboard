import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Form, Badge, Alert, Row, Col, Spinner } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    qualification: '',
    experience: 0,
    hospital: '',
    city: '',
    location: {
      address: '',
      area: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      coordinates: { lat: 0, lng: 0 },
    },
    contact: {
      phone: '',
      email: '',
    },
    availability: {
      days: [],
      timeFrom: '',
      timeTo: '',
    },
    expertise: [],
    certifications: [],
    licenseNumber: '',
    languages: [],
    bio: '',
    image: {
      url: '',
      alt: '',
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
    },
    tags: [],
    isActive: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://pharmacy-backend-2onl.onrender.com/api/doctors');
      setDoctors(res.data);
    } catch (err) {
      setError('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleAddArrayItem = (field, value) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], value],
    });
  };

  const handleRemoveArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleAddTag = (e, field) => {
    if (e.key === 'Enter' && e.target.value) {
      handleAddArrayItem(field, e.target.value);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (selectedDoctor) {
        const res = await axios.put(`https://pharmacy-backend-2onl.onrender.com/api/doctors/${selectedDoctor._id}`, formData);
        setDoctors(doctors.map(d => d._id === selectedDoctor._id ? res.data : d));
      } else {
        const res = await axios.post('https://pharmacy-backend-2onl.onrender.com/api/doctors', formData);
        setDoctors([...doctors, res.data]);
      }
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedDoctor(null);
      setFormData({
        name: '',
        specialization: '',
        qualification: '',
        experience: 0,
        hospital: '',
        city: '',
        location: {
          address: '',
          area: '',
          city: '',
          state: '',
          country: '',
          pincode: '',
          coordinates: { lat: 0, lng: 0 },
        },
        contact: {
          phone: '',
          email: '',
        },
        availability: {
          days: [],
          timeFrom: '',
          timeTo: '',
        },
        expertise: [],
        certifications: [],
        licenseNumber: '',
        languages: [],
        bio: '',
        image: {
          url: '',
          alt: '',
        },
        seo: {
          metaTitle: '',
          metaDescription: '',
          keywords: [],
        },
        tags: [],
        isActive: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving doctor');
    }
  };

  const handleEdit = (doctor) => {
    setFormData(doctor);
    setSelectedDoctor(doctor);
    setShowEditModal(true);
  };

  const handleView = (doctor) => {
    setSelectedDoctor(doctor);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this doctor?')) {
      try {
        await axios.delete(`https://pharmacy-backend-2onl.onrender.com/api/doctors/${id}`);
        setDoctors(doctors.filter(d => d._id !== id));
      } catch (err) {
        setError('Failed to delete doctor');
      }
    }
  };

  if (loading) {
    return <div className="text-center p-5"><Spinner animation="border" /></div>;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="fas fa-user-md me-2"></i>Manage Doctors</h2>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus me-2"></i>Add New Doctor
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Table responsive hover>
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>City</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(doctor => (
                <tr key={doctor._id}>
                  <td>{doctor.name}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.city}</td>
                  <td>
                    <Badge bg={doctor.isActive ? 'success' : 'secondary'}>
                      {doctor.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleView(doctor)}>
                      <i className="fas fa-eye"></i> View
                    </Button>
                    <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEdit(doctor)}>
                      <i className="fas fa-edit"></i> Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(doctor._id)}>
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
          setSelectedDoctor(null);
        }} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>{selectedDoctor ? 'Edit Doctor' : 'Add New Doctor'}</Modal.Title>
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
                    <Form.Label>Specialization</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Qualification</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Experience (Years)</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Hospital</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.hospital}
                      onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>License Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    />
                  </Form.Group>
                  {/* Expertise Array */}
                  <Form.Group className="mb-3">
                    <Form.Label>Expertise (Enter to add)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., Heart Failure"
                      onKeyDown={(e) => handleAddTag(e, 'expertise')}
                    />
                    <div className="mt-2">
                      {formData.expertise.map((item, index) => (
                        <Badge key={index} bg="info" className="me-1 mb-1">
                          {item} <Button variant="link" size="sm" onClick={() => handleRemoveArrayItem('expertise', index)}>×</Button>
                        </Badge>
                      ))}
                    </div>
                  </Form.Group>
                  {/* Certifications Array */}
                  <Form.Group className="mb-3">
                    <Form.Label>Certifications (Enter to add)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., ACLS Certified"
                      onKeyDown={(e) => handleAddTag(e, 'certifications')}
                    />
                    <div className="mt-2">
                      {formData.certifications.map((item, index) => (
                        <Badge key={index} bg="warning" className="me-1 mb-1">
                          {item} <Button variant="link" size="sm" onClick={() => handleRemoveArrayItem('certifications', index)}>×</Button>
                        </Badge>
                      ))}
                    </div>
                  </Form.Group>
                  {/* Languages Array */}
                  <Form.Group className="mb-3">
                    <Form.Label>Languages (Enter to add)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., English, Hindi"
                      onKeyDown={(e) => handleAddTag(e, 'languages')}
                    />
                    <div className="mt-2">
                      {formData.languages.map((item, index) => (
                        <Badge key={index} bg="success" className="me-1 mb-1">
                          {item} <Button variant="link" size="sm" onClick={() => handleRemoveArrayItem('languages', index)}>×</Button>
                        </Badge>
                      ))}
                    </div>
                  </Form.Group>
                  {/* Tags Array */}
                  <Form.Group className="mb-3">
                    <Form.Label>Tags (Enter to add)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Press Enter to add tag"
                      onKeyDown={(e) => handleAddTag(e, 'tags')}
                    />
                    <div className="mt-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} bg="secondary" className="me-1 mb-1">
                          {tag} <Button variant="link" size="sm" onClick={() => handleRemoveArrayItem('tags', index)}>×</Button>
                        </Badge>
                      ))}
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  {/* Location Nested */}
                  <h6>Location</h6>
                  <Form.Group className="mb-2">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.location.address}
                      onChange={(e) => setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Area</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.location.area}
                      onChange={(e) => setFormData({ ...formData, location: { ...formData.location, area: e.target.value } })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.location.city}
                      onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.location.state}
                      onChange={(e) => setFormData({ ...formData, location: { ...formData.location, state: e.target.value } })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.location.country}
                      onChange={(e) => setFormData({ ...formData, location: { ...formData.location, country: e.target.value } })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Pincode</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.location.pincode}
                      onChange={(e) => setFormData({ ...formData, location: { ...formData.location, pincode: e.target.value } })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.location.coordinates.lat}
                      onChange={(e) => setFormData({ ...formData, location: { ...formData.location, coordinates: { ...formData.location.coordinates, lat: parseFloat(e.target.value) } } })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.location.coordinates.lng}
                      onChange={(e) => setFormData({ ...formData, location: { ...formData.location, coordinates: { ...formData.location.coordinates, lng: parseFloat(e.target.value) } } })}
                    />
                  </Form.Group>
                  {/* Contact Nested */}
                  <h6>Contact</h6>
                  <Form.Group className="mb-2">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.contact.phone}
                      onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.contact.email}
                      onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })}
                    />
                  </Form.Group>
                  {/* Availability Nested */}
                  <h6>Availability</h6>
                  <Form.Group className="mb-2">
                    <Form.Label>Days (Enter to add, e.g., Mon)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Press Enter to add day"
                      onKeyDown={(e) => handleAddTag(e, 'availability.days')}
                    />
                    <div className="mt-2">
                      {formData.availability.days.map((day, index) => (
                        <Badge key={index} bg="primary" className="me-1 mb-1">
                          {day} <Button variant="link" size="sm" onClick={() => handleRemoveArrayItem('availability.days', index)}>×</Button>
                        </Badge>
                      ))}
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Time From</Form.Label>
                    <Form.Control
                      type="time"
                      value={formData.availability.timeFrom}
                      onChange={(e) => setFormData({ ...formData, availability: { ...formData.availability, timeFrom: e.target.value } })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Time To</Form.Label>
                    <Form.Control
                      type="time"
                      value={formData.availability.timeTo}
                      onChange={(e) => setFormData({ ...formData, availability: { ...formData.availability, timeTo: e.target.value } })}
                    />
                  </Form.Group>
                  {/* Image */}
                  <h6>Profile Image</h6>
                  <Form.Group className="mb-2">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                      type="url"
                      value={formData.image.url}
                      onChange={(e) => setFormData({ ...formData, image: { ...formData.image, url: e.target.value } })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Image Alt</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.image.alt}
                      onChange={(e) => setFormData({ ...formData, image: { ...formData.image, alt: e.target.value } })}
                    />
                  </Form.Group>
                  {/* SEO */}
                  <h6>SEO</h6>
                  <Form.Group className="mb-2">
                    <Form.Label>Meta Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.seo.metaTitle}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaTitle: e.target.value } })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Meta Description</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.seo.metaDescription}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaDescription: e.target.value } })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Keywords (Enter to add)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Press Enter to add keyword"
                      onKeyDown={(e) => handleAddTag(e, 'seo.keywords')}
                    />
                    <div className="mt-2">
                      {formData.seo.keywords.map((kw, index) => (
                        <Badge key={index} bg="light" className="me-1 mb-1">
                          {kw} <Button variant="link" size="sm" onClick={() => handleRemoveArrayItem('seo.keywords', index)}>×</Button>
                        </Badge>
                      ))}
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Active"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* Bio */}
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Bio (Rich Editor)</Form.Label>
                    <ReactQuill
                      theme="snow"
                      value={formData.bio}
                      onChange={(val) => setFormData({ ...formData, bio: val })}
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
              setSelectedDoctor(null);
            }}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Save</Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* View Detail Modal */}
      {showViewModal && selectedDoctor && (
        <Modal show={true} onHide={() => setShowViewModal(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>View Doctor: {selectedDoctor.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <h5>Basic Info</h5>
                <p><strong>Name:</strong> {selectedDoctor.name}</p>
                <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
                <p><strong>Qualification:</strong> {selectedDoctor.qualification}</p>
                <p><strong>Experience:</strong> {selectedDoctor.experience} years</p>
                <p><strong>Hospital:</strong> {selectedDoctor.hospital}</p>
                <p><strong>City:</strong> {selectedDoctor.city}</p>
                <p><strong>License Number:</strong> {selectedDoctor.licenseNumber}</p>
                <p><strong>Status:</strong> {selectedDoctor.isActive ? 'Active' : 'Inactive'}</p>
              </Col>
              <Col md={6}>
                <h5>Contact & Location</h5>
                <p><strong>Phone:</strong> {selectedDoctor.contact?.phone}</p>
                <p><strong>Email:</strong> {selectedDoctor.contact?.email}</p>
                <p><strong>Address:</strong> {selectedDoctor.location?.address}</p>
                <p><strong>Area:</strong> {selectedDoctor.location?.area}</p>
                <p><strong>State:</strong> {selectedDoctor.location?.state}</p>
                <p><strong>Country:</strong> {selectedDoctor.location?.country}</p>
                <p><strong>Pincode:</strong> {selectedDoctor.location?.pincode}</p>
                <p><strong>Coordinates:</strong> Lat: {selectedDoctor.location?.coordinates?.lat}, Lng: {selectedDoctor.location?.coordinates?.lng}</p>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={6}>
                <h5>Availability</h5>
                <p><strong>Days:</strong> {selectedDoctor.availability?.days?.join(', ')}</p>
                <p><strong>Time From:</strong> {selectedDoctor.availability?.timeFrom}</p>
                <p><strong>Time To:</strong> {selectedDoctor.availability?.timeTo}</p>
              </Col>
              <Col md={6}>
                <h5>Arrays</h5>
                <p><strong>Expertise:</strong> {selectedDoctor.expertise?.join(', ')}</p>
                <p><strong>Certifications:</strong> {selectedDoctor.certifications?.join(', ')}</p>
                <p><strong>Languages:</strong> {selectedDoctor.languages?.join(', ')}</p>
                <p><strong>Tags:</strong> {selectedDoctor.tags?.join(', ')}</p>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <h5>Bio</h5>
                <div dangerouslySetInnerHTML={{ __html: selectedDoctor.bio }} />
                {selectedDoctor.image?.url && (
                  <img src={selectedDoctor.image.url} alt={selectedDoctor.image.alt} className="img-fluid mt-3" style={{ maxHeight: '200px' }} />
                )}
                <h5 className="mt-3">SEO</h5>
                <p><strong>Meta Title:</strong> {selectedDoctor.seo?.metaTitle}</p>
                <p><strong>Meta Description:</strong> {selectedDoctor.seo?.metaDescription}</p>
                <p><strong>Keywords:</strong> {selectedDoctor.seo?.keywords?.join(', ')}</p>
                <p><strong>Created:</strong> {new Date(selectedDoctor.createdAt).toLocaleDateString()}</p>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Doctors;