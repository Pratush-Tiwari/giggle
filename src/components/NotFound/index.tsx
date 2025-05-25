import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LogIn, Search } from 'lucide-react';

interface NotFoundProps {
  readonly title?: string;
  readonly description?: string;
  readonly showSearchSuggestion?: boolean;
}

export const NotFound = memo<NotFoundProps>(
  ({
    title = 'Page Not Found',
    description = "Sorry, we couldn't find the page you're looking for.",
    showSearchSuggestion = false,
  }) => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardContent className="p-8 text-center">
            {/* Large 404 */}
            <div className="mb-8">
              <h1 className="text-9xl font-bold text-muted-foreground/30 select-none">404</h1>
            </div>

            {/* Title and Description */}
            <div className="mb-8 space-y-4">
              <h2 className="text-3xl font-bold text-foreground">{title}</h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">{description}</p>
            </div>

            {/* Search Suggestion */}
            {showSearchSuggestion && (
              <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Search className="h-4 w-4" />
                  <span className="text-sm">Try checking the URL or use the navigation below</span>
                </div>
              </div>
            )}

            <Separator className="my-8" />

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline" size="lg" className="flex items-center gap-2">
                  <Link to="/login">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-8 text-sm text-muted-foreground">
              <p>If you believe this is an error, please contact support </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  },
);

NotFound.displayName = 'NotFound';
