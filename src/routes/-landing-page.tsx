import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { CalendarClock, FileSignature, Sparkles, FolderLock } from "lucide-react";

export function LandingPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 p-6">
      <div className="text-center">
        <img src="/logo.jpg" alt="CounselQ Logo" className="mx-auto h-32 object-contain" />
        <p className="mt-2 text-lg text-muted-foreground">Your courtroom command centre for Indian legal practice.</p>
        <p className="mt-1 text-sm text-muted-foreground">One workspace connecting court schedules, registry portals, legal research and case preparation.</p>
        <p className="mt-2 text-xs text-muted-foreground">DEMO ENVIRONMENT</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-panel p-4 flex flex-col items-start">
          <div className="flex items-center mb-2">
            <CalendarClock className="h-5 w-5 mr-2 text-primary" />
            <h3 className="font-medium">Cause List</h3>
          </div>
          <p className="text-xs text-muted-foreground">Find and monitor today's matters.</p>
        </Card>
        <Card className="shadow-panel p-4 flex flex-col items-start">
          <div className="flex items-center mb-2">
            <FileSignature className="h-5 w-5 mr-2 text-primary" />
            <h3 className="font-medium">Registry</h3>
          </div>
          <p className="text-xs text-muted-foreground">Navigate filing and official registry portals.</p>
        </Card>
        <Card className="shadow-panel p-4 flex flex-col items-start">
          <div className="flex items-center mb-2">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            <h3 className="font-medium">Research</h3>
          </div>
          <p className="text-xs text-muted-foreground">Search, verify, annotate and build arguments.</p>
        </Card>
        <Card className="shadow-panel p-4 flex flex-col items-start">
          <div className="flex items-center mb-2">
            <FolderLock className="h-5 w-5 mr-2 text-primary" />
            <h3 className="font-medium">Case Desk</h3>
          </div>
          <p className="text-xs text-muted-foreground">Prepare, organize and record hearings.</p>
        </Card>
      </div>
      <div className="flex justify-center mt-6">
        <Link to="/causelist" className="inline-flex items-center px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition">
          START WORKING
        </Link>
      </div>
    </div>
  );
}
