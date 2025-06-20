import { Briefcase, Code, GraduationCap, Heart, Newspaper, Bookmark } from "lucide-react";

const categoryConfig = {
  "Career Insights": {
    icon: Briefcase,
    gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
  },
  "Tech Resources": {
    icon: Code,
    gradient: "bg-gradient-to-br from-green-500 to-green-600",
  },
  "Learning": {
    icon: GraduationCap,
    gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
  },
  "Inspiration": {
    icon: Heart,
    gradient: "bg-gradient-to-br from-orange-500 to-orange-600",
  },
  "Industry News": {
    icon: Newspaper,
    gradient: "bg-gradient-to-br from-red-500 to-red-600",
  },
  "General": {
    icon: Bookmark,
    gradient: "bg-gradient-to-br from-gray-500 to-gray-600",
  },
};

interface CategoryGridProps {
  categories?: Record<string, number>;
  compact?: boolean;
  onCategorySelect?: (category: string) => void;
}

export default function CategoryGrid({ 
  categories = {}, 
  compact = false,
  onCategorySelect 
}: CategoryGridProps) {
  const categoryEntries = Object.entries(categories);
  
  if (categoryEntries.length === 0) {
    return (
      <div className={`grid ${compact ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-3`}>
        {Object.entries(categoryConfig).map(([categoryName, config]) => {
          const Icon = config.icon;
          return (
            <div
              key={categoryName}
              className={`${config.gradient} rounded-lg p-3 text-white cursor-pointer hover:scale-105 transition-transform`}
              onClick={() => onCategorySelect?.(categoryName)}
            >
              <Icon className={`${compact ? 'text-base' : 'text-lg'} mb-2`} />
              <p className={`${compact ? 'text-xs' : 'text-sm'} font-semibold`}>
                {categoryName}
              </p>
              <p className={`${compact ? 'text-xs' : 'text-xs'} opacity-90`}>
                0 posts
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`grid ${compact ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-3`}>
      {categoryEntries.map(([categoryName, count]) => {
        const config = categoryConfig[categoryName as keyof typeof categoryConfig] || categoryConfig.General;
        const Icon = config.icon;
        
        return (
          <div
            key={categoryName}
            className={`${config.gradient} rounded-lg p-3 text-white cursor-pointer hover:scale-105 transition-transform`}
            onClick={() => onCategorySelect?.(categoryName)}
          >
            <Icon className={`${compact ? 'text-base' : 'text-lg'} mb-2`} />
            <p className={`${compact ? 'text-xs' : 'text-sm'} font-semibold`}>
              {categoryName}
            </p>
            <p className={`${compact ? 'text-xs' : 'text-xs'} opacity-90`}>
              {count} posts
            </p>
          </div>
        );
      })}
    </div>
  );
}
