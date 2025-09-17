import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/Card";
import { Link } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";

const Home = () => {
  const { stockItems, categories, getStockItems, getCategories, user, getTransactions, transactions, getSeller } =
    useAuth();
  const [loading, setLoading] = useState(true);

  // Calculations
  const totalStock = stockItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalValue = stockItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const lowestItem = stockItems.reduce(
    (min, item) => (item.quantity < min.quantity ? item : min),
    stockItems[0]
  );
  const criticalStock = stockItems.filter((item) => item.quantity <= 5);

  // Data for charts
  const categoryData = categories.map((cat) => ({
    category: cat?.name,
    quantity: stockItems
      .filter((item) => item.categoryId === cat.$id)
      .reduce((sum, item) => sum + item.quantity, 0),
  }));

  const pieData = categories.map((cat) => ({
    name: cat.name,
    value: stockItems.filter((item) => item.categoryId === cat.$id).length,
  }));

  const getCategory = (categoryId) => {
    const filteratedCategory = categories.filter(
      (cate) => cate.$id === categoryId
    );
    const categoryName = filteratedCategory[0]?.name || 'loading...'
    return categoryName;
  };

  // Generate a color based on category name (consistent)
  const getColorFromString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = Math.floor(Math.abs(Math.sin(hash) * 16777215) % 16777215);
    return `#${color.toString(16).padStart(6, "0")}`;
  };

  // Generate colors for all categories
  const COLORS = categories.map((cat) => getColorFromString(cat.name));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        if (user) {
          await Promise.all([getStockItems(), getCategories(), getTransactions]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : (
    
    <div className="p-6 space-y-6 overflow-scroll w-full h-[91vh] bg-white">
  
      {user.role === "admin" && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 shadow-sm">
          <p className="text-sm text-blue-800">
            Your <span className="font-semibold">Company ID</span> is{" "}
            <span className="px-2 py-1 bg-white rounded-md font-mono text-blue-900 border border-blue-300">
              {user.companyId}
            </span>
            . Share this with your staff for authentication.
          </p>
        </div>
      )}
          <div className="text-center mb-3 mt-0">
      <Link
        to="/upcoming-features"
        className="inline-block px-6 py-3 text-white bg-blue-600 rounded-xl shadow-md hover:bg-blue-700 hover:scale-105 transition-transform duration-200"
      >
        🚀 Click here to see our Upcoming Features
      </Link>
    </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-none rounded-xl">
          <CardContent className="p-4 flex gap-2">
            <span className="mr-4 text-white bg-blue-500 border p-2 rounded-full h-[50px] w-[50px] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                />
              </svg>
            </span>
            <div>
              <p className="text-gray-500">Total Stock Items</p>
              <h2 className="text-2xl font-bold">{totalStock}</h2>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-none rounded-xl">
          <CardContent className="p-4 flex gap-2">
            <span className="mr-4 text-white bg-blue-500 border p-2 rounded-full h-[50px] w-[50px] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </span>
            <div>
              <p className="text-gray-500">Total Categories</p>
              <h2 className="text-2xl font-bold">{categories.length}</h2>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-none rounded-xl">
          <CardContent className="p-4 flex gap-2">
            <span className="mr-4 text-white bg-blue-500 border p-2 rounded-full h-[50px] w-[50px] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
                />
              </svg>
            </span>
            <div>
              <p className="text-gray-500">Lowest Item in Stock</p>
              <h2 className="text-lg font-semibold">
                {lowestItem
                  ? `${lowestItem.name} (${lowestItem.quantity})`
                  : "No Items"}
              </h2>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-none rounded-xl">
          <CardContent className="p-4 flex gap-2">
            <span className="mr-4 text-white bg-blue-500 border p-2 rounded-full h-[50px] w-[50px] flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                />
              </svg>
            </span>
            <div>
              <p className="text-gray-500">Total Stock Value</p>
              <h2 className="text-2xl font-bold">
                ₦{totalValue ? totalValue : "0"}
              </h2>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm border-none rounded-xl">
          <CardContent className="p-4 h-72">
            <h3 className="font-semibold mb-3">Stock by Category</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#5f6fff" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none rounded-xl">
          <CardContent className="p-4 h-72">
            <h3 className="font-semibold mb-3">Items Distribution</h3>
            {pieData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              "No item in stock"
            )}
          </CardContent>
        </Card>

        {/* Critical Stock */}
        <Card className="shadow-sm border-none rounded-xl">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Critical Stock (≤ 5)</h3>
            {criticalStock.length === 0 ? (
              <p className="text-gray-500">No critical stock items.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {criticalStock.map((item) => (
                    <TableRow key={item.$id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{getCategory(item.categoryId)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="flex w-full gap-6">
        {/* Recent Stock Items */}
        <Card className="shadow-sm border-none rounded-xl w-full">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Recent 5 Stock Items</h3>
            {stockItems.length === 0 ? (
              <p className="text-gray-500">No stock items available.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockItems.slice(0, 5).map((item) => (
                    <TableRow key={item.$id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{getCategory(item.categoryId)}</TableCell>
                      <TableCell>₦{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
            {/* Recent Trasactions */}
        <Card className="shadow-sm border-none rounded-xl w-full">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Recent Transactions</h3>
            {stockItems.length === 0 ? (
              <p className="text-gray-500">No transaction made.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>item Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Sold By</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 5).map((item) => (
                    <TableRow key={item.$id}>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{getSeller(item.userId)}</TableCell>
                      <TableCell>₦{item.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
