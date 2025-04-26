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
  getWarehouses,
  addWarehouse,
  getWarehouseDetails,
  updateWarehouse,
  deleteWarehouse,
} from "../api/api";
import AdminLayout from "../components/AdminLayout";

const { Search } = Input;

const WarehousePage: React.FC = () => {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [totalWarehouses, setTotalWarehouses] = useState(0);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formData, setFormData] = useState<any>({ name: "", location: "" });
  const [editId, setEditId] = useState<string>("");

  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [warehouseItems, setWarehouseItems] = useState<any[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");

  const pageSize = 5;

  useEffect(() => {
    fetchWarehouses();
  }, [currentPage, searchText]);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const data = await getWarehouses();
      const filtered = data.filter((wh: any) =>
        wh.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setWarehouses(filtered);
      setTotalWarehouses(filtered.length);
    } catch (err) {
      console.error("Error fetching warehouses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await addWarehouse(formData);
      message.success("Warehouse added successfully!");
      setIsCreateModalVisible(false);
      setFormData({ name: "", location: "" });
      fetchWarehouses();
    } catch (error) {
      console.error("Error creating warehouse:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateWarehouse(editId, formData);
      message.success("Warehouse updated successfully!");
      setIsEditModalVisible(false);
      setFormData({ name: "", location: "" });
      fetchWarehouses();
    } catch (error) {
      console.error("Error updating warehouse:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWarehouse(id);
      message.success("Warehouse deleted and items returned to inventory!");
      fetchWarehouses();
    } catch (error) {
      console.error("Error deleting warehouse:", error);
    }
  };

  const handleViewDetails = async (warehouseId: string, warehouseName: string) => {
    try {
      const res = await getWarehouseDetails(warehouseId);
      setWarehouseItems(res.items || []);
      setSelectedWarehouse(warehouseName);
      setDetailsModalVisible(true);
    } catch (err) {
      console.error("Error fetching warehouse details:", err);
      message.error("Failed to fetch warehouse details.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Location", dataIndex: "location" },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button onClick={() => handleViewDetails(record._id, record.name)}>View Details</Button>
          <Button onClick={() => { setEditId(record._id); setFormData({ name: record.name, location: record.location }); setIsEditModalVisible(true); }}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this warehouse?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <Search
          placeholder="Search warehouses"
          allowClear
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
          Add Warehouse
        </Button>
      </div>

      <Table
        dataSource={warehouses.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={false}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalWarehouses}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 20 }}
      />

      {}
      <Modal
        title="Add Warehouse"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={handleCreate}
        okText="Add"
      >
        <Form layout="vertical">
          <Form.Item label="Name" required>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </Form.Item>
          <Form.Item label="Location" required>
            <Input name="location" value={formData.location} onChange={handleChange} />
          </Form.Item>
        </Form>
      </Modal>

      {}
      <Modal
        title="Edit Warehouse"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleUpdate}
        okText="Update"
      >
        <Form layout="vertical">
          <Form.Item label="Name" required>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </Form.Item>
          <Form.Item label="Location" required>
            <Input name="location" value={formData.location} onChange={handleChange} />
          </Form.Item>
        </Form>
      </Modal>

      {}
      <Modal
        title={`Items in ${selectedWarehouse}`}
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
      >
        <Table
          dataSource={warehouseItems}
          columns={[
            { title: "Name", dataIndex: "name" },
            { title: "Category", dataIndex: "category" },
            { title: "Supplier", dataIndex: "supplier" },
            { title: "Quantity", dataIndex: "quantity" },
          ]}
          pagination={false}
          rowKey={(record) => `${record.name}-${record.category}-${record.supplier}`}
          size="small"
        />
      </Modal>
    </AdminLayout>
  );
};

export default WarehousePage;
