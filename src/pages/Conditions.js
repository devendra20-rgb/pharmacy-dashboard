import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Table,
  Modal,
  Form,
  Badge,
  Alert,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const Conditions = () => {
  const [conditions, setConditions] = useState([]);
  const [categories, setCategories] = useState([]); // Cache categories
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "", // _id from select
    image: { url: "", alt: "", caption: "" },
    sections: [
      {
        title: "",
        blocks: [
          {
            heading: "",
            content: "",
            bullets: [],
            image: { url: "", alt: "", caption: "" },
          },
        ],
      },
    ],
    seo: { metaTitle: "", metaDescription: "", keywords: [] },
    tags: [],
    isPublished: true,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchConditions();
    fetchCategories(); // Fetch once and cache
  }, []);

  const fetchConditions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://pharmacy-backend-2onl.onrender.com/api/conditions"
      );
      setConditions(res.data);
    } catch (err) {
      setError("Failed to fetch conditions");
    } finally {
      setLoading(false);
    }
  };

  // Cache categories (no repeated calls)
  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      const res = await axios.get(
        "https://pharmacy-backend-2onl.onrender.com/api/categories"
      );
      setCategories(res.data);
    } catch (err) {
      setError("Failed to fetch categories");
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleAddSection = () => {
    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        {
          title: "",
          blocks: [
            {
              heading: "",
              content: "",
              bullets: [],
              image: { url: "", alt: "", caption: "" },
            },
          ],
        },
      ],
    });
  };

  const handleAddBlock = (sectionIndex) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].blocks.push({
      heading: "",
      content: "",
      bullets: [],
      image: { url: "", alt: "", caption: "" },
    });
    setFormData({ ...formData, sections: newSections });
  };

  const handleUpdateSection = (sectionIndex, field, value) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex][field] = value;
    setFormData({ ...formData, sections: newSections });
  };

  const handleUpdateBlock = (sectionIndex, blockIndex, field, value) => {
    const newSections = [...formData.sections];
    if (field === "bullets") {
      newSections[sectionIndex].blocks[blockIndex].bullets = value;
    } else if (field.startsWith("image.")) {
      const imgField = field.split(".")[1];
      newSections[sectionIndex].blocks[blockIndex].image[imgField] = value;
    } else {
      newSections[sectionIndex].blocks[blockIndex][field] = value;
    }
    setFormData({ ...formData, sections: newSections });
  };

  const handleRemoveSection = (sectionIndex) => {
    const newSections = formData.sections.filter((_, i) => i !== sectionIndex);
    setFormData({ ...formData, sections: newSections });
  };

  const handleRemoveBlock = (sectionIndex, blockIndex) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].blocks = newSections[sectionIndex].blocks.filter(
      (_, i) => i !== blockIndex
    );
    setFormData({ ...formData, sections: newSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      if (selectedCondition) {
        const res = await axios.put(
          `https://pharmacy-backend-2onl.onrender.com/api/conditions/${selectedCondition._id}`,
          formData
        );
        setConditions(
          conditions.map((c) =>
            c._id === selectedCondition._id ? res.data : c
          )
        );
      } else {
        const res = await axios.post(
          "https://pharmacy-backend-2onl.onrender.com/api/conditions",
          formData
        );
        setConditions([...conditions, res.data]);
      }
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedCondition(null);
      setFormData({
        name: "",
        category: "",
        image: { url: "", alt: "", caption: "" },
        sections: [
          {
            title: "",
            blocks: [
              {
                heading: "",
                content: "",
                bullets: [],
                image: { url: "", alt: "", caption: "" },
              },
            ],
          },
        ],
        seo: { metaTitle: "", metaDescription: "", keywords: [] },
        tags: [],
        isPublished: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error saving condition");
    }
  };

  const handleEdit = (condition) => {
    setFormData({
      ...condition,
      category: condition.category?._id || condition.category || "",
    });
    setSelectedCondition(condition);
    setShowEditModal(true);
  };

  const handleView = (condition) => {
    setSelectedCondition(condition);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this condition?")) {
      try {
        await axios.delete(
          `https://pharmacy-backend-2onl.onrender.com/api/conditions/${id}`
        );
        setConditions(conditions.filter((c) => c._id !== id));
      } catch (err) {
        setError("Failed to delete condition");
      }
    }
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && e.target.value) {
      setFormData({
        ...formData,
        tags: [...formData.tags, e.target.value],
      });
      e.target.value = "";
    }
  };

  const handleRemoveTag = (index) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: newTags });
  };

  if (loading || categoryLoading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="fas fa-stethoscope me-2"></i>Manage Conditions
        </h2>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus me-2"></i>Add New Condition
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
              {conditions.map((condition) => (
                <tr key={condition._id}>
                  <td>{condition.name}</td>
                  <td>{condition.category?.name || "Uncategorized"}</td>
                  <td>{new Date(condition.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Badge bg={condition.isPublished ? "success" : "warning"}>
                      {condition.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-1"
                      onClick={() => handleView(condition)}
                    >
                      <i className="fas fa-eye"></i> View
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-1"
                      onClick={() => handleEdit(condition)}
                    >
                      <i className="fas fa-edit"></i> Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(condition._id)}
                    >
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
        <Modal
          show={true}
          onHide={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedCondition(null);
          }}
          size="xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedCondition ? "Edit Condition" : "Add New Condition"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                  {/* Category Select from API (cached) */}
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          image: { ...formData.image, url: e.target.value },
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Image Alt Text</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.image.alt}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          image: { ...formData.image, alt: e.target.value },
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Image Caption</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.image.caption}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          image: { ...formData.image, caption: e.target.value },
                        })
                      }
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
                          {tag}{" "}
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => handleRemoveTag(index)}
                          >
                            ×
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Published"
                      checked={formData.isPublished}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isPublished: e.target.checked,
                        })
                      }
                    />
                  </Form.Group>
                  {/* Sections */}
                  <h5>Sections</h5>
                  {formData.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border p-3 mb-3">
                      <h6>Section {sectionIndex + 1}</h6>
                      <Form.Group className="mb-2">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          value={section.title}
                          onChange={(e) =>
                            handleUpdateSection(
                              sectionIndex,
                              "title",
                              e.target.value
                            )
                          }
                        />
                      </Form.Group>
                      <h6>Blocks in this Section</h6>
                      {section.blocks.map((block, blockIndex) => (
                        <div key={blockIndex} className="border p-2 mb-2">
                          <Form.Group className="mb-1">
                            <Form.Label>Heading</Form.Label>
                            <Form.Control
                              type="text"
                              value={block.heading}
                              onChange={(e) =>
                                handleUpdateBlock(
                                  sectionIndex,
                                  blockIndex,
                                  "heading",
                                  e.target.value
                                )
                              }
                            />
                          </Form.Group>
                          <Form.Group className="mb-1">
                            <Form.Label>Content (Rich Editor)</Form.Label>
                            <ReactQuill
                              theme="snow"
                              value={block.content}
                              onChange={(val) =>
                                handleUpdateBlock(
                                  sectionIndex,
                                  blockIndex,
                                  "content",
                                  val
                                )
                              }
                            />
                          </Form.Group>
                          <Form.Group className="mb-1">
                            <Form.Label>Bullets (comma-separated)</Form.Label>
                            <Form.Control
                              type="text"
                              value={block.bullets.join(", ")}
                              onChange={(e) =>
                                handleUpdateBlock(
                                  sectionIndex,
                                  blockIndex,
                                  "bullets",
                                  e.target.value
                                    .split(", ")
                                    .filter((b) => b.trim())
                                )
                              }
                            />
                          </Form.Group>
                          <Form.Group className="mb-1">
                            <Form.Label>Block Image URL</Form.Label>
                            <Form.Control
                              type="url"
                              value={block.image.url}
                              onChange={(e) =>
                                handleUpdateBlock(
                                  sectionIndex,
                                  blockIndex,
                                  "image.url",
                                  e.target.value
                                )
                              }
                            />
                          </Form.Group>
                          <Form.Group className="mb-1">
                            <Form.Label>Image Alt</Form.Label>
                            <Form.Control
                              type="text"
                              value={block.image.alt}
                              onChange={(e) =>
                                handleUpdateBlock(
                                  sectionIndex,
                                  blockIndex,
                                  "image.alt",
                                  e.target.value
                                )
                              }
                            />
                          </Form.Group>
                          <Form.Group className="mb-1">
                            <Form.Label>Image Caption</Form.Label>
                            <Form.Control
                              type="text"
                              value={block.image.caption}
                              onChange={(e) =>
                                handleUpdateBlock(
                                  sectionIndex,
                                  blockIndex,
                                  "image.caption",
                                  e.target.value
                                )
                              }
                            />
                          </Form.Group>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() =>
                              handleRemoveBlock(sectionIndex, blockIndex)
                            }
                          >
                            Remove Block
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleAddBlock(sectionIndex)}
                      >
                        Add Block
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="ms-2"
                        onClick={() => handleRemoveSection(sectionIndex)}
                      >
                        Remove Section
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleAddSection}
                  >
                    Add Section
                  </Button>
                  {/* SEO */}
                  <h5 className="mt-4">SEO</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Meta Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.seo.metaTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: { ...formData.seo, metaTitle: e.target.value },
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Meta Description</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.seo.metaDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: {
                            ...formData.seo,
                            metaDescription: e.target.value,
                          },
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
                setSelectedCondition(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* View Detail Modal */}
      {showViewModal && selectedCondition && (
        <Modal show={true} onHide={() => setShowViewModal(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>View Condition: {selectedCondition.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{selectedCondition.name}</h4>
            <p>
              <strong>Category:</strong>{" "}
              {selectedCondition.category?.name || "Uncategorized"}
            </p>
            <p>
              <strong>Published:</strong>{" "}
              {new Date(selectedCondition.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedCondition.isPublished ? "Published" : "Draft"}
            </p>
            {selectedCondition.image.url && (
              <img
                src={selectedCondition.image.url}
                alt={selectedCondition.image.alt}
                className="img-fluid mb-3"
                style={{ maxHeight: "200px" }}
              />
            )}
            {selectedCondition.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-4">
                <h5>{section.title}</h5>
                {section.blocks.map((block, blockIndex) => (
                  <div key={blockIndex} className="mb-3">
                    <h6>{block.heading}</h6>
                    <div dangerouslySetInnerHTML={{ __html: block.content }} />
                    {block.bullets.length > 0 && (
                      <ul>
                        {block.bullets.map((bullet, bIndex) => (
                          <li key={bIndex}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                    {block.image.url && (
                      <img
                        src={block.image.url}
                        alt={block.image.alt}
                        className="img-fluid"
                        style={{ maxHeight: "200px" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
            <p>
              <strong>Tags:</strong> {selectedCondition.tags.join(", ")}
            </p>
            <p>
              <strong>SEO Meta Title:</strong> {selectedCondition.seo.metaTitle}
            </p>
            <p>
              <strong>SEO Meta Description:</strong>{" "}
              {selectedCondition.seo.metaDescription}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Conditions;
