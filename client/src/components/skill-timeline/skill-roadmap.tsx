import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Award, 
  Github, 
  Briefcase, 
  BookOpen, 
  Star, 
  Calendar,
  TrendingUp,
  MapPin
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Milestone {
  id: string;
  type: 'certification' | 'github' | 'skill' | 'experience' | 'project';
  title: string;
  description: string;
  date: Date;
  level?: number;
  skills?: string[];
  icon: any;
  color: string;
  metadata?: any;
}

interface SkillRoadmapProps {
  skills?: any[];
  certifications?: any[];
  githubData?: any;
  timeline?: any[];
}

const getMilestoneIcon = (type: string) => {
  switch (type) {
    case 'certification': return Award;
    case 'github': return Github;
    case 'skill': return TrendingUp;
    case 'experience': return Briefcase;
    case 'project': return BookOpen;
    default: return Star;
  }
};

const getMilestoneColor = (type: string) => {
  switch (type) {
    case 'certification': return 'bg-yellow-500';
    case 'github': return 'bg-purple-500';
    case 'skill': return 'bg-blue-500';
    case 'experience': return 'bg-green-500';
    case 'project': return 'bg-orange-500';
    default: return 'bg-gray-500';
  }
};

export default function SkillRoadmap({ 
  skills = [], 
  certifications = [], 
  githubData, 
  timeline = [] 
}: SkillRoadmapProps) {
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const milestones: Milestone[] = useMemo(() => {
    const items: Milestone[] = [];

    // Add certifications as milestones
    certifications.forEach((cert: any) => {
      items.push({
        id: `cert-${cert.id}`,
        type: 'certification',
        title: cert.name,
        description: `Issued by ${cert.issuer}`,
        date: new Date(cert.issueDate),
        skills: cert.skills || [],
        icon: getMilestoneIcon('certification'),
        color: getMilestoneColor('certification'),
        metadata: cert
      });
    });

    // Add major skill improvements as milestones
    skills.forEach((skill: any) => {
      if (skill.level >= 70) { // Only show significant skills
        items.push({
          id: `skill-${skill.id}`,
          type: 'skill',
          title: `${skill.name} Mastery`,
          description: `Reached ${skill.level}% proficiency`,
          date: new Date(skill.lastUpdated),
          level: skill.level,
          icon: getMilestoneIcon('skill'),
          color: getMilestoneColor('skill'),
          metadata: skill
        });
      }
    });

    // Add GitHub contribution milestones
    if (githubData && githubData.contributions > 100) {
      items.push({
        id: 'github-activity',
        type: 'github',
        title: 'Active Developer',
        description: `${githubData.contributions} contributions across ${githubData.repositories} repositories`,
        date: new Date(githubData.lastSynced),
        icon: getMilestoneIcon('github'),
        color: getMilestoneColor('github'),
        metadata: githubData
      });
    }

    // Add experience milestones (simulated based on user data)
    items.push({
      id: 'experience-microsoft',
      type: 'experience',
      title: 'Senior Software Engineer at Microsoft',
      description: 'Leading AI-powered development initiatives',
      date: new Date('2023-01-15'),
      icon: getMilestoneIcon('experience'),
      color: getMilestoneColor('experience')
    });

    items.push({
      id: 'project-linkedin-clone',
      type: 'project',
      title: 'LinkedIn Clone with AI Features',
      description: 'Built comprehensive social platform with AI-powered skill tracking',
      date: new Date(),
      icon: getMilestoneIcon('project'),
      color: getMilestoneColor('project')
    });

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [skills, certifications, githubData]);

  const filteredMilestones = useMemo(() => {
    let filtered = milestones;

    // Filter by time
    if (timeFilter !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (timeFilter) {
        case '3months':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case '1year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
        case '2years':
          cutoffDate.setFullYear(now.getFullYear() - 2);
          break;
      }
      
      filtered = filtered.filter(milestone => new Date(milestone.date) >= cutoffDate);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(milestone => milestone.type === selectedType);
    }

    return filtered;
  }, [milestones, timeFilter, selectedType]);

  const getMilestonePosition = (index: number) => {
    return index % 2 === 0 ? 'left' : 'right';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Professional Journey Roadmap
          </CardTitle>
          <div className="flex space-x-2">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
                <SelectItem value="2years">Last 2 Years</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="certification">Certifications</SelectItem>
                <SelectItem value="skill">Skills</SelectItem>
                <SelectItem value="github">GitHub</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
                <SelectItem value="project">Projects</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Visual timeline of professional achievements and skill development
        </p>
      </CardHeader>
      <CardContent>
        {filteredMilestones.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No milestones found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or add more skills and certifications
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 bg-gray-300 h-full"></div>
            
            <div className="space-y-8">
              {filteredMilestones.map((milestone, index) => {
                const position = getMilestonePosition(index);
                const IconComponent = milestone.icon;
                
                return (
                  <div key={milestone.id} className="relative">
                    {/* Timeline Node */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-4">
                      <div className={`w-12 h-12 rounded-full ${milestone.color} flex items-center justify-center shadow-lg border-4 border-white`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    {/* Milestone Card */}
                    <div className={`relative ${position === 'left' ? 'mr-auto pr-8' : 'ml-auto pl-8'} w-5/12`}>
                      <div className={`p-4 rounded-lg border shadow-sm bg-white hover:shadow-md transition-shadow ${
                        position === 'left' ? 'mr-4' : 'ml-4'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{milestone.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{milestone.description}</p>
                          </div>
                          <Badge variant="outline" className="text-xs ml-2">
                            {milestone.type}
                          </Badge>
                        </div>
                        
                        {milestone.skills && milestone.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {milestone.skills.slice(0, 3).map((skill: string) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {milestone.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{milestone.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        {milestone.level && (
                          <div className="mb-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Proficiency</span>
                              <span>{milestone.level}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${milestone.level}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(milestone.date)}
                        </div>
                        
                        {/* Connection Line to Timeline */}
                        <div className={`absolute top-4 ${
                          position === 'left' 
                            ? 'right-0 w-4 h-0.5 bg-gray-300' 
                            : 'left-0 w-4 h-0.5 bg-gray-300'
                        }`}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Summary Stats */}
        <div className="mt-8 pt-6 border-t">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {milestones.filter(m => m.type === 'certification').length}
              </div>
              <div className="text-xs text-gray-500">Certifications</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {milestones.filter(m => m.type === 'skill').length}
              </div>
              <div className="text-xs text-gray-500">Skills Mastered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {milestones.filter(m => m.type === 'experience').length}
              </div>
              <div className="text-xs text-gray-500">Roles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {milestones.filter(m => m.type === 'project').length}
              </div>
              <div className="text-xs text-gray-500">Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {githubData?.contributions || 0}
              </div>
              <div className="text-xs text-gray-500">Contributions</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}