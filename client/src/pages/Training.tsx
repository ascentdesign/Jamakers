import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap, Clock, BookOpen, Award, Users, TrendingUp, PlayCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Training() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { toast } = useToast();

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses'],
    enabled: categoryFilter === "all",
  });

  const { data: filteredCourses, isLoading: filteredLoading } = useQuery({
    queryKey: [`/api/courses?category=${categoryFilter}`],
    enabled: categoryFilter !== "all",
  });

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['/api/enrollments'],
  });

  const displayCourses = categoryFilter === "all" ? courses : filteredCourses;
  const isLoading = categoryFilter === "all" ? coursesLoading : filteredLoading;

  const handleEnroll = async (courseId: string) => {
    try {
      await apiRequest("POST", `/api/courses/${courseId}/enroll`);
      toast({
        title: "Enrolled successfully",
        description: "You've been enrolled in this course.",
      });
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Enrollment failed",
        description: error.message || "Failed to enroll in course",
        variant: "destructive",
      });
    }
  };

  const isEnrolled = (courseId: string) => {
    return Array.isArray(enrollments) && enrollments.some((e: any) => e.courseId === courseId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="heading-training">Training & Education</h1>
          <p className="text-muted-foreground">
            Develop your skills with our comprehensive courses on manufacturing, compliance, and business growth
          </p>
        </div>

        <Tabs defaultValue="catalog" className="space-y-6">
          <TabsList data-testid="tabs-training">
            <TabsTrigger value="catalog" data-testid="tab-catalog">
              <BookOpen className="h-4 w-4 mr-2" />
              Course Catalog
            </TabsTrigger>
            <TabsTrigger value="enrolled" data-testid="tab-enrolled">
              <GraduationCap className="h-4 w-4 mr-2" />
              My Courses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-6">
            <div className="flex items-center gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-64" data-testid="select-category">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="compliance">Compliance & Certification</SelectItem>
                  <SelectItem value="business">Business Development</SelectItem>
                  <SelectItem value="quality">Quality Control</SelectItem>
                  <SelectItem value="export">Export & Trade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !Array.isArray(displayCourses) || displayCourses.length === 0 ? (
              <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertDescription>
                  No courses available in this category. Check back soon for new training opportunities.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayCourses.map((course: any) => (
                  <Card key={course.id} className="hover-elevate" data-testid={`card-course-${course.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="secondary" data-testid={`badge-category-${course.id}`}>
                          {course.category}
                        </Badge>
                        <Badge variant="outline" data-testid={`badge-level-${course.id}`}>
                          {course.level}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg" data-testid={`title-course-${course.id}`}>
                        {course.title}
                      </CardTitle>
                      <CardDescription data-testid={`description-course-${course.id}`}>
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span data-testid={`duration-${course.id}`}>{course.duration}h</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span data-testid={`enrollment-${course.id}`}>{course.enrollmentCount}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/training/${course.id}`}>
                          <Button variant="outline" size="sm" data-testid={`button-view-${course.id}`}>
                            View Details
                          </Button>
                        </Link>
                        {isEnrolled(course.id) ? (
                          <Badge variant="default" data-testid={`badge-enrolled-${course.id}`}>
                            <Award className="h-3 w-3 mr-1" />
                            Enrolled
                          </Badge>
                        ) : (
                          <Button
                            onClick={() => handleEnroll(course.id)}
                            size="sm"
                            data-testid={`button-enroll-${course.id}`}
                          >
                            Enroll Now
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="enrolled" className="space-y-6">
            {enrollmentsLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !Array.isArray(enrollments) || enrollments.length === 0 ? (
              <Alert>
                <GraduationCap className="h-4 w-4" />
                <AlertDescription>
                  You haven't enrolled in any courses yet. Browse the catalog to get started with your learning journey.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {enrollments.map((enrollment: any) => (
                  <Card key={enrollment.id} className="hover-elevate" data-testid={`card-enrollment-${enrollment.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="secondary" data-testid={`badge-enrolled-category-${enrollment.id}`}>
                          {enrollment.course?.category}
                        </Badge>
                        {enrollment.progressPercentage === 100 && (
                          <Badge variant="default" data-testid={`badge-completed-${enrollment.id}`}>
                            <Award className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg" data-testid={`title-enrolled-${enrollment.id}`}>
                        {enrollment.course?.title}
                      </CardTitle>
                      <CardDescription data-testid={`description-enrolled-${enrollment.id}`}>
                        Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium" data-testid={`progress-${enrollment.id}`}>
                            {enrollment.progressPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${enrollment.progressPercentage}%` }}
                            data-testid={`progress-bar-${enrollment.id}`}
                          />
                        </div>
                      </div>

                      <Link href={`/training/${enrollment.courseId}`}>
                        <Button className="w-full" data-testid={`button-continue-${enrollment.id}`}>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          {enrollment.progressPercentage === 0 ? "Start Course" : "Continue Learning"}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
