import { motion } from 'framer-motion';
import { BookOpen, Download, Award, Lock, Play, Clock, Layers } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { courses, currentUser } from '@/data/mockData';
import { cn } from '@/lib/utils';

const tierOrder = { student: 1, beginner: 2, elite: 3 };

const tools = [
  {
    id: '1',
    name: 'Risk Calculator',
    description: 'Calculate position sizes and risk management',
    version: '1.2',
    tier: 'student' as const,
    downloads: 1250,
  },
  {
    id: '2',
    name: 'Trade Journal Template',
    description: 'Track your trades and analyze performance',
    version: '2.0',
    tier: 'beginner' as const,
    downloads: 890,
  },
  {
    id: '3',
    name: 'Market Scanner',
    description: 'AI-powered market opportunity scanner',
    version: '1.0',
    tier: 'elite' as const,
    downloads: 320,
  },
];

export default function ToolsCourses() {
  const userTierLevel = tierOrder[currentUser.tier];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Tools & Courses
        </h1>
        <p className="text-muted-foreground mt-1">Learn and grow with our educational resources</p>
      </motion.div>

      <Tabs defaultValue="courses">
        <TabsList className="bg-secondary/50 border border-border p-1">
          <TabsTrigger value="courses" className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            <BookOpen className="h-4 w-4 mr-2" />
            Course Library
          </TabsTrigger>
          <TabsTrigger value="tools" className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground">
            <Download className="h-4 w-4 mr-2" />
            Trading Tools
          </TabsTrigger>
        </TabsList>

        {/* Courses */}
        <TabsContent value="courses" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => {
              const isLocked = tierOrder[course.tier] > userTierLevel;
              const isCompleted = course.progress === 100;

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "rounded-xl border bg-card overflow-hidden relative",
                    isCompleted && "border-success/30"
                  )}
                >
                  {/* Course Image Placeholder */}
                  <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-primary/50" />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      {course.tier !== 'student' && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 uppercase text-xs">
                          {course.tier}
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge className="bg-success/20 text-success border-0">
                          <Award className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers className="h-4 w-4" /> {course.lessons} lessons
                      </span>
                    </div>

                    {!isLocked && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-foreground">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}

                    {isLocked ? (
                      <Button className="w-full" variant="outline" disabled>
                        <Lock className="h-4 w-4 mr-2" />
                        Upgrade to Access
                      </Button>
                    ) : isCompleted ? (
                      <Button className="w-full gradient-success text-success-foreground">
                        <Award className="h-4 w-4 mr-2" />
                        Get Certificate
                      </Button>
                    ) : (
                      <Button className="w-full gradient-primary text-primary-foreground">
                        <Play className="h-4 w-4 mr-2" />
                        {course.progress > 0 ? 'Continue' : 'Start Course'}
                      </Button>
                    )}
                  </div>

                  {isLocked && (
                    <div className="absolute inset-0 backdrop-blur-[2px] bg-background/50" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Tools */}
        <TabsContent value="tools" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => {
              const isLocked = tierOrder[tool.tier] > userTierLevel;

              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl border border-border bg-card p-6 relative"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-secondary">
                      <Download className="h-6 w-6 text-primary" />
                    </div>
                    {tool.tier !== 'student' && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 uppercase text-xs">
                        {tool.tier}
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {tool.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>Version: {tool.version}</span>
                    <span>{tool.downloads} downloads</span>
                  </div>

                  {isLocked ? (
                    <Button className="w-full" variant="outline" disabled>
                      <Lock className="h-4 w-4 mr-2" />
                      Upgrade to Download
                    </Button>
                  ) : (
                    <Button className="w-full gradient-primary text-primary-foreground">
                      <Download className="h-4 w-4 mr-2" />
                      Download Files
                    </Button>
                  )}

                  {isLocked && (
                    <div className="absolute inset-0 rounded-xl backdrop-blur-[2px] bg-background/50" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
