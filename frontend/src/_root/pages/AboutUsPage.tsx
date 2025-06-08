import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui//crazxy-ui/badge";
import {
  Code2,
  Target,
  Users,
  Trophy,
  BookOpen,
  Zap,
  Globe,
  Heart,
  CheckCircle,
  Star,
  TrendingUp,
  Shield,
  GitBranch,
  Clock,
  Code,
  Database,
  Save,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutUsPage() {
  return (
    <div className="from-background to-muted/20 mx-auto min-h-screen max-w-7xl bg-gradient-to-b">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="bg-grid-pattern absolute inset-0 opacity-5"></div>
        <div className="relative container px-4 md:px-6">
          <div className="mx-auto flex max-w-4xl flex-col items-center space-y-8 text-center">
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
              <Code2 className="mr-2 h-4 w-4" />
              About Leet Master
            </Badge>
            <h1 className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl">
              Empowering Developers to Excel
            </h1>
            <p className="text-muted-foreground max-w-2xl text-xl leading-relaxed">
              We're building the next generation coding platform where
              developers sharpen their skills, solve challenging problems, and
              prepare for their dream careers in tech.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/">
                <Button size="lg" className="px-8">
                  Start Your Journey
                </Button>
              </Link>
              <Link to="/problems">
                <Button size="lg" variant="outline" className="px-8">
                  Explore Problems
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Target className="mr-2 h-4 w-4" />
                  Our Mission
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Making Coding Excellence Accessible to Everyone
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Our mission is to democratize coding education and create a
                  platform where developers of all skill levels can grow, learn,
                  and achieve their full potential. We believe that with the
                  right tools and community, anyone can master the art of
                  programming.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-semibold">Quality First</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Curated problems and solutions
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">Community Driven</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Learn together, grow together
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="from-primary/20 to-secondary/20 absolute inset-0 rounded-2xl bg-gradient-to-r blur-3xl"></div>
              <img
                src="/images/problem.webp"
                alt="Mission illustration"
                width={500}
                height={400}
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="mb-16 space-y-4 text-center">
            <Badge variant="outline" className="px-4 py-2">
              <Zap className="mr-2 h-4 w-4" />
              Platform Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Our comprehensive platform provides all the tools and resources
              you need to master coding interviews and beyond.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Code2 className="text-primary h-6 w-6" />
                </div>
                <CardTitle>1000+ Coding Problems</CardTitle>
                <CardDescription>
                  Carefully curated problems from easy to expert level, covering
                  all major algorithms and data structures.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <Trophy className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle>Real-time Contests</CardTitle>
                <CardDescription>
                  Participate in weekly contests and compete with developers
                  worldwide to test your skills.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle>Detailed Solutions</CardTitle>
                <CardDescription>
                  Step-by-step explanations and multiple solution approaches for
                  every problem.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Monitor your improvement with detailed analytics and
                  personalized learning paths.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                  <Users className="h-6 w-6 text-orange-500" />
                </div>
                <CardTitle>Community Forum</CardTitle>
                <CardDescription>
                  Connect with fellow developers, share solutions, and learn
                  from each other.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
                  <Shield className="h-6 w-6 text-red-500" />
                </div>
                <CardTitle>Interview Prep</CardTitle>
                <CardDescription>
                  Mock interviews and company-specific problem sets to ace your
                  technical interviews.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10">
                  <MessageSquare className="h-6 w-6 text-cyan-500" />
                </div>
                <CardTitle>Discussion Forums</CardTitle>
                <CardDescription>
                  Engage in meaningful discussions, ask questions, and share
                  insights with the coding community.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
                  <Save className="h-6 w-6 text-yellow-500" />
                </div>
                <CardTitle>Auto-Save Code</CardTitle>
                <CardDescription>
                  Never lose your progress! Your code is automatically saved as
                  you type, ensuring your work is always protected.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10">
                  <Database className="h-6 w-6 text-indigo-500" />
                </div>
                <CardTitle>Complete Record Tracking</CardTitle>
                <CardDescription>
                  Track every submission, view your coding history, and analyze
                  your performance patterns over time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-500/10">
                  <Code className="h-6 w-6 text-pink-500" />
                </div>
                <CardTitle>Multi-Language Support</CardTitle>
                <CardDescription>
                  Code in your preferred language with support for Python, Java,
                  C++, JavaScript, and 15+ more languages.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Clock className="h-6 w-6 text-emerald-500" />
                </div>
                <CardTitle>Time Complexity Analysis</CardTitle>
                <CardDescription>
                  Get detailed analysis of your solution's time and space
                  complexity with optimization suggestions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/10">
                  <GitBranch className="h-6 w-6 text-violet-500" />
                </div>
                <CardTitle>Version Control</CardTitle>
                <CardDescription>
                  Keep track of different versions of your solutions and compare
                  your approaches over time.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
      {/* Advanced Features Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="mb-16 space-y-4 text-center">
            <Badge variant="outline" className="px-4 py-2">
              <Database className="mr-2 h-4 w-4" />
              Advanced Tracking
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Never Lose Progress, Track Everything
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Our advanced tracking system ensures every keystroke, submission,
              and achievement is recorded and analyzed.
            </p>
          </div>

          <div className="mb-16 grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Auto-Save & Recovery</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your code is automatically saved every few seconds. Never
                  worry about losing your work due to browser crashes or
                  accidental closures.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Real-time Auto-Save</p>
                    <p className="text-muted-foreground text-sm">
                      Code saved automatically every 3 seconds
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Session Recovery</p>
                    <p className="text-muted-foreground text-sm">
                      Resume exactly where you left off
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="mt-1 h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Multiple Drafts</p>
                    <p className="text-muted-foreground text-sm">
                      Save multiple solution approaches
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/20 to-blue-500/20 blur-3xl"></div>
              <img
                src="/images/editor.webp"
                alt="Auto-save feature illustration"
                width={500}
                height={400}
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"></div>
              <img
                src="/images/profile.webp"
                alt="Analytics dashboard illustration"
                width={500}
                height={400}
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
            <div className="order-1 space-y-6 lg:order-2">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Comprehensive Analytics</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get detailed insights into your coding journey with
                  comprehensive analytics and performance tracking.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="mt-1 h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Submission History</p>
                    <p className="text-muted-foreground text-sm">
                      Complete record of all your attempts and solutions
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Target className="mt-1 h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Performance Metrics</p>
                    <p className="text-muted-foreground text-sm">
                      Track accuracy, speed, and improvement over time
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Trophy className="mt-1 h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium">Achievement System</p>
                    <p className="text-muted-foreground text-sm">
                      Unlock badges and milestones as you progress
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="mb-16 space-y-4 text-center">
            <Badge variant="secondary" className="px-4 py-2">
              <Heart className="mr-2 h-4 w-4" />
              Our Values
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              What Drives Us Forward
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4 text-center">
              <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                <Globe className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Accessibility</h3>
              <p className="text-muted-foreground">
                Making quality coding education accessible to developers
                worldwide, regardless of background or location.
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <Star className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold">Excellence</h3>
              <p className="text-muted-foreground">
                Maintaining the highest standards in problem quality, platform
                performance, and user experience.
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold">Community</h3>
              <p className="text-muted-foreground">
                Fostering a supportive environment where developers help each
                other grow and succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Join Thousands of Successful Developers
            </h2>
            <p className="mx-auto max-w-2xl text-lg opacity-90">
              Our platform has helped developers land jobs at top tech companies
              worldwide.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="space-y-2 text-center">
              <div className="text-4xl font-bold md:text-5xl">50K+</div>
              <div className="text-sm opacity-90">Active Users</div>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-4xl font-bold md:text-5xl">1M+</div>
              <div className="text-sm opacity-90">Problems Solved</div>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-4xl font-bold md:text-5xl">500+</div>
              <div className="text-sm opacity-90">Companies</div>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-4xl font-bold md:text-5xl">95%</div>
              <div className="text-sm opacity-90">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Ready to Start Your Coding Journey?
            </h2>
            <p className="text-muted-foreground text-lg">
              Join our community of passionate developers and take your
              programming skills to the next level.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/problems">
                <Button size="lg" className="px-8">
                  Get Started Free
                </Button>
              </Link>
            </div>
            <p className="text-muted-foreground text-sm">
              No credit card required • Free for all users
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
