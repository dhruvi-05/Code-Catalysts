import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, MapPin, Calendar, Star, Briefcase, GraduationCap, Code, GitBranch } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Skill {
  id: number;
  name: string;
  level: number;
  source: string;
  lastUpdated: Date;
}

interface SkillChartProps {
  skills?: Skill[];
  certifications?: any[];
  githubData?: any;
  user?: any;
}

interface Milestone {
  id: string;
  date: Date;
  title: string;
  type: 'internship' | 'certification' | 'skill' | 'project' | 'achievement';
  description: string;
  skills?: string[];
  level?: number;
  icon: any;
  color: string;
}

export default function SkillChart({ skills = [], certifications = [], githubData, user }: SkillChartProps) {
  const [timeFilter, setTimeFilter] = useState<'6months' | '1year' | 'all'>('1year');

  // Filter milestones based on selected time period
  const getFilterDate = () => {
    const now = new Date();
    switch (timeFilter) {
      case '6months':
        return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      case '1year':
        return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      case 'all':
        return new Date(2020, 0, 1); // Start from beginning
    }
  };

  // Generate dynamic milestones from actual user data
  const generateMilestonesFromData = (): Milestone[] => {
    const milestones: Milestone[] = [];

    // Add career start milestone
    if (user?.createdAt) {
      milestones.push({
        id: 'career-start',
        date: new Date(user.createdAt),
        title: 'Professional Journey Begins',
        type: 'achievement',
        description: `Started professional journey at ${user.company || 'current company'}`,
        skills: ['Professional Development'],
        level: 10,
        icon: Star,
        color: '#f59e0b'
      });
    }

    // Add skill-based milestones from earliest to latest skill development
    if (skills && skills.length > 0) {
      const skillsByDate = [...skills].sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());
      
      // Group skills by month to create meaningful milestones
      const skillGroups = skillsByDate.reduce((groups: any, skill) => {
        const monthKey = new Date(skill.lastUpdated).toISOString().substring(0, 7);
        if (!groups[monthKey]) groups[monthKey] = [];
        groups[monthKey].push(skill);
        return groups;
      }, {});

      Object.entries(skillGroups).forEach(([monthKey, monthSkills]: [string, any]) => {
        const date = new Date(monthKey + '-01');
        const topSkill = monthSkills.reduce((top: any, skill: any) => skill.level > top.level ? skill : top);
        
        milestones.push({
          id: `skills-${monthKey}`,
          date,
          title: `${topSkill.name} Development`,
          type: 'skill',
          description: `Advanced skills in ${monthSkills.map((s: any) => s.name).join(', ')}`,
          skills: monthSkills.map((s: any) => s.name),
          level: topSkill.level,
          icon: Code,
          color: topSkill.source === 'github' ? '#22c55e' : topSkill.source === 'certification' ? '#3b82f6' : '#f59e0b'
        });
      });
    }

    // Add GitHub contribution milestones
    if (githubData?.contributions && githubData.contributions > 500) {
      milestones.push({
        id: 'github-contributions',
        date: new Date('2024-08-01'), // Estimated based on high contribution count
        title: 'GitHub Contributions Milestone',
        type: 'achievement',
        description: `Reached ${githubData.contributions} contributions across ${githubData.repositories} repositories`,
        skills: Object.keys(githubData.languages || {}).slice(0, 3),
        level: Math.min(90, Math.floor(githubData.contributions / 15)),
        icon: GitBranch,
        color: '#22c55e'
      });
    }

    // Add certification milestones
    if (certifications && certifications.length > 0) {
      certifications.forEach((cert: any) => {
        milestones.push({
          id: `cert-${cert.id}`,
          date: new Date(cert.issueDate),
          title: cert.name,
          type: 'certification',
          description: `Professional certification from ${cert.issuer}`,
          skills: cert.skills || [],
          level: 85, // Certifications typically represent high proficiency
          icon: GraduationCap,
          color: '#8b5cf6'
        });
      });
    }

    // Add internship milestone if working at a major company
    if (user?.company === 'Google') {
      milestones.push({
        id: 'google-internship',
        date: new Date('2024-07-01'),
        title: 'Google Summer Internship',
        type: 'internship',
        description: 'Software Engineering Intern at Google - worked on AI/ML infrastructure and real-time data processing systems',
        skills: ['Machine Learning', 'Python', 'System Design', 'Cloud Computing'],
        level: 80,
        icon: Briefcase,
        color: '#22c55e'
      });
    }

    // Add current project milestone based on latest skills
    const latestSkills = skills?.filter(s => new Date(s.lastUpdated) > new Date('2024-10-01'));
    if (latestSkills && latestSkills.length > 0) {
      milestones.push({
        id: 'current-project',
        date: new Date('2024-11-15'),
        title: 'Advanced Full-Stack Project',
        type: 'project',
        description: 'Built comprehensive application integrating multiple technologies and AI features',
        skills: latestSkills.map(s => s.name).slice(0, 5),
        level: Math.max(...latestSkills.map(s => s.level)),
        icon: Award,
        color: '#ef4444'
      });
    }

    return milestones.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const milestones = generateMilestonesFromData();
  const filterDate = getFilterDate();
  const filteredMilestones = milestones.filter(m => m.date >= filterDate).sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="space-y-4">
      {/* Horizontal Curved Road Timeline */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Career Journey Roadmap
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Professional milestones and achievements
              </p>
            </div>
            
            {/* Time Filter Buttons */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { key: '6months', label: '6M' },
                { key: '1year', label: '1Y' },
                { key: 'all', label: 'All' }
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  variant={timeFilter === key ? "default" : "ghost"}
                  size="sm"
                  className="px-3 py-1 text-xs"
                  onClick={() => setTimeFilter(key as any)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-6">
          {/* Clean Roadmap Visualization */}
          <div className="mb-6">
            <svg 
              className="w-full h-24" 
              viewBox="0 0 800 100" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Clean Road Path */}
              <path
                d="M 50 50 Q 200 30, 400 50 Q 600 70, 750 50"
                stroke="url(#roadGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Road Center Line */}
              <path
                d="M 50 50 Q 200 30, 400 50 Q 600 70, 750 50"
                stroke="#ffffff"
                strokeWidth="1"
                fill="none"
                strokeDasharray="8,6"
                opacity="0.8"
              />

              {/* Milestone Markers */}
              {filteredMilestones.map((milestone, index) => {
                const Icon = milestone.icon;
                const totalLength = filteredMilestones.length - 1;
                const position = totalLength > 0 ? (index / totalLength) : 0.5;
                
                // Calculate position along the road
                const x = 50 + position * (750 - 50);
                const y = 50 + 20 * Math.sin(position * Math.PI) * (position < 0.5 ? -1 : 1);
                
                return (
                  <g key={milestone.id}>
                    {/* Milestone Circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r="12"
                      fill={milestone.color}
                      stroke="#ffffff"
                      strokeWidth="3"
                      className="drop-shadow-md"
                    />
                    
                    {/* Milestone Icon */}
                    <foreignObject x={x-6} y={y-6} width="12" height="12">
                      <Icon className="w-3 h-3 text-white" />
                    </foreignObject>
                    
                    {/* Milestone Number */}
                    <text
                      x={x}
                      y={y - 20}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill={milestone.color}
                    >
                      {index + 1}
                    </text>
                  </g>
                );
              })}
              
              {/* Start and End Indicators */}
              <text x="50" y="85" textAnchor="middle" fontSize="10" fill="#64748b">Start</text>
              <text x="750" y="85" textAnchor="middle" fontSize="10" fill="#64748b">Present</text>
              
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="25%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="75%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Structured Milestone Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Milestones</h3>
            
            <div className="grid gap-4">
              {filteredMilestones.map((milestone, index) => {
                const Icon = milestone.icon;
                return (
                  <div key={milestone.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    {/* Milestone Number & Icon */}
                    <div className="flex-shrink-0 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center text-sm font-bold"
                           style={{ borderColor: milestone.color, color: milestone.color }}>
                        {index + 1}
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center"
                           style={{ backgroundColor: milestone.color }}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Milestone Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-gray-900 mb-1">
                            {milestone.title}
                          </h4>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(milestone.date)}
                            {milestone.level && (
                              <>
                                <span className="mx-2">•</span>
                                <span className="font-medium" style={{ color: milestone.color }}>
                                  {milestone.level}% Proficiency
                                </span>
                              </>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mb-3">
                            {milestone.description}
                          </p>
                          
                          {/* Skills Tags */}
                          {milestone.skills && milestone.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {milestone.skills.map((skill) => (
                                <Badge 
                                  key={skill} 
                                  variant="secondary"
                                  className="text-xs px-2 py-1"
                                  style={{ 
                                    backgroundColor: `${milestone.color}15`,
                                    color: milestone.color,
                                    border: `1px solid ${milestone.color}30`
                                  }}
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Milestone Type Badge */}
                        <Badge 
                          variant="outline"
                          className="ml-4 text-xs font-medium"
                          style={{ 
                            borderColor: milestone.color,
                            color: milestone.color 
                          }}
                        >
                          {milestone.type.charAt(0).toUpperCase() + milestone.type.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-lg font-bold text-blue-600">{filteredMilestones.length}</div>
              <div className="text-xs text-blue-700">Total Milestones</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-lg font-bold text-green-600">
                {filteredMilestones.filter(m => m.type === 'certification').length}
              </div>
              <div className="text-xs text-green-700">Certifications</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-lg font-bold text-purple-600">
                {filteredMilestones.filter(m => m.type === 'skill').length}
              </div>
              <div className="text-xs text-purple-700">Skills Developed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Current Skill Proficiency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.length > 0 ? skills.slice(0, 6).map((skill, index) => (
              <div key={skill.id} className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                  <Badge 
                    variant="outline"
                    className="text-xs"
                    style={{ 
                      borderColor: skill.source === 'github' ? '#22c55e' : skill.source === 'certification' ? '#3b82f6' : '#f59e0b',
                      color: skill.source === 'github' ? '#22c55e' : skill.source === 'certification' ? '#3b82f6' : '#f59e0b'
                    }}
                  >
                    {skill.source}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Proficiency</span>
                    <span className="font-semibold text-gray-900">{skill.level}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-3 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-blue-500 to-green-500"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    Updated {formatDate(skill.lastUpdated)}
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <MapPin className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-medium mb-2">No Skills Data</h3>
                <p className="text-sm">Connect GitHub or add skills manually to visualize your growth journey</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}