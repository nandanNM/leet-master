import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Code2, Star } from "lucide-react";
import { Badge } from "./ui/crazxy-ui/badge";

interface ApiReviewData {
  review: string;
  language: string;
  timestamp: string;
}

export function ReviewDisplay({ review, language, timestamp }: ApiReviewData) {
  console.log("Review:", review);
  const parseReview = (reviewText: string) => {
    const sections = reviewText.split("\n\n");
    const parsed = {
      correctness: "",
      performance: "",
      codeQuality: "",
      edgeCases: "",
      overallRating: "",
      recommendations: "",
    };

    sections.forEach((section) => {
      if (section.includes("**Correctness:**")) {
        parsed.correctness = section.replace("**Correctness:**", "").trim();
      } else if (section.includes("**Performance:**")) {
        parsed.performance = section.replace("**Performance:**", "").trim();
      } else if (section.includes("**Code Quality:**")) {
        parsed.codeQuality = section.replace("**Code Quality:**", "").trim();
      } else if (section.includes("**Edge Cases:**")) {
        parsed.edgeCases = section.replace("**Edge Cases:**", "").trim();
      } else if (section.includes("**Overall Code Quality:**")) {
        parsed.overallRating = section
          .replace("**Overall Code Quality:**", "")
          .trim();
      }
    });

    return parsed;
  };

  // Extract star rating from the overall rating text
  const extractStarRating = (ratingText: string) => {
    const match = ratingText.match(/(\d+)\/5/);
    return match ? parseInt(match[1]) : 0;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-current text-yellow-400" : "text-muted-foreground"}`}
      />
    ));
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatBulletPoints = (text: string) => {
    return text
      .split("- ")
      .filter((point) => point.trim())
      .map((point, index) => (
        <li
          key={index}
          className="text-muted-foreground mb-2 text-sm leading-relaxed"
        >
          <span className="bg-primary/60 mt-2 mr-3 inline-block h-2 w-2 flex-shrink-0 rounded-full"></span>
          {point.trim()}
        </li>
      ));
  };

  const parsedReview = parseReview(review);
  const starRating = extractStarRating(parsedReview.overallRating);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code2 className="text-primary h-5 w-5" />
              Code Review Results
            </CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">{language}</Badge>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                {formatDate(timestamp)}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overall Rating */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-primary">Overall Code Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex">{renderStars(starRating)}</div>
            <Badge variant="outline" className="border-primary text-primary">
              {starRating}/5 stars
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {parsedReview.overallRating
              .replace(/★★★☆☆ \(\d+\/5 stars\)/, "")
              .replace("- ", "")
              .trim()}
          </p>
        </CardContent>
      </Card>

      {/* Analysis Sections */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Correctness */}
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-400">
              Correctness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {formatBulletPoints(parsedReview.correctness)}
            </ul>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="text-blue-700 dark:text-blue-400">
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {formatBulletPoints(parsedReview.performance)}
            </ul>
          </CardContent>
        </Card>

        {/* Code Quality */}
        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
          <CardHeader>
            <CardTitle className="text-purple-700 dark:text-purple-400">
              Code Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {formatBulletPoints(parsedReview.codeQuality)}
            </ul>
          </CardContent>
        </Card>

        {/* Edge Cases */}
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="text-orange-700 dark:text-orange-400">
              Edge Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {formatBulletPoints(parsedReview.edgeCases)}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
