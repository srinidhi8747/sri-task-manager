
import { Button } from "@/components/ui/button";
import { SparklesPreview, SparklesPreviewDark, SparklesPreviewColorful } from "@/components/ui/sparkles-demo";
import { Link } from "react-router-dom";

export function SparklesDemo() {
  return (
    <div className="flex flex-col gap-8 p-4 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sparkles Theme Demos</h1>
        <Button asChild variant="outline">
          <Link to="/">Back to Tasks</Link>
        </Button>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Default Sparkles</h2>
          <SparklesPreview />
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Dark Sparkles</h2>
          <SparklesPreviewDark />
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Colorful Sparkles</h2>
          <SparklesPreviewColorful />
        </section>
      </div>
    </div>
  );
}
