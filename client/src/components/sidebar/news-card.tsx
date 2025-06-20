import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const newsItems = [
  {
    title: "AI transforms recruiting",
    timeAgo: "2h ago",
    readers: "1,234 readers"
  },
  {
    title: "Tech skills in demand",
    timeAgo: "4h ago", 
    readers: "2,156 readers"
  },
  {
    title: "Remote work trends 2024",
    timeAgo: "6h ago",
    readers: "987 readers"
  },
  {
    title: "LinkedIn's new AI features",
    timeAgo: "8h ago",
    readers: "3,421 readers"
  }
];

export default function NewsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">LinkedIn News</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {newsItems.map((item, index) => (
          <div key={index} className="flex items-start space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                {item.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {item.timeAgo} • {item.readers}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
