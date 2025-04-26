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
  Select,
  DatePicker,
  message,
} from "antd";
import { getSales, recordSale, getWarehouses, getInventory } from "../api/api";
import AdminLayout from "../components/AdminLayout";
import dayjs from "dayjs";

const { Search } = Input;
const { Option } = Select;

const SalesPage: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>({});

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSales, setTotalSales] = useState(0);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [formData, setFormData] = useState<any>({
    warehouseId: "",
    productId: "",
    quantity: 1,
    priceEach: 0,
    total: 0,
    paymentStatus: "Paid",
    customerName: "",
    customerPhoneNumber: "",
  });

  const pageSize = 5;

  useEffect(() => {
    fetchData();
  }, [currentPage, filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getSales(filters);
      setSales(data);
      setTotalSales(data.length);
      const wh = await getWarehouses();
      setWarehouses(wh);
      const inv = await getInventory();
      setInventory(inv);
    } catch (err) {
      console.error("Error fetching sales:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWarehouseSelect = (warehouseId: string) => {
    const warehouse = warehouses.find((w) => w._id === warehouseId);
    if (warehouse) {
      const productIds = warehouse.products.map((p: any) => p.productId);
      const availableProducts = inventory.filter((prod: any) => productIds.includes(prod._id));
      setFilteredProducts(availableProducts);
    }
    setFormData({
      ...formData,
      warehouseId,
      productId: "",
      priceEach: 0,
      quantity: 1,
      total: 0,
    });
  };

  const handleProductSelect = (productId: string) => {
    setFormData({
      ...formData,
      productId,
      priceEach: 0,
      quantity: 1,
      total: 0,
    });
  };

  const handleQuantityChange = (e: any) => {
    const quantity = Number(e.target.value);
    setFormData((prev: any) => ({
      ...prev,
      quantity,
      total: quantity * prev.priceEach,
    }));
  };

  const handlePriceEachChange = (e: any) => {
    const priceEach = Number(e.target.value);
    setFormData((prev: any) => ({
      ...prev,
      priceEach,
      total: priceEach * prev.quantity,
    }));
  };

  const handleCreate = async () => {
    try {
      await recordSale({
        ...formData,
        price: formData.priceEach,
      });
      setIsCreateModalVisible(false);
      resetForm();
      fetchData();
      message.success("Sale recorded successfully!");
    } catch (error: any) {
      console.error("Error recording sale:", error);
      if (error.response && error.response.data && error.response.data.message) {
        Modal.error({
          title: "Sale Failed",
          content: error.response.data.message,
          okText: "OK",
        });
      } else {
        message.error("Failed to record sale. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      warehouseId: "",
      productId: "",
      quantity: 1,
      priceEach: 0,
      total: 0,
      paymentStatus: "Paid",
      customerName: "",
      customerPhoneNumber: "",
    });
  };

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value });
  };

  const handleWarehouseFilter = (warehouseId: string) => {
    setFilters({ ...filters, warehouseId });
  };

  const handleDateFilter = (date: any) => {
    if (date) {
      const formatted = dayjs(date).format("YYYY-MM-DD");
      setFilters({ ...filters, date: formatted });
    } else {
      const { date, ...rest } = filters;
      setFilters(rest);
    }
  };

  const columns = [
    { title: "Product", dataIndex: ["productId", "name"] },
    { title: "Quantity", dataIndex: "quantity" },
    { title: "Price Each", dataIndex: "price" },
    { title: "Total", dataIndex: "total" },
    { title: "Warehouse", dataIndex: ["warehouseId", "name"] },
    { title: "Customer", dataIndex: "customerName" },
    { title: "Phone", dataIndex: "customerPhoneNumber" },
    { title: "Payment", dataIndex: "paymentStatus" },
    {
      title: "Date",
      dataIndex: "saleDate",
      render: (date: any) => dayjs(date).format("DD-MMM-YYYY"),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <Search placeholder="Search sales" onSearch={handleSearch} allowClear style={{ width: 200 }} />
        <Select placeholder="Filter by Warehouse" onChange={handleWarehouseFilter} allowClear style={{ width: 200 }}>
          {warehouses.map((w) => (
            <Option key={w._id} value={w._id}>
              {w.name}
            </Option>
          ))}
        </Select>
        <DatePicker
          placeholder="Filter by Date"
          format="DD-MM-YYYY"
          onChange={handleDateFilter}
          allowClear
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
          Record Sale
        </Button>
      </div>

      {/* Create Sale Modal */}
      <Modal
        title="Record Sale"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={handleCreate}
        okText="Record"
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Select Warehouse" required>
                <Select
                  value={formData.warehouseId}
                  onChange={handleWarehouseSelect}
                  placeholder="Select warehouse"
                >
                  {warehouses.map((w) => (
                    <Option key={w._id} value={w._id}>
                      {w.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Select Product" required>
                <Select
                  value={formData.productId}
                  onChange={handleProductSelect}
                  placeholder="Select product"
                  disabled={!formData.warehouseId}
                >
                  {filteredProducts.map((p) => (
                    <Option key={p._id} value={p._id}>
                      {p.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Price Each" required>
                <Input
                  type="number"
                  value={formData.priceEach}
                  onChange={handlePriceEachChange}
                />
              </Form.Item>

              <Form.Item label="Quantity" required>
                <Input
                  type="number"
                  min={1}
                  value={formData.quantity}
                  onChange={handleQuantityChange}
                />
              </Form.Item>

              <Form.Item label="Total">
                <Input value={formData.total} disabled />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Customer Name">
                <Input
                  name="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </Form.Item>

              <Form.Item label="Customer Phone Number">
                <Input
                  name="customerPhoneNumber"
                  value={formData.customerPhoneNumber}
                  onChange={(e) => setFormData({ ...formData, customerPhoneNumber: e.target.value })}
                />
              </Form.Item>

              <Form.Item label="Payment Status" required>
                <Select
                  value={formData.paymentStatus}
                  onChange={(value) => setFormData({ ...formData, paymentStatus: value })}
                >
                  <Option value="Paid">Paid</Option>
                  <Option value="Unpaid">Unpaid</Option>
                  <Option value="Partial">Partial</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Sales Table */}
      <Table
        dataSource={sales}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={false}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalSales}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 20 }}
      />
    </AdminLayout>
  );
};

export default SalesPage;
