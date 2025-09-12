import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { CheckCircle, Clock } from "lucide-react";

const features = [
  {
    title: "Categories & Stock",
    items: [
      "Delete Category with cascade delete (with warning modal)",
      "Category color tags / icons",
    ],
  },
  {
    title: "Transactions",
    items: [
      "Sales & purchase transactions linked to stock",
      "Auto-update stock levels",
      "Transaction history table (filter by date, type)",
      "Export transactions as CSV / PDF",
    ],
  },
  {
    title: "UI/UX Enhancements",
    items: [
      "Skeleton loaders",
      "Pagination & infinite scroll",
      "Dark mode toggle",
    ],
  },
  {
    title: "Analytics & Dashboard",
    items: [
      "Weekly/monthly transaction charts",
      "Top 5 selling items",
    ],
  },
  {
    title: "Integrations",
    items: [
      "VirusTotal scan for uploads",
      "Export stock list to Excel/CSV",
      "Multi-company account switching",
    ],
  },
];

export default function UpcomingFeatures() {
  return (
    <div className="max-h-[85vh] overflow-scroll h-screen p-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Clock className="w-7 h-7 text-blue-500" /> Upcoming Features
        </h1>
        <p className="text-gray-600 mb-8">
          These features are currently in development and will be released in
          upcoming updates. Stay tuned!
        </p>

        <div className="grid grid-cols-[1fr] md:grid-cols-[1fr_1fr] gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="shadow-md rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  {feature.title}
                </h2>
                <ul className="space-y-2 text-gray-600">
                  {feature.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm leading-6"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {item}{" "}
                      <Badge variant="secondary" className="ml-2">
                        Coming Soon
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
