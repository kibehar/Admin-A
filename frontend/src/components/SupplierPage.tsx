import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Pagination,
  Form,
  Row,
  Col,
  message,
  Popconfirm,
} from "antd";
import {
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
} from "../api/api";
import AdminLayout from "../components/AdminLayout";

const { Search } = Input;

const SupplierPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});
  const pageSize = 5;

  useEffect(() => {
    fetchSuppliers();
  }, [currentPage]);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const data = await getSuppliers();
      setSuppliers(data);
      setTotalSuppliers(data.length);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await addSupplier(formData);
      message.success("Supplier added successfully!");
      setIsCreateModalVisible(false);
      setFormData({});
      fetchSuppliers();
    } catch {
      message.error("Failed to add supplier.");
    }
  };

  const handleUpdate = async () => {
    try {
      if (!selectedSupplier) return;
      await updateSupplier(selectedSupplier._id, formData);
      setIsEditModalVisible(false);
      setFormData({});
      fetchSuppliers();
    } catch {
      message.error("Failed to update supplier.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSupplier(id);
      message.success("Supplier deleted successfully!");
      fetchSuppliers();
    } catch {
      message.error("Failed to delete supplier.");
    }
  };

  const handleEdit = (supplier: any) => {
    setSelectedSupplier(supplier);
    setFormData(supplier);
    setIsEditModalVisible(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const columns = [
    { title: "First Name", dataIndex: "firstName" },
    { title: "Last Name", dataIndex: "lastName" },
    { title: "Address", dataIndex: "address" },
    { title: "Street No", dataIndex: "streetNumber" },
    { title: "House No", dataIndex: "houseNumber" },
    { title: "Contact", dataIndex: "contact" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this supplier?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <Search placeholder="Search suppliers" allowClear style={{ width: 300 }} />
        <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
          Add Supplier
        </Button>
      </div>

      {}
      <Modal
        title="Add Supplier"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={handleCreate}
        okText="Add"
      >
        <SupplierForm formData={formData} handleChange={handleChange} />
      </Modal>

      {}
      <Modal
        title="Edit Supplier"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleUpdate}
        okText="Update"
      >
        <SupplierForm formData={formData} handleChange={handleChange} />
      </Modal>

      {/* Table */}
      <Table
        dataSource={suppliers}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={false}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalSuppliers}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 20 }}
      />
    </AdminLayout>
  );
};

const SupplierForm = ({
  formData,
  handleChange,
}: {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <Form layout="vertical">
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label="First Name" required>
          <Input name="firstName" value={formData.firstName || ""} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Last Name" required>
          <Input name="lastName" value={formData.lastName || ""} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Contact" required>
          <Input name="contact" value={formData.contact || ""} onChange={handleChange} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Email" required>
          <Input name="email" value={formData.email || ""} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Address">
          <Input name="address" value={formData.address || ""} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Street Number">
          <Input name="streetNumber" value={formData.streetNumber || ""} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="House Number">
          <Input name="houseNumber" value={formData.houseNumber || ""} onChange={handleChange} />
        </Form.Item>
      </Col>
    </Row>
  </Form>
);

export default SupplierPage;
