import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  GraduationCap, 
  Clock, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Circle,
  ArrowLeft,
  PlayCircle,
  FileText,
  Video
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CourseDetail() {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: [`/api/courses/${id}`],
    enabled: !!id,
  });

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: [`/api/courses/${id}/progress`],
    enabled: !!id,
  });

  const { data: enrollments } = useQuery({
    queryKey: ['/api/enrollments'],
  });

  const enrollMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/courses/${id}/enroll`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/enrollments'] });
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${id}/progress`] });
      toast({
        title: "Enrolled successfully",
        description: "You've been enrolled in this course.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Enrollment failed",
        description: error.message || "Failed to enroll in course",
        variant: "destructive",
      });
    },
  });

  const completeLessonMutation = useMutation({
    mutationFn: (lessonId: string) => apiRequest("POST", `/api/lessons/${lessonId}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${id}/progress`] });
      toast({
        title: "Lesson completed",
        description: "Your progress has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update progress",
        description: error.message || "Failed to mark lesson as complete",
        variant: "destructive",
      });
    },
  });

  const isEnrolled = Array.isArray(enrollments) && enrollments.some((e: any) => e.courseId === id);
  const isCompleted = progress?.progressPercentage === 100;

  if (courseLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 max-w-5xl">
          <Skeleton className="h-8 w-48 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 max-w-5xl">
          <Alert>
            <BookOpen className="h-4 w-4" />
            <AlertDescription>Course not found</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-5xl">
        <Button variant="ghost" className="mb-6" data-testid="button-back-training" asChild>
          <Link href="/training">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Training
          </Link>
        </Button>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                <div className="flex gap-2">
                  <Badge variant="secondary" data-testid="badge-category">
                    {course.category}
                  </Badge>
                  <Badge variant="outline" data-testid="badge-level">
                    {course.level}
                  </Badge>
                  {isCompleted && (
                    <Badge variant="default" data-testid="badge-completed">
                      <Award className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
                {!isEnrolled && (
                  <Button
                    onClick={() => enrollMutation.mutate()}
                    disabled={enrollMutation.isPending}
                    data-testid="button-enroll"
                  >
                    {enrollMutation.isPending ? "Enrolling..." : "Enroll in Course"}
                  </Button>
                )}
              </div>
              <CardTitle className="text-2xl" data-testid="title-course">
                {course.title}
              </CardTitle>
              <CardDescription data-testid="description-course">
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span data-testid="text-duration">{course.duration} hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span data-testid="text-modules">{course.modules?.length || 0} modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span data-testid="text-enrollment">{course.enrollmentCount} enrolled</span>
                </div>
              </div>

              {isEnrolled && progress && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Your Progress</span>
                    <span className="font-medium" data-testid="text-progress">
                      {progress.progressPercentage}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all"
                      style={{ width: `${progress.progressPercentage}%` }}
                      data-testid="progress-bar"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {progress.completedLessons} of {progress.totalLessons} lessons completed
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {course.modules && course.modules.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle data-testid="heading-modules">Course Content</CardTitle>
                <CardDescription>
                  {isEnrolled ? "Click on lessons to mark them as complete" : "Enroll to access course content"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {course.modules.map((module: any, moduleIndex: number) => (
                    <AccordionItem 
                      key={module.id} 
                      value={module.id}
                      data-testid={`accordion-module-${module.id}`}
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                            {moduleIndex + 1}
                          </div>
                          <div className="text-left">
                            <div className="font-medium" data-testid={`title-module-${module.id}`}>
                              {module.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {module.lessons?.length || 0} lessons
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="ml-11 space-y-2">
                          {module.lessons?.map((lesson: any, lessonIndex: number) => {
                            const isLessonComplete = progress?.completedLessons?.includes?.(lesson.id);
                            return (
                              <div
                                key={lesson.id}
                                className="flex items-center gap-3 p-3 rounded-lg hover-elevate"
                                data-testid={`lesson-${lesson.id}`}
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  {lesson.videoUrl ? (
                                    <Video className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <div className="flex-1">
                                    <div className="font-medium text-sm" data-testid={`title-lesson-${lesson.id}`}>
                                      {lesson.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {lesson.duration} min
                                    </div>
                                  </div>
                                </div>
                                {isEnrolled && (
                                  <Button
                                    size="sm"
                                    variant={isLessonComplete ? "outline" : "default"}
                                    onClick={() => !isLessonComplete && completeLessonMutation.mutate(lesson.id)}
                                    disabled={isLessonComplete || completeLessonMutation.isPending}
                                    data-testid={`button-complete-${lesson.id}`}
                                  >
                                    {isLessonComplete ? (
                                      <>
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Completed
                                      </>
                                    ) : (
                                      <>
                                        <Circle className="h-4 w-4 mr-2" />
                                        Mark Complete
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}

          {isCompleted && (
            <Alert className="border-primary bg-primary/5">
              <Award className="h-4 w-4" />
              <AlertDescription>
                Congratulations! You've completed this course. Your certificate is available in your profile.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
