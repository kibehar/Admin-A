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
  Select,
  Popconfirm,
} from "antd";
import {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getWarehouses,
  assignInventoryToWarehouse,
  getCategories,
  addCategory,
  getSuppliers,
} from "../api/api";
import AdminLayout from "../components/AdminLayout";

const { Search } = Input;
const { Option } = Select;

const InventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [categoryName, setCategoryName] = useState("");
  const [transferData, setTransferData] = useState<any>({
    warehouseId: "",
    quantity: 0,
  });

  const [searchText, setSearchText] = useState("");
  const pageSize = 5;

  useEffect(() => {
    fetchInventory();
    fetchWarehouses();
    fetchCategories();
    fetchSuppliers();
  }, [currentPage, searchText]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await getInventory();
      setInventory(data);
      setTotalItems(data.length);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const data = await getWarehouses();
      setWarehouses(data);
    } catch (err) {
      console.error("Error fetching warehouses:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.map((cat: any) => cat.name));
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) return message.warning("Enter a category name.");
    try {
      await addCategory({ name: categoryName });
      message.success("Category added.");
      setCategoryName("");
      setIsCategoryModalVisible(false);
      fetchCategories();
    } catch {
      message.error("Failed to add category.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInventoryItem(id);
      message.success("Inventory item deleted successfully!");
      fetchInventory();
    } catch (err: any) {
      console.error("Delete error:", err?.response || err);
      message.error(`Failed to delete inventory item.`);
    }
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setFormData(item);
    setIsEditModalVisible(true);
  };

  const handleTransfer = (item: any) => {
    setSelectedItem(item);
    setTransferData({ warehouseId: "", quantity: 0 });
    setIsTransferModalVisible(true);
  };

  const handleCreate = async () => {
    try {
      await addInventoryItem(formData);
      message.success("Inventory item added!");
      setIsCreateModalVisible(false);
      setFormData({});
      fetchInventory();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Failed to add item.");
    }
  };

  const handleUpdate = async () => {
    try {
      await updateInventoryItem(selectedItem._id, formData);
      message.success("Inventory item updated!");
      setIsEditModalVisible(false);
      setFormData({});
      fetchInventory();
    } catch {
      message.error("Failed to update item.");
    }
  };

  const handleTransferSubmit = async () => {
    const { warehouseId, quantity } = transferData;
    if (!warehouseId || !quantity) {
      return message.warning("Select a warehouse and quantity.");
    }
    if (quantity > selectedItem.quantity) {
      return message.error(`Only ${selectedItem.quantity} available to transfer.`);
    }

    try {
      await assignInventoryToWarehouse({
        inventoryId: selectedItem._id,
        warehouseId,
        quantity,
      });
      message.success("Transferred to warehouse!");
      setIsTransferModalVisible(false);
      fetchInventory();
    } catch {
      message.error("Failed to transfer.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const { name, value } = e.target || { name: e.name, value: e.value };
    if (["quantity", "price"].includes(name)) {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const getSupplierName = (id: string) => {
    const supplier = suppliers.find((s) => s._id === id);
    return supplier ? `${supplier.firstName} ${supplier.lastName}` : id;
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Category", dataIndex: "category" },
    { title: "Quantity", dataIndex: "quantity" },
    {
      title: "Supplier",
      dataIndex: "supplier",
      render: (supplierId: string) => getSupplierName(supplierId),
    },
    { title: "Stock", dataIndex: "stock" },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button onClick={() => handleTransfer(record)} style={{ marginRight: 8 }}>
            Transfer
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this item?"
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
        <Search
          placeholder="Search inventory"
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
          Add Inventory Item
        </Button>
        <Button onClick={() => setIsCategoryModalVisible(true)}>Add Category</Button>
      </div>

      {}
      <Modal
        title="Add Inventory Item"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={handleCreate}
        okText="Add"
      >
        <InventoryForm
          formData={formData}
          handleChange={handleChange}
          categories={categories}
          suppliers={suppliers}
        />
      </Modal>

      {}
      <Modal
        title="Edit Inventory Item"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleUpdate}
        okText="Update"
      >
        <InventoryForm
          formData={formData}
          handleChange={handleChange}
          categories={categories}
          suppliers={suppliers}
        />
      </Modal>

      {}
      <Modal
        title="Transfer Inventory to Warehouse"
        open={isTransferModalVisible}
        onCancel={() => setIsTransferModalVisible(false)}
        onOk={handleTransferSubmit}
        okText="Transfer"
      >
        <Form layout="vertical">
          <Form.Item label="Select Warehouse" required>
            <Select
              value={transferData.warehouseId}
              onChange={(value) => setTransferData({ ...transferData, warehouseId: value })}
            >
              {warehouses.map((wh) => (
                <Option key={wh._id} value={wh._id}>
                  {wh.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Quantity to Transfer" required>
            <Input
              type="number"
              value={transferData.quantity}
              onChange={(e) =>
                setTransferData({ ...transferData, quantity: parseInt(e.target.value) || 0 })
              }
            />
          </Form.Item>
        </Form>
      </Modal>

      {}
      <Modal
        title="Add New Category"
        open={isCategoryModalVisible}
        onCancel={() => setIsCategoryModalVisible(false)}
        onOk={handleAddCategory}
        okText="Add"
      >
        <Input
          placeholder="Enter category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </Modal>

      <Table
        dataSource={inventory}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={false}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalItems}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 20 }}
      />
    </AdminLayout>
  );
};

const InventoryForm = ({
  formData,
  handleChange,
  categories,
  suppliers,
}: {
  formData: any;
  handleChange: (e: any) => void;
  categories: string[];
  suppliers: any[];
}) => (
  <Form layout="vertical">
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label="Name" required>
          <Input name="name" value={formData.name || ""} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Category" required>
          <Select
            value={formData.category || ""}
            onChange={(value) => handleChange({ target: { name: "category", value } })}
          >
            {categories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Quantity" required>
          <Input
            type="number"
            name="quantity"
            value={formData.quantity || ""}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item label="Price" required>
          <Input
            type="number"
            name="price"
            value={formData.price || ""}
            onChange={handleChange}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Supplier" required>
          <Select
            value={formData.supplier || ""}
            onChange={(value) => handleChange({ target: { name: "supplier", value } })}
            placeholder="Select supplier"
          >
            {suppliers.map((s) => (
              <Option key={s._id} value={s._id}>
                {s.firstName} {s.lastName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  </Form>
);

export default InventoryPage;


