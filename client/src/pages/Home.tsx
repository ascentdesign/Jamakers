import { useAuth } from "@/hooks/useAuth";
import { Card as ShadcnCard, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, MessageSquare, FileText, Users, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Card, View, Text } from "reshaped";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="bg-primary text-primary-foreground py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display font-bold text-4xl" data-testid="heading-welcome">
            Welcome back, {user?.firstName || "there"}!
          </h1>
          <p className="text-lg opacity-90">
            Here's what's happening with your manufacturing network
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <View gap={8}>
          {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding={4} data-testid="metric-card-projects">
          <View gap={3}>
            <View direction="row" justify="space-between" align="center">
              <Text variant="body-3" weight="medium" color="neutral-faded">Active Projects</Text>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </View>
            <View gap={1}>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2</span> from last month
              </p>
            </View>
          </View>
        </Card>

        <Card padding={4} data-testid="metric-card-messages">
          <View gap={3}>
            <View direction="row" justify="space-between" align="center">
              <Text variant="body-3" weight="medium" color="neutral-faded">Unread Messages</Text>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </View>
            <View gap={1}>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                3 new today
              </p>
            </View>
          </View>
        </Card>

        <Card padding={4} data-testid="metric-card-connections">
          <View gap={3}>
            <View direction="row" justify="space-between" align="center">
              <Text variant="body-3" weight="medium" color="neutral-faded">Connections</Text>
              <Users className="h-4 w-4 text-muted-foreground" />
            </View>
            <View gap={3}>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+7</span> this week
              </p>
            </View>
          </View>
        </Card>

        <Card padding={4} data-testid="metric-card-growth">
          <View gap={3}>
            <View direction="row" justify="space-between" align="center">
              <Text variant="body-3" weight="medium" color="neutral-faded">Profile Views</Text>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </View>
            <View gap={1}>
              <div className="text-2xl font-bold">287</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last week
              </p>
            </View>
          </View>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <ShadcnCard className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-md hover-elevate cursor-pointer">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      New RFQ response from Caribbean Manufacturing Ltd
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Response to "Custom Packaging Solutions" - 2 hours ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </ShadcnCard>

        {/* Quick Actions */}
        <ShadcnCard>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {user?.role === "brand" && (
              <>
                <Button
                  variant="default"
                  className="w-full justify-between hover-elevate bg-green-600 text-white hover:bg-green-700"
                  asChild
                  data-testid="button-create-rfq"
                >
                  <Link href="/rfqs/new">
                    Create RFP
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="default"
                  className="w-full justify-between hover-elevate bg-green-600 text-white hover:bg-green-700"
                  asChild
                  data-testid="button-find-manufacturers"
                >
                  <Link href="/manufacturers">
                    Find Manufacturers
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}

            {user?.role === "manufacturer" && (
              <>
                <Button
                  variant="default"
                  className="w-full justify-between hover-elevate bg-green-600 text-white hover:bg-green-700"
                  asChild
                  data-testid="button-view-opportunities"
                >
                  <Link href="/opportunities">
                    View Opportunities
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="default"
                  className="w-full justify-between hover-elevate bg-green-600 text-white hover:bg-green-700"
                  asChild
                  data-testid="button-update-profile"
                >
                  <Link href="/manufacturer/profile">
                    Update Profile
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}

            <Button
              variant="default"
              className="w-full justify-between hover-elevate bg-green-600 text-white hover:bg-green-700"
              asChild
              data-testid="button-view-messages"
            >
              <Link href="/messages">
                View Messages
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              variant="default"
              className="w-full justify-between hover-elevate bg-green-600 text-white hover:bg-green-700"
              asChild
              data-testid="button-browse-resources"
            >
              <Link href="/resources">
                Browse Resources
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </ShadcnCard>
      </div>
        </View>
      </div>
    </div>
  );
}
